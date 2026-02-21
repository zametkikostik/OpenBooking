// ============================================
// OPENBOOKING HOME PAGE
// ============================================

'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getFooterMetrics } from '@/lib/monitoring/realtime'
import type { RealTimeMetrics } from '@/lib/monitoring/realtime'

export default function HomePage() {
  const [metrics, setMetrics] = useState<RealTimeMetrics | null>(null)

  useEffect(() => {
    // Load initial metrics
    getFooterMetrics().then(setMetrics)
    
    // Update metrics every 30 seconds
    const interval = setInterval(() => {
      getFooterMetrics().then(setMetrics)
    }, 30000)
    
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
              Trust Economy
              <span className="block text-blue-600">Booking Protocol</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Global decentralized booking infrastructure combining Finance + AI Growth + 
              Travel Economy + Reputation Protocol
            </p>
            <div className="flex justify-center space-x-4">
              <Link
                href="/properties"
                className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
              >
                Browse Properties
              </Link>
              <Link
                href="/auth/signup"
                className="bg-white text-blue-600 border-2 border-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-50 transition"
              >
                Become a Host
              </Link>
            </div>
          </div>
        </div>
        
        {/* Background Pattern */}
        <div className="absolute inset-0 -z-10 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600"></div>
          <svg className="absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            Why OpenBooking?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon="🔒"
              title="Escrow Protection"
              description="All payments secured in smart contract escrow. Hosts cannot cancel after check-in. Admins cannot withdraw funds arbitrarily."
            />
            <FeatureCard
              icon="💰"
              title="Crypto + Fiat"
              description="Pay with USDT, USDC, ETH or traditional methods. SEPA, SBP, YooKassa, Klarna - 15+ payment methods globally."
            />
            <FeatureCard
              icon="🤖"
              title="AI-Powered"
              description="Autonomous AI for marketing, SEO, and growth. Dynamic pricing, personalized recommendations, 24/7 optimization."
            />
            <FeatureCard
              icon="🌍"
              title="Global Coverage"
              description="9 languages, multiple currencies, local payment methods. Properties worldwide with local support."
            />
            <FeatureCard
              icon="📊"
              title="DeFi Yield"
              description="Safe Vault Economy. Earn yield on idle funds through Aave integration. APY tracking, risk scores."
            />
            <FeatureCard
              icon="⚡"
              title="Real-time"
              description="Live metrics, instant notifications, WebSocket updates. Watch bookings, TVL, and revenue in real-time."
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            Platform Statistics
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatCard
              label="Active Bookings"
              value={metrics?.activeBookings?.toLocaleString() || '...'}
              icon="📅"
            />
            <StatCard
              label="Online Users"
              value={metrics?.onlineUsers?.toLocaleString() || '...'}
              icon="👥"
            />
            <StatCard
              label="Total Value Locked"
              value={`$${(metrics?.tvl || 0).toLocaleString()}`}
              icon="💎"
            />
            <StatCard
              label="Active Properties"
              value={metrics?.propertiesActive?.toLocaleString() || '...'}
              icon="🏠"
            />
          </div>
        </div>
      </section>

      {/* Payment Methods */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-8">
            Payment Methods
          </h2>
          <p className="text-xl text-gray-600 text-center mb-12">
            Crypto and fiat options for every region
          </p>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            <PaymentMethod name="USDT" />
            <PaymentMethod name="USDC" />
            <PaymentMethod name="ETH" />
            <PaymentMethod name="Visa" />
            <PaymentMethod name="Mastercard" />
            <PaymentMethod name="SEPA" />
            <PaymentMethod name="SBP" />
            <PaymentMethod name="YooKassa" />
            <PaymentMethod name="Klarna" />
            <PaymentMethod name="Adyen" />
            <PaymentMethod name="Mir" />
            <PaymentMethod name="OBT" />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Start?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join the trust economy revolution today
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              href="/auth/signup"
              className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition"
            >
              Create Account
            </Link>
            <Link
              href="/properties"
              className="bg-transparent text-white border-2 border-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-blue-600 transition"
            >
              Explore Properties
            </Link>
          </div>
        </div>
      </section>

      {/* Footer Info */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><Link href="/about" className="hover:text-white">About</Link></li>
                <li><Link href="/careers" className="hover:text-white">Careers</Link></li>
                <li><Link href="/press" className="hover:text-white">Press</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li><Link href="/help" className="hover:text-white">Help Center</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
                <li><Link href="/status" className="hover:text-white">Status</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Link href="/legal/terms" className="hover:text-white">Terms</Link></li>
                <li><Link href="/legal/privacy" className="hover:text-white">Privacy</Link></li>
                <li><Link href="/legal/cookies" className="hover:text-white">Cookies</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Connect</h3>
              <ul className="space-y-2">
                <li><Link href="/twitter" className="hover:text-white">Twitter</Link></li>
                <li><Link href="/discord" className="hover:text-white">Discord</Link></li>
                <li><Link href="/github" className="hover:text-white">GitHub</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: {
  icon: string
  title: string
  description: string
}) {
  return (
    <div className="p-6 bg-gray-50 rounded-xl hover:shadow-lg transition">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}

function StatCard({ label, value, icon }: {
  label: string
  value: string
  icon: string
}) {
  return (
    <div className="text-center p-6">
      <div className="text-4xl mb-2">{icon}</div>
      <div className="text-3xl font-bold text-gray-900 mb-2">{value}</div>
      <div className="text-gray-600">{label}</div>
    </div>
  )
}

function PaymentMethod({ name }: { name: string }) {
  return (
    <div className="flex items-center justify-center p-4 bg-gray-50 rounded-lg hover:shadow-md transition">
      <span className="font-semibold text-gray-700">{name}</span>
    </div>
  )
}
