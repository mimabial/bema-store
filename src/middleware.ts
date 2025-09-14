import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const locales = ['en', 'fr'];
const defaultLocale = 'en';

function getLocale(request: NextRequest): string {
  // Check URL pathname
  const pathname = request.nextUrl.pathname;
  const localeFromPath = locales.find(locale => 
    pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );
  
  if (localeFromPath) return localeFromPath;
  
  // Check Accept-Language header
  const acceptLanguage = request.headers.get('accept-language');
  if (acceptLanguage) {
    const preferred = acceptLanguage
      .split(',')[0]
      ?.split('-')[0];
    if (locales.includes(preferred as any)) {
      return preferred;
    }
  }
  
  return defaultLocale;
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Skip API routes, static files
  if (pathname.startsWith('/api') || pathname.includes('.')) {
    return NextResponse.next();
  }
  
  const locale = getLocale(request);
  const pathnameHasLocale = locales.some(loc => 
    pathname.startsWith(`/${loc}/`) || pathname === `/${loc}`
  );
  
  if (!pathnameHasLocale) {
    const newUrl = new URL(`/${locale}${pathname}`, request.url);
    return NextResponse.redirect(newUrl);
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
