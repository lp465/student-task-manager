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

function getDueTone(days) {
    if (days < 0) return "overdue";
    if (days === 0) return "today";
    if (days <= 3) return "soon";
    return "later";
}

function formatDueLabel(dueDateString) {
    const d = new Date(`${dueDateString}T00:00:00`);
    return d.toLocaleDateString();
}

function TaskCard({ task, onEdit, onDelete, onComplete }) {
    const handleComplete = () => {
        if (window.confirm("Are you sure you want to mark this task as completed?")) {
            onComplete(task);
        }
    };

    const showDue = task?.status === "PENDING";
    const hasDue = showDue && isValidDate(task?.dueDate);
    const dueDays = hasDue ? daysUntil(task.dueDate) : null;
    const dueTone = hasDue ? getDueTone(dueDays) : null;

    const dueChipText = !hasDue
        ? "No due date"
        : dueDays < 0
          ? `${Math.abs(dueDays)} day(s) overdue`
          : dueDays === 0
            ? "Due today"
            : `Due in ${dueDays} day(s)`;

    return (
        <div className={`task-card ${task.status.toLowerCase()}`}>
            <div className="task-main">
                <div className="task-top">
                    <div className="task-title">{task.taskTitle}</div>
                    <div className="task-badges">
                        <span className={`status ${task.status.toLowerCase()}`}>
                            {task.status}
                        </span>
                        {task.priority && (
                            <span className={`priority-badge ${task.priority.toLowerCase()}`}>
                                {task.priority}
                            </span>
                        )}
                        {task.subject && (
                            <span className="subject-chip" title="Subject">
                                {task.subject}
                            </span>
                        )}
                        {showDue && (
                            <span
                                className={
                                    hasDue
                                        ? `due-chip ${dueTone}`
                                        : "due-chip nodate"
                                }
                                title={hasDue ? `Due: ${formatDueLabel(task.dueDate)}` : undefined}
                            >
                                {dueChipText}
                            </span>
                        )}
                    </div>
                </div>

                {task.description ? (
                    <div className="task-desc">{task.description}</div>
                ) : (
                    <div className="task-desc empty">No description</div>
                )}

                {hasDue && (
                    <div className="task-meta">
                        Due date: <span className="task-meta-strong">{formatDueLabel(task.dueDate)}</span>
                    </div>
                )}
            </div>
            <div className="task-actions">
                {task.status === "PENDING" && (
                    <button className="complete-btn" onClick={handleComplete}>
                        Complete
                    </button>
                )}
                <button className="edit-btn" onClick={() => onEdit(task)}>
                    Edit
                </button>
                <button className="delete-btn" onClick={() => onDelete(task.id)}>
                    Delete
                </button>
            </div>
        </div>
    );
}

export default TaskCard;
