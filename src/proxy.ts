import createMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { routing } from "./i18n/routing";

const handleI18nRouting = createMiddleware(routing);

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const pathnameLocaleSegment = routing.locales.find(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );

  const pathnameWithoutLocale = pathnameLocaleSegment
    ? pathname.replace(new RegExp(`^\\/${pathnameLocaleSegment}`), "") || "/"
    : pathname;

  const token = request.cookies.get("token")?.value;

  const isProtectedPath =
    pathnameWithoutLocale.startsWith("/dashboard") ||
    pathnameWithoutLocale.startsWith("/arena") ||
    pathnameWithoutLocale.startsWith("/profile");

  const isAuthPath =
    pathnameWithoutLocale.startsWith("/login") ||
    pathnameWithoutLocale.startsWith("/register") ||
    pathnameWithoutLocale.startsWith("/forgot-password");

  if (isProtectedPath && !token) {
    const redirectPath = pathnameLocaleSegment
      ? `/${pathnameLocaleSegment}/login`
      : "/login";
    const url = new URL(redirectPath, request.url);
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  if (isAuthPath && token) {
    const redirectPath = pathnameLocaleSegment
      ? `/${pathnameLocaleSegment}`
      : "/";
    return NextResponse.redirect(new URL(redirectPath, request.url));
  }

  return handleI18nRouting(request);
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|images|icons|favicon.ico).*)"],
};
