import React, { useState } from 'react';
import { useLMS } from '../context/LMSContext';
import { 
  Shield, QrCode, Monitor, FileSpreadsheet, Users, 
  Settings, Check, X, Plus, Play, Info, AlertOctagon, Ban, 
  Activity, Sliders, BatteryCharging, Zap 
} from 'lucide-react';

export default function LecturerPortal() {
  const { 
    students, setStudents, allowedApps, addAllowedApp, blockApp, 
    alerts, verifyAlert, powerCut, setPowerCutWindow, 
    qrCodeData, qrExpiresIn, manualLecturerToggle, logs
  } = useLMS();

  const [activeTab, setActiveTab] = useState('grid'); // grid, attendance, focus, reports
  const [selectedStudent, setSelectedStudent] = useState(null);
  
  // States for new app form
  const [newAppName, setNewAppName] = useState('');
  
  // Power cut window form states
  const [outageStart, setOutageStart] = useState(powerCut.start);
  const [outageEnd, setOutageEnd] = useState(powerCut.end);

  // Large QR display toggle
  const [showQRModal, setShowQRModal] = useState(false);

  // Grid sizing: Rows A to F (6 rows), Columns 1 to 8 (8 cols)
  const rows = ['A', 'B', 'C', 'D', 'E', 'F'];
  const cols = [1, 2, 3, 4, 5, 6, 7, 8];

  // Helper to map seat to student record
  const getStudentAtSeat = (seatKey) => {
    return students.find(s => s.seat && s.seat.toUpperCase() === seatKey.toUpperCase());
  };

  const handleSeatClick = (seatKey, student) => {
    if (student) {
      setSelectedStudent(student);
    } else {
      setSelectedStudent({ seat: seatKey, isPlaceholder: true });
    }
  };

  const handleAppSubmit = (e) => {
    e.preventDefault();
    if (!newAppName.trim()) return;
    addAllowedApp(newAppName.trim());
    setNewAppName('');
  };

  const handleOutageSubmit = (e) => {
    e.preventDefault();
    setPowerCutWindow(outageStart, outageEnd, !powerCut.active);
  };

  // Mock Export CSV download trigger
  const triggerCSVExport = () => {
    const csvRows = [
      ['Student Name', 'Email', 'Active Seat', 'Attendance Status', 'Live Focus %', 'Eye Aspect %', 'Allowed App %'],
      ...students.map(s => [s.name, s.email, s.seat || '—', s.status, `${s.focusScore}%`, `${s.eyeScore}%`, `${s.appScore}%`])
    ];
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + csvRows.map(e => e.join(",")).join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `LMS_Engagement_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="lecturer-portal-wrapper">
      
      {/* Tab Navigation buttons */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', borderBottom: '1px solid var(--card-border)', paddingBottom: '1rem', overflowX: 'auto' }}>
        {[
          { id: 'grid', label: 'Live Seat Map Grid', icon: Users },
          { id: 'attendance', label: 'Attendance Controls', icon: QrCode },
          { id: 'focus', label: 'Focus & Apps Policy', icon: Monitor },
          { id: 'reports', label: 'Reports & Eligibility', icon: FileSpreadsheet }
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

      {activeTab === 'grid' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 0.8fr', gap: '2rem', alignItems: 'flex-start' }}>
          
          {/* Main 6x8 Seat Map Grid */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="flex-between">
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Smartboard / Classroom Seat Map</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                  Click occupied seats (colored) or empty seats (dashed) to examine student gaze and app statistics in real-time.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <span className="badge badge-present" style={{ fontSize: '0.65rem' }}>Focused</span>
                <span className="badge badge-distracted" style={{ fontSize: '0.65rem' }}>Distracted</span>
                <span className="badge badge-excused" style={{ fontSize: '0.65rem' }}>Empty</span>
              </div>
            </div>

            {/* Front Stage Indicator */}
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '6px', padding: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-secondary)', textAlign: 'center', margin: '0 2rem' }}>
              👨‍🏫 FRONT STAGE (LECTURER PODIUM)
            </div>

            {/* Interactive Grid Map */}
            <div className="grid-seats" style={{ gridTemplateColumns: 'repeat(8, 1fr)' }}>
              {rows.map(row => 
                cols.map(col => {
                  const seatKey = `${row}${col}`;
                  const stud = getStudentAtSeat(seatKey);
                  
                  let seatClass = '';
                  if (stud) {
                    if (stud.status === 'Present') seatClass = 'seat-present';
                    else if (stud.status === 'Distracted') seatClass = 'seat-distracted';
                    else seatClass = 'seat-absent';
                  }

                  return (
                    <div 
                      key={seatKey}
                      className={`seat-box ${seatClass}`}
                      onClick={() => handleSeatClick(seatKey, stud)}
                    >
                      <span className="seat-label">{seatKey}</span>
                      {stud && (
                        <>
                          <span style={{ fontSize: '1rem' }}>{stud.avatar}</span>
                          <span className="seat-student-name">{stud.name.replace(' (You)', '')}</span>
                        </>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Seat Inspector / Live Gaze Telemetry Card */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Real-time AI Alerts panel */}
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', background: 'rgba(21, 29, 48, 0.85)' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Activity size={18} style={{ color: 'var(--red)' }} />
                Real-Time AI Gaze Alerts
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '200px', overflowY: 'auto' }}>
                {alerts.filter(a => !a.verified).length === 0 ? (
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', padding: '1rem' }}>
                    🛡️ No pending focus infractions detected.
                  </p>
                ) : (
                  alerts.filter(a => !a.verified).map(alert => (
                    <div 
                      key={alert.id}
                      className="card"
                      style={{ 
                        padding: '0.75rem', 
                        background: 'rgba(239, 68, 68, 0.05)', 
                        border: '1px solid rgba(239, 68, 68, 0.25)',
                        borderRadius: '10px'
                      }}
                    >
                      <div className="flex-between">
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{alert.timestamp}</span>
                        <span className="badge badge-distracted" style={{ fontSize: '0.55rem', padding: '0.1rem 0.3rem' }}>
                          Warning
                        </span>
                      </div>
                      <h4 style={{ fontSize: '0.85rem', fontWeight: 700, margin: '0.25rem 0', color: 'var(--white)' }}>
                        {alert.student}
                      </h4>
                      <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                        {alert.message}
                      </p>
                      
                      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                        <button 
                          className="btn btn-success" 
                          style={{ padding: '0.2rem 0.5rem', fontSize: '0.65rem', borderRadius: '4px', gap: '0.2rem' }}
                          onClick={() => verifyAlert(alert.id)}
                        >
                          <Check size={12} />
                          Acknowledge Event
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Student seat details inspector */}
            <div className="card" style={{ background: 'rgba(9, 13, 22, 0.65)', minHeight: '260px' }}>
              {!selectedStudent ? (
                <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
                  <Info size={32} style={{ marginBottom: '0.75rem', color: 'var(--text-muted)' }} />
                  <h4>Select a seat to inspect student details</h4>
                  <p style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>Click on any occupied seat in the grid mapping to display stats.</p>
                </div>
              ) : selectedStudent.isPlaceholder ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div className="flex-between">
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Inspect Seat {selectedStudent.seat}</h3>
                    <span className="badge badge-excused">Empty Seat</span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    No student has currently scanned into this seat location for the active lecture.
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  
                  {/* Name and avatar header */}
                  <div className="flex-between">
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '1.5rem' }}>{selectedStudent.avatar}</span>
                        <div>
                          <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{selectedStudent.name}</h3>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{selectedStudent.email}</span>
                        </div>
                      </div>
                    </div>
                    <span style={{ fontSize: '1rem', fontWeight: 'bold', color: 'var(--gold)', background: 'rgba(255,255,255,0.05)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                      Seat {selectedStudent.seat}
                    </span>
                  </div>

                  {/* Dynamic Status Toggle */}
                  <div className="form-group" style={{ margin: 0 }}>
                    <label>Override Status Manually</label>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      {['Present', 'Absent', 'Distracted'].map(statusOption => (
                        <button 
                          key={statusOption}
                          className={`btn ${
                            selectedStudent.status === statusOption ? 
                            (statusOption === 'Present' ? 'btn-success' : statusOption === 'Distracted' ? 'btn-gold' : 'btn-danger') : 
                            'btn-outline'
                          }`}
                          style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', flex: 1 }}
                          onClick={() => {
                            manualLecturerToggle(selectedStudent.id, statusOption);
                            setSelectedStudent(prev => ({ ...prev, status: statusOption }));
                          }}
                        >
                          {statusOption}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Telemetry charts meters */}
                  {selectedStudent.status !== 'Absent' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      
                      {/* Live Gaze Tracking rating */}
                      <div>
                        <div className="flex-between" style={{ fontSize: '0.75rem', marginBottom: '0.25rem' }}>
                          <span style={{ color: 'var(--text-secondary)' }}>Camera Gaze Focus Score</span>
                          <span style={{ color: selectedStudent.focusScore < 60 ? 'var(--gold)' : 'var(--green)', fontWeight: 'bold' }}>
                            {selectedStudent.focusScore}%
                          </span>
                        </div>
                        <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{ width: `${selectedStudent.focusScore}%`, height: '100%', background: selectedStudent.focusScore < 60 ? 'var(--gold)' : 'var(--green)', transition: 'all 0.5s' }} />
                        </div>
                      </div>

                      {/* App policy tracker */}
                      <div>
                        <div className="flex-between" style={{ fontSize: '0.75rem', marginBottom: '0.25rem' }}>
                          <span style={{ color: 'var(--text-secondary)' }}>App Policy Compliance</span>
                          <span style={{ color: 'var(--white)', fontWeight: 'bold' }}>{selectedStudent.appScore}%</span>
                        </div>
                        <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{ width: `${selectedStudent.appScore}%`, height: '100%', background: 'var(--primary-light)', transition: 'all 0.5s' }} />
                        </div>
                      </div>

                      {selectedStudent.distractionReason && (
                        <div style={{ background: 'rgba(250,204,21,0.06)', border: '1px solid rgba(250,204,21,0.25)', borderRadius: '8px', padding: '0.6rem', fontSize: '0.7rem', color: 'var(--gold)' }}>
                          <strong>Distraction Flag:</strong> {selectedStudent.distractionReason}
                        </div>
                      )}

                    </div>
                  )}

                </div>
              )}
            </div>

          </div>

        </div>
      )}

      {activeTab === 'attendance' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '2rem' }}>
          
          {/* QR Generator dashboard controls */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <QrCode size={22} style={{ color: 'var(--gold)' }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Secure Lecture QR Generation</h3>
            </div>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.5' }}>
              Generate a high-security visual academic QR code displayed on the classroom smartboard. Students scan this QR code via their personal devices to log attendance mapped to their seat coordinates.
            </p>

            <div style={{ padding: '1rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--card-border)', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
              
              {/* Spinner QR Preview box */}
              <div 
                style={{ 
                  width: '140px', 
                  height: '140px', 
                  background: 'var(--white)', 
                  border: '4px solid var(--primary-light)', 
                  borderRadius: '12px', 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center',
                  cursor: 'pointer',
                  position: 'relative'
                }}
                onClick={() => setShowQRModal(true)}
              >
                {/* Simulated circular QR vector grid */}
                <div style={{ width: '110px', height: '110px', backgroundImage: 'radial-gradient(#000 30%, transparent 35%), radial-gradient(#000 30%, transparent 35%)', backgroundSize: '10px 10px', backgroundPosition: '0 0, 5px 5px', opacity: 0.8 }} />
                <div style={{ position: 'absolute', top: '10px', left: '10px', width: '30px', height: '30px', border: '4px solid #000' }} />
                <div style={{ position: 'absolute', top: '10px', right: '10px', width: '30px', height: '30px', border: '4px solid #000' }} />
                <div style={{ position: 'absolute', bottom: '10px', left: '10px', width: '30px', height: '30px', border: '4px solid #000' }} />
              </div>

              <div style={{ textAlign: 'center' }}>
                <span className="badge badge-present" style={{ fontSize: '0.7rem' }}>
                  Rotating Code: {qrCodeData}
                </span>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                  Refreshes automatically in <strong style={{ color: 'var(--gold)' }}>{qrExpiresIn}s</strong>
                </p>
              </div>

              <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => setShowQRModal(true)}>
                Display Large Smartboard QR
              </button>

            </div>
          </div>

          {/* Power outage override dashboard scheduler */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Zap size={22} style={{ color: 'var(--gold)' }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Power Cut & Infrastructure Outages</h3>
            </div>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.5' }}>
              In the event of localized infrastructure failures, smartboard shutdowns, or blackouts, trigger an override window. This records all scanned mapping updates during this window as **Excused** and deactivates camera policies.
            </p>

            <form onSubmit={handleOutageSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              
              <div className="grid-cols-2" style={{ gap: '1rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>Window Start Time</label>
                  <input 
                    type="time" 
                    value={outageStart}
                    onChange={(e) => setOutageStart(e.target.value)}
                    className="form-input" 
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>Window End Time</label>
                  <input 
                    type="time" 
                    value={outageEnd}
                    onChange={(e) => setOutageEnd(e.target.value)}
                    className="form-input" 
                  />
                </div>
              </div>

              {powerCut.active ? (
                <button type="submit" className="btn btn-danger" style={{ padding: '0.9rem', gap: '0.5rem' }}>
                  <Zap size={16} />
                  Terminate Power Outage Override
                </button>
              ) : (
                <button type="submit" className="btn btn-gold" style={{ padding: '0.9rem', gap: '0.5rem' }}>
                  <Zap size={16} fill="var(--bg-darker)" />
                  Activate Offline Window Override
                </button>
              )}

            </form>

            {powerCut.active && (
              <div className="card" style={{ background: 'rgba(250,204,21,0.03)', border: '1px solid rgba(250,204,21,0.2)' }}>
                <h4 style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--gold)' }}>⚠️ Override Window Active</h4>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '0.25rem', lineHeight: '1.3' }}>
                  Enrolled student log records captured from {powerCut.start} to {powerCut.end} will be marked as Excused. Focus policies are bypassed.
                </p>
              </div>
            )}
          </div>

        </div>
      )}

      {activeTab === 'focus' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '2rem' }}>
          
          {/* Allowed applications policies panel */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Settings size={22} style={{ color: 'var(--primary-light)' }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Allowed Applications Registry</h3>
            </div>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.5' }}>
              Add authorized tools, IDEs, and research tabs allowed during this module. Active students running unregistered tools (like Spotify or Discord) will be flagged on the live seat map and reported to parents.
            </p>

            <form onSubmit={handleAppSubmit} style={{ display: 'flex', gap: '0.5rem' }}>
              <input 
                type="text" 
                value={newAppName}
                onChange={(e) => setNewAppName(e.target.value)}
                placeholder="e.g. Android Studio, Firefox" 
                className="form-input" 
                style={{ flex: 1 }}
              />
              <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem' }}>
                <Plus size={16} />
              </button>
            </form>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <h4 style={{ fontSize: '0.9rem', color: 'var(--white)' }}>Registered Applications Policy</h4>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.25rem' }}>
                {allowedApps.map(app => (
                  <div 
                    key={app.id}
                    className="flex-between"
                    style={{ 
                      padding: '0.6rem 0.85rem', 
                      background: app.allowed ? 'rgba(255,255,255,0.03)' : 'rgba(239, 68, 68, 0.05)', 
                      border: `1px solid ${app.allowed ? 'var(--card-border)' : 'rgba(239, 68, 68, 0.2)'}`,
                      borderRadius: '8px' 
                    }}
                  >
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: app.allowed ? 'var(--white)' : 'rgba(255,255,255,0.5)' }}>
                      {app.name}
                    </span>

                    {app.allowed ? (
                      <button 
                        className="btn btn-outline"
                        style={{ padding: '0.2rem 0.5rem', fontSize: '0.65rem', color: 'var(--red)', border: 'none' }}
                        onClick={() => blockApp(app.id)}
                      >
                        <Ban size={12} style={{ marginRight: '0.2rem' }} />
                        Block App
                      </button>
                    ) : (
                      <span className="badge badge-absent" style={{ fontSize: '0.6rem' }}>
                        Blocked
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AI Focus trends rules documentation */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Info size={22} style={{ color: 'var(--gold)' }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>AI camera gaze Calibration</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
              <p>
                The Classroom Guardian LMS uses client-side face mesh pipelines via TensorFlow and MediaPipe to calculate student attentiveness in active lecture blocks.
              </p>
              
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '0.85rem', borderRadius: '8px', border: '1px solid var(--card-border)' }}>
                <h5 style={{ color: 'var(--white)', fontWeight: 'bold', marginBottom: '0.4rem' }}>Eye Aspect Ratio (EAR) Threshold</h5>
                <p style={{ fontSize: '0.75rem' }}>
                  If EAR stays below <strong style={{ color: 'var(--gold)' }}>0.18</strong> for more than 4 consecutive seconds (indicating sleeping or eye fatigue), a distraction incident is flagged.
                </p>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '0.85rem', borderRadius: '8px', border: '1px solid var(--card-border)' }}>
                <h5 style={{ color: 'var(--white)', fontWeight: 'bold', marginBottom: '0.4rem' }}>Head Pose Yaw/Pitch (Vectors)</h5>
                <p style={{ fontSize: '0.75rem' }}>
                  If head yaw turns past <strong style={{ color: 'var(--gold)' }}>15°</strong> or pitch skews past <strong style={{ color: 'var(--gold)' }}>12°</strong> (indicating looking sideways or downward at external devices), focus alerts trigger.
                </p>
              </div>

              <p style={{ fontStyle: 'italic', fontSize: '0.75rem' }}>
                Note: In compliance with student privacy rights, camera streams are scanned client-side. Bounding coordinates are compiled to aggregate scores without transferring video data to cloud servers.
              </p>
            </div>
          </div>

        </div>
      )}

      {activeTab === 'reports' && (
        <div className="grid-cols-1" style={{ gap: '2rem' }}>
          
          {/* CSV export details bar */}
          <div className="card flex-between" style={{ padding: '1.5rem', background: 'rgba(21, 29, 48, 0.85)' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Academic Performance Analytics Reports</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                Export structured classroom databases containing attendance scores, focus averages, app infraction records, and exam eligibility matrices.
              </p>
            </div>
            
            <button className="btn btn-success" onClick={triggerCSVExport}>
              <FileSpreadsheet size={16} />
              Export Engagement (.CSV)
            </button>
          </div>

          {/* Detailed tabular statistics */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Course Exam Eligibility Matrix</h3>
            
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Student Name</th>
                    <th>Email Address</th>
                    <th>Attendance %</th>
                    <th>Average Focus %</th>
                    <th>Allowed Apps Compliance</th>
                    <th>Exam Status</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map(s => {
                    const sLogs = logs.filter(l => l.studentEmail.toLowerCase() === s.email.toLowerCase());
                    const sPresent = sLogs.filter(l => l.present === 'Present' || l.present === 'Excused').length;
                    const att = sLogs.length > 0 
                      ? Math.round((sPresent / sLogs.length) * 100)
                      : (s.email.toLowerCase() === 'alex.j@university.edu' ? 94 : s.status === 'Absent' ? 78 : 88);
                    const eligible = att >= 80;
                    return (
                      <tr key={s.id}>
                        <td style={{ fontWeight: 'bold', color: 'var(--white)' }}>
                          <span style={{ marginRight: '0.5rem' }}>{s.avatar}</span>
                          {s.name}
                        </td>
                        <td>{s.email}</td>
                        <td style={{ fontWeight: 'bold' }}>{att}%</td>
                        <td style={{ fontWeight: 'bold', color: s.focusScore < 60 && s.status !== 'Absent' ? 'var(--gold)' : 'inherit' }}>
                          {s.status === 'Absent' ? '—' : `${s.focusScore}%`}
                        </td>
                        <td>
                          {s.status === 'Absent' ? '—' : `${s.appScore}%`}
                        </td>
                        <td>
                          <span className={`badge ${eligible ? 'badge-present' : 'badge-absent'}`} style={{ fontSize: '0.65rem' }}>
                            {eligible ? 'Eligible' : 'Ineligible'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* SECURE SMARTBOARD QR OVERLAY MODAL */}
      {showQRModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(9, 13, 22, 0.9)', display: 'flex', justifyContent: 'center', alignItems: 'center', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}>
          <div className="card" style={{ width: '460px', padding: '2.5rem', textAlign: 'center', position: 'relative', border: '1px solid rgba(255,255,255,0.12)' }}>
            
            <button 
              className="btn btn-outline" 
              style={{ position: 'absolute', top: '16px', right: '16px', padding: '0.35rem', border: 'none', borderRadius: '50%' }}
              onClick={() => setShowQRModal(false)}
            >
              <X size={18} />
            </button>

            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.5rem' }}>🛡️ Lecture Attendance Mapping QR</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '2rem' }}>
              Course Code: **CS-402 Advanced Database Engineering**
            </p>

            <div style={{ width: '260px', height: '260px', background: '#FFFFFF', padding: '1.5rem', borderRadius: '16px', margin: '0 auto 1.5rem', border: '4px solid var(--primary-light)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
              {/* Spinning scanning reticle wrapper */}
              <div style={{ position: 'absolute', inset: '10px', border: '2px dashed var(--primary-light)', borderRadius: '50%', animation: 'pulse-slow 4s infinite linear' }} />
              
              {/* Inner details grid mockup */}
              <div style={{ width: '200px', height: '200px', backgroundImage: 'radial-gradient(#000 30%, transparent 35%), radial-gradient(#000 30%, transparent 35%)', backgroundSize: '12px 12px', backgroundPosition: '0 0, 6px 6px', opacity: 0.85 }} />
              <div style={{ position: 'absolute', top: '20px', left: '20px', width: '50px', height: '50px', border: '6px solid #000' }} />
              <div style={{ position: 'absolute', top: '20px', right: '20px', width: '50px', height: '50px', border: '6px solid #000' }} />
              <div style={{ position: 'absolute', bottom: '20px', left: '20px', width: '50px', height: '50px', border: '6px solid #000' }} />
            </div>

            <div style={{ display: 'inline-flex', flexDirection: 'column', gap: '0.4rem' }}>
              <span className="badge badge-present" style={{ fontSize: '0.75rem', padding: '0.25rem 0.75rem' }}>
                Secure Token: {qrCodeData}
              </span>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                QR rotating in <strong style={{ color: 'var(--gold)' }}>{qrExpiresIn}s</strong>
              </p>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
