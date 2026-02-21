'use client'

import { useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase'
import { Profile, UserRole } from '@/types/database'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      
      if (session?.user) {
        loadProfile(session.user.id)
      } else {
        setLoading(false)
      }
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        
        if (session?.user) {
          await loadProfile(session.user.id)
        } else {
          setProfile(null)
          setLoading(false)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const loadProfile = async (userId: string) => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) throw error
      setProfile(data)
    } catch (error) {
      console.error('Error loading profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    const supabase = createClient()
    return supabase.auth.signInWithPassword({ email, password })
  }

  const signUp = async (email: string, password: string, fullName?: string) => {
    const supabase = createClient()
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    })

    if (!error && data.user) {
      // Create profile
      await supabase.from('profiles').insert({
        id: data.user.id,
        email: data.user.email!,
        full_name: fullName || null,
        role: 'client' as const,
        language: 'en',
      } as any)
    }

    return { data, error }
  }

  const signOut = async () => {
    const supabase = createClient()
    return supabase.auth.signOut()
  }

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return { error: new Error('Not authenticated') }
    
    const supabase = createClient()
    const { error } = await (supabase as any)
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
    
    return { error }
  }

  const isAdmin = profile?.role === 'admin'
  const isHost = profile?.role === 'host' || profile?.role === 'admin'
  const isClient = profile?.role === 'client' || !profile

  return {
    user,
    profile,
    session,
    loading,
    isAuthenticated: !!user,
    isAdmin,
    isHost,
    isClient,
    signIn,
    signUp,
    signOut,
    updateProfile,
  }
}
