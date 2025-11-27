import "./LoginSignUp.css";
import { useState } from "react";

/*
  SIGNUP PAGE

  Handles user registration by POSTing form data to /api/signup/

  Django returns a token + user info on successful signup.
  
  WORK ON WRITING THIS TO DB ASAP  
  Styling comes from LoginSignUp.css.
*/

{/*This Calls Django to be able to connect Frontend with Backend*/}
const API_BASE = "http://127.0.0.1:8000"; 

function SignupPage() {
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
   <div className="auth-container">
      <h1>Signup</h1>

      <form onSubmit={handleSubmit}>
        <input name="username" placeholder="Username" />
        <input name="email" placeholder="Email" type="email" />
        <input name="password" placeholder="Password" type="password" />
        <button>Sign Up</button>
      </form>

      {status && <p className="status-message">{status}</p>}
    </div>
  );
}

export default SignupPage;
