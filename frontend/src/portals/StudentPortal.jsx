import React, { useState } from 'react';
import { useLMS } from '../context/LMSContext';
import CameraFocusSim from '../components/CameraFocusSim';
import { WeeklyLineChart, ClassComparisonBarChart } from '../components/SVGCharts';
import { 
  Award, QrCode, ClipboardList, TrendingUp, Compass, 
  CheckCircle, XCircle, Grid, Play, AlertCircle, AlertTriangle, Lightbulb 
} from 'lucide-react';

export default function StudentPortal() {
  const { students, logs, markAttendance, powerCut, currentUser } = useLMS();
  const [activeTab, setActiveTab] = useState('dashboard'); // dashboard, attendance, performance, self-improvement
  
  // Seat state
  const [seatInput, setSeatInput] = useState('');
  // Scanning QR simulated state
  const [scanning, setScanning] = useState(false);
  const [scanSuccess, setScanSuccess] = useState(false);

  const student = students.find(s => s.email.toLowerCase() === currentUser?.email.toLowerCase());
  
  // Calculate dynamic attendance rate for this student
  const studentLogs = logs.filter(l => l.studentEmail.toLowerCase() === currentUser?.email.toLowerCase());
  const presentClasses = studentLogs.filter(l => l.present === 'Present' || l.present === 'Excused').length;
  const attendanceRate = studentLogs.length > 0 
    ? Math.round((presentClasses / studentLogs.length) * 100)
    : (currentUser?.email === 'alex.j@university.edu' ? 94 : 0);

  const focusRate = student ? student.focusScore : 0;
  
  const isEligible = attendanceRate >= 80;

  const handleQRScanSubmit = (e) => {
    e.preventDefault();
    if (!seatInput) {
      alert("Please designate a seat number first (e.g., C4).");
      return;
    }
    
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      setScanSuccess(true);
      markAttendance(seatInput);
      setTimeout(() => setScanSuccess(false), 2000);
    }, 2000);
  };

  const getBadges = () => [
    { name: 'Perfect Week', desc: 'Maintained 100% attendance over 5 consecutive lectures.', earned: true, icon: '📅', color: 'var(--green)' },
    { name: 'Laser Focus', desc: 'Maintained over 90% focus rating during a full database lecture.', earned: true, icon: '🎯', color: 'var(--gold)' },
    { name: 'Early Bird', desc: 'Logged in and mapped seat 10 minutes prior to lecture start.', earned: true, icon: '🌅', color: 'var(--primary-light)' },
    { name: 'Steady Learner', desc: 'Maintained a consistent engagement index of 85%+ all month.', earned: false, icon: '🏆', color: 'var(--text-muted)' }
  ];

  return (
    <div className="student-portal-wrapper">
      
      {/* Student Sub-Navigation Panel */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', borderBottom: '1px solid var(--card-border)', paddingBottom: '1rem', overflowX: 'auto' }}>
        {[
          { id: 'dashboard', label: 'Dashboard', icon: Grid },
          { id: 'attendance', label: 'Attendance & QR Mappings', icon: QrCode },
          { id: 'performance', label: 'Performance & Leaderboards', icon: TrendingUp },
          { id: 'self-improvement', label: 'AI self-improvement', icon: Compass }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button 
              key={tab.id}
              className={`btn ${isActive ? 'btn-primary' : 'btn-outline'}`}
              style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', flexShrink: 0 }}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* RENDER ACTIVE TAB */}
      
      {activeTab === 'dashboard' && (
        <div className="grid-cols-1" style={{ gap: '2rem' }}>
          
          {/* Main Dashboard Cards: 4 column metrics */}
          <div className="grid-cols-4" style={{ gap: '1.5rem' }}>
            
            {/* ATTENDANCE RING WIDGET */}
            <div className="card flex-center" style={{ flexDirection: 'column', padding: '1.5rem 1rem', textAlign: 'center' }}>
              <h4 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '1rem', letterSpacing: '0.05em' }}>Attendance Rate</h4>
              <div className="progress-circle-container">
                <svg width="120" height="120" className="progress-circle">
                  <circle cx="60" cy="60" r="50" className="progress-circle-bg" />
                  <circle cx="60" cy="60" r="50" className="progress-circle-bar" stroke="var(--primary-light)" strokeDasharray="314.15" strokeDashoffset={314.15 - (314.15 * attendanceRate) / 100} />
                </svg>
                <div className="progress-circle-value">
                  <span className="progress-circle-number">{attendanceRate}%</span>
                  <span className="progress-circle-label">Present</span>
                </div>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '1rem' }}>
                6 classes registered this term.
              </p>
            </div>

            {/* FOCUS MONITORING RING WIDGET */}
            <div className="card flex-center" style={{ flexDirection: 'column', padding: '1.5rem 1rem', textAlign: 'center' }}>
              <h4 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '1rem', letterSpacing: '0.05em' }}>AI Gaze Focus Index</h4>
              <div className="progress-circle-container">
                <svg width="120" height="120" className="progress-circle">
                  <circle cx="60" cy="60" r="50" className="progress-circle-bg" />
                  <circle cx="60" cy="60" r="50" className="progress-circle-bar" stroke={focusRate < 60 ? 'var(--gold)' : 'var(--green)'} strokeDasharray="314.15" strokeDashoffset={314.15 - (314.15 * focusRate) / 100} />
                </svg>
                <div className="progress-circle-value">
                  <span className="progress-circle-number">{focusRate}%</span>
                  <span className="progress-circle-label">{focusRate < 60 ? 'Distracted' : 'Focused'}</span>
                </div>
              </div>
              <p style={{ fontSize: '0.75rem', color: focusRate < 60 ? 'var(--gold)' : 'var(--text-secondary)', marginTop: '1rem', fontWeight: focusRate < 60 ? '600' : 'normal' }}>
                {focusRate < 60 ? '⚠️ Low focus threshold detected.' : '🛡️ Standard attentiveness.'}
              </p>
            </div>

            {/* SEAT MAPPING */}
            <div className="card flex-between" style={{ flexDirection: 'column', justifyContent: 'center', padding: '1.5rem', textAlign: 'center' }}>
              <h4 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.75rem', letterSpacing: '0.05em' }}>Active Lecture Seat</h4>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(59,130,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0.5rem auto' }}>
                <Award size={32} style={{ color: 'var(--primary-light)' }} />
              </div>
              <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: student?.seat ? 'var(--white)' : 'var(--text-muted)' }}>
                {student?.seat || 'Unmapped'}
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                {student?.seat ? 'Seat assigned in grid row B.' : 'Click Attendance tab to scan QR.'}
              </p>
            </div>

            {/* EXAM ELIGIBILITY */}
            <div className="card flex-between" style={{ flexDirection: 'column', justifyContent: 'center', padding: '1.5rem', textAlign: 'center' }}>
              <h4 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.75rem', letterSpacing: '0.05em' }}>Exam Eligibility</h4>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: isEligible ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0.5rem auto' }}>
                {isEligible ? (
                  <CheckCircle size={32} style={{ color: 'var(--green)' }} />
                ) : (
                  <XCircle size={32} style={{ color: 'var(--red)' }} />
                )}
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: isEligible ? 'var(--green)' : 'var(--red)' }}>
                {isEligible ? 'ELIGIBLE' : 'INELIGIBLE'}
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                Requires 80%+ attendance baseline.
              </p>
            </div>

          </div>

          {/* Secondary Dashboard area: Camera Simulation & Quick Logs split */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
            
            {/* Live Camera focus widget */}
            <CameraFocusSim />

            {/* Quick logs overview */}
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', background: 'rgba(21, 29, 48, 0.85)' }}>
              <div className="flex-between">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <ClipboardList size={18} style={{ color: 'var(--primary-light)' }} />
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Lecture Attendance Logs</h3>
                </div>
                <button className="btn btn-outline" style={{ padding: '0.25rem 0.5rem', fontSize: '0.7rem' }} onClick={() => setActiveTab('attendance')}>
                  View All
                </button>
              </div>

              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Seat</th>
                      <th>Status</th>
                      <th>Avg Focus</th>
                    </tr>
                  </thead>
                  <tbody>
                    {studentLogs.slice(0, 4).map((l, i) => (
                      <tr key={i}>
                        <td style={{ fontWeight: '600' }}>{l.date}</td>
                        <td>{l.seat || '—'}</td>
                        <td>
                          <span className={`badge ${
                            l.present === 'Present' ? 'badge-present' : 
                            l.present === 'Excused' ? 'badge-excused' : 'badge-absent'
                          }`}>
                            {l.present}
                          </span>
                        </td>
                        <td style={{ fontWeight: '600', color: l.present === 'Excused' ? 'var(--text-muted)' : 'var(--white)' }}>
                          {l.focus}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

        </div>
      )}

      {activeTab === 'attendance' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '2rem' }}>
          
          {/* Dynamic QR Scanner control form */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <QrCode size={22} style={{ color: 'var(--gold)' }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Dynamic QR Scanner Mapping</h3>
            </div>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.5' }}>
              To record attendance: input your current physical Seat Map Grid ID (e.g. B3, C4) and trigger the secure dynamic QR code scan overlay.
            </p>

            {powerCut.active && (
              <div className="card" style={{ background: 'rgba(250,204,21,0.06)', border: '1px solid rgba(250,204,21,0.25)', padding: '1rem', borderRadius: '10px' }}>
                <div style={{ display: 'flex', gap: '0.5rem', color: 'var(--gold)' }}>
                  <AlertTriangle size={18} style={{ flexShrink: 0 }} />
                  <div>
                    <h5 style={{ fontSize: '0.85rem', fontWeight: 700 }}>Offline Power Cut Override Active</h5>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                      Manual scanner mappings submitted during this window are recorded as **Excused Attendance (Outage Override)**. Gaze focus tracking requirements are temporarily bypassed.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleQRScanSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="form-group">
                <label>Assigned Seat Grid Number</label>
                <input 
                  type="text" 
                  value={seatInput}
                  onChange={(e) => setSeatInput(e.target.value.toUpperCase())}
                  placeholder="e.g. B3" 
                  className="form-input" 
                  maxLength={4}
                  style={{ textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '1.1rem', fontWeight: 'bold', textAlign: 'center' }}
                  required
                />
              </div>

              {/* Scanning visual state container */}
              {scanning && (
                <div style={{ height: '160px', position: 'relative', background: '#090d16', border: '2px dashed var(--gold)', borderRadius: '12px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
                  {/* Neon laser line animation */}
                  <div style={{ position: 'absolute', left: 0, width: '100%', height: '3px', background: 'var(--gold)', boxShadow: '0 0 12px var(--gold)', animation: 'laser 2s infinite ease-in-out' }}></div>
                  <QrCode size={40} className="float" style={{ color: 'var(--gold)', opacity: 0.5 }} />
                  <p style={{ fontSize: '0.8rem', color: 'var(--gold)', marginTop: '0.75rem', fontWeight: 600 }}>Scanning Lecture Smartboard...</p>
                </div>
              )}

              {scanSuccess && (
                <div style={{ height: '160px', background: 'rgba(34, 197, 94, 0.08)', border: '2px solid var(--green)', borderRadius: '12px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                  <CheckCircle size={44} style={{ color: 'var(--green)' }} />
                  <p style={{ fontSize: '0.85rem', color: 'var(--green)', marginTop: '0.5rem', fontWeight: 700 }}>Scan Authenticated!</p>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Seat {student?.seat} logged successfully.</p>
                </div>
              )}

              {!scanning && !scanSuccess && (
                <button type="submit" className="btn btn-primary" style={{ width: '100%', gap: '0.5rem', padding: '1rem' }}>
                  <QrCode size={18} />
                  Initiate Secure QR Sync
                </button>
              )}
            </form>
          </div>

          {/* Detailed logs table list */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ClipboardList size={22} style={{ color: 'var(--primary-light)' }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Historical Attendance Logs</h3>
            </div>
            
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Recorded Status</th>
                    <th>Check-in Time</th>
                    <th>Seat Map</th>
                    <th>Points</th>
                  </tr>
                </thead>
                <tbody>
                  {studentLogs.map((l, i) => (
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
                      <td>{l.time}</td>
                      <td style={{ fontWeight: '700' }}>{l.seat || '—'}</td>
                      <td style={{ fontWeight: '700', color: 'var(--gold)' }}>{l.points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {activeTab === 'performance' && (
        <div className="grid-cols-1" style={{ gap: '2rem' }}>
          
          {/* Top visual area: Weekly trends line chart & Gamification badging */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '2rem' }}>
            
            {/* SVG Weekly line chart */}
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <TrendingUp size={18} style={{ color: 'var(--primary-light)' }} />
                Weekly Attendance & Focus Trends
              </h3>
              <WeeklyLineChart />
            </div>

            {/* Badges system widgets */}
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Award size={18} style={{ color: 'var(--gold)' }} />
                Gamified Badges & Milestones
              </h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '0.5rem' }}>
                {getBadges().map((badge, idx) => (
                  <div 
                    key={idx}
                    className="card"
                    style={{ 
                      padding: '0.75rem', 
                      background: badge.earned ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.01)', 
                      border: `1px solid ${badge.earned ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.02)'}`,
                      opacity: badge.earned ? 1 : 0.4,
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.5rem'
                    }}
                  >
                    <span style={{ fontSize: '1.8rem', flexShrink: 0 }}>{badge.icon}</span>
                    <div>
                      <h4 style={{ fontSize: '0.8rem', fontWeight: 700, color: badge.earned ? 'var(--white)' : 'var(--text-muted)' }}>{badge.name}</h4>
                      <p style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', marginTop: '0.2rem', lineHeight: '1.3' }}>{badge.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Podiums and leaderboards */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, textAlign: 'center' }}>🏆 Engagement Leaderboard (Advanced Algorithms Module)</h3>
            
            {/* Dynamic Leaderboard Sorting */}
            {(() => {
              const sortedLeaderboard = [...students]
                .sort((a, b) => b.focusScore - a.focusScore)
                .map((s, idx) => {
                  const isMe = s.email.toLowerCase() === currentUser?.email.toLowerCase();
                  const sLogs = logs.filter(l => l.studentEmail.toLowerCase() === s.email.toLowerCase());
                  const sPresent = sLogs.filter(l => l.present === 'Present' || l.present === 'Excused').length;
                  const sAtt = sLogs.length > 0 
                    ? Math.round((sPresent / sLogs.length) * 100)
                    : (s.email === 'alex.j@university.edu' ? 94 : s.status === 'Absent' ? 0 : 88);
                  
                  return {
                    rank: idx + 1,
                    name: isMe ? `${s.name} (You)` : s.name,
                    attendance: `${sAtt}%`,
                    focus: `${s.focusScore}%`,
                    focusVal: s.focusScore,
                    avatar: s.avatar || '👨‍🎓',
                    xp: `${1200 + s.focusScore * 5 + sAtt * 2} XP`,
                    highlight: isMe
                  };
                });

              const top1 = sortedLeaderboard[0] || { name: 'Alex Johnson', focus: '94%', avatar: '👨‍🎓' };
              const top2 = sortedLeaderboard[1] || { name: 'David Chen', focus: '92%', avatar: '👨‍🎓' };
              const top3 = sortedLeaderboard[2] || { name: 'Jessica Davis', focus: '91%', avatar: '👩‍🎓' };

              return (
                <>
                  {/* 3D Visual podium for top 3 */}
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: '1.5rem', padding: '2rem 1rem 1rem', borderBottom: '1px solid var(--card-border)', overflowX: 'auto' }}>
                    
                    {/* 2nd Place */}
                    <div className="flex-center" style={{ flexDirection: 'column', width: '90px' }}>
                      <span style={{ fontSize: '1.8rem' }}>🥈</span>
                      <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--white)', marginTop: '0.25rem', textAlign: 'center' }}>{top2.name}</span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{top2.focus} focus</span>
                      <div style={{ width: '80px', height: '60px', background: 'linear-gradient(to top, rgba(255,255,255,0.05), rgba(255,255,255,0.15))', border: '1px solid rgba(255,255,255,0.2)', borderTopLeftRadius: '6px', borderTopRightRadius: '6px', display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '0.5rem', fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--text-secondary)' }}>
                        #2
                      </div>
                    </div>

                    {/* 1st Place */}
                    <div className="flex-center" style={{ flexDirection: 'column', width: '100px' }}>
                      <span className="float" style={{ fontSize: '2.5rem' }}>👑</span>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--gold)', marginTop: '0.25rem', textAlign: 'center' }}>{top1.name}</span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{top1.focus} focus</span>
                      <div style={{ width: '90px', height: '90px', background: 'linear-gradient(to top, rgba(250,204,21,0.08), rgba(250,204,21,0.2))', border: '1px solid var(--gold)', borderTopLeftRadius: '8px', borderTopRightRadius: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '0.5rem', fontWeight: 'bold', fontSize: '1.6rem', color: 'var(--gold)' }}>
                        #1
                      </div>
                    </div>

                    {/* 3rd Place */}
                    <div className="flex-center" style={{ flexDirection: 'column', width: '90px' }}>
                      <span style={{ fontSize: '1.8rem' }}>🥉</span>
                      <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--white)', marginTop: '0.25rem', textAlign: 'center' }}>{top3.name}</span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{top3.focus} focus</span>
                      <div style={{ width: '80px', height: '40px', background: 'linear-gradient(to top, rgba(255,255,255,0.02), rgba(255,255,255,0.08))', border: '1px solid rgba(255,255,255,0.1)', borderTopLeftRadius: '6px', borderTopRightRadius: '6px', display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '0.5rem', fontWeight: 'bold', fontSize: '1.1rem', color: '#b45309' }}>
                        #3
                      </div>
                    </div>

                  </div>

                  {/* Remaining leaderboard lists */}
                  <div className="table-container">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Rank</th>
                          <th>Student Name</th>
                          <th>Attendance Rate</th>
                          <th>Focus Rating</th>
                          <th>Level Score</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sortedLeaderboard.slice(0, 5).map((lead, idx) => (
                          <tr key={idx} style={{ background: lead.highlight ? 'rgba(59, 130, 246, 0.08)' : 'transparent' }}>
                            <td style={{ fontWeight: 'bold', color: lead.rank === 1 ? 'var(--gold)' : 'var(--text-secondary)' }}>#{lead.rank}</td>
                            <td style={{ fontWeight: 'bold', color: lead.highlight ? 'var(--white)' : 'var(--text-secondary)' }}>{lead.name}</td>
                            <td>{lead.attendance}</td>
                            <td>
                              <span style={{ color: lead.highlight ? 'var(--green)' : 'inherit', fontWeight: lead.highlight ? 'bold' : 'normal' }}>
                                {lead.focus}
                              </span>
                            </td>
                            <td style={{ fontWeight: 'bold', color: 'var(--gold)' }}>{lead.xp}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              );
            })()}
          </div>

        </div>
      )}

      {activeTab === 'self-improvement' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '2rem' }}>
          
          {/* Comparison bar chart side-by-side widget */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <TrendingUp size={22} style={{ color: 'var(--primary-light)' }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Comparison with Class Average</h3>
            </div>
            
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.5' }}>
              This chart compares your individual academic indicators (attendance %, average webcam focus %, and daily module participation scores) against the overall average metrics of all 42 enrolled students in this lecture section.
            </p>

            <div style={{ padding: '1rem 0' }}>
              <ClassComparisonBarChart />
            </div>
          </div>

          {/* AI Tips Cards */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Lightbulb size={22} style={{ color: 'var(--gold)' }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Simulated AI Insights & Tips</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                { 
                  title: 'Optimal focus Windows', 
                  desc: 'Telemetry logs show your gaze focus peaks during the first 35 minutes of lecture. Gaze drifts tend to occur in the final 15 minutes. Consider adjusting posture or taking deep breaths near the hour mark to sustain engagement.',
                  type: 'focus'
                },
                { 
                  title: 'App Infraction Warning', 
                  desc: 'Background scanner recorded unauthorized App (Spotify) execution during lectures last Wednesday. Maintained focus requires placing your devices into "LMS Allowed Mode" to avoid focus score depreciation.',
                  type: 'app'
                },
                { 
                  title: 'Positive Reinforcement Highlights', 
                  desc: 'Congratulations! Your focus rating is currently 16% higher than the global class average. Keep this up to earn the "Term-End Diamond Scholar" certificate next month.',
                  type: 'success'
                }
              ].map((tip, idx) => (
                <div 
                  key={idx}
                  className="card"
                  style={{ 
                    padding: '1rem',
                    background: tip.type === 'success' ? 'rgba(34,197,94,0.03)' : tip.type === 'app' ? 'rgba(239,68,68,0.03)' : 'rgba(250,204,21,0.03)',
                    border: `1px solid ${
                      tip.type === 'success' ? 'rgba(34,197,94,0.2)' : tip.type === 'app' ? 'rgba(239,68,68,0.2)' : 'rgba(250,204,21,0.2)'
                    }`
                  }}
                >
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--white)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Lightbulb size={14} style={{ color: tip.type === 'success' ? 'var(--green)' : tip.type === 'app' ? 'var(--red)' : 'var(--gold)' }} />
                    {tip.title}
                  </h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.5rem', lineHeight: '1.5' }}>
                    {tip.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
