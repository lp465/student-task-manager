import { useRef } from "react";

function TaskForm({ form, onChange, onSubmit, editingTask, onCancel, error, submitting }) {
    const descriptionRef = useRef(null);
    const subjectRef = useRef(null);

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
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            descriptionRef.current?.focus();
                        }
                    }}
                />
                <textarea
                    name="description"
                    placeholder="Description"
                    value={form.description}
                    onChange={onChange}
                    ref={descriptionRef}
                    rows={3}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            subjectRef.current?.focus();
                        }
                    }}
                />
                <select
                    name="subject"
                    value={form.subject || ""}
                    onChange={onChange}
                    ref={subjectRef}
                >
                    <option value="">Category (optional)</option>
                    <option value="Assignment">Assignment</option>
                    <option value="Exam Preparation">Exam Preparation</option>
                    <option value="Research">Research</option>
                    <option value="Project Work">Project Work</option>
                    <option value="Internship">Internship</option>
                    <option value="Lab Work">Lab Work</option>
                    <option value="Presentation">Presentation</option>
                    <option value="Revision">Revision</option>
                    <option value="Study Session">Study Session</option>
                    <option value="Personal Task">Personal Task</option>
                </select>
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
