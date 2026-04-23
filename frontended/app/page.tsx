"use client";

import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [data, setData] = useState<any>(null);

  const runScan = async () => {
    const res = await axios.get("http://localhost:5000/scan");
    setData(res.data);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>CodeFortify Scanner</h1>

      <button onClick={runScan}>Run Scan</button>

      {data && (
        <div>
          <h3>Total Findings: {data.totalFindings}</h3>
          <h3>High/Critical: {data.highOrCriticalCount}</h3>

          {data.findings.map((v: any, i: number) => (
            <div
              key={i}
              style={{
                border: "1px solid red",
                margin: 10,
                padding: 10,
              }}
            >
              <p><b>Package:</b> {v.package}</p>
              <p><b>Severity:</b> {v.severity}</p>
              <p><b>CVE:</b> {v.vulnerabilityId}</p>
              <p><b>Title:</b> {v.title}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
