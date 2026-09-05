import React from 'react';

export default function RiskGauge({ score = 0, classification = 'SAFE' }) {
  const radius = 68;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(100, Math.max(0, score)) / 100) * circumference;

  let strokeColor = 'var(--risk-safe)';
  let badgeClass = 'badge-safe';

  if (classification === 'SUSPICIOUS') {
    strokeColor = 'var(--risk-suspicious)';
    badgeClass = 'badge-suspicious';
  } else if (classification === 'HIGH_RISK') {
    strokeColor = 'var(--risk-danger)';
    badgeClass = 'badge-danger';
  }

  return (
    <div style={{
      position: 'relative',
      width: '160px',
      height: '160px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto'
    }}>
      <svg
        viewBox="0 0 160 160"
        style={{
          transform: 'rotate(-90deg)',
          width: '100%',
          height: '100%'
        }}
      >
        {/* Background track */}
        <circle
          cx="80"
          cy="80"
          r={radius}
          fill="none"
          stroke="rgba(255, 255, 255, 0.06)"
          strokeWidth={strokeWidth}
        />
        {/* Progress Arc */}
        <circle
          cx="80"
          cy="80"
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{
            transition: 'stroke-dashoffset 0.7s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        />
      </svg>

      <div style={{
        position: 'absolute',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center'
      }}>
        <div style={{
          fontSize: '2.6rem',
          fontWeight: '800',
          lineHeight: 1,
          color: strokeColor,
          letterSpacing: '-0.03em'
        }}>
          {score}
        </div>
        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>
          OUT OF 100
        </div>
        <div className={`badge ${badgeClass}`} style={{ marginTop: '6px' }}>
          {classification.replace('_', ' ')}
        </div>
      </div>
    </div>
  );
}
