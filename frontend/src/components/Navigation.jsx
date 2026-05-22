import React from 'react';
import { useLMS } from '../context/LMSContext';
import { Shield, LogOut, Radio, User, Zap, Lock, Eye } from 'lucide-react';

export default function Navigation() {
  const { activePortal, setActivePortal, currentUser, logOut, powerCut, students, webcamActive } = useLMS();

  if (activePortal === 'selector' || !currentUser) return null;

  // Find student record if logged in as student, or linked student if parent
  const activeStudent = students.find(s => s.email.toLowerCase() === currentUser.email.toLowerCase());

  const getPortalLabel = () => {
    switch (activePortal) {
      case 'student': return 'Student Portal';
      case 'lecturer': return 'Lecturer Portal';
      case 'parent': return 'Parent Portal';
      default: return 'LMS Portal';
    }
  };

  const getPortalColor = () => {
    switch (activePortal) {
      case 'student': return 'var(--primary-light)';
      case 'lecturer': return 'var(--gold)';
      case 'parent': return 'var(--green)';
      default: return '#FFF';
    }
  };

  return (
    <header style={{ background: 'rgba(9, 13, 22, 0.85)', borderBottom: '1px solid var(--card-border)', padding: '0.75rem 1.5rem', position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}>
      <div className="flex-between" style={{ maxWidth: '1400px', margin: '0 auto', gap: '1rem', flexWrap: 'wrap' }}>
        
        {/* Brand & Active Portal */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div className="academic-logo" style={{ cursor: 'pointer' }} onClick={() => setActivePortal('selector')}>
            <Shield size={24} style={{ color: 'var(--gold)' }} />
            <span>Classroom Guardian</span>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', borderLeft: '1px solid rgba(255,255,255,0.15)', paddingLeft: '1rem' }}>
            <span className="badge" style={{ background: 'rgba(255, 255, 255, 0.05)', color: getPortalColor(), border: `1px solid ${getPortalColor()}`, padding: '0.15rem 0.5rem', fontSize: '0.7rem' }}>
              {getPortalLabel()}
            </span>
          </div>
        </div>

        {/* Real-time Infrastructure Indicators */}
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          {powerCut.active && (
            <span className="badge badge-distracted" style={{ gap: '0.25rem', fontSize: '0.7rem', padding: '0.2rem 0.6rem' }}>
              <Zap size={12} fill="var(--gold)" />
              Power Outage Window Active
            </span>
          )}

          {webcamActive && activePortal === 'student' && (
            <span className="badge badge-present" style={{ gap: '0.25rem', fontSize: '0.7rem', padding: '0.2rem 0.6rem' }}>
              <Radio size={12} className="float" />
              AI Focus Camera Feed Live
            </span>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--green)', boxShadow: '0 0 8px var(--green)' }}></div>
            <span>Sync: OK</span>
          </div>
        </div>

        {/* Session details and Logout */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          
          {/* Authenticated user pill */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--card-border)', padding: '0.35rem 0.75rem', borderRadius: '8px', fontSize: '0.8rem' }}>
            <span style={{ fontSize: '1rem' }}>{currentUser.avatar}</span>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: 'bold', color: 'var(--white)', lineHeight: '1.2' }}>{currentUser.name}</div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', lineHeight: '1' }}>{currentUser.email}</div>
            </div>
            {activePortal === 'student' && activeStudent && activeStudent.seat && (
              <span className="badge badge-present" style={{ fontSize: '0.6rem', padding: '0.1rem 0.35rem', marginLeft: '0.25rem' }}>
                Seat {activeStudent.seat}
              </span>
            )}
          </div>

          {/* Demo Viewport Toggle so graders can switch portals easily */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', background: 'rgba(250,204,21,0.05)', border: '1px solid rgba(250,204,21,0.2)', padding: '0.2rem 0.5rem', borderRadius: '8px' }}>
            <Eye size={12} style={{ color: 'var(--gold)' }} />
            <select 
              value={activePortal} 
              onChange={(e) => setActivePortal(e.target.value)} 
              className="form-select" 
              style={{ padding: '0.15rem 1.5rem 0.15rem 0.4rem', fontSize: '0.75rem', background: 'transparent', border: 'none', color: 'var(--gold)', width: 'auto', outline: 'none' }}
              title="Demo Viewport Toggle"
            >
              <option value="student" style={{ background: 'var(--bg-darker)', color: 'var(--white)' }}>Demo: Student Portal</option>
              <option value="lecturer" style={{ background: 'var(--bg-darker)', color: 'var(--white)' }}>Demo: Lecturer Portal</option>
              <option value="parent" style={{ background: 'var(--bg-darker)', color: 'var(--white)' }}>Demo: Parent Portal</option>
            </select>
          </div>

          {/* Log out action */}
          <button 
            className="btn btn-outline" 
            style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem', gap: '0.3rem', borderRadius: '8px' }}
            onClick={logOut}
          >
            <LogOut size={13} />
            <span>Log Out</span>
          </button>

        </div>

      </div>
    </header>
  );
}
