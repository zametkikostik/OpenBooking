import { Web3Provider } from '@/lib/web3/provider';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CookieConsentBanner } from '@/components/analytics/CookieConsent';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';
import { cn } from '@/lib/utils/helpers';

const inter = Inter({
  subsets: ['cyrillic', 'latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'OpenBooking - Децентрализованная платформа бронирования',
  description:
    'Глобальная инфраструктура бронирования нового поколения с защитой средств через Escrow и интеграцией DeFi',
  keywords: ['бронирование', 'аренда', 'недвижимость', 'crypto', 'web3', 'escrow', 'defi'],
  authors: [{ name: 'OpenBooking Team' }],
  creator: 'OpenBooking',
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    siteName: 'OpenBooking',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body className={cn(inter.variable, 'min-h-screen font-sans antialiased flex flex-col')}>
        <Web3Provider>
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
          <CookieConsentBanner />
        </Web3Provider>
      </body>
    </html>
  );
}
