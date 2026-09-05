import React, { useEffect, useState } from 'react';
import { ArrowDown, Globe, QrCode, ArrowRight } from 'lucide-react';

export default function Hero({ onSelectPrimaryAction, onScrollToScanner }) {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scale = Math.max(0.92, 1 - scrollY * 0.0003);
  const opacity = Math.max(0.7, 1 - scrollY * 0.001);
  const translateY = Math.min(40, scrollY * 0.1);

  return (
    <section style={{
      paddingTop: '56px',
      paddingBottom: '40px',
      textAlign: 'center',
      position: 'relative'
    }}>
      {/* Introduction Screen */}
      <div style={{
        maxWidth: '820px',
        margin: '0 auto',
        transform: `translateY(${translateY}px) scale(${scale})`,
        opacity: opacity,
        transition: 'transform 0.05s linear, opacity 0.05s linear',
        willChange: 'transform, opacity'
      }}>
        {/* Moniker Badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 12px',
          borderRadius: '20px',
          background: 'var(--bg-surface-1)',
          border: '1px solid var(--border-default)',
          color: 'var(--text-secondary)',
          fontSize: '0.78rem',
          fontWeight: '600',
          marginBottom: '18px'
        }}>
          PS-03 • Explainable UPI Threat Intelligence
        </div>

        {/* Large Display Typography */}
        <h1 className="hero-title" style={{
          fontSize: '4.2rem',
          fontWeight: '800',
          lineHeight: 1,
          letterSpacing: '-0.04em',
          color: '#ffffff',
          marginBottom: '8px'
        }}>
          IRIS
        </h1>

        {/* Subtitle / Full Name */}
        <div className="hero-tagline" style={{
          fontSize: '1.2rem',
          fontWeight: '600',
          color: '#e5e7eb',
          letterSpacing: '-0.01em',
          marginBottom: '16px'
        }}>
          Intelligent Risk & Impersonation Shield
        </div>

        {/* Core Product Statement */}
        <p style={{
          fontSize: '1.1rem',
          color: 'var(--text-secondary)',
          maxWidth: '640px',
          margin: '0 auto 12px auto',
          lineHeight: 1.5,
          fontWeight: '400'
        }}>
          Detect suspicious UPI activity <strong style={{ color: '#ffffff', fontWeight: '600' }}>before it becomes a loss</strong>.
        </p>

        {/* Supporting Clarification */}
        <p style={{
          fontSize: '0.86rem',
          color: 'var(--text-muted)',
          maxWidth: '520px',
          margin: '0 auto 32px auto',
          lineHeight: 1.5
        }}>
          Deep inspection across messages, links, QR codes, screenshots, and transaction anomalies with point-by-point explainability.
        </p>
      </div>

      {/* Primary Entry Actions: LINK and QR */}
      <div style={{
        maxWidth: '740px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
        gap: '14px',
        padding: '0 10px'
      }}>
        {/* LINK Entry Point */}
        <div
          className="surface-card"
          onClick={() => onSelectPrimaryAction('url')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && onSelectPrimaryAction('url')}
          style={{
            padding: '20px 18px',
            textAlign: 'left',
            cursor: 'pointer',
            border: '1px solid var(--border-default)',
            background: 'var(--bg-surface-1)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '14px'
          }}
        >
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '8px',
            background: 'var(--bg-surface-2)',
            border: '1px solid var(--border-default)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-primary)',
            flexShrink: 0
          }}>
            <Globe size={19} />
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '3px' }}>
              <span className="mono" style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '700', letterSpacing: '0.04em' }}>
                ENTRY 01 • LINK
              </span>
              <ArrowRight size={14} color="var(--text-muted)" />
            </div>
            <h2 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#ffffff', marginBottom: '3px' }}>
              Check a suspicious URL
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
              Detect typosquatting, lookalike banking domains, and deceptive payment links.
            </p>
          </div>
        </div>

        {/* QR Entry Point */}
        <div
          className="surface-card"
          onClick={() => onSelectPrimaryAction('qr')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && onSelectPrimaryAction('qr')}
          style={{
            padding: '20px 18px',
            textAlign: 'left',
            cursor: 'pointer',
            border: '1px solid var(--border-default)',
            background: 'var(--bg-surface-1)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '14px'
          }}
        >
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '8px',
            background: 'var(--bg-surface-2)',
            border: '1px solid var(--border-default)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-primary)',
            flexShrink: 0
          }}>
            <QrCode size={19} />
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '3px' }}>
              <span className="mono" style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '700', letterSpacing: '0.04em' }}>
                ENTRY 02 • QR CODE
              </span>
              <ArrowRight size={14} color="var(--text-muted)" />
            </div>
            <h2 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#ffffff', marginBottom: '3px' }}>
              Scan or upload a QR
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
              Expose <strong>Claim vs Intent Mismatch</strong>: traps claiming refunds that debit your account.
            </p>
          </div>
        </div>
      </div>

      {/* Subtle Scroll Cue */}
      <div style={{
        marginTop: '28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px',
        color: 'var(--text-muted)',
        fontSize: '0.78rem',
        cursor: 'pointer'
      }}
      onClick={onScrollToScanner}
      >
        <span>Explore all 5 threat modalities below</span>
        <ArrowDown size={13} />
      </div>
    </section>
  );
}
