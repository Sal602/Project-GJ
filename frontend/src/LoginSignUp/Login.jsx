import "./LoginSignUp.css";
import { useState } from "react";

/*
  LOGIN PAGE
  This React component handles user login by sending a POST request
  to our Django backend (/api/login/). 
  On success, Django returns:
  - token: used for authenticated API requests
  - user: basic user info (id, username, email)

  WORK ON STORING TOKEN AND USER TO DB TO BE ABLE TO FURTHER 
  CONNECT TO DASHBOARD,STATS,ETC.
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

      {/*THIS IS FOR FAILED LOGINS */}
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
    <div className="auth-container">
      <h1>Login</h1>

      <form onSubmit={handleSubmit}>
        <input name="username" placeholder="Username" />
        <input name="password" type="password" placeholder="Password" />
        <button>Login</button>
      </form>

      {status && <p className="status-message">{status}</p>}
    </div>
  );

}

export default LoginPage;
