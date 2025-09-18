// src/App.js
import React from "react";
import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";

import TopBar from "./topBar/TopBar";
import CorpusPage from "./main/CorpusPage";
import LoginPage from "./login/LoginPage";
import SignupPage from "./login/SignupPage";
import { AuthProvider, Protected } from "./auth/AuthContext";

import "./global.css";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="app-root">
          <TopBar />

          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            {/* Protected home (Corpus) */}
            <Route
              path="/"
              element={
                <Protected fallback={<Navigate to="/login" replace />}>
                  <CorpusPage />
                </Protected>
              }
            />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

function NotFound() {
  return (
    <div className="auth-wrap">
      <div className="card auth-card">
        <h1 className="hero-title">404</h1>
        <p className="hero-sub">Ikhasi olikangelayo alitholakali.</p>
        <Link className="btn btn-izulu" to="/">Buyela ekhaya</Link>
      </div>
    </div>
  );
}

export default App;

