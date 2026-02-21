-- =====================================================
-- OPENBOOKING DATABASE SCHEMA
-- Enterprise Trust Economy Protocol
-- =====================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- ENUMS
-- =====================================================

CREATE TYPE user_role AS ENUM ('client', 'host', 'admin');
CREATE TYPE booking_status AS ENUM ('pending', 'payment_locked', 'checked_in', 'completed', 'settled', 'cancelled');
CREATE TYPE payment_status AS ENUM ('pending', 'processing', 'confirmed', 'failed', 'refunded');
CREATE TYPE payment_method AS ENUM ('eth', 'dai', 'a7a5', 'sbp', 'mir', 'yookassa', 'sepa', 'adyen', 'klarna', 'borica', 'epay');
CREATE TYPE transaction_type AS ENUM ('deposit', 'payment', 'escrow_lock', 'escrow_release', 'vault_deposit', 'vault_withdraw', 'fee', 'refund');
CREATE TYPE compliance_status AS ENUM ('pending', 'approved', 'rejected', 'flagged');
CREATE TYPE vault_strategy AS ENUM ('aave_supply', 'aave_stable', 'compound', 'yearn', 'hold');

-- =====================================================
-- PROFILES (Users)
-- =====================================================

CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  role user_role NOT NULL DEFAULT 'client',
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  country TEXT,
  city TEXT,
  verified BOOLEAN DEFAULT FALSE,
  kyc_status compliance_status DEFAULT 'pending',
  wallet_address TEXT,
  language TEXT DEFAULT 'ru',
  timezone TEXT DEFAULT 'UTC',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login_at TIMESTAMP WITH TIME ZONE,
  
  CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  CONSTRAINT valid_wallet CHECK (wallet_address IS NULL OR wallet_address ~ '^0x[a-fA-F0-9]{40}$')
);

CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_wallet ON profiles(wallet_address);
CREATE INDEX idx_profiles_role ON profiles(role);

-- =====================================================
-- PROPERTIES
-- =====================================================

CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  host_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  property_type TEXT NOT NULL,
  room_type TEXT,
  address_line1 TEXT NOT NULL,
  address_line2 TEXT,
  city TEXT NOT NULL,
  state TEXT,
  postal_code TEXT,
  country TEXT NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  bedrooms INTEGER DEFAULT 0,
  bathrooms INTEGER DEFAULT 0,
  max_guests INTEGER DEFAULT 1,
  amenities TEXT[],
  photos TEXT[],
  price_per_night DECIMAL(12, 2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  minimum_nights INTEGER DEFAULT 1,
  maximum_nights INTEGER DEFAULT 365,
  availability_calendar JSONB,
  instant_book BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'blocked', 'deleted')),
  rating DECIMAL(3, 2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT positive_price CHECK (price_per_night >= 0),
  CONSTRAINT valid_guests CHECK (max_guests > 0)
);

CREATE INDEX idx_properties_host ON properties(host_id);
CREATE INDEX idx_properties_city ON properties(city);
CREATE INDEX idx_properties_country ON properties(country);
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_properties_location ON properties USING GIST (ll_to_earth(latitude, longitude));

-- =====================================================
-- BOOKINGS
-- =====================================================

CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  guest_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  host_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  check_in_date DATE NOT NULL,
  check_out_date DATE NOT NULL,
  num_guests INTEGER NOT NULL,
  num_nights INTEGER NOT NULL,
  base_price DECIMAL(12, 2) NOT NULL,
  service_fee DECIMAL(12, 2) DEFAULT 0,
  cleaning_fee DECIMAL(12, 2) DEFAULT 0,
  total_price DECIMAL(12, 2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  status booking_status NOT NULL DEFAULT 'pending',
  payment_method payment_method,
  special_requests TEXT,
  cancellation_policy TEXT,
  cancelled_at TIMESTAMP WITH TIME ZONE,
  cancellation_reason TEXT,
  checked_in_at TIMESTAMP WITH TIME ZONE,
  checked_out_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT valid_dates CHECK (check_out_date > check_in_date),
  CONSTRAINT valid_guests CHECK (num_guests > 0),
  CONSTRAINT positive_total CHECK (total_price >= 0)
);

CREATE INDEX idx_bookings_property ON bookings(property_id);
CREATE INDEX idx_bookings_guest ON bookings(guest_id);
CREATE INDEX idx_bookings_host ON bookings(host_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_dates ON bookings(check_in_date, check_out_date);

-- =====================================================
-- ESCROW LEDGER
-- =====================================================

CREATE TABLE escrow_ledger (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  amount DECIMAL(20, 8) NOT NULL,
  currency TEXT NOT NULL,
  asset_type TEXT NOT NULL CHECK (asset_type IN ('eth', 'dai', 'a7a5', 'fiat')),
  transaction_hash TEXT,
  wallet_from TEXT,
  wallet_to TEXT,
  escrow_status TEXT NOT NULL DEFAULT 'locked' CHECK (escrow_status IN ('pending', 'locked', 'released', 'refunded', 'frozen')),
  locked_at TIMESTAMP WITH TIME ZONE,
  released_at TIMESTAMP WITH TIME ZONE,
  released_to UUID REFERENCES profiles(id),
  release_reason TEXT,
  blockchain_network TEXT,
  gas_fee DECIMAL(20, 8),
  confirmations INTEGER DEFAULT 0,
  required_confirmations INTEGER DEFAULT 12,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT positive_amount CHECK (amount > 0),
  CONSTRAINT valid_hash CHECK (transaction_hash IS NULL OR transaction_hash ~ '^0x[a-fA-F0-9]{64}$')
);

CREATE INDEX idx_escrow_booking ON escrow_ledger(booking_id);
CREATE INDEX idx_escrow_status ON escrow_ledger(escrow_status);
CREATE INDEX idx_escrow_hash ON escrow_ledger(transaction_hash);

-- =====================================================
-- PAYMENT TRANSACTIONS
-- =====================================================

CREATE TABLE payment_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  transaction_type transaction_type NOT NULL,
  payment_method payment_method NOT NULL,
  amount DECIMAL(20, 8) NOT NULL,
  currency TEXT NOT NULL,
  fee_amount DECIMAL(20, 8) DEFAULT 0,
  net_amount DECIMAL(20, 8) NOT NULL,
  status payment_status NOT NULL DEFAULT 'pending',
  transaction_hash TEXT,
  block_number BIGINT,
  from_address TEXT,
  to_address TEXT,
  gateway_reference TEXT,
  gateway_response JSONB,
  error_message TEXT,
  retry_count INTEGER DEFAULT 0,
  idempotency_key TEXT UNIQUE,
  metadata JSONB,
  processed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT positive_amount CHECK (amount > 0),
  CONSTRAINT valid_hash CHECK (transaction_hash IS NULL OR transaction_hash ~ '^0x[a-fA-F0-9]{64}$')
);

CREATE INDEX idx_payments_user ON payment_transactions(user_id);
CREATE INDEX idx_payments_booking ON payment_transactions(booking_id);
CREATE INDEX idx_payments_status ON payment_transactions(status);
CREATE INDEX idx_payments_type ON payment_transactions(transaction_type);
CREATE INDEX idx_payments_created ON payment_transactions(created_at);

-- =====================================================
-- REVIEWS
-- =====================================================

CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  guest_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  host_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  guest_review TEXT,
  host_review TEXT,
  guest_rating INTEGER CHECK (guest_rating >= 1 AND guest_rating <= 5),
  host_rating INTEGER CHECK (host_rating >= 1 AND host_rating <= 5),
  cleanliness_rating INTEGER CHECK (cleanliness_rating >= 1 AND cleanliness_rating <= 5),
  accuracy_rating INTEGER CHECK (accuracy_rating >= 1 AND accuracy_rating <= 5),
  communication_rating INTEGER CHECK (communication_rating >= 1 AND communication_rating <= 5),
  location_rating INTEGER CHECK (location_rating >= 1 AND location_rating <= 5),
  checkin_rating INTEGER CHECK (checkin_rating >= 1 AND checkin_rating <= 5),
  value_rating INTEGER CHECK (value_rating >= 1 AND value_rating <= 5),
  guest_review_visible BOOLEAN DEFAULT FALSE,
  host_review_visible BOOLEAN DEFAULT FALSE,
  response TEXT,
  responded_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT valid_guest_rating CHECK (guest_rating IS NULL OR (guest_rating >= 1 AND guest_rating <= 5)),
  CONSTRAINT valid_host_rating CHECK (host_rating IS NULL OR (host_rating >= 1 AND host_rating <= 5))
);

CREATE INDEX idx_reviews_property ON reviews(property_id);
CREATE INDEX idx_reviews_guest ON reviews(guest_id);
CREATE INDEX idx_reviews_host ON reviews(host_id);
CREATE INDEX idx_reviews_booking ON reviews(booking_id);

-- =====================================================
-- AI GENERATED CONTENT
-- =====================================================

CREATE TABLE ai_generated_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_type TEXT NOT NULL CHECK (content_type IN ('seo_page', 'travel_guide', 'ad_copy', 'landing_page', 'description', 'review_response')),
  target_type TEXT CHECK (target_type IN ('property', 'city', 'district', 'seasonal', 'general')),
  target_id UUID,
  locale TEXT NOT NULL DEFAULT 'ru',
  title TEXT,
  content TEXT NOT NULL,
  meta_description TEXT,
  meta_keywords TEXT[],
  schema_markup JSONB,
  open_graph JSONB,
  quality_score DECIMAL(3, 2),
  seo_score INTEGER,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived', 'rejected')),
  model_version TEXT,
  prompt_used TEXT,
  tokens_used INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  published_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT valid_quality_score CHECK (quality_score IS NULL OR (quality_score >= 0 AND quality_score <= 1))
);

CREATE INDEX idx_ai_content_type ON ai_generated_content(content_type);
CREATE INDEX idx_ai_content_target ON ai_generated_content(target_type, target_id);
CREATE INDEX idx_ai_content_locale ON ai_generated_content(locale);
CREATE INDEX idx_ai_content_status ON ai_generated_content(status);

-- =====================================================
-- TRAFFIC EVENTS (Analytics)
-- =====================================================

CREATE TABLE traffic_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL,
  page_path TEXT,
  page_title TEXT,
  referrer TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_term TEXT,
  utm_content TEXT,
  device_type TEXT,
  browser TEXT,
  os TEXT,
  screen_resolution TEXT,
  viewport_size TEXT,
  country TEXT,
  region TEXT,
  city TEXT,
  language TEXT,
  timezone TEXT,
  ip_hash TEXT,
  user_agent TEXT,
  event_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_traffic_session ON traffic_events(session_id);
CREATE INDEX idx_traffic_user ON traffic_events(user_id);
CREATE INDEX idx_traffic_type ON traffic_events(event_type);
CREATE INDEX idx_traffic_created ON traffic_events(created_at);
CREATE INDEX idx_traffic_source ON traffic_events(utm_source, utm_medium, utm_campaign);

-- =====================================================
-- COMPLIANCE LOGS
-- =====================================================

CREATE TABLE compliance_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  action TEXT NOT NULL,
  status compliance_status NOT NULL DEFAULT 'pending',
  risk_score DECIMAL(5, 4) DEFAULT 0,
  risk_factors TEXT[],
  reviewer_id UUID REFERENCES profiles(id),
  review_notes TEXT,
  metadata JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  
  CONSTRAINT valid_risk_score CHECK (risk_score >= 0 AND risk_score <= 1)
);

CREATE INDEX idx_compliance_user ON compliance_logs(user_id);
CREATE INDEX idx_compliance_entity ON compliance_logs(entity_type, entity_id);
CREATE INDEX idx_compliance_status ON compliance_logs(status);
CREATE INDEX idx_compliance_created ON compliance_logs(created_at);

-- =====================================================
-- VAULT POSITIONS (DeFi Integration)
-- =====================================================

CREATE TABLE vault_positions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pool_id UUID NOT NULL,
  strategy vault_strategy NOT NULL,
  asset TEXT NOT NULL,
  deposited_amount DECIMAL(20, 8) NOT NULL,
  current_amount DECIMAL(20, 8) NOT NULL,
  yield_earned DECIMAL(20, 8) DEFAULT 0,
  apy DECIMAL(6, 4),
  risk_score DECIMAL(3, 2) DEFAULT 0.5,
  allocation_percentage DECIMAL(5, 2),
  protocol_address TEXT,
  position_id TEXT,
  transaction_hash TEXT,
  last_sync_at TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'closed', 'liquidated', 'paused')),
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT positive_deposit CHECK (deposited_amount > 0),
  CONSTRAINT valid_allocation CHECK (allocation_percentage IS NULL OR (allocation_percentage >= 0 AND allocation_percentage <= 100)),
  CONSTRAINT valid_apy CHECK (apy IS NULL OR apy >= 0)
);

CREATE INDEX idx_vault_pool ON vault_positions(pool_id);
CREATE INDEX idx_vault_strategy ON vault_positions(strategy);
CREATE INDEX idx_vault_asset ON vault_positions(asset);
CREATE INDEX idx_vault_status ON vault_positions(status);

-- =====================================================
-- VAULT POOLS
-- =====================================================

CREATE TABLE vault_pools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  total_value_locked DECIMAL(20, 8) DEFAULT 0,
  total_deposited DECIMAL(20, 8) DEFAULT 0,
  total_yield_earned DECIMAL(20, 8) DEFAULT 0,
  average_apy DECIMAL(6, 4),
  risk_level TEXT CHECK (risk_level IN ('low', 'medium', 'high')),
  strategies vault_strategy[],
  supported_assets TEXT[],
  min_deposit DECIMAL(20, 8) DEFAULT 0,
  max_deposit DECIMAL(20, 8),
  fee_percentage DECIMAL(5, 4) DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'closed')),
  protocol_integration TEXT,
  contract_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT valid_fee CHECK (fee_percentage >= 0 AND fee_percentage <= 100)
);

CREATE INDEX idx_vault_pools_status ON vault_pools(status);

-- =====================================================
-- REAL-TIME METRICS (for dashboard)
-- =====================================================

CREATE TABLE real_time_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_name TEXT NOT NULL UNIQUE,
  metric_value DECIMAL(20, 8) NOT NULL,
  unit TEXT,
  delta_24h DECIMAL(20, 8),
  delta_percentage DECIMAL(6, 2),
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB
);

CREATE INDEX idx_metrics_name ON real_time_metrics(metric_name);

-- Insert default metrics
INSERT INTO real_time_metrics (metric_name, metric_value, unit, delta_24h, delta_percentage) VALUES
  ('active_bookings', 0, 'count', 0, 0),
  ('online_users', 0, 'count', 0, 0),
  ('total_value_locked', 0, 'USD', 0, 0),
  ('total_revenue', 0, 'USD', 0, 0),
  ('total_properties', 0, 'count', 0, 0),
  ('total_users', 0, 'count', 0, 0);

-- =====================================================
-- FUNCTIONS & TRIGGERS
-- =====================================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to tables with updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_properties_updated_at BEFORE UPDATE ON properties
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ai_generated_content_updated_at BEFORE UPDATE ON ai_generated_content
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vault_positions_updated_at BEFORE UPDATE ON vault_positions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vault_pools_updated_at BEFORE UPDATE ON vault_pools
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, role)
  VALUES (NEW.id, NEW.email, 'client');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update property rating on review
CREATE OR REPLACE FUNCTION update_property_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE properties
  SET 
    rating = (
      SELECT COALESCE(AVG(
        (COALESCE(cleanliness_rating, 0) +
         COALESCE(accuracy_rating, 0) +
         COALESCE(communication_rating, 0) +
         COALESCE(location_rating, 0) +
         COALESCE(checkin_rating, 0) +
         COALESCE(value_rating, 0)) / 6.0
      ), 0)
      FROM reviews
      WHERE property_id = NEW.property_id
      AND guest_review_visible = TRUE
    ),
    review_count = (
      SELECT COUNT(*)
      FROM reviews
      WHERE property_id = NEW.property_id
      AND guest_review_visible = TRUE
    )
  WHERE id = NEW.property_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_property_rating
  AFTER INSERT OR UPDATE ON reviews
  FOR EACH ROW
  WHEN (NEW.guest_review_visible = TRUE)
  EXECUTE FUNCTION update_property_rating();

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE escrow_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_generated_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE traffic_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE vault_positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE vault_pools ENABLE ROW LEVEL SECURITY;
ALTER TABLE real_time_metrics ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Hosts can view guest profiles for bookings"
  ON profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM bookings
      WHERE bookings.host_id = auth.uid()
      AND bookings.guest_id = profiles.id
    )
  );

-- Properties policies
CREATE POLICY "Anyone can view active properties"
  ON properties FOR SELECT
  USING (status = 'active');

CREATE POLICY "Hosts can manage own properties"
  ON properties FOR ALL
  USING (host_id = auth.uid());

CREATE POLICY "Admins can manage all properties"
  ON properties FOR ALL
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Bookings policies
CREATE POLICY "Users can view own bookings"
  ON bookings FOR SELECT
  USING (guest_id = auth.uid() OR host_id = auth.uid());

CREATE POLICY "Guests can create bookings"
  ON bookings FOR INSERT
  WITH CHECK (guest_id = auth.uid());

CREATE POLICY "Hosts can update own bookings"
  ON bookings FOR UPDATE
  USING (host_id = auth.uid());

-- Escrow policies
CREATE POLICY "Users can view escrow for own bookings"
  ON escrow_ledger FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM bookings
      WHERE bookings.id = escrow_ledger.booking_id
      AND (bookings.guest_id = auth.uid() OR bookings.host_id = auth.uid())
    )
  );

-- Payment policies
CREATE POLICY "Users can view own transactions"
  ON payment_transactions FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can create own transactions"
  ON payment_transactions FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Reviews policies
CREATE POLICY "Anyone can view published reviews"
  ON reviews FOR SELECT
  USING (guest_review_visible = TRUE OR host_review_visible = TRUE);

CREATE POLICY "Users can create reviews for own bookings"
  ON reviews FOR INSERT
  WITH CHECK (
    (guest_id = auth.uid() AND EXISTS (
      SELECT 1 FROM bookings WHERE id = reviews.booking_id AND guest_id = auth.uid()
    ))
    OR
    (host_id = auth.uid() AND EXISTS (
      SELECT 1 FROM bookings WHERE id = reviews.booking_id AND host_id = auth.uid()
    ))
  );

-- Vault policies
CREATE POLICY "Anyone can view vault pools"
  ON vault_pools FOR SELECT
  USING (TRUE);

CREATE POLICY "Users can view own vault positions"
  ON vault_positions FOR SELECT
  USING (TRUE); -- Public view for transparency

-- Admin policies
CREATE POLICY "Admins can view all data"
  ON profiles FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can manage compliance logs"
  ON compliance_logs FOR ALL
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- =====================================================
-- SEED DATA (Development)
-- =====================================================

-- Insert admin user (update with actual auth.users after signup)
-- INSERT INTO profiles (email, role, full_name) VALUES
--   ('admin@openbooking.com', 'admin', 'System Administrator');
