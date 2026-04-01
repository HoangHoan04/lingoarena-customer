export const REQUIRE_AUTH_ROUTES = {
  CHANGE_PASSWORD: "/change-password",
  PROFILE: "/profile",
  ARENA: "/arena",
  MY_COURSE: "/my-course",
  MOCK_TEST: "/mock-test",
};

export const PUBLIC_ROUTES = {
  HOME: "/",
  ABOUT: "/about",
  CONTACT: "/contact",
  BLOGS: "/blogs",
  BLOG_DETAIL: "/blogs/:slug",
  FAQ: "/faq",
  COURSE: "/courses",
  ROAD_MAP: "/road-map",
  COURSE_DETAIL: "/course/detail/:slug",
  ZALO_CALLBACK: "/zalo-callback",
  PRACTICE: "/practice",
  PRIVACY_POLICY: "/privacy-policy",
  TERMS_OF_SERVICE: "/terms-of-service",
  TRANSLATE: "/translate",
};

export const AUTH_ROUTES = {
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
};

export type RequireAuthRouteKeys = keyof typeof REQUIRE_AUTH_ROUTES;
export type PublicRouteKeys = keyof typeof PUBLIC_ROUTES;
export type AuthRouteKeys = keyof typeof AUTH_ROUTES;
