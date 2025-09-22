import React, { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { apiResetPassword } from "../auth/fakeAuth";

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

export default function ResetPasswordPage() {
  const nav = useNavigate();
  const q = useQuery();
  const token = q.get("token") || ""; // /reset?token=...

  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setMsg(""); setErr("");
    if (!token) {
      setErr("Missing token.");
      return;
    }
    if (pw.length < 6) {
      setErr("Password must be at least 6 characters.");
      return;
    }
    if (pw !== pw2) {
      setErr("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      const { message } = await apiResetPassword({ token, password: pw });
      setMsg(message);
      setTimeout(() => nav("/login"), 1000);
    } catch (e) {
      setErr(e.message || "Reset failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-wrap">
      <div className="card auth-card">
        <h1 className="hero-title">Set a new password</h1>

        {msg && <div className="alert success">{msg}</div>}
        {err && <div className="alert error">{err}</div>}

        <form className="form" onSubmit={onSubmit}>
          <label className="label">
            New password
            <input
              className="input"
              type="password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              placeholder="••••••••"
              autoComplete="new-password"
              required
            />
          </label>
          <label className="label">
            Confirm password
            <input
              className="input"
              type="password"
              value={pw2}
              onChange={(e) => setPw2(e.target.value)}
              placeholder="••••••••"
              autoComplete="new-password"
              required
            />
          </label>

          <button className="btn btn-izulu form-btn" type="submit" disabled={loading}>
            {loading ? "Updating..." : "Update password"}
          </button>
        </form>

        <p className="muted" style={{ marginTop: 16 }}>
          <Link to="/login">Back to sign in</Link>
        </p>
      </div>
    </div>
  );
}
