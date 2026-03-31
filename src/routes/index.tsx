import { lazy, Suspense } from "react";
import { Navigate, Outlet, useRoutes } from "react-router-dom";
import GlobalLoading from "../components/layout/Loading";
import AuthLayout from "../layout/AuthLayout";
import PublicLayout from "../layout/PublicLayout";
import RequireAuthLayout from "../layout/RequireAuthLayout";
import { AUTH_SCREENS } from "./AuthScreens";
import PrivateRoute from "./PrivateRoutes";
import { PUBLIC_SCREENS } from "./PublicScreens";
import { AUTH_ROUTES, PUBLIC_ROUTES, REQUIRE_AUTH_ROUTES } from "./routes";
import { REQUIRE_AUTH_SCREENS } from "./RequireAuthScreens";

const Page404 = lazy(() => import("../pages/NotFound"));

const RequireAuthRoutes = [
  {
    path: "/",
    element: (
      <RequireAuthLayout>
        <Suspense fallback={<GlobalLoading />}>
          <PrivateRoute />
        </Suspense>
      </RequireAuthLayout>
    ),
    children: [
      {
        path: REQUIRE_AUTH_ROUTES.ARENA.replace(/^\//, ""),
        element: REQUIRE_AUTH_SCREENS[REQUIRE_AUTH_ROUTES.ARENA],
      },
      {
        path: REQUIRE_AUTH_ROUTES.CHANGE_PASSWORD.replace(/^\//, ""),
        element: REQUIRE_AUTH_SCREENS[REQUIRE_AUTH_ROUTES.CHANGE_PASSWORD],
      },
      {
        path: REQUIRE_AUTH_ROUTES.PROFILE.replace(/^\//, ""),
        element: REQUIRE_AUTH_SCREENS[REQUIRE_AUTH_ROUTES.PROFILE],
      },
    ],
  },
];

const AuthRoutes = [
  {
    path: "/",
    element: (
      <AuthLayout>
        <Suspense fallback={<GlobalLoading />}>
          <Outlet />
        </Suspense>
      </AuthLayout>
    ),
    children: [
      {
        path: AUTH_ROUTES.LOGIN,
        element: AUTH_SCREENS[AUTH_ROUTES.LOGIN],
      },
      {
        path: AUTH_ROUTES.REGISTER,
        element: AUTH_SCREENS[AUTH_ROUTES.REGISTER],
      },
      {
        path: AUTH_ROUTES.FORGOT_PASSWORD,
        element: AUTH_SCREENS[AUTH_ROUTES.FORGOT_PASSWORD],
      },
    ],
  },
];

const PublicRoutes = [
  {
    path: "/",
    element: (
      <PublicLayout>
        <Suspense fallback={<GlobalLoading />}>
          <Outlet />
        </Suspense>
      </PublicLayout>
    ),
    children: [
      {
        index: true,
        element: PUBLIC_SCREENS[PUBLIC_ROUTES.HOME],
      },

      {
        path: PUBLIC_ROUTES.ABOUT,
        element: PUBLIC_SCREENS[PUBLIC_ROUTES.ABOUT],
      },
      {
        path: PUBLIC_ROUTES.CONTACT,
        element: PUBLIC_SCREENS[PUBLIC_ROUTES.CONTACT],
      },
      {
        path: PUBLIC_ROUTES.CONTACT,
        element: PUBLIC_SCREENS[PUBLIC_ROUTES.CONTACT],
      },
      {
        path: PUBLIC_ROUTES.BLOGS,
        element: PUBLIC_SCREENS[PUBLIC_ROUTES.BLOGS],
      },
      {
        path: PUBLIC_ROUTES.BLOG_DETAIL,
        element: PUBLIC_SCREENS[PUBLIC_ROUTES.BLOG_DETAIL],
      },
      {
        path: PUBLIC_ROUTES.FAQ,
        element: PUBLIC_SCREENS[PUBLIC_ROUTES.FAQ],
      },
      {
        path: PUBLIC_ROUTES.COURSE,
        element: PUBLIC_SCREENS[PUBLIC_ROUTES.COURSE],
      },
      {
        path: PUBLIC_ROUTES.COURSE_DETAIL,
        element: PUBLIC_SCREENS[PUBLIC_ROUTES.COURSE_DETAIL],
      },
      {
        path: PUBLIC_ROUTES.LEARNING_PATH,
        element: PUBLIC_SCREENS[PUBLIC_ROUTES.LEARNING_PATH],
      },
      {
        path: PUBLIC_ROUTES.BLOGS,
        element: PUBLIC_SCREENS[PUBLIC_ROUTES.BLOGS],
      },
    ],
  },
];

export default function AppRouter() {
  const routes = useRoutes([
    ...PublicRoutes,
    ...RequireAuthRoutes,
    ...AuthRoutes,
    {
      path: "/404",
      element: (
        <Suspense fallback={<GlobalLoading />}>
          <Page404 />
        </Suspense>
      ),
    },
    {
      path: "*",
      element: <Navigate replace to="/404" />,
    },
  ]);

  return routes;
}
