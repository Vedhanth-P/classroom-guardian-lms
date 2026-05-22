import React, { useState } from 'react';
import { useLMS } from '../context/LMSContext';
import { Shield, Mail, Lock, User, Radio, Award, AlertCircle, RefreshCw } from 'lucide-react';

export default function AuthPage() {
  const { signIn, signUp, signInWithGoogle, setActivePortal } = useLMS();

  // Tab State: login or register
  const [authMode, setAuthMode] = useState('login'); // login, register
  
  // Form Input States
  const [role, setRole] = useState('student'); // student, lecturer, parent
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  
  // Custom alerts and loader states
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Google Single Sign-on Popup states
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [googleStep, setGoogleStep] = useState('picker'); // picker, loading, success
  const [selectedGoogleEmail, setSelectedGoogleEmail] = useState('');
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');
  const [customGoogleName, setCustomGoogleName] = useState('');

  const handleCredentialsSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    setTimeout(() => {
      try {
        if (authMode === 'login') {
          signIn(email, password);
        } else {
          // Signup rules: student and lecturer must end with university.edu
          if (role !== 'parent' && !email.toLowerCase().endsWith('@university.edu')) {
            throw new Error("Student and Lecturer accounts require a valid college email address ending with @university.edu.");
          }
          signUp(name, email, password, role);
        }
      } catch (err) {
        setErrorMsg(err.message || "An authentication error occurred.");
        setLoading(false);
      }
    }, 1200);
  };

  const handleGoogleAccountSelect = (googleEmail, googleName) => {
    setSelectedGoogleEmail(googleEmail);
    setGoogleStep('loading');

    setTimeout(() => {
      setGoogleStep('success');
      setTimeout(() => {
        signInWithGoogle(googleEmail, googleName, role);
        setShowGoogleModal(false);
        setGoogleStep('picker');
      }, 1000);
    }, 1500);
  };

  const handleCustomGoogleSubmit = (e) => {
    e.preventDefault();
    if (!customGoogleEmail || !customGoogleName) return;

    if (role !== 'parent' && !customGoogleEmail.toLowerCase().endsWith('@university.edu')) {
      alert("Registration failed. Students & Lecturers require college mail domain ending in @university.edu");
      return;
    }

    handleGoogleAccountSelect(customGoogleEmail, customGoogleName);
  };

  return (
    <div className="auth-page-container float-in" style={{ maxWidth: '960px', margin: '2rem auto', display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: '2rem', minHeight: '520px' }}>
      
      {/* LEFT COLUMN: Academic Shield and Stats branding */}
      <div className="card" style={{ background: 'linear-gradient(135deg, var(--bg-dark), var(--primary))', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '2.5rem', border: '1px solid rgba(59,130,246,0.2)' }}>
        
        <div>
          <div className="academic-logo float" style={{ gap: '0.6rem', marginBottom: '2rem' }}>
            <Shield size={32} style={{ color: 'var(--gold)' }} />
            <span style={{ fontSize: '1.4rem' }}>Classroom Guardian</span>
          </div>

          <h3 style={{ fontSize: '1.5rem', fontWeight: 800, lineHeight: '1.4', marginBottom: '1rem', color: 'var(--white)' }}>
            Intelligent Engagement, Focus, & Performance LMS
          </h3>
          
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', lineHeight: '1.6' }}>
            Integrating facial landmark detection algorithms, localized power outage contingencies, and multi-tier portal synchronizations to optimize university instruction.
          </p>
        </div>

        {/* Feature Checklists */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', margin: '2rem 0' }}>
          {[
            'E2EE Gaze Gimmick Vector Telemetry',
            'Dynamic seat matrix mapping grids',
            'Real-Time WebSocket parent push alerts',
            'Manual Power-Cut classroom contingencies'
          ].map((feat, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--white)' }}>
              <span style={{ color: 'var(--gold)' }}>✔</span>
              <span>{feat}</span>
            </div>
          ))}
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem', fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)' }}>
          🔐 Certified university encryption standard. ISO/IEC 27001 compliant databases.
        </div>

      </div>

      {/* RIGHT COLUMN: Authentication form console */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '2.5rem' }}>
        
        {/* Tab Selection */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--card-border)', paddingBottom: '0.5rem' }}>
          <button 
            className="btn" 
            style={{ 
              flex: 1, 
              background: 'none', 
              color: authMode === 'login' ? 'var(--white)' : 'var(--text-secondary)',
              borderBottom: authMode === 'login' ? '2px solid var(--primary-light)' : 'none',
              borderRadius: 0,
              fontSize: '0.9rem'
            }}
            onClick={() => { setAuthMode('login'); setErrorMsg(''); }}
          >
            Sign In
          </button>
          <button 
            className="btn" 
            style={{ 
              flex: 1, 
              background: 'none', 
              color: authMode === 'register' ? 'var(--white)' : 'var(--text-secondary)',
              borderBottom: authMode === 'register' ? '2px solid var(--primary-light)' : 'none',
              borderRadius: 0,
              fontSize: '0.9rem'
            }}
            onClick={() => { setAuthMode('register'); setErrorMsg(''); }}
          >
            Create Account
          </button>
        </div>

        {/* Error notification banner */}
        {errorMsg && (
          <div style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '8px', padding: '0.75rem', display: 'flex', gap: '0.5rem', color: 'var(--red)', fontSize: '0.75rem' }}>
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Auth Credentials Form */}
        <form onSubmit={handleCredentialsSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          <div className="form-group" style={{ marginBottom: '0.5rem' }}>
            <label>Select Portal Portal Access</label>
            <div style={{ display: 'flex', gap: '0.3rem' }}>
              {[
                { id: 'student', name: 'Student' },
                { id: 'lecturer', name: 'Lecturer' },
                { id: 'parent', name: 'Parent' }
              ].map(r => (
                <button 
                  key={r.id}
                  type="button"
                  className={`btn ${role === r.id ? 'btn-primary' : 'btn-outline'}`}
                  style={{ flex: 1, padding: '0.4rem 0.5rem', fontSize: '0.75rem' }}
                  onClick={() => setRole(r.id)}
                >
                  {r.name}
                </button>
              ))}
            </div>
          </div>

          {authMode === 'register' && (
            <div className="form-group">
              <label>Full Profile Name</label>
              <div style={{ position: 'relative' }}>
                <User size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Johnson" 
                  className="form-input" 
                  style={{ paddingLeft: '2.5rem' }}
                  required
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label>{role === 'parent' ? 'Email Address' : 'College Email (@university.edu)'}</label>
            <div style={{ position: 'relative' }}>
              <Mail size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={role === 'parent' ? "e.g. parent@mail.com" : "e.g. alex.j@university.edu"}
                className="form-input" 
                style={{ paddingLeft: '2.5rem' }}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Security Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                className="form-input" 
                style={{ paddingLeft: '2.5rem' }}
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', padding: '0.9rem', fontSize: '0.9rem', gap: '0.6rem', marginTop: '0.5rem' }}
            disabled={loading}
          >
            {loading ? (
              <>
                <RefreshCw size={16} className="float" />
                <span>Verifying credentials...</span>
              </>
            ) : (
              <span>{authMode === 'login' ? 'Sign In Securely' : 'Register Portal Profile'}</span>
            )}
          </button>

        </form>

        {/* Separator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--card-border)' }}></div>
          <span>OR SECURE SINGLE SIGN-ON</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--card-border)' }}></div>
        </div>

        {/* Google Sign-in button */}
        <button 
          type="button" 
          className="btn btn-outline" 
          style={{ width: '100%', padding: '0.85rem', gap: '0.75rem', border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.01)' }}
          onClick={() => setShowGoogleModal(true)}
        >
          <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
          </svg>
          <span style={{ fontWeight: '600' }}>Continue with Google Account</span>
        </button>

      </div>

      {/* simulated GOOGLE AUTH POPUP MODAL DIALOG */}
      {showGoogleModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 2000, background: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div className="card" style={{ width: '420px', padding: '2.5rem', background: '#FFFFFF', color: '#1f2937', position: 'relative', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
            
            {/* Close */}
            <button 
              style={{ position: 'absolute', top: '16px', right: '16px', border: 'none', background: 'none', fontSize: '1.25rem', cursor: 'pointer', color: '#6b7280' }}
              onClick={() => { setShowGoogleModal(false); setGoogleStep('picker'); }}
            >
              ✕
            </button>

            {/* Google Brand Logo */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
              <svg viewBox="0 0 24 24" width="36" height="36" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
              </svg>
            </div>

            {googleStep === 'picker' && (
              <div style={{ textAlign: 'center' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.25rem' }}>Sign In with Google</h3>
                <p style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '1.5rem' }}>Choose an account mapped to your university profile</p>

                {/* Account list options */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem', textAlign: 'left' }}>
                  {[
                    { email: 'alex.j@university.edu', name: 'Alex Johnson', label: 'Student Profile' },
                    { email: 'ronald.v@university.edu', name: 'Prof. Ronald Vance', label: 'Lecturer Profile' },
                    { email: 'robert.j@parent.com', name: 'Robert Johnson', label: 'Parent Profile' }
                  ].map(profile => (
                    <div 
                      key={profile.email}
                      style={{ padding: '0.75rem 1rem', border: '1px solid #e5e7eb', borderRadius: '8px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'all 0.2s' }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFF'}
                      onClick={() => handleGoogleAccountSelect(profile.email, profile.name)}
                    >
                      <div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#111827' }}>{profile.name}</div>
                        <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{profile.email}</div>
                      </div>
                      <span style={{ fontSize: '0.65rem', background: '#eff6ff', color: '#1e40af', padding: '0.15rem 0.4rem', borderRadius: '4px', fontWeight: 'bold' }}>
                        {profile.label}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Form to enter a custom Google account */}
                <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: '1rem', textAlign: 'left' }}>
                  <p style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#4b5563', marginBottom: '0.5rem' }}>Use another Google Account</p>
                  
                  <form onSubmit={handleCustomGoogleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <input 
                      type="text" 
                      placeholder="Your Full Name (e.g. Lisa Vance)"
                      value={customGoogleName}
                      onChange={(e) => setCustomGoogleName(e.target.value)}
                      style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.8rem', background: '#FFF', color: '#000' }}
                      required
                    />
                    <input 
                      type="email" 
                      placeholder={role === 'parent' ? "e.g. parent@gmail.com" : "College Gmail (ends in @university.edu)"}
                      value={customGoogleEmail}
                      onChange={(e) => setCustomGoogleEmail(e.target.value)}
                      style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.8rem', background: '#FFF', color: '#000' }}
                      required
                    />
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.5rem', fontSize: '0.75rem', background: '#111827', color: '#FFF' }}>
                      Authorize Account Pick
                    </button>
                  </form>
                </div>
              </div>
            )}

            {googleStep === 'loading' && (
              <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                <div style={{ width: '40px', height: '40px', border: '3px solid #e5e7eb', borderTopColor: '#4285F4', borderRadius: '50%', animation: 'pulse-slow 1s infinite linear', margin: '0 auto 1.5rem' }}></div>
                <h4 style={{ fontSize: '1rem', fontWeight: 'bold', color: '#1f2937' }}>Connecting with Google Secure...</h4>
                <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>Verifying single sign-on tokens for **{selectedGoogleEmail}**</p>
              </div>
            )}

            {googleStep === 'success' && (
              <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>🛡️</span>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#16a34a' }}>SSO Handshake Verified</h4>
                <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>Authorized credentials received. Redirecting to academic portal...</p>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
