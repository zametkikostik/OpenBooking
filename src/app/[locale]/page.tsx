'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { MapPin, Calendar, Users, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function HomePage() {
  const t = useTranslations()
  const [searchParams, setSearchParams] = useState({
    location: '',
    checkIn: '',
    checkOut: '',
    guests: 1,
  })

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center bg-gradient-to-br from-primary/20 via-purple-500/20 to-pink-500/20">
        <div className="container px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            {t('home.title')}
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            {t('home.subtitle')}
          </p>

          {/* Search Bar */}
          <div className="max-w-4xl mx-auto bg-card border rounded-2xl p-4 shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder={t('home.searchLocation')}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  value={searchParams.location}
                  onChange={(e) => setSearchParams({ ...searchParams, location: e.target.value })}
                />
              </div>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="date"
                  placeholder={t('home.searchCheckIn')}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  value={searchParams.checkIn}
                  onChange={(e) => setSearchParams({ ...searchParams, checkIn: e.target.value })}
                />
              </div>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="date"
                  placeholder={t('home.searchCheckOut')}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  value={searchParams.checkOut}
                  onChange={(e) => setSearchParams({ ...searchParams, checkOut: e.target.value })}
                />
              </div>
              <Button size="lg" className="gap-2">
                <Search className="h-5 w-5" />
                {t('home.searchButton')}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-muted/50">
        <div className="container px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card border rounded-xl p-6 text-center">
              <h3 className="text-xl font-semibold mb-2">🏦 Escrow Protection</h3>
              <p className="text-muted-foreground">Your payment is held securely until check-in</p>
            </div>
            <div className="bg-card border rounded-xl p-6 text-center">
              <h3 className="text-xl font-semibold mb-2">💎 Crypto Payments</h3>
              <p className="text-muted-foreground">Pay with USDT, USDC, ETH or fiat</p>
            </div>
            <div className="bg-card border rounded-xl p-6 text-center">
              <h3 className="text-xl font-semibold mb-2">🤖 AI Powered</h3>
              <p className="text-muted-foreground">Smart pricing and personalized recommendations</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
