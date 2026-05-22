import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Database File Path
const DB_PATH = path.join(__dirname, 'data.json');

// Base Seed Records
const SEED_DATA = {
  allowedApps: [
    { id: 'app_1', name: 'VS Code', allowed: true },
    { id: 'app_2', name: 'Chrome (LMS Tab)', allowed: true },
    { id: 'app_3', name: 'Python Interactive Shell', allowed: true },
    { id: 'app_4', name: 'Terminal / PowerShell', allowed: true },
    { id: 'app_5', name: 'Discord', allowed: false },
    { id: 'app_6', name: 'Spotify', allowed: false }
  ],
  logs: [
    { date: '2026-05-22', present: 'Present', time: '09:02 AM', focus: '94%', seat: 'B3', points: '+15 XP', studentEmail: 'alex.j@university.edu' },
    { date: '2026-05-21', present: 'Present', time: '08:58 AM', focus: '91%', seat: 'B3', points: '+15 XP', studentEmail: 'alex.j@university.edu' },
    { date: '2026-05-20', present: 'Present', time: '09:00 AM', focus: '95%', seat: 'A4', points: '+15 XP', studentEmail: 'alex.j@university.edu' },
    { date: '2026-05-19', present: 'Excused', time: 'Outage Override', focus: '—', seat: 'B3', points: '+10 XP', studentEmail: 'alex.j@university.edu' },
    { date: '2026-05-18', present: 'Present', time: '09:05 AM', focus: '88%', seat: 'B3', points: '+12 XP', studentEmail: 'alex.j@university.edu' }
  ],
  chatMessages: [
    { sender: 'lecturer', text: 'Good morning. I wanted to touch base regarding Alex\'s focus score. He is currently doing fantastic, sitting at 94% focus!', timestamp: '09:15 AM', studentEmail: 'alex.j@university.edu' },
    { sender: 'parent', text: 'Thank you for the update! Glad to hear he is paying attention today.', timestamp: '09:18 AM', studentEmail: 'alex.j@university.edu' }
  ],
  students: [
    { id: 'stud_1', name: 'Alex Johnson', email: 'alex.j@university.edu', seat: 'B3', status: 'Present', focusScore: 94, eyeScore: 95, appScore: 93, avatar: '👨‍🎓' },
    { id: 'stud_2', name: 'Sarah Miller', email: 'sarah.m@university.edu', seat: 'C2', status: 'Distracted', focusScore: 45, eyeScore: 80, appScore: 10, distractionReason: 'Disallowed App: Spotify', avatar: '👩‍🎓' },
    { id: 'stud_3', name: 'David Chen', email: 'david.c@university.edu', seat: 'A1', status: 'Present', focusScore: 92, eyeScore: 90, appScore: 94, avatar: '👨‍🎓' },
    { id: 'stud_4', name: 'Emily Taylor', email: 'emily.t@university.edu', seat: '', status: 'Absent', focusScore: 0, eyeScore: 0, appScore: 0, avatar: '👩‍🎓' },
    { id: 'stud_5', name: 'Michael Brown', email: 'michael.b@university.edu', seat: 'E1', status: 'Present', focusScore: 88, eyeScore: 85, appScore: 91, avatar: '👨‍🎓' },
    { id: 'stud_6', name: 'Jessica Davis', email: 'jessica.d@university.edu', seat: 'F3', status: 'Present', focusScore: 91, eyeScore: 93, appScore: 89, avatar: '👩‍🎓' },
    { id: 'stud_7', name: 'James Wilson', email: 'james.w@university.edu', seat: 'C5', status: 'Distracted', focusScore: 35, eyeScore: 20, appScore: 50, distractionReason: 'Face Scan Alert: Looking Away', avatar: '👨‍🎓' },
    { id: 'stud_8', name: 'Amanda Martinez', email: 'amanda.m@university.edu', seat: '', status: 'Absent', focusScore: 0, eyeScore: 0, appScore: 0, avatar: '👩‍🎓' }
  ],
  alerts: [
    { id: 'alert_1', timestamp: '11:20 AM', type: 'absence', student: 'Emily Taylor', studentEmail: 'emily.t@university.edu', message: 'Flagged as UNEXCUSED ABSENCE. Class commenced 20 mins ago.', verified: false },
    { id: 'alert_2', timestamp: '11:28 AM', type: 'distraction', student: 'Sarah Miller', studentEmail: 'sarah.m@university.edu', message: 'Disallowed application detected: Spotify active for 5 mins.', verified: false },
    { id: 'alert_3', timestamp: '11:31 AM', type: 'distraction', student: 'James Wilson', studentEmail: 'james.w@university.edu', message: 'Repeated distractions. Camera detects face turned away.', verified: false }
  ],
  powerCut: { active: false, start: '10:00', end: '11:30' }
};

// Helper to read database state
const readDB = () => {
  try {
    if (!fs.existsSync(DB_PATH)) {
      writeDB(SEED_DATA);
      return SEED_DATA;
    }
    const data = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading database file:', err);
    return SEED_DATA;
  }
};

// Helper to write database state
const writeDB = (data) => {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing database file:', err);
  }
};

// 1. Get Complete State
app.get('/api/state', (req, res) => {
  const db = readDB();
  res.json(db);
});

// 2. Telemetry Sync (For active student webcam updates)
app.post('/api/seats/telemetry', (req, res) => {
  const { email, focusScore, eyeScore, appScore, status, distractionReason } = req.body;
  const db = readDB();
  
  db.students = db.students.map(s => {
    if (s.email.toLowerCase() === email.toLowerCase()) {
      return {
        ...s,
        focusScore: focusScore !== undefined ? focusScore : s.focusScore,
        eyeScore: eyeScore !== undefined ? eyeScore : s.eyeScore,
        appScore: appScore !== undefined ? appScore : s.appScore,
        status: status !== undefined ? status : s.status,
        distractionReason: distractionReason !== undefined ? distractionReason : s.distractionReason
      };
    }
    return s;
  });
  
  writeDB(db);
  res.json({ success: true, students: db.students });
});

// 3. Mark Attendance (QR Check-in)
app.post('/api/seats/checkin', (req, res) => {
  const { email, seatNumber } = req.body;
  const db = readDB();
  const isOutage = db.powerCut.active;

  db.students = db.students.map(s => {
    if (s.email.toLowerCase() === email.toLowerCase()) {
      return {
        ...s,
        status: isOutage ? 'Excused' : 'Present',
        seat: seatNumber,
        focusScore: isOutage ? 0 : 92,
        eyeScore: isOutage ? 0 : 92,
        appScore: isOutage ? 0 : 92
      };
    }
    return s;
  });

  const todayStr = new Date().toISOString().split('T')[0];
  const newLog = {
    date: todayStr,
    present: isOutage ? 'Excused' : 'Present',
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    focus: isOutage ? '—' : '92%',
    seat: seatNumber,
    points: isOutage ? '+10 XP' : '+15 XP',
    studentEmail: email
  };

  db.logs = [newLog, ...db.logs.filter(l => !(l.date === todayStr && l.studentEmail.toLowerCase() === email.toLowerCase()))];

  writeDB(db);
  res.json({ success: true, state: db });
});

// 4. Manual Lecturer Toggle Status (Override)
app.post('/api/seats/override', (req, res) => {
  const { studentId, status } = req.body;
  const db = readDB();

  db.students = db.students.map(s => {
    if (s.id === studentId) {
      const isAbsent = status === 'Absent';
      return {
        ...s,
        status,
        focusScore: isAbsent ? 0 : 85,
        eyeScore: isAbsent ? 0 : 85,
        appScore: isAbsent ? 0 : 85,
        seat: isAbsent ? '' : (s.seat || 'Temp')
      };
    }
    return s;
  });

  writeDB(db);
  res.json({ success: true, students: db.students });
});

// 5. Add Whitelisted App
app.post('/api/apps', (req, res) => {
  const { name } = req.body;
  const db = readDB();
  
  const exists = db.allowedApps.find(a => a.name.toLowerCase() === name.toLowerCase());
  if (exists) {
    db.allowedApps = db.allowedApps.map(a => a.name.toLowerCase() === name.toLowerCase() ? { ...a, allowed: true } : a);
  } else {
    db.allowedApps.push({ id: `app_${Date.now()}`, name, allowed: true });
  }

  writeDB(db);
  res.json({ success: true, allowedApps: db.allowedApps });
});

// 6. Block App
app.post('/api/apps/block', (req, res) => {
  const { appId } = req.body;
  const db = readDB();

  db.allowedApps = db.allowedApps.map(a => a.id === appId ? { ...a, allowed: false } : a);

  // Special simulation event trigger: Block Spotify flags Sarah Miller distracted
  const app = db.allowedApps.find(a => a.id === appId);
  if (app && app.name === 'Spotify') {
    db.students = db.students.map(s => {
      if (s.name === 'Sarah Miller') {
        return { ...s, status: 'Distracted', focusScore: 30, distractionReason: 'Disallowed App: Spotify' };
      }
      return s;
    });
  }

  writeDB(db);
  res.json({ success: true, allowedApps: db.allowedApps, students: db.students });
});

// 7. Post Message & Trigger AI Reply
app.post('/api/messages', (req, res) => {
  const { sender, text, studentEmail } = req.body;
  const db = readDB();

  const userMsg = {
    sender,
    text,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    studentEmail
  };
  db.chatMessages.push(userMsg);

  // simulated AI reply from Lecturer
  const linkedStudent = db.students.find(s => s.email.toLowerCase() === studentEmail.toLowerCase());
  const studentName = linkedStudent ? linkedStudent.name : 'your child';
  const focusPercentage = linkedStudent ? linkedStudent.focusScore : 0;
  const statusText = linkedStudent ? linkedStudent.status : 'Present';
  
  let replyText = `Hello! Thank you for getting in touch. I will check the records for ${studentName} and reply shortly.`;
  const query = text.toLowerCase();

  if (query.includes('focus') || query.includes('attention')) {
    if (statusText === 'Distracted') {
      replyText = `I am observing some gaze distractions with ${studentName} today. Gaze vectors are currently scoring at ${focusPercentage}%. I am monitoring closely and keeping him on-task.`;
    } else {
      replyText = `Regarding focus: ${studentName} is doing great in the lecture today! Average attention score is sitting at ${focusPercentage}%.`;
    }
  } else if (query.includes('absence') || query.includes('absent') || query.includes('missed')) {
    if (statusText === 'Absent') {
      replyText = `Yes, the system notes ${studentName} has not mapped their seat today. Attendance record shows ABSENT. Please verify if they are on campus.`;
    } else {
      replyText = `${studentName} is active in their seat coordinates today. Total attendance meets our 80% criteria.`;
    }
  } else if (query.includes('eligibility') || query.includes('exam')) {
    const att = studentEmail === 'alex.j@university.edu' ? 94 : 78;
    if (att >= 80) {
      replyText = `${studentName} meets the eligibility baseline with a ${att}% attendance rating. They are fully authorized for final papers!`;
    } else {
      replyText = `Warning: ${studentName}'s attendance is currently at ${att}%, falling slightly under our 80% threshold. Consistent attendance is needed this week to restore eligibility.`;
    }
  }

  const lecturerReply = {
    sender: 'lecturer',
    text: replyText,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    studentEmail
  };
  db.chatMessages.push(lecturerReply);

  writeDB(db);
  res.json({ success: true, chatMessages: db.chatMessages });
});

// 8. Power Cut Window Outage Config
app.post('/api/powercut', (req, res) => {
  const { start, end, active } = req.body;
  const db = readDB();

  db.powerCut = { active, start, end };

  writeDB(db);
  res.json({ success: true, powerCut: db.powerCut });
});

// 9. Verify/Acknowledge Alert
app.post('/api/alerts/verify', (req, res) => {
  const { alertId } = req.body;
  const db = readDB();

  db.alerts = db.alerts.map(a => a.id === alertId ? { ...a, verified: true } : a);

  writeDB(db);
  res.json({ success: true, alerts: db.alerts });
});

// 10. Sync Live Alert infractions (E.g. low focus score flags distraction alert)
app.post('/api/alerts/sync', (req, res) => {
  const { email, studentName, message } = req.body;
  const db = readDB();

  const alreadyAlerted = db.alerts.some(a => a.studentEmail.toLowerCase() === email.toLowerCase() && !a.verified);
  if (!alreadyAlerted) {
    const newAlert = {
      id: `alert_${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'distraction',
      student: studentName,
      studentEmail: email,
      message,
      verified: false
    };
    db.alerts.unshift(newAlert);
    writeDB(db);
  }

  res.json({ success: true, alerts: db.alerts });
});

// 11. Reset All Data
app.post('/api/reset', (req, res) => {
  writeDB(SEED_DATA);
  res.json({ success: true, state: SEED_DATA });
});

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Classroom Guardian LMS backend active on http://localhost:${PORT}`);
  });
}

export default app;