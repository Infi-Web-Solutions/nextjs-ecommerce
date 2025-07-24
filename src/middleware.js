import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { languages, defaultLang } from './lib/languages';

export const config = {
  matcher: ['/((?!_next|_static|.*\\..*|api|admin).*)'],
};

const ALLOWED_ORGS = ['trendify', 'snapmart'];

export async function middleware(request) {
  const { pathname } = request.nextUrl;
const host = request.headers.get('host') || '';
  const subdomain = host.split('.')[0];
  console.log("Subdomain from host:", subdomain);
  const ALLOWED_ORGS = ['trendify', 'snapmart'];
   if (!ALLOWED_ORGS.includes(subdomain)) {
    return new NextResponse('Subdomain not allowed', { status: 403 });
  }
  // ✅ 1. LANGUAGE REDIRECTION
 const pathnameHasLang = languages.some(lang => pathname.startsWith(`/${lang}`));

if (!pathnameHasLang) {
  let langFromCookie = request.cookies.get('lang')?.value;

if (!langFromCookie) {
  const acceptLang = request.headers.get('accept-language');
  const browserLang = acceptLang?.split(',')[0]?.split('-')[0]; // "en-US" → "en"
  langFromCookie = languages.includes(browserLang) ? browserLang : defaultLang;
}
  const redirectUrl = new URL(`/${langFromCookie}${pathname}`, request.url);
  return NextResponse.redirect(redirectUrl);
}


  // ✅ 2. Strip locale from path
  const pathWithoutLang = pathname.replace(/^\/[a-z]{2}/, ''); // removes `/en`, `/fr`, etc.
  const token = request.cookies.get('token')?.value;

  // ✅ Public pages that should NOT be protected
  const publicPaths = [
    '/auth/login',
    "/user/products",
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

  // ✅ Redirect to login if trying to access protected page without token
  if (isProtected && !token) {
    const loginPath = pathWithoutLang.startsWith('/admin')
      ? '/admin/login'
      : '/auth/login';

    return NextResponse.redirect(new URL(`/${defaultLang}${loginPath}`, request.url));
  }

  // ✅ JWT check if token exists
  if (token) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      const { payload } = await jwtVerify(token, secret);

      const roleId = String(payload.roleId);
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set('x-user-id', payload.userId);
      requestHeaders.set('x-role-id', roleId);

      // ✅ Restrict /admin to roleId 1 or 2 only
      if (pathWithoutLang.startsWith('/admin') && !['1', '2'].includes(roleId)) {
        return NextResponse.redirect(new URL(`/${defaultLang}/unauthorized`, request.url));
      }

      return NextResponse.next({ request: { headers: requestHeaders } });
    } catch (err) {
      console.error('JWT verify failed:', err.message);
      return NextResponse.redirect(new URL(`/${defaultLang}/auth/login`, request.url));
    }
  }

  // ✅ Continue for non-protected or authenticated routes
  return NextResponse.next();
}




