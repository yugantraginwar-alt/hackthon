import React, { useState } from 'react';
import { MessageSquare } from 'lucide-react';

const MESSAGE_PRESETS = [
  {
    label: 'Fake KYC Expiry Threat (High Risk)',
    text: 'Dear Customer, Your SBI YONO Account KYC has expired. Your UPI service will be blocked today. Verify immediately at https://sbi-kyc-update.online to avoid suspension.'
  },
  {
    label: 'Prize / Lottery Lure (Phishing)',
    text: 'Congratulations! You have won a cashback reward of Rs 4,999 on Google Pay. Click here to claim your cashback to any UPI linked account immediately: http://phonepe-rewards.live'
  },
  {
    label: 'Legitimate Credit Confirmation (Safe)',
    text: 'Dear Customer, your A/c ending 4589 is credited with Rs 45,000.00 on 01-Sep-2026 by NEFT. Bal: Rs 52,140.75 - State Bank of India'
  }
];

export default function MessageScannerTab({ onAnalyze }) {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onAnalyze(text.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="animate-fade-in">
      <div className="form-group">
        <label className="form-label" htmlFor="msg-textarea">
          <span>Suspicious SMS, WhatsApp, or Email Text</span>
          <span className="form-hint">Sensitive OTPs & PINs scrubbed automatically</span>
        </label>
        <textarea
          id="msg-textarea"
          className="form-textarea"
          rows={4}
          placeholder="Paste SMS alert, WhatsApp message, or payment request text here... (e.g. 'Your KYC has expired. Verify now...')"
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
          style={{ fontSize: '0.9rem' }}
        />
      </div>

      {/* Quick Presets */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{
          fontSize: '0.75rem',
          color: 'var(--text-muted)',
          marginBottom: '6px'
        }}>
          Quick Presets:
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
          {MESSAGE_PRESETS.map((p, idx) => (
            <button
              key={idx}
              type="button"
              className="btn btn-secondary"
              style={{ fontSize: '0.72rem', padding: '4px 8px' }}
              onClick={() => setText(p.text)}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '10px' }}>
        <MessageSquare size={15} /> Analyze Message Content
      </button>
    </form>
  );
}
