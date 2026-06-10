import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { getTasks, getTaskSummary } from "../api/tasks";
import { getAnalyticsSummary } from "../api/analytics";
import TaskStats from "../components/TaskStats";
import UpcomingDeadlines from "../components/UpcomingDeadlines";
import AnalyticsCharts from "../components/AnalyticsCharts";

function startOfToday() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

function isValidDate(dateString) {
  if (!dateString) return false;
  const d = new Date(`${dateString}T00:00:00`);
  return !Number.isNaN(d.getTime());
}

function daysUntil(dueDateString) {
  const due = new Date(`${dueDateString}T00:00:00`);
  const today = startOfToday();
  const ms = due.getTime() - today.getTime();
  return Math.round(ms / (1000 * 60 * 60 * 24));
}

function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [summary, setSummary] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);

  const loadTasks = useCallback(
    async (silent = false) => {
      if (!silent) setLoading(true);
      const result = await getTasks(null);
      if (result.success) {
        setTasks(result.data);
      }
      if (!silent) setLoading(false);
    },
    [user],
  );

  const loadSummary = useCallback(async () => {
    const result = await getTaskSummary();
    if (result.success) {
      setSummary(result.data);
    }
  }, [user]);

  const loadAnalytics = useCallback(async () => {
    setAnalyticsLoading(true);
    const result = await getAnalyticsSummary();
    if (result.success) setAnalytics(result.data);
    setAnalyticsLoading(false);
  }, []);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const initializeDashboard = async () => {
      await loadTasks();
      await loadSummary();
      await loadAnalytics();
    };

    initializeDashboard();
  }, [user, navigate, loadTasks, loadSummary]);

  const pendingTasks = tasks.filter((t) => t?.status === "PENDING");
  const dueThisWeekCount = pendingTasks.filter((t) => {
    if (!isValidDate(t?.dueDate)) return false;
    const d = daysUntil(t.dueDate);
    return d >= 0 && d <= 7;
  }).length;

  const overdueCount = pendingTasks.filter((t) => {
    if (!isValidDate(t?.dueDate)) return false;
    return daysUntil(t.dueDate) < 0;
  }).length;

  const insightText =
    overdueCount > 0
      ? `You have ${overdueCount} pending task(s) overdue. Start with the most urgent one today.`
      : dueThisWeekCount > 0
        ? `You have ${dueThisWeekCount} pending task(s) due this week. Plan a small daily slot to stay ahead.`
        : "Great work! You’re all caught up for now. Add your next task to stay organized.";

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Dashboard</h2>
        <div className="dashboard-subtitle">Welcome, {user?.name}</div>
      </div>

      <div className="dashboard-section">
        <TaskStats summary={summary} />
      </div>

      <div className="dashboard-section">
        <div className="dashboard-section-title">Productivity Analytics</div>
        {analyticsLoading ? (
          <div className="analytics-loading">Loading analytics…</div>
        ) : analytics ? (
          <AnalyticsCharts analytics={analytics} />
        ) : (
          <div className="analytics-empty">No analytics available</div>
        )}
      </div>

      <div className="insight-card">
        <div className="insight-title">Productivity insight</div>
        <div className="insight-text">{insightText}</div>
      </div>

      <div className="dashboard-section">
        {tasks.length === 0 && !loading ? (
          <div className="empty-state">
            <h3>No tasks available</h3>
            <p className="muted">Create your first task to get started.</p>
            <div style={{ marginTop: 12 }}>
              <button
                className="primary-action"
                onClick={() => navigate("/tasks")}
              >
                Add task
              </button>
            </div>
          </div>
        ) : (
          <UpcomingDeadlines tasks={tasks} />
        )}
      </div>

      <div className="dashboard-section">
        <div className="dashboard-section-title">Quick actions</div>
        <div className="dashboard-actions">
          <button
            type="button"
            className="primary-action"
            onClick={() => navigate("/tasks")}
            disabled={loading}
          >
            Manage tasks
          </button>
        </div>
      </div>

      <div className="dashboard-muted">
        Use <strong>My Tasks</strong> to add tasks, search, filter, and manage
        your list.
      </div>
    </div>
  );
}

export default Dashboard;
