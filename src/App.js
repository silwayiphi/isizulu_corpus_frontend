import React from "react";
import { Routes, Route, Navigate, Link } from "react-router-dom";
import { Protected } from "./auth/AuthContext";

import TopBar from "./topBar/TopBar";
import CorpusPage from "./main/CorpusPage";
import LoginPage from "./login/LoginPage";
import SignupPage from "./login/SignupPage";
import ForgotPasswordPage from "./login/ForgotPasswordPage";
import ResetPasswordPage from "./login/ResetPasswordPage";

function App() {
  return (
    <div className="app-root">
      <Routes>
        {/* Public */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot" element={<ForgotPasswordPage />} />
        <Route path="/reset" element={<ResetPasswordPage />} />

        {/* Protected Corpus */}
        <Route
          path="/"
          element={
            <Protected fallback={<Navigate to="/login" replace />}>
              <>
                <TopBar />
                <CorpusPage />
              </>
            </Protected>
          }
        />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

function NotFound() {
  return (
    <div className="auth-wrap">
      <div className="card auth-card">
        <h1 className="hero-title">404</h1>
        <p className="hero-sub">Page not found.</p>
        <Link className="btn btn-izulu" to="/">Go home</Link>
      </div>
    </div>
  );
}

export default App;
