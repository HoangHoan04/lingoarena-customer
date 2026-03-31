import ForgotPasswordScreen from "@/pages/auth/forgot-password";
import LoginScreen from "@/pages/auth/login";
import RegisterScreen from "@/pages/auth/register";
import { AUTH_ROUTES } from "./routes";

export const AUTH_SCREENS = {
  /** Auth */
  [AUTH_ROUTES.LOGIN]: <LoginScreen />,
  [AUTH_ROUTES.REGISTER]: <RegisterScreen />,
  [AUTH_ROUTES.FORGOT_PASSWORD]: <ForgotPasswordScreen />,
};
