function TaskCard({ task, onEdit, onDelete, onComplete }) {
    const handleComplete = () => {
        if (window.confirm("Are you sure you want to mark this task as completed?")) {
            onComplete(task);
        }
    };

    return (
        <div className={`task-card ${task.status.toLowerCase()}`}>
            <div className="task-info">
                <h4>{task.taskTitle}</h4>
                <p>{task.description}</p>
                <p>Due: {task.dueDate}</p>
                <div className="task-badges">
                    <span className={`status ${task.status.toLowerCase()}`}>
                        {task.status}
                    </span>
                    {task.priority && (
                        <span className={`priority-badge ${task.priority.toLowerCase()}`}>
                            {task.priority} Priority
                        </span>
                    )}
                </div>
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
