import { getAuthSession } from "../auth/session";

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const session = getAuthSession();

  const headers = {
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
  get: (endpoint) => request(endpoint),
  post: (endpoint, data) => request(endpoint, { method: "POST", body: JSON.stringify(data) }),
  put: (endpoint, data) => request(endpoint, { method: "PUT", body: JSON.stringify(data) }),
  delete: (endpoint) => request(endpoint, { method: "DELETE" }),
};
