import React, { useState, useRef } from "react";
import "./corpus.css";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const API_BASE = process.env.REACT_APP_API_BASE_URL || "http://127.0.0.1:5000";

export default function CorpusPage() {
  const [query, setQuery] = useState("");
  const [srcLang, setSrcLang] = useState("zul");
  const [tgtLang, setTgtLang] = useState("eng");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const pdfRef = useRef(null);

  const handleAnalyze = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch(`${API_BASE}/corpus/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sentence: query,
          src_lang: srcLang,
          tgt_lang: tgtLang,
        }),
      });

      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error("Analyze failed:", err);
      setResult({ error: "Backend not reachable or wrong endpoint." });
    } finally {
      setLoading(false);
    }
  };

  const exportPDF = async () => {
    if (!pdfRef.current) return;
    const canvas = await html2canvas(pdfRef.current, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const imgHeight = (canvas.height * pageWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, pageWidth, imgHeight);
    pdf.save(`corpus_${Date.now()}.pdf`);
  };



  // 🚨 Helper: Check if isiXhosa is involved
  const isXhosaInvolved = srcLang === "xho" || tgtLang === "xho";

  return (
    <div className="corpus-wrap">
      {/* 🔽 Top bar with dropdown + logout */}
      <div className="top-bar">
        <div className="nav-dropdown">
          <select
            onChange={(e) => {
              const url = e.target.value;
              if (url) window.open(url, "_blank");
            }}
            defaultValue=""
            aria-label="Select content"
          >
            <option value="" disabled>
              Uhlu lwezinto zesizulu ongaythanda
            </option>
            <option value="https://iafrika.org/amaphupho-nezincazelo/">
              Amaphupho Nencazelo
            </option>
            <option value="https://iafrika.org/amasiko/">Amasiko</option>
            <option value="https://iafrika.org/category/izinganekwane-zesizulu/">
              Izinganekwane
            </option>
            <option value="https://iafrika.org/category/izisho-izaga/">
              Izisho ne Zaga
            </option>
            <option value="https://iafrika.org/umlando-nezithakazelo/">
              Umlando nezithakazelo
            </option>
            <option value="https://iafrika.org/category/ukwelapha-ngokwesintu/">
              Ukwelapha kweSintu
            </option>
            <option value="https://iafrika.org/category/ukudla-kwesintu/">
              Ukudla Kwesintu
            </option>
          </select>
        </div>


      </div>

      <h2 className="page-title">Welcome to Corpus System</h2>

      {/* Input + Language selectors */}
      <div className="searchbar card">
        <input
          className="search-input"
          placeholder="Type a sentence"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select value={srcLang} onChange={(e) => setSrcLang(e.target.value)}>
          <option value="zul">isiZulu</option>
          <option value="xho">isiXhosa</option>
          <option value="eng">English</option>
        </select>
        <select value={tgtLang} onChange={(e) => setTgtLang(e.target.value)}>
          <option value="zul">isiZulu</option>
          <option value="xho">isiXhosa</option>
          <option value="eng">English</option>
        </select>
      </div>

      <button className="btn btn-izulu" onClick={handleAnalyze}>
        {loading ? "Analyzing…" : "Analyze"}
      </button>

      {/* Results */}
      {result && (
        <div ref={pdfRef} className="card result">
          {result.error && <p style={{ color: "red" }}>{result.error}</p>}

          {!result.error && (
            <>
              <h3 className="section-title">Translation</h3>
              <p>{result.translation}</p>

              {!isXhosaInvolved && result.analysis && (
                <>
                  <h3 className="section-title">Word statistics</h3>
                  <ul>
                    {Object.entries(result.analysis.word_stats).map(
                      ([word, count], i) => (
                        <li key={i}>
                          <strong>{word}</strong>: {count}
                        </li>
                      )
                    )}
                  </ul>

                  <h3 className="section-title">Word Usage</h3>
                  {Object.entries(result.analysis.examples).map(([word, exs]) => (
                    <div key={word}>
                      <strong>{word}</strong>
                      <ul>
                        {exs.map((ex, i) => (
                          <li key={i}>{ex}</li>
                        ))}
                      </ul>
                    </div>
                  ))}

                  <h3 className="section-title">Common paired</h3>
                  <ul>
                    {result.analysis.common_pairs.map((p, i) => (
                      <li key={i}>{p}</li>
                    ))}
                  </ul>
                </>
              )}
            </>
          )}
        </div>
      )}

      <button className="btn btn-izulu" onClick={exportPDF}>
        ⤓ Download PDF
      </button>

    </div>
  );
}
