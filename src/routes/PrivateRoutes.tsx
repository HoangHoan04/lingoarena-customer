import { Navigate } from "react-router-dom";
import { PUBLIC_ROUTES } from "./routes";

export default function PrivateRoute() {
  return <Navigate to={PUBLIC_ROUTES.LOGIN} replace />;
}
