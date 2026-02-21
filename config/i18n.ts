export const i18n = {
  defaultLocale: 'ru',
  locales: ['ru', 'en', 'bg', 'ua', 'de', 'fr', 'es', 'pl', 'tr'],
  localeDetection: true,
} as const;

export type Locale = (typeof i18n)['locales'][number];

export const localeNames: Record<Locale, string> = {
  ru: 'Русский',
  en: 'English',
  bg: 'Български',
  ua: 'Українська',
  de: 'Deutsch',
  fr: 'Français',
  es: 'Español',
  pl: 'Polski',
  tr: 'Türkçe',
};

export const localeDirection: Record<Locale, 'ltr' | 'rtl'> = {
  ru: 'ltr',
  en: 'ltr',
  bg: 'ltr',
  ua: 'ltr',
  de: 'ltr',
  fr: 'ltr',
  es: 'ltr',
  pl: 'ltr',
  tr: 'ltr',
};
