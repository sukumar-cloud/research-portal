import React, { useMemo, useState } from "react";

function formatBytes(bytes) {
  if (!Number.isFinite(bytes)) return "";
  const units = ["B", "KB", "MB", "GB"];
  let value = bytes;
  let i = 0;
  while (value >= 1024 && i < units.length - 1) {
    value /= 1024;
    i += 1;
  }
  return `${value.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

function titleCase(input) {
  return String(input)
    .replace(/_/g, " ")
    .replace(/\b\w/g, (m) => m.toUpperCase());
}

function SummarySection({ title, children }) {
  return (
    <section className="summary-section">
      <h3 className="summary-h3">{title}</h3>
      <div className="summary-body">{children}</div>
    </section>
  );
}

function BulletList({ items }) {
  if (!items || items.length === 0) return null;
  return (
    <ul className="summary-list">
      {items.map((t, idx) => (
        <li key={idx}>{String(t)}</li>
      ))}
    </ul>
  );
}

function KeyValueList({ obj }) {
  if (!obj || typeof obj !== "object") return null;
  const entries = Object.entries(obj);
  if (entries.length === 0) return null;
  return (
    <ul className="summary-kv">
      {entries.map(([k, v]) => (
        <li key={k}>
          <span className="summary-k">{titleCase(k)}:</span> <span className="summary-v">{String(v)}</span>
        </li>
      ))}
    </ul>
  );
}

export default function App() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const fileMeta = useMemo(() => {
    if (!file) return null;
    return {
      name: file.name,
      size: formatBytes(file.size),
      type: file.type || "unknown"
    };
  }, [file]);

  const resultText = useMemo(() => {
    if (result == null) return "";
    if (typeof result === "string") return result;
    if (typeof result === "object") {
      try {
        return JSON.stringify(result, null, 2);
      } catch {
        return String(result);
      }
    }
    return String(result);
  }, [result]);

  const summary = useMemo(() => {
    if (!result || typeof result !== "object") return null;

    const overview = {
      management_tone: result.management_tone,
      confidence_level: result.confidence_level
    };

    const keyPositives = Array.isArray(result.key_positives) ? result.key_positives : null;
    const keyConcerns = Array.isArray(result.key_concerns) ? result.key_concerns : null;
    const growthInitiatives = Array.isArray(result.growth_initiatives) ? result.growth_initiatives : null;
    const forwardGuidance = result.forward_guidance && typeof result.forward_guidance === "object" ? result.forward_guidance : null;

    const hasKnownKeys =
      Object.values(overview).some((v) => v != null && String(v).trim() !== "") ||
      (keyPositives && keyPositives.length > 0) ||
      (keyConcerns && keyConcerns.length > 0) ||
      (growthInitiatives && growthInitiatives.length > 0) ||
      (forwardGuidance && Object.keys(forwardGuidance).length > 0);

    return {
      hasKnownKeys,
      title: result.title || result.heading || result.summary_title || "Concall Summary",
      overview,
      keyPositives,
      keyConcerns,
      forwardGuidance,
      growthInitiatives
    };
  }, [result]);

  async function onAnalyze(e) {
    e.preventDefault();
    setError("");
    setResult(null);

    if (!file) {
      setError("Please choose a PDF file to analyze.");
      return;
    }

    const form = new FormData();
    form.append("file", file);

    setLoading(true);
    try {
      const apiBase = import.meta.env.VITE_API_BASE_URL || "";
      const resp = await fetch(`${apiBase}/api/analyze`, {
        method: "POST",
        body: form
      });

      const contentType = resp.headers.get("content-type") || "";
      const payload = contentType.includes("application/json")
        ? await resp.json()
        : { raw: await resp.text() };

      if (!resp.ok) {
        const msg = payload?.error || `Request failed (${resp.status})`;
        const details = payload?.details ? `: ${payload.details}` : "";
        throw new Error(`${msg}${details}`);
      }

      setResult(payload);
    } catch (err) {
      setError(err?.message || String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page">
      <div className="bg-orb orb-1" />
      <div className="bg-orb orb-2" />

      <header className="header">
        <div className="brand">
          <div className="logo">RP</div>
          <div>
            <div className="title">Research Portal</div>
            <div className="subtitle">Earnings Call Transcript Analyzer</div>
          </div>
        </div>
      </header>

      <main className="container">
        <section className="card">
          <h1 className="card-title">Upload transcript PDF</h1>
          <p className="card-desc">
            Choose a PDF file and click Analyze. The backend will extract text and return a structured JSON analysis.
          </p>

          <form onSubmit={onAnalyze} className="form">
            <label className="dropzone">
              <input
                className="file-input"
                type="file"
                accept="application/pdf,.pdf"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
              <div className="dz-inner">
                <div className="dz-title">Select PDF</div>
                <div className="dz-hint">Max 10MB. Field name sent: <code>file</code></div>
              </div>
            </label>

            {fileMeta && (
              <div className="file-meta">
                <div className="file-pill">
                  <span className="pill-label">Name</span>
                  <span className="pill-value">{fileMeta.name}</span>
                </div>
                <div className="file-pill">
                  <span className="pill-label">Size</span>
                  <span className="pill-value">{fileMeta.size}</span>
                </div>
                <div className="file-pill">
                  <span className="pill-label">Type</span>
                  <span className="pill-value">{fileMeta.type}</span>
                </div>
              </div>
            )}

            {error && (
              <div className="alert alert-error">
                <div className="alert-title">Error</div>
                <div className="alert-body">{error}</div>
              </div>
            )}

            <div className="actions">
              <button className="btn" type="submit" disabled={loading}>
                {loading ? "Analyzing…" : "Analyze"}
              </button>
              <button
                className="btn btn-ghost"
                type="button"
                disabled={loading && !result}
                onClick={() => {
                  setError("");
                  setResult(null);
                }}
              >
                Clear results
              </button>
            </div>
          </form>
        </section>

        <section className="card results">
          <div className="results-head">
            <h2 className="card-title">Results</h2>
            <div className="badge">SUMMARY</div>
          </div>

          {!result ? (
            <div className="empty">
              <div className="empty-title">No analysis yet</div>
              <div className="empty-sub">Upload a PDF and click Analyze to see output here.</div>
            </div>
          ) : (
            <div className="summary" aria-label="Analysis summary">
              {summary?.hasKnownKeys ? (
                <>
                  <h2 className="summary-h2">{summary.title}</h2>

                  <SummarySection title="Overview">
                    <KeyValueList obj={summary.overview} />
                  </SummarySection>

                  {summary.keyPositives && (
                    <SummarySection title="Key positives">
                      <BulletList items={summary.keyPositives} />
                    </SummarySection>
                  )}

                  {summary.keyConcerns && (
                    <SummarySection title="Key concerns">
                      <BulletList items={summary.keyConcerns} />
                    </SummarySection>
                  )}

                  {summary.forwardGuidance && (
                    <SummarySection title="Forward guidance">
                      <KeyValueList obj={summary.forwardGuidance} />
                    </SummarySection>
                  )}

                  {summary.growthInitiatives && (
                    <SummarySection title="Growth initiatives">
                      <BulletList items={summary.growthInitiatives} />
                    </SummarySection>
                  )}
                </>
              ) : (
                <pre className="result-pre">{resultText}</pre>
              )}
            </div>
          )}
        </section>
      </main>

      <footer className="footer">
        <div>This summary is generated strictly from the uploaded transcript. No external data sources were used.</div>
      </footer>
    </div>
  );
}
