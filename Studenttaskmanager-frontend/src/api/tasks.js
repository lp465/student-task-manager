const BASE_URL = "http://localhost:8080/api";

async function handleResponse(response) {
    try {
        const data = await response.json();
        return data;
    } catch {
        return { success: false, message: "Server unreachable. Please try again." };
    }
}

export async function getTasks(userId, status = null) {
    try {
        const url = status
            ? `${BASE_URL}/tasks/user/${userId}?status=${status}`
            : `${BASE_URL}/tasks/user/${userId}`;
        const response = await fetch(url);
        return handleResponse(response);
    } catch {
        return { success: false, message: "Server unreachable. Please try again." };
    }
}

export async function createTask(userId, data) {
    try {
        const response = await fetch(`${BASE_URL}/tasks/create/${userId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        return handleResponse(response);
    } catch {
        return { success: false, message: "Server unreachable. Please try again." };
    }
}

export async function updateTask(taskId, userId, data) {
    try {
        const response = await fetch(
            `${BASE_URL}/tasks/update/${taskId}?userId=${userId}`,
            {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            }
        );
        return handleResponse(response);
    } catch {
        return { success: false, message: "Server unreachable. Please try again." };
    }
}

export async function deleteTask(taskId, userId) {
    try {
        const response = await fetch(
            `${BASE_URL}/tasks/delete/${taskId}?userId=${userId}`,
            { method: "DELETE" }
        );
        return handleResponse(response);
    } catch {
        return { success: false, message: "Server unreachable. Please try again." };
    }
}