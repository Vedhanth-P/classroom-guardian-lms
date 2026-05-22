import React, { useEffect, useState } from 'react';
import { LMSProvider, useLMS } from './context/LMSContext';
import Navigation from './components/Navigation';
import PortalSelector from './components/PortalSelector';
import AuthPage from './components/AuthPage';
import StudentPortal from './portals/StudentPortal';
import LecturerPortal from './portals/LecturerPortal';
import ParentPortal from './portals/ParentPortal';
import { AlertTriangle, BellRing, Sparkles } from 'lucide-react';

function LMSContentWrapper() {
  const { activePortal, alerts, currentUser } = useLMS();
  const [toastAlert, setToastAlert] = useState(null);

  // Real-time notification trigger simulation
  // Triggers a beautiful slide-in toast when a new distraction occurs
  useEffect(() => {
    if (alerts.length === 0) return;
    const latestAlert = alerts[0];
    
    // Only display if the alert is brand new (less than 5 seconds old) and unverified
    const isRecent = !latestAlert.verified;
    if (isRecent) {
      setToastAlert(latestAlert);
      
      const timer = setTimeout(() => {
        setToastAlert(null);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [alerts]);

  const renderActivePortal = () => {
    if (activePortal === 'selector') {
      return <PortalSelector />;
    }

    if (!currentUser) {
      return <AuthPage />;
    }

    switch (activePortal) {
      case 'student':
        return <StudentPortal />;
      case 'lecturer':
        return <LecturerPortal />;
      case 'parent':
        return <ParentPortal />;
      default:
        return <PortalSelector />;
    }
  };

  return (
    <div className="app-container">
      
      {/* Dynamic Navigation Header */}
      <Navigation />

      {/* Main Responsive Grid Layout */}
      <main className="main-content">
        
        {/* Render Active View */}
        {renderActivePortal()}

      </main>

      {/* Floating System-Wide Real-Time Socket.IO Alert Simulation */}
      {toastAlert && (
        <div className="alert-toast" style={{ borderLeft: '4px solid var(--gold)' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
            <div style={{ padding: '0.4rem', borderRadius: '50%', background: 'var(--gold-glow)', color: 'var(--gold)', display: 'flex', flexShrink: 0 }}>
              <BellRing size={16} className="float" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <strong style={{ fontSize: '0.8rem', color: 'var(--white)' }}>
                  {activePortal === 'parent' ? '🛡️ Guardian Notification' : '📡 AI Focus System'}
                </strong>
                <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>Just now</span>
              </div>
              <h5 style={{ fontSize: '0.75rem', fontWeight: 700, margin: '0.2rem 0', color: 'var(--white)' }}>
                {toastAlert.student}
              </h5>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', lineHeight: '1.3' }}>
                {toastAlert.message}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Standard Footer */}
      <footer style={{ borderTop: '1px solid var(--card-border)', background: 'rgba(9, 13, 22, 0.4)', padding: '1.25rem 2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.75rem', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          🛡️ Classroom Guardian LMS © 2026. Made with Premium Vanilla CSS & React.
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <span>Version 1.0.4</span>
          <span style={{ color: 'var(--green)' }}>● Systems Fully Encrypted</span>
        </div>
      </footer>

    </div>
  );
}

export default function App() {
  return (
    <LMSProvider>
      <LMSContentWrapper />
    </LMSProvider>
  );
}
