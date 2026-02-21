// ============================================
// OPENBOOKING REAL-TIME MONITORING
// WebSocket, Redis, Live Metrics
// ============================================

import { createClient, createServerClient } from '@/lib/supabase/client'
import type { Database } from '@/types/database'

// ============================================
// TYPES
// ============================================

export interface RealTimeMetrics {
  activeBookings: number
  onlineUsers: number
  tvl: number
  tvlCurrency: string
  revenue24h: number
  revenueTotal: number
  propertiesActive: number
  hostsActive: number
  guestsActive: number
}

export interface RealTimeEvent {
  type: 'booking_created' | 'booking_updated' | 'payment_received' | 'user_online' | 'user_offline'
  data: any
  timestamp: string
}

export interface DashboardStats {
  metrics: RealTimeMetrics
  recentBookings: Array<{
    id: string
    propertyTitle: string
    guestName: string
    amount: number
    status: string
    createdAt: string
  }>
  topProperties: Array<{
    id: string
    title: string
    bookings: number
    revenue: number
    rating: number
  }>
}

// ============================================
// METRICS SERVICE
// ============================================

export class MetricsService {
  private supabase
  
  constructor() {
    this.supabase = null as any
  }
  
  async init() {
    this.supabase = await createServerClient()
  }
  
  /**
   * Get all real-time metrics
   */
  async getMetrics(): Promise<RealTimeMetrics> {
    await this.init()
    
    // Active bookings (checked_in + completed)
    const { count: activeBookings } = await this.supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true })
      .in('status', ['checked_in', 'completed'])
    
    // TVL (escrow amounts)
    const { data: tvlData } = await this.supabase
      .from('bookings')
      .select('escrow_amount, currency')
      .in('status', ['payment_locked', 'confirmed', 'checked_in'])
    
    const tvl = tvlData?.reduce((sum, b) => sum + Number(b.escrow_amount || 0), 0) || 0
    const tvlCurrency = tvlData?.[0]?.currency || 'USD'
    
    // Active properties
    const { count: propertiesActive } = await this.supabase
      .from('properties')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active')
    
    // Active hosts (with at least one booking)
    const { count: hostsActive } = await this.supabase
      .from('host_profiles')
      .select('*', { count: 'exact', head: true })
      .gt('total_bookings', 0)
    
    // Active guests (with at least one booking)
    const { count: guestsActive } = await this.supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'client')
      .gt('total_bookings', 0)
    
    // Revenue (completed bookings)
    const { data: revenueData } = await this.supabase
      .from('bookings')
      .select('total_amount, completed_at')
      .eq('status', 'settled')
    
    const revenueTotal = revenueData?.reduce((sum, b) => sum + Number(b.total_amount), 0) || 0
    
    // 24h revenue
    const twentyFourHoursAgo = new Date()
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24)
    
    const revenue24h = revenueData
      ?.filter(b => b.completed_at && new Date(b.completed_at) > twentyFourHoursAgo)
      .reduce((sum, b) => sum + Number(b.total_amount), 0) || 0
    
    // Online users (mock - in production use Redis)
    const onlineUsers = await this.getOnlineUsersCount()
    
    return {
      activeBookings: activeBookings || 0,
      onlineUsers,
      tvl,
      tvlCurrency,
      revenue24h,
      revenueTotal,
      propertiesActive: propertiesActive || 0,
      hostsActive: hostsActive || 0,
      guestsActive: guestsActive || 0
    }
  }
  
  /**
   * Get online users count
   */
  async getOnlineUsersCount(): Promise<number> {
    // In production, use Redis for real-time tracking
    // For now, estimate based on recent activity
    await this.init()
    
    const fiveMinutesAgo = new Date()
    fiveMinutesAgo.setMinutes(fiveMinutesAgo.getMinutes() - 5)
    
    const { count } = await this.supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .gte('last_login_at', fiveMinutesAgo.toISOString())
    
    return count || 0
  }
  
  /**
   * Update metrics in database
   */
  async recordMetrics(metrics: Partial<RealTimeMetrics>): Promise<void> {
    await this.init()
    
    const records: Array<{ metric_type: string; value: number; currency?: string }> = []
    
    if (metrics.activeBookings !== undefined) {
      records.push({ metric_type: 'active_bookings', value: metrics.activeBookings })
    }
    
    if (metrics.onlineUsers !== undefined) {
      records.push({ metric_type: 'online_users', value: metrics.onlineUsers })
    }
    
    if (metrics.tvl !== undefined) {
      records.push({ 
        metric_type: 'tvl', 
        value: metrics.tvl, 
        currency: metrics.tvlCurrency || 'USD' 
      })
    }
    
    if (metrics.revenue24h !== undefined) {
      records.push({ metric_type: 'revenue_24h', value: metrics.revenue24h })
    }
    
    if (records.length > 0) {
      await this.supabase
        .from('real_time_metrics')
        .insert(records)
    }
  }
  
  /**
   * Get metrics history for charts
   */
  async getMetricsHistory(
    metricType: string,
    hours: number = 24
  ): Promise<Array<{ timestamp: string; value: number }>> {
    await this.init()
    
    const since = new Date()
    since.setHours(since.getHours() - hours)
    
    const { data } = await this.supabase
      .from('real_time_metrics')
      .select('value, recorded_at')
      .eq('metric_type', metricType)
      .gte('recorded_at', since.toISOString())
      .order('recorded_at', { ascending: true })
    
    return data?.map(d => ({
      timestamp: d.recorded_at,
      value: Number(d.value)
    })) || []
  }
}

// ============================================
// REAL-TIME SUBSCRIPTIONS
// ============================================

export class RealTimeSubscriptions {
  private supabase
  private subscriptions: Map<string, any> = new Map()
  
  constructor() {
    this.supabase = null as any
  }
  
  async init() {
    this.supabase = createClient()
  }
  
  /**
   * Subscribe to booking updates
   */
  onBookingUpdate(
    callback: (booking: Database['public']['Tables']['bookings']['Row']) => void
  ): () => void {
    const channel = this.supabase
      .channel('bookings_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookings'
        },
        (payload) => {
          callback(payload.new as Database['public']['Tables']['bookings']['Row'])
        }
      )
      .subscribe()
    
    this.subscriptions.set('bookings', channel)
    
    return () => {
      this.supabase.removeChannel(channel)
      this.subscriptions.delete('bookings')
    }
  }
  
  /**
   * Subscribe to payment updates
   */
  onPaymentUpdate(
    callback: (payment: Database['public']['Tables']['payments']['Row']) => void
  ): () => void {
    const channel = this.supabase
      .channel('payments_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'payments'
        },
        (payload) => {
          callback(payload.new as Database['public']['Tables']['payments']['Row'])
        }
      )
      .subscribe()
    
    this.subscriptions.set('payments', channel)
    
    return () => {
      this.supabase.removeChannel(channel)
      this.subscriptions.delete('payments')
    }
  }
  
  /**
   * Subscribe to notification updates for user
   */
  onNotificationUpdate(
    userId: string,
    callback: (notification: Database['public']['Tables']['notifications']['Row']) => void
  ): () => void {
    const channel = this.supabase
      .channel(`notifications:${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          callback(payload.new as Database['public']['Tables']['notifications']['Row'])
        }
      )
      .subscribe()
    
    this.subscriptions.set(`notifications:${userId}`, channel)
    
    return () => {
      this.supabase.removeChannel(channel)
      this.subscriptions.delete(`notifications:${userId}`)
    }
  }
  
  /**
   * Subscribe to TVL updates
   */
  onTVLUpdate(callback: (tvl: number) => void): () => void {
    const channel = this.supabase
      .channel('tvl_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookings'
        },
        async () => {
          // Recalculate TVL
          const { data } = await this.supabase
            .from('bookings')
            .select('escrow_amount')
            .in('status', ['payment_locked', 'confirmed', 'checked_in'])
          
          const tvl = data?.reduce((sum, b) => sum + Number(b.escrow_amount || 0), 0) || 0
          callback(tvl)
        }
      )
      .subscribe()
    
    this.subscriptions.set('tvl', channel)
    
    return () => {
      this.supabase.removeChannel(channel)
      this.subscriptions.delete('tvl')
    }
  }
  
  /**
   * Cleanup all subscriptions
   */
  cleanup() {
    this.subscriptions.forEach((channel) => {
      this.supabase.removeChannel(channel)
    })
    this.subscriptions.clear()
  }
}

// ============================================
// DASHBOARD SERVICE
// ============================================

export class DashboardService {
  private metricsService: MetricsService
  
  constructor() {
    this.metricsService = new MetricsService()
  }
  
  /**
   * Get complete dashboard data
   */
  async getDashboardData(): Promise<DashboardStats> {
    const metrics = await this.metricsService.getMetrics()
    
    const supabase = await createServerClient()
    
    // Recent bookings
    const { data: recentBookings } = await supabase
      .from('bookings')
      .select(`
        id,
        total_amount,
        status,
        created_at,
        property:properties (
          title
        ),
        guest:profiles!bookings_guest_id_fkey (
          first_name,
          last_name
        )
      `)
      .order('created_at', { ascending: false })
      .limit(10)
    
    // Top properties
    const { data: topProperties } = await supabase
      .from('properties')
      .select(`
        id,
        title,
        booking_count,
        rating_avg
      `)
      .eq('status', 'active')
      .order('booking_count', { ascending: false })
      .limit(5)
    
    return {
      metrics,
      recentBookings: recentBookings?.map(b => ({
        id: b.id,
        propertyTitle: (b.property as any)?.title || 'Unknown',
        guestName: `${(b.guest as any)?.first_name || ''} ${(b.guest as any)?.last_name || ''}`.trim() || 'Guest',
        amount: Number(b.total_amount),
        status: b.status,
        createdAt: b.created_at
      })) || [],
      topProperties: topProperties?.map(p => ({
        id: p.id,
        title: p.title,
        bookings: p.booking_count,
        revenue: 0, // Would need to calculate from bookings
        rating: Number(p.rating_avg)
      })) || []
    }
  }
}

// ============================================
// REDIS CLIENT (for production)
// ============================================

export class RedisClient {
  private client: any = null
  private connected: boolean = false
  
  async connect(): Promise<void> {
    if (this.connected) return
    
    try {
      // In production, use actual Redis
      // const { createClient } = await import('redis')
      // this.client = createClient({ url: process.env.REDIS_URL })
      // await this.client.connect()
      this.connected = true
    } catch (error) {
      console.warn('Redis connection failed, using fallback')
      this.connected = false
    }
  }
  
  async set(key: string, value: string, ttl?: number): Promise<void> {
    if (!this.connected) return
    
    try {
      if (ttl) {
        await this.client.setEx(key, ttl, value)
      } else {
        await this.client.set(key, value)
      }
    } catch {
      // Fallback
    }
  }
  
  async get(key: string): Promise<string | null> {
    if (!this.connected) return null
    
    try {
      return await this.client.get(key)
    } catch {
      return null
    }
  }
  
  async del(key: string): Promise<void> {
    if (!this.connected) return
    
    try {
      await this.client.del(key)
    } catch {
      // Fallback
    }
  }
  
  async incr(key: string): Promise<number> {
    if (!this.connected) return 0
    
    try {
      return await this.client.incr(key)
    } catch {
      return 0
    }
  }
  
  async publish(channel: string, message: string): Promise<void> {
    if (!this.connected) return
    
    try {
      await this.client.publish(channel, message)
    } catch {
      // Fallback
    }
  }
  
  async subscribe(channel: string, callback: (message: string) => void): Promise<void> {
    if (!this.connected) return
    
    try {
      await this.client.subscribe(channel, callback)
    } catch {
      // Fallback
    }
  }
  
  async disconnect(): Promise<void> {
    if (!this.connected) return
    
    try {
      await this.client.quit()
      this.connected = false
    } catch {
      // Fallback
    }
  }
}

// ============================================
// FOOTER METRICS COMPONENT DATA
// ============================================

export async function getFooterMetrics(): Promise<RealTimeMetrics> {
  const service = new MetricsService()
  return service.getMetrics()
}

// ============================================
// EVENT TRACKING
// ============================================

export async function trackEvent(
  eventType: string,
  eventData: Record<string, any>
): Promise<void> {
  const supabase = await createServerClient()
  
  await supabase
    .from('traffic_analytics')
    .insert({
      page_path: `/events/${eventType}`,
      metadata: eventData,
      consent_given: true
    })
}
