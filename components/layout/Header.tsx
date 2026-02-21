'use client';

import Link from 'next/link';
import { useTranslations } from '@/lib/i18n/useTranslations';
import { Button } from '@/components/ui/button';
import { WalletConnect } from '@/components/shared/WalletConnect';

export function Header() {
  const { t } = useTranslations();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-2xl">🏠</span>
          <span className="text-xl font-bold">OpenBooking</span>
        </Link>

        {/* Navigation */}
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

        {/* Actions */}
        <div className="flex items-center gap-4">
          <WalletConnect />
          <Button variant="outline" size="sm" asChild>
            <Link href="/auth/login">{t('nav.login')}</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/auth/signup">{t('nav.signup')}</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
