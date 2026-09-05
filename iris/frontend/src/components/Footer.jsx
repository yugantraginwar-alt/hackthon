import React from 'react';
import { Shield, Lock } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid var(--border-subtle)',
      padding: '24px 0',
      background: 'var(--bg-surface-0)',
      color: 'var(--text-muted)',
      fontSize: '0.78rem',
      marginTop: 'auto'
    }}>
      <div className="container" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Shield size={14} color="var(--text-secondary)" />
          <span style={{ color: 'var(--text-secondary)' }}>
            <strong style={{ color: '#ffffff' }}>IRIS</strong> — Intelligent Risk & Impersonation Shield (PS-03 Prototype)
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)' }}>
          <Lock size={12} />
          <span>Local Sanitization Guarantee • No Banking Credentials Stored</span>
        </div>
      </div>
    </footer>
  );
}
