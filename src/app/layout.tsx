// ============================================
// OPENBOOKING ROOT LAYOUT
// ============================================

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin', 'cyrillic'] })

export const metadata: Metadata = {
  title: 'OpenBooking - Trust Economy Protocol',
  description: 'Global decentralized booking infrastructure combining Finance + AI Growth + Travel Economy + Reputation Protocol',
  keywords: ['booking', 'travel', 'web3', 'defi', 'ai', 'crypto payments', 'escrow'],
  authors: [{ name: 'OpenBooking Team' }],
  creator: 'OpenBooking',
  publisher: 'OpenBooking',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://openbooking.com',
    siteName: 'OpenBooking',
    title: 'OpenBooking - Trust Economy Protocol',
    description: 'Global decentralized booking infrastructure',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OpenBooking - Trust Economy Protocol',
    description: 'Global decentralized booking infrastructure',
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://sibgxcagyylbqmjaykys.supabase.co" />
      </head>
      <body className={inter.className}>
        {children}
        
        {/* Footer with Real-time Metrics */}
        <footer className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white text-xs py-2 px-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex space-x-4">
              <span className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                <span id="active-bookings">Loading...</span>
              </span>
              <span className="hidden sm:inline">•</span>
              <span className="hidden sm:inline" id="online-users">Loading...</span>
              <span className="hidden sm:inline">•</span>
              <span className="hidden md:inline" id="tvl">Loading...</span>
            </div>
            <div className="flex space-x-4">
              <a href="/legal/terms" className="hover:text-gray-300">Terms</a>
              <a href="/legal/privacy" className="hover:text-gray-300">Privacy</a>
              <span>© 2026 OpenBooking</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
