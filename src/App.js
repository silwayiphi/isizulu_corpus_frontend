// src/App.js
import React from "react";
import TopBar from "./topBar/TopBar";
import CorpusPage from "./main/CorpusPage";
import "./global.css";

function App() {
  return (
    <div className="app-root">
      <TopBar />
      <CorpusPage />
    </div>
  );
}

export default App;
