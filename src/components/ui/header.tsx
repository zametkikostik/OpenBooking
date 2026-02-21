'use client'

import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { useWeb3 } from '@/lib/web3/hooks'
import { ThemeToggle } from './theme-provider'
import { LanguageSwitcher } from './language-switcher'
import { Button } from './button'
import { Globe, Menu, User, LogOut, LayoutDashboard } from 'lucide-react'
import { useState } from 'react'

export function Header() {
  const { isAuthenticated, profile, signOut, isAdmin, isHost } = useAuth()
  const { account, connect, disconnect } = useWeb3()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            OpenBooking
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/properties" className="text-sm font-medium hover:text-primary transition-colors">
            Properties
          </Link>
          <Link href="/destinations" className="text-sm font-medium hover:text-primary transition-colors">
            Destinations
          </Link>
          <Link href="/experiences" className="text-sm font-medium hover:text-primary transition-colors">
            Experiences
          </Link>
          {isHost && (
            <Link href="/host" className="text-sm font-medium hover:text-primary transition-colors">
              Host Dashboard
            </Link>
          )}
          {isAdmin && (
            <Link href="/admin" className="text-sm font-medium hover:text-primary transition-colors">
              Admin
            </Link>
          )}
        </nav>

        {/* Right Section */}
        <div className="hidden md:flex items-center gap-4">
          {/* Language Switcher */}
          <LanguageSwitcher />

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Web3 Connect */}
          {account ? (
            <Button variant="outline" size="sm" onClick={disconnect}>
              {account.slice(0, 6)}...{account.slice(-4)}
            </Button>
          ) : (
            <Button variant="outline" size="sm" onClick={connect}>
              Connect Wallet
            </Button>
          )}

          {/* Auth */}
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

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t p-4 space-y-4">
          <nav className="flex flex-col gap-4">
            <Link href="/properties" className="text-sm font-medium">
              Properties
            </Link>
            <Link href="/destinations" className="text-sm font-medium">
              Destinations
            </Link>
            <Link href="/experiences" className="text-sm font-medium">
              Experiences
            </Link>
            {isHost && (
              <Link href="/host" className="text-sm font-medium">
                Host Dashboard
              </Link>
            )}
            {isAdmin && (
              <Link href="/admin" className="text-sm font-medium">
                Admin
              </Link>
            )}
          </nav>
          <div className="flex items-center gap-4 pt-4 border-t">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
          {isAuthenticated ? (
            <div className="flex flex-col gap-2 pt-4 border-t">
              <Link href="/dashboard" className="w-full">
                <Button variant="outline" className="w-full">
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <Button variant="outline" className="w-full" onClick={() => signOut()}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-2 pt-4 border-t">
              <Link href="/auth/signin" className="w-full">
                <Button variant="outline" className="w-full">Sign In</Button>
              </Link>
              <Link href="/auth/signup" className="w-full">
                <Button className="w-full">Sign Up</Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  )
}
