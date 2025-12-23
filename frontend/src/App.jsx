import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./LoginSignUp/Login.jsx";
import SignUp from "./LoginSignUp/SignUp.jsx";
import SessionList from "./StudySession/SessionList.jsx";
import StartSession from "./StudySession/StartSession.jsx";
import SessionDetail from "./StudySession/SessionDetail.jsx";
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
        <Route path="/study_session" element={<SessionList />} />
        <Route path="/study_session/start" element={<StartSession />} />
        <Route path="/study_session/:id" element={<SessionDetail />} />
        <Route path="*" element={<Navigate to="/study_session" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;