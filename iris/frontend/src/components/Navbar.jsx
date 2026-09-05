import React, { useState } from 'react';
import { Shield, Zap, Menu, X } from 'lucide-react';

export default function Navbar({ activeView, setActiveView }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNav = (view) => {
    setActiveView(view);
    setMobileMenuOpen(false);
  };

  return (
    <header className="nav-header" style={{
      background: 'var(--bg-surface-1)',
      borderBottom: '1px solid var(--border-default)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '64px'
      }}>
        {/* Brand */}
        <div
          onClick={() => handleNav('scanners')}
          style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && handleNav('scanners')}
        >
          <div style={{
            width: '34px',
            height: '34px',
            borderRadius: '8px',
            background: 'var(--bg-surface-2)',
            border: '1px solid var(--border-default)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-light)'
          }}>
            <Shield size={19} strokeWidth={2.2} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{
                fontSize: '1.2rem',
                fontWeight: '800',
                letterSpacing: '-0.02em',
                color: '#ffffff'
              }}>
                IRIS
              </span>
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '500', lineHeight: 1 }}>
              Intelligent Risk & Impersonation Shield
            </div>
          </div>
        </div>

        {/* Center Navigation */}
        <nav style={{ display: 'none', alignItems: 'center', gap: '8px' }} className="desktop-nav">
          <button
            className={`nav-link ${activeView === 'scanners' ? 'active' : ''}`}
            onClick={() => handleNav('scanners')}
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              fontSize: '0.84rem',
              fontWeight: '600',
              color: activeView === 'scanners' ? '#ffffff' : 'var(--text-secondary)',
              background: activeView === 'scanners' ? 'var(--bg-surface-2)' : 'transparent',
              border: activeView === 'scanners' ? '1px solid var(--border-default)' : '1px solid transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.15s ease'
            }}
          >
            <Shield size={14} /> Threat Scanner
          </button>
          <button
            className={`nav-link ${activeView === 'demo' ? 'active' : ''}`}
            onClick={() => handleNav('demo')}
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              fontSize: '0.84rem',
              fontWeight: '600',
              color: activeView === 'demo' ? '#ffffff' : 'var(--text-secondary)',
              background: activeView === 'demo' ? 'var(--bg-surface-2)' : 'transparent',
              border: activeView === 'demo' ? '1px solid var(--border-default)' : '1px solid transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.15s ease'
            }}
          >
            <Zap size={14} /> DEMO FOR ACET
          </button>
        </nav>

        {/* Right - Mobile Hamburger */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <button
            className="btn btn-ghost mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ padding: '6px', color: 'var(--text-primary)' }}
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div style={{
          background: 'var(--bg-surface-1)',
          borderBottom: '1px solid var(--border-default)',
          padding: '12px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          <button
            className={`nav-link ${activeView === 'scanners' ? 'active' : ''}`}
            onClick={() => handleNav('scanners')}
            style={{
              width: '100%',
              justify: 'flex-start',
              padding: '10px 12px',
              borderRadius: '6px',
              fontSize: '0.86rem',
              fontWeight: '600',
              color: activeView === 'scanners' ? '#ffffff' : 'var(--text-secondary)',
              background: activeView === 'scanners' ? 'var(--bg-surface-2)' : 'transparent',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Shield size={16} /> Threat Scanner
          </button>
          <button
            className={`nav-link ${activeView === 'demo' ? 'active' : ''}`}
            onClick={() => handleNav('demo')}
            style={{
              width: '100%',
              justify: 'flex-start',
              padding: '10px 12px',
              borderRadius: '6px',
              fontSize: '0.86rem',
              fontWeight: '600',
              color: activeView === 'demo' ? '#ffffff' : 'var(--text-secondary)',
              background: activeView === 'demo' ? 'var(--bg-surface-2)' : 'transparent',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Zap size={16} /> DEMO FOR ACET
          </button>
        </div>
      )}

      <style>{`
        @media (min-width: 768px) {
          .desktop-nav { display: flex !important; }
          .mobile-menu-btn { display: none !important; }
        }
      `}</style>
    </header>
  );
}

