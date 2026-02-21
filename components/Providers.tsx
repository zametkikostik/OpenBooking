'use client';

import { i18nProvider } from '@/lib/i18n/context';
import { Header } from './layout/Header';
import { Footer } from './layout/Footer';
import { CookieConsentBanner } from '@/components/analytics/CookieConsent';
import type { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <i18nProvider>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <CookieConsentBanner />
    </i18nProvider>
  );
}
