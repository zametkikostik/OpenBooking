'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
    terms: 'Условия',
    privacy: 'Конфиденциальность',
    cookies: 'Cookies',
    description: 'Децентрализованная платформа бронирования нового поколения с защитой средств через Escrow и интеграцией Web3 технологий.',
    copyright: '© 2026 OpenBooking. Все права защищены.',
    accepts: 'Принимаем:',
    backToTop: 'Наверх',
  },
  en: {
    company: 'Company',
    support: 'Support',
    legal: 'Legal',
    languages: 'Languages',
    about: 'About',
    careers: 'Careers',
    press: 'Press',
    help: 'Help',
    safety: 'Safety',
    contact: 'Contact',
    terms: 'Terms',
    privacy: 'Privacy',
    cookies: 'Cookies',
    description: 'Next-gen decentralized booking platform with Escrow payment protection and Web3 integration.',
    copyright: '© 2026 OpenBooking. All rights reserved.',
    accepts: 'Accepts:',
    backToTop: 'Top',
  },
  bg: {
    company: 'Компания',
    support: 'Подкрепа',
    legal: 'Правна информация',
    languages: 'Езици',
    about: 'Относно',
    careers: 'Кариера',
    press: 'Преса',
    help: 'Помощ',
    safety: 'Безопасност',
    contact: 'Контакти',
    terms: 'Условия',
    privacy: 'Поверителност',
    cookies: 'Бисквитки',
    description: 'Децентрализирана платформа за резервации със Escrow защита и Web3 интеграция.',
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
    careers: "Кар'єра",
    press: 'Преса',
    help: 'Допомога',
    safety: 'Безпека',
    contact: 'Контакти',
    terms: 'Умови',
    privacy: 'Конфіденційність',
    cookies: 'Cookies',
    description: 'Децентралізована платформа бронювання з Escrow захистом та Web3 інтеграцією.',
    copyright: '© 2026 OpenBooking. Всі права захищено.',
    accepts: 'Приймаємо:',
    backToTop: 'Нагору',
  },
  de: {
    company: 'Unternehmen',
    support: 'Unterstützung',
    legal: 'Rechtliches',
    languages: 'Sprachen',
    about: 'Über uns',
    careers: 'Karriere',
    press: 'Presse',
    help: 'Hilfe',
    safety: 'Sicherheit',
    contact: 'Kontakt',
    terms: 'Bedingungen',
    privacy: 'Datenschutz',
    cookies: 'Cookies',
    description: 'Dezentrale Buchungsplattform mit Escrow-Zahlungsschutz und Web3-Integration.',
    copyright: '© 2026 OpenBooking. Alle Rechte vorbehalten.',
    accepts: 'Akzeptiert:',
    backToTop: 'Nach oben',
  },
  fr: {
    company: 'Entreprise',
    support: 'Support',
    legal: 'Légal',
    languages: 'Langues',
    about: 'À propos',
    careers: 'Carrières',
    press: 'Presse',
    help: 'Aide',
    safety: 'Sécurité',
    contact: 'Contact',
    terms: 'Conditions',
    privacy: 'Confidentialité',
    cookies: 'Cookies',
    description: 'Plateforme de réservation décentralisée avec protection Escrow et intégration Web3.',
    copyright: '© 2026 OpenBooking. Tous droits réservés.',
    accepts: 'Accepte:',
    backToTop: 'Haut',
  },
  es: {
    company: 'Empresa',
    support: 'Soporte',
    legal: 'Legal',
    languages: 'Idiomas',
    about: 'Nosotros',
    careers: 'Empleo',
    press: 'Prensa',
    help: 'Ayuda',
    safety: 'Seguridad',
    contact: 'Contacto',
    terms: 'Términos',
    privacy: 'Privacidad',
    cookies: 'Cookies',
    description: 'Plataforma de reservas descentralizada con protección Escrow e integración Web3.',
    copyright: '© 2026 OpenBooking. Todos los derechos reservados.',
    accepts: 'Acepta:',
    backToTop: 'Arriba',
  },
  pl: {
    company: 'Firma',
    support: 'Wsparcie',
    legal: 'Prawne',
    languages: 'Języki',
    about: 'O nas',
    careers: 'Kariera',
    press: 'Prasa',
    help: 'Pomoc',
    safety: 'Bezpieczeństwo',
    contact: 'Kontakt',
    terms: 'Warunki',
    privacy: 'Prywatność',
    cookies: 'Cookies',
    description: 'Zdecentralizowana platforma rezerwacji z ochroną płatności Escrow i integracją Web3.',
    copyright: '© 2026 OpenBooking. Wszelkie prawa zastrzeżone.',
    accepts: 'Akceptuje:',
    backToTop: 'Góra',
  },
  tr: {
    company: 'Şirket',
    support: 'Destek',
    legal: 'Yasal',
    languages: 'Diller',
    about: 'Hakkımızda',
    careers: 'Kariyer',
    press: 'Basın',
    help: 'Yardım',
    safety: 'Güvenlik',
    contact: 'İletişim',
    terms: 'Şartlar',
    privacy: 'Gizlilik',
    cookies: 'Cookies',
    description: 'Escrow ödeme korumalı ve Web3 entegrasyonlu merkezi olmayan rezervasyon platformu.',
    copyright: '© 2026 OpenBooking. Tüm hakları saklıdır.',
    accepts: 'Kabul:',
    backToTop: 'Yukarı',
  },
};

export function Footer() {
  const pathname = usePathname();
  const [currentLang, setCurrentLang] = useState('ru');

  useEffect(() => {
    const savedLang = document.cookie
      .split('; ')
      .find(row => row.startsWith('NEXT_LOCALE='))
      ?.split('=')[1] || 'ru';
    setCurrentLang(savedLang);
  }, []);

  const handleLanguageChange = (code: string) => {
    // Мгновенное переключение
    setCurrentLang(code);
    // Сохраняем в cookie для следующего визита
    document.cookie = `NEXT_LOCALE=${code};path=/;max-age=31536000`;
  };

  const t = translations[currentLang] || translations.ru;

  return (
    <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white border-t border-slate-700">
      <div className="container mx-auto px-4 py-12">
        {/* Main Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-8">
          
          {/* Brand */}
          <div className="col-span-2 lg:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                🏠
              </div>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  OpenBooking
                </h2>
                <p className="text-xs text-slate-400">Trust Economy Platform</p>
              </div>
            </Link>
            
            <p className="text-slate-300 text-sm max-w-md">
              {t.description}
            </p>

            <div className="flex gap-2">
              <SocialBtn icon="🐙" href="https://github.com/zametkikostik/OpenBooking" />
              <SocialBtn icon="🐦" href="#" />
              <SocialBtn icon="💼" href="#" />
              <SocialBtn icon="📸" href="#" />
            </div>
          </div>

          {/* Company */}
          <FooterCol icon="🏢" title={t.company} links={[
            { href: '/about', label: t.about },
            { href: '/careers', label: t.careers },
            { href: '/press', label: t.press },
          ]} pathname={pathname} />

          {/* Support */}
          <FooterCol icon="🎧" title={t.support} links={[
            { href: '/help', label: t.help },
            { href: '/safety', label: t.safety },
            { href: '/contact', label: t.contact },
          ]} pathname={pathname} />

          {/* Legal & Lang */}
          <div className="space-y-6">
            <FooterCol icon="⚖️" title={t.legal} links={[
              { href: '/terms', label: t.terms },
              { href: '/privacy', label: t.privacy },
              { href: '/cookies', label: t.cookies },
            ]} pathname={pathname} />

            {/* Languages */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider mb-3 flex items-center gap-2 text-slate-400">
                <span>🌍</span> {t.languages}
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`px-2 py-1.5 text-xs rounded-lg transition-all ${
                      currentLang === lang.code
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg scale-105 font-bold'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:scale-105'
                    }`}
                    title={lang.name}
                  >
                    {lang.flag} {lang.code.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-slate-700 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-400 text-sm">{t.copyright}</p>
            
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-500">{t.accepts}</span>
              <PaymentBadge symbol="ETH" color="from-blue-500 to-blue-600" />
              <PaymentBadge symbol="DAI" color="from-yellow-500 to-orange-500" />
              <PaymentBadge symbol="A7A5" color="from-purple-500 to-pink-600" />
              <PaymentBadge symbol="VISA" color="from-slate-600 to-slate-800" />
              <PaymentBadge symbol="MC" color="from-red-600 to-red-800" />
            </div>

            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors"
            >
              <span>⬆</span> <span className="hidden md:inline">{t.backToTop}</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ icon, title, links, pathname }: { icon: string; title: string; links: { href: string; label: string }[]; pathname: string }) {
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-wider mb-4 flex items-center gap-2 text-slate-400">
        <span>{icon}</span> {title}
      </h3>
      <ul className="space-y-2.5">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className={`group flex items-center gap-2 text-sm transition-all ${
                pathname === link.href
                  ? 'text-blue-400 font-semibold translate-x-2'
                  : 'text-slate-300 hover:text-white hover:translate-x-2'
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

function SocialBtn({ icon, href }: { icon: string; href: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center text-xl hover:bg-gradient-to-br hover:from-blue-500 hover:to-purple-600 transition-all hover:scale-110">
      {icon}
    </a>
  );
}

function PaymentBadge({ symbol, color }: { symbol: string; color: string }) {
  return (
    <div className={`w-8 h-5 bg-gradient-to-br ${color} rounded flex items-center justify-center text-white text-xs font-bold`}>
      {symbol}
    </div>
  );
}
