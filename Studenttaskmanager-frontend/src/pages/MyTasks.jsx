import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import { getTasks, createTask, updateTask, deleteTask } from "../api/tasks";
import TaskForm from "../components/TaskForm";
import TaskCard from "../components/TaskCard";
import TaskFilters from "../components/TaskFilters";

function MyTasks() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState(null);
  const [priority, setPriority] = useState(null);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    taskTitle: "",
    description: "",
    subject: "",
    dueDate: "",
    priority: "MEDIUM",
  });
  const [editingTask, setEditingTask] = useState(null);

  const didApplyPreset = useRef(false);

  const loadTasks = useCallback(
    async (silent = false) => {
      if (!silent) setLoading(true);
      setError("");
      const result = await getTasks(filter);
      if (result.success) {
        setTasks(result.data);
      } else {
        setError(result.message);
      }
      if (!silent) setLoading(false);
    },
    [user, filter],
  );

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (!didApplyPreset.current && location?.state) {
      const { presetFilter, presetPriority, presetSearch } = location.state;
      if (presetFilter !== undefined) setFilter(presetFilter);
      if (presetPriority !== undefined) setPriority(presetPriority);
      if (presetSearch !== undefined) setSearch(presetSearch);
      didApplyPreset.current = true;
    }

    const initialize = async () => {
      await loadTasks();
    };

    initialize();
  }, [user, navigate, loadTasks, location?.state]);

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
      const result = await updateTask(editingTask.id, form);
      if (result.success) {
        setEditingTask(null);
        setForm({
          taskTitle: "",
          description: "",
          subject: "",
          dueDate: "",
          priority: "MEDIUM",
        });
        showSuccess("Task updated successfully");
        await loadTasks(true);
      } else {
        setError(result.message);
      }
    } else {
      const result = await createTask(form);
      if (result.success) {
        setForm({
          taskTitle: "",
          description: "",
          subject: "",
          dueDate: "",
          priority: "MEDIUM",
        });
        showSuccess("Task created successfully");
        await loadTasks(true);
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
      subject: task.subject || "",
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
      subject: task.subject || "",
      dueDate: task.dueDate,
      priority: task.priority || "MEDIUM",
      status: "COMPLETED",
    };
    const result = await updateTask(task.id, updatedForm);
    if (result.success) {
      showSuccess("Task marked as completed");
      await loadTasks(true);
    } else {
      setError(result.message);
    }
  };

  const handleDelete = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    const result = await deleteTask(taskId);
    if (result.success) {
      showSuccess("Task deleted successfully");
      await loadTasks(true);
    } else {
      setError(result.message);
    }
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
    setError("");
    setForm({
      taskTitle: "",
      description: "",
      subject: "",
      dueDate: "",
      priority: "MEDIUM",
    });
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter !== null && task.status !== filter) return false;
    if (priority !== null && task.priority !== priority) return false;
    const term = search.trim().toLowerCase();
    if (!term) return true;
    return (
      task.taskTitle.toLowerCase().includes(term) ||
      (task.description || "").toLowerCase().includes(term) ||
      (task.subject || "").toLowerCase().includes(term)
    );
  });
  useEffect(() => {
    if (location.hash) {
      const element = document.querySelector(location.hash);

      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
        });
      }
    }
  }, [location]);

  return (
    <div className="tasks-page">
      <div className="dashboard-header">
        <h2>My Tasks</h2>
        <div className="dashboard-subtitle">
          Add tasks, filter, and manage your work.
        </div>
      </div>

      {success && <p className="success-msg">{success}</p>}

      <TaskForm
        form={form}
        onChange={handleChange}
        onSubmit={handleSubmit}
        editingTask={editingTask}
        onCancel={handleCancelEdit}
        error={error}
        submitting={submitting}
      />

      <div className="dashboard-section">
        <div className="dashboard-section-title">Find tasks</div>
        <TaskFilters
          filter={filter}
          priority={priority}
          search={search}
          onFilterChange={setFilter}
          onPriorityChange={setPriority}
          onSearchChange={setSearch}
        />
      </div>

      <div className="dashboard-section">
        <div className="dashboard-section-title">All tasks</div>
        <div id="all-tasks" className="task-list">
          {loading ? (
            <p className="loading">Loading tasks...</p>
          ) : filteredTasks.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🗂️</div>
              <div className="empty-title">No tasks found</div>
              <div className="empty-subtitle">
                Try changing filters or add a new task above.
              </div>
            </div>
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
    </div>
  );
}

export default MyTasks;
