function TaskFilters({ filter, priority, search, onFilterChange, onPriorityChange, onSearchChange }) {
    return (
        <div className="task-toolbar">
            <div className="search-wrapper">
                <input
                    type="text"
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Search tasks by title or description"
                />
            </div>
            <div className="filters-row">
                <div className="filter-group">
                    <div className="filter-label">Status:</div>
                    <div className="task-filter">
                        <button
                            className={filter === null ? "active" : ""}
                            onClick={() => onFilterChange(null)}
                            type="button"
                        >
                            All
                        </button>
                        <button
                            className={filter === "PENDING" ? "active" : ""}
                            onClick={() => onFilterChange("PENDING")}
                            type="button"
                        >
                            Pending
                        </button>
                        <button
                            className={filter === "COMPLETED" ? "active" : ""}
                            onClick={() => onFilterChange("COMPLETED")}
                            type="button"
                        >
                            Completed
                        </button>
                    </div>
                </div>
                <div className="filter-group">
                    <div className="filter-label">Priority:</div>
                    <div className="priority-filter">
                        <button
                            className={priority === null ? "active" : ""}
                            onClick={() => onPriorityChange(null)}
                            type="button"
                        >
                            All
                        </button>
                        <button
                            className={priority === "LOW" ? "active" : ""}
                            onClick={() => onPriorityChange("LOW")}
                            type="button"
                        >
                            Low
                        </button>
                        <button
                            className={priority === "MEDIUM" ? "active" : ""}
                            onClick={() => onPriorityChange("MEDIUM")}
                            type="button"
                        >
                            Medium
                        </button>
                        <button
                            className={priority === "HIGH" ? "active" : ""}
                            onClick={() => onPriorityChange("HIGH")}
                            type="button"
                        >
                            High
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TaskFilters;
