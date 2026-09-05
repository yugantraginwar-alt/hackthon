import React, { useState } from 'react';
import { Globe, Sparkles } from 'lucide-react';

const URL_PRESETS = [
  {
    label: 'Typosquatted Lookalike (bank-examp1e.com)',
    url: 'https://bank-examp1e.com/sbi/verify-login?token=89234'
  },
  {
    label: 'Phishing Portal (sbi-kyc-update.online)',
    url: 'https://sbi-kyc-update.online/auth/login'
  },
  {
    label: 'Suspicious TLD (hdfc-verify-kyc.top)',
    url: 'http://hdfc-verify-kyc.top/netbanking/secure'
  },
  {
    label: 'Official Bank (onlinesbi.sbi)',
    url: 'https://www.onlinesbi.sbi'
  }
];

export default function UrlScannerTab({ onAnalyze }) {
  const [url, setUrl] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!url.trim()) return;
    onAnalyze(url.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="animate-fade-in">
      <div className="form-group">
        <label className="form-label" htmlFor="url-input">
          <span>Suspicious URL or Payment Link</span>
          <span className="form-hint">Headless sandboxed evaluation</span>
        </label>
        <div style={{ position: 'relative' }}>
          <input
            id="url-input"
            type="text"
            className="form-input"
            placeholder="Paste suspicious link (e.g. https://bank-examp1e.com/login)..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
            style={{ paddingLeft: '38px', fontSize: '0.9rem' }}
          />
          <Globe
            size={16}
            color="var(--text-muted)"
            style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
          />
        </div>
      </div>

      {/* Quick Test Presets */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{
          fontSize: '0.75rem',
          color: 'var(--text-muted)',
          marginBottom: '6px'
        }}>
          Quick Test Presets:
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
          {URL_PRESETS.map((p, idx) => (
            <button
              key={idx}
              type="button"
              className="btn btn-secondary"
              style={{ fontSize: '0.72rem', padding: '4px 8px' }}
              onClick={() => setUrl(p.url)}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '10px' }}>
        <Globe size={15} /> Inspect Link & Domain Security
      </button>
    </form>
  );
}
