'use client';

import Link from 'next/link';
import { useTranslations } from '@/lib/i18n/useTranslations';
import { Button } from '@/components/ui/button';
import { WalletConnect } from '@/components/shared/WalletConnect';

export function Header() {
  const { t, locale, changeLocale } = useTranslations();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-2xl">🏠</span>
          <span className="text-xl font-bold">OpenBooking</span>
        </Link>

        {/* Navigation - Center */}
        <nav className="hidden items-center gap-6 md:flex">
          <Link href="/properties" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            {t('nav.properties')}
          </Link>
          <Link href="/vault" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            {t('nav.vault')}
          </Link>
          <Link href="/about" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            {t('nav.about')}
          </Link>
        </nav>

        {/* Right Side - Auth + Wallet + Lang */}
        <div className="flex items-center gap-3">
          {/* Language Switcher */}
          <select
            value={locale}
            onChange={(e) => changeLocale(e.target.value)}
            className="text-sm border rounded-md px-2 py-1.5 bg-background cursor-pointer hover:border-primary transition-colors"
          >
            <option value="ru">🇷🇺 RU</option>
            <option value="en">🇬🇧 EN</option>
            <option value="bg">🇧🇬 BG</option>
            <option value="ua">🇺🇦 UA</option>
          </select>

          {/* Auth Buttons - Visible! */}
          <Button variant="outline" size="sm" asChild>
            <Link href="/auth/login" className="flex items-center gap-2">
              <span>🔐</span>
              <span className="hidden lg:inline">{t('nav.login')}</span>
            </Link>
          </Button>
          
          <Button size="sm" asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            <Link href="/auth/signup" className="flex items-center gap-2">
              <span>📝</span>
              <span className="hidden lg:inline">{t('nav.signup')}</span>
            </Link>
          </Button>

          {/* Wallet Connect */}
          <WalletConnect />
        </div>
      </div>
    </header>
  );
}
