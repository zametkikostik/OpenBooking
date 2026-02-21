'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

const languages = [
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'bg', name: 'Български', flag: '🇧🇬' },
  { code: 'ua', name: 'Українська', flag: '🇺🇦' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'pl', name: 'Polski', flag: '🇵🇱' },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
];

// Translations
const translations: Record<string, any> = {
  ru: {
    company: 'Компания',
    support: 'Поддержка',
    legal: 'Правовая информация',
    languages: 'Языки',
    about: 'О нас',
    careers: 'Карьера',
    press: 'Пресса',
    help: 'Помощь',
    safety: 'Безопасность',
    contact: 'Контакты',
    terms: 'Условия',
    privacy: 'Конфиденциальность',
    cookies: 'Cookies',
    description: 'Децентрализованная платформа бронирования нового поколения с защитой средств через Escrow и интеграцией Web3 технологий.',
    copyright: '© 2026 OpenBooking. Все права защищены.',
    accepts: 'Принимаем:',
    backToTop: '↑ Наверх',
  },
  en: {
    company: 'Company',
    support: 'Support',
    legal: 'Legal',
    languages: 'Languages',
    about: 'About Us',
    careers: 'Careers',
    press: 'Press',
    help: 'Help',
    safety: 'Safety',
    contact: 'Contact',
    terms: 'Terms',
    privacy: 'Privacy',
    cookies: 'Cookies',
    description: 'Next-generation decentralized booking platform with Escrow payment protection and Web3 technology integration.',
    copyright: '© 2026 OpenBooking. All rights reserved.',
    accepts: 'We accept:',
    backToTop: '↑ Back to Top',
  },
  bg: {
    company: 'Компания',
    support: 'Подкрепа',
    legal: 'Правна информация',
    languages: 'Езици',
    about: 'Относно нас',
    careers: 'Кариера',
    press: 'Преса',
    help: 'Помощ',
    safety: 'Безопасност',
    contact: 'Контакти',
    terms: 'Условия',
    privacy: 'Поверителност',
    cookies: 'Бисквитки',
    description: 'Децентрализирана платформа за резервации от ново поколение със защита на плащанията чрез Escrow.',
    copyright: '© 2026 OpenBooking. Всички права запазени.',
    accepts: 'Приемаме:',
    backToTop: '↑ Нагоре',
  },
};

export function Footer() {
  const pathname = usePathname();
  const router = useRouter();
  const [currentLang, setCurrentLang] = useState('ru');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Get saved language from cookie
    const savedLang = document.cookie
      .split('; ')
      .find(row => row.startsWith('NEXT_LOCALE='))
      ?.split('=')[1] || 'ru';
    setCurrentLang(savedLang);
  }, []);

  const handleLanguageChange = (code: string) => {
    setCurrentLang(code);
    // Save language to cookie
    document.cookie = `NEXT_LOCALE=${code};path=/;max-age=31536000`;
    
    // Get current path and rebuild with new locale if needed
    const currentPath = window.location.pathname;
    
    // Reload page to apply language changes
    router.refresh();
    window.location.reload();
  };

  const t = translations[currentLang] || translations.ru;

  if (!mounted) {
    return <footer className="h-64 bg-card border-t" />;
  }

  return (
    <footer className="bg-gradient-to-b from-card to-muted border-t">
      <div className="container mx-auto px-4 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
          {/* Logo & Description */}
          <div className="col-span-2 lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-4 group">
              <span className="text-4xl group-hover:scale-110 transition-transform">🏠</span>
              <div>
                <span className="text-2xl font-bold block">OpenBooking</span>
                <span className="text-xs text-muted-foreground">Trust Economy Platform</span>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground mb-6 max-w-sm">
              {t.description}
            </p>
            <div className="flex gap-3">
              <SocialLink href="https://github.com/zametkikostik/OpenBooking" icon="🐙" label="GitHub" />
              <SocialLink href="#" icon="🐦" label="Twitter" />
              <SocialLink href="#" icon="💼" label="LinkedIn" />
              <SocialLink href="#" icon="📸" label="Instagram" />
            </div>
          </div>

          {/* Company */}
          <FooterSection 
            title={t.company} 
            icon="🏢"
            links={[
              { href: '/about', label: t.about },
              { href: '/careers', label: t.careers },
              { href: '/press', label: t.press },
            ]} 
            pathname={pathname}
          />

          {/* Support */}
          <FooterSection 
            title={t.support} 
            icon="🎧"
            links={[
              { href: '/help', label: t.help },
              { href: '/safety', label: t.safety },
              { href: '/contact', label: t.contact },
            ]} 
            pathname={pathname}
          />

          {/* Legal & Languages */}
          <div className="space-y-8">
            <FooterSection 
              title={t.legal} 
              icon="⚖️"
              links={[
                { href: '/terms', label: t.terms },
                { href: '/privacy', label: t.privacy },
                { href: '/cookies', label: t.cookies },
              ]} 
              pathname={pathname}
            />

            {/* Languages */}
            <div>
              <h3 className="font-semibold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
                <span>🌍</span> {t.languages}
              </h3>
              <div className="flex flex-wrap gap-2">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`group px-3 py-2 text-xs rounded-lg transition-all duration-200 ${
                      currentLang === lang.code
                        ? 'bg-primary text-primary-foreground shadow-md scale-105 font-semibold'
                        : 'bg-muted hover:bg-muted-foreground/20 hover:scale-105'
                    }`}
                    title={lang.name}
                  >
                    <span className="mr-1">{lang.flag}</span>
                    {lang.code.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <div className="text-sm text-muted-foreground">
              <p>{t.copyright}</p>
            </div>

            {/* Payment Methods */}
            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground">{t.accepts}</span>
              <PaymentBadge symbol="ETH" color="bg-blue-600" />
              <PaymentBadge symbol="DAI" color="bg-yellow-500" />
              <PaymentBadge symbol="A7A5" color="bg-purple-600" />
              <PaymentBadge symbol="VISA" color="bg-slate-800" />
              <PaymentBadge symbol="MC" color="bg-red-600" />
            </div>

            {/* Back to top */}
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
            >
              <span className="group-hover:-translate-y-0.5 transition-transform">↑</span> {t.backToTop}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterSection({ 
  title, 
  icon,
  links, 
  pathname 
}: { 
  title: string; 
  icon: string;
  links: { href: string; label: string }[]; 
  pathname: string;
}) {
  return (
    <div>
      <h3 className="font-semibold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
        <span>{icon}</span> {title}
      </h3>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className={`group flex items-center gap-2 text-sm transition-all duration-200 ${
                pathname === link.href
                  ? 'text-primary font-medium translate-x-1'
                  : 'text-muted-foreground hover:text-foreground hover:translate-x-1'
              }`}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SocialLink({ href, icon, label }: { href: string; icon: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-xl hover:bg-primary hover:text-primary-foreground transition-all duration-200 hover:scale-110 hover:rotate-3"
      title={label}
      aria-label={label}
    >
      {icon}
    </a>
  );
}

function PaymentBadge({ symbol, color }: { symbol: string; color: string }) {
  return (
    <div className={`w-9 h-6 ${color} rounded-md flex items-center justify-center text-white text-xs font-bold shadow-sm hover:scale-110 transition-transform`}>
      {symbol}
    </div>
  );
}
