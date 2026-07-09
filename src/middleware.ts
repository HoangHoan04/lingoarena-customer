import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const handleI18nRouting = createMiddleware(routing);

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Xác định locale từ pathname (nếu có, e.g. /en/dashboard)
  const pathnameLocaleSegment = routing.locales.find(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );
  
  // Chuỗi pathname sau khi loại bỏ locale prefix (e.g. /en/dashboard -> /dashboard)
  const pathnameWithoutLocale = pathnameLocaleSegment
    ? pathname.replace(new RegExp(`^\\/${pathnameLocaleSegment}`), '') || '/'
    : pathname;

  const token = request.cookies.get('token')?.value;

  // Xác định các trang bảo mật và trang đăng nhập/đăng ký
  const isProtectedPath = pathnameWithoutLocale.startsWith('/dashboard') || 
                          pathnameWithoutLocale.startsWith('/arena') || 
                          pathnameWithoutLocale.startsWith('/profile');
                          
  const isAuthPath = pathnameWithoutLocale.startsWith('/login') || 
                     pathnameWithoutLocale.startsWith('/register') || 
                     pathnameWithoutLocale.startsWith('/forgot-password');

  if (isProtectedPath && !token) {
    // Chuyển hướng tới login (giữ nguyên ngôn ngữ hiện tại ở URL nếu có)
    const redirectPath = pathnameLocaleSegment ? `/${pathnameLocaleSegment}/login` : '/login';
    const url = new URL(redirectPath, request.url);
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  if (isAuthPath && token) {
    // Nếu đã đăng nhập thì không cho vào trang auth, điều hướng về trang chủ tương ứng ngôn ngữ
    const redirectPath = pathnameLocaleSegment ? `/${pathnameLocaleSegment}` : '/';
    return NextResponse.redirect(new URL(redirectPath, request.url));
  }

  // Chạy i18n routing middleware để xử lý ngôn ngữ
  return handleI18nRouting(request);
}

export const config = {
  matcher: [
    /*
     * Khớp tất cả các đường dẫn trừ các tệp tĩnh và API:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - images (public images)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|images|icons|favicon.ico).*)',
  ],
};
