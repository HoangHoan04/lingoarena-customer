export const REQUIRE_AUTH_ROUTES = {};

export const PUBLIC_ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  ABOUT: "/about",
  CONTACT: "/contact",
  BLOGS: "/blogs",
  BLOG_DETAIL: "/blogs/:slug",
  FAQ: "/faq",
  ZALO_CALLBACK: "/zalo-callback",
};

export type RequireAuthRouteKeys = keyof typeof REQUIRE_AUTH_ROUTES;
export type PublicRouteKeys = keyof typeof PUBLIC_ROUTES;
