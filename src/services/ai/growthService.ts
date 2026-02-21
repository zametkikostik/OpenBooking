import { createClient } from '@/lib/supabase'
import { AnalyticsEvent } from '@/types/database'
import { hashIP } from '@/lib/utils'

// Growth Analytics Service
export interface FunnelStep {
  name: string
  users: number
  conversion: number
}

export interface GrowthMetrics {
  cac: number // Customer Acquisition Cost
  ltv: number // Lifetime Value
  ltvToCac: number
  monthlyGrowthRate: number
  churnRate: number
  retentionRate: number
}

export class GrowthService {
  private supabase: any

  constructor() {
    this.supabase = createClient()
  }

  // Track analytics event
  async trackEvent(event: {
    event_type: string
    user_id?: string
    session_id?: string
    page_url?: string
    referrer?: string
    utm?: {
      source?: string
      medium?: string
      campaign?: string
      content?: string
      term?: string
    }
    device?: {
      type?: string
      browser?: string
      os?: string
    }
    location?: {
      country?: string
      city?: string
    }
    metadata?: Record<string, any>
  }): Promise<void> {
    const eventData: Partial<AnalyticsEvent> = {
      event_type: event.event_type,
      user_id: event.user_id,
      session_id: event.session_id,
      page_url: event.page_url,
      referrer: event.referrer,
      utm_source: event.utm?.source,
      utm_medium: event.utm?.medium,
      utm_campaign: event.utm?.campaign,
      utm_content: event.utm?.content,
      utm_term: event.utm?.term,
      device_type: event.device?.type,
      browser: event.device?.browser,
      os: event.device?.os,
      country: event.location?.country,
      city: event.location?.city,
      ip_hash: event.metadata?.ip ? hashIP(event.metadata.ip) : undefined,
      metadata: event.metadata || {},
    }

    await this.supabase.from('analytics_events').insert(eventData)
  }

  // Calculate conversion funnel
  async getFunnel(params: {
    startDate: Date
    endDate: Date
    steps: string[]
  }): Promise<FunnelStep[]> {
    const funnel: FunnelStep[] = []
    let previousUsers = 0

    for (const step of params.steps) {
      const { count } = await this.supabase
        .from('analytics_events')
        .select('*', { count: 'exact', head: true })
        .eq('event_type', step)
        .gte('created_at', params.startDate.toISOString())
        .lte('created_at', params.endDate.toISOString())

      const users = count || 0
      const conversion = previousUsers > 0 ? (users / previousUsers) * 100 : 0

      funnel.push({
        name: step,
        users,
        conversion,
      })

      previousUsers = users
    }

    return funnel
  }

  // Calculate growth metrics
  async getGrowthMetrics(period: {
    start: Date
    end: Date
  }): Promise<GrowthMetrics> {
    // Get new users count
    const { count: newUsers } = await this.supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', period.start.toISOString())
      .lte('created_at', period.end.toISOString())

    // Get marketing spend (from a hypothetical table)
    const marketingSpend = await this.getMarketingSpend(period)

    // Calculate CAC
    const cac = newUsers ? marketingSpend / newUsers : 0

    // Calculate LTV (simplified)
    const ltv = await this.calculateLTV()

    // Get retention data
    const retentionRate = await this.calculateRetentionRate(period)

    return {
      cac,
      ltv,
      ltvToCac: cac ? ltv / cac : 0,
      monthlyGrowthRate: await this.calculateGrowthRate(period),
      churnRate: await this.calculateChurnRate(period),
      retentionRate,
    }
  }

  // A/B Test Analysis
  async analyzeABTest(params: {
    testId: string
    variant: 'A' | 'B'
    metric: string
  }): Promise<{
    variant: string
    users: number
    conversions: number
    conversionRate: number
    confidence?: number
  }> {
    // Get users in variant
    const { data: variantUsers } = await this.supabase
      .from('analytics_events')
      .select('user_id, metadata')
      .eq('event_type', 'ab_test_view')
      .eq('metadata->test_id', params.testId)
      .eq('metadata->variant', params.variant)

    const userIds = variantUsers?.map((u: any) => u.user_id) || []
    const uniqueUsers = new Set(userIds).size

    // Get conversions
    const { count: conversions } = await this.supabase
      .from('analytics_events')
      .select('*', { count: 'exact', head: true })
      .in('user_id', userIds)
      .eq('event_type', params.metric)

    const conversionRate = uniqueUsers ? (conversions || 0) / uniqueUsers * 100 : 0

    return {
      variant: params.variant,
      users: uniqueUsers,
      conversions: conversions || 0,
      conversionRate,
    }
  }

  // Traffic source analysis
  async getTrafficSources(params: {
    startDate: Date
    endDate: Date
  }): Promise<{ source: string; users: number; percentage: number }[]> {
    const { data } = await this.supabase
      .from('analytics_events')
      .select('utm_source, utm_medium, referrer')
      .gte('created_at', params.startDate.toISOString())
      .lte('created_at', params.endDate.toISOString())

    const sources: Record<string, number> = {}
    let total = 0

    data?.forEach((event: any) => {
      const source = event.utmsource || 
                    (event.referrer ? new URL(event.referrer).hostname : 'direct')
      sources[source] = (sources[source] || 0) + 1
      total++
    })

    return Object.entries(sources)
      .map(([source, users]) => ({
        source,
        users,
        percentage: total ? (users / total) * 100 : 0,
      }))
      .sort((a, b) => b.users - a.users)
  }

  // Geographic analysis
  async getGeographicData(params: {
    startDate: Date
    endDate: Date
  }): Promise<{ country: string; city?: string; users: number }[]> {
    const { data } = await this.supabase
      .from('analytics_events')
      .select('country, city')
      .gte('created_at', params.startDate.toISOString())
      .lte('created_at', params.endDate.toISOString())

    const geoData: Record<string, Record<string, number>> = {}

    data?.forEach((event: any) => {
      if (!event.country) return
      if (!geoData[event.country]) geoData[event.country] = {}
      const city = event.city || 'Unknown'
      geoData[event.country][city] = (geoData[event.country][city] || 0) + 1
    })

    const result: any[] = []
    Object.entries(geoData).forEach(([country, cities]) => {
      const totalUsers = Object.values(cities).reduce((a: number, b: number) => a + b, 0)
      result.push({ country, users: totalUsers })
      
      Object.entries(cities).forEach(([city, users]) => {
        result.push({ country, city, users })
      })
    })

    return result.sort((a, b) => b.users - a.users)
  }

  // Private helper methods
  private async getMarketingSpend(period: { start: Date; end: Date }): Promise<number> {
    // Placeholder - would integrate with ad platforms
    return 10000
  }

  private async calculateLTV(): Promise<number> {
    // Simplified LTV calculation
    const { data: bookings } = await this.supabase
      .from('bookings')
      .select('total_amount, guest_id')

    if (!bookings?.length) return 0

    const avgOrderValue = bookings.reduce((sum: number, b: any) => sum + b.total_amount, 0) / bookings.length
    const uniqueCustomers = new Set(bookings.map((b: any) => b.guest_id)).size
    const avgOrdersPerCustomer = bookings.length / uniqueCustomers

    // LTV = Avg Order Value × Avg Orders per Customer × Gross Margin
    return avgOrderValue * avgOrdersPerCustomer * 0.7 // 70% margin
  }

  private async calculateRetentionRate(period: { start: Date; end: Date }): Promise<number> {
    // Calculate based on repeat bookings
    const { data: bookings } = await this.supabase
      .from('bookings')
      .select('guest_id, created_at')
      .gte('created_at', period.start.toISOString())
      .lte('created_at', period.end.toISOString())

    if (!bookings?.length) return 0

    const customerBookings: Record<string, number> = {}
    bookings.forEach((b: any) => {
      customerBookings[b.guest_id] = (customerBookings[b.guest_id] || 0) + 1
    })

    const repeatCustomers = Object.values(customerBookings).filter((c: number) => c > 1).length
    const totalCustomers = Object.keys(customerBookings).length

    return (repeatCustomers / totalCustomers) * 100
  }

  private async calculateChurnRate(period: { start: Date; end: Date }): Promise<number> {
    // Simplified churn calculation
    return 5.0 // Placeholder
  }

  private async calculateGrowthRate(period: { start: Date; end: Date }): Promise<number> {
    const { count: startUsers } = await this.supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .lt('created_at', period.start.toISOString())

    const { count: endUsers } = await this.supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .lte('created_at', period.end.toISOString())

    if (!startUsers || startUsers === 0) return 0

    return ((endUsers - startUsers) / startUsers) * 100
  }
}

// AI Search Traffic Analyzer
export class AISearchAnalyzer {
  private supabase: any

  constructor() {
    this.supabase = createClient()
  }

  // Track AI search queries
  async trackSearchQuery(params: {
    query: string
    results_count: number
    user_id?: string
    session_id?: string
  }): Promise<void> {
    await this.supabase.from('analytics_events').insert({
      event_type: 'ai_search',
      user_id: params.user_id,
      session_id: params.session_id,
      metadata: {
        query: params.query,
        results_count: params.results_count,
      },
    })
  }

  // Get popular search queries
  async getPopularQueries(params: {
    limit?: number
    startDate?: Date
  }): Promise<{ query: string; count: number; avgResults: number }[]> {
    const { data } = await this.supabase
      .from('analytics_events')
      .select('metadata')
      .eq('event_type', 'ai_search')
      .gte('created_at', params.startDate?.toISOString() || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
      .limit(params.limit || 100)

    const queries: Record<string, { count: number; totalResults: number }> = {}

    data?.forEach((event: any) => {
      const query = event.metadata?.query
      if (!query) return

      if (!queries[query]) {
        queries[query] = { count: 0, totalResults: 0 }
      }
      queries[query].count++
      queries[query].totalResults += event.metadata?.results_count || 0
    })

    return Object.entries(queries)
      .map(([query, data]) => ({
        query,
        count: data.count,
        avgResults: data.totalResults / data.count,
      }))
      .sort((a, b) => b.count - a.count)
  }
}
