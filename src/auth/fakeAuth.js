// src/auth/fakeAuth.js
export async function apiLogin({ email, password }) {
  // TODO: replace with real fetch/axios to your backend
  await new Promise(r => setTimeout(r, 500));
  if (email === "demo@zulu.app" && password === "demo123") {
    return { token: "demo-token", user: { id: 1, email } };
  }
  // Simulate failure
  const err = new Error("Invalid email or password.");
  err.status = 401;
  throw err;
}

export async function apiSignup({ name, email, password }) {
  await new Promise(r => setTimeout(r, 700));
  // naive uniqueness check just for demo
  if (email.endsWith("@taken.com")) {
    const err = new Error("Email already registered.");
    err.status = 409;
    throw err;
  }
  return { token: "new-user-token", user: { id: Date.now(), name, email } };
}
