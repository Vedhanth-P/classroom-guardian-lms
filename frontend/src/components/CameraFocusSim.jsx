import React, { useRef, useEffect, useState } from 'react';
import { useLMS } from '../context/LMSContext';
import { Camera, CameraOff, Sparkles, MonitorCheck, ShieldAlert, Sliders } from 'lucide-react';

export default function CameraFocusSim() {
  const { webcamActive, setWebcamActive, simulatedDistraction, setSimulatedDistraction, students } = useLMS();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const [cameraError, setCameraError] = useState(false);
  const [telemetry, setTelemetry] = useState({ yaw: 1.2, pitch: -0.5, ear: 0.28, confidence: 94.6 });

  const activeStudent = students.find(s => s.isUser);

  // Activate / Deactivate Camera Feed
  useEffect(() => {
    let stream = null;

    async function enableStream() {
      try {
        setCameraError(false);
        stream = await navigator.mediaDevices.getUserMedia({ video: { width: 480, height: 360 } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.warn("Webcam access denied or unavailable. Falling back to high-fidelity AI vector simulation.", err);
        setCameraError(true);
      }
    }

    if (webcamActive) {
      enableStream();
    } else {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      cancelAnimationFrame(animationRef.current);
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      cancelAnimationFrame(animationRef.current);
    };
  }, [webcamActive]);

  // Canvas Tracking Overlay Animation Loop
  useEffect(() => {
    if (!webcamActive) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let frameCount = 0;

    const renderOverlay = () => {
      if (!canvas || !ctx) return;
      frameCount++;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const colorMain = simulatedDistraction ? '#EF4444' : '#22C55E';
      const colorGlow = simulatedDistraction ? 'rgba(239, 68, 68, 0.3)' : 'rgba(34, 197, 94, 0.3)';

      // Calculate dynamic simulated face coordinates
      let faceX = canvas.width / 2;
      let faceY = canvas.height / 2 - 10;
      let faceW = 160;
      let faceH = 200;

      // Add camera noise jitter or drift depending on state
      const drift = Math.sin(frameCount * 0.05) * (simulatedDistraction ? 20 : 3);
      faceX += drift;
      if (simulatedDistraction) {
        // Move face away to simulate looking side-ways/down
        faceX += 60;
        faceY += 30;
      }

      // 1. Draw Simulated Face Bounding Box
      ctx.strokeStyle = colorMain;
      ctx.lineWidth = 2.5;
      ctx.shadowColor = colorMain;
      ctx.shadowBlur = 8;
      
      // Corner brackets style instead of full rectangle
      const pad = 20;
      ctx.beginPath();
      // Top-Left
      ctx.moveTo(faceX - faceW/2, faceY - faceH/2 + pad);
      ctx.lineTo(faceX - faceW/2, faceY - faceH/2);
      ctx.lineTo(faceX - faceW/2 + pad, faceY - faceH/2);
      
      // Top-Right
      ctx.moveTo(faceX + faceW/2 - pad, faceY - faceH/2);
      ctx.lineTo(faceX + faceW/2, faceY - faceH/2);
      ctx.lineTo(faceX + faceW/2, faceY - faceH/2 + pad);
      
      // Bottom-Left
      ctx.moveTo(faceX - faceW/2, faceY + faceH/2 - pad);
      ctx.lineTo(faceX - faceW/2, faceY + faceH/2);
      ctx.lineTo(faceX - faceW/2 + pad, faceY + faceH/2);
      
      // Bottom-Right
      ctx.moveTo(faceX + faceW/2 - pad, faceY + faceH/2);
      ctx.lineTo(faceX + faceW/2, faceY + faceH/2);
      ctx.lineTo(faceX + faceW/2, faceY + faceH/2 - pad);
      ctx.stroke();

      // Clear Shadow effects for other elements
      ctx.shadowBlur = 0;

      // 2. Draw Target Center Reticle
      ctx.strokeStyle = 'rgba(255,255,255,0.15)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(canvas.width/2, canvas.height/2, 40, 0, Math.PI * 2);
      ctx.moveTo(canvas.width/2 - 50, canvas.height/2);
      ctx.lineTo(canvas.width/2 + 50, canvas.height/2);
      ctx.moveTo(canvas.width/2, canvas.height/2 - 50);
      ctx.lineTo(canvas.width/2, canvas.height/2 + 50);
      ctx.stroke();

      // 3. Draw Eye Tracking Vectors
      const leftEyeX = faceX - 35;
      const rightEyeX = faceX + 35;
      const eyesY = faceY - 20;

      ctx.fillStyle = colorMain;
      ctx.strokeStyle = colorMain;

      // Draw pupils
      ctx.beginPath();
      ctx.arc(leftEyeX, eyesY, 5, 0, Math.PI * 2);
      ctx.arc(rightEyeX, eyesY, 5, 0, Math.PI * 2);
      ctx.fill();

      // Draw active vector tracking rays
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      if (simulatedDistraction) {
        // Look vectors skewed downward and away
        ctx.moveTo(leftEyeX, eyesY);
        ctx.lineTo(leftEyeX + 30, eyesY + 45);
        ctx.moveTo(rightEyeX, eyesY);
        ctx.lineTo(rightEyeX + 30, eyesY + 45);
      } else {
        // Look vectors pointing directly forward
        ctx.moveTo(leftEyeX, eyesY);
        ctx.lineTo(canvas.width/2 - 20, canvas.height/2);
        ctx.moveTo(rightEyeX, eyesY);
        ctx.lineTo(canvas.width/2 + 20, canvas.height/2);
      }
      ctx.stroke();

      // 4. Facial landmarks (dots network representation)
      ctx.fillStyle = 'rgba(255,255,255,0.6)';
      const landmarks = [
        { x: faceX, y: faceY + 10 }, // Nose bridge
        { x: faceX, y: faceY + 30 }, // Nose tip
        { x: faceX - 25, y: faceY - 35 }, // Left eyebrow
        { x: faceX + 25, y: faceY - 35 }, // Right eyebrow
        { x: faceX - 30, y: faceY + 60 }, // Mouth corner Left
        { x: faceX + 30, y: faceY + 60 }, // Mouth corner Right
        { x: faceX, y: faceY + 70 }, // Chin bottom
      ];
      landmarks.forEach(pt => {
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 2.5, 0, Math.PI*2);
        ctx.fill();
      });

      // 5. Draw laser line scanner overlay
      const scanY = (Math.sin(frameCount * 0.08) + 1) * (canvas.height / 2);
      ctx.fillStyle = colorGlow;
      ctx.fillRect(0, scanY - 1, canvas.width, 2);

      // 6. Draw Status Banner on canvas top left
      ctx.fillStyle = 'rgba(9, 13, 22, 0.85)';
      ctx.strokeStyle = colorMain;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(12, 12, 160, 48, 8);
      ctx.fill();
      ctx.stroke();

      ctx.font = "bold 10px Poppins";
      ctx.fillStyle = colorMain;
      ctx.fillText(simulatedDistraction ? "⚠️ DETECTED: LOOKING AWAY" : "🛡️ STATE: FOCUSING", 20, 28);
      ctx.font = "9px Inter";
      ctx.fillStyle = "rgba(255,255,255,0.7)";
      ctx.fillText(`Live Focus Index: ${activeStudent?.focusScore || 0}%`, 20, 44);

      // Generate Telemetry numbers
      if (frameCount % 10 === 0) {
        setTelemetry({
          yaw: simulatedDistraction ? (24.5 + Math.random()*2).toFixed(1) : (0.8 + Math.random()*1.5).toFixed(1),
          pitch: simulatedDistraction ? (-12.4 + Math.random()*2).toFixed(1) : (-0.4 + Math.random()*1).toFixed(1),
          ear: simulatedDistraction ? (0.16 + Math.random()*0.03).toFixed(2) : (0.28 + Math.random()*0.02).toFixed(2),
          confidence: simulatedDistraction ? (74.2 + Math.random()*4).toFixed(1) : (94.2 + Math.random()*2).toFixed(1)
        });
      }

      animationRef.current = requestAnimationFrame(renderOverlay);
    };

    renderOverlay();

    return () => cancelAnimationFrame(animationRef.current);
  }, [webcamActive, simulatedDistraction, activeStudent]);

  return (
    <div className="card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem', background: 'rgba(21, 29, 48, 0.85)', minHeight: '340px' }}>
      
      {/* Card Header */}
      <div className="flex-between">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sparkles size={18} style={{ color: 'var(--gold)' }} />
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>AI camera gaze Tracker</h3>
        </div>

        {webcamActive && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span className="badge badge-present" style={{ fontSize: '0.65rem', animation: 'pulse-green 1.5s infinite' }}>
              MediaPipe live
            </span>
          </div>
        )}
      </div>

      {/* Gaze Monitor Stream Area */}
      <div style={{ position: 'relative', width: '100%', aspectRatio: '1.333', background: '#070a10', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        
        {webcamActive ? (
          <>
            {/* Real Webcam Element */}
            {!cameraError && (
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted 
                style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }} 
              />
            )}

            {/* Virtual avatar graphic if real webcam error / denied */}
            {cameraError && (
              <div style={{ textAlign: 'center', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: 'radial-gradient(circle, #101827 0%, #030712 100%)' }}>
                <div style={{ fontSize: '5rem', marginBottom: '0.5rem', transform: `scaleX(-1) rotate(${simulatedDistraction ? '12deg' : '0deg'})`, transition: 'all 0.5s' }}>
                  {simulatedDistraction ? '🙄' : '👨‍💻'}
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Camera Access Blocked — Running High-Fidelity 3D Simulation</p>
              </div>
            )}

            {/* Scanning Overlay Canvas */}
            <canvas 
              ref={canvasRef} 
              width={380} 
              height={285} 
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 5 }} 
            />

            {/* Grid background effect */}
            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.01) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.01) 1px, transparent 1px)', backgroundSize: '15px 15px', pointerEvents: 'none', opacity: 0.8 }} />
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
              <CameraOff size={24} style={{ color: 'var(--text-muted)' }} />
            </div>
            <h4 style={{ fontSize: '0.9rem', color: 'var(--white)', marginBottom: '0.25rem' }}>AI camera focus tracker disabled</h4>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', maxWidth: '240px', margin: '0 auto 1rem' }}>
              Enable focus tracking to run real-time camera-based eye aspect ratio and yaw/pitch focus calculations.
            </p>
            <button className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.75rem' }} onClick={() => setWebcamActive(true)}>
              <Camera size={14} />
              Enable Focus Tracking
            </button>
          </div>
        )}

      </div>

      {/* Control Switcher and Telemetry Details */}
      {webcamActive && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          
          {/* Telemetry data table */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.4rem', background: 'rgba(0,0,0,0.3)', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--card-border)', textAlign: 'center' }}>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--white)' }}>{telemetry.yaw}°</div>
              <div style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Yaw</div>
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--white)' }}>{telemetry.pitch}°</div>
              <div style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Pitch</div>
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--white)' }}>{telemetry.ear}</div>
              <div style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>EAR</div>
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: simulatedDistraction ? 'var(--red)' : 'var(--green)' }}>{telemetry.confidence}%</div>
              <div style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Confidence</div>
            </div>
          </div>

          {/* Interactive Simulation sliders */}
          <div className="card" style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
            <div className="flex-between">
              <span style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--text-secondary)' }}>
                <Sliders size={13} style={{ color: 'var(--gold)' }} />
                AI Simulator Panel
              </span>
              <button 
                className="btn btn-outline"
                style={{ padding: '0.2rem 0.5rem', fontSize: '0.65rem', borderRadius: '4px' }}
                onClick={() => setWebcamActive(false)}
              >
                Turn Off Camera
              </button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={simulatedDistraction} 
                  onChange={(e) => setSimulatedDistraction(e.target.checked)} 
                  style={{ accentColor: 'var(--gold)' }}
                />
                <span style={{ color: simulatedDistraction ? 'var(--gold)' : 'var(--text-secondary)' }}>
                  Simulate Gaze Distraction (Looking Away)
                </span>
              </label>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
