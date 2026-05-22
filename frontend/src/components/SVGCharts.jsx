import React from 'react';

// Line chart rendering attendance and focus averages over a 6-day period
export function WeeklyLineChart() {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Today'];
  const attendanceData = [95, 88, 92, 100, 94, 94]; // out of 100
  const focusData = [90, 85, 78, 96, 92, 94]; // out of 100

  const width = 500;
  const height = 200;
  const padding = 30;

  // Convert scores to SVG coordinate points
  const getCoordinates = (index, value) => {
    const x = padding + (index * (width - 2 * padding)) / (days.length - 1);
    const y = height - padding - (value * (height - 2 * padding)) / 100;
    return { x, y };
  };

  // Generate paths
  const attPoints = attendanceData.map((val, idx) => getCoordinates(idx, val));
  const focusPoints = focusData.map((val, idx) => getCoordinates(idx, val));

  const createLinePath = (points) => {
    return points.reduce((path, p, idx) => {
      return idx === 0 ? `M ${p.x} ${p.y}` : `${path} L ${p.x} ${p.y}`;
    }, '');
  };

  const createAreaPath = (points) => {
    if (points.length === 0) return '';
    const startX = points[0].x;
    const endX = points[points.length - 1].x;
    const basePath = createLinePath(points);
    return `${basePath} L ${endX} ${height - padding} L ${startX} ${height - padding} Z`;
  };

  return (
    <div style={{ width: '100%', overflow: 'hidden' }}>
      <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: 'auto', background: 'transparent' }}>
        <defs>
          <linearGradient id="att-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--primary-light)" stopOpacity="0.25" />
            <stop offset="100%" stopColor="var(--primary-light)" stopOpacity="0.0" />
          </linearGradient>
          <linearGradient id="focus-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--gold)" stopOpacity="0.2" />
            <stop offset="100%" stopColor="var(--gold)" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* X & Y Axis Lines */}
        <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
        <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="rgba(255,255,255,0.08)" strokeWidth="1" />

        {/* Horizontal Grid lines */}
        {[25, 50, 75, 100].map((gridVal, i) => {
          const y = height - padding - (gridVal * (height - 2 * padding)) / 100;
          return (
            <g key={i}>
              <line x1={padding} y1={y} x2={width - padding} y2={y} stroke="rgba(255,255,255,0.04)" strokeWidth="1" strokeDasharray="4 4" />
              <text x={padding - 8} y={y + 4} fill="var(--text-muted)" fontSize="8" textAnchor="end">{gridVal}%</text>
            </g>
          );
        })}

        {/* Gradient Fills under Lines */}
        <path d={createAreaPath(attPoints)} fill="url(#att-grad)" />
        <path d={createAreaPath(focusPoints)} fill="url(#focus-grad)" />

        {/* Line Paths */}
        <path d={createLinePath(attPoints)} fill="none" stroke="var(--primary-light)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d={createLinePath(focusPoints)} fill="none" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="1" />

        {/* Nodes / Dots */}
        {attPoints.map((p, i) => (
          <g key={`att-${i}`}>
            <circle cx={p.x} cy={p.y} r="4" fill="var(--primary-light)" stroke="var(--bg-dark)" strokeWidth="1.5" />
            <text x={p.x} y={p.y - 8} fill="var(--text-primary)" fontSize="7" fontWeight="600" textAnchor="middle">{attendanceData[i]}%</text>
          </g>
        ))}

        {focusPoints.map((p, i) => (
          <g key={`foc-${i}`}>
            <circle cx={p.x} cy={p.y} r="3" fill="var(--gold)" stroke="var(--bg-dark)" strokeWidth="1" />
            <text x={p.x} y={p.y + 12} fill="var(--text-secondary)" fontSize="7" fontWeight="500" textAnchor="middle">{focusData[i]}%</text>
          </g>
        ))}

        {/* Day X Labels */}
        {days.map((day, idx) => {
          const x = padding + (idx * (width - 2 * padding)) / (days.length - 1);
          return (
            <text key={idx} x={x} y={height - padding + 15} fill="var(--text-secondary)" fontSize="9" textAnchor="middle" fontWeight="500">
              {day}
            </text>
          );
        })}
      </svg>

      {/* Chart Legend */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: '0.75rem', fontSize: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span style={{ width: '12px', height: '3px', background: 'var(--primary-light)', borderRadius: '2px', display: 'inline-block' }}></span>
          <span style={{ color: 'var(--text-secondary)' }}>Attendance (%)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span style={{ width: '12px', height: '3px', borderTop: '2px dashed var(--gold)', borderRadius: '2px', display: 'inline-block' }}></span>
          <span style={{ color: 'var(--text-secondary)' }}>Live Focus (%)</span>
        </div>
      </div>
    </div>
  );
}

// Side-by-side Bar chart comparing Individual student scores vs Class Averages
export function ClassComparisonBarChart() {
  const metrics = ['Attendance', 'Live Focus', 'Participation'];
  const userScores = [94, 94, 88];
  const classAverages = [85, 78, 75];

  const width = 400;
  const height = 220;
  const padding = 35;
  const barWidth = 24;

  return (
    <div style={{ width: '100%', overflow: 'hidden' }}>
      <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: 'auto', background: 'transparent' }}>
        
        {/* Horizontal Grid lines */}
        {[25, 50, 75, 100].map((gridVal, i) => {
          const y = height - padding - (gridVal * (height - 2 * padding)) / 100;
          return (
            <g key={i}>
              <line x1={padding} y1={y} x2={width - padding} y2={y} stroke="rgba(255,255,255,0.04)" strokeWidth="1" strokeDasharray="4" />
              <text x={padding - 8} y={y + 3} fill="var(--text-muted)" fontSize="8" textAnchor="end">{gridVal}%</text>
            </g>
          );
        })}

        {/* X axis line */}
        <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="rgba(255,255,255,0.1)" strokeWidth="1" />

        {/* Draw Double Bar Clusters */}
        {metrics.map((metric, idx) => {
          const clusterCenterX = padding + ((idx + 0.5) * (width - 2 * padding)) / metrics.length;
          
          // User Bar Calculations
          const userVal = userScores[idx];
          const userH = (userVal * (height - 2 * padding)) / 100;
          const userX = clusterCenterX - barWidth - 4;
          const userY = height - padding - userH;

          // Class Bar Calculations
          const classVal = classAverages[idx];
          const classH = (classVal * (height - 2 * padding)) / 100;
          const classX = clusterCenterX + 4;
          const classY = height - padding - classH;

          return (
            <g key={idx}>
              {/* User Bar (Deep Blue Gradient) */}
              <rect 
                x={userX} 
                y={userY} 
                width={barWidth} 
                height={userH} 
                fill="url(#user-bar-grad)" 
                rx="4" 
                style={{ transition: 'all 0.5s ease' }}
              />
              <text x={userX + barWidth/2} y={userY - 6} fill="var(--white)" fontSize="8" fontWeight="700" textAnchor="middle">
                {userVal}%
              </text>

              {/* Class Average Bar (Translucent Gray/Slate) */}
              <rect 
                x={classX} 
                y={classY} 
                width={barWidth} 
                height={classH} 
                fill="rgba(255,255,255,0.1)" 
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="1"
                rx="4"
                style={{ transition: 'all 0.5s ease' }}
              />
              <text x={classX + barWidth/2} y={classY - 6} fill="var(--text-secondary)" fontSize="8" fontWeight="500" textAnchor="middle">
                {classVal}%
              </text>

              {/* Metric Label below X-axis */}
              <text x={clusterCenterX} y={height - 12} fill="var(--text-primary)" fontSize="9" fontWeight="600" textAnchor="middle">
                {metric}
              </text>
            </g>
          );
        })}

        {/* Gradients */}
        <defs>
          <linearGradient id="user-bar-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--primary-light)" />
            <stop offset="100%" stopColor="var(--primary)" />
          </linearGradient>
        </defs>

      </svg>

      {/* Bar Chart Legend */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: '0.5rem', fontSize: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span style={{ width: '12px', height: '12px', background: 'linear-gradient(to bottom, var(--primary-light), var(--primary))', borderRadius: '3px', display: 'inline-block' }}></span>
          <span style={{ color: 'var(--text-secondary)' }}>You (Alex)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span style={{ width: '12px', height: '12px', background: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '3px', display: 'inline-block' }}></span>
          <span style={{ color: 'var(--text-secondary)' }}>Class Avg</span>
        </div>
      </div>
    </div>
  );
}
