import { Navigate, Outlet } from "react-router-dom";
import { getAuthSession, getDefaultRouteByRole, type UserRole } from "../../auth/session";

type RequireRoleRouteProps = {
  allowedRole: UserRole;
};

function RequireRoleRoute({ allowedRole }: RequireRoleRouteProps) {
  const session = getAuthSession();

  if (!session?.isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  if (session.role !== allowedRole) {
    return <Navigate to={getDefaultRouteByRole(session.role)} replace />;
  }

  return <Outlet />;
}

export function StaffOnlyRoute() {
  return <RequireRoleRoute allowedRole="worker" />;
}

export function EmployerOnlyRoute() {
  return <RequireRoleRoute allowedRole="client" />;
}
