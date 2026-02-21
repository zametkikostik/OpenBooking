'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const languages = [
  { code: 'ru', name: 'Русский' },
  { code: 'en', name: 'English' },
  { code: 'bg', name: 'Български' },
  { code: 'ua', name: 'Українська' },
  { code: 'de', name: 'Deutsch' },
  { code: 'fr', name: 'Français' },
  { code: 'es', name: 'Español' },
  { code: 'pl', name: 'Polski' },
  { code: 'tr', name: 'Türkçe' },
];

const companyLinks = [
  { href: '/about', label: 'О нас' },
  { href: '/careers', label: 'Карьера' },
  { href: '/press', label: 'Пресса' },
];

const supportLinks = [
  { href: '/help', label: 'Помощь' },
  { href: '/safety', label: 'Безопасность' },
  { href: '/contact', label: 'Контакты' },
];

const legalLinks = [
  { href: '/terms', label: 'Условия' },
  { href: '/privacy', label: 'Конфиденциальность' },
  { href: '/cookies', label: 'Cookies' },
];

export function Footer() {
  const pathname = usePathname();

  const handleLanguageChange = (code: string) => {
    // Store language preference
    document.cookie = `NEXT_LOCALE=${code};path=/;max-age=31536000`;
    // Reload page to apply language
    window.location.reload();
  };

  return (
    <footer className="bg-card border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Company */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Компания</h3>
            <ul className="space-y-2">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`text-sm text-muted-foreground hover:text-foreground transition-colors ${
                      pathname === link.href ? 'text-foreground font-medium' : ''
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Поддержка</h3>
            <ul className="space-y-2">
              {supportLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`text-sm text-muted-foreground hover:text-foreground transition-colors ${
                      pathname === link.href ? 'text-foreground font-medium' : ''
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Правовая информация</h3>
            <ul className="space-y-2">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`text-sm text-muted-foreground hover:text-foreground transition-colors ${
                      pathname === link.href ? 'text-foreground font-medium' : ''
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Languages */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Языки</h3>
            <div className="flex flex-wrap gap-2">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`px-2 py-1 text-xs rounded transition-colors ${
                    pathname.startsWith(`/${lang.code}`)
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted hover:bg-muted-foreground/20'
                  }`}
                  title={lang.name}
                >
                  {lang.code.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-8 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🏠</span>
              <span className="font-bold text-xl">OpenBooking</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2026 OpenBooking. Все права защищены.
            </p>
            <div className="flex gap-4">
              <a
                href="https://github.com/zametkikostik/OpenBooking"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                title="GitHub"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
