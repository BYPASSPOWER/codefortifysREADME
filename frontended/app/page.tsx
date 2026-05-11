"use client";

import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const handleUpload = async () => {
    if (!file) return alert("Please select a ZIP file first");

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      setData(null);

      setStatus("Uploading project...");
      setTimeout(() => setStatus("Extracting ZIP..."), 1500);
      setTimeout(() => setStatus("Running vulnerability scan..."), 3500);
      setTimeout(() => setStatus("Generating AI remediation guidance..."), 6000);

      const res = await axios.post(
        "http://localhost:5000/scan",
        formData
      );

      setData(res.data);

      setStatus("Scan completed successfully.");
    } catch (err) {
      console.error(err);
      setStatus("Scan failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0f172a",
        color: "white",
        fontFamily: "Arial",
        display: "flex",
      }}
    >
      {/* Sidebar */}
      <aside
        style={{
          width: "240px",
          background: "#111827",
          padding: "30px 20px",
          borderRight: "1px solid #1e293b",
        }}
      >
        <h1 style={{ fontSize: "28px", marginBottom: "40px" }}>
          CodeFortify
        </h1>

        <div style={{ color: "#94a3b8", marginBottom: "20px" }}>
          Dashboard
        </div>

        <div style={{ color: "#94a3b8", marginBottom: "20px" }}>
          Scan History
        </div>

        <div style={{ color: "#94a3b8", marginBottom: "20px" }}>
          Monitoring
        </div>

        <div style={{ color: "#94a3b8" }}>
          Settings
        </div>
      </aside>

      {/* Main Content */}
      <section
        style={{
          flex: 1,
          padding: "40px",
        }}
      >
        {/* Header */}
        <div
          style={{
            marginBottom: "40px",
          }}
        >
          <h2 style={{ fontSize: "36px", marginBottom: "10px" }}>
            AI-Powered DevSecOps Platform
          </h2>

          <p style={{ color: "#94a3b8" }}>
            Upload projects, detect vulnerabilities, and receive AI remediation guidance.
          </p>
        </div>

        {/* Upload Card */}
        <div
          style={{
            background: "#111827",
            padding: "30px",
            borderRadius: "16px",
            marginBottom: "30px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
          }}
        >
          <h3 style={{ marginBottom: "20px" }}>
            Upload Project
          </h3>

          <input
            type="file"
            accept=".zip"
            onChange={(e) =>
              setFile(e.target.files?.[0] || null)
            }
          />

          <button
            onClick={handleUpload}
            disabled={loading}
            style={{
              marginLeft: "15px",
              padding: "12px 20px",
              borderRadius: "10px",
              border: "none",
              background: loading ? "#475569" : "#2563eb",
              color: "white",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            {loading ? "Scanning..." : "Upload & Scan"}
          </button>

          {status && (
            <p
              style={{
                marginTop: "20px",
                color: "#93c5fd",
              }}
            >
              {status}
            </p>
          )}
        </div>

        {/* Stats */}
        {data && (
          <>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "20px",
                marginBottom: "30px",
              }}
            >
              <div
                style={{
                  background: "#111827",
                  padding: "25px",
                  borderRadius: "16px",
                }}
              >
                <h4>Total Findings</h4>

                <p
                  style={{
                    fontSize: "36px",
                    fontWeight: "bold",
                  }}
                >
                  {data.totalFindings}
                </p>
              </div>

              <div
                style={{
                  background: "#7f1d1d",
                  padding: "25px",
                  borderRadius: "16px",
                }}
              >
                <h4>Critical / High</h4>

                <p
                  style={{
                    fontSize: "36px",
                    fontWeight: "bold",
                  }}
                >
                  {data.highOrCriticalCount}
                </p>
              </div>
            </div>

            {/* Findings */}
            <div>
              <h3
                style={{
                  marginBottom: "20px",
                }}
              >
                Security Findings
              </h3>

              {data.findings.map((v: any, i: number) => (
                <div
                  key={i}
                  style={{
                    background: "#111827",
                    padding: "25px",
                    borderRadius: "16px",
                    marginBottom: "20px",
                    borderLeft: "6px solid #ef4444",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "15px",
                    }}
                  >
                    <h3>{v.package}</h3>

                    <span
                      style={{
                        background:
                          v.severity === "CRITICAL"
                            ? "#dc2626"
                            : "#f59e0b",
                        padding: "6px 12px",
                        borderRadius: "999px",
                        fontSize: "12px",
                        fontWeight: "bold",
                      }}
                    >
                      {v.severity}
                    </span>
                  </div>

                  <p>
                    <strong>CVE:</strong>{" "}
                    {v.vulnerabilityId}
                  </p>

                  <p style={{ marginTop: "10px" }}>
                    <strong>Title:</strong> {v.title}
                  </p>

                  {v.aiExplanation && (
                    <div
                      style={{
                        marginTop: "20px",
                        background: "#1e293b",
                        padding: "20px",
                        borderRadius: "12px",
                        color: "#cbd5e1",
                      }}
                    >
                      <strong>AI Explanation</strong>

                      <pre
                        style={{
                          whiteSpace: "pre-wrap",
                          marginTop: "10px",
                          fontFamily: "inherit",
                        }}
                      >
                        {v.aiExplanation}
                      </pre>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </section>
    </main>
  );
}
