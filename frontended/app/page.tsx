"use client";

import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return alert("Please select a ZIP file first");

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    const res = await axios.post("http://localhost:5000/scan", formData);
    setData(res.data);
    setLoading(false);
  };

  return (
    <main style={{
      minHeight: "100vh",
      background: "#0f172a",
      color: "white",
      padding: "40px",
      fontFamily: "Arial"
    }}>
      <section style={{
        maxWidth: "900px",
        margin: "0 auto",
        background: "#111827",
        padding: "30px",
        borderRadius: "16px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.4)"
      }}>
        <h1 style={{ fontSize: "36px", marginBottom: "10px" }}>
          CodeFortify
        </h1>

        <p style={{ color: "#cbd5e1", marginBottom: "30px" }}>
          DevSecOps vulnerability scanner for uploaded projects.
        </p>

        <div style={{
          background: "#1f2937",
          padding: "20px",
          borderRadius: "12px",
          marginBottom: "25px"
        }}>
          <input
            type="file"
            accept=".zip"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />

          <button
            onClick={handleUpload}
            disabled={loading}
            style={{
              marginLeft: "12px",
              padding: "10px 18px",
              borderRadius: "8px",
              border: "none",
              background: loading ? "#64748b" : "#2563eb",
              color: "white",
              cursor: "pointer"
            }}
          >
            {loading ? "Scanning..." : "Upload & Scan"}
          </button>
        </div>

        {data && (
          <section>
            <div style={{
              display: "flex",
              gap: "20px",
              marginBottom: "25px"
            }}>
              <div style={{
                flex: 1,
                background: "#1f2937",
                padding: "20px",
                borderRadius: "12px"
              }}>
                <h3>Total Findings</h3>
                <p style={{ fontSize: "28px", fontWeight: "bold" }}>
                  {data.totalFindings}
                </p>
              </div>

              <div style={{
                flex: 1,
                background: "#7f1d1d",
                padding: "20px",
                borderRadius: "12px"
              }}>
                <h3>High / Critical</h3>
                <p style={{ fontSize: "28px", fontWeight: "bold" }}>
                  {data.highOrCriticalCount}
                </p>
              </div>
            </div>

            <h2>Critical Findings</h2>

            {data.findings.map((v: any, i: number) => (
              <div key={i} style={{
                background: "#1f2937",
                borderLeft: "6px solid #ef4444",
                padding: "18px",
                borderRadius: "10px",
                marginBottom: "15px"
              }}>
                <p><strong>Package:</strong> {v.package}</p>
                <p><strong>Severity:</strong> {v.severity}</p>
                <p><strong>CVE:</strong> {v.vulnerabilityId}</p>
                <p><strong>Title:</strong> {v.title}</p>
              </div>
            ))}
          </section>
        )}
      </section>
    </main>
  );
}
