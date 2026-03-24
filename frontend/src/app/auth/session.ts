export type UserRole = "worker" | "client";

type AuthSession = {
  isAuthenticated: boolean;
  role: UserRole;
  token: string;
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
      !parsed.token ||
      (parsed.role !== "worker" && parsed.role !== "client")
    ) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export function setAuthSession(role: UserRole, token: string) {
  const session: AuthSession = {
    isAuthenticated: true,
    role,
    token,
  };

  localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
}

export function clearAuthSession() {
  localStorage.removeItem(AUTH_SESSION_KEY);
}

export function getDefaultRouteByRole(role: UserRole): string {
  return role === "worker" ? "/staff/dashboard" : "/employer/dashboard";
}
