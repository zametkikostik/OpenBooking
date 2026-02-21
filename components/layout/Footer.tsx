'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

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

const translations = {
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
    terms: 'Условия использования',
    privacy: 'Политика конфиденциальности',
    cookies: 'Политика Cookies',
    description: 'Децентрализованная платформа бронирования нового поколения с защитой средств через Escrow и интеграцией Web3 технологий.',
    copyright: '© 2026 OpenBooking. Все права защищены.',
    accepts: 'Принимаем:',
    backToTop: 'Наверх',
  },
  en: {
    company: 'Company',
    support: 'Support',
    legal: 'Legal Information',
    languages: 'Languages',
    about: 'About Us',
    careers: 'Careers',
    press: 'Press',
    help: 'Help Center',
    safety: 'Safety',
    contact: 'Contact Us',
    terms: 'Terms of Service',
    privacy: 'Privacy Policy',
    cookies: 'Cookie Policy',
    description: 'Next-generation decentralized booking platform with Escrow payment protection and Web3 technology integration.',
    copyright: '© 2026 OpenBooking. All rights reserved.',
    accepts: 'We accept:',
    backToTop: 'Back to Top',
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
    terms: 'Условия за ползване',
    privacy: 'Политика за поверителност',
    cookies: 'Политика за бисквитки',
    description: 'Децентрализирана платформа за резервации от ново поколение със защита на плащанията чрез Escrow и Web3 интеграция.',
    copyright: '© 2026 OpenBooking. Всички права запазени.',
    accepts: 'Приемаме:',
    backToTop: 'Нагоре',
  },
  ua: {
    company: 'Компанія',
    support: 'Підтримка',
    legal: 'Правова інформація',
    languages: 'Мови',
    about: 'Про нас',
    careers: 'Кар\'єра',
    press: 'Преса',
    help: 'Допомога',
    safety: 'Безпека',
    contact: 'Контакти',
    terms: 'Умови використання',
    privacy: 'Політика конфіденційності',
    cookies: 'Політика Cookies',
    description: 'Децентралізована платформа бронювання нового покоління з захистом коштів через Escrow та інтеграцією Web3 технологій.',
    copyright: '© 2026 OpenBooking. Всі права захищено.',
    accepts: 'Приймаємо:',
    backToTop: 'Нагору',
  },
};

export function Footer() {
  const pathname = usePathname();
  const router = useRouter();
  const [currentLang, setCurrentLang] = useState('ru');
  const [isChanging, setIsChanging] = useState(false);

  useEffect(() => {
    const savedLang = document.cookie
      .split('; ')
      .find(row => row.startsWith('NEXT_LOCALE='))
      ?.split('=')[1] || 'ru';
    setCurrentLang(savedLang);
  }, []);

  const handleLanguageChange = (code: string) => {
    if (code === currentLang) return;
    
    setIsChanging(true);
    setCurrentLang(code);
    
    // Save to cookie
    document.cookie = `NEXT_LOCALE=${code};path=/;max-age=31536000`;
    
    // Reload after short delay for animation
    setTimeout(() => {
      router.refresh();
    }, 300);
  };

  const t = translations[currentLang] || translations.ru;

  return (
    <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white border-t border-slate-700">
      <div className="container mx-auto px-4 py-16">
        {/* Main Content */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10 mb-12">
          
          {/* Brand Section */}
          <div className="col-span-2 lg:col-span-2 space-y-6">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg">
                🏠
              </div>
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  OpenBooking
                </h2>
                <p className="text-xs text-slate-400 uppercase tracking-wider">Trust Economy Platform</p>
              </div>
            </Link>
            
            <p className="text-slate-300 text-sm leading-relaxed max-w-md">
              {t.description}
            </p>

            {/* Social Links */}
            <div className="flex gap-3">
              <SocialButton icon="🐙" label="GitHub" href="https://github.com/zametkikostik/OpenBooking" />
              <SocialButton icon="🐦" label="Twitter" href="#" />
              <SocialButton icon="💼" label="LinkedIn" href="#" />
              <SocialButton icon="📸" label="Instagram" href="#" />
            </div>
          </div>

          {/* Company Links */}
          <FooterColumn 
            icon="🏢" 
            title={t.company}
            links={[
              { href: '/about', label: t.about, icon: '📖' },
              { href: '/careers', label: t.careers, icon: '💼' },
              { href: '/press', label: t.press, icon: '📰' },
            ]}
            pathname={pathname}
          />

          {/* Support Links */}
          <FooterColumn 
            icon="🎧" 
            title={t.support}
            links={[
              { href: '/help', label: t.help, icon: '❓' },
              { href: '/safety', label: t.safety, icon: '🛡️' },
              { href: '/contact', label: t.contact, icon: '📧' },
            ]}
            pathname={pathname}
          />

          {/* Legal & Languages */}
          <div className="space-y-8">
            <FooterColumn 
              icon="⚖️" 
              title={t.legal}
              links={[
                { href: '/terms', label: t.terms, icon: '📄' },
                { href: '/privacy', label: t.privacy, icon: '🔒' },
                { href: '/cookies', label: t.cookies, icon: '🍪' },
              ]}
              pathname={pathname}
            />

            {/* Language Switcher */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider mb-4 flex items-center gap-2 text-slate-400">
                <span>🌍</span> {t.languages}
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    disabled={isChanging}
                    className={`relative px-2 py-2.5 text-xs rounded-xl transition-all duration-300 group ${
                      currentLang === lang.code
                        ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/30 scale-105 font-semibold'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:scale-105'
                    }`}
                    title={lang.name}
                  >
                    <span className="text-lg block mb-0.5">{lang.flag}</span>
                    <span className="text-[10px] uppercase">{lang.code}</span>
                    {currentLang === lang.code && (
                      <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-900 animate-pulse" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-700 pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            
            {/* Copyright */}
            <p className="text-slate-400 text-sm">
              {t.copyright}
            </p>

            {/* Payment Methods */}
            <div className="flex items-center gap-4">
              <span className="text-xs text-slate-500 uppercase tracking-wider">{t.accepts}</span>
              <div className="flex gap-2">
                <PaymentBadge symbol="ETH" gradient="from-blue-500 to-blue-600" />
                <PaymentBadge symbol="DAI" gradient="from-yellow-500 to-orange-500" />
                <PaymentBadge symbol="A7A5" gradient="from-purple-500 to-pink-600" />
                <PaymentBadge symbol="VISA" gradient="from-slate-600 to-slate-800" />
                <PaymentBadge symbol="MC" gradient="from-red-600 to-red-800" />
              </div>
            </div>

            {/* Back to Top */}
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="group flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-all duration-300 px-4 py-2 rounded-lg hover:bg-slate-800"
            >
              <span className="group-hover:-translate-y-1 transition-transform duration-300">⬆</span>
              <span className="hidden md:inline">{t.backToTop}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {isChanging && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <span>Changing language...</span>
          </div>
        </div>
      )}
    </footer>
  );
}

function FooterColumn({ 
  icon, 
  title,
  links, 
  pathname 
}: { 
  icon: string; 
  title: string;
  links: { href: string; label: string; icon: string }[]; 
  pathname: string;
}) {
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-wider mb-4 flex items-center gap-2 text-slate-400">
        <span className="text-lg">{icon}</span> {title}
      </h3>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className={`group flex items-center gap-2.5 text-sm transition-all duration-300 ${
                pathname === link.href
                  ? 'text-blue-400 font-semibold translate-x-2'
                  : 'text-slate-300 hover:text-white hover:translate-x-2'
              }`}
            >
              <span className="opacity-50 group-hover:opacity-100 transition-opacity">{link.icon}</span>
              <span className="relative">
                {link.label}
                {pathname === link.href && (
                  <span className="absolute -left-3 top-1/2 -translate-y-1/2 w-1 h-1 bg-blue-400 rounded-full" />
                )}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SocialButton({ icon, label, href }: { icon: string; label: string; href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="w-11 h-11 bg-slate-800 rounded-xl flex items-center justify-center text-2xl hover:bg-gradient-to-br hover:from-blue-500 hover:to-purple-600 transition-all duration-300 hover:scale-110 hover:-rotate-6 shadow-lg hover:shadow-blue-500/30"
      title={label}
      aria-label={label}
    >
      {icon}
    </a>
  );
}

function PaymentBadge({ symbol, gradient }: { symbol: string; gradient: string }) {
  return (
    <div className={`w-10 h-7 bg-gradient-to-br ${gradient} rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-lg hover:scale-110 transition-transform duration-300`}>
      {symbol}
    </div>
  );
}
