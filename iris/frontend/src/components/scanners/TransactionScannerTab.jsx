import React, { useState } from 'react';
import { CreditCard, AlertCircle } from 'lucide-react';

const TRANSACTION_PRESETS = [
  {
    label: 'High-Risk Overnight Spike (3:30 AM, ₹28,000, New Device)',
    data: {
      amount: 28000,
      receiver: 'unknown.hacker88@ybl',
      timestamp: '2026-09-05T03:30:00Z',
      device_id: 'DEVICE_UNKNOWN_EMULATOR_X',
      location: 'DELHI_NCR',
      historical_avg_amount: 1200
    }
  },
  {
    label: 'Normal Routine Expense (₹180, Known Merchant)',
    data: {
      amount: 180,
      receiver: 'chai.point@phonepe',
      timestamp: '2026-09-05T16:15:00Z',
      device_id: 'DEVICE_SAMSUNG_S24_SECURE',
      location: 'MUMBAI_ANDHERI',
      historical_avg_amount: 1200
    }
  },
  {
    label: 'Suspicious New Recipient (₹9,500, Unregistered Device)',
    data: {
      amount: 9500,
      receiver: 'cash.drop.agent@paytm',
      timestamp: '2026-09-05T11:20:00Z',
      device_id: 'DEVICE_ONEPLUS_UNREGISTERED',
      location: 'MUMBAI_ANDHERI',
      historical_avg_amount: 1200
    }
  }
];

export default function TransactionScannerTab({ onAnalyze }) {
  const [formData, setFormData] = useState({
    amount: 28000,
    receiver: 'unknown.hacker88@ybl',
    timestamp: '2026-09-05T03:30:00Z',
    device_id: 'DEVICE_UNKNOWN_EMULATOR_X',
    location: 'DELHI_NCR',
    historical_avg_amount: 1200
  });

  const handleChange = (field, val) => {
    setFormData(prev => ({
      ...prev,
      [field]: field === 'amount' || field === 'historical_avg_amount' ? parseFloat(val) || 0 : val
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAnalyze(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="animate-fade-in">
      <div style={{
        padding: '9px 12px',
        borderRadius: 'var(--radius-md)',
        background: 'var(--bg-surface-0)',
        border: '1px solid var(--border-subtle)',
        fontSize: '0.75rem',
        color: 'var(--text-secondary)',
        marginBottom: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '7px'
      }}>
        <AlertCircle size={14} color="var(--text-muted)" style={{ flexShrink: 0 }} />
        <span>
          <strong>Evaluation Baseline:</strong> Evaluates deviations (amount z-score &gt; 4.0, unfamiliar device IDs, and overnight transfer windows).
        </span>
      </div>

      {/* Preset Persona Buttons */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{
          fontSize: '0.75rem',
          color: 'var(--text-muted)',
          marginBottom: '6px'
        }}>
          Load Test Persona Presets:
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          {TRANSACTION_PRESETS.map((p, idx) => (
            <button
              key={idx}
              type="button"
              className="btn btn-secondary"
              style={{ fontSize: '0.75rem', padding: '5px 10px', justifyContent: 'flex-start', textAlign: 'left' }}
              onClick={() => setFormData(p.data)}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '12px' }}>
        <div className="form-group" style={{ marginBottom: '12px' }}>
          <label className="form-label" htmlFor="tx-amount">Amount (₹)</label>
          <input
            id="tx-amount"
            type="number"
            className="form-input"
            value={formData.amount}
            onChange={(e) => handleChange('amount', e.target.value)}
            required
          />
        </div>

        <div className="form-group" style={{ marginBottom: '12px' }}>
          <label className="form-label" htmlFor="tx-receiver">Payee UPI VPA</label>
          <input
            id="tx-receiver"
            type="text"
            className="form-input"
            value={formData.receiver}
            onChange={(e) => handleChange('receiver', e.target.value)}
            required
          />
        </div>

        <div className="form-group" style={{ marginBottom: '12px' }}>
          <label className="form-label" htmlFor="tx-hist-avg">Historical Avg Spending (₹)</label>
          <input
            id="tx-hist-avg"
            type="number"
            className="form-input"
            value={formData.historical_avg_amount}
            onChange={(e) => handleChange('historical_avg_amount', e.target.value)}
          />
        </div>

        <div className="form-group" style={{ marginBottom: '12px' }}>
          <label className="form-label" htmlFor="tx-timestamp">Time / Timestamp</label>
          <input
            id="tx-timestamp"
            type="text"
            className="form-input"
            value={formData.timestamp}
            onChange={(e) => handleChange('timestamp', e.target.value)}
          />
        </div>

        <div className="form-group" style={{ marginBottom: '12px' }}>
          <label className="form-label" htmlFor="tx-device">Hardware Device ID</label>
          <input
            id="tx-device"
            type="text"
            className="form-input"
            value={formData.device_id}
            onChange={(e) => handleChange('device_id', e.target.value)}
          />
        </div>

        <div className="form-group" style={{ marginBottom: '12px' }}>
          <label className="form-label" htmlFor="tx-location">Location Cluster</label>
          <input
            id="tx-location"
            type="text"
            className="form-input"
            value={formData.location}
            onChange={(e) => handleChange('location', e.target.value)}
          />
        </div>
      </div>

      <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '10px', marginTop: '4px' }}>
        <CreditCard size={15} /> Evaluate Transaction Anomaly & z-Score
      </button>
    </form>
  );
}
