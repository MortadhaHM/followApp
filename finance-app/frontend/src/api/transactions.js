/**
 * transactions.js
 * CRUD functions for transactions.
 * All endpoints require a valid JWT via Authorization: Bearer <token>.
 */

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

function getToken() {
  return localStorage.getItem("token");
}

async function request(path, { method = "GET", body } = {}) {
  const token = getToken();
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
      // ignore
    }
    throw new Error(message);
  }

  // 204 No Content (DELETE)
  if (res.status === 204) return null;
  return res.json();
}

export function createTransaction(payload) {
  return request("/transactions/", { method: "POST", body: payload });
}

export function listTransactions() {
  return request("/transactions/", { method: "GET" });
}

export function getTransaction(id) {
  return request(`/transactions/${id}`, { method: "GET" });
}

export function updateTransaction(id, payload) {
  return request(`/transactions/${id}`, { method: "PUT", body: payload });
}

export function deleteTransaction(id) {
  return request(`/transactions/${id}`, { method: "DELETE" });
}

