import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../api/auth";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");

  useEffect(() => {
    try {
      const msg = sessionStorage.getItem("logoutMessage");
      if (msg) {
        setToast(msg);
        // clear after showing once
        sessionStorage.removeItem("logoutMessage");
        setTimeout(() => setToast(""), 3000);
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const result = await loginUser(form);
    if (result.success) {
      login(result.data);
      navigate("/dashboard");
    } else {
      setError(result.message || "Login failed");
    }
  };

  return (
    <div className="auth-container">
      <Link className="auth-back" to="/">
        ← Back to Home
      </Link>
      <h2>Login</h2>
      {toast && <div className="toast success">{toast}</div>}
      <form onSubmit={handleSubmit}>
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        {error && <p className="error">{error}</p>}
        <button type="submit">Login</button>
      </form>
      <p>
        Don't have an account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
}

export default Login;
