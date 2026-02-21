// OpenBooking Database Types
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type UserRole = 'client' | 'host' | 'admin'
export type BookingStatus = 'pending' | 'payment_locked' | 'checked_in' | 'completed' | 'settled' | 'cancelled'
export type PaymentMethod = 'usdt' | 'usdc' | 'eth' | 'openbooking_token' | 'a7a5_stablecoin' | 'sbp' | 'sepa' | 'mir' | 'yookassa' | 'klarna' | 'epay_bg' | 'borica' | 'adyen'
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded'
export type Currency = 'USD' | 'EUR' | 'RUB' | 'BGN' | 'GBP' | 'ETH' | 'USDT' | 'USDC' | 'A7A5' | 'OPENBOOKING'

export interface Profile {
  id: string
  email: string
  full_name: string | null
  role: UserRole
  reputation_score: number
  kyc_verified: boolean
  language: string
  created_at: string
  updated_at: string
}

export interface Property {
  id: string
  host_id: string
  title: Json
  description: Json
  address: Json
  price_per_night: number
  currency: Currency
  status: string
  rating: number
  created_at: string
}

export interface Booking {
  id: string
  property_id: string
  guest_id: string
  host_id: string
  check_in_date: string
  check_out_date: string
  total_amount: number
  status: BookingStatus
  created_at: string
}

export interface Database {
  public: {
    Tables: {
      profiles: { Row: Profile; Insert: Partial<Profile>; Update: Partial<Profile> }
      properties: { Row: Property; Insert: Partial<Property>; Update: Partial<Property> }
      bookings: { Row: Booking; Insert: Partial<Booking>; Update: Partial<Booking> }
    }
  }
}
