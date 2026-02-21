// ============================================
// OPENBOOKING SUPABASE UTILITIES
// Helper functions for common operations
// ============================================

import type { Database, user_role, booking_status } from '@/types/database'
import { createClient, createServerClient } from './client'

type Profile = Database['public']['Tables']['profiles']['Row']
type Booking = Database['public']['Tables']['bookings']['Row']
type Property = Database['public']['Tables']['properties']['Row']

// ============================================
// USER & PROFILE UTILITIES
// ============================================

export async function getCurrentUser(): Promise<Profile | null> {
  try {
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) return null
    
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
    
    return profile || null
  } catch {
    return null
  }
}

export async function getUserRole(userId: string): Promise<user_role | null> {
  const supabase = await createServerClient()
  
  const { data } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single()
  
  return data?.role || null
}

export async function hasRole(userId: string, roles: user_role[]): Promise<boolean> {
  const role = await getUserRole(userId)
  return role ? roles.includes(role) : false
}

export async function isAdmin(userId: string): Promise<boolean> {
  return hasRole(userId, ['admin', 'super_admin', 'moderator'])
}

export async function isHost(userId: string): Promise<boolean> {
  const supabase = await createServerClient()
  
  const { data } = await supabase
    .from('host_profiles')
    .select('id')
    .eq('id', userId)
    .single()
  
  return !!data
}

// ============================================
// BOOKING UTILITIES
// ============================================

export const BOOKING_STATE_MACHINE: Record<booking_status, booking_status[]> = {
  pending: ['payment_locked', 'cancelled'],
  payment_locked: ['confirmed', 'cancelled'],
  confirmed: ['checked_in', 'cancelled'],
  checked_in: ['completed', 'disputed'],
  completed: ['settled'],
  settled: [],
  cancelled: ['refunded'],
  disputed: ['refunded', 'completed'],
  refunded: []
}

export function canTransitionBooking(
  fromStatus: booking_status,
  toStatus: booking_status
): boolean {
  return BOOKING_STATE_MACHINE[fromStatus]?.includes(toStatus) || false
}

export function isBookingLocked(status: booking_status): boolean {
  // After check-in, booking cannot be cancelled by host/admin
  return ['checked_in', 'completed', 'settled'].includes(status)
}

export async function getBookingWithDetails(bookingId: string) {
  const supabase = await createServerClient()
  
  const { data: booking } = await supabase
    .from('bookings')
    .select(`
      *,
      property:properties (
        *,
        host:host_profiles (*)
      ),
      guest:profiles!bookings_guest_id_fkey (*),
      payments (*),
      reviews (*)
    `)
    .eq('id', bookingId)
    .single()
  
  return booking
}

// ============================================
// PROPERTY UTILITIES
// ============================================

export async function getProperties(filters?: {
  city?: string
  country?: string
  minPrice?: number
  maxPrice?: number
  guests?: number
  propertyType?: string
  limit?: number
  offset?: number
}) {
  const supabase = await createServerClient()
  
  let query = supabase
    .from('properties')
    .select(`
      *,
      host:host_profiles (
        id,
        business_name,
        verified,
        response_rate
      ),
      property_photos (
        url,
        is_primary
      ),
      reviews (
        rating
      )
    `)
    .eq('status', 'active')
    .order('rating_avg', { ascending: false })
  
  if (filters?.city) {
    query = query.ilike('city`, `%${filters.city}%`)
  }
  
  if (filters?.country) {
    query = query.eq('country', filters.country)
  }
  
  if (filters?.minPrice) {
    query = query.gte('base_price', filters.minPrice)
  }
  
  if (filters?.maxPrice) {
    query = query.lte('base_price', filters.maxPrice)
  }
  
  if (filters?.guests) {
    query = query.gte('guests', filters.guests)
  }
  
  if (filters?.propertyType) {
    query = query.eq('property_type', filters.propertyType)
  }
  
  if (filters?.limit) {
    query = query.limit(filters.limit)
  }
  
  if (filters?.offset) {
    query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1)
  }
  
  const { data, error } = await query
  
  if (error) throw error
  
  return data
}

export async function getPropertyBySlug(slug: string) {
  const supabase = await createServerClient()
  
  const { data } = await supabase
    .from('properties')
    .select(`
      *,
      host:host_profiles (
        *,
        profile:profiles (*)
      ),
      property_photos (
        *
      ),
      reviews (
        *,
        reviewer:profiles (*)
      )
    `)
    .eq('slug', slug)
    .eq('status', 'active')
    .single()
  
  return data
}

// ============================================
// REAL-TIME METRICS
// ============================================

export async function getRealTimeMetrics() {
  const supabase = await createServerClient()
  
  // Get latest metrics
  const { data: activeBookings } = await supabase
    .from('real_time_metrics')
    .select('value')
    .eq('metric_type', 'active_bookings')
    .order('recorded_at', { ascending: false })
    .limit(1)
    .single()
  
  const { data: tvl } = await supabase
    .from('real_time_metrics')
    .select('value, currency')
    .eq('metric_type', 'tvl')
    .order('recorded_at', { ascending: false })
    .limit(1)
    .single()
  
  const { data: onlineUsers } = await supabase.rpc('get_online_users_count')
  
  return {
    activeBookings: activeBookings?.value || 0,
    tvl: tvl?.value || 0,
    tvlCurrency: tvl?.currency || 'USD',
    onlineUsers: onlineUsers || 0
  }
}

// ============================================
// FINANCIAL UTILITIES
// ============================================

export async function getUserBalance(userId: string) {
  const supabase = await createServerClient()
  
  const { data: vaults } = await supabase
    .from('safe_vaults')
    .select('current_value, currency')
    .eq('user_id', userId)
    .eq('status', 'active')
  
  const totalBalance = vaults?.reduce((sum, vault) => sum + Number(vault.current_value), 0) || 0
  
  return {
    totalBalance,
    vaults: vaults || []
  }
}

export async function getBookingEscrowAmount(bookingId: string): Promise<number> {
  const supabase = await createServerClient()
  
  const { data } = await supabase
    .from('bookings')
    .select('escrow_amount')
    .eq('id', bookingId)
    .single()
  
  return Number(data?.escrow_amount || 0)
}

// ============================================
// NOTIFICATION UTILITIES
// ============================================

export async function createNotification(
  userId: string,
  type: Database['public']['Enums']['notification_type'],
  title: string,
  message: string,
  actionUrl?: string
) {
  const supabase = await createServerClient()
  
  const { data, error } = await supabase
    .from('notifications')
    .insert({
      user_id: userId,
      notification_type: type,
      title,
      message,
      action_url: actionUrl
    })
    .select()
    .single()
  
  if (error) throw error
  
  return data
}

export async function getUnreadNotificationCount(userId: string): Promise<number> {
  const supabase = await createServerClient()
  
  const { count } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('is_read', false)
  
  return count || 0
}

// ============================================
// WEB3 UTILITIES
// ============================================

export async function linkWallet(userId: string, walletAddress: string) {
  const supabase = await createServerClient()
  
  const { data, error } = await supabase
    .from('profiles')
    .update({
      wallet_address: walletAddress,
      wallet_connected_at: new Date().toISOString()
    })
    .eq('id', userId)
    .select()
    .single()
  
  if (error) throw error
  
  return data
}

export async function getUserByWallet(walletAddress: string) {
  const supabase = await createServerClient()
  
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('wallet_address', walletAddress.toLowerCase())
    .single()
  
  return data
}
