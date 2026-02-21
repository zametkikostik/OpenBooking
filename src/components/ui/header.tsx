'use client'

import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { ThemeToggle } from './theme-provider'
import { Button } from './button'
import { LogOut, LayoutDashboard } from 'lucide-react'

export function Header() {
  const { isAuthenticated, signOut } = useAuth()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link href="/" className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          OpenBooking
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <nav className="flex items-center gap-4">
            <Link href="/properties" className="text-sm font-medium hover:text-primary">Properties</Link>
            <Link href="/dashboard" className="text-sm font-medium hover:text-primary">Dashboard</Link>
          </nav>

          <ThemeToggle />

          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={() => signOut()}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/auth/signin">
                <Button variant="ghost" size="sm">Sign In</Button>
              </Link>
              <Link href="/auth/signup">
                <Button size="sm">Sign Up</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
