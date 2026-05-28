import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
    getTasks,
    createTask,
    updateTask,
    deleteTask,
    getTaskSummary,
} from "../api/tasks";
import TaskForm from "../components/TaskForm";
import TaskCard from "../components/TaskCard";
import TaskFilters from "../components/TaskFilters";
import TaskStats from "../components/TaskStats";

function Dashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([]);
    const [filter, setFilter] = useState(null);
    const [priority, setPriority] = useState(null);
    const [search, setSearch] = useState("");
    const [summary, setSummary] = useState(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [form, setForm] = useState({
        taskTitle: "",
        description: "",
        dueDate: "",
        priority: "MEDIUM",
    });
    const [editingTask, setEditingTask] = useState(null);

    const loadTasks = useCallback(async (silent = false) => {
        if (!silent) setLoading(true);
        setError("");
        const result = await getTasks(user.id, filter);
        if (result.success) {
            setTasks(result.data);
        } else {
            setError(result.message);
        }
        if (!silent) setLoading(false);
    }, [user, filter]);

    const loadSummary = useCallback(async () => {
        const result = await getTaskSummary(user.id);
        if (result.success) {
            setSummary(result.data);
        }
    }, [user]);

    useEffect(() => {
        if (!user) {
            navigate("/login");
            return;
        }
        loadTasks();
        loadSummary();
    }, [filter, priority, user, navigate, loadTasks, loadSummary]);

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
                setForm({ taskTitle: "", description: "", dueDate: "", priority: "MEDIUM" });
                showSuccess("Task updated successfully");
                await loadTasks(true);
                await loadSummary();
            } else {
                setError(result.message);
            }
        } else {
            const result = await createTask(user.id, form);
            if (result.success) {
                setForm({ taskTitle: "", description: "", dueDate: "", priority: "MEDIUM" });
                showSuccess("Task created successfully");
                await loadTasks(true);
                await loadSummary();
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
            priority: task.priority || "MEDIUM",
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleCompleteTask = async (task) => {
        setError("");
        const updatedForm = {
            taskTitle: task.taskTitle,
            description: task.description,
            dueDate: task.dueDate,
            priority: task.priority || "MEDIUM",
            status: "COMPLETED",
        };
        const result = await updateTask(task.id, user.id, updatedForm);
        if (result.success) {
            showSuccess("Task marked as completed");
            await loadTasks(true);
            await loadSummary();
        } else {
            setError(result.message);
        }
    };

    const handleDelete = async (taskId) => {
        if (!window.confirm("Are you sure you want to delete this task?")) return;
        const result = await deleteTask(taskId, user.id);
        if (result.success) {
            showSuccess("Task deleted successfully");
            await loadTasks(true);
            await loadSummary();
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
        setForm({ taskTitle: "", description: "", dueDate: "", priority: "MEDIUM" });
    };

    const filteredTasks = tasks.filter((task) => {
        // Apply status filter
        if (filter !== null && task.status !== filter) return false;
        
        // Apply priority filter
        if (priority !== null && task.priority !== priority) return false;
        
        // Apply search filter
        const term = search.trim().toLowerCase();
        if (!term) return true;
        return (
            task.taskTitle.toLowerCase().includes(term) ||
            (task.description || "").toLowerCase().includes(term)
        );
    });

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <h2>Welcome, {user?.name}</h2>
                <button onClick={handleLogout}>Logout</button>
            </div>

            {success && <p className="success-msg">{success}</p>}

            <TaskStats summary={summary} />

            <TaskForm
                form={form}
                onChange={handleChange}
                onSubmit={handleSubmit}
                editingTask={editingTask}
                onCancel={handleCancelEdit}
                error={error}
                submitting={submitting}
            />

            <TaskFilters
                filter={filter}
                priority={priority}
                search={search}
                onFilterChange={setFilter}
                onPriorityChange={setPriority}
                onSearchChange={setSearch}
            />

            <div className="task-list">
                {loading ? (
                    <p className="loading">Loading tasks...</p>
                ) : filteredTasks.length === 0 ? (
                    <p className="no-tasks">No tasks found.</p>
                ) : (
                    filteredTasks.map((task) => (
                        <TaskCard
                            key={task.id}
                            task={task}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            onComplete={handleCompleteTask}
                        />
                    ))
                )}
            </div>
        </div>
    );
}

export default Dashboard;
