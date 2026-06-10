import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Sidebar from "./Sidebar";
import { logoutRequest } from "../api/auth";

function AppLayout({ children }) {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

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
          onLogout={async () => {
            // call server to clear refresh cookie
            try {
              await logoutRequest();
            } catch (e) {}
            logout();
            try {
              sessionStorage.setItem(
                "logoutMessage",
                "Logged out successfully",
              );
            } catch (e) {
              // ignore storage errors
            }
            navigate("/login");
          }}
          onNavigate={() => setSidebarOpen(false)}
        />
      </div>
      <main className="app-content">{children}</main>
    </div>
  );
}

export default AppLayout;
