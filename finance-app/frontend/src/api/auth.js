/**
 * auth.js
 * Small API wrapper for registering and logging in users.
 * Uses fetch and returns the JWT access token on success.
 */

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

async function request(path, { method = "GET", body, token } = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const data = await res.json();
      message = data?.detail || message;
    } catch {
      // ignore JSON parsing errors
    }
    throw new Error(message);
  }

  return res.json();
}

export async function register(email, password) {
  const data = await request("/auth/register", {
    method: "POST",
    body: { email, password },
  });
  // Backend returns { access_token: "..." }
  return data?.access_token;
}

export async function login(email, password) {
  const data = await request("/auth/login", {
    method: "POST",
    body: { email, password },
  });
  return data?.access_token;
}

