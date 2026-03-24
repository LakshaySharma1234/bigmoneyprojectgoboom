import { Navigate, Outlet } from "react-router-dom";
import { getAuthSession, getDefaultRouteByRole } from "../../auth/session";

export function PublicOnlyRoute() {
  const session = getAuthSession();

  if (session?.isAuthenticated) {
    return <Navigate to={getDefaultRouteByRole(session.role)} replace />;
  }

  return <Outlet />;
}
