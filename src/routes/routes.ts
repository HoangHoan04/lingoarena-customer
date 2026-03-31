export const REQUIRE_AUTH_ROUTES = {
  CHANGE_PASSWORD: "/change-password",
  PROFILE: "/profile",
  ARENA: "/arena",
  MY_COURSE: "/my-course",
};

export const PUBLIC_ROUTES = {
  HOME: "/",
  ABOUT: "/about",
  CONTACT: "/contact",
  BLOGS: "/blogs",
  BLOG_DETAIL: "/blogs/:slug",
  FAQ: "/faq",
  COURSE: "/courses",
  LEARNING_PATH: "/learning-path",
  COURSE_DETAIL: "/course/detail/:slug",
  ZALO_CALLBACK: "/zalo-callback",
};

export const AUTH_ROUTES = {
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
};

export type RequireAuthRouteKeys = keyof typeof REQUIRE_AUTH_ROUTES;
export type PublicRouteKeys = keyof typeof PUBLIC_ROUTES;
export type AuthRouteKeys = keyof typeof AUTH_ROUTES;
