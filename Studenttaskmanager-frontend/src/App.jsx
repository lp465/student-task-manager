import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import MyTasks from "./pages/MyTasks";
import Landing from "./pages/Landing";
import AppLayout from "./components/AppLayout";

function RootRoute() {
    const { user } = useAuth();
    return user ? <Navigate to="/dashboard" /> : <Landing />;
}

function RedirectIfAuthed({ children }) {
    const { user } = useAuth();
    return user ? <Navigate to="/dashboard" /> : children;
}

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<RootRoute />} />
                    <Route
                        path="/login"
                        element={
                            <RedirectIfAuthed>
                                <Login />
                            </RedirectIfAuthed>
                        }
                    />
                    <Route
                        path="/register"
                        element={
                            <RedirectIfAuthed>
                                <Register />
                            </RedirectIfAuthed>
                        }
                    />
                    <Route
                        path="/dashboard"
                        element={
                            <AppLayout>
                                <Dashboard />
                            </AppLayout>
                        }
                    />
                    <Route
                        path="/tasks"
                        element={
                            <AppLayout>
                                <MyTasks />
                            </AppLayout>
                        }
                    />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;