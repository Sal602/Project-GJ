import { Routes, Route, Link } from "react-router-dom";
import LoginPage from "./LoginSignUp/Login.jsx";
import SignupPage from "./LoginSignUp/SignUp.jsx";
import './App.css'

/*
  APP ROUTER
  
  Routes:
  "/" to Login Page
  "/signup" to Signup Page
*/
function App() {
  return (
    <div style={{ fontFamily: "sans-serif" }}>
      <nav
        style={{
          display: "flex",
          gap: "1rem",
          padding: "1rem",
          borderBottom: "1px solid #ddd",
        }}
      >
        <Link to="/">Login</Link>
        <Link to="/signup">Signup</Link>
      </nav>

      <div style={{ padding: "1.5rem" }}>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;