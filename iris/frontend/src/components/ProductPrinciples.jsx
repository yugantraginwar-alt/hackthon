import React from 'react';
import { FileSearch, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function ProductPrinciples() {
  return (
    <section style={{ marginTop: '40px', marginBottom: '32px' }}>
      {/* Detect -> Explain -> Protect Section */}
      <div style={{
        textAlign: 'center',
        marginBottom: '22px'
      }}>
        <div style={{
          fontSize: '0.72rem',
          fontWeight: '700',
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          color: 'var(--text-muted)',
          marginBottom: '4px'
        }}>
          Architecture & Philosophy
        </div>
        <h2 style={{ fontSize: '1.45rem', fontWeight: '800', color: '#ffffff', letterSpacing: '-0.02em' }}>
          Detect → Explain → Protect
        </h2>
        <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', maxWidth: '520px', margin: '0 auto' }}>
          Explainable security without opacity. Every risk score is paired with plain-language causes and immediate countermeasures.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '12px'
      }}>
        {/* Step 1: Detect */}
        <div className="surface-card" style={{ padding: '18px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '6px',
            background: 'var(--bg-surface-2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-primary)',
            marginBottom: '10px'
          }}>
            <FileSearch size={16} />
          </div>
          <div className="mono" style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: '700' }}>
            STAGE 01
          </div>
          <h3 style={{ fontSize: '0.98rem', fontWeight: '700', color: '#ffffff', margin: '2px 0 4px 0' }}>
            Multi-Modal Detection
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
            Parallel scanners evaluate regex entities, NLP keywords, lookalike banking domains, and UPI QR payloads.
          </p>
        </div>

        {/* Step 2: Explain */}
        <div className="surface-card" style={{ padding: '18px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '6px',
            background: 'var(--bg-surface-2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-primary)',
            marginBottom: '10px'
          }}>
            <ShieldAlert size={16} />
          </div>
          <div className="mono" style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: '700' }}>
            STAGE 02
          </div>
          <h3 style={{ fontSize: '0.98rem', fontWeight: '700', color: '#ffffff', margin: '2px 0 4px 0' }}>
            Point Explainability
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
            Itemizes exact point contributions (+X) and surfaces the underlying vector (e.g. claim vs intent mismatch).
          </p>
        </div>

        {/* Step 3: Protect */}
        <div className="surface-card" style={{ padding: '18px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '6px',
            background: 'var(--bg-surface-2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-primary)',
            marginBottom: '10px'
          }}>
            <CheckCircle2 size={16} />
          </div>
          <div className="mono" style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: '700' }}>
            STAGE 03
          </div>
          <h3 style={{ fontSize: '0.98rem', fontWeight: '700', color: '#ffffff', margin: '2px 0 4px 0' }}>
            Actionable Guidance
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
            Provides immediate instructions before payment approval, with emergency 1930 reporting links.
          </p>
        </div>
      </div>
    </section>
  );
}
