import React from 'react';

export default function Hero() {
  return (
    <section style={{
      paddingTop: '48px',
      paddingBottom: '24px',
      textAlign: 'center',
      position: 'relative'
    }}>
      <div style={{
        maxWidth: '820px',
        margin: '0 auto',
      }}>
        {/* Large Display Typography */}
        <h1 className="hero-title" style={{
          fontSize: '4.5rem',
          fontWeight: '800',
          lineHeight: 1,
          letterSpacing: '-0.04em',
          color: '#ffffff',
          marginBottom: '10px'
        }}>
          IRIS
        </h1>

        {/* Subtitle / Full Name */}
        <div className="hero-tagline" style={{
          fontSize: '1.25rem',
          fontWeight: '700',
          color: '#e5e7eb',
          letterSpacing: '-0.01em',
          marginBottom: '16px'
        }}>
          Intelligent Risk & Impersonation Shield
        </div>

        {/* Core Product Statement */}
        <p style={{
          fontSize: '1.15rem',
          color: 'var(--text-secondary)',
          maxWidth: '640px',
          margin: '0 auto 10px auto',
          lineHeight: 1.5,
          fontWeight: '400'
        }}>
          Detect suspicious UPI activity <strong style={{ color: '#ffffff', fontWeight: '600' }}>before it becomes a loss</strong>.
        </p>

        {/* Supporting Clarification */}
        <p style={{
          fontSize: '0.88rem',
          color: 'var(--text-muted)',
          maxWidth: '560px',
          margin: '0 auto',
          lineHeight: 1.55
        }}>
          Deep inspection across links, QR codes, messages, screenshots, and transaction anomalies with point-by-point explainability.
        </p>
      </div>
    </section>
  );
}

