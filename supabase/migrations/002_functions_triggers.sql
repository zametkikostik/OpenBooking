-- ============================================
-- OPENBOOKING FUNCTIONS & TRIGGERS
-- ============================================
-- Business logic, automation, and security
-- ============================================

-- ============================================
-- UTILITY FUNCTIONS
-- ============================================

-- Generate slug from text
CREATE OR REPLACE FUNCTION generate_slug(text)
RETURNS TEXT AS $$
    SELECT LOWER(REGEXP_REPLACE($1, '[^a-zA-Z0-9]+', '-', 'g'));
$$ LANGUAGE SQL IMMUTABLE;

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- PROFILE FUNCTIONS
-- ============================================

-- Create profile trigger (called after user signup)
CREATE OR REPLACE FUNCTION create_profile_for_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO profiles (id, email, first_name, last_name)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'first_name',
        NEW.raw_user_meta_data->>'last_name'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create host profile
CREATE OR REPLACE FUNCTION create_host_profile(
    p_user_id UUID,
    p_business_name TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    v_host_id UUID;
BEGIN
    -- Ensure user exists
    IF NOT EXISTS (SELECT 1 FROM profiles WHERE id = p_user_id) THEN
        RAISE EXCEPTION 'User not found';
    END IF;
    
    -- Update user role to host
    UPDATE profiles SET role = 'host' WHERE id = p_user_id;
    
    -- Create host profile
    INSERT INTO host_profiles (id, business_name)
    VALUES (p_user_id, p_business_name)
    RETURNING id INTO v_host_id;
    
    RETURN v_host_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update reputation score
CREATE OR REPLACE FUNCTION update_reputation_score(p_user_id UUID)
RETURNS VOID AS $$
DECLARE
    v_avg_rating DECIMAL(5,2);
    v_total_reviews INTEGER;
    v_total_bookings INTEGER;
BEGIN
    -- Calculate average rating from reviews
    SELECT COALESCE(AVG(rating), 0), COUNT(*)
    INTO v_avg_rating, v_total_reviews
    FROM reviews
    WHERE reviewee_id = p_user_id AND is_public = TRUE;
    
    -- Get total bookings
    SELECT COUNT(*)
    INTO v_total_bookings
    FROM bookings
    WHERE guest_id = p_user_id OR host_id = p_user_id;
    
    -- Update profile
    UPDATE profiles
    SET 
        reputation_score = v_avg_rating,
        total_reviews = v_total_reviews,
        total_bookings = v_total_bookings,
        updated_at = NOW()
    WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- BOOKING STATE MACHINE
-- ============================================

-- Booking state transition function
CREATE OR REPLACE FUNCTION transition_booking_state(
    p_booking_id UUID,
    p_new_status booking_status,
    p_user_id UUID DEFAULT NULL,
    p_reason TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
    v_current_status booking_status;
    v_host_id UUID;
    v_guest_id UUID;
    v_allowed_transitions booking_status[];
    v_user_role user_role;
BEGIN
    -- Get current booking state
    SELECT status, host_id, guest_id
    INTO v_current_status, v_host_id, v_guest_id
    FROM bookings
    WHERE id = p_booking_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Booking not found';
    END IF;
    
    -- Get user role
    SELECT role INTO v_user_role FROM profiles WHERE id = p_user_id;
    
    -- Define allowed transitions
    CASE p_new_status
        WHEN 'payment_locked' THEN
            v_allowed_transitions := ARRAY['pending'::booking_status];
        WHEN 'confirmed' THEN
            v_allowed_transitions := ARRAY['payment_locked'::booking_status];
        WHEN 'checked_in' THEN
            v_allowed_transitions := ARRAY['confirmed'::booking_status];
        WHEN 'completed' THEN
            v_allowed_transitions := ARRAY['checked_in'::booking_status];
        WHEN 'settled' THEN
            v_allowed_transitions := ARRAY['completed'::booking_status];
        WHEN 'cancelled' THEN
            v_allowed_transitions := ARRAY['pending'::booking_status, 'payment_locked'::booking_status, 'confirmed'::booking_status];
        WHEN 'disputed' THEN
            v_allowed_transitions := ARRAY['checked_in'::booking_status, 'completed'::booking_status];
        WHEN 'refunded' THEN
            v_allowed_transitions := ARRAY['cancelled'::booking_status, 'disputed'::booking_status];
        ELSE
            RAISE EXCEPTION 'Invalid target status';
    END CASE;
    
    -- Check if transition is allowed
    IF NOT (v_current_status = ANY(v_allowed_transitions)) THEN
        RAISE EXCEPTION 'Invalid state transition from % to %', v_current_status, p_new_status;
    END IF;
    
    -- CRITICAL: After check-in, only host or system can change state
    IF v_current_status = 'checked_in' AND p_new_status NOT IN ('completed', 'disputed') THEN
        IF v_user_role != 'admin' AND v_user_id != v_host_id THEN
            RAISE EXCEPTION 'Only host or admin can modify checked-in booking';
        END IF;
    END IF;
    
    -- Update booking
    UPDATE bookings
    SET 
        status = p_new_status,
        updated_at = NOW(),
        confirmed_at = CASE WHEN p_new_status = 'confirmed' THEN NOW() ELSE confirmed_at END,
        checked_in_at = CASE WHEN p_new_status = 'checked_in' THEN NOW() ELSE checked_in_at END,
        completed_at = CASE WHEN p_new_status = 'completed' THEN NOW() ELSE completed_at END,
        cancelled_by = CASE WHEN p_new_status = 'cancelled' THEN p_user_id ELSE cancelled_by END,
        cancelled_at = CASE WHEN p_new_status = 'cancelled' THEN NOW() ELSE cancelled_at END,
        cancellation_reason = p_reason
    WHERE id = p_booking_id;
    
    -- Log state transition
    INSERT INTO booking_state_history (
        booking_id,
        from_status,
        to_status,
        triggered_by,
        triggered_by_role,
        reason
    ) VALUES (
        p_booking_id,
        v_current_status,
        p_new_status,
        p_user_id,
        v_user_role::text,
        p_reason
    );
    
    -- Auto-release escrow on completion
    IF p_new_status = 'completed' THEN
        UPDATE bookings
        SET 
            escrow_released_at = NOW(),
            escrow_released_amount = escrow_amount,
            updated_at = NOW()
        WHERE id = p_booking_id;
    END IF;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create booking with escrow
CREATE OR REPLACE FUNCTION create_booking(
    p_property_id UUID,
    p_guest_id UUID,
    p_check_in_date DATE,
    p_check_out_date DATE,
    p_number_of_guests INTEGER,
    p_payment_method payment_method
)
RETURNS UUID AS $$
DECLARE
    v_booking_id UUID;
    v_property properties;
    v_host_id UUID;
    v_nights INTEGER;
    v_subtotal DECIMAL(12,2);
    v_total DECIMAL(12,2);
BEGIN
    -- Get property
    SELECT * INTO v_property
    FROM properties
    WHERE id = p_property_id AND status = 'active';
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Property not found or inactive';
    END IF;
    
    -- Validate dates
    IF p_check_out_date <= p_check_in_date THEN
        RAISE EXCEPTION 'Check-out date must be after check-in date';
    END IF;
    
    -- Calculate nights
    v_nights := p_check_out_date - p_check_in_date;
    
    -- Calculate pricing
    v_subtotal := v_property.base_price * v_nights;
    v_total := v_subtotal + v_property.cleaning_fee + v_property.service_fee;
    
    -- Get host
    SELECT id INTO v_host_id FROM host_profiles WHERE id = v_property.host_id;
    
    -- Create booking
    INSERT INTO bookings (
        property_id,
        guest_id,
        host_id,
        check_in_date,
        check_out_date,
        nights,
        number_of_guests,
        subtotal,
        cleaning_fee,
        service_fee,
        total_amount,
        currency,
        payment_method,
        escrow_amount
    ) VALUES (
        p_property_id,
        p_guest_id,
        v_property.host_id,
        p_check_in_date,
        p_check_out_date,
        v_nights,
        p_number_of_guests,
        v_subtotal,
        v_property.cleaning_fee,
        v_property.service_fee,
        v_total,
        v_property.currency,
        p_payment_method,
        v_total -- Full amount held in escrow
    )
    RETURNING id INTO v_booking_id;
    
    -- Log initial state
    INSERT INTO booking_state_history (
        booking_id,
        from_status,
        to_status,
        triggered_by,
        reason
    ) VALUES (
        v_booking_id,
        NULL,
        'pending',
        p_guest_id,
        'Booking created'
    );
    
    -- Update property stats
    UPDATE properties
    SET booking_count = booking_count + 1
    WHERE id = p_property_id;
    
    RETURN v_booking_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- PAYMENT FUNCTIONS
-- ============================================

-- Process payment
CREATE OR REPLACE FUNCTION process_payment(
    p_booking_id UUID,
    p_payment_method payment_method,
    p_gateway_reference TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
    v_booking bookings;
    v_payment_id UUID;
BEGIN
    -- Get booking
    SELECT * INTO v_booking
    FROM bookings
    WHERE id = p_booking_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Booking not found';
    END IF;
    
    -- Create payment record
    INSERT INTO payments (
        booking_id,
        user_id,
        amount,
        currency,
        fee_amount,
        net_amount,
        method,
        status,
        gateway_reference
    ) VALUES (
        p_booking_id,
        v_booking.guest_id,
        v_booking.total_amount,
        v_booking.currency,
        v_booking.service_fee,
        v_booking.total_amount - v_booking.service_fee,
        p_payment_method,
        'completed',
        p_gateway_reference
    )
    RETURNING id INTO v_payment_id;
    
    -- Transition booking to payment_locked
    PERFORM transition_booking_state(
        p_booking_id,
        'payment_locked',
        v_booking.guest_id,
        'Payment processed successfully'
    );
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Release escrow to host
CREATE OR REPLACE FUNCTION release_escrow(
    p_booking_id UUID
)
RETURNS BOOLEAN AS $$
DECLARE
    v_booking bookings;
    v_payout_id UUID;
BEGIN
    -- Get booking
    SELECT * INTO v_booking
    FROM bookings
    WHERE id = p_booking_id AND status = 'completed';
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Booking not found or not completed';
    END IF;
    
    -- Check if already released
    IF v_booking.escrow_released_at IS NOT NULL THEN
        RAISE EXCEPTION 'Escrow already released';
    END IF;
    
    -- Create payout to host
    INSERT INTO payouts (
        host_id,
        booking_id,
        amount,
        currency,
        fee_amount,
        net_amount,
        status
    ) VALUES (
        v_booking.host_id,
        p_booking_id,
        v_booking.escrow_amount,
        v_booking.currency,
        v_booking.service_fee,
        v_booking.escrow_amount - v_booking.service_fee,
        'pending'
    )
    RETURNING id INTO v_payout_id;
    
    -- Transition to settled
    PERFORM transition_booking_state(
        p_booking_id,
        'settled',
        NULL,
        'Escrow released to host'
    );
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- PROPERTY FUNCTIONS
-- ============================================

-- Create property
CREATE OR REPLACE FUNCTION create_property(
    p_host_id UUID,
    p_title TEXT,
    p_description TEXT,
    p_property_type property_type,
    p_country TEXT,
    p_city TEXT,
    p_base_price DECIMAL,
    p_guests INTEGER,
    p_bedrooms INTEGER DEFAULT 0,
    p_beds INTEGER DEFAULT 0,
    p_bathrooms INTEGER DEFAULT 0
)
RETURNS UUID AS $$
DECLARE
    v_property_id UUID;
    v_slug TEXT;
BEGIN
    -- Generate slug
    v_slug := generate_slug(p_title) || '-' || LEFT(uuid_generate_v4()::text, 8);
    
    -- Create property
    INSERT INTO properties (
        host_id,
        title,
        description,
        property_type,
        country,
        city,
        base_price,
        guests,
        bedrooms,
        beds,
        bathrooms,
        slug,
        status
    ) VALUES (
        p_host_id,
        p_title,
        p_description,
        p_property_type,
        p_country,
        p_city,
        p_base_price,
        p_guests,
        p_bedrooms,
        p_beds,
        p_bathrooms,
        v_slug,
        'active'
    )
    RETURNING id INTO v_property_id;
    
    -- Update host stats
    UPDATE host_profiles
    SET 
        total_properties = total_properties + 1,
        updated_at = NOW()
    WHERE id = p_host_id;
    
    RETURN v_property_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- REAL-TIME METRICS FUNCTIONS
-- ============================================

-- Update active bookings metric
CREATE OR REPLACE FUNCTION update_active_bookings_metric()
RETURNS VOID AS $$
DECLARE
    v_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO v_count
    FROM bookings
    WHERE status IN ('checked_in', 'completed');
    
    INSERT INTO real_time_metrics (metric_type, value)
    VALUES ('active_bookings', v_count);
END;
$$ LANGUAGE plpgsql;

-- Update TVL (Total Value Locked) metric
CREATE OR REPLACE FUNCTION update_tvl_metric()
RETURNS VOID AS $$
DECLARE
    v_tvl DECIMAL(18,2);
BEGIN
    SELECT COALESCE(SUM(escrow_amount), 0) INTO v_tvl
    FROM bookings
    WHERE status IN ('payment_locked', 'confirmed', 'checked_in');
    
    INSERT INTO real_time_metrics (metric_type, value, currency)
    VALUES ('tvl', v_tvl, 'USD');
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- TRIGGERS
-- ============================================

-- Auto-update timestamps
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_host_profiles_updated_at
    BEFORE UPDATE ON host_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_properties_updated_at
    BEFORE UPDATE ON properties
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at
    BEFORE UPDATE ON bookings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ai_content_updated_at
    BEFORE UPDATE ON ai_content
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_seo_pages_updated_at
    BEFORE UPDATE ON seo_pages
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Auto-create profile on user signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION create_profile_for_user();

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE host_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
    ON profiles FOR SELECT
    USING (TRUE);

CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id);

-- Properties policies
CREATE POLICY "Active properties are viewable by everyone"
    ON properties FOR SELECT
    USING (status = 'active');

CREATE POLICY "Hosts can manage own properties"
    ON properties FOR ALL
    USING (host_id = (
        SELECT id FROM host_profiles WHERE id = auth.uid()
    ));

-- Bookings policies
CREATE POLICY "Users can view own bookings"
    ON bookings FOR SELECT
    USING (
        guest_id = auth.uid() OR 
        host_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role IN ('admin', 'moderator')
        )
    );

CREATE POLICY "Guests can create bookings"
    ON bookings FOR INSERT
    WITH CHECK (guest_id = auth.uid());

-- Notifications policies
CREATE POLICY "Users can view own notifications"
    ON notifications FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications"
    ON notifications FOR UPDATE
    USING (user_id = auth.uid());

-- ============================================
-- SEED DATA
-- ============================================

-- Insert admin user (will be created via auth in production)
-- This is for local development only
DO $$
BEGIN
    -- Note: Actual admin user should be created via Supabase Auth
    -- This is just a placeholder for local development
    RAISE NOTICE 'Admin user should be created via Supabase Auth dashboard';
END $$;
