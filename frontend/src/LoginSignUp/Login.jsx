import "./LoginSignUp.css";
import { useState } from "react";
import { Link } from "react-router-dom";

/*
  LOGIN PAGE
  This React component handles user login by sending a POST request
  to our Django backend (/api/login/). 
  On success, Django returns:
  - token: used for authenticated API requests
  - user: basic user info (id, username, email)

  WORK ON STORING TOKEN AND USER TO DB TO BE ABLE TO FURTHER 
  CONNECT TO DASHBOARD,STATS,ETC.
  FORGOT PASSWORD NOT CONNECTED TO ANYTHING NEEDS A LINK CONNECTED TO IT
  Styling comes from LoginSignUp.css.
*/

//This Calls Django to be able to connect Frontend with Backend
const API_BASE = "http://127.0.0.1:8000";

function LoginPage() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

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
        setStatus(`Logged in as ${data.username}`);
        // TODO: save token / user info in context or localStorage later
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
