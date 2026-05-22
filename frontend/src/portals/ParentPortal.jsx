import React, { useState } from 'react';
import { useLMS } from '../context/LMSContext';
import { WeeklyLineChart } from '../components/SVGCharts';
import { 
  Users, MessageSquare, Bell, ClipboardList, CheckCircle, 
  XCircle, Sparkles, Send, User, Award, ShieldCheck, Heart 
} from 'lucide-react';

export default function ParentPortal() {
  const { students, logs, alerts, chatMessages, sendMessageToLecturer, linkedStudentEmail, setLinkedStudentEmail, currentUser } = useLMS();
  const [chatInput, setChatInput] = useState('');

  const currentStudent = students.find(s => s.email.toLowerCase() === linkedStudentEmail.toLowerCase());
  
  // Calculate dynamic attendance rate for this student
  const studentLogs = logs.filter(l => l.studentEmail.toLowerCase() === linkedStudentEmail.toLowerCase());
  const presentLogs = studentLogs.filter(l => l.present === 'Present' || l.present === 'Excused');
  const attendanceRate = studentLogs.length > 0
    ? Math.round((presentLogs.length / studentLogs.length) * 100)
    : (linkedStudentEmail === 'alex.j@university.edu' ? 94 : 0);

  const focusRate = currentStudent ? currentStudent.focusScore : 0;
  
  const handleChatSubmit = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    sendMessageToLecturer(chatInput.trim());
    setChatInput('');
  };

  const studentName = currentStudent ? currentStudent.name : 'Student';
  const studentFirstName = currentStudent ? currentStudent.name.split(' ')[0] : 'Student';

  const getPositiveHighlights = () => [
    { title: 'Consistent Early Check-ins', desc: `${studentFirstName} has logged into their designated seat early for active lectures. Setting strong morning routines.`, icon: '🌅' },
    { title: 'Top Tier Focus Rating', desc: `${studentFirstName} achieved a ${focusRate}% focus rating today, placing them in the top tier of database engineering students.`, icon: '🎯' },
    { title: 'Class Participation Excel', desc: 'Demonstrated high involvement during the microservice structures review session today.', icon: '🔥' }
  ];

  const studentAlerts = alerts.filter(a => a.studentEmail.toLowerCase() === linkedStudentEmail.toLowerCase());
  const studentChatMessages = chatMessages.filter(msg => msg.studentEmail.toLowerCase() === linkedStudentEmail.toLowerCase());

  return (
    <div className="parent-portal-wrapper float-in">
      
      {/* 2 Column Dashboard Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '2rem', alignItems: 'flex-start' }}>
        
        {/* Left Column: Analytics Summary & Performance Logs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Parent-Student Link Selector */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', border: '1px solid rgba(34,197,94,0.3)', background: 'rgba(34,197,94,0.02)' }}>
            <h4 style={{ fontSize: '0.85rem', color: 'var(--green)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem', textTransform: 'uppercase' }}>
              <Users size={16} />
              Linked Student Account Profile
            </h4>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <select 
                value={linkedStudentEmail}
                onChange={(e) => setLinkedStudentEmail(e.target.value)}
                className="form-select"
                style={{ flex: 1, padding: '0.5rem 1rem', fontSize: '0.85rem', background: 'var(--bg-dark)', color: 'var(--white)', border: '1px solid var(--card-border)', borderRadius: '8px' }}
                title="Linked Student Profile Email"
              >
                {students.map(s => (
                  <option key={s.id} value={s.email}>
                    {s.name} ({s.email}) — Seat: {s.seat || 'None'}
                  </option>
                ))}
              </select>
            </div>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
              Select your child's profile to retrieve live webcam focus metrics, attendance logs, and real-time alerts.
            </p>
          </div>

          {/* Circular Stats Summary */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldCheck size={18} style={{ color: 'var(--green)' }} />
              Live Academic Summary: {studentName}
            </h3>

            <div className="grid-cols-2" style={{ gap: '1.5rem', margin: '0.5rem 0' }}>
              
              {/* Attendance metric card */}
              <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--card-border)', borderRadius: '12px', textAlign: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Attendance Rate</span>
                <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--primary-light)', margin: '0.5rem 0' }}>{attendanceRate}%</h2>
                <span className="badge badge-present" style={{ fontSize: '0.65rem' }}>Securely Mapped</span>
              </div>

              {/* Live Focus index card */}
              <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--card-border)', borderRadius: '12px', textAlign: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Live Gaze Focus</span>
                <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: focusRate < 60 ? 'var(--gold)' : 'var(--green)', margin: '0.5rem 0' }}>{focusRate}%</h2>
                <span className={`badge ${focusRate < 60 ? 'badge-distracted' : 'badge-present'}`} style={{ fontSize: '0.65rem' }}>
                  {focusRate < 60 ? 'Alert: Distracted' : 'Highly Attentive'}
                </span>
              </div>

            </div>

            <WeeklyLineChart />
          </div>

          {/* Positive Reinforcements highlight section */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--gold)' }}>
              <Heart size={18} style={{ color: 'var(--gold)' }} />
              Positive Reinforcement Milestones
            </h3>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', lineHeight: '1.4' }}>
              These highlights recognize specific academic focus achievements compiled by the course AI layer and course lecturer to encourage student consistency.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {getPositiveHighlights().map((high, idx) => (
                <div 
                  key={idx}
                  style={{ 
                    padding: '0.85rem', 
                    background: 'rgba(250,204,21,0.02)', 
                    border: '1px solid rgba(250,204,21,0.15)', 
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.75rem'
                  }}
                >
                  <span style={{ fontSize: '1.6rem', flexShrink: 0 }}>{high.icon}</span>
                  <div>
                    <h4 style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--white)' }}>{high.title}</h4>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem', lineHeight: '1.4' }}>{high.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tabular logs lists */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ClipboardList size={18} style={{ color: 'var(--primary-light)' }} />
              Historical Lecture Record: {studentName}
            </h3>
            
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Attendance</th>
                    <th>Focus Rating</th>
                    <th>Grid Seat</th>
                  </tr>
                </thead>
                <tbody>
                  {studentLogs.slice(0, 5).map((l, i) => (
                    <tr key={i}>
                      <td style={{ fontWeight: '600' }}>{l.date}</td>
                      <td>
                        <span className={`badge ${
                          l.present === 'Present' ? 'badge-present' : 
                          l.present === 'Excused' ? 'badge-excused' : 'badge-absent'
                        }`}>
                          {l.present}
                        </span>
                      </td>
                      <td style={{ fontWeight: '600' }}>{l.focus}</td>
                      <td style={{ fontWeight: '700' }}>{l.seat || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Right Column: Instant Alerts Inbox & Lecturer secure chat */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Live notifications lists */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Bell size={18} style={{ color: 'var(--gold)' }} />
              Push Notifications & Safety Alerts
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '220px', overflowY: 'auto' }}>
              {studentAlerts.length === 0 ? (
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', padding: '1rem' }}>
                  🛡️ No safety logs recorded.
                </p>
              ) : (
                studentAlerts.map(a => (
                  <div 
                    key={a.id}
                    className="card"
                    style={{ 
                      padding: '0.85rem',
                      background: a.type === 'absence' ? 'rgba(239,68,68,0.03)' : 'rgba(250,204,21,0.03)',
                      border: `1px solid ${a.type === 'absence' ? 'rgba(239,68,68,0.15)' : 'rgba(250,204,21,0.15)'}`
                    }}
                  >
                    <div className="flex-between">
                      <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>{a.timestamp}</span>
                      <span className={`badge ${a.type === 'absence' ? 'badge-absent' : 'badge-distracted'}`} style={{ fontSize: '0.55rem', padding: '0.1rem 0.35rem' }}>
                        {a.type === 'absence' ? 'Absence' : 'Distraction'}
                      </span>
                    </div>
                    
                    <h4 style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--white)', marginTop: '0.25rem' }}>
                      {a.student}
                    </h4>
                    
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.15rem', lineHeight: '1.4' }}>
                      {a.message}
                    </p>

                    {a.verified && (
                      <div style={{ color: 'var(--green)', fontSize: '0.65rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.2rem', marginTop: '0.4rem' }}>
                        <CheckCircle size={10} />
                        Validated by Lecturer
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Secure Lecturer Chat console */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', background: 'rgba(21, 29, 48, 0.85)' }}>
            
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MessageSquare size={18} style={{ color: 'var(--primary-light)' }} />
                Secure Chat: Prof. Ronald Vance
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginTop: '0.2rem' }}>
                Exchange messages directly with course coordinators. AI automation generates responsive summaries of {studentFirstName}'s live engagement stats.
              </p>
            </div>

            {/* Chat message logger */}
            <div className="chat-window">
              <div className="chat-messages">
                {studentChatMessages.map((msg, idx) => (
                  <div 
                    key={idx} 
                    className={`chat-message ${msg.sender === 'parent' ? 'chat-message-parent' : 'chat-message-lecturer'}`}
                  >
                    <p style={{ fontSize: '0.8rem' }}>{msg.text}</p>
                    <span style={{ display: 'block', fontSize: '0.6rem', textAlign: 'right', marginTop: '0.25rem', opacity: 0.6 }}>
                      {msg.timestamp}
                    </span>
                  </div>
                ))}
              </div>
              
              <form onSubmit={handleChatSubmit} className="chat-input-area">
                <input 
                  type="text" 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder={`Ask lecturer about ${studentFirstName}'s focus, exams or attendance...`}
                  className="form-input"
                  style={{ flex: 1, fontSize: '0.8rem' }}
                />
                <button type="submit" className="btn btn-primary" style={{ padding: '0.6rem' }} title="Send Message">
                  <Send size={15} />
                </button>
              </form>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--card-border)', fontSize: '0.7rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
              💡 Try asking: "How is {studentFirstName} doing with focus?" or "Is he eligible for the exams?"
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
