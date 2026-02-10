import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "../modules/auth/store/authStore";

export default function PrivateRoute() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const session = useAuthStore((s) => s.session);
  const authed = session && isAuthenticated();
  const location = useLocation();

  if (!authed) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
