'use client';

import Link from 'next/link';
import { useTranslations } from '@/lib/i18n/useTranslations';
import { usePathname } from 'next/navigation';

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

export function Footer() {
  const pathname = usePathname();
  const { t, locale, changeLocale } = useTranslations();

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
              {t('footer.description')}
            </p>

            <div className="flex gap-2">
              <SocialBtn icon="🐙" href="https://github.com/zametkikostik/OpenBooking" />
              <SocialBtn icon="🐦" href="#" />
              <SocialBtn icon="💼" href="#" />
              <SocialBtn icon="📸" href="#" />
            </div>
          </div>

          {/* Company */}
          <FooterCol icon="🏢" title={t('footer.company')} links={[
            { href: '/about', label: t('footer.about') },
            { href: '/careers', label: t('footer.careers') },
            { href: '/press', label: t('footer.press') },
          ]} pathname={pathname} />

          {/* Support */}
          <FooterCol icon="🎧" title={t('footer.support')} links={[
            { href: '/help', label: t('footer.help') },
            { href: '/safety', label: t('footer.safety') },
            { href: '/contact', label: t('footer.contact') },
          ]} pathname={pathname} />

          {/* Legal & Lang */}
          <div className="space-y-6">
            <FooterCol icon="⚖️" title={t('footer.legal')} links={[
              { href: '/terms', label: t('footer.terms') },
              { href: '/privacy', label: t('footer.privacy') },
              { href: '/cookies', label: t('footer.cookies') },
            ]} pathname={pathname} />

            {/* Languages */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider mb-3 flex items-center gap-2 text-slate-400">
                <span>🌍</span> {t('footer.languages')}
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => changeLocale(lang.code)}
                    className={`px-2 py-1.5 text-xs rounded-lg transition-all ${
                      locale === lang.code
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
            <p className="text-slate-400 text-sm">{t('footer.copyright')}</p>
            
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-500">{t('footer.accepts')}</span>
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
              <span>⬆</span> <span className="hidden md:inline">{t('footer.backToTop')}</span>
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
