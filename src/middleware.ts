import createMiddleware from 'next-intl/middleware'

export default createMiddleware({
  locales: ['en', 'ru', 'bg', 'ua', 'de', 'fr', 'es', 'pl', 'tr'],
  defaultLocale: 'en',
  localePrefix: 'as-needed',
})

export const config = {
  matcher: ['/', '/(ru|bg|ua|de|fr|es|pl|tr)/:path*'],
}
