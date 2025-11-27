import "./LoginSignUp.css";
import { useState } from "react";
import { Link } from "react-router-dom";

/*
  SIGNUP PAGE

  Handles user registration by POSTing form data to /api/signup/

  Django returns a token + user info on successful signup.
  
  WORK ON WRITING THIS TO DB ASAP  
  Styling comes from LoginSignUp.css.
*/

//This Calls Django to be able to connect Frontend with Backend
const API_BASE = "http://127.0.0.1:8000"; 

export default function Signup() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
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
        setStatus(`Account created for ${data.username}`);
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
        <form className="auth-form">
          <input
            className="auth-input"
            type="text"
            placeholder="Username"
          />
          <input
            className="auth-input"
            type="email"
            placeholder="Email"
          />
          <input
            className="auth-input"
            type="password"
            placeholder="Password"
          />
          <button type="submit" className="auth-button">
            Sign Up
          </button>
        </form>
      </div>

      <p className="auth-footer">
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </div>
  );
}
