import React, { useMemo, useState, useRef } from "react";
import "./corpus.css";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";


const ZU_TRANSLATIONS = {
  "umuntu ngumuntu ngabantu": {
    translation: "A person is a person through other people.",
    literal: "A person is a person by/with people.",
    partOfSpeech: "Proverb / Saying",
    language: "isiZulu",
    tags: ["Ubuntu", "Community", "Identity", "Humanity"],
    culturalNote:
      "This expresses the African philosophy of Ubuntu — identity and dignity emerge from community, interdependence, and mutual care.",
    morphology: [
      { piece: "umuntu", gloss: "person (class 1 noun)" },
      { piece: "ngu-", gloss: "is (copulative marker)" },
      { piece: "umuntu", gloss: "person (repetition for emphasis)" },
      { piece: "nga-", gloss: "by/through/with (instrumental prefix)" },
      { piece: "bantu", gloss: "people (class 2 plural)" },
    ],
    usage: [
      {
        zu: "Umuntu ngumuntu ngabantu; ngakho kumele sisizanisane.",
        en: "A person is a person through others; therefore we must help one another.",
      },
      {
        zu: "Lelisu lifundisa intobeko nokuhloniphana emphakathini.",
        en: "This saying teaches humility and mutual respect in the community.",
      },
    ],
    related: [
      { term: "Ubuntu", note: "Humanity through community" },
      { term: "Ukwesizana", note: "Mutual aid" },
      { term: "Inhlonipho", note: "Respect" },
    ],
  },
};


const ZU_SYNONYMS = {
  umuntu: ["isakhamuzi", "inhlali"],                 
  abantu: ["umphakathi"],                             
  hamba: ["suka", "phuma", "dlula"],                  
  woza: ["sondela", "ngena", "buya"],                 
  inhlonipho: ["ukuhlonipha", "izinhlonipho"],        
  ubuntu: ["ubunye", "umoya womphakathi"],           
  ukufunda: ["ukutadisha", "ukufunda izincwadi"],   
  umsebenzi: ["imisebenzi", "ukusebenza"],           
  ukudla: ["ukudla okusanhlamvu", "ukudla okumnandi"]
};

const normalize = (s) => s.toLowerCase().trim().replace(/[.!?]+$/g, "");


const tokenize = (text) => {
  const t = text.toLowerCase();
  const matches = t.match(/\p{L}+/gu);
  return matches ? matches : [];
};


const uniq = (arr) => {
  const seen = new Set();
  const out = [];
  for (const x of arr) if (!seen.has(x)) { seen.add(x); out.push(x); }
  return out;
};


const bigrams = (tokens) => {
  const out = [];
  for (let i = 0; i < tokens.length - 1; i++) out.push([tokens[i], tokens[i + 1]]);
  return out;
};

// Frequency rows sorted desc by count
const freqRowsFrom = (tokens) => {
  const map = new Map();
  for (const t of tokens) map.set(t, (map.get(t) || 0) + 1);
  const rows = Array.from(map.entries()).map(([word, count]) => ({ word, count }));
  rows.sort((a, b) => b.count - a.count || a.word.localeCompare(b.word));
  return rows;
};

const cap = (w) => (w ? w.charAt(0).toUpperCase() + w.slice(1) : w);


const isPluralPeople = (w) => w.startsWith("aba");               
const isPersonNoun = (w) => w === "umuntu" || w.startsWith("umu"); 
const isInfinitive = (w) => w.startsWith("uku");                 
const isInterjection = (w) => ["woza", "hamba", "ngiyabonga", "sawubona"].includes(w);

function genUsageForWord(word) {
  const w = word.toLowerCase();

 
  if (w === "umuntu") {
    return [
      "Umuntu ohloniphayo uyathandeka.",
      "Umuntu omuhle uyalalela.",
      "Umuntu akaphila eyedwa.",
    ];
  }
  if (w === "abantu") {
    return [
      "Abantu abahloniphayo bakha umphakathi omuhle.",
      "Abantu bayasizana ngesikhathi esinzima.",
    ];
  }
  if (w === "woza") return ["Woza lapha!", "Woza sizodla ndawonye."];
  if (w === "hamba") return ["Hamba kahle.", "Hamba kancane, sicela."];

  
  if (isPluralPeople(w)) {
    return [
      `${cap(w)} abahloniphayo bayamukeleka.`,
      `${cap(w)} abahle bayazwana nabanye.`,
    ];
  }
  if (isPersonNoun(w)) {
    return [
      `${cap(w)} ohloniphayo uyathandeka.`,
      `${cap(w)} omuhle uyalalela.`,
    ];
  }
  if (isInfinitive(w)) {
    return [
      `Ngithanda ${w}.`,
      `Kuhle ${w} nsuku zonke.`,
    ];
  }
  if (isInterjection(w)) {
    return [`${cap(w)} manje!`, `${cap(w)} sonke.`];
  }

  
  return [
    `Ngiyathanda ${w}.`,
    `${cap(w)} wami.`,
  ];
}


function genSynonymsForWord(word) {
  const w = word.toLowerCase();
  if (ZU_SYNONYMS[w] && ZU_SYNONYMS[w].length) return ZU_SYNONYMS[w];
  
  if (isPersonNoun(w)) return ["umuntu omdala", "umuntu osemusha"]; 
  if (isPluralPeople(w)) return ["umphakathi", "izakhamuzi"];
  if (isInfinitive(w)) return [`${w} kahle`, `${w} kakhulu`]; 
  return []; 
}



export default function CorpusPage() {
  const [query, setQuery] = useState("");
  const pdfRef = useRef(null); 

  const tokens = useMemo(() => tokenize(query), [query]);
  const vocab = useMemo(() => uniq(tokens), [tokens]);
  const bigramPairs = useMemo(() => bigrams(tokens), [tokens]);
  const freqRows = useMemo(() => freqRowsFrom(tokens), [tokens]);
  const hit = useMemo(() => ZU_TRANSLATIONS[normalize(query)] || null, [query]);

  const featured = useMemo(() => {
    if (!query.trim()) return { primary: "", secondary: "" };
    if (hit) {
      return {
        primary: hit.translation,
        secondary: hit.literal ? `Literal: ${hit.literal}` : "",
      };
    }
    return {
      primary: "(Akukho ukuhunyushwa okubekiwe okwamanje)",
      secondary: "Engeza lokhu esigabeni sabo esisodwa ukuze kuboniswe ukuhunyushwa.",
    };
  }, [query, hit]);

  const usageByWord = useMemo(() => {
    const out = {};
    for (const w of vocab) out[w] = genUsageForWord(w);
    return out;
  }, [vocab]);

  const synsByWord = useMemo(() => {
    const out = {};
    for (const w of vocab) out[w] = genSynonymsForWord(w);
    return out;
  }, [vocab]);

  // NEW: robust PDF export (multi-page if content is tall)
  const exportPDF = async () => {
    const node = pdfRef.current;
    if (!node) return;

    // Temporarily add a white background for clean PDF
    node.classList.add("pdf-snapshot-bg");
    // Give layout a tick to apply styles
    await new Promise(r => setTimeout(r, 0));

    const canvas = await html2canvas(node, {
      scale: 2,              // sharper text
      backgroundColor: "#ffffff",
      useCORS: true,
      logging: false,
      windowWidth: document.documentElement.scrollWidth,
    });

    node.classList.remove("pdf-snapshot-bg");

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft * -1; // shift the image up to show the next slice
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(`zulu_corpus_${Date.now()}.pdf`);
  };

  return (
    <div className="corpus-wrap">
      <header className="hero">
        <p className="hero-sub">
          Bhala umusho ngesiZulu (isb. <em>Umuntu ngumuntu ngabantu</em>).
        </p>
      </header>

      <div className="searchbar card">
        <input
          className="search-input"
          placeholder='Bhala umusho ngesiZulu (e.g., "Umuntu ngumuntu ngabantu")'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="IsiZulu input"
        />
      </div>

      {/* Wrap ONLY what you want in the PDF */}
      <div ref={pdfRef}>
        <section className="featured card">
          <div className="featured-content">
            <h2 className="featured-primary">{featured.primary}</h2>
            {featured.secondary ? (
              <p className="featured-secondary">{featured.secondary}</p>
            ) : null}
          </div>
        </section>

        {hit && (
          <section className="result-card card">
            <div className="result-header">
              <h3 className="result-title">{cap(query.trim())}</h3>
              <div className="result-meta">
                <span className="badge">{hit.language}</span>
                <span className="dot">•</span>
                <span className="muted">{hit.partOfSpeech}</span>
              </div>
            </div>

            <div className="result-body">
              {/* Only show pronunciation if defined */}
              {hit.pronunciation && (
                <div className="result-row">
                  <div className="result-label">Pronunciation</div>
                  <div className="result-value">{hit.pronunciation}</div>
                </div>
              )}

              {hit.culturalNote && (
                <div className="result-row">
                  <div className="result-label">Cultural note</div>
                  <div className="result-value">{hit.culturalNote}</div>
                </div>
              )}

              {hit.morphology?.length ? (
                <div className="result-row">
                  <div className="result-label">Morphology</div>
                  <ul className="morph-list">
                    {hit.morphology.map((m, i) => (
                      <li key={i}>
                        <code>{m.piece}</code> — <span className="muted">{m.gloss}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {hit.usage?.length ? (
                <div className="result-row">
                  <div className="result-label">Usage</div>
                  <ul className="cp-sublist">
                    {hit.usage.map((ex, i) => (
                      <li key={i}>
                        <span>{ex.zu}</span>
                        <div className="muted">— {ex.en}</div>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {hit.related?.length ? (
                <div className="result-row">
                  <div className="result-label">Related</div>
                  <ul className="tag-list">
                    {hit.related.map((r, i) => (
                      <li key={i} className="tag">
                        {r.term}
                        {r.note ? <span className="muted"> — {r.note}</span> : null}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <div className="result-tags">
                {(hit.tags || []).map((t) => (
                  <span key={t} className="chip">{t}</span>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Vocabulary + Synonyms */}
        <section className="section card">
          <div className="section-header">
            <h3 className="section-title">Vocabulary (amagama akule ndima) - Izifaniso Zamagama</h3>
            <span className="count-badge">{vocab.length}</span>
          </div>
          {vocab.length ? (
            <ol className="cp-list">
              {vocab.map((w) => (
                <li key={w}>
                  <div className="vocab-row">
                    <span className="vocab-word">{w}</span>
                    {synsByWord[w]?.length ? (
                      <div className="syn-chips">
                        {synsByWord[w].map((s) => (
                          <span key={s} className="chip">{s}</span>
                        ))}
                      </div>
                    ) : (
                      <span className="muted" style={{marginLeft: 8, fontSize: ".9rem"}}>— (akukho izifanisi ezitholakele)</span>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          ) : (
            <div className="muted">Bhala umusho ngenhla ukuze sibonise amagama nezifanisi.</div>
          )}
        </section>

        {/* Usage examples (generated) */}
        <section className="section card">
          <div className="section-header">
            <h3 className="section-title">Word Usage (izibonelo zokusetshenziswa)</h3>
          </div>
          {vocab.length ? (
            <ul className="cp-list">
              {vocab.map((w) => (
                <li key={w}>
                  <strong className="word-head">{w}</strong>
                  <ul className="cp-sublist">
                    {usageByWord[w].map((sent, i) => (
                      <li key={i}><span>{sent}</span></li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          ) : (
            <div className="muted">Sizokwakhela imisho emisha elisebenzisa igama ngalinye.</div>
          )}
        </section>

        {/* Commonly paired words (bigrams) */}
        <section className="section card">
          <div className="section-header">
            <h3 className="section-title">Common Pairs (amaphere / bigrams)</h3>
            <span className="count-badge">{Math.max(0, bigramPairs.length)}</span>
          </div>
          {bigramPairs.length ? (
            <ul className="cp-list pairs">
              {bigrampairs_map(bigramPairs)}
            </ul>
          ) : (
            <div className="muted">Faka okungenani amagama amabili ukuze kuvele amaphere.</div>
          )}
        </section>

        {/* Word frequency */}
        <section className="section card">
          <div className="section-header">
            <h3 className="section-title">Word Frequency (izikhathi zamagama)</h3>
            <span className="count-badge">{freqRows.length}</span>
          </div>
          {freqRows.length ? (
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr><th>Igama</th><th>Izikhathi</th></tr>
                </thead>
                <tbody>
                  {freqRows.map(({ word, count }) => (
                    <tr key={word}>
                      <td>{word}</td>
                      <td className="muted">{count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="muted">Lapha sizokhombisa imvamisa yamagama akho.</div>
          )}
        </section>
          <div className="bead-divider" aria-hidden="true">
                <span className="dot r"></span>
                <span className="dot y"></span>
                <span className="dot g"></span>
                <span className="dot b"></span>
                <span className="dot w"></span>
                <span className="dot k"></span>
          </div>
          <div className="bottom-bar">
            <div className="bottom-bar-inner">
              <button className="btn btn-izulu" onClick={exportPDF} aria-label="Download PDF">
                ⤓ Download PDF
              </button>
            </div>
          </div>

        <footer className="footer">
          <span className="muted">
            © {new Date().getFullYear()} Zulu Corpus Service System. All rights reserved.
          </span>
        </footer>
      </div>
    </div>
  );
}

// unchanged
function bigrampairs_map(pairs) {
  return pairs.map(([a, b], i) => (
    <li key={`${a}-${b}-${i}`} className="pair-item">
      <span className="pair">{a}</span>
      <span className="arrow"> </span>
      <span className="pair">{b}</span>
    </li>
  ));
}