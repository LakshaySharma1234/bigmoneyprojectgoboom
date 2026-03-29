import { getAuthSession } from "../auth/session";

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

interface RequestOptions extends RequestInit {
  headers?: Record<string, string>;
}

async function request(endpoint: any, options: RequestOptions = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const session = getAuthSession();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (session && session.token) {
    headers["Authorization"] = `Bearer ${session.token}`;
  }

  const config = {
    ...options,
    headers,
  };

  const response = await fetch(url, config);

  if (!response.ok) {
    let message = "Something went wrong";

    try {
      const error = await response.json();
      message = error.detail || message;
    } catch {
      message = response.statusText || message;
    }

    throw new Error(message);
  }

  if (response.status === 204) {
    return null;
  }
  
  return response.json();
}

export const api = {
  get: (endpoint: any) => request(endpoint),
  post: (endpoint: any, data: any) => request(endpoint, { method: "POST", body: JSON.stringify(data) }),
  put: (endpoint: any, data: any) => request(endpoint, { method: "PUT", body: JSON.stringify(data) }),
  delete: (endpoint: any) => request(endpoint, { method: "DELETE" }),
};
