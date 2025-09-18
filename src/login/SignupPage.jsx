import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiSignup } from "../auth/fakeAuth";
import { useAuth } from "../auth/AuthContext";

export default function SignupPage() {
  const nav = useNavigate();
  const { login } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  function validate() {
    if (!name || !email || !pw || !pw2) return "Please fill in all fields.";
    if (pw.length < 6) return "Password must be at least 6 characters long.";
    if (pw !== pw2) return "Passwords do not match.";
    return "";
  }

  async function onSubmit(e) {
    e.preventDefault();
    const v = validate();
    if (v) {
      setErr(v);
      return;
    }
    setErr("");
    setLoading(true);
    try {
      const res = await apiSignup({ name, email, password: pw });
      login(res); // auto login after signup
      nav("/", { replace: true });
    } catch (e) {
      setErr(e.message || "Signup failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-wrap">
      <div className="card auth-card">
        <h1 className="hero-title">Sign Up</h1>
        <p className="hero-sub">Create a new account.</p>

        {err ? <div className="alert error">{err}</div> : null}

        <form className="form" onSubmit={onSubmit}>
          <label className="label">
            Name
            <input
              className="input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Samkelo M."
              autoComplete="name"
              required
            />
          </label>

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
                autoComplete="new-password"
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

          <label className="label">
            Confirm Password
            <input
              className="input"
              type={showPw ? "text" : "password"}
              value={pw2}
              onChange={(e) => setPw2(e.target.value)}
              placeholder="••••••••"
              autoComplete="new-password"
              required
            />
          </label>

          <div className="form-row">
            <span className="muted">Already have an account?</span>
            <Link className="muted link" to="/login">
              Sign in
            </Link>
          </div>

          <button className="btn btn-izulu form-btn" type="submit" disabled={loading}>
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
}
