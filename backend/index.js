require("dotenv").config();

const express = require("express");
const multer = require("multer");
const unzipper = require("unzipper");
const { exec } = require("child_process");
const fs = require("fs");
const cors = require("cors");
const client = require("prom-client");
const OpenAI = require("openai");

const app = express();
app.use(cors());

const upload = multer({ dest: "uploads/" });

// Prometheus metrics
const register = new client.Registry();
client.collectDefaultMetrics({ register });

// OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// AI explanation function
async function explainFinding(vuln) {
  if (!process.env.OPENAI_API_KEY) {
    return "AI explanation unavailable: OpenAI API key is not configured.";
  }

  try {
    const prompt = `
Explain this software vulnerability in simple terms for a developer.

Package: ${vuln.package}
Severity: ${vuln.severity}
CVE: ${vuln.vulnerabilityId}
Title: ${vuln.title}

Return:
1. Plain English explanation
2. Why it is risky
3. How to fix it
4. Recommended priority
`;

    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: prompt,
    });

    return response.output_text;
  } catch (error) {
    console.error("AI explanation error:", error.message);
    return "AI explanation could not be generated for this finding.";
  }
}

// Health check
app.get("/", (req, res) => {
  res.send("CodeFortify backend is running");
});

// Prometheus metrics endpoint
app.get("/metrics", async (req, res) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});

// Upload and scan endpoint
app.post("/scan", upload.single("file"), (req, res) => {
  console.log("File received");

  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const zipPath = req.file.path;
  const extractPath = `uploads/extracted_${Date.now()}`;

  fs.mkdirSync(extractPath, { recursive: true });

  const stream = fs
    .createReadStream(zipPath)
    .pipe(unzipper.Extract({ path: extractPath }));

  stream.on("close", () => {
    console.log("File extracted");

    const command = `trivy fs --scanners vuln --skip-dirs node_modules --skip-dirs .next --quiet --format json ${extractPath}`;

    exec(command, async (error, stdout, stderr) => {
      if (error) {
        console.error("Trivy error:", stderr || error.message);
        return res.status(500).json({ error: stderr || error.message });
      }

      try {
        const result = JSON.parse(stdout);

        const findings = [];

        for (const item of result.Results || []) {
          for (const vuln of item.Vulnerabilities || []) {
            findings.push({
              target: item.Target,
              package: vuln.PkgName,
              installedVersion: vuln.InstalledVersion,
              fixedVersion: vuln.FixedVersion || "Not listed",
              severity: vuln.Severity,
              vulnerabilityId: vuln.VulnerabilityID,
              title: vuln.Title || "No title available",
            });
          }
        }

        const highOrCritical = findings.filter(
          (v) => v.severity === "HIGH" || v.severity === "CRITICAL"
        );

        const findingsWithAI = [];

        for (const vuln of highOrCritical) {
          const aiExplanation = await explainFinding(vuln);

          findingsWithAI.push({
            ...vuln,
            aiExplanation,
          });
        }

        res.json({
          artifact: result.ArtifactName,
          type: result.ArtifactType,
          totalFindings: findings.length,
          highOrCriticalCount: highOrCritical.length,
          findings: findingsWithAI,
        });
      } catch (e) {
        console.error("JSON parse error:", e.message);
        res.status(500).json({ error: "Invalid JSON from Trivy" });
      }
    });
  });

  stream.on("error", (err) => {
    console.error("Unzip error:", err.message);
    res.status(400).json({
      error: "Uploaded file is not a valid ZIP archive",
    });
  });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
