import { getRequestConfig } from 'next-intl/server'
import { defaultLanguage, supportedLanguages, LanguageCode } from './config'

export default getRequestConfig(async ({ locale }) => {
  const lang = (locale as LanguageCode) || defaultLanguage
  
  // Validate locale
  if (!supportedLanguages.some(l => l.code === lang)) {
    locale = defaultLanguage
  }

  return {
    locale: locale || defaultLanguage,
    messages: (await import(`./locales/${locale || defaultLanguage}.json`)).default,
  }
})
