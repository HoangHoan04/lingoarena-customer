import createMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { routing } from "./i18n/routing";

const handleI18nRouting = createMiddleware(routing);

const PROTECTED_PREFIXES = [
  "/dashboard",
  "/path",
  "/arena",
  "/profile",
  "/classes",
  "/notifications",
];

function isProtectedPath(pathname: string) {
  if (
    PROTECTED_PREFIXES.some(
      (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
    )
  ) {
    return true;
  }
  if (pathname.startsWith("/practice/")) return true;
  if (/^\/courses\/.+\/learn(\/|$)/.test(pathname)) return true;
  return false;
}

export function proxy(request: NextRequest) {
  // wait-on + Cursor port-forward poll HEAD /. Don't run the full i18n
  // render path for those probes — a 404 here retries forever and floods logs.
  if (request.method === "HEAD") {
    return new NextResponse(null, { status: 200 });
  }

  const { pathname } = request.nextUrl;
  const pathnameLocaleSegment = routing.locales.find(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );

  const pathnameWithoutLocale = pathnameLocaleSegment
    ? pathname.replace(new RegExp(`^\\/${pathnameLocaleSegment}`), "") || "/"
    : pathname;

  const token = request.cookies.get("token")?.value;

  const isAuthPath =
    pathnameWithoutLocale.startsWith("/login") ||
    pathnameWithoutLocale.startsWith("/register") ||
    pathnameWithoutLocale.startsWith("/forgot-password");

  if (isProtectedPath(pathnameWithoutLocale) && !token) {
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
  matcher: [
    "/((?!api|_next/static|_next/image|images|icons|favicon.ico|manifest.webmanifest|manifest.json|robots.txt|sitemap.xml).*)",
  ],
};
