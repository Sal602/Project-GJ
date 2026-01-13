import "./LoginSignUp.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

/*
  LOGIN PAGE
  This React component handles user login by sending a POST request
  to our Django backend (/api/login/). 
  On success, Django returns:
  - access: JWT access token for authenticated API requests
  - refresh: JWT refresh token to get new access tokens
  - user: basic user info (id, username, email)

  The access token is stored in localStorage and sent with all API requests.
  Styling comes from LoginSignUp.css.
*/

//This Calls Django to be able to connect Frontend with Backend
const API_BASE = "http://127.0.0.1:8000";

function LoginPage() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setStatus("");

    try {
      const res = await fetch(`${API_BASE}/api/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      //THIS IS FOR FAILED LOGINS 
      if (!res.ok) {
        setStatus(data.detail || "Login failed");
      } else {
        // Store JWT token and user info in localStorage
        localStorage.setItem("token", data.access);
        localStorage.setItem("refreshToken", data.refresh);
        localStorage.setItem("user", JSON.stringify(data.user));

        setStatus(`Logged in as ${data.user.username}`);
        // Navigate to Dashboard after successful login
        setTimeout(() => navigate("/dashboard"), 500);
      }
    } catch (err) {
      console.error(err);
      setStatus("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-root">
      {/* Tabs */}
      <div className="auth-tabs">
        <Link to="/login" className="auth-tab auth-tab--active">
          Login
        </Link>
        <Link to="/signup" className="auth-tab">
          Signup
        </Link>
      </div>

      {/* Title */}
      <div className="auth-header">
        <h1 className="auth-title">Log in</h1>
        <p className="auth-subtitle">Welcome back! Please log in to continue.</p>
      </div>

      {/* Card */}
      <div className="auth-card">
        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            className="auth-input"
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            required
          />
          <input
            className="auth-input"
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="auth-meta">Forgot Password?</p>

        {status && <p className="auth-status">{status}</p>}
      </div>

      <p className="auth-footer">
        Don’t have an account? <Link to="/signup">Sign up</Link>
      </p>
    </div>
  );

}

export default LoginPage;
