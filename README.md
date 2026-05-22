# Classroom Guardian LMS

## 📖 Overview
**Classroom Guardian LMS** is a next‑generation university learning management system designed to integrate **attendance tracking, focus monitoring, performance evaluation, and parent reporting** into one unified platform.  
It ensures accountability, fairness, and transparency by combining **QR‑based attendance**, **AI‑powered focus monitoring**, and **role‑based portals** for students, lecturers, and parents.

---

## 🎓 Features

### Student Portal
- Dashboard with attendance %, focus %, seat number mapping, and exam eligibility tracker.  
- Attendance page with QR scan and seat number entry.  
- Performance graphs, gamified badges, and AI improvement tips.  
- Comparison with class average and downloadable performance certificates.  

### Lecturer Portal
- Seat map dashboard with live student status.  
- QR generator and manual attendance entry (for power cuts).  
- Focus monitoring with allowed apps and AI distraction alerts.  
- Exportable attendance and focus reports.  
- Engagement analytics with AI suggestions.  

### Parent Portal
- Daily/weekly/monthly attendance and focus summaries.  
- Instant alerts for absences or repeated distractions.  
- Positive reinforcement highlights.  
- Secure messaging with lecturers.  

---

## ⚙️ System Features
- Dynamic QR attendance with seat mapping.  
- Attendance tracker with daily logs and percentages.  
- Power cut override for fairness.  
- Focus monitoring via apps + AI camera detection.  
- AI‑driven engagement analytics.  
- End‑of‑year performance certificates.  
- Role‑based authentication and secure data handling.  

---

## 🧠 AI Integration
- **Camera Monitoring:** TensorFlow/MediaPipe models detect distractions.  
- **Focus Detection:** Tracks allowed vs. unauthorized app usage.  
- **Analytics:** AI insights for engagement trends and teaching optimization.  

---

## 🧰 Tech Stack
- **Frontend:** React/Next.js (web), React Native/Flutter (future mobile).  
- **Backend:** Node.js/Express.  
- **Database:** PostgreSQL + Redis.  
- **AI Layer:** Python (TensorFlow/MediaPipe).  
- **Cloud Hosting:** AWS/Azure/GCP.  
- **Notifications:** Firebase/OneSignal.  
- **Security:** OAuth2, JWT, end‑to‑end encryption.  
- **Real‑Time:** WebSockets/Socket.IO for live updates.  

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v18+)  
- PostgreSQL (v14+)  
- Redis (latest)  
- Python (3.10+) with TensorFlow/MediaPipe  
- AWS/Azure/GCP account for cloud deployment  

### Installation
```bash
# Clone repository
git clone https://github.com/your-org/classroom-guardian-lms.git
cd classroom-guardian-lms

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install

# Install AI service dependencies
cd ../ai-service
pip install -r requirements.txt
```

### Running Locally
```bash
# Start backend
cd backend
npm run dev

# Start frontend
cd ../frontend
npm run dev

# Start AI service
cd ../ai-service
python src/camera_monitoring.py
```

---

## 📈 Deployment
- Use **Docker** for containerization.  
- Deploy via **CI/CD pipelines** (GitHub Actions, GitLab CI, or Jenkins).  
- Host frontend/backend on **AWS Elastic Beanstalk** or **Azure App Service**.  
- Use **AWS RDS** or **Azure SQL** for PostgreSQL.  
- Configure **Redis** for caching and session management.  
- Enable **CDN** for global reach.  

---

## 🤝 Contribution Guidelines
1. Fork the repository.  
2. Create a feature branch (`feature/your-feature`).  
3. Commit changes with clear messages.  
4. Submit a pull request for review.  

---

## 📜 License
This project is licensed under the **MIT License** — free to use, modify, and distribute with attribution.
