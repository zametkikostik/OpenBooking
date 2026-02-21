-- OpenBooking AGI Platform: Initial Schema
-- Trust Economy Protocol + Web3 Finance Infrastructure

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- ENUMS
-- ============================================

CREATE TYPE user_role AS ENUM ('client', 'host', 'admin');
CREATE TYPE booking_status AS ENUM ('pending', 'payment_locked', 'checked_in', 'completed', 'settled', 'cancelled');
CREATE TYPE payment_method AS ENUM ('usdt', 'usdc', 'eth', 'openbooking_token', 'a7a5_stablecoin', 'sbp', 'sepa', 'mir', 'yookassa', 'klarna', 'epay_bg', 'borica', 'adyen');
CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');
CREATE TYPE currency AS ENUM ('USD', 'EUR', 'RUB', 'BGN', 'GBP', 'ETH', 'USDT', 'USDC', 'A7A5', 'OPENBOOKING');

-- ============================================
-- CORE TABLES
-- ============================================

-- Users / Profiles
CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    role user_role DEFAULT 'client',
    phone TEXT,
    country TEXT,
    language TEXT DEFAULT 'en',
    kyc_verified BOOLEAN DEFAULT FALSE,
    kyc_data JSONB,
    reputation_score DECIMAL(5,2) DEFAULT 0.00,
    total_bookings INTEGER DEFAULT 0,
    total_revenue DECIMAL(15,2) DEFAULT 0.00,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Properties
CREATE TABLE properties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    host_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    title JSONB NOT NULL, -- Multilingual: {"en": "...", "ru": "..."}
    description JSONB NOT NULL,
    address JSONB NOT NULL, -- {street, city, country, postal_code, coordinates}
    property_type TEXT NOT NULL, -- apartment, house, villa, hotel, etc.
    room_type TEXT NOT NULL, -- entire_place, private_room, shared_room
    max_guests INTEGER NOT NULL,
    bedrooms INTEGER DEFAULT 0,
    beds INTEGER DEFAULT 0,
    bathrooms INTEGER DEFAULT 0,
    amenities TEXT[] DEFAULT '{}',
    photos TEXT[] DEFAULT '{}',
    price_per_night DECIMAL(10,2) NOT NULL,
    currency currency DEFAULT 'USD',
    min_nights INTEGER DEFAULT 1,
    max_nights INTEGER DEFAULT 365,
    instant_book BOOLEAN DEFAULT FALSE,
    status TEXT DEFAULT 'active', -- active, inactive, suspended
    rating DECIMAL(3,2) DEFAULT 0.00,
    review_count INTEGER DEFAULT 0,
    seo_slug TEXT UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bookings (Escrow State Machine)
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    guest_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    host_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    guests INTEGER NOT NULL,
    subtotal DECIMAL(12,2) NOT NULL,
    service_fee DECIMAL(12,2) DEFAULT 0.00,
    cleaning_fee DECIMAL(12,2) DEFAULT 0.00,
    total_amount DECIMAL(12,2) NOT NULL,
    currency currency DEFAULT 'USD',
    status booking_status DEFAULT 'pending',
    payment_method payment_method,
    payment_status payment_status DEFAULT 'pending',
    cancellation_policy TEXT,
    special_requests TEXT,
    escrow_wallet_address TEXT,
    smart_contract_tx_hash TEXT,
    checked_in_at TIMESTAMPTZ,
    checked_out_at TIMESTAMPTZ,
    settled_at TIMESTAMPTZ,
    cancelled_at TIMESTAMPTZ,
    cancel_reason TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT valid_dates CHECK (check_out_date > check_in_date)
);

-- ============================================
-- PAYMENT & ESCROW SYSTEM
-- ============================================

-- Payment Transactions
CREATE TABLE payment_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    amount DECIMAL(15,2) NOT NULL,
    currency currency NOT NULL,
    method payment_method NOT NULL,
    status payment_status DEFAULT 'pending',
    direction TEXT NOT NULL, -- inbound, outbound
    blockchain_tx_hash TEXT,
    blockchain_network TEXT,
    wallet_address TEXT,
    fiat_reference TEXT, -- Bank reference for fiat payments
    processor_response JSONB,
    escrow_release_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Safe Vault (DeFi Integration)
CREATE TABLE safe_vaults (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    vault_name TEXT NOT NULL,
    protocol TEXT NOT NULL, -- aave, compound, etc.
    deposited_amount DECIMAL(18,8) DEFAULT 0.00000000,
    deposited_currency currency NOT NULL,
    current_value_usd DECIMAL(15,2) DEFAULT 0.00,
    apy DECIMAL(5,2) DEFAULT 0.00,
    yield_earned DECIMAL(18,8) DEFAULT 0.00000000,
    risk_score TEXT DEFAULT 'low', -- low, medium, high
    lock_period_days INTEGER DEFAULT 0,
    unlocked_at TIMESTAMPTZ,
    status TEXT DEFAULT 'active', -- active, locked, withdrawn
    contract_address TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Vault Transactions
CREATE TABLE vault_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vault_id UUID REFERENCES safe_vaults(id) ON DELETE CASCADE,
    type TEXT NOT NULL, -- deposit, withdraw, yield
    amount DECIMAL(18,8) NOT NULL,
    currency currency NOT NULL,
    tx_hash TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- REVIEWS & REPUTATION
-- ============================================

-- Reviews
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    guest_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    host_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    cleanliness_rating INTEGER CHECK (cleanliness_rating >= 1 AND cleanliness_rating <= 5),
    accuracy_rating INTEGER CHECK (accuracy_rating >= 1 AND accuracy_rating <= 5),
    communication_rating INTEGER CHECK (communication_rating >= 1 AND communication_rating <= 5),
    location_rating INTEGER CHECK (location_rating >= 1 AND location_rating <= 5),
    checkin_rating INTEGER CHECK (checkin_rating >= 1 AND checkin_rating <= 5),
    value_rating INTEGER CHECK (value_rating >= 1 AND value_rating <= 5),
    comment TEXT,
    host_response TEXT,
    host_response_at TIMESTAMPTZ,
    is_verified BOOLEAN DEFAULT TRUE,
    helpful_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reputation Events (Blockchain-style ledger)
CREATE TABLE reputation_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL, -- booking_completed, review_received, cancellation, etc.
    points_change DECIMAL(5,2) NOT NULL,
    previous_score DECIMAL(5,2),
    new_score DECIMAL(5,2),
    reference_id UUID, -- booking_id, review_id, etc.
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- AI & SEO SYSTEM
-- ============================================

-- AI Generated Content
CREATE TABLE ai_content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content_type TEXT NOT NULL, -- property_description, travel_guide, seo_page, ad_copy
    reference_id UUID, -- property_id, city_id, etc.
    language TEXT NOT NULL,
    title TEXT,
    body TEXT,
    metadata JSONB DEFAULT '{}', -- SEO tags, keywords, etc.
    quality_score DECIMAL(3,2),
    is_published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- SEO Pages
CREATE TABLE seo_pages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    page_type TEXT NOT NULL, -- city, district, seasonal, property_type
    slug TEXT UNIQUE NOT NULL,
    language TEXT NOT NULL,
    title TEXT NOT NULL,
    meta_description TEXT,
    h1 TEXT,
    content JSONB, -- Structured content blocks
    schema_markup JSONB, -- Schema.org structured data
    og_image TEXT,
    canonical_url TEXT,
    hreflang TEXT[],
    traffic_data JSONB, -- UTM, source, etc.
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Analytics Events
CREATE TABLE analytics_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_type TEXT NOT NULL,
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    session_id TEXT,
    page_url TEXT,
    referrer TEXT,
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    utm_content TEXT,
    utm_term TEXT,
    device_type TEXT,
    browser TEXT,
    os TEXT,
    country TEXT,
    city TEXT,
    ip_hash TEXT, -- GDPR compliant
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- LEGAL & COMPLIANCE
-- ============================================

-- Legal Documents
CREATE TABLE legal_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_type TEXT NOT NULL, -- terms, privacy, offer, host_agreement
    version TEXT NOT NULL,
    language TEXT NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    is_active BOOLEAN DEFAULT FALSE,
    effective_from DATE,
    effective_until DATE,
    requires_acceptance BOOLEAN DEFAULT TRUE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Document Acceptances
CREATE TABLE document_acceptances (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    document_id UUID REFERENCES legal_documents(id) ON DELETE CASCADE,
    accepted_at TIMESTAMPTZ DEFAULT NOW(),
    ip_address TEXT,
    user_agent TEXT,
    UNIQUE(user_id, document_id)
);

-- Compliance Logs (AML/KYC)
CREATE TABLE compliance_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    check_type TEXT NOT NULL, -- aml, kyc, sanction, pep
    status TEXT NOT NULL, -- passed, failed, pending, manual_review
    provider TEXT, -- Third-party provider
    risk_score INTEGER, -- 0-100
    details JSONB DEFAULT '{}',
    reviewed_by UUID REFERENCES profiles(id),
    reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- NOTIFICATIONS
-- ============================================

CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    type TEXT NOT NULL, -- booking_request, payment_received, review, etc.
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    data JSONB DEFAULT '{}',
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMPTZ,
    channel TEXT[] DEFAULT '{"in_app"}', -- in_app, email, sms, push
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PLATFORM METRICS (Real-time)
-- ============================================

CREATE TABLE platform_metrics (
    id INTEGER PRIMARY KEY DEFAULT 1,
    active_bookings INTEGER DEFAULT 0,
    online_users INTEGER DEFAULT 0,
    tvl_usd DECIMAL(15,2) DEFAULT 0.00,
    total_revenue_usd DECIMAL(15,2) DEFAULT 0.00,
    total_properties INTEGER DEFAULT 0,
    total_users INTEGER DEFAULT 0,
    last_updated TIMESTAMPTZ DEFAULT NOW()
);

-- Initialize metrics
INSERT INTO platform_metrics (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX idx_properties_host_id ON properties(host_id);
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_properties_seo_slug ON properties(seo_slug);
CREATE INDEX idx_bookings_guest_id ON bookings(guest_id);
CREATE INDEX idx_bookings_host_id ON bookings(host_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_dates ON bookings(check_in_date, check_out_date);
CREATE INDEX idx_payment_transactions_booking_id ON payment_transactions(booking_id);
CREATE INDEX idx_payment_transactions_user_id ON payment_transactions(user_id);
CREATE INDEX idx_safe_vaults_user_id ON safe_vaults(user_id);
CREATE INDEX idx_reviews_property_id ON reviews(property_id);
CREATE INDEX idx_reviews_guest_id ON reviews(guest_id);
CREATE INDEX idx_reputation_events_user_id ON reputation_events(user_id);
CREATE INDEX idx_analytics_events_created ON analytics_events(created_at);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);

-- ============================================
-- TRIGGERS & FUNCTIONS
-- ============================================

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_properties_updated_at BEFORE UPDATE ON properties
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_safe_vaults_updated_at BEFORE UPDATE ON safe_vaults
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Update platform metrics trigger
CREATE OR REPLACE FUNCTION update_platform_metrics()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE platform_metrics SET
        active_bookings = (SELECT COUNT(*) FROM bookings WHERE status IN ('payment_locked', 'checked_in')),
        total_properties = (SELECT COUNT(*) FROM properties WHERE status = 'active'),
        total_users = (SELECT COUNT(*) FROM profiles),
        tvl_usd = (SELECT COALESCE(SUM(current_value_usd), 0) FROM safe_vaults),
        last_updated = NOW();
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_metrics_bookings
    AFTER INSERT OR UPDATE OR DELETE ON bookings
    EXECUTE FUNCTION update_platform_metrics();

CREATE TRIGGER trigger_update_metrics_properties
    AFTER INSERT OR UPDATE OR DELETE ON properties
    EXECUTE FUNCTION update_platform_metrics();

CREATE TRIGGER trigger_update_metrics_profiles
    AFTER INSERT OR DELETE ON profiles
    EXECUTE FUNCTION update_platform_metrics();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE safe_vaults ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- Properties policies
CREATE POLICY "Anyone can view active properties" ON properties
    FOR SELECT USING (status = 'active');

CREATE POLICY "Hosts can manage own properties" ON properties
    FOR ALL USING (auth.uid() = host_id);

-- Bookings policies
CREATE POLICY "Guests can view own bookings" ON bookings
    FOR SELECT USING (auth.uid() = guest_id OR auth.uid() = host_id);

CREATE POLICY "Guests can create bookings" ON bookings
    FOR INSERT WITH CHECK (auth.uid() = guest_id);

-- Reviews policies
CREATE POLICY "Anyone can view reviews" ON reviews
    FOR SELECT USING (TRUE);

CREATE POLICY "Verified guests can create reviews" ON reviews
    FOR INSERT WITH CHECK (auth.uid() = guest_id);

-- Notifications policies
CREATE POLICY "Users can view own notifications" ON notifications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON notifications
    FOR UPDATE USING (auth.uid() = user_id);

-- ============================================
-- INITIAL DATA
-- ============================================

-- Insert admin user (will be updated after auth signup)
INSERT INTO profiles (id, email, full_name, role) VALUES
    ('00000000-0000-0000-0000-000000000001', 'admin@openbooking.com', 'System Admin', 'admin');

-- Legal documents (English version)
INSERT INTO legal_documents (document_type, version, language, title, content, is_active, effective_from) VALUES
    ('terms', '1.0.0', 'en', 'Terms of Service', '<h1>OpenBooking Terms of Service</h1><p>Effective Date: 2026-02-21</p><h2>1. Acceptance of Terms</h2><p>By accessing and using OpenBooking platform...</p>', TRUE, '2026-02-21'),
    ('privacy', '1.0.0', 'en', 'Privacy Policy', '<h1>Privacy Policy</h1><p>Your privacy is important to us...</p>', TRUE, '2026-02-21'),
    ('offer', '1.0.0', 'en', 'Public Offer Agreement', '<h1>Public Offer Agreement</h1><p>This agreement governs the use of booking services...</p>', TRUE, '2026-02-21');

COMMENT ON TABLE profiles IS 'User profiles with RBAC roles (client, host, admin)';
COMMENT ON TABLE properties IS 'Property listings with multilingual support';
COMMENT ON TABLE bookings IS 'Booking escrow state machine';
COMMENT ON TABLE payment_transactions IS 'Payment transaction ledger';
COMMENT ON TABLE safe_vaults IS 'DeFi Safe Vault for yield generation';
COMMENT ON TABLE reviews IS 'Review and rating system';
COMMENT ON TABLE reputation_events IS 'Blockchain-style reputation ledger';
COMMENT ON TABLE ai_content IS 'AI-generated content storage';
COMMENT ON TABLE seo_pages IS 'SEO-optimized pages with Schema.org markup';
COMMENT ON TABLE legal_documents IS 'Versioned legal documents CMS';
