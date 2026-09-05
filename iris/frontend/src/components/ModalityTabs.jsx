import React from 'react';
import { MessageSquare, Globe, QrCode, Scan, CreditCard } from 'lucide-react';

export const MODALITIES = [
  {
    id: 'url',
    name: 'Link / URL',
    shortLabel: 'URL',
    desc: 'Typosquats & phishing portals',
    icon: Globe,
    tag: 'Heuristics'
  },
  {
    id: 'qr',
    name: 'QR Code',
    shortLabel: 'QR Code',
    desc: 'Refund vs debit intent mismatch',
    icon: QrCode,
    tag: 'Intent Engine'
  },
  {
    id: 'message',
    name: 'Message',
    shortLabel: 'Message',
    desc: 'SMS, WhatsApp, fake KYC expiry',
    icon: MessageSquare,
    tag: 'NLP + Rules'
  },
  {
    id: 'screenshot',
    name: 'Screenshot',
    shortLabel: 'Screenshot',
    desc: 'Multi-modal OCR & embedded link/QR',
    icon: Scan,
    tag: 'Multi-Modal'
  },
  {
    id: 'transaction',
    name: 'Transaction',
    shortLabel: 'Transaction',
    desc: 'Overnight spikes & behavioral anomalies',
    icon: CreditCard,
    tag: 'Anomaly z-Score'
  }
];

export default function ModalityTabs({ activeModality, setActiveModality }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
      gap: '8px',
      marginBottom: '20px'
    }}>
      {MODALITIES.map((mod) => {
        const Icon = mod.icon;
        const isActive = activeModality === mod.id;
        return (
          <button
            key={mod.id}
            onClick={() => setActiveModality(mod.id)}
            className="surface-card"
            style={{
              padding: '14px 12px',
              textAlign: 'left',
              cursor: 'pointer',
              border: `1px solid ${isActive ? 'var(--border-strong)' : 'var(--border-subtle)'}`,
              background: isActive ? 'var(--bg-surface-2)' : 'var(--bg-surface-1)',
              outline: 'none',
              color: 'inherit',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '92px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '6px',
                background: isActive ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: isActive ? '#ffffff' : 'var(--text-secondary)'
              }}>
                <Icon size={15} />
              </div>
              <span className="mono" style={{
                fontSize: '0.62rem',
                padding: '1px 5px',
                borderRadius: '3px',
                background: 'rgba(255, 255, 255, 0.04)',
                color: 'var(--text-muted)'
              }}>
                {mod.tag}
              </span>
            </div>

            <div>
              <div style={{
                fontSize: '0.88rem',
                fontWeight: '700',
                color: isActive ? '#ffffff' : 'var(--text-primary)',
                marginBottom: '2px'
              }}>
                {mod.name}
              </div>
              <div style={{
                fontSize: '0.72rem',
                color: 'var(--text-muted)',
                lineHeight: 1.3
              }}>
                {mod.desc}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
