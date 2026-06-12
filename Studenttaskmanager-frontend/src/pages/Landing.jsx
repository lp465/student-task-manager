import { Link } from "react-router-dom";

function Landing() {
  return (
    <div className="landing">

      <div className="landing-card">

        {/* HERO */}
        <div className="landing-hero">

          <div className="landing-badge">
            🎓 Student Task Management System
          </div>

          <h1 className="landing-title">
            Stay on top of assignments & deadlines
          </h1>

          <p className="landing-subtitle">
            Track tasks, prioritize effectively, and visualize your productivity with smart analytics.
          </p>

          <div className="landing-actions">
            <Link className="landing-btn primary" to="/login">
              Get Started
            </Link>

          </div>

        </div>

        {/* FEATURES */}
        <div className="landing-section-title">
          ✨ Features
        </div>

        <div className="landing-features">

          <div className="landing-feature-card">
            <h3>⚡ Quick Task Tracking</h3>
            <p>Add, edit, complete, and manage tasks effortlessly.</p>
          </div>

          <div className="landing-feature-card">
            <h3>🔍 Smart Filters</h3>
            <p>Search and filter by status, priority, or keywords instantly.</p>
          </div>

          <div className="landing-feature-card">
            <h3>📊 Analytics Dashboard</h3>
            <p>Visual insights for completion, priorities, and categories.</p>
          </div>

        </div>

        {/* HOW IT WORKS */}
        <div className="landing-section-title">
          🚀 How it works
        </div>

        <div className="landing-steps">

          <div className="landing-step">
            <div className="step-number">1</div>
            <div>
              <h4>Create tasks</h4>
              <p>Add tasks with deadlines and descriptions.</p>
            </div>
          </div>

          <div className="landing-step">
            <div className="step-number">2</div>
            <div>
              <h4>Organize priorities</h4>
              <p>Assign categories and priority levels.</p>
            </div>
          </div>

          <div className="landing-step">
            <div className="step-number">3</div>
            <div>
              <h4>Track progress</h4>
              <p>Monitor deadlines and stay productive.</p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

export default Landing;