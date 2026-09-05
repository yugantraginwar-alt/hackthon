import React from 'react';
import { 
  Play, 
  AlertOctagon, 
  QrCode, 
  Globe, 
  Image as ImageIcon, 
  CheckCircle2, 
  CreditCard,
  Zap
} from 'lucide-react';

const SCENARIOS = [
  {
    id: 's1',
    num: '1',
    title: 'Fake KYC Expiry Threat',
    type: 'message',
    icon: AlertOctagon,
    expected: 'HIGH RISK (94/100)',
    description: 'Urgent SMS threatening immediate UPI deactivation with phishing link.',
    preview: '"Your KYC has expired. Your UPI will be blocked today. Verify immediately at https://sbi-kyc-update.online..."',
    payload: {
      text: 'Dear Customer, Your SBI YONO Account KYC has expired. Your UPI service will be blocked today. Verify immediately at https://sbi-kyc-update.online to avoid suspension.'
    }
  },
  {
    id: 's2',
    num: '2',
    title: 'Fake Refund QR Intent Mismatch',
    type: 'qr_demo',
    icon: QrCode,
    expected: 'HIGH RISK (Claim-Intent Mismatch)',
    description: 'Victim is told QR will deposit ₹5,000 refund, but QR payload initiates upi://pay debit.',
    preview: 'Claim: "Receive ₹5,000 Refund" ↔ Actual: upi://pay?pa=scammer.refund@ybl&am=5000',
    context_claim: 'Scan this QR code to receive refund of ₹5000 directly to your account',
  },
  {
    id: 's3',
    num: '3',
    title: 'Typosquatted Banking Domain',
    type: 'url',
    icon: Globe,
    expected: 'HIGH RISK (Phishing Typosquat)',
    description: 'Lookalike banking portal hosted on homoglyph domain (bank-examp1e.com).',
    preview: 'https://bank-examp1e.com/sbi/verify-login?token=89234',
    payload: {
      url: 'https://bank-examp1e.com/sbi/verify-login?token=89234'
    }
  },
  {
    id: 's4',
    num: '4',
    title: 'Scam Chat Screenshot (OCR Triage)',
    type: 'screenshot_demo',
    icon: ImageIcon,
    expected: 'HIGH RISK (Unified Multi-Modal)',
    description: 'Chat screenshot with fake lottery prize and urgent payment collect link.',
    preview: 'OCR pipeline extracts SMS text, runs URL heuristics, and flags prize lure.',
  },
  {
    id: 's5',
    num: '5',
    title: 'Legitimate Bank Confirmation',
    type: 'message',
    icon: CheckCircle2,
    expected: 'SAFE (0–20)',
    description: 'Standard NEFT bank credit notification with zero malicious triggers.',
    preview: '"Dear Customer, your A/c ending 4589 is credited with Rs 45,000.00 by NEFT..."',
    payload: {
      text: 'Dear Customer, your A/c ending 4589 is credited with Rs 45,000.00 on 01-Sep-2026 by NEFT. Bal: Rs 52,140.75 - State Bank of India'
    }
  },
  {
    id: 's6',
    num: '6',
    title: 'Anomalous Overnight Transfer',
    type: 'transaction',
    icon: CreditCard,
    expected: 'SUSPICIOUS / HIGH RISK',
    description: '₹28,000 payment to new recipient at 3:30 AM from unrecognized emulator device.',
    preview: 'Amount > 5x historical average, Unknown receiver, 03:30 AM, Unrecognized hardware.',
    payload: {
      amount: 28000,
      receiver: 'unknown.hacker88@ybl',
      timestamp: '2026-09-05T03:30:00Z',
      device_id: 'DEVICE_UNKNOWN_EMULATOR_X',
      location: 'DELHI_NCR',
      historical_avg_amount: 1200
    }
  }
];

export default function DemoScenarios({ onRunScenario }) {
  return (
    <div className="animate-fade-in" style={{ paddingBottom: '36px' }}>
      <div style={{ marginBottom: '24px', textAlign: 'center' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 10px',
          borderRadius: '20px',
          background: 'var(--bg-surface-1)',
          border: '1px solid var(--border-default)',
          color: 'var(--text-secondary)',
          fontSize: '0.75rem',
          fontWeight: '600',
          marginBottom: '8px'
        }}>
          <Zap size={13} /> DEMO FOR ACET Test Suite
        </div>
        <h2 style={{ fontSize: '1.65rem', fontWeight: '800', color: '#ffffff', marginBottom: '4px' }}>
          Interactive Judge Scenarios
        </h2>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '560px', margin: '0 auto', fontSize: '0.86rem' }}>
          Pre-configured vectors covering all validation scenarios for real-time risk classification.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '12px'
      }}>
        {SCENARIOS.map((sc) => {
          const Icon = sc.icon;
          return (
            <div
              key={sc.id}
              className="surface-card"
              style={{
                padding: '18px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                  <div style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '6px',
                    background: 'var(--bg-surface-2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--text-primary)'
                  }}>
                    <Icon size={16} />
                  </div>
                  <div>
                    <span className="mono" style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                      SCENARIO #{sc.num}
                    </span>
                    <h3 style={{ fontSize: '0.94rem', fontWeight: '700', color: '#ffffff' }}>{sc.title}</h3>
                  </div>
                </div>

                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '8px', lineHeight: 1.4 }}>
                  {sc.description}
                </p>

                <div style={{
                  padding: '7px 9px',
                  background: 'var(--bg-surface-0)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.74rem',
                  color: 'var(--text-secondary)',
                  marginBottom: '12px',
                  border: '1px solid var(--border-subtle)',
                  fontStyle: 'italic',
                  lineHeight: 1.35
                }}>
                  {sc.preview}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.74rem', marginBottom: '14px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Expected:</span>
                  <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{sc.expected}</span>
                </div>
              </div>

              <button
                className="btn btn-primary"
                style={{ width: '100%', padding: '8px', fontSize: '0.82rem' }}
                onClick={() => onRunScenario(sc)}
              >
                <Play size={13} fill="white" /> Run Scenario #{sc.num}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
