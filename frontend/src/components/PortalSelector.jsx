import React from 'react';
import { useLMS } from '../context/LMSContext';
import { Shield, BookOpen, Monitor, Users, Compass, Award } from 'lucide-react';

export default function PortalSelector() {
  const { setActivePortal } = useLMS();

  return (
    <div className="portal-selector-container float-in" style={{ padding: '3rem 1rem', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Premium Hero Title */}
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <div className="academic-logo float" style={{ justifyContent: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <Shield size={44} style={{ color: 'var(--gold)' }} />
          <span style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.02em', background: 'linear-gradient(135deg, #FFF, #cbd5e1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            CLASSROOM GUARDIAN
          </span>
        </div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 500, color: 'var(--gold)', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '1rem' }}>
          Next-Generation Academic Engagement & Focus LMS
        </h2>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '640px', margin: '0 auto', fontSize: '1.05rem', lineHeight: '1.6' }}>
          A secure, high-fidelity university learning platform connecting students, lecturers, and parents. Integrates automated QR attendance tracking, AI-camera focus metrics, and real-time parent notifications.
        </p>
      </div>

      {/* 3 Portals Option Grid */}
      <div className="grid-cols-3" style={{ gap: '2rem', marginBottom: '4rem' }}>
        
        {/* STUDENT PORTAL CARD */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between', padding: '2.5rem 2rem', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-20px', right: '-20px', fontSize: '6rem', opacity: 0.04, color: 'var(--white)' }}>👨‍🎓</div>
          <div>
            <div style={{ width: '56px', height: '56px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
              <BookOpen size={28} style={{ color: 'var(--primary-light)' }} />
            </div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--white)' }}>Student Portal</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.5', marginBottom: '2rem' }}>
              Verify seat mapping assignments, scan active lecture QRs, monitor your gaze focus rating, review personalized AI learning cards, and track badges.
            </p>
          </div>
          <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => setActivePortal('student')}>
            Enter Student Portal
          </button>
        </div>

        {/* LECTURER PORTAL CARD */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between', padding: '2.5rem 2rem', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-20px', right: '-20px', fontSize: '6rem', opacity: 0.04, color: 'var(--white)' }}>👨‍🏫</div>
          <div>
            <div style={{ width: '56px', height: '56px', borderRadius: '12px', background: 'rgba(250, 204, 21, 0.1)', border: '1px solid rgba(250, 204, 21, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
              <Monitor size={28} style={{ color: 'var(--gold)' }} />
            </div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--white)' }}>Lecturer Portal</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.5', marginBottom: '2rem' }}>
              Monitor student engagement grids, generate dynamic QR codes, review low-focus camera alerts, customize allowed apps, and manage offline power outages.
            </p>
          </div>
          <button className="btn btn-gold" style={{ width: '100%' }} onClick={() => setActivePortal('lecturer')}>
            Enter Lecturer Portal
          </button>
        </div>

        {/* PARENT PORTAL CARD */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between', padding: '2.5rem 2rem', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-20px', right: '-20px', fontSize: '6rem', opacity: 0.04, color: 'var(--white)' }}>👪</div>
          <div>
            <div style={{ width: '56px', height: '56px', borderRadius: '12px', background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
              <Users size={28} style={{ color: 'var(--green)' }} />
            </div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--white)' }}>Parent Portal</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.5', marginBottom: '2rem' }}>
              Review daily presence records, monitor weekly focus charts, get real-time distraction notifications, and chat securely with course lecturers.
            </p>
          </div>
          <button className="btn btn-success" style={{ width: '100%' }} onClick={() => setActivePortal('parent')}>
            Enter Parent Portal
          </button>
        </div>

      </div>

      {/* System Statistics Panel */}
      <div className="card" style={{ padding: '2rem', background: 'rgba(9, 13, 22, 0.4)' }}>
        <h4 style={{ fontSize: '1.1rem', color: 'var(--white)', marginBottom: '1.5rem', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          🛡️ Live Active Node Statistics
        </h4>
        <div className="grid-cols-4" style={{ textAlign: 'center', gap: '2rem' }}>
          <div>
            <h5 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary-light)', marginBottom: '0.25rem' }}>98.4%</h5>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Avg Attendance</p>
          </div>
          <div>
            <h5 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--gold)', marginBottom: '0.25rem' }}>92.8%</h5>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Focus Efficiency</p>
          </div>
          <div>
            <h5 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--green)', marginBottom: '0.25rem' }}>&lt; 24ms</h5>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Websocket Latency</p>
          </div>
          <div>
            <h5 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--white)', marginBottom: '0.25rem' }}>100%</h5>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Secure E2EE Logs</p>
          </div>
        </div>
      </div>

    </div>
  );
}
