'use client'

import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useCallback } from 'react'
import { Booking, Property } from '@/types/database'
import { createClient } from '@/lib/supabase'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Calendar, DollarSign, Home, Star, TrendingUp, Shield } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function DashboardPage() {
  const { isAuthenticated, profile, loading: authLoading } = useAuth()
  const router = useRouter()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)

  const loadData = useCallback(async () => {
    if (!profile?.id) return

    try {
      const supabase = createClient()
      
      // Load user bookings
      const { data: bookingsData } = await supabase
        .from('bookings')
        .select('*, properties(*)')
        .or(`guest_id.eq.${profile.id},host_id.eq.${profile.id}`)
        .order('created_at', { ascending: false })
        .limit(10)

      setBookings(bookingsData || [])

      // Load host properties
      const { data: propertiesData } = await supabase
        .from('properties')
        .select('*')
        .eq('host_id', profile.id)
        .order('created_at', { ascending: false })

      setProperties(propertiesData || [])
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }, [profile?.id])

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/signin')
      return
    }

    if (isAuthenticated && profile) {
      loadData()
    }
  }, [isAuthenticated, authLoading, profile, router, loadData])

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container px-4 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">
          Welcome back, {profile?.full_name || 'Traveler'}!
        </h1>
        <p className="text-muted-foreground">
          Manage your bookings, properties, and earnings all in one place.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={<Calendar className="h-5 w-5" />}
          label="Total Bookings"
          value={profile?.total_bookings || 0}
        />
        <StatCard
          icon={<DollarSign className="h-5 w-5" />}
          label="Total Revenue"
          value={formatCurrency(profile?.total_revenue || 0, 'USD')}
        />
        <StatCard
          icon={<Star className="h-5 w-5" />}
          label="Reputation Score"
          value={profile?.reputation_score || 0}
        />
        <StatCard
          icon={<Shield className="h-5 w-5" />}
          label="KYC Status"
          value={profile?.kyc_verified ? 'Verified' : 'Not Verified'}
          variant={profile?.kyc_verified ? 'success' : 'warning'}
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Bookings */}
        <div className="bg-card border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Recent Bookings</h2>
            <Link href="/dashboard/bookings">
              <Button variant="ghost" size="sm">View All</Button>
            </Link>
          </div>
          
          {bookings.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No bookings yet</p>
              <Link href="/properties">
                <Button variant="link" className="mt-2">Browse Properties</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.slice(0, 5).map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))}
            </div>
          )}
        </div>

        {/* My Properties (for hosts) */}
        {properties.length > 0 && (
          <div className="bg-card border rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">My Properties</h2>
              <Link href="/host/properties">
                <Button variant="ghost" size="sm">Manage</Button>
              </Link>
            </div>
            
            <div className="space-y-4">
              {properties.slice(0, 5).map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-card border rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/properties">
            <Button variant="outline" className="w-full">
              <Home className="h-4 w-4 mr-2" />
              Browse
            </Button>
          </Link>
          <Link href="/dashboard/bookings">
            <Button variant="outline" className="w-full">
              <Calendar className="h-4 w-4 mr-2" />
              Bookings
            </Button>
          </Link>
          <Link href="/dashboard/vault">
            <Button variant="outline" className="w-full">
              <TrendingUp className="h-4 w-4 mr-2" />
              Safe Vault
            </Button>
          </Link>
          {profile?.role === 'host' && (
            <Link href="/host/properties/new">
              <Button variant="outline" className="w-full">
                <Home className="h-4 w-4 mr-2" />
                Add Property
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

function StatCard({ icon, label, value, variant = 'default' }: {
  icon: React.ReactNode
  label: string
  value: string | number
  variant?: 'default' | 'success' | 'warning'
}) {
  const variantClasses = {
    default: 'text-primary',
    success: 'text-green-600',
    warning: 'text-yellow-600',
  }

  return (
    <div className="bg-card border rounded-xl p-4">
      <div className={`flex items-center gap-2 mb-2 ${variantClasses[variant]}`}>
        {icon}
      </div>
      <div className="text-2xl font-bold mb-1">{value}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  )
}

function BookingCard({ booking }: { booking: Booking }) {
  const property = (booking as unknown as { properties?: Property }).properties
  
  return (
    <Link href={`/bookings/${booking.id}`}>
      <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors">
        <div className="flex-1">
          <div className="font-medium">{property?.title ? (property.title as Record<string, string>)?.en || 'Property' : 'Property'}</div>
          <div className="text-sm text-muted-foreground">
            {formatDate(booking.check_in_date)} - {formatDate(booking.check_out_date)}
          </div>
        </div>
        <div className="text-right">
          <div className="font-semibold">{formatCurrency(booking.total_amount, booking.currency)}</div>
          <div className="text-sm text-muted-foreground capitalize">{booking.status.replace('_', ' ')}</div>
        </div>
      </div>
    </Link>
  )
}

function PropertyCard({ property }: { property: Property }) {
  return (
    <Link href={`/properties/${property.id}`}>
      <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors">
        <div className="flex-1">
          <div className="font-medium">{typeof property.title === 'object' ? (property.title as Record<string, string>)?.en || 'Property' : String(property.title)}</div>
          <div className="text-sm text-muted-foreground">
            {property.bedrooms} bed{property.bedrooms > 1 ? 's' : ''} · {property.max_guests} guests
          </div>
        </div>
        <div className="text-right">
          <div className="font-semibold">{formatCurrency(property.price_per_night, property.currency)} / night</div>
          <div className="text-sm text-muted-foreground capitalize">{property.status}</div>
        </div>
      </div>
    </Link>
  )
}
