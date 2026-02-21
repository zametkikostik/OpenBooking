export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = 'client' | 'host' | 'admin';
export type BookingStatus = 'pending' | 'payment_locked' | 'checked_in' | 'completed' | 'settled' | 'cancelled';
export type PaymentStatus = 'pending' | 'processing' | 'confirmed' | 'failed' | 'refunded';
export type PaymentMethod = 'eth' | 'dai' | 'a7a5' | 'sbp' | 'mir' | 'yookassa' | 'sepa' | 'adyen' | 'klarna' | 'borica' | 'epay';
export type TransactionType = 'deposit' | 'payment' | 'escrow_lock' | 'escrow_release' | 'vault_deposit' | 'vault_withdraw' | 'fee' | 'refund';
export type ComplianceStatus = 'pending' | 'approved' | 'rejected' | 'flagged';
export type VaultStrategy = 'aave_supply' | 'aave_stable' | 'compound' | 'yearn' | 'hold';

export interface Profile {
  id: string;
  email: string;
  role: UserRole;
  full_name?: string;
  avatar_url?: string;
  phone?: string;
  country?: string;
  city?: string;
  verified: boolean;
  kyc_status: ComplianceStatus;
  wallet_address?: string;
  language: string;
  timezone: string;
  created_at: string;
  updated_at: string;
  last_login_at?: string;
}

export interface Property {
  id: string;
  host_id: string;
  title: string;
  description?: string;
  property_type: string;
  room_type?: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state?: string;
  postal_code?: string;
  country: string;
  latitude?: number;
  longitude?: number;
  bedrooms: number;
  bathrooms: number;
  max_guests: number;
  amenities: string[];
  photos: string[];
  price_per_night: number;
  currency: string;
  minimum_nights: number;
  maximum_nights: number;
  availability_calendar?: Json;
  instant_book: boolean;
  status: 'active' | 'inactive' | 'blocked' | 'deleted';
  rating: number;
  review_count: number;
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: string;
  property_id: string;
  guest_id: string;
  host_id: string;
  check_in_date: string;
  check_out_date: string;
  num_guests: number;
  num_nights: number;
  base_price: number;
  service_fee: number;
  cleaning_fee: number;
  total_price: number;
  currency: string;
  status: BookingStatus;
  payment_method?: PaymentMethod;
  special_requests?: string;
  cancellation_policy?: string;
  cancelled_at?: string;
  cancellation_reason?: string;
  checked_in_at?: string;
  checked_out_at?: string;
  created_at: string;
  updated_at: string;
}

export interface EscrowLedger {
  id: string;
  booking_id: string;
  amount: number;
  currency: string;
  asset_type: 'eth' | 'dai' | 'a7a5' | 'fiat';
  transaction_hash?: string;
  wallet_from?: string;
  wallet_to?: string;
  escrow_status: 'pending' | 'locked' | 'released' | 'refunded' | 'frozen';
  locked_at?: string;
  released_at?: string;
  released_to?: string;
  release_reason?: string;
  blockchain_network?: string;
  gas_fee?: number;
  confirmations: number;
  required_confirmations: number;
  metadata?: Json;
  created_at: string;
}

export interface PaymentTransaction {
  id: string;
  booking_id?: string;
  user_id: string;
  transaction_type: TransactionType;
  payment_method: PaymentMethod;
  amount: number;
  currency: string;
  fee_amount: number;
  net_amount: number;
  status: PaymentStatus;
  transaction_hash?: string;
  block_number?: number;
  from_address?: string;
  to_address?: string;
  gateway_reference?: string;
  gateway_response?: Json;
  error_message?: string;
  retry_count: number;
  idempotency_key?: string;
  metadata?: Json;
  processed_at?: string;
  created_at: string;
}

export interface Review {
  id: string;
  booking_id: string;
  property_id: string;
  guest_id: string;
  host_id: string;
  guest_review?: string;
  host_review?: string;
  guest_rating?: number;
  host_rating?: number;
  cleanliness_rating?: number;
  accuracy_rating?: number;
  communication_rating?: number;
  location_rating?: number;
  checkin_rating?: number;
  value_rating?: number;
  guest_review_visible: boolean;
  host_review_visible: boolean;
  response?: string;
  responded_at?: string;
  created_at: string;
  updated_at: string;
}

export interface VaultPool {
  id: string;
  name: string;
  description?: string;
  total_value_locked: number;
  total_deposited: number;
  total_yield_earned: number;
  average_apy?: number;
  risk_level: 'low' | 'medium' | 'high';
  strategies: VaultStrategy[];
  supported_assets: string[];
  min_deposit: number;
  max_deposit?: number;
  fee_percentage: number;
  status: 'active' | 'paused' | 'closed';
  protocol_integration?: string;
  contract_address?: string;
  created_at: string;
  updated_at: string;
}

export interface VaultPosition {
  id: string;
  pool_id: string;
  strategy: VaultStrategy;
  asset: string;
  deposited_amount: number;
  current_amount: number;
  yield_earned: number;
  apy?: number;
  risk_score: number;
  allocation_percentage?: number;
  protocol_address?: string;
  position_id?: string;
  transaction_hash?: string;
  last_sync_at?: string;
  status: 'active' | 'closed' | 'liquidated' | 'paused';
  metadata?: Json;
  created_at: string;
  updated_at: string;
}

export interface AiGeneratedContent {
  id: string;
  content_type: 'seo_page' | 'travel_guide' | 'ad_copy' | 'landing_page' | 'description' | 'review_response';
  target_type?: 'property' | 'city' | 'district' | 'seasonal' | 'general';
  target_id?: string;
  locale: string;
  title?: string;
  content: string;
  meta_description?: string;
  meta_keywords?: string[];
  schema_markup?: Json;
  open_graph?: Json;
  quality_score?: number;
  seo_score?: number;
  status: 'draft' | 'published' | 'archived' | 'rejected';
  model_version?: string;
  prompt_used?: string;
  tokens_used?: number;
  created_at: string;
  published_at?: string;
  updated_at: string;
}

export interface TrafficEvent {
  id: string;
  session_id: string;
  user_id?: string;
  event_type: string;
  page_path?: string;
  page_title?: string;
  referrer?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  device_type?: string;
  browser?: string;
  os?: string;
  screen_resolution?: string;
  viewport_size?: string;
  country?: string;
  region?: string;
  city?: string;
  language?: string;
  timezone?: string;
  ip_hash?: string;
  user_agent?: string;
  event_data?: Json;
  created_at: string;
}

export interface ComplianceLog {
  id: string;
  user_id?: string;
  entity_type: string;
  entity_id: string;
  action: string;
  status: ComplianceStatus;
  risk_score: number;
  risk_factors?: string[];
  reviewer_id?: string;
  review_notes?: string;
  metadata?: Json;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
  reviewed_at?: string;
}

export interface RealTimeMetric {
  id: string;
  metric_name: string;
  metric_value: number;
  unit?: string;
  delta_24h?: number;
  delta_percentage?: number;
  last_updated: string;
  metadata?: Json;
}

export interface DashboardMetrics {
  active_bookings: number;
  online_users: number;
  tvl: number;
  revenue: number;
  total_properties: number;
  total_users: number;
}
