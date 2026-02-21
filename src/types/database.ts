// ============================================
// OPENBOOKING DATABASE TYPES
// Generated from Supabase schema
// ============================================

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// ============================================
// ENUMS
// ============================================

export type user_role = 'client' | 'host' | 'admin' | 'moderator' | 'super_admin'

export type booking_status =
  | 'pending'
  | 'payment_locked'
  | 'confirmed'
  | 'checked_in'
  | 'completed'
  | 'settled'
  | 'cancelled'
  | 'disputed'
  | 'refunded'

export type payment_method =
  | 'usdt'
  | 'usdc'
  | 'eth'
  | 'obt_token'
  | 'a7a5_stable'
  | 'sbp'
  | 'mir'
  | 'yookassa'
  | 'sepa'
  | 'adyen'
  | 'klarna'
  | 'borica'
  | 'epay_bg'
  | 'visa'
  | 'mastercard'

export type payment_status =
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'refunded'
  | 'chargeback'

export type property_type =
  | 'apartment'
  | 'house'
  | 'hotel'
  | 'hostel'
  | 'resort'
  | 'villa'
  | 'cabin'
  | 'unique'

export type ai_content_type =
  | 'seo_page'
  | 'travel_guide'
  | 'ad_campaign'
  | 'property_description'
  | 'email_template'
  | 'social_post'

export type legal_doc_type =
  | 'terms_of_service'
  | 'privacy_policy'
  | 'host_agreement'
  | 'guest_agreement'
  | 'offer_contract'
  | 'cancellation_policy'
  | 'data_processing_agreement'

export type notification_type =
  | 'booking_update'
  | 'payment_received'
  | 'payment_sent'
  | 'review_request'
  | 'system_alert'
  | 'marketing'
  | 'security_alert'

// ============================================
// TABLE TYPES
// ============================================

export interface profiles {
  id: string
  email: string
  role: user_role
  first_name: string | null
  last_name: string | null
  phone: string | null
  avatar_url: string | null
  email_verified: boolean
  phone_verified: boolean
  identity_verified: boolean
  kyc_status: string
  wallet_address: string | null
  wallet_connected_at: string | null
  reputation_score: number
  total_bookings: number
  total_reviews: number
  preferred_language: string
  preferred_currency: string
  timezone: string
  created_at: string
  updated_at: string
  last_login_at: string | null
  metadata: Json
}

export interface host_profiles {
  id: string
  business_name: string | null
  business_type: string | null
  tax_id: string | null
  registration_number: string | null
  bank_account_encrypted: string | null
  payout_method: string | null
  total_properties: number
  total_bookings: number
  acceptance_rate: number
  response_rate: number
  response_time_minutes: number
  verified: boolean
  verified_at: string | null
  verification_documents: Json
  created_at: string
  updated_at: string
}

export interface properties {
  id: string
  host_id: string
  title: string
  description: string | null
  property_type: property_type
  country: string
  city: string
  district: string | null
  address: string | null
  postal_code: string | null
  latitude: number | null
  longitude: number | null
  guests: number
  bedrooms: number
  beds: number
  bathrooms: number
  amenities: Json
  base_price: number
  currency: string
  cleaning_fee: number
  service_fee: number
  security_deposit: number
  min_nights: number
  max_nights: number
  available_from: string | null
  available_to: string | null
  status: string
  verified: boolean
  slug: string | null
  meta_title: string | null
  meta_description: string | null
  view_count: number
  booking_count: number
  review_count: number
  rating_avg: number
  created_at: string
  updated_at: string
}

export interface property_photos {
  id: string
  property_id: string
  url: string
  thumbnail_url: string | null
  caption: string | null
  sort_order: number
  is_primary: boolean
  created_at: string
}

export interface bookings {
  id: string
  property_id: string
  guest_id: string
  host_id: string
  check_in_date: string
  check_out_date: string
  nights: number
  number_of_guests: number
  subtotal: number
  cleaning_fee: number
  service_fee: number
  taxes: number
  total_amount: number
  currency: string
  status: booking_status
  payment_method: payment_method | null
  payment_status: payment_status
  payment_id: string | null
  escrow_amount: number | null
  escrow_released_at: string | null
  escrow_released_amount: number | null
  blockchain_tx_hash: string | null
  blockchain_network: string | null
  smart_contract_event_id: string | null
  cancelled_by: string | null
  cancelled_at: string | null
  cancellation_reason: string | null
  guest_review_id: string | null
  host_review_id: string | null
  created_at: string
  updated_at: string
  confirmed_at: string | null
  checked_in_at: string | null
  completed_at: string | null
  metadata: Json
}

export interface booking_state_history {
  id: string
  booking_id: string
  from_status: booking_status | null
  to_status: booking_status
  triggered_by: string | null
  triggered_by_role: string | null
  reason: string | null
  metadata: Json
  created_at: string
}

export interface payments {
  id: string
  booking_id: string | null
  user_id: string
  amount: number
  currency: string
  fee_amount: number
  net_amount: number
  method: payment_method
  status: payment_status
  gateway_reference: string | null
  gateway_response: Json
  blockchain_tx_hash: string | null
  blockchain_confirmations: number
  token_contract: string | null
  created_at: string
  processed_at: string | null
  failed_at: string | null
  error_code: string | null
  error_message: string | null
  metadata: Json
}

export interface payouts {
  id: string
  host_id: string
  booking_id: string | null
  amount: number
  currency: string
  fee_amount: number
  net_amount: number
  status: string
  payout_method: string | null
  gateway_reference: string | null
  requested_at: string
  processed_at: string | null
  completed_at: string | null
  failed_at: string | null
  error_message: string | null
  metadata: Json
}

export interface safe_vaults {
  id: string
  user_id: string
  vault_name: string
  vault_type: string
  deposited_amount: number
  current_value: number
  yield_earned: number
  currency: string
  protocol: string | null
  protocol_position_id: string | null
  apy: number
  last_yield_update: string | null
  risk_score: string
  status: string
  created_at: string
  updated_at: string
}

export interface vault_transactions {
  id: string
  vault_id: string
  transaction_type: string
  amount: number
  currency: string
  blockchain_tx_hash: string | null
  created_at: string
  metadata: Json
}

export interface reviews {
  id: string
  booking_id: string
  property_id: string
  reviewer_id: string
  reviewee_id: string
  review_type: string
  rating: number
  title: string | null
  content: string | null
  cleanliness: number | null
  accuracy: number | null
  communication: number | null
  location_rating: number | null
  check_in: number | null
  value: number | null
  response: string | null
  response_at: string | null
  is_public: boolean
  is_verified: boolean
  created_at: string
  updated_at: string
}

export interface ai_content {
  id: string
  content_type: ai_content_type
  target_type: string | null
  target_id: string | null
  title: string | null
  content: string
  metadata: Json
  keywords: Json
  meta_title: string | null
  meta_description: string | null
  model_used: string | null
  prompt_used: string | null
  generation_params: Json
  quality_score: number | null
  human_edited: boolean
  published: boolean
  views: number
  conversions: number
  created_at: string
  updated_at: string
}

export interface seo_pages {
  id: string
  slug: string
  path: string
  language: string
  locale_path: string | null
  title: string
  description: string | null
  content: string | null
  h1: string | null
  meta_title: string | null
  meta_description: string | null
  canonical_url: string | null
  keywords: Json
  og_image: string | null
  schema_markup: Json
  target_city: string | null
  target_district: string | null
  target_country: string | null
  seasonality: string | null
  views: number
  organic_traffic: number
  conversion_rate: number
  status: string
  published_at: string | null
  created_at: string
  updated_at: string
}

export interface legal_documents {
  id: string
  doc_type: legal_doc_type
  version: string
  previous_version_id: string | null
  language: string
  title: string
  content: string
  summary: string | null
  effective_date: string | null
  expiry_date: string | null
  jurisdiction: string | null
  status: string
  is_required: boolean
  acceptance_required_for: string[]
  created_at: string
  updated_at: string
  published_at: string | null
  metadata: Json
}

export interface document_acceptances {
  id: string
  document_id: string
  user_id: string
  accepted: boolean
  accepted_at: string
  ip_address: string | null
  user_agent: string | null
  document_version: string
  metadata: Json
}

export interface real_time_metrics {
  id: string
  metric_type: string
  value: number
  currency: string | null
  unit: string | null
  dimensions: Json
  recorded_at: string
}

export interface traffic_analytics {
  id: string
  session_id: string | null
  user_id: string | null
  source: string | null
  medium: string | null
  campaign: string | null
  utm_source: string | null
  utm_medium: string | null
  utm_campaign: string | null
  utm_term: string | null
  utm_content: string | null
  page_path: string
  page_title: string | null
  referrer: string | null
  country: string | null
  city: string | null
  language: string | null
  device_type: string | null
  browser: string | null
  os: string | null
  time_on_page: number | null
  scroll_depth: number | null
  pageview_at: string
  consent_given: boolean
  metadata: Json
}

export interface notifications {
  id: string
  user_id: string
  notification_type: notification_type
  title: string
  message: string
  action_url: string | null
  is_read: boolean
  read_at: string | null
  email_sent: boolean
  push_sent: boolean
  created_at: string
  expires_at: string | null
}

// ============================================
// DATABASE SCHEMA TYPE
// ============================================

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: profiles
        Insert: Omit<profiles, 'created_at' | 'updated_at'>
        Update: Partial<Omit<profiles, 'created_at'>>
      }
      host_profiles: {
        Row: host_profiles
        Insert: Omit<host_profiles, 'created_at' | 'updated_at'>
        Update: Partial<Omit<host_profiles, 'created_at'>>
      }
      properties: {
        Row: properties
        Insert: Omit<properties, 'created_at' | 'updated_at' | 'slug'>
        Update: Partial<Omit<properties, 'created_at'>>
      }
      property_photos: {
        Row: property_photos
        Insert: Omit<property_photos, 'created_at'>
        Update: Partial<Omit<property_photos, 'created_at'>>
      }
      bookings: {
        Row: bookings
        Insert: Omit<bookings, 'created_at' | 'updated_at'>
        Update: Partial<Omit<bookings, 'created_at'>>
      }
      booking_state_history: {
        Row: booking_state_history
        Insert: Omit<booking_state_history, 'created_at'>
        Update: Partial<Omit<booking_state_history, 'created_at'>>
      }
      payments: {
        Row: payments
        Insert: Omit<payments, 'created_at'>
        Update: Partial<Omit<payments, 'created_at'>>
      }
      payouts: {
        Row: payouts
        Insert: Omit<payouts, 'requested_at'>
        Update: Partial<Omit<payouts, 'requested_at'>>
      }
      safe_vaults: {
        Row: safe_vaults
        Insert: Omit<safe_vaults, 'created_at' | 'updated_at'>
        Update: Partial<Omit<safe_vaults, 'created_at'>>
      }
      vault_transactions: {
        Row: vault_transactions
        Insert: Omit<vault_transactions, 'created_at'>
        Update: Partial<Omit<vault_transactions, 'created_at'>>
      }
      reviews: {
        Row: reviews
        Insert: Omit<reviews, 'created_at' | 'updated_at'>
        Update: Partial<Omit<reviews, 'created_at'>>
      }
      ai_content: {
        Row: ai_content
        Insert: Omit<ai_content, 'created_at' | 'updated_at'>
        Update: Partial<Omit<ai_content, 'created_at'>>
      }
      seo_pages: {
        Row: seo_pages
        Insert: Omit<seo_pages, 'created_at' | 'updated_at'>
        Update: Partial<Omit<seo_pages, 'created_at'>>
      }
      legal_documents: {
        Row: legal_documents
        Insert: Omit<legal_documents, 'created_at' | 'updated_at'>
        Update: Partial<Omit<legal_documents, 'created_at'>>
      }
      document_acceptances: {
        Row: document_acceptances
        Insert: Omit<document_acceptances, 'accepted_at'>
        Update: Partial<Omit<document_acceptances, 'accepted_at'>>
      }
      real_time_metrics: {
        Row: real_time_metrics
        Insert: Omit<real_time_metrics, 'recorded_at'>
        Update: Partial<Omit<real_time_metrics, 'recorded_at'>>
      }
      traffic_analytics: {
        Row: traffic_analytics
        Insert: Omit<traffic_analytics, 'pageview_at'>
        Update: Partial<Omit<traffic_analytics, 'pageview_at'>>
      }
      notifications: {
        Row: notifications
        Insert: Omit<notifications, 'created_at'>
        Update: Partial<Omit<notifications, 'created_at'>>
      }
    }
    Views: {}
    Functions: {
      generate_slug: {
        Args: { text: string }
        Returns: string
      }
      transition_booking_state: {
        Args: {
          p_booking_id: string
          p_new_status: booking_status
          p_user_id?: string
          p_reason?: string
        }
        Returns: boolean
      }
      create_booking: {
        Args: {
          p_property_id: string
          p_guest_id: string
          p_check_in_date: string
          p_check_out_date: string
          p_number_of_guests: number
          p_payment_method: payment_method
        }
        Returns: string
      }
      process_payment: {
        Args: {
          p_booking_id: string
          p_payment_method: payment_method
          p_gateway_reference?: string
        }
        Returns: boolean
      }
      release_escrow: {
        Args: {
          p_booking_id: string
        }
        Returns: boolean
      }
      create_property: {
        Args: {
          p_host_id: string
          p_title: string
          p_description: string
          p_property_type: property_type
          p_country: string
          p_city: string
          p_base_price: number
          p_guests: number
          p_bedrooms?: number
          p_beds?: number
          p_bathrooms?: number
        }
        Returns: string
      }
      update_reputation_score: {
        Args: {
          p_user_id: string
        }
        Returns: void
      }
    }
    Enums: {
      user_role: user_role
      booking_status: booking_status
      payment_method: payment_method
      payment_status: payment_status
      property_type: property_type
      ai_content_type: ai_content_type
      legal_doc_type: legal_doc_type
      notification_type: notification_type
    }
  }
}
