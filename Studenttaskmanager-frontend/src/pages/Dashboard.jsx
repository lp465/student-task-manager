import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { getTasks, createTask, updateTask, deleteTask } from "../api/tasks";

function Dashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([]);
    const [filter, setFilter] = useState(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [form, setForm] = useState({
        taskTitle: "",
        description: "",
        dueDate: "",
        status: "PENDING",
    });
    const [editingTask, setEditingTask] = useState(null);

    useEffect(() => {
        if (!user) {
            navigate("/login");
            return;
        }
        loadTasks();
    }, [filter]);

    const loadTasks = async () => {
        setLoading(true);
        setError("");
        const result = await getTasks(user.id, filter);
        if (result.success) {
            setTasks(result.data);
        } else {
            setError(result.message);
        }
        setLoading(false);
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const showSuccess = (msg) => {
        setSuccess(msg);
        setTimeout(() => setSuccess(""), 3000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSubmitting(true);
        if (editingTask) {
            const result = await updateTask(editingTask.id, user.id, form);
            if (result.success) {
                setEditingTask(null);
                setForm({ taskTitle: "", description: "", dueDate: "", status: "PENDING" });
                showSuccess("Task updated successfully");
                loadTasks();
            } else {
                setError(result.message);
            }
        } else {
            const result = await createTask(user.id, form);
            if (result.success) {
                setForm({ taskTitle: "", description: "", dueDate: "", status: "PENDING" });
                showSuccess("Task created successfully");
                loadTasks();
            } else {
                setError(result.message);
            }
        }
        setSubmitting(false);
    };

    const handleEdit = (task) => {
        setEditingTask(task);
        setError("");
        setForm({
            taskTitle: task.taskTitle,
            description: task.description,
            dueDate: task.dueDate,
            status: task.status,
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleDelete = async (taskId) => {
        if (!window.confirm("Are you sure you want to delete this task?")) return;
        const result = await deleteTask(taskId, user.id);
        if (result.success) {
            showSuccess("Task deleted successfully");
            loadTasks();
        } else {
            setError(result.message);
        }
    };

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const handleCancelEdit = () => {
        setEditingTask(null);
        setError("");
        setForm({ taskTitle: "", description: "", dueDate: "", status: "PENDING" });
    };

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <h2>Welcome, {user?.name}</h2>
                <button onClick={handleLogout}>Logout</button>
            </div>

            {success && <p className="success-msg">{success}</p>}

            <div className="task-form-section">
                <h3>{editingTask ? "Edit Task" : "Add New Task"}</h3>
                <form onSubmit={handleSubmit}>
                    <input
                        name="taskTitle"
                        placeholder="Task Title"
                        value={form.taskTitle}
                        onChange={handleChange}
                        required
                    />
                    <input
                        name="description"
                        placeholder="Description"
                        value={form.description}
                        onChange={handleChange}
                    />
                    <input
                        name="dueDate"
                        type="date"
                        value={form.dueDate}
                        onChange={handleChange}
                        required
                    />
                    <select
                        name="status"
                        value={form.status}
                        onChange={handleChange}
                    >
                        <option value="PENDING">Pending</option>
                        <option value="COMPLETED">Completed</option>
                    </select>
                    {error && <p className="error">{error}</p>}
                    <div className="form-buttons">
                        <button type="submit" disabled={submitting}>
                            {submitting
                                ? "Saving..."
                                : editingTask
                                ? "Update Task"
                                : "Add Task"}
                        </button>
                        {editingTask && (
                            <button
                                type="button"
                                className="cancel-btn"
                                onClick={handleCancelEdit}
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>

            <div className="task-filter">
                <button
                    className={filter === null ? "active" : ""}
                    onClick={() => setFilter(null)}
                >
                    All
                </button>
                <button
                    className={filter === "PENDING" ? "active" : ""}
                    onClick={() => setFilter("PENDING")}
                >
                    Pending
                </button>
                <button
                    className={filter === "COMPLETED" ? "active" : ""}
                    onClick={() => setFilter("COMPLETED")}
                >
                    Completed
                </button>
            </div>

            <div className="task-list">
                {loading ? (
                    <p className="loading">Loading tasks...</p>
                ) : tasks.length === 0 ? (
                    <p className="no-tasks">No tasks found.</p>
                ) : (
                    tasks.map((task) => (
                        <div
                            key={task.id}
                            className={`task-card ${task.status.toLowerCase()}`}
                        >
                            <div className="task-info">
                                <h4>{task.taskTitle}</h4>
                                <p>{task.description}</p>
                                <p>Due: {task.dueDate}</p>
                                <span className={`status ${task.status.toLowerCase()}`}>
                                    {task.status}
                                </span>
                            </div>
                            <div className="task-actions">
                                <button onClick={() => handleEdit(task)}>Edit</button>
                                <button onClick={() => handleDelete(task.id)}>
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default Dashboard;