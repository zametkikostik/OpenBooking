'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Profile, Booking, Property, RealTimeMetric } from '@/types';

/**
 * Hook to get current user profile
 */
export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setProfile(null);
          setLoading(false);
          return;
        }

        const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();

        setProfile(data || null);
      } catch (error) {
        console.error('Error loading profile:', error);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  return { profile, loading };
}

/**
 * Hook to get user's bookings
 */
export function useBookings(userId?: string, status?: string) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    async function loadBookings() {
      try {
        const supabase = createClient();
        let query = supabase
          .from('bookings')
          .select('*, properties(title, photos), host:profiles!host_id(full_name, avatar_url)')
          .or(`guest_id.eq.${userId},host_id.eq.${userId}`)
          .order('created_at', { ascending: false });

        if (status) {
          query = query.eq('status', status);
        }

        const { data, error } = await query;

        if (error) throw error;
        setBookings(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load bookings');
      } finally {
        setLoading(false);
      }
    }

    loadBookings();
  }, [userId, status]);

  return { bookings, loading, error };
}

/**
 * Hook to get properties by host
 */
export function useHostProperties(hostId?: string) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!hostId) {
      setLoading(false);
      return;
    }

    async function loadProperties() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .eq('host_id', hostId)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setProperties(data || []);
      } catch (error) {
        console.error('Error loading properties:', error);
      } finally {
        setLoading(false);
      }
    }

    loadProperties();
  }, [hostId]);

  return { properties, loading };
}

/**
 * Hook for real-time metrics subscription
 */
export function useRealTimeMetrics() {
  const [metrics, setMetrics] = useState<Record<string, number>>({});
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    // Subscribe to real-time metrics changes
    const channel = supabase
      .channel('metrics')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'real_time_metrics',
        },
        (payload) => {
          if (payload.new) {
            const newMetric = payload.new as RealTimeMetric;
            setMetrics((prev) => ({
              ...prev,
              [newMetric.metric_name]: Number(newMetric.metric_value),
            }));
          }
        }
      )
      .subscribe((status) => {
        setConnected(status === 'SUBSCRIBED');
      });

    // Initial fetch
    fetchMetrics();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function fetchMetrics() {
    try {
      const supabase = createClient();
      const { data } = await supabase.from('real_time_metrics').select('*');

      if (data) {
        const metricsMap: Record<string, number> = {};
        data.forEach((metric) => {
          metricsMap[metric.metric_name] = Number(metric.metric_value);
        });
        setMetrics(metricsMap);
      }
    } catch (error) {
      console.error('Error fetching metrics:', error);
    }
  }

  return { metrics, connected };
}

/**
 * Hook for wallet connection state
 */
export function useWallet() {
  const [address, setAddress] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [connecting, setConnecting] = useState(false);

  const connect = useCallback(async () => {
    if (typeof window === 'undefined' || !window.ethereum) {
      throw new Error('No crypto wallet found');
    }

    setConnecting(true);
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });

      setAddress(accounts[0]);
      setChainId(parseInt(chainId, 16));

      // Listen for account changes
      window.ethereum.on('accountsChanged', (newAccounts: string[]) => {
        setAddress(newAccounts[0] || null);
      });

      window.ethereum.on('chainChanged', (newChainId: string) => {
        setChainId(parseInt(newChainId, 16));
      });
    } finally {
      setConnecting(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    setAddress(null);
    setChainId(null);
  }, []);

  return { address, chainId, connecting, connect, disconnect };
}

/**
 * Hook for debounced search
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Hook for localStorage with SSR safety
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.error('Error reading from localStorage:', error);
    }
  }, [key]);

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);

      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error('Error setting localStorage:', error);
    }
  };

  return [storedValue, setValue] as const;
}
