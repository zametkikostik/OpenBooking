'use client'

import { useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase'
import { Profile } from '@/types/database'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) loadProfile(session.user.id)
      else setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) await loadProfile(session.user.id)
      else {
        setProfile(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const loadProfile = async (userId: string) => {
    try {
      const supabase = createClient()
      const { data } = await supabase.from('profiles').select('*').eq('id', userId).single()
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
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (!error && data.user) {
      await (supabase as any).from('profiles').insert({
        id: data.user.id,
        email: data.user.email!,
        full_name: fullName,
        role: 'client',
        language: 'en',
      })
    }
    return { data, error }
  }

  const signOut = async () => {
    const supabase = createClient()
    return supabase.auth.signOut()
  }

  return {
    user,
    profile,
    loading,
    isAuthenticated: !!user,
    isAdmin: profile?.role === 'admin',
    isHost: profile?.role === 'host',
    signIn,
    signUp,
    signOut,
  }
}
