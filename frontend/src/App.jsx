import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./LoginSignUp/Login.jsx";
import SignUp from "./LoginSignUp/SignUp.jsx";
import SessionList from "./StudySession/SessionList.jsx";
import StartSession from "./StudySession/StartSession.jsx"; // Keeping for reference or if needed
import SessionDetail from "./StudySession/SessionDetail.jsx";
import Layout from "./components/Layout/Layout.jsx";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import FocusMode from "./pages/FocusMode/FocusMode.jsx";
import "./index.css";

/*
  APP ROUTER
  
  Structure:
  - Public: Login, SignUp
  - Protected (Layout): Dashboard, Focus, History
*/
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Protected Routes (Wrapped in Layout) */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/focus" element={<FocusMode />} />

          {/* Legacy/Existing Feature Routes */}
          <Route path="/study_session" element={<SessionList />} />
          <Route path="/study_session/start" element={<StartSession />} />
          <Route path="/study_session/:id" element={<SessionDetail />} />
        </Route>

        {/* Redirect root to dashboard (or login ideally, but dashboard is fine for now) */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;