import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./LoginSignUp/Login.jsx";
import SignUp from "./LoginSignUp/SignUp.jsx";
import "./index.css";

/*
  APP ROUTER
  
  Routes:
  "/" to Login Page
  "/signup" to Signup Page
*/
function App() {
   return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="*" element={<Navigate to="/signup" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;