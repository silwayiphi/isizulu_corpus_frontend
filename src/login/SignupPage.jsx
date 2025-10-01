import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiSignup } from "../auth/fakeAuth";
import "./auth.css";

export default function SignupPage() {
  const nav = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setErr(""); setOk(""); setLoading(true);
    try {
      await apiSignup({ name: fullName, email, password: pw });
      setOk("Registered successfully. You can sign in now.");
      setTimeout(() => nav("/login"), 800);
    } catch (e) {
      setErr(e.message || "Sign up failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-wrap">
      <div className="card auth-card">
        <h1 className="hero-title">Sign Up</h1>

        {err && <div className="alert error">{err}</div>}
        {ok && <div className="alert success">{ok}</div>}

        <form className="form" onSubmit={onSubmit}>
          <label className="label">
            Full name
            <input className="input" value={fullName} onChange={e=>setFullName(e.target.value)} required />
          </label>
          <label className="label">
            Email
            <input className="input" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
          </label>
          <label className="label">
            Password
            <input className="input" type="password" value={pw} onChange={e=>setPw(e.target.value)} required />
          </label>

          <button className="btn btn-izulu form-btn" type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create account"}
          </button>
        </form>

        <p className="muted">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
