import React, { useState } from "react";
import { Link } from "react-router-dom";
import { apiForgotPassword } from "../auth/fakeAuth";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setMsg(""); setErr("");
    setLoading(true);
    try {
      const { message } = await apiForgotPassword({ email });
      setMsg(message);
    } catch (e) {
      setErr(e.message || "Request failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-wrap">
      <div className="card auth-card">
        <h1 className="hero-title">Forgot your password?</h1>
        <p className="hero-sub">Enter your email and we’ll send reset instructions.</p>

        {msg && <div className="alert success">{msg}</div>}
        {err && <div className="alert error">{err}</div>}

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

          <button className="btn btn-izulu form-btn" type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send reset link"}
          </button>
        </form>

        <p className="muted" style={{ marginTop: 16 }}>
          <Link to="/login">Back to sign in</Link>
        </p>
      </div>
    </div>
  );
}
