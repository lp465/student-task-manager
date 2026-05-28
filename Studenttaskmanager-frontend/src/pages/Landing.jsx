import { Link } from "react-router-dom";

function Landing() {
    return (
        <div className="landing">
            <div className="landing-card">
                <div className="landing-badge">Student Task Management System</div>
                <h1 className="landing-title">Stay on top of assignments and deadlines.</h1>
                <p className="landing-subtitle">
                    Track your tasks, prioritize what matters, and see your progress at a glance.
                </p>

                <div className="landing-actions">
                    <Link className="landing-btn primary" to="/login">
                        Login
                    </Link>
                    <Link className="landing-btn" to="/register">
                        Create account
                    </Link>
                </div>

                <div className="landing-features">
                    <div className="landing-feature">
                        <div className="landing-feature-title">Quick task tracking</div>
                        <div className="landing-feature-desc">Add, edit, complete, and delete tasks.</div>
                    </div>
                    <div className="landing-feature">
                        <div className="landing-feature-title">Filters + search</div>
                        <div className="landing-feature-desc">Find tasks by status, priority, or keywords.</div>
                    </div>
                    <div className="landing-feature">
                        <div className="landing-feature-title">Dashboard stats</div>
                        <div className="landing-feature-desc">See pending, completed, and high priority counts.</div>
                    </div>
                </div>

                <div className="landing-how">
                    <div className="landing-how-title">How it works</div>
                    <ol className="landing-steps">
                        <li>
                            <span className="landing-step-title">Create tasks</span>
                            <span className="landing-step-desc">Add what you need to complete with a due date.</span>
                        </li>
                        <li>
                            <span className="landing-step-title">Organize priorities</span>
                            <span className="landing-step-desc">Use priority and category to stay focused.</span>
                        </li>
                        <li>
                            <span className="landing-step-title">Track deadlines</span>
                            <span className="landing-step-desc">See upcoming deadlines and plan your week.</span>
                        </li>
                    </ol>
                </div>
            </div>
        </div>
    );
}

export default Landing;
