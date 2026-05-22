import React, { createContext, useContext, useState, useEffect } from 'react';

const LMSContext = createContext();

// Dynamic API Base URL detection
const API_BASE = window.location.origin.includes('localhost') ? 'http://localhost:5000/api' : '/api';

// Preloaded mock credentials database (stored locally in browser for multi-tab authorization)
const DEFAULT_USERS = [
  { email: 'alex.j@university.edu', password: 'password', name: 'Alex Johnson', role: 'student', avatar: '👨‍🎓' },
  { email: 'ronald.v@university.edu', password: 'password', name: 'Prof. Ronald Vance', role: 'lecturer', avatar: '👨‍🏫' },
  { email: 'robert.j@parent.com', password: 'password', name: 'Robert Johnson', role: 'parent', avatar: '👨‍👩‍👦' }
];

// Fallback seed data in case backend is offline
const DEFAULT_STUDENTS = [
  { id: 'stud_1', name: 'Alex Johnson', email: 'alex.j@university.edu', seat: 'B3', status: 'Present', focusScore: 94, eyeScore: 95, appScore: 93, avatar: '👨‍🎓' },
  { id: 'stud_2', name: 'Sarah Miller', email: 'sarah.m@university.edu', seat: 'C2', status: 'Distracted', focusScore: 45, eyeScore: 80, appScore: 10, distractionReason: 'Disallowed App: Spotify', avatar: '👩‍🎓' },
  { id: 'stud_3', name: 'David Chen', email: 'david.c@university.edu', seat: 'A1', status: 'Present', focusScore: 92, eyeScore: 90, appScore: 94, avatar: '👨‍🎓' },
  { id: 'stud_4', name: 'Emily Taylor', email: 'emily.t@university.edu', seat: '', status: 'Absent', focusScore: 0, eyeScore: 0, appScore: 0, avatar: '👩‍🎓' },
  { id: 'stud_5', name: 'Michael Brown', email: 'michael.b@university.edu', seat: 'E1', status: 'Present', focusScore: 88, eyeScore: 85, appScore: 91, avatar: '👨‍🎓' },
  { id: 'stud_6', name: 'Jessica Davis', email: 'jessica.d@university.edu', seat: 'F3', status: 'Present', focusScore: 91, eyeScore: 93, appScore: 89, avatar: '👩‍🎓' },
  { id: 'stud_7', name: 'James Wilson', email: 'james.w@university.edu', seat: 'C5', status: 'Distracted', focusScore: 35, eyeScore: 20, appScore: 50, distractionReason: 'Face Scan Alert: Looking Away', avatar: '👨‍🎓' },
  { id: 'stud_8', name: 'Amanda Martinez', email: 'amanda.m@university.edu', seat: '', status: 'Absent', focusScore: 0, eyeScore: 0, appScore: 0, avatar: '👩‍🎓' }
];

const DEFAULT_LOGS = [
  { date: '2026-05-22', present: 'Present', time: '09:02 AM', focus: '94%', seat: 'B3', points: '+15 XP', studentEmail: 'alex.j@university.edu' },
  { date: '2026-05-21', present: 'Present', time: '08:58 AM', focus: '91%', seat: 'B3', points: '+15 XP', studentEmail: 'alex.j@university.edu' },
  { date: '2026-05-20', present: 'Present', time: '09:00 AM', focus: '95%', seat: 'A4', points: '+15 XP', studentEmail: 'alex.j@university.edu' },
  { date: '2026-05-19', present: 'Excused', time: 'Outage Override', focus: '—', seat: 'B3', points: '+10 XP', studentEmail: 'alex.j@university.edu' },
  { date: '2026-05-18', present: 'Present', time: '09:05 AM', focus: '88%', seat: 'B3', points: '+12 XP', studentEmail: 'alex.j@university.edu' }
];

const DEFAULT_APPS = [
  { id: 'app_1', name: 'VS Code', allowed: true },
  { id: 'app_2', name: 'Chrome (LMS Tab)', allowed: true },
  { id: 'app_3', name: 'Python Interactive Shell', allowed: true },
  { id: 'app_4', name: 'Terminal / PowerShell', allowed: true },
  { id: 'app_5', name: 'Discord', allowed: false },
  { id: 'app_6', name: 'Spotify', allowed: false }
];

const DEFAULT_ALERTS = [
  { id: 'alert_1', timestamp: '11:20 AM', type: 'absence', student: 'Emily Taylor', studentEmail: 'emily.t@university.edu', message: 'Flagged as UNEXCUSED ABSENCE. Class commenced 20 mins ago.', verified: false },
  { id: 'alert_2', timestamp: '11:28 AM', type: 'distraction', student: 'Sarah Miller', studentEmail: 'sarah.m@university.edu', message: 'Disallowed application detected: Spotify active for 5 mins.', verified: false },
  { id: 'alert_3', timestamp: '11:31 AM', type: 'distraction', student: 'James Wilson', studentEmail: 'james.w@university.edu', message: 'Repeated distractions. Camera detects face turned away.', verified: false }
];

const DEFAULT_CHAT = [
  { sender: 'lecturer', text: 'Good morning. I wanted to touch base regarding Alex\'s focus score. He is currently doing fantastic, sitting at 94% focus!', timestamp: '09:15 AM', studentEmail: 'alex.j@university.edu' },
  { sender: 'parent', text: 'Thank you for the update! Glad to hear he is paying attention today.', timestamp: '09:18 AM', studentEmail: 'alex.j@university.edu' }
];

export const LMSProvider = ({ children }) => {
  // Portal Router State
  const [activePortal, setActivePortal] = useState('selector'); // selector, auth, student, lecturer, parent

  // Auth States (Retained in localStorage for persistent visual sessions per tab)
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('lms_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('lms_users');
    return saved ? JSON.parse(saved) : DEFAULT_USERS;
  });

  // Dynamic Parent-Student Account Link mapping
  const [linkedStudentEmail, setLinkedStudentEmail] = useState(() => {
    return localStorage.getItem('lms_linked_student_email') || 'alex.j@university.edu';
  });

  // Shared Global States (Fetched & synchronized from Express backend API)
  const [students, setStudents] = useState(DEFAULT_STUDENTS);
  const [allowedApps, setAllowedApps] = useState(DEFAULT_APPS);
  const [alerts, setAlerts] = useState(DEFAULT_ALERTS);
  const [logs, setLogs] = useState(DEFAULT_LOGS);
  const [chatMessages, setChatMessages] = useState(DEFAULT_CHAT);
  const [powerCut, setPowerCut] = useState({ active: false, start: '10:00', end: '11:30' });

  // Dynamic QR Codes
  const [qrCodeData, setQrCodeData] = useState('CLASSROOM_GUARDIAN_SECURE_AUTH_2026');
  const [qrExpiresIn, setQrExpiresIn] = useState(15);

  // Focus simulation flags
  const [webcamActive, setWebcamActive] = useState(false);
  const [simulatedDistraction, setSimulatedDistraction] = useState(false);

  // 1. Fetch entire system state from backend Express service
  const fetchState = async () => {
    try {
      const res = await fetch(`${API_BASE}/state`);
      if (res.ok) {
        const data = await res.json();
        if (data.students) setStudents(data.students);
        if (data.allowedApps) setAllowedApps(data.allowedApps);
        if (data.alerts) setAlerts(data.alerts);
        if (data.logs) setLogs(data.logs);
        if (data.chatMessages) setChatMessages(data.chatMessages);
        if (data.powerCut) setPowerCut(data.powerCut);
      }
    } catch (err) {
      console.warn('Real-time API unavailable, operating in offline fallback mode.', err.message);
    }
  };

  // 2. Poll the state every 3 seconds to achieve instant cross-tab sync!
  useEffect(() => {
    fetchState();
    const interval = setInterval(fetchState, 3000);
    return () => clearInterval(interval);
  }, []);

  // Sync Auth state to local storage
  useEffect(() => {
    localStorage.setItem('lms_current_user', currentUser ? JSON.stringify(currentUser) : '');
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('lms_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('lms_linked_student_email', linkedStudentEmail);
  }, [linkedStudentEmail]);

  // Rotate QR countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setQrExpiresIn((prev) => {
        if (prev <= 1) {
          setQrCodeData(`LMS_SECURE_${Math.floor(100000 + Math.random() * 900000)}`);
          return 15;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // AI Focus tracking metrics updates (webcam engine simulator)
  useEffect(() => {
    if (!webcamActive || !currentUser || currentUser.role !== 'student') return;

    const interval = setInterval(async () => {
      let nextFocus, nextEye, nextApp, nextStatus, nextReason;
      
      setStudents((prev) => {
        const student = prev.find(s => s.email.toLowerCase() === currentUser.email.toLowerCase());
        if (!student) return prev;
        
        if (simulatedDistraction) {
          nextFocus = Math.max(15, student.focusScore - Math.floor(Math.random() * 8) - 5);
          nextEye = Math.max(10, student.eyeScore - Math.floor(Math.random() * 12) - 8);
          nextApp = Math.max(20, student.appScore - Math.floor(Math.random() * 5));
        } else {
          nextFocus = Math.min(99, student.focusScore + Math.floor(Math.random() * 3) - 1);
          nextFocus = Math.max(88, nextFocus);
          nextEye = Math.min(98, student.eyeScore + Math.floor(Math.random() * 2) - 1);
          nextEye = Math.max(90, nextEye);
          nextApp = Math.min(96, student.appScore + Math.floor(Math.random() * 2));
          nextApp = Math.max(92, nextApp);
        }

        nextStatus = nextFocus < 60 ? 'Distracted' : 'Present';
        nextReason = nextFocus < 60 ? 'AI Face Scan: Low eye-contact vectors' : '';

        return prev.map((s) => {
          if (s.email.toLowerCase() === currentUser.email.toLowerCase()) {
            return {
              ...s,
              focusScore: nextFocus,
              eyeScore: nextEye,
              appScore: nextApp,
              status: nextStatus,
              distractionReason: nextReason
            };
          }
          return s;
        });
      });

      // Synchronize this webcam telemetry with the server so the Lecturer Portal sees it!
      if (nextFocus !== undefined) {
        try {
          const telemetryData = {
            email: currentUser.email,
            focusScore: nextFocus,
            eyeScore: nextEye,
            appScore: nextApp,
            status: nextStatus,
            distractionReason: nextReason
          };

          await fetch(`${API_BASE}/seats/telemetry`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(telemetryData)
          });

          // If student is flagged distracted, push a distraction alert sync as well
          if (nextStatus === 'Distracted') {
            const studentRecord = students.find(s => s.email.toLowerCase() === currentUser.email.toLowerCase());
            const studentName = studentRecord ? studentRecord.name : currentUser.name || 'Alex Johnson';
            
            await fetch(`${API_BASE}/alerts/sync`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                email: currentUser.email,
                studentName: studentName,
                message: 'Attention levels depreciating. Camera tracking reports gaze looking away.'
              })
            });
          }
        } catch (err) {
          console.warn('Could not sync telemetry to server:', err.message);
        }
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [webcamActive, simulatedDistraction, currentUser, students]);

  // Auth Operations (Local for UX, inserts student into backend list if checking in)
  const signUp = (name, email, password, role) => {
    const exists = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      throw new Error("This email address is already registered.");
    }

    const newUser = {
      email: email.toLowerCase(),
      password,
      name,
      role: role.toLowerCase(),
      avatar: role === 'student' ? '👨‍🎓' : role === 'lecturer' ? '👨‍🏫' : '👨‍👩‍👦'
    };

    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    setActivePortal(role.toLowerCase());
  };

  const signIn = (email, password) => {
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (!user) {
      throw new Error("Invalid academic credentials. Please try again.");
    }

    setCurrentUser(user);
    setActivePortal(user.role);
    setWebcamActive(false);
    setSimulatedDistraction(false);
  };

  const signInWithGoogle = (email, name, role) => {
    let user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!user) {
      user = {
        email: email.toLowerCase(),
        password: 'google_oauth_bypass',
        name,
        role: role.toLowerCase(),
        avatar: role === 'student' ? '👨‍🎓' : role === 'lecturer' ? '👨‍🏫' : '👨‍👩‍👦'
      };
      setUsers(prev => [...prev, user]);
    }

    setCurrentUser(user);
    setActivePortal(user.role);
    setWebcamActive(false);
    setSimulatedDistraction(false);
  };

  const logOut = () => {
    setCurrentUser(null);
    setActivePortal('selector');
    setWebcamActive(false);
    setSimulatedDistraction(false);
  };

  // Student Attendance Mapping Action
  const markAttendance = async (seatNumber) => {
    if (!currentUser || currentUser.role !== 'student') return;
    const isOutage = powerCut.active;

    // Optimistic local state update
    setStudents((prev) =>
      prev.map((s) => {
        if (s.email.toLowerCase() === currentUser.email.toLowerCase()) {
          return {
            ...s,
            status: isOutage ? 'Excused' : 'Present',
            seat: seatNumber,
            focusScore: isOutage ? 0 : 92
          };
        }
        return s;
      })
    );

    try {
      const res = await fetch(`${API_BASE}/seats/checkin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: currentUser.email, seatNumber })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.state) {
          setStudents(data.state.students);
          setLogs(data.state.logs);
        }
      }
    } catch (err) {
      console.error('Failed to submit attendance check-in:', err);
    }
  };

  // Lecturer Manual Seat Override
  const manualLecturerToggle = async (studentId, nextStatus) => {
    // Optimistic local state update
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === studentId) {
          const isAbsent = nextStatus === 'Absent';
          return {
            ...s,
            status: nextStatus,
            focusScore: isAbsent ? 0 : 85,
            eyeScore: isAbsent ? 0 : 85,
            appScore: isAbsent ? 0 : 85,
            seat: isAbsent ? '' : (s.seat || 'Temp')
          };
        }
        return s;
      })
    );

    try {
      const res = await fetch(`${API_BASE}/seats/override`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId, status: nextStatus })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.students) {
          setStudents(data.students);
        }
      }
    } catch (err) {
      console.error('Failed to override seat status:', err);
    }
  };

  // Parent/Lecturer Alert Acknowledgment
  const verifyAlert = async (alertId) => {
    // Optimistic local state update
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, verified: true } : a))
    );

    try {
      const res = await fetch(`${API_BASE}/alerts/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ alertId })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.alerts) {
          setAlerts(data.alerts);
        }
      }
    } catch (err) {
      console.error('Failed to acknowledge alert:', err);
    }
  };

  // Add App Whitelist Tag
  const addAllowedApp = async (appName) => {
    // Optimistic local state update
    const exists = allowedApps.find(a => a.name.toLowerCase() === appName.toLowerCase());
    if (exists) {
      setAllowedApps(prev => prev.map(a => a.name.toLowerCase() === appName.toLowerCase() ? { ...a, allowed: true } : a));
    } else {
      setAllowedApps(prev => [...prev, { id: `app_${Date.now()}`, name: appName, allowed: true }]);
    }

    try {
      const res = await fetch(`${API_BASE}/apps`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: appName })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.allowedApps) {
          setAllowedApps(data.allowedApps);
        }
      }
    } catch (err) {
      console.error('Failed to white-list app:', err);
    }
  };

  // Block Disallowed App
  const blockApp = async (appId) => {
    // Optimistic local state update
    setAllowedApps(prev => prev.map(a => a.id === appId ? { ...a, allowed: false } : a));

    try {
      const res = await fetch(`${API_BASE}/apps/block`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appId })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          if (data.allowedApps) setAllowedApps(data.allowedApps);
          if (data.students) setStudents(data.students);
        }
      }
    } catch (err) {
      console.error('Failed to block application:', err);
    }
  };

  // Configure Powercut Outage Simulation
  const setPowerCutWindow = async (start, end, isActive) => {
    // Optimistic local state update
    setPowerCut({ active: isActive, start, end });

    try {
      const res = await fetch(`${API_BASE}/powercut`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ start, end, active: isActive })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.powerCut) {
          setPowerCut(data.powerCut);
        }
      }
    } catch (err) {
      console.error('Failed to toggle power-cut outage window:', err);
    }
  };

  // Secure Parent-Lecturer Messaging with contextual AI response
  const sendMessageToLecturer = async (messageText) => {
    if (!currentUser) return;
    
    // Optimistic local state update
    const userMsg = { 
      sender: 'parent', 
      text: messageText, 
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      studentEmail: linkedStudentEmail
    };
    setChatMessages((prev) => [...prev, userMsg]);

    try {
      const res = await fetch(`${API_BASE}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sender: 'parent', text: messageText, studentEmail: linkedStudentEmail })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.chatMessages) {
          setChatMessages(data.chatMessages);
        }
      }
    } catch (err) {
      console.error('Failed to post parental message:', err);
    }
  };

  // Reset entire system to preset seeds
  const resetAllData = async () => {
    localStorage.removeItem('lms_current_user');
    localStorage.removeItem('lms_users');
    localStorage.removeItem('lms_linked_student_email');
    
    setCurrentUser(null);
    setUsers(DEFAULT_USERS);
    setLinkedStudentEmail('alex.j@university.edu');
    setWebcamActive(false);
    setSimulatedDistraction(false);
    setActivePortal('selector');

    try {
      const res = await fetch(`${API_BASE}/reset`, {
        method: 'POST'
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.state) {
          setStudents(data.state.students);
          setAllowedApps(data.state.allowedApps);
          setAlerts(data.state.alerts);
          setLogs(data.state.logs);
          setChatMessages(data.state.chatMessages);
          setPowerCut(data.state.powerCut);
        }
      }
    } catch (err) {
      console.error('Failed to reset full-stack database:', err);
    }
  };

  return (
    <LMSContext.Provider value={{
      activePortal,
      setActivePortal,
      currentUser,
      users,
      linkedStudentEmail,
      setLinkedStudentEmail,
      students,
      allowedApps,
      alerts,
      logs,
      chatMessages,
      powerCut,
      qrCodeData,
      qrExpiresIn,
      webcamActive,
      setWebcamActive,
      simulatedDistraction,
      setSimulatedDistraction,
      signUp,
      signIn,
      signInWithGoogle,
      logOut,
      markAttendance,
      manualLecturerToggle,
      verifyAlert,
      addAllowedApp,
      blockApp,
      setPowerCutWindow,
      sendMessageToLecturer,
      resetAllData
    }}>
      {children}
    </LMSContext.Provider>
  );
};

export const useLMS = () => useContext(LMSContext);
