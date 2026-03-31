import ArenaScreen from "@/pages/require-auth/arena";
import { REQUIRE_AUTH_ROUTES } from "./routes";
import ChangePasswordScreen from "@/pages/require-auth/change-password";
import ProfileScreen from "@/pages/require-auth/profile";

export const REQUIRE_AUTH_SCREENS = {
  [REQUIRE_AUTH_ROUTES.ARENA]: <ArenaScreen />,
  [REQUIRE_AUTH_ROUTES.CHANGE_PASSWORD]: <ChangePasswordScreen />,
  [REQUIRE_AUTH_ROUTES.PROFILE]: <ProfileScreen />,
};
