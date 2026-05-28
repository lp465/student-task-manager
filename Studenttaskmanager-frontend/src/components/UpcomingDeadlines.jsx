import { useNavigate } from "react-router-dom";

function isValidDate(dateString) {
  if (!dateString) return false;
  const d = new Date(`${dateString}T00:00:00`);
  return !Number.isNaN(d.getTime());
}

function startOfToday() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

function daysUntil(dueDateString) {
  const due = new Date(`${dueDateString}T00:00:00`);
  const today = startOfToday();
  const ms = due.getTime() - today.getTime();
  return Math.round(ms / (1000 * 60 * 60 * 24));
}

function formatDueLabel(dueDateString) {
  const d = new Date(`${dueDateString}T00:00:00`);
  // Keep formatting simple and locale-friendly
  return d.toLocaleDateString();
}

function getDueTone(days) {
  if (days < 0) return "overdue";
  if (days === 0) return "today";
  if (days <= 3) return "soon";
  return "later";
}

function UpcomingDeadlines({ tasks, limit = 3 }) {
  const navigate = useNavigate();

  const pendingWithDue = (tasks || [])
    .filter((t) => t?.status === "PENDING" && isValidDate(t?.dueDate))
    .map((t) => ({
      id: t.id,
      taskTitle: t.taskTitle,
      dueDate: t.dueDate,
      _days: daysUntil(t.dueDate),
    }))
    // overdue first, then today, then nearest upcoming
    .sort((a, b) => a._days - b._days)
    .slice(0, limit);

  return (
    <div className="deadlines-card">
      <div className="deadlines-header">
        <div className="deadlines-title">Upcoming deadlines</div>
        <div className="deadlines-subtitle">
          {pendingWithDue.length > 0
            ? `${pendingWithDue.length} next due`
            : "No pending tasks with due dates"}
        </div>
      </div>

      {pendingWithDue.length === 0 ? (
        <div className="deadlines-empty">
          Add due dates to tasks to see what’s coming up.
        </div>
      ) : (
        <div className="deadlines-grid">
          {pendingWithDue.map((t) => {
            const tone = getDueTone(t._days);
            const label =
              t._days < 0
                ? `${Math.abs(t._days)} day(s) overdue`
                : t._days === 0
                  ? "Due today"
                  : `Due in ${t._days} day(s)`;

            return (
              <button
                type="button"
                className={`deadline-card ${tone}`}
                key={t.id}
                onClick={() =>
                  navigate("/tasks", {
                    state: {
                      presetFilter: "PENDING",
                      presetSearch: t.taskTitle,
                    },
                  })
                }
              >
                <div className="deadline-card-title">{t.taskTitle}</div>
                <div className="deadline-card-meta">
                  <span className="deadline-card-date">
                    {formatDueLabel(t.dueDate)}
                  </span>
                  <span className="deadline-card-label">{label}</span>
                </div>
              </button>
            );
          })}
          <button
            type="button"
            className="deadlines-viewall"
            onClick={() =>
              navigate("/tasks#all-tasks", {
                state: { presetFilter: "PENDING" },
              })
            }
          >
            View all tasks
          </button>
        </div>
      )}
    </div>
  );
}

export default UpcomingDeadlines;
