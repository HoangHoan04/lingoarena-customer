import ForgotPasswordPage from "@/pages/auth/forgot-password";
import LoginPage from "@/pages/auth/login";
import RegisterPage from "@/pages/auth/register";
import ContactScreen from "@/pages/publics/contact";
import FaqScreen from "@/pages/publics/contact/faq";
import HomeSection from "@/pages/publics/home";
import { PUBLIC_ROUTES } from "./routes";

export const PUBLIC_SCREENS = {
  [PUBLIC_ROUTES.HOME]: <HomeSection />,
  [PUBLIC_ROUTES.CONTACT]: <ContactScreen />,
  [PUBLIC_ROUTES.FAQ]: <FaqScreen />,

  /** Auth */
  [PUBLIC_ROUTES.LOGIN]: <LoginPage />,
  [PUBLIC_ROUTES.REGISTER]: <RegisterPage />,
  [PUBLIC_ROUTES.FORGOT_PASSWORD]: <ForgotPasswordPage />,
};
