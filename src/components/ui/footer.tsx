'use client'

import Link from 'next/link'
import { usePlatformMetrics } from '@/hooks/usePlatformMetrics'
import { formatCurrency } from '@/lib/utils'
import { Github, Twitter, Linkedin, Instagram } from 'lucide-react'

export function Footer() {
  const { metrics } = usePlatformMetrics()

  return (
    <footer className="border-t bg-background">
      <div className="container px-4 py-12">
        {/* Metrics Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 p-4 bg-muted rounded-lg">
          <div className="text-center">
            <div className="text-2xl font-bold">{metrics?.active_bookings || 0}</div>
            <div className="text-sm text-muted-foreground">Active Bookings</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{metrics?.online_users || 0}</div>
            <div className="text-sm text-muted-foreground">Online Users</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">
              {formatCurrency(metrics?.tvl_usd || 0, 'USD', 'en-US')}
            </div>
            <div className="text-sm text-muted-foreground">TVL</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{metrics?.total_properties || 0}</div>
            <div className="text-sm text-muted-foreground">Properties</div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Company */}
          <div className="col-span-2">
            <h3 className="text-lg font-semibold mb-4">OpenBooking</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Decentralized Trust Economy Platform for Travel & Accommodation.
              Combining Finance + AI Growth + Web3 Infrastructure.
            </p>
            <div className="flex gap-4">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                <Github className="h-5 w-5" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 className="font-semibold mb-4">Products</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/properties" className="text-muted-foreground hover:text-primary">Properties</Link></li>
              <li><Link href="/experiences" className="text-muted-foreground hover:text-primary">Experiences</Link></li>
              <li><Link href="/vault" className="text-muted-foreground hover:text-primary">Safe Vault</Link></li>
              <li><Link href="/host" className="text-muted-foreground hover:text-primary">Become a Host</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="text-muted-foreground hover:text-primary">About</Link></li>
              <li><Link href="/careers" className="text-muted-foreground hover:text-primary">Careers</Link></li>
              <li><Link href="/press" className="text-muted-foreground hover:text-primary">Press</Link></li>
              <li><Link href="/blog" className="text-muted-foreground hover:text-primary">Blog</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/help" className="text-muted-foreground hover:text-primary">Help Center</Link></li>
              <li><Link href="/safety" className="text-muted-foreground hover:text-primary">Safety</Link></li>
              <li><Link href="/terms" className="text-muted-foreground hover:text-primary">Terms</Link></li>
              <li><Link href="/privacy" className="text-muted-foreground hover:text-primary">Privacy</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} OpenBooking. All rights reserved.
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <Link href="/sitemap" className="hover:text-primary">Sitemap</Link>
            <Link href="/cookies" className="hover:text-primary">Cookie Preferences</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
