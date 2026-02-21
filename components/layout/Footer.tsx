'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

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

const companyLinks = [
  { href: '/about', label: 'О нас', icon: '🏢' },
  { href: '/careers', label: 'Карьера', icon: '💼' },
  { href: '/press', label: 'Пресса', icon: '📰' },
];

const supportLinks = [
  { href: '/help', label: 'Помощь', icon: '❓' },
  { href: '/safety', label: 'Безопасность', icon: '🛡️' },
  { href: '/contact', label: 'Контакты', icon: '📧' },
];

const legalLinks = [
  { href: '/terms', label: 'Условия', icon: '📄' },
  { href: '/privacy', label: 'Конфиденциальность', icon: '🔒' },
  { href: '/cookies', label: 'Cookies', icon: '🍪' },
];

export function Footer() {
  const pathname = usePathname();
  const router = useRouter();
  const [currentLang, setCurrentLang] = useState('ru');

  const handleLanguageChange = (code: string) => {
    setCurrentLang(code);
    // Сохраняем язык в cookie
    document.cookie = `NEXT_LOCALE=${code};path=/;max-age=31536000`;
    
    // Перезагружаем страницу для применения языка
    router.refresh();
  };

  return (
    <footer className="bg-gradient-to-b from-card to-muted border-t">
      <div className="container mx-auto px-4 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
          {/* Logo & Description */}
          <div className="col-span-2 lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <span className="text-4xl">🏠</span>
              <div>
                <span className="text-2xl font-bold block">OpenBooking</span>
                <span className="text-xs text-muted-foreground">Trust Economy Platform</span>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground mb-6 max-w-sm">
              Децентрализованная платформа бронирования нового поколения с защитой средств через Escrow и интеграцией Web3 технологий.
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
            title="Компания" 
            icon="🏢"
            links={companyLinks} 
            pathname={pathname}
          />

          {/* Support */}
          <FooterSection 
            title="Поддержка" 
            icon="🎧"
            links={supportLinks} 
            pathname={pathname}
          />

          {/* Legal & Languages */}
          <div className="space-y-8">
            <FooterSection 
              title="Правовая информация" 
              icon="⚖️"
              links={legalLinks} 
              pathname={pathname}
            />

            {/* Languages */}
            <div>
              <h3 className="font-semibold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
                <span>🌍</span> Языки
              </h3>
              <div className="flex flex-wrap gap-2">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`group px-3 py-2 text-xs rounded-lg transition-all duration-200 ${
                      currentLang === lang.code
                        ? 'bg-primary text-primary-foreground shadow-md scale-105'
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
              <p>© 2026 OpenBooking. Все права защищены.</p>
            </div>

            {/* Payment Methods */}
            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground mr-2">Принимаем:</span>
              <PaymentBadge symbol="ETH" color="bg-blue-600" />
              <PaymentBadge symbol="DAI" color="bg-yellow-500" />
              <PaymentBadge symbol="A7A5" color="bg-purple-600" />
              <PaymentBadge symbol="VISA" color="bg-slate-800" />
              <PaymentBadge symbol="MC" color="bg-red-600" />
            </div>

            {/* Back to top */}
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <span>↑</span> Наверх
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
  links: { href: string; label: string; icon?: string }[]; 
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
              {link.icon && <span className="opacity-50 group-hover:opacity-100 transition-opacity">{link.icon}</span>}
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
      className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-xl hover:bg-primary hover:text-primary-foreground transition-all duration-200 hover:scale-110"
      title={label}
      aria-label={label}
    >
      {icon}
    </a>
  );
}

function PaymentBadge({ symbol, color }: { symbol: string; color: string }) {
  return (
    <div className={`w-8 h-5 ${color} rounded flex items-center justify-center text-white text-xs font-bold`}>
      {symbol}
    </div>
  );
}
