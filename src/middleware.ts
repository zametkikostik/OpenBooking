// Simple i18n middleware proxy
import { NextRequest, NextResponse } from 'next/server'

const PUBLIC_FILE = /\.(.*)$/

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip files
  if (PUBLIC_FILE.test(pathname)) {
    return NextResponse.next()
  }

  // Skip API routes
  if (pathname.startsWith('/api')) {
    return NextResponse.next()
  }

  // Get locale from cookie or default to 'en'
  const locale = request.cookies.get('NEXT_LOCALE')?.value || 'en'
  
  // Redirect root to default locale
  if (pathname === '/') {
    return NextResponse.redirect(new URL(`/${locale}`, request.url))
  }

  // Check if pathname starts with a locale
  const pathnameHasLocale = ['en', 'ru', 'bg', 'ua', 'de', 'fr', 'es', 'pl', 'tr'].some(
    (loc) => pathname.startsWith(`/${loc}/`) || pathname === `/${loc}`
  )

  if (!pathnameHasLocale) {
    // Redirect to locale-prefixed URL
    return NextResponse.redirect(new URL(`/${locale}${pathname}`, request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
