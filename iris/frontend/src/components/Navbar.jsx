import React, { useEffect, useState } from 'react';
import { Shield, PhoneCall, Zap, BarChart2, History, Menu, X } from 'lucide-react';
import { checkHealth } from '../lib/api';

export default function Navbar({ activeView, setActiveView }) {
  const [online, setOnline] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    let mounted = true;
    const ping = async () => {
      try {
        await checkHealth();
        if (mounted) setOnline(true);
      } catch (e) {
        if (mounted) setOnline(false);
      }
    };
    ping();
    const interval = setInterval(ping, 12000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  const handleNav = (view) => {
    setActiveView(view);
    setMobileMenuOpen(false);
  };

  return (
    <header className="nav-header">
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '62px'
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
            width: '32px',
            height: '32px',
            borderRadius: '6px',
            background: 'var(--bg-surface-2)',
            border: '1px solid var(--border-default)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-light)'
          }}>
            <Shield size={18} strokeWidth={2.2} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{
                fontSize: '1.15rem',
                fontWeight: '800',
                letterSpacing: '-0.02em',
                color: '#ffffff'
              }}>
                IRIS
              </span>
              <span className="mono" style={{
                fontSize: '0.62rem',
                fontWeight: '600',
                padding: '1px 5px',
                borderRadius: '3px',
                background: 'rgba(255, 255, 255, 0.05)',
                color: 'var(--text-secondary)',
                border: '1px solid var(--border-subtle)'
              }}>
                PS-03
              </span>
            </div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: '500', lineHeight: 1 }}>
              Intelligent Risk & Impersonation Shield
            </div>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav style={{ display: 'none', alignItems: 'center', gap: '4px' }} className="desktop-nav">
          <button
            className={`nav-link ${activeView === 'scanners' ? 'active' : ''}`}
            onClick={() => handleNav('scanners')}
          >
            <Shield size={14} /> Threat Scanner
          </button>
          <button
            className={`nav-link ${activeView === 'demo' ? 'active' : ''}`}
            onClick={() => handleNav('demo')}
          >
            <Zap size={14} /> Golden Demos
          </button>
          <button
            className={`nav-link ${activeView === 'dashboard' ? 'active' : ''}`}
            onClick={() => handleNav('dashboard')}
          >
            <BarChart2 size={14} /> Intelligence
          </button>
          <button
            className={`nav-link ${activeView === 'history' ? 'active' : ''}`}
            onClick={() => handleNav('history')}
          >
            <History size={14} /> Audit History
          </button>
        </nav>

        {/* Right Status / Helpline */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Health Dot */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.72rem',
            padding: '3px 8px',
            borderRadius: '20px',
            background: online ? 'var(--risk-safe-bg)' : 'var(--risk-danger-bg)',
            border: `1px solid ${online ? 'var(--risk-safe-border)' : 'var(--risk-danger-border)'}`,
            color: online ? 'var(--risk-safe)' : 'var(--risk-danger)'
          }}>
            <span style={{
              width: '5px',
              height: '5px',
              borderRadius: '50%',
              background: online ? 'var(--risk-safe)' : 'var(--risk-danger)'
            }} />
            <span style={{ fontWeight: '600' }}>{online ? 'Active' : 'Offline'}</span>
          </div>

          <a
            href="tel:1930"
            className="btn btn-secondary"
            style={{ padding: '5px 10px', fontSize: '0.75rem', gap: '5px' }}
            title="National Cyber Crime Reporting Helpline"
          >
            <PhoneCall size={12} color="var(--text-secondary)" />
            <span>Helpline: <strong>1930</strong></span>
          </a>

          {/* Mobile hamburger */}
          <button
            className="btn btn-ghost mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ padding: '6px' }}
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div style={{
          background: 'var(--bg-surface-1)',
          borderBottom: '1px solid var(--border-default)',
          padding: '10px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px'
        }}>
          <button
            className={`nav-link ${activeView === 'scanners' ? 'active' : ''}`}
            onClick={() => handleNav('scanners')}
            style={{ width: '100%', justifyContent: 'flex-start' }}
          >
            <Shield size={15} /> Threat Scanner
          </button>
          <button
            className={`nav-link ${activeView === 'demo' ? 'active' : ''}`}
            onClick={() => handleNav('demo')}
            style={{ width: '100%', justifyContent: 'flex-start' }}
          >
            <Zap size={15} /> Golden Demos
          </button>
          <button
            className={`nav-link ${activeView === 'dashboard' ? 'active' : ''}`}
            onClick={() => handleNav('dashboard')}
            style={{ width: '100%', justifyContent: 'flex-start' }}
          >
            <BarChart2 size={15} /> Intelligence
          </button>
          <button
            className={`nav-link ${activeView === 'history' ? 'active' : ''}`}
            onClick={() => handleNav('history')}
            style={{ width: '100%', justifyContent: 'flex-start' }}
          >
            <History size={15} /> Audit History
          </button>
        </div>
      )}

      <style>{`
        @media (min-width: 860px) {
          .desktop-nav { display: flex !important; }
          .mobile-menu-btn { display: none !important; }
        }
      `}</style>
    </header>
  );
}
