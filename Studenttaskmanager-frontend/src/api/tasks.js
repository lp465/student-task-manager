import { refreshToken } from "./auth";

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

async function handleResponse(response) {
  try {
    if (response.status === 401) {
      // try refresh flow first
      try {
        const refresh = await refreshToken();
        if (refresh && refresh.success && refresh.data && refresh.data.token) {
          try {
            const stored = JSON.parse(localStorage.getItem("auth")) || {};
            stored.token = refresh.data.token;
            localStorage.setItem("auth", JSON.stringify(stored));
          } catch (e) {}
          // let caller retry by signalling 'refreshed'
          return { success: false, message: "refreshed" };
        }
      } catch (e) {}
      // fallback: session expired or refresh failed
      try {
        localStorage.removeItem("auth");
      } catch {}
      window.location.href = "/login";
      return { success: false, message: "Session expired" };
    }
    const data = await response.json();
    return data;
  } catch {
    return { success: false, message: "Server unreachable. Please try again." };
  }
}

function authHeaders() {
  try {
    const stored = JSON.parse(localStorage.getItem("auth")) || null;
    const token = stored?.token;
    return token ? { Authorization: `Bearer ${token}` } : {};
  } catch {
    return {};
  }
}

export async function getTasks(status = null) {
  try {
    const url = status
      ? `${BASE_URL}/tasks?status=${status}`
      : `${BASE_URL}/tasks`;
    let response = await fetch(url, { headers: { ...authHeaders() } });
    let handled = await handleResponse(response);
    if (handled && handled.message === "refreshed") {
      // retry with new token
      response = await fetch(url, { headers: { ...authHeaders() } });
      handled = await handleResponse(response);
    }
    return handled;
  } catch {
    return { success: false, message: "Server unreachable. Please try again." };
  }
}

export async function getTaskSummary() {
  try {
    let response = await fetch(`${BASE_URL}/tasks/summary`, {
      headers: { ...authHeaders() },
    });
    let handled = await handleResponse(response);
    if (handled && handled.message === "refreshed") {
      response = await fetch(`${BASE_URL}/tasks/summary`, {
        headers: { ...authHeaders() },
      });
      handled = await handleResponse(response);
    }
    return handled;
  } catch {
    return { success: false, message: "Server unreachable. Please try again." };
  }
}

export async function createTask(data) {
  try {
    let response = await fetch(`${BASE_URL}/tasks/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify(data),
    });
    let handled = await handleResponse(response);
    if (handled && handled.message === "refreshed") {
      response = await fetch(`${BASE_URL}/tasks/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify(data),
      });
      handled = await handleResponse(response);
    }
    return handled;
  } catch {
    return { success: false, message: "Server unreachable. Please try again." };
  }
}

export async function updateTask(taskId, data) {
  try {
    let response = await fetch(`${BASE_URL}/tasks/update/${taskId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify(data),
    });
    let handled = await handleResponse(response);
    if (handled && handled.message === "refreshed") {
      response = await fetch(`${BASE_URL}/tasks/update/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify(data),
      });
      handled = await handleResponse(response);
    }
    return handled;
  } catch {
    return { success: false, message: "Server unreachable. Please try again." };
  }
}

export async function deleteTask(taskId) {
  try {
    let response = await fetch(`${BASE_URL}/tasks/delete/${taskId}`, {
      method: "DELETE",
      headers: { ...authHeaders() },
    });
    let handled = await handleResponse(response);
    if (handled && handled.message === "refreshed") {
      response = await fetch(`${BASE_URL}/tasks/delete/${taskId}`, {
        method: "DELETE",
        headers: { ...authHeaders() },
      });
      handled = await handleResponse(response);
    }
    return handled;
  } catch {
    return { success: false, message: "Server unreachable. Please try again." };
  }
}
