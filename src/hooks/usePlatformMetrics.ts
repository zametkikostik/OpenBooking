'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { PlatformMetrics } from '@/types/database'

export function usePlatformMetrics() {
  const [metrics, setMetrics] = useState<PlatformMetrics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    // Load initial metrics
    loadMetrics()

    // Subscribe to real-time updates
    const channel = supabase
      .channel('platform_metrics')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'platform_metrics',
        },
        (payload) => {
          setMetrics(payload.new as PlatformMetrics)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const loadMetrics = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('platform_metrics')
        .select('*')
        .eq('id', 1)
        .single()

      if (error) throw error
      setMetrics(data)
    } catch (error) {
      console.error('Error loading metrics:', error)
    } finally {
      setLoading(false)
    }
  }

  return { metrics, loading, refresh: loadMetrics }
}
