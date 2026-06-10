import { refreshToken } from "./auth";

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

function authHeaders() {
  try {
    const stored = JSON.parse(localStorage.getItem("auth")) || null;
    const token = stored?.token;
    return token ? { Authorization: `Bearer ${token}` } : {};
  } catch {
    return {};
  }
}

async function handleResponse(response) {
  try {
    if (response.status === 401) {
      try {
        const refresh = await refreshToken();
        if (refresh && refresh.success && refresh.data && refresh.data.token) {
          try {
            const stored = JSON.parse(localStorage.getItem("auth")) || {};
            stored.token = refresh.data.token;
            localStorage.setItem("auth", JSON.stringify(stored));
          } catch (e) {}
          return { success: false, message: "refreshed" };
        }
      } catch (e) {}
      try {
        localStorage.removeItem("auth");
      } catch {}
      window.location.href = "/login";
      return { success: false, message: "Session expired" };
    }
    return await response.json();
  } catch {
    return { success: false, message: "Server unreachable. Please try again." };
  }
}

export async function getAnalyticsSummary() {
  try {
    let response = await fetch(`${BASE_URL}/analytics/summary`, {
      headers: { ...authHeaders() },
    });
    let handled = await handleResponse(response);
    if (handled && handled.message === "refreshed") {
      response = await fetch(`${BASE_URL}/analytics/summary`, {
        headers: { ...authHeaders() },
      });
      handled = await handleResponse(response);
    }
    return handled;
  } catch {
    return { success: false, message: "Server unreachable. Please try again." };
  }
}
