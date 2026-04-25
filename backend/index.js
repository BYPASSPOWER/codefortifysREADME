const express = require('express');
const multer = require('multer');
const unzipper = require('unzipper');
const { exec } = require('child_process');
const fs = require('fs');
const cors = require('cors');

const app = express();
app.use(cors());

const upload = multer({ dest: 'uploads/' });

app.post('/scan', upload.single('file'), (req, res) => {
  console.log("📥 File received");

  const zipPath = req.file.path;
  const extractPath = `uploads/extracted_${Date.now()}`;

  fs.mkdirSync(extractPath);

  fs.createReadStream(zipPath)
    .pipe(unzipper.Extract({ path: extractPath }))
    .on('close', () => {
      console.log("📂 File extracted");

      const command = `trivy fs --scanners vuln --skip-dirs node_modules --format json ${extractPath}`;

      exec(command, (error, stdout, stderr) => {
        if (error) {
          console.error(stderr);
          return res.status(500).json({ error: stderr });
        }

        try {
          const result = JSON.parse(stdout);

          const findings = [];
          for (const item of result.Results || []) {
            for (const vuln of item.Vulnerabilities || []) {
              findings.push({
                package: vuln.PkgName,
                severity: vuln.Severity,
                vulnerabilityId: vuln.VulnerabilityID,
                title: vuln.Title || '',
              });
            }
          }

          const highOrCritical = findings.filter(
            (v) => v.severity === 'HIGH' || v.severity === 'CRITICAL'
          );

          res.json({
            totalFindings: findings.length,
            highOrCriticalCount: highOrCritical.length,
            findings: highOrCritical,
          });

        } catch (e) {
          res.status(500).json({ error: "Invalid JSON" });
        }
      });
    });
});

app.listen(5000, () => {
  console.log('Server running on port 5000');
});
