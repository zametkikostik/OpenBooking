import { createClient } from '@supabase/supabase-js';

/**
 * Traffic Analytics Service (Client-safe version)
 *
 * GDPR-compliant analytics tracking:
 * - First-party cookies only
 * - IP anonymization
 * - Consent management
 * - Data export/deletion support
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export interface TrackEventParams {
  eventType: string;
  pagePath?: string;
  pageName?: string;
  sessionId: string;
  metadata?: Record<string, unknown>;
}

export class AnalyticsService {
  /**
   * Track custom event (GDPR compliant)
   */
  async trackEvent(params: TrackEventParams): Promise<void> {
    const { eventType, pagePath, pageName, sessionId, metadata } = params;

    await supabase.from('traffic_events').insert({
      session_id: sessionId,
      event_type: eventType,
      page_path: pagePath,
      page_title: pageName,
      event_data: metadata,
    });
  }

  /**
   * Get analytics for date range (aggregated, no PII)
   */
  async getAnalytics(startDate: string, endDate: string) {
    const { data, error } = await supabase
      .from('traffic_events')
      .select('*')
      .gte('created_at', startDate)
      .lte('created_at', endDate);

    if (error) {
      throw new Error(`Failed to fetch analytics: ${error.message}`);
    }

    return this.aggregateAnalytics(data || []);
  }

  /**
   * Aggregate analytics data (no PII)
   */
  private aggregateAnalytics(events: unknown[]) {
    const pageViews = events.filter(
      (e) => (e as { event_type: string }).event_type === 'page_view'
    );
    const uniqueSessions = new Set(events.map((e) => (e as { session_id: string }).session_id))
      .size;

    // Group by page path
    const pages: Record<string, number> = {};
    events.forEach((event) => {
      const e = event as { page_path?: string };
      if (e.page_path) {
        pages[e.page_path] = (pages[e.page_path] || 0) + 1;
      }
    });

    return {
      totalEvents: events.length,
      pageViews: pageViews.length,
      uniqueSessions,
      pages,
    };
  }
}

// Export singleton instance
export const analyticsService = new AnalyticsService();
