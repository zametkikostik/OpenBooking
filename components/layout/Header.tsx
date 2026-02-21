'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { WalletConnect } from '@/components/shared/WalletConnect';

const translations = {
  ru: {
    properties: 'Недвижимость',
    vault: 'Vault',
    about: 'О нас',
    login: 'Войти',
    signup: 'Регистрация',
  },
  en: {
    properties: 'Properties',
    vault: 'Vault',
    about: 'About',
    login: 'Login',
    signup: 'Sign Up',
  },
  bg: {
    properties: 'Имоти',
    vault: 'Vault',
    about: 'Относно',
    login: 'Вход',
    signup: 'Регистрация',
  },
  ua: {
    properties: 'Нерухомість',
    vault: 'Vault',
    about: 'Про нас',
    login: 'Увійти',
    signup: 'Реєстрація',
  },
  de: {
    properties: 'Immobilien',
    vault: 'Vault',
    about: 'Über uns',
    login: 'Anmelden',
    signup: 'Registrieren',
  },
  fr: {
    properties: 'Propriétés',
    vault: 'Vault',
    about: 'À propos',
    login: 'Connexion',
    signup: "S'inscrire",
  },
  es: {
    properties: 'Propiedades',
    vault: 'Vault',
    about: 'Nosotros',
    login: 'Acceso',
    signup: 'Registro',
  },
  pl: {
    properties: 'Nieruchomości',
    vault: 'Vault',
    about: 'O nas',
    login: 'Zaloguj',
    signup: 'Rejestracja',
  },
  tr: {
    properties: 'Mülkler',
    vault: 'Vault',
    about: 'Hakkımızda',
    login: 'Giriş',
    signup: 'Kayıt Ol',
  },
};

export function Header() {
  const [currentLang, setCurrentLang] = useState('ru');

  useEffect(() => {
    const savedLang = document.cookie
      .split('; ')
      .find(row => row.startsWith('NEXT_LOCALE='))
      ?.split('=')[1] || 'ru';
    setCurrentLang(savedLang);
  }, []);

  const t = translations[currentLang] || translations.ru;

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
          <Link
            href="/properties"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            {t.properties}
          </Link>
          <Link
            href="/vault"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            {t.vault}
          </Link>
          <Link
            href="/about"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            {t.about}
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <WalletConnect />
          <Button variant="outline" size="sm" asChild>
            <Link href="/auth/login">{t.login}</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/auth/signup">{t.signup}</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
