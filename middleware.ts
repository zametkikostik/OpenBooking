import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { i18n, type Locale } from '@/config/i18n';

function getLocale(request: NextRequest): Locale {
  // Check for locale in cookie
  const localeCookie = request.cookies.get('NEXT_LOCALE')?.value as Locale | undefined;
  if (localeCookie && i18n.locales.includes(localeCookie)) {
    return localeCookie;
  }

  // Check for locale in accept-language header
  const acceptLanguage = request.headers.get('accept-language');
  if (acceptLanguage) {
    const preferredLocale = acceptLanguage.split(',')[0].split('-')[0] as Locale;
    if (i18n.locales.includes(preferredLocale)) {
      return preferredLocale;
    }
  }

  return i18n.defaultLocale;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if pathname already has a locale
  const pathnameHasLocale = i18n.locales.some(
    locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  // Skip middleware for:
  // - Static files
  // - API routes
  // - Next.js internals
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  if (!pathnameHasLocale) {
    const locale = getLocale(request);
    
    // Redirect to locale-prefixed path
    request.nextUrl.pathname = `/${locale}${pathname}`;
    return NextResponse.redirect(request.nextUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip all internal paths (_next, api, static)
    '/((?!_next|api|static|.*\\..*|_next/static|_next/image|favicon.ico).*)',
  ],
};
