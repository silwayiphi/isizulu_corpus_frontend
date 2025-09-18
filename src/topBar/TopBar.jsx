import React from "react";
import "./topbar.css";
import badge from "../assets/useMe.jpg";

export default function TopBar() {
  return (
    <header className="tb-wrap">
      <div className="tb-inner">
      <img className="tb-badge" src={badge} alt="src/assets/useMe.jpg" />
        <h1 className="tb-title">Welcome to isiZulu Corpus</h1>
      </div>
    </header>
  );
}