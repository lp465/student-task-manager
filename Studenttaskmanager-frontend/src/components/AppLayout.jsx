import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Sidebar from "./Sidebar";

function AppLayout({ children }) {
    const { user, logout } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    if (!user) {
        return <Navigate to="/login" />;
    }

    return (
        <div className="app-shell">
            <button
                type="button"
                className="sidebar-toggle"
                aria-label="Open menu"
                onClick={() => setSidebarOpen(true)}
            >
                ☰
            </button>
            <div
                className={sidebarOpen ? "sidebar-overlay open" : "sidebar-overlay"}
                onClick={() => setSidebarOpen(false)}
            />
            <div className={sidebarOpen ? "sidebar-wrap open" : "sidebar-wrap"}>
                <Sidebar
                    userName={user?.name}
                    onLogout={() => {
                        logout();
                    }}
                    onNavigate={() => setSidebarOpen(false)}
                />
            </div>
            <main className="app-content">{children}</main>
        </div>
    );
}

export default AppLayout;
