import { Link, NavLink } from "react-router-dom";

function Sidebar({ userName, onLogout, onNavigate }) {
    return (
        <aside className="sidebar">
            <Link className="sidebar-brand" to="/" onClick={onNavigate}>
                <div className="sidebar-logo">STM</div>
                <div className="sidebar-brand-text">
                    <div className="sidebar-appname">Student Tasks</div>
                    <div className="sidebar-username">{userName || "Student"}</div>
                </div>
            </Link>

            <nav className="sidebar-nav">
                <NavLink
                    to="/dashboard"
                    className={({ isActive }) =>
                        isActive ? "sidebar-link active" : "sidebar-link"
                    }
                    onClick={onNavigate}
                >
                    Dashboard
                </NavLink>
                <NavLink
                    to="/tasks"
                    className={({ isActive }) =>
                        isActive ? "sidebar-link active" : "sidebar-link"
                    }
                    onClick={onNavigate}
                >
                    My Tasks
                </NavLink>
            </nav>

            <div className="sidebar-footer">
                <button className="sidebar-logout" onClick={onLogout} type="button">
                    Logout
                </button>
            </div>
        </aside>
    );
}

export default Sidebar;
