import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { languages, defaultLang } from './lib/languages';
import { getSlugFromHostname } from './lib/slug';

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|images|uploads|api/auth).*)'],
};

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  // const hostname = request.nextUrl.hostname;
  const hostHeader = request.headers.get('host');
  const hostname = hostHeader ? hostHeader.split(':')[0] : request.nextUrl.hostname;

  
  console.log(`Middleware: ${pathname} on ${hostname}`);

  // Skip middleware for API routes that don't need it or are handled elsewhere
  if (pathname.startsWith('/api/auth')) {
    return NextResponse.next();
  }

  // Extract subdomain/slug using our utility
  const subdomain = getSlugFromHostname(hostname);
  console.log("Extracted subdomain/slug:", subdomain);

  // ✅ Validate Organization Slug
  const allowedOrgs = ['trendify', 'snapmart'];
  if (subdomain && !allowedOrgs.includes(subdomain)) {
     return new NextResponse(
       `<html><body><h1>404 - Organization Not Found</h1><p>The organization "${subdomain}" does not exist.</p></body></html>`,
       { status: 404, headers: { 'content-type': 'text/html' } }
     );
  }




  // ✅ 1. LANGUAGE REDIRECTION
  const pathnameHasLang = languages.some(lang => 
    pathname === `/${lang}` || pathname.startsWith(`/${lang}/`)
  );

  // Don't redirect if it has a lang, or is an API, or is an Admin route
  if (!pathnameHasLang && !pathname.startsWith('/api') && !pathname.startsWith('/admin')) {
    let langFromCookie = request.cookies.get('lang')?.value;

    if (!langFromCookie) {
      const acceptLang = request.headers.get('accept-language');
      const browserLang = acceptLang?.split(',')[0]?.split('-')[0];
      langFromCookie = languages.includes(browserLang) ? browserLang : defaultLang;
    }
    const redirectUrl = new URL(`/${langFromCookie}${pathname}`, request.url);
    return NextResponse.redirect(redirectUrl);
  }

  // ✅ 2. Strip locale from path for checking permissions
  const pathWithoutLang = pathnameHasLang 
    ? (pathname.replace(/^\/(en|fr|de)/, '') || '/')
    : pathname;

  const token = request.cookies.get('token')?.value;

  // ✅ Public pages that should NOT be protected
  const publicPaths = [
    '/',
    '/auth/login',
    '/user/products',
    '/auth/signup',
    '/admin/login',
    '/unauthorized'
  ];

  // ✅ Protected paths
  const protectedPaths = ['/admin', '/auth', '/user', '/dashboard', '/profile'];

  const isPublic = publicPaths.includes(pathWithoutLang);
  const isProtected = !isPublic && protectedPaths.some(path =>
    pathWithoutLang === path || pathWithoutLang.startsWith(`${path}/`)
  );

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-org-slug', subdomain || '');

  // ✅ Redirect to login if trying to access protected page without token
  if (isProtected && !token) {
    const loginPath = pathWithoutLang.startsWith('/admin')
      ? '/admin/login'
      : `/${defaultLang}/auth/login`;

    return NextResponse.redirect(new URL(loginPath, request.url));
  }

  // ✅ JWT check if token exists
  if (token) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      const { payload } = await jwtVerify(token, secret);

      const roleId = String(payload.roleId);
      requestHeaders.set('x-user-id', payload.userId);
      requestHeaders.set('x-role-id', roleId);
      
      // If the token has an organization slug, use it (overrides hostname slug)
      if (payload.organizationSlug) {
        requestHeaders.set('x-org-slug', payload.organizationSlug);
      }

      // ✅ Restrict /admin to roleId 1 or 2 only
      if (pathWithoutLang.startsWith('/admin') && !['1', '2'].includes(roleId)) {
        const unauthorizedPath = pathWithoutLang.startsWith('/admin')
          ? '/unauthorized'
          : `/${defaultLang}/unauthorized`;
        return NextResponse.redirect(new URL(unauthorizedPath, request.url));
      }

      return NextResponse.next({ request: { headers: requestHeaders } });

    } catch (err) {
      console.error('JWT verify failed:', err.message);
      
      if (isProtected) {
        const loginPath = pathWithoutLang.startsWith('/admin')
          ? '/admin/login'
          : `/${defaultLang}/auth/login`;
        return NextResponse.redirect(new URL(loginPath, request.url));
      }
    }
  }

  return NextResponse.next({ request: { headers: requestHeaders } });
}


