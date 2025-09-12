// src/main/CorpusPage.jsx
import React, { useMemo, useState } from "react";
import "./corpus.css";

const LANGS = ["English", "isiZulu", "Afrikaans", "Setswana"];


const DATA = {
  usage: {
    English: ["Happy", "Love", "Like", "Mommy", "Help", "Speak"],
    isiZulu: ["Ngijabule", "Woza", "Asambe", "Ukudla", "Ubaba", "Ukucasuka"],
    Afrikaans: ["Gelukkig", "Liefde", "Hou van", "Ma", "Help", "Praat"],
    Setswana: ["Itumetse", "Lorato", "Rata", "Mma", "Thusa", "Bua"],
  },
  pairs: {
    English: ["thank you → very much", "good → morning", "how → are you"],
    isiZulu: ["ngiyabonga → kakhulu", "sawubona → mngani", "unjani → namuhla"],
    Afrikaans: ["baie → dankie", "goeie → more", "hoe → gaan dit"],
    Setswana: ["ke a leboga → thata", "dumelang → bagolo", "o kae → gompieno"],
  },
  freq: {
    English: [
      { word: "the", count: 527 },
      { word: "is", count: 331 },
      { word: "and", count: 305 },
    ],
    isiZulu: [
      { word: "na", count: 410 },
      { word: "uku", count: 355 },
      { word: "nga", count: 290 },
    ],
    Afrikaans: [
      { word: "die", count: 480 },
      { word: "en", count: 340 },
      { word: "is", count: 270 },
    ],
    Setswana: [
      { word: "le", count: 430 },
      { word: "go", count: 360 },
      { word: "ya", count: 295 },
    ],
  },
};

const SYNONYMS = {
  English: {
    happy: ["glad", "joyful", "pleased", "content"],
    help: ["assist", "aid", "support", "facilitate"],
  },
  isiZulu: {
    ngijabule: ["ngiyajabula", "ngithokozile"],
    usizo: ["ukusiza", "ukweseka"],
  },
  Afrikaans: { gelukkig: ["bly", "tevrede"], help: ["hulp", "bystand"] },
  Setswana: { itumetse: ["thabile"], thusa: ["akanya", "tshireletsa"] },
};


function Pill({ active, children, onClick }) {
  return (
    <button
      className={`pill ${active ? "pill--active" : ""}`}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}

export default function CorpusPage() {
  const [fromLang, setFromLang] = useState("English");
  const [toLang, setToLang] = useState("isiZulu");
  const [text, setText] = useState("");
  const [status, setStatus] = useState("");
  const [tab, setTab] = useState("usage");

  
  const [insightLang, setInsightLang] = useState("English");

  
  const [synQuery, setSynQuery] = useState("");
  const [synResults, setSynResults] = useState([]);

  const tabs = useMemo(
    () => [
      { id: "usage", label: "Word Usage" },
      { id: "pairs", label: "Common Paired Words and phrases" },
      { id: "freq", label: "Word frequency counts" },
      { id: "syn", label: "Synonyms" },
    ],
    []
  );

  const handleInputChange = (val) => {
    setText(val);
    setStatus(val.trim() ? "Translating..." : "");
    
  };

  const runSynonyms = () => {
    const dict = SYNONYMS[insightLang] || {};
    const key = (synQuery || "").trim().toLowerCase();
    const res = dict[key] || [];
    setSynResults(res);
  };

  const renderInsights = () => {
    if (tab === "syn") {
      return (
        <div className="syn-wrap">
          <div className="syn-toolbar">
            <select
              className="select"
              value={insightLang}
              onChange={(e) => setInsightLang(e.target.value)}
            >
              {LANGS.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
            <input
              className="input"
              placeholder="Enter a word"
              value={synQuery}
              onChange={(e) => setSynQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && runSynonyms()}
            />
            <button className="btn" type="button" onClick={runSynonyms}>
              Get synonyms
            </button>
          </div>

          <section className="panel">
            <h3 className="panel-title">
              Synonyms in {insightLang}
              {synQuery ? ` for “${synQuery}”` : ""}
            </h3>
            <div className="panel-body">
              {synResults.length ? (
                <ul className="cp-list">
                  {synResults.map((w) => (
                    <li key={w}>{w}</li>
                  ))}
                </ul>
              ) : (
                <div className="muted">No results yet.</div>
              )}
            </div>
          </section>
        </div>
      );
    }

   
    const titleMap = {
      usage: "Word Usage",
      pairs: "Common Paired Words & Phrases",
      freq: "Word Frequency",
    };

    return (
      <div className="cp-panels">
        <section className="panel" style={{ gridColumn: "1 / -1" }}>
          <div className="toolbar">
            <label className="toolbar-label">Language:</label>
            <select
              className="select"
              value={insightLang}
              onChange={(e) => setInsightLang(e.target.value)}
            >
              {LANGS.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>

          <h3 className="panel-title">
            {titleMap[tab]} — {insightLang}
          </h3>

          <div className="panel-body">
            {tab === "usage" && (
              <ol className="cp-list">
                {(DATA.usage[insightLang] || []).map((w) => (
                  <li key={w}>{w}</li>
                ))}
              </ol>
            )}

            {tab === "pairs" && (
              <ol className="cp-list">
                {(DATA.pairs[insightLang] || []).map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ol>
            )}

            {tab === "freq" && (
              <ol className="cp-list">
                {(DATA.freq[insightLang] || []).map(({ word, count }) => (
                  <li key={word}>
                    {word} — <span className="muted">{count}</span>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </section>
      </div>
    );
  };

  return (
    <div className="cp-wrap">
      
      <div className="cp-row">
        <LangCard
          label="Enter text"
          value={text}
          onChange={handleInputChange}
          lang={fromLang}
          onLangChange={setFromLang}
        />
        <div className="cp-arrow">→</div>
        <LangCard
          label="Translation"
          value={status}
          placeholder="Translation"
          readOnly
          lang={toLang}
          onLangChange={setToLang}
        />
      </div>

      
      <div className="cp-pills">
        {tabs.map((t) => (
          <Pill key={t.id} active={tab === t.id} onClick={() => setTab(t.id)}>
            {t.label}
          </Pill>
        ))}
      </div>

  
      {renderInsights()}
    </div>
  );
}

function LangCard({
  label,
  value,
  onChange,
  readOnly,
  placeholder,
  lang,
  onLangChange,
}) {
  return (
    <div className="card">
      <div className="card-top">
        <select
          className="select"
          value={lang}
          onChange={(e) => onLangChange(e.target.value)}
        >
          {LANGS.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
      </div>

      <textarea
        className="textarea"
        placeholder={label}
        value={value}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        readOnly={readOnly}
      />
    </div>
  );
}
