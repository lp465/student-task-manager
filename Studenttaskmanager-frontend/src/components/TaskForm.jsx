function TaskForm({ form, onChange, onSubmit, editingTask, onCancel, error, submitting }) {
    return (
        <div className="task-form-section">
            <h3>{editingTask ? "Edit Task" : "Add New Task"}</h3>
            <form onSubmit={onSubmit}>
                <input
                    name="taskTitle"
                    placeholder="Task Title"
                    value={form.taskTitle}
                    onChange={onChange}
                    required
                />
                <input
                    name="description"
                    placeholder="Description"
                    value={form.description}
                    onChange={onChange}
                />
                <input
                    name="dueDate"
                    type="date"
                    value={form.dueDate}
                    onChange={onChange}
                    required
                />
                <select
                    name="priority"
                    value={form.priority}
                    onChange={onChange}
                >
                    <option value="LOW">Low Priority</option>
                    <option value="MEDIUM">Medium Priority</option>
                    <option value="HIGH">High Priority</option>
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
                            onClick={onCancel}
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
}

export default TaskForm;
