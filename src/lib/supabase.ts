import { createBrowserClient, createServerClient as createServerClientSSR } from '@supabase/ssr'
import { Database } from '@/types/database'

// Browser Client
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// Server Client (for Next.js Server Components)
export function createServerClient(
  cookieStore: { get: (name: string) => { value: string } | undefined; set: (name: string, value: string, options: any) => void }
) {
  return createServerClientSSR<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value
        },
        set(name, value, options) {
          try {
            cookieStore.set(name, value, options)
          } catch (error) {
            // Handle cookie set errors in Server Components
          }
        },
      },
    }
  )
}

// Admin Client (service role - use carefully)
export function createAdminClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}
