export type UserRole = "staff" | "employer";

type AuthSession = {
  isAuthenticated: boolean;
  role: UserRole;
};

const AUTH_SESSION_KEY = "caterstaff_auth_session";

export function getAuthSession(): AuthSession | null {
  const rawSession = localStorage.getItem(AUTH_SESSION_KEY);
  if (!rawSession) {
    return null;
  }

  try {
    const parsed = JSON.parse(rawSession) as AuthSession;
    if (
      typeof parsed !== "object" ||
      parsed === null ||
      parsed.isAuthenticated !== true ||
      (parsed.role !== "staff" && parsed.role !== "employer")
    ) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export function setAuthSession(role: UserRole) {
  const session: AuthSession = {
    isAuthenticated: true,
    role,
  };

  localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
}

export function clearAuthSession() {
  localStorage.removeItem(AUTH_SESSION_KEY);
}

export function getDefaultRouteByRole(role: UserRole): string {
  return role === "staff" ? "/staff/dashboard" : "/employer/dashboard";
}
