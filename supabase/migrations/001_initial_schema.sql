-- ============================================
-- OPENBOOKING INITIAL SCHEMA
-- ============================================
-- Trust Economy Protocol + Web3 Finance Infrastructure
-- ============================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- ENUMS
-- ============================================

-- User roles (RBAC)
CREATE TYPE user_role AS ENUM (
    'client',
    'host',
    'admin',
    'moderator',
    'super_admin'
);

-- Booking state machine (ESCROW PROTOCOL)
CREATE TYPE booking_status AS ENUM (
    'pending',           -- Initial state
    'payment_locked',    -- Payment secured in escrow
    'confirmed',         -- Host confirmed
    'checked_in',        -- Guest checked in (no cancel allowed)
    'completed',         -- Stay completed
    'settled',           -- Funds settled to host
    'cancelled',         -- Cancelled before check-in
    'disputed',          -- In dispute resolution
    'refunded'           -- Refunded to guest
);

-- Payment methods
CREATE TYPE payment_method AS ENUM (
    -- Crypto
    'usdt',
    'usdc',
    'eth',
    'obt_token',        -- OpenBooking Token
    'a7a5_stable',
    -- Fiat Russia
    'sbp',
    'mir',
    'yookassa',
    -- Fiat EU
    'sepa',
    'adyen',
    'klarna',
    -- Fiat Bulgaria
    'borica',
    'epay_bg',
    -- Cards
    'visa',
    'mastercard'
);

-- Payment status
CREATE TYPE payment_status AS ENUM (
    'pending',
    'processing',
    'completed',
    'failed',
    'refunded',
    'chargeback'
);

-- Property types
CREATE TYPE property_type AS ENUM (
    'apartment',
    'house',
    'hotel',
    'hostel',
    'resort',
    'villa',
    'cabin',
    'unique'
);

-- AI Content types
CREATE TYPE ai_content_type AS ENUM (
    'seo_page',
    'travel_guide',
    'ad_campaign',
    'property_description',
    'email_template',
    'social_post'
);

-- Legal document types
CREATE TYPE legal_doc_type AS ENUM (
    'terms_of_service',
    'privacy_policy',
    'host_agreement',
    'guest_agreement',
    'offer_contract',
    'cancellation_policy',
    'data_processing_agreement'
);

-- Notification types
CREATE TYPE notification_type AS ENUM (
    'booking_update',
    'payment_received',
    'payment_sent',
    'review_request',
    'system_alert',
    'marketing',
    'security_alert'
);

-- ============================================
-- CORE TABLES
-- ============================================

-- User profiles (extends auth.users)
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    role user_role NOT NULL DEFAULT 'client',
    
    -- Personal info
    first_name TEXT,
    last_name TEXT,
    phone TEXT,
    avatar_url TEXT,
    
    -- Verification
    email_verified BOOLEAN DEFAULT FALSE,
    phone_verified BOOLEAN DEFAULT FALSE,
    identity_verified BOOLEAN DEFAULT FALSE,
    kyc_status TEXT DEFAULT 'pending', -- pending, approved, rejected
    
    -- Web3
    wallet_address TEXT UNIQUE,
    wallet_connected_at TIMESTAMPTZ,
    
    -- Reputation
    reputation_score DECIMAL(5,2) DEFAULT 0.00,
    total_bookings INTEGER DEFAULT 0,
    total_reviews INTEGER DEFAULT 0,
    
    -- Preferences
    preferred_language TEXT DEFAULT 'en',
    preferred_currency TEXT DEFAULT 'USD',
    timezone TEXT DEFAULT 'UTC',
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    last_login_at TIMESTAMPTZ,
    
    -- Metadata
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Host profiles (additional host-specific data)
CREATE TABLE host_profiles (
    id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
    
    -- Business info
    business_name TEXT,
    business_type TEXT, -- individual, company, property_manager
    tax_id TEXT,
    registration_number TEXT,
    
    -- Banking
    bank_account_encrypted TEXT, -- Encrypted bank details
    payout_method TEXT,
    
    -- Stats
    total_properties INTEGER DEFAULT 0,
    total_bookings INTEGER DEFAULT 0,
    acceptance_rate DECIMAL(5,2) DEFAULT 0.00,
    response_rate DECIMAL(5,2) DEFAULT 0.00,
    response_time_minutes INTEGER DEFAULT 0,
    
    -- Verification
    verified BOOLEAN DEFAULT FALSE,
    verified_at TIMESTAMPTZ,
    verification_documents JSONB DEFAULT '[]'::jsonb,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Properties
CREATE TABLE properties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    host_id UUID NOT NULL REFERENCES host_profiles(id) ON DELETE CASCADE,
    
    -- Basic info
    title TEXT NOT NULL,
    description TEXT,
    property_type property_type NOT NULL,
    
    -- Location
    country TEXT NOT NULL,
    city TEXT NOT NULL,
    district TEXT,
    address TEXT,
    postal_code TEXT,
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    
    -- Capacity
    guests INTEGER NOT NULL DEFAULT 1,
    bedrooms INTEGER DEFAULT 0,
    beds INTEGER DEFAULT 0,
    bathrooms INTEGER DEFAULT 0,
    
    -- Amenities (JSON array)
    amenities JSONB DEFAULT '[]'::jsonb,
    
    -- Pricing
    base_price DECIMAL(12,2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    cleaning_fee DECIMAL(10,2) DEFAULT 0,
    service_fee DECIMAL(10,2) DEFAULT 0,
    security_deposit DECIMAL(10,2) DEFAULT 0,
    
    -- Availability
    min_nights INTEGER DEFAULT 1,
    max_nights INTEGER DEFAULT 365,
    available_from DATE,
    available_to DATE,
    
    -- Status
    status TEXT DEFAULT 'draft', -- draft, active, suspended, deleted
    verified BOOLEAN DEFAULT FALSE,
    
    -- SEO
    slug TEXT UNIQUE,
    meta_title TEXT,
    meta_description TEXT,
    
    -- Stats
    view_count INTEGER DEFAULT 0,
    booking_count INTEGER DEFAULT 0,
    review_count INTEGER DEFAULT 0,
    rating_avg DECIMAL(3,2) DEFAULT 0.00,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Property photos
CREATE TABLE property_photos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    thumbnail_url TEXT,
    caption TEXT,
    sort_order INTEGER DEFAULT 0,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- BOOKING & ESCROW SYSTEM
-- ============================================

-- Bookings (ESCROW STATE MACHINE)
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID NOT NULL REFERENCES properties(id),
    guest_id UUID NOT NULL REFERENCES profiles(id),
    host_id UUID NOT NULL REFERENCES host_profiles(id),
    
    -- Dates
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    nights INTEGER NOT NULL,
    
    -- Guests
    number_of_guests INTEGER NOT NULL,
    
    -- Pricing breakdown
    subtotal DECIMAL(12,2) NOT NULL,
    cleaning_fee DECIMAL(10,2) DEFAULT 0,
    service_fee DECIMAL(10,2) DEFAULT 0,
    taxes DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(12,2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    
    -- ESCROW STATE
    status booking_status NOT NULL DEFAULT 'pending',
    
    -- Payment
    payment_method payment_method,
    payment_status payment_status DEFAULT 'pending',
    payment_id TEXT, -- External payment reference
    
    -- Escrow tracking
    escrow_amount DECIMAL(12,2),
    escrow_released_at TIMESTAMPTZ,
    escrow_released_amount DECIMAL(12,2),
    
    -- Web3
    blockchain_tx_hash TEXT,
    blockchain_network TEXT,
    smart_contract_event_id TEXT,
    
    -- Cancellation
    cancelled_by UUID REFERENCES profiles(id),
    cancelled_at TIMESTAMPTZ,
    cancellation_reason TEXT,
    
    -- Review
    guest_review_id UUID,
    host_review_id UUID,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    confirmed_at TIMESTAMPTZ,
    checked_in_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    
    -- Metadata
    metadata JSONB DEFAULT '{}'::jsonb,
    
    CONSTRAINT check_dates CHECK (check_out_date > check_in_date)
);

-- Booking state history (audit trail)
CREATE TABLE booking_state_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    from_status booking_status,
    to_status booking_status NOT NULL,
    triggered_by UUID REFERENCES profiles(id),
    triggered_by_role TEXT,
    reason TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PAYMENT & FINANCIAL SYSTEM
-- ============================================

-- Payments
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID REFERENCES bookings(id),
    user_id UUID NOT NULL REFERENCES profiles(id),
    
    -- Amount
    amount DECIMAL(12,2) NOT NULL,
    currency TEXT NOT NULL,
    fee_amount DECIMAL(10,2) DEFAULT 0,
    net_amount DECIMAL(10,2) DEFAULT 0,
    
    -- Method
    method payment_method NOT NULL,
    status payment_status NOT NULL DEFAULT 'pending',
    
    -- Gateway reference
    gateway_reference TEXT,
    gateway_response JSONB,
    
    -- Web3
    blockchain_tx_hash TEXT,
    blockchain_confirmations INTEGER DEFAULT 0,
    token_contract TEXT,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    processed_at TIMESTAMPTZ,
    failed_at TIMESTAMPTZ,
    
    -- Error handling
    error_code TEXT,
    error_message TEXT,
    
    -- Metadata
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Payouts (to hosts)
CREATE TABLE payouts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    host_id UUID NOT NULL REFERENCES host_profiles(id),
    booking_id UUID REFERENCES bookings(id),
    
    -- Amount
    amount DECIMAL(12,2) NOT NULL,
    currency TEXT NOT NULL,
    fee_amount DECIMAL(10,2) DEFAULT 0,
    net_amount DECIMAL(10,2) NOT NULL,
    
    -- Status
    status TEXT DEFAULT 'pending', -- pending, processing, completed, failed
    payout_method TEXT,
    
    -- Gateway
    gateway_reference TEXT,
    
    -- Timestamps
    requested_at TIMESTAMPTZ DEFAULT NOW(),
    processed_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    failed_at TIMESTAMPTZ,
    
    -- Error
    error_message TEXT,
    
    -- Metadata
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Safe Vault (DeFi positions)
CREATE TABLE safe_vaults (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id),
    
    -- Vault info
    vault_name TEXT NOT NULL,
    vault_type TEXT DEFAULT 'savings', -- savings, investment, staking
    
    -- Balance
    deposited_amount DECIMAL(18,8) DEFAULT 0,
    current_value DECIMAL(18,8) DEFAULT 0,
    yield_earned DECIMAL(18,8) DEFAULT 0,
    currency TEXT NOT NULL,
    
    -- DeFi Protocol
    protocol TEXT, -- aave, compound, etc.
    protocol_position_id TEXT,
    
    -- Yield
    apy DECIMAL(6,4) DEFAULT 0,
    last_yield_update TIMESTAMPTZ,
    
    -- Risk
    risk_score TEXT DEFAULT 'low', -- low, medium, high
    
    -- Status
    status TEXT DEFAULT 'active',
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Vault transactions
CREATE TABLE vault_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vault_id UUID NOT NULL REFERENCES safe_vaults(id) ON DELETE CASCADE,
    
    -- Type
    transaction_type TEXT NOT NULL, -- deposit, withdraw, yield
    
    -- Amount
    amount DECIMAL(18,8) NOT NULL,
    currency TEXT NOT NULL,
    
    -- Blockchain
    blockchain_tx_hash TEXT,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Metadata
    metadata JSONB DEFAULT '{}'::jsonb
);

-- ============================================
-- REVIEWS & REPUTATION
-- ============================================

-- Reviews
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES bookings(id),
    property_id UUID NOT NULL REFERENCES properties(id),
    
    -- Reviewer
    reviewer_id UUID NOT NULL REFERENCES profiles(id),
    reviewee_id UUID NOT NULL REFERENCES profiles(id),
    
    -- Type
    review_type TEXT NOT NULL, -- guest_to_host, host_to_guest
    
    -- Content
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title TEXT,
    content TEXT,
    
    -- Categories
    cleanliness INTEGER CHECK (cleanliness >= 1 AND cleanliness <= 5),
    accuracy INTEGER CHECK (accuracy >= 1 AND accuracy <= 5),
    communication INTEGER CHECK (communication >= 1 AND communication <= 5),
    location_rating INTEGER CHECK (location_rating >= 1 AND location_rating <= 5),
    check_in INTEGER CHECK (check_in >= 1 AND check_in <= 5),
    value INTEGER CHECK (value >= 1 AND value <= 5),
    
    -- Response
    response TEXT,
    response_at TIMESTAMPTZ,
    
    -- Visibility
    is_public BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- AI CONTENT SYSTEM
-- ============================================

-- AI generated content
CREATE TABLE ai_content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Type
    content_type ai_content_type NOT NULL,
    
    -- Target
    target_type TEXT, -- property, page, campaign
    target_id UUID,
    
    -- Content
    title TEXT,
    content TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    
    -- SEO
    keywords JSONB DEFAULT '[]'::jsonb,
    meta_title TEXT,
    meta_description TEXT,
    
    -- Generation
    model_used TEXT,
    prompt_used TEXT,
    generation_params JSONB,
    
    -- Quality
    quality_score DECIMAL(3,2),
    human_edited BOOLEAN DEFAULT FALSE,
    published BOOLEAN DEFAULT FALSE,
    
    -- Performance
    views INTEGER DEFAULT 0,
    conversions INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- SEO pages
CREATE TABLE seo_pages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Routing
    slug TEXT UNIQUE NOT NULL,
    path TEXT NOT NULL,
    
    -- Localization
    language TEXT DEFAULT 'en',
    locale_path TEXT,
    
    -- Content
    title TEXT NOT NULL,
    description TEXT,
    content TEXT,
    h1 TEXT,
    
    -- SEO
    meta_title TEXT,
    meta_description TEXT,
    canonical_url TEXT,
    keywords JSONB DEFAULT '[]'::jsonb,
    og_image TEXT,
    schema_markup JSONB,
    
    -- Targeting
    target_city TEXT,
    target_district TEXT,
    target_country TEXT,
    seasonality TEXT,
    
    -- Performance
    views INTEGER DEFAULT 0,
    organic_traffic INTEGER DEFAULT 0,
    conversion_rate DECIMAL(5,4) DEFAULT 0,
    
    -- Status
    status TEXT DEFAULT 'draft',
    published_at TIMESTAMPTZ,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- LEGAL SYSTEM
-- ============================================

-- Legal documents
CREATE TABLE legal_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Type
    doc_type legal_doc_type NOT NULL,
    
    -- Versioning
    version TEXT NOT NULL,
    previous_version_id UUID REFERENCES legal_documents(id),
    
    -- Localization
    language TEXT NOT NULL DEFAULT 'en',
    
    -- Content
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    summary TEXT,
    
    -- Legal
    effective_date DATE,
    expiry_date DATE,
    jurisdiction TEXT,
    
    -- Status
    status TEXT DEFAULT 'draft', -- draft, active, archived
    is_required BOOLEAN DEFAULT TRUE,
    
    -- Acceptance tracking
    acceptance_required_for TEXT[], -- client, host, admin
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    published_at TIMESTAMPTZ,
    
    -- Metadata
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Document acceptances
CREATE TABLE document_acceptances (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID NOT NULL REFERENCES legal_documents(id),
    user_id UUID NOT NULL REFERENCES profiles(id),
    
    -- Acceptance
    accepted BOOLEAN NOT NULL,
    accepted_at TIMESTAMPTZ DEFAULT NOW(),
    ip_address TEXT,
    user_agent TEXT,
    
    -- Version
    document_version TEXT NOT NULL,
    
    -- Metadata
    metadata JSONB DEFAULT '{}'::jsonb,
    
    UNIQUE(document_id, user_id, document_version)
);

-- ============================================
-- ANALYTICS & MONITORING
-- ============================================

-- Real-time metrics
CREATE TABLE real_time_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Metric type
    metric_type TEXT NOT NULL, -- active_bookings, online_users, tvl, revenue
    
    -- Value
    value DECIMAL(18,8) NOT NULL,
    currency TEXT,
    unit TEXT,
    
    -- Dimensions
    dimensions JSONB DEFAULT '{}'::jsonb,
    
    -- Timestamp
    recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Traffic analytics (GDPR compliant, first-party)
CREATE TABLE traffic_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Session
    session_id TEXT,
    user_id UUID REFERENCES profiles(id),
    
    -- Source
    source TEXT, -- organic, paid, social, direct, referral
    medium TEXT,
    campaign TEXT,
    
    -- UTM
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    utm_term TEXT,
    utm_content TEXT,
    
    -- Page
    page_path TEXT NOT NULL,
    page_title TEXT,
    referrer TEXT,
    
    -- Geo
    country TEXT,
    city TEXT,
    language TEXT,
    
    -- Device
    device_type TEXT, -- mobile, desktop, tablet
    browser TEXT,
    os TEXT,
    
    -- Engagement
    time_on_page INTEGER,
    scroll_depth INTEGER,
    
    -- Timestamp
    pageview_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Cookie consent
    consent_given BOOLEAN DEFAULT FALSE,
    
    -- Metadata
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Notifications
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    
    -- Type
    notification_type notification_type NOT NULL,
    
    -- Content
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    action_url TEXT,
    
    -- Status
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMPTZ,
    
    -- Delivery
    email_sent BOOLEAN DEFAULT FALSE,
    push_sent BOOLEAN DEFAULT FALSE,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ
);

-- ============================================
-- INDEXES
-- ============================================

-- Profiles
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_wallet ON profiles(wallet_address);
CREATE INDEX idx_profiles_role ON profiles(role);

-- Properties
CREATE INDEX idx_properties_host ON properties(host_id);
CREATE INDEX idx_properties_location ON properties(country, city);
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_properties_slug ON properties(slug);
CREATE INDEX idx_properties_geo ON properties(latitude, longitude);

-- Bookings
CREATE INDEX idx_bookings_guest ON bookings(guest_id);
CREATE INDEX idx_bookings_host ON bookings(host_id);
CREATE INDEX idx_bookings_property ON bookings(property_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_dates ON bookings(check_in_date, check_out_date);

-- Payments
CREATE INDEX idx_payments_user ON payments(user_id);
CREATE INDEX idx_payments_booking ON payments(booking_id);
CREATE INDEX idx_payments_status ON payments(status);

-- Reviews
CREATE INDEX idx_reviews_property ON reviews(property_id);
CREATE INDEX idx_reviews_reviewer ON reviews(reviewer_id);

-- AI Content
CREATE INDEX idx_ai_content_type ON ai_content(content_type);
CREATE INDEX idx_ai_content_published ON ai_content(published);

-- SEO Pages
CREATE INDEX idx_seo_pages_slug ON seo_pages(slug);
CREATE INDEX idx_seo_pages_language ON seo_pages(language);
CREATE INDEX idx_seo_pages_location ON seo_pages(target_city, target_country);

-- Real-time metrics
CREATE INDEX idx_metrics_type_time ON real_time_metrics(metric_type, recorded_at);

-- ============================================
-- COMMENTS
-- ============================================

COMMENT ON TABLE profiles IS 'User profiles with RBAC and Web3 wallet support';
COMMENT ON TABLE bookings IS 'Booking system with escrow state machine';
COMMENT ON TABLE safe_vaults IS 'DeFi vault positions for yield generation';
COMMENT ON TABLE ai_content IS 'AI-generated content for marketing and SEO';
COMMENT ON TABLE legal_documents IS 'Versioned legal documents with multi-language support';
