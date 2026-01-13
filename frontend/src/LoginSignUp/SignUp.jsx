import "./LoginSignUp.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

/*
  SIGNUP PAGE

  Handles user registration by POSTing form data to /api/signup/

  Django returns JWT tokens (access and refresh) + user info on successful signup.
  The tokens are stored in localStorage for authenticated API requests.
  Styling comes from LoginSignUp.css.
*/

//This Calls Django to be able to connect Frontend with Backend
const API_BASE = "http://127.0.0.1:8000";

export default function Signup() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
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
      const res = await fetch(`${API_BASE}/api/signup/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus(data.detail || "Signup failed");
      } else {
        // Store JWT token and user info in localStorage
        localStorage.setItem("token", data.access);
        localStorage.setItem("refreshToken", data.refresh);
        localStorage.setItem("user", JSON.stringify(data.user));

        setStatus(`Account created for ${data.user.username}`);
        // Navigate to Dashboard after successful signup
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
      {/* Top nav tabs */}
      <div className="auth-tabs">
        <Link to="/login" className="auth-tab">
          Login
        </Link>
        <Link to="/signup" className="auth-tab auth-tab--active">
          Signup
        </Link>
      </div>

      {/* Title */}
      <div className="auth-header">
        <h1 className="auth-title">Sign up</h1>
        <p className="auth-subtitle">Create an account to begin your journey.</p>
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
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
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
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        {status && <p className="auth-status">{status}</p>}
      </div>

      <p className="auth-footer">
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </div>
  );
}
