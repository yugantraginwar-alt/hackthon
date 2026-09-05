import React from 'react';
import { MessageSquare, Globe, QrCode, Scan, CreditCard, ArrowRight } from 'lucide-react';

export const MODALITIES = [
  {
    id: 'url',
    num: '01',
    name: 'LINK / URL',
    shortLabel: 'URL',
    desc: 'Typosquats & phishing portals',
    icon: Globe
  },
  {
    id: 'qr',
    num: '02',
    name: 'QR CODE',
    shortLabel: 'QR Code',
    desc: 'Refund vs debit intent mismatch',
    icon: QrCode
  },
  {
    id: 'message',
    num: '03',
    name: 'MESSAGE',
    shortLabel: 'Message',
    desc: 'SMS, WhatsApp, fake KYC & expiry',
    icon: MessageSquare
  },
  {
    id: 'screenshot',
    num: '04',
    name: 'SCREENSHOT',
    shortLabel: 'Screenshot',
    desc: 'OCR & embedded link/QR analysis',
    icon: Scan
  },
  {
    id: 'transaction',
    num: '05',
    name: 'TRANSACTION',
    shortLabel: 'Transaction',
    desc: 'Behavioral & anomaly analysis',
    icon: CreditCard
  }
];

export default function ModalityTabs({ activeModality, setActiveModality }) {
  const topRow = MODALITIES.slice(0, 3);
  const bottomRow = MODALITIES.slice(3, 5);

  const renderCard = (mod) => {
    const Icon = mod.icon;
    const isActive = activeModality === mod.id;
    return (
      <div
        key={mod.id}
        onClick={() => setActiveModality(mod.id)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && setActiveModality(mod.id)}
        className="workbench-cta-card"
        style={{
          padding: '20px 18px',
          textAlign: 'left',
          cursor: 'pointer',
          borderRadius: 'var(--radius-lg)',
          border: isActive ? '1px solid var(--accent-border)' : '1px solid var(--border-default)',
          background: isActive ? 'var(--bg-surface-2)' : 'var(--bg-surface-1)',
          boxShadow: isActive ? '0 0 12px rgba(16, 185, 129, 0.08)' : 'none',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          minHeight: '126px',
          transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Top Row: Icon + Number & Arrow */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div style={{
            width: '34px',
            height: '34px',
            borderRadius: '8px',
            background: isActive ? 'var(--accent-subtle)' : 'rgba(255, 255, 255, 0.04)',
            border: `1px solid ${isActive ? 'var(--accent-border)' : 'var(--border-subtle)'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: isActive ? 'var(--accent-light)' : 'var(--text-primary)'
          }}>
            <Icon size={17} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span className="mono" style={{
              fontSize: '0.68rem',
              fontWeight: '700',
              color: isActive ? 'var(--accent-light)' : 'var(--text-muted)',
              letterSpacing: '0.04em'
            }}>
              {mod.num}
            </span>
            <ArrowRight
              size={14}
              style={{
                color: isActive ? 'var(--accent-light)' : 'var(--text-muted)',
                transition: 'transform 0.2s ease',
                transform: isActive ? 'translateX(2px)' : 'none'
              }}
              className="cta-arrow"
            />
          </div>
        </div>

        {/* Bottom Row: Title + Description */}
        <div>
          <div style={{
            fontSize: '0.94rem',
            fontWeight: '800',
            letterSpacing: '-0.01em',
            color: isActive ? '#ffffff' : 'var(--text-primary)',
            marginBottom: '4px'
          }}>
            {mod.name}
          </div>
          <div style={{
            fontSize: '0.78rem',
            color: isActive ? 'var(--text-secondary)' : 'var(--text-muted)',
            lineHeight: 1.35
          }}>
            {mod.desc}
          </div>
        </div>

        {/* Active Accent Indicator */}
        {isActive && (
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '2px',
            background: 'var(--accent-light)'
          }} />
        )}
      </div>
    );
  };

  return (
    <div className="workbench-grid-container" style={{ marginBottom: '28px' }}>
      {/* Desktop 3 + 2 Layout */}
      <div className="workbench-desktop-grid">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '16px',
          marginBottom: '16px'
        }}>
          {topRow.map(renderCard)}
        </div>
        <div style={{
          width: 'calc(66.666% - 8px)',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '16px'
        }}>
          {bottomRow.map(renderCard)}
        </div>
      </div>

      {/* Mobile / Small Screen Fallback Layout */}
      <div className="workbench-mobile-grid">
        {MODALITIES.map(renderCard)}
      </div>

      <style>{`
        .workbench-desktop-grid {
          display: block;
        }
        .workbench-mobile-grid {
          display: none;
        }
        @media (max-width: 860px) {
          .workbench-desktop-grid {
            display: none !important;
          }
          .workbench-mobile-grid {
            display: grid !important;
            grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
            gap: 12px;
          }
        }
        @media (max-width: 520px) {
          .workbench-mobile-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}


