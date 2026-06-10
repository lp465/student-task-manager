const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

async function handleResponse(response) {
  try {
    const data = await response.json();
    return data;
  } catch {
    return { success: false, message: "Server unreachable. Please try again." };
  }
}

export async function registerUser(data) {
  try {
    const response = await fetch(`${BASE_URL}/users/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  } catch {
    return { success: false, message: "Server unreachable. Please try again." };
  }
}

export async function loginUser(data) {
  try {
    const response = await fetch(`${BASE_URL}/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  } catch {
    return { success: false, message: "Server unreachable. Please try again." };
  }
}

export async function refreshToken() {
  try {
    // send cookies to allow server to read HttpOnly refresh token
    const response = await fetch(`${BASE_URL}/users/refresh`, {
      method: "POST",
      credentials: "include",
    });
    return handleResponse(response);
  } catch {
    return { success: false, message: "Server unreachable. Please try again." };
  }
}

export async function logoutRequest() {
  try {
    const response = await fetch(`${BASE_URL}/users/logout`, {
      method: "POST",
      credentials: "include",
    });
    return handleResponse(response);
  } catch {
    return { success: false, message: "Server unreachable. Please try again." };
  }
}
