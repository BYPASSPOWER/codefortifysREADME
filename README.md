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

## 🔮 Upcoming Features (Phase 3)
Upload and scan ZIP projects
Scan GitHub repositories
Security scoring system
Improved UI/UX

## AUTHOR
Built as part of a DevSecOps learning and portfolio project.

---

## Phase 3: CI/CD Security Automation

CodeFortify now includes automated security scanning using GitHub Actions.

Whenever code is pushed to the repository or a pull request is opened, a CI/CD pipeline automatically runs a Trivy vulnerability scan.

### Automated Workflow

1. Developer pushes code to GitHub
2. GitHub Actions starts automatically
3. Repository is checked out
4. Trivy scans the project filesystem
5. HIGH / CRITICAL vulnerabilities are reported

### Benefits

- Continuous security checks
- Faster developer feedback
- Shift-left DevSecOps practices
- Reduced deployment risk

### Technologies Used

- GitHub Actions
- Trivy
- YAML Pipelines
 
## Phase 4: Dockerized Platform

![Docker Scan](./screenshots/codefortify-docker-scan.png)

CodeFortify was containerized using Docker Compose with separate frontend and backend services, including Trivy installed in the backend container.

## Phase 5: Kubernetes Deployment

![Kubernetes Scan](./screenshots/codefortify-kubernetes-scan.png)

CodeFortify was deployed to Kubernetes using frontend and backend Deployments and Services. The application successfully scans uploaded ZIP projects and displays HIGH/CRITICAL vulnerabilities through the Kubernetes-hosted UI.

## Phase 7: Monitoring & Observability

CodeFortify includes a monitoring stack using Prometheus and Grafana.

Prometheus scrapes backend metrics from the `/metrics` endpoint, while Grafana provides dashboards for visualizing application health and performance.

### Tools Used

- Prometheus
- Grafana
- prom-client
- Docker Compose
