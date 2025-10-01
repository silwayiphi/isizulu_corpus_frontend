import React, { useState } from "react";
import "./topbar.css";
import badge from "../assets/useMe.jpg";

const API_BASE = process.env.REACT_APP_API_BASE_URL || "http://127.0.0.1:5000";

export default function TopBar() {
  const [logoutLoading, setLogoutLoading] = useState(false);

 const handleLogout = async () => {
  setLogoutLoading(true);
  try {
    const token = localStorage.getItem("access_token");
    await fetch(`${API_BASE}/auth/logout`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });

    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    window.location.href = "/login";  // redirect to login page
  } catch (err) {
    console.error("Logout failed:", err);
  } finally {
    setLogoutLoading(false);
  }
};


  return (
    <header className="tb-wrap">
      <div className="tb-inner">
        <img className="tb-badge" src={badge} alt="badge" />
        <h1 className="tb-title">Welcome to isiZulu Corpus</h1>

        <button className="tb-logout-btn" onClick={handleLogout}>
          {logoutLoading ? "Logging out…" : "Logout"}
        </button>
      </div>
    </header>
  );
}
