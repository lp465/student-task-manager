function TaskStats({ summary }) {
    return (
        <div className="task-stats">
            <div className="task-stat-card">
                <p className="stat-title">Completed</p>
                <p className="stat-value">{summary?.completedCount ?? 0}</p>
            </div>
            <div className="task-stat-card">
                <p className="stat-title">Pending</p>
                <p className="stat-value">{summary?.pendingCount ?? 0}</p>
            </div>
            <div className="task-stat-card">
                <p className="stat-title">High Priority Pending</p>
                <p className="stat-value">{summary?.highPriorityCount ?? 0}</p>
            </div>
        </div>
    );
}

export default TaskStats;
