import React from "react";
import "./topbar.css";
import badge from "../assets/unizuluBadge.png";

export default function TopBar() {
  return (
    <header className="tb-wrap">
      <div className="tb-inner">
      <img className="tb-badge" src={badge} alt="University of Zululand badge" />
        <h1 className="tb-title">Welcome to isiZulu Corpus</h1>
      </div>
    </header>
  );
}