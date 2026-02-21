// OpenBooking Database Types
// Generated from Supabase schema

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// Enums
export type UserRole = 'client' | 'host' | 'admin'
export type BookingStatus = 'pending' | 'payment_locked' | 'checked_in' | 'completed' | 'settled' | 'cancelled'
export type PaymentMethod = 'usdt' | 'usdc' | 'eth' | 'openbooking_token' | 'a7a5_stablecoin' | 'sbp' | 'sepa' | 'mir' | 'yookassa' | 'klarna' | 'epay_bg' | 'borica' | 'adyen'
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded'
export type Currency = 'USD' | 'EUR' | 'RUB' | 'BGN' | 'GBP' | 'ETH' | 'USDT' | 'USDC' | 'A7A5' | 'OPENBOOKING'
export type RiskScore = 'low' | 'medium' | 'high'
export type VaultStatus = 'active' | 'locked' | 'withdrawn'
export type PropertyStatus = 'active' | 'inactive' | 'suspended'

// Database Tables
export interface Profile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  role: UserRole
  phone: string | null
  country: string | null
  language: string
  kyc_verified: boolean
  kyc_data: Json | null
  reputation_score: number
  total_bookings: number
  total_revenue: number
  created_at: string
  updated_at: string
}

export interface Property {
  id: string
  host_id: string
  title: Json // Multilingual: {en: string, ru: string, ...}
  description: Json
  address: Json // {street, city, country, postal_code, coordinates}
  property_type: string
  room_type: string
  max_guests: number
  bedrooms: number
  beds: number
  bathrooms: number
  amenities: string[]
  photos: string[]
  price_per_night: number
  currency: Currency
  min_nights: number
  max_nights: number
  instant_book: boolean
  status: PropertyStatus
  rating: number
  review_count: number
  seo_slug: string | null
  created_at: string
  updated_at: string
}

export interface Booking {
  id: string
  property_id: string
  guest_id: string
  host_id: string
  check_in_date: string
  check_out_date: string
  guests: number
  subtotal: number
  service_fee: number
  cleaning_fee: number
  total_amount: number
  currency: Currency
  status: BookingStatus
  payment_method: PaymentMethod | null
  payment_status: PaymentStatus
  cancellation_policy: string | null
  special_requests: string | null
  escrow_wallet_address: string | null
  smart_contract_tx_hash: string | null
  checked_in_at: string | null
  checked_out_at: string | null
  settled_at: string | null
  cancelled_at: string | null
  cancel_reason: string | null
  metadata: Json
  created_at: string
  updated_at: string
}

export interface PaymentTransaction {
  id: string
  booking_id: string
  user_id: string
  amount: number
  currency: Currency
  method: PaymentMethod
  status: PaymentStatus
  direction: string // 'inbound' | 'outbound'
  blockchain_tx_hash: string | null
  blockchain_network: string | null
  wallet_address: string | null
  fiat_reference: string | null
  processor_response: Json | null
  escrow_release_at: string | null
  created_at: string
  updated_at: string
}

export interface SafeVault {
  id: string
  user_id: string
  vault_name: string
  protocol: string // 'aave', 'compound', etc.
  deposited_amount: number
  deposited_currency: Currency
  current_value_usd: number
  apy: number
  yield_earned: number
  risk_score: RiskScore
  lock_period_days: number
  unlocked_at: string | null
  status: VaultStatus
  contract_address: string | null
  metadata: Json
  created_at: string
  updated_at: string
}

export interface VaultTransaction {
  id: string
  vault_id: string
  type: string // 'deposit' | 'withdraw' | 'yield'
  amount: number
  currency: Currency
  tx_hash: string | null
  created_at: string
}

export interface Review {
  id: string
  booking_id: string
  property_id: string
  guest_id: string
  host_id: string
  rating: number
  cleanliness_rating: number | null
  accuracy_rating: number | null
  communication_rating: number | null
  location_rating: number | null
  checkin_rating: number | null
  value_rating: number | null
  comment: string | null
  host_response: string | null
  host_response_at: string | null
  is_verified: boolean
  helpful_count: number
  created_at: string
}

export interface ReputationEvent {
  id: string
  user_id: string
  event_type: string
  points_change: number
  previous_score: number | null
  new_score: number | null
  reference_id: string | null
  metadata: Json
  created_at: string
}

export interface AIContent {
  id: string
  content_type: string
  reference_id: string | null
  language: string
  title: string | null
  body: string | null
  metadata: Json
  quality_score: number | null
  is_published: boolean
  created_at: string
  updated_at: string
}

export interface SEOPage {
  id: string
  page_type: string
  slug: string
  language: string
  title: string
  meta_description: string | null
  h1: string | null
  content: Json
  schema_markup: Json | null
  og_image: string | null
  canonical_url: string | null
  hreflang: string[] | null
  traffic_data: Json | null
  created_at: string
  updated_at: string
}

export interface AnalyticsEvent {
  id: string
  event_type: string
  user_id: string | null
  session_id: string | null
  page_url: string | null
  referrer: string | null
  utm_source: string | null
  utm_medium: string | null
  utm_campaign: string | null
  utm_content: string | null
  utm_term: string | null
  device_type: string | null
  browser: string | null
  os: string | null
  country: string | null
  city: string | null
  ip_hash: string | null
  metadata: Json
  created_at: string
}

export interface LegalDocument {
  id: string
  document_type: string
  version: string
  language: string
  title: string
  content: string
  is_active: boolean
  effective_from: string | null
  effective_until: string | null
  requires_acceptance: boolean
  metadata: Json
  created_at: string
  updated_at: string
}

export interface DocumentAcceptance {
  id: string
  user_id: string
  document_id: string
  accepted_at: string
  ip_address: string | null
  user_agent: string | null
}

export interface ComplianceLog {
  id: string
  user_id: string
  check_type: string
  status: string
  provider: string | null
  risk_score: number | null
  details: Json
  reviewed_by: string | null
  reviewed_at: string | null
  created_at: string
}

export interface Notification {
  id: string
  user_id: string
  type: string
  title: string
  message: string
  data: Json
  is_read: boolean
  read_at: string | null
  channel: string[]
  created_at: string
}

export interface PlatformMetrics {
  id: number
  active_bookings: number
  online_users: number
  tvl_usd: number
  total_revenue_usd: number
  total_properties: number
  total_users: number
  last_updated: string
}

// Database Schema Type
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: Omit<Profile, 'created_at' | 'updated_at'>
        Update: Partial<Omit<Profile, 'created_at'>>
      }
      properties: {
        Row: Property
        Insert: Omit<Property, 'created_at' | 'updated_at'>
        Update: Partial<Omit<Property, 'created_at'>>
      }
      bookings: {
        Row: Booking
        Insert: Omit<Booking, 'created_at' | 'updated_at'>
        Update: Partial<Omit<Booking, 'created_at'>>
      }
      payment_transactions: {
        Row: PaymentTransaction
        Insert: Omit<PaymentTransaction, 'created_at' | 'updated_at'>
        Update: Partial<Omit<PaymentTransaction, 'created_at'>>
      }
      safe_vaults: {
        Row: SafeVault
        Insert: Omit<SafeVault, 'created_at' | 'updated_at'>
        Update: Partial<Omit<SafeVault, 'created_at'>>
      }
      vault_transactions: {
        Row: VaultTransaction
        Insert: Omit<VaultTransaction, 'created_at'>
        Update: Partial<VaultTransaction>
      }
      reviews: {
        Row: Review
        Insert: Omit<Review, 'created_at'>
        Update: Partial<Review>
      }
      reputation_events: {
        Row: ReputationEvent
        Insert: Omit<ReputationEvent, 'created_at'>
        Update: Partial<ReputationEvent>
      }
      ai_content: {
        Row: AIContent
        Insert: Omit<AIContent, 'created_at' | 'updated_at'>
        Update: Partial<Omit<AIContent, 'created_at'>>
      }
      seo_pages: {
        Row: SEOPage
        Insert: Omit<SEOPage, 'created_at' | 'updated_at'>
        Update: Partial<Omit<SEOPage, 'created_at'>>
      }
      analytics_events: {
        Row: AnalyticsEvent
        Insert: Omit<AnalyticsEvent, 'created_at'>
        Update: Partial<AnalyticsEvent>
      }
      legal_documents: {
        Row: LegalDocument
        Insert: Omit<LegalDocument, 'created_at' | 'updated_at'>
        Update: Partial<Omit<LegalDocument, 'created_at'>>
      }
      document_acceptances: {
        Row: DocumentAcceptance
        Insert: Omit<DocumentAcceptance, 'created_at' | 'accepted_at'>
        Update: Partial<DocumentAcceptance>
      }
      compliance_logs: {
        Row: ComplianceLog
        Insert: Omit<ComplianceLog, 'created_at'>
        Update: Partial<ComplianceLog>
      }
      notifications: {
        Row: Notification
        Insert: Omit<Notification, 'created_at'>
        Update: Partial<Notification>
      }
      platform_metrics: {
        Row: PlatformMetrics
        Insert: PlatformMetrics
        Update: Partial<PlatformMetrics>
      }
    }
    Views: {}
    Functions: {}
  }
}
