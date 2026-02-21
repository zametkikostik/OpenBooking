'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { WalletConnect } from '@/components/shared/WalletConnect';

const translations: Record<string, any> = {
  ru: { properties: 'Недвижимость', vault: 'Vault', about: 'О нас', login: '🔐 Вход', signup: '📝 Регистрация' },
  en: { properties: 'Properties', vault: 'Vault', about: 'About', login: '🔐 Login', signup: '📝 Sign Up' },
  bg: { properties: 'Имоти', vault: 'Vault', about: 'Относно', login: '🔐 Вход', signup: '📝 Регистрация' },
  ua: { properties: 'Нерухомість', vault: 'Vault', about: 'Про нас', login: '🔐 Вхід', signup: '📝 Реєстрація' },
};

export function Header() {
  const [locale, setLocale] = useState('ru');
  const t = translations[locale] || translations.ru;

  useEffect(() => {
    const saved = document.cookie.split('; ').find(r => r.startsWith('NEXT_LOCALE='))?.split('=')[1] || 'ru';
    setLocale(saved);
  }, []);

  const changeLocale = (code: string) => {
    setLocale(code);
    document.cookie = `NEXT_LOCALE=${code};path=/;max-age=31536000`;
    window.location.reload();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-2xl">🏠</span>
          <span className="text-xl font-bold">OpenBooking</span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/properties" className="text-sm font-medium hover:text-foreground transition-colors">
            {t.properties}
          </Link>
          <Link href="/vault" className="text-sm font-medium hover:text-foreground transition-colors">
            {t.vault}
          </Link>
          <Link href="/about" className="text-sm font-medium hover:text-foreground transition-colors">
            {t.about}
          </Link>
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-2">
          {/* Language */}
          <select
            value={locale}
            onChange={(e) => changeLocale(e.target.value)}
            className="text-sm border rounded px-2 py-1.5 bg-background cursor-pointer"
          >
            <option value="ru">🇷🇺 RU</option>
            <option value="en">🇬🇧 EN</option>
            <option value="bg">🇧🇬 BG</option>
            <option value="ua">🇺🇦 UA</option>
          </select>

          {/* Login Button */}
          <Button variant="outline" size="sm" asChild>
            <Link href="/auth/login">{t.login}</Link>
          </Button>

          {/* Signup Button */}
          <Button size="sm" asChild className="bg-blue-600 hover:bg-blue-700">
            <Link href="/auth/signup">{t.signup}</Link>
          </Button>

          {/* Wallet */}
          <WalletConnect />
        </div>
      </div>
    </header>
  );
}
