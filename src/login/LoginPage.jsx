import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { apiLogin } from "../auth/fakeAuth";
import "./auth.css";

export default function LoginPage() {
  const nav = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  // If Guard passed state, use it; else go to CorpusPage "/"
  const from = location.state?.from ?? "/";

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    if (!email || !pw) {
      setErr("Please fill in all fields.");
      return;
    }
    setLoading(true);

    try {
      const { token, refresh, user } = await apiLogin({ email, password: pw });
      login({ token, refresh, user });
      nav(from, { replace: true }); // 👉 lands on "/"
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
              placeholder="enter your email"
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
                placeholder="enter a password"
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

          <div className="form-row" style={{ justifyContent: "space-between" }}>
            <label className="checkbox">
              <input type="checkbox" /> Remember me
            </label>
            <div>
              <Link className="muted link" to="/forgot" style={{ marginRight: 12 }}>
                Forgot password?
              </Link>
              <Link className="muted link" to="/signup">
                Sign up
              </Link>
            </div>
          </div>

          <button className="btn btn-izulu form-btn" type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
