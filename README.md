# CodeFortify - DevSecOps Security Scanner

CodeFortify is a DevSecOps tool that scans applications for security vulnerabilities using Trivy and displays results in a simple web dashboard.

---

## 🚀 Features

- Scan projects for security vulnerabilities
- Detect critical issues (CVE-based)
- Display results in a clean web interface
- Built with a full-stack architecture

---

## 🛠️ Tech Stack

- Backend: Node.js (Express)
- Frontend: Next.js
- Security Scanner: Trivy

---

## 📸 Scan Result

![CodeFortify Scan](./screenshots/codefortify-scan.png)

---

## ⚡ How It Works

1. User clicks "Run Scan" on the frontend
2. Frontend sends request to backend API
3. Backend runs Trivy to scan the project
4. Vulnerabilities are returned and displayed on the UI

---

## ▶️ How to Run

### Backend

```bash
cd backend
node index.js

## FRONTENED
cd frontended
npm run dev

## OPEN BROWSWER
http://localhost:3000

## 🔮 Upcoming Features (Phase 2)
Upload and scan ZIP projects
Scan GitHub repositories
Security scoring system
Improved UI/UX

## AUTHOR
Built as part of a DevSecOps learning and portfolio project.


 
