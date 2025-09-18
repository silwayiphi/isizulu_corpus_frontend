import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { apiLogin } from "../auth/fakeAuth";
import { useAuth } from "../auth/AuthContext";

export default function LoginPage() {
  const nav = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const from = location.state?.from || "/";

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    if (!email || !pw) {
      setErr("Please fill in all fields.");
      return;
    }
    setLoading(true);
    try {
      const res = await apiLogin({ email, password: pw });
      login(res);
      nav(from, { replace: true });
    } catch (e) {
      setErr(e.message || "Sign in failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-wrap">
      <div className="card auth-card">
        <h1 className="hero-title">Sign In</h1>
        <p className="hero-sub">Welcome back! Please sign in to continue.</p>

        {err ? <div className="alert error">{err}</div> : null}

        <form className="form" onSubmit={onSubmit}>
          <label className="label">
            Email
            <input
              className="input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </label>

          <label className="label">
            Password
            <div className="input-wrap">
              <input
                className="input"
                type={showPw ? "text" : "password"}
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="eye"
                onClick={() => setShowPw((s) => !s)}
                aria-label={showPw ? "Hide password" : "Show password"}
              >
                {showPw ? "🙈" : "👁️"}
              </button>
            </div>
          </label>

          <div className="form-row">
            <label className="checkbox">
              <input type="checkbox" /> Remember me
            </label>
            <Link className="muted link" to="/signup">
              Don’t have an account? Sign up
            </Link>
          </div>

          <button className="btn btn-izulu form-btn" type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
