import { getRequestConfig } from 'next-intl/server'
import { supportedLanguages, defaultLanguage } from './config'

export default getRequestConfig(async ({ locale }) => {
  const lang = (locale as any) || defaultLanguage
  if (!supportedLanguages.some(l => l.code === lang)) {
    locale = defaultLanguage
  }
  return {
    locale: locale || defaultLanguage,
    messages: (await import(`./locales/${locale || defaultLanguage}.json`)).default
  }
})
