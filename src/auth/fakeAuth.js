// Works with CRA proxy (package.json "proxy") OR with .env base URL.
const RAW_BASE = process.env.REACT_APP_API_BASE_URL || "";
const BASE = RAW_BASE.replace(/\/+$/, "");

function buildUrl(path) {
  if (!path.startsWith("/")) path = "/" + path;
  return BASE ? `${BASE}${path}` : path; // if BASE empty, CRA proxy handles it
}

async function doJson(url, opts = {}) {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json", ...(opts.headers || {}) },
    ...opts,
  });
  const ct = res.headers.get("content-type") || "";
  const data = ct.includes("application/json") ? await res.json() : {};
  if (!res.ok) {
    const msg = data.error || data.message || `HTTP ${res.status}`;
    const err = new Error(msg);
    err.status = res.status;
    err.body = data;
    throw err;
  }
  return data;
}

// Login → normalize Flask shape to { token, refresh, user }
export async function apiLogin({ email, password }) {
  const data = await doJson(buildUrl("/auth/login"), {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  const token = data.access_token;
  const refresh = data.refresh_token || null;
  const user = data.user;
  if (!token || !user) throw new Error("Unexpected server response.");
  return { token, refresh, user };
}

// Signup → adjust body keys for your /auth/register route
export async function apiSignup({ name, email, password }) {
  const data = await doJson(buildUrl("/auth/register"), {
    method: "POST",
    body: JSON.stringify({ full_name: name, email, password }),
  });
  return { user: data.user || null, message: data.message || "registered" };
}

export async function apiForgotPassword({ email }) {
  const data = await doJson(buildUrl("/auth/forgot"), {
    method: "POST",
    body: JSON.stringify({ email }),
  });
  return { message: data.message || "If that email exists, you'll get reset instructions." };
}

// Complete the reset using token + new password
export async function apiResetPassword({ token, password }) {
  const data = await doJson(buildUrl("/auth/reset"), {
    method: "POST",
    body: JSON.stringify({ token, password }),
  });
  return { message: data.message || "Password updated." };
}