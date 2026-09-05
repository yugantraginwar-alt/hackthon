import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Copy, 
  Check, 
  Code, 
  AlertTriangle, 
  ShieldCheck, 
  HelpCircle,
  FileCheck,
  ShieldAlert
} from 'lucide-react';
import RiskGauge from './RiskGauge';

export default function ResultView({ result, onReset }) {
  const [copied, setCopied] = useState(false);
  const [showJson, setShowJson] = useState(false);

  if (!result) return null;

  const {
    risk_score = 0,
    classification = 'SAFE',
    scam_category = '',
    signals = [],
    reasons = [],
    recommended_actions = [],
    extracted_entities = {},
    qr_payload = null,
    input_type = 'unknown',
    created_at = ''
  } = result;

  const isHighRisk = classification === 'HIGH_RISK';
  const isSuspicious = classification === 'SUSPICIOUS';

  const handleCopyReport = () => {
    const textReport = `IRIS Security Report
Verdict: ${classification.replace('_', ' ')} (Score: ${risk_score}/100)
Category: ${scam_category ? scam_category.replace('_', ' ') : 'N/A'}
Modality: ${input_type.toUpperCase()}
Timestamp: ${created_at || new Date().toISOString()}

REASONS IDENTIFIED:
${reasons.map((r, i) => `${i + 1}. ${r}`).join('\n')}

RECOMMENDED ACTIONS:
${recommended_actions.map((a, i) => `- ${a}`).join('\n')}
`;
    navigator.clipboard.writeText(textReport);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const hasClaimIntentMismatch = signals.some(s => s.signal_name === 'CLAIM_INTENT_MISMATCH');

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '36px' }}>
      {/* Action Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '18px',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        <button className="btn btn-secondary" onClick={onReset} style={{ gap: '6px' }}>
          <ArrowLeft size={15} /> Scan Another Input
        </button>

        <div style={{ display: 'flex', gap: '6px' }}>
          <button className="btn btn-secondary" onClick={handleCopyReport}>
            {copied ? <Check size={14} color="var(--risk-safe)" /> : <Copy size={14} />}
            <span>{copied ? 'Copied' : 'Copy Report'}</span>
          </button>
          <button className="btn btn-secondary" onClick={() => setShowJson(!showJson)}>
            <Code size={14} />
            <span>{showJson ? 'Hide JSON' : 'Raw JSON'}</span>
          </button>
        </div>
      </div>

      {/* Raw JSON inspection toggle */}
      {showJson && (
        <div className="surface-card" style={{ padding: '16px', marginBottom: '18px' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: '600' }}>
            Raw API Response Payload
          </div>
          <pre className="mono" style={{ fontSize: '0.78rem', color: 'var(--text-primary)', overflowX: 'auto', maxHeight: '200px' }}>
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}

      {/* Hero Result Banner */}
      <div className="surface-card" style={{
        padding: '26px',
        marginBottom: '18px',
        borderLeft: `3px solid ${isHighRisk ? 'var(--risk-danger)' : isSuspicious ? 'var(--risk-suspicious)' : 'var(--risk-safe)'}`
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '24px',
          alignItems: 'center'
        }}>
          {/* Circular Gauge */}
          <div>
            <RiskGauge score={risk_score} classification={classification} />
          </div>

          {/* Verdict Overview */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', flexWrap: 'wrap' }}>
              <span className="badge badge-neutral">
                {input_type.toUpperCase()} SCAN
              </span>
              {scam_category && (
                <span className={`badge ${isHighRisk ? 'badge-danger' : isSuspicious ? 'badge-suspicious' : 'badge-safe'}`}>
                  {scam_category.replace('_', ' ')}
                </span>
              )}
            </div>

            <h2 style={{ fontSize: '1.65rem', fontWeight: '800', color: '#ffffff', marginBottom: '6px', letterSpacing: '-0.02em' }}>
              {isHighRisk
                ? 'High Security Risk Flagged'
                : isSuspicious
                ? 'Suspicious Patterns Detected'
                : 'Verified Safe / No Threats Detected'}
            </h2>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '12px' }}>
              {isHighRisk
                ? 'Critical security anomalies identified. Do NOT approve payment, enter your UPI PIN, or follow external links.'
                : isSuspicious
                ? 'Content exhibits unverified characteristics deviating from standard bank alerts. Exercise caution.'
                : 'No malicious signatures, lookalike domains, or payment traps detected in the evaluated input.'}
            </p>

            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Analysis ID: <span className="mono">{result.analysis_id?.slice(0, 16)}...</span>
            </div>
          </div>
        </div>
      </div>

      {/* QR Claim vs Intent Mismatch Alert */}
      {(hasClaimIntentMismatch || (qr_payload && qr_payload.direction === 'send')) && (
        <div className="surface-card" style={{
          padding: '18px 20px',
          marginBottom: '18px',
          borderLeft: '3px solid var(--risk-danger)',
          background: 'var(--bg-surface-1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <ShieldAlert size={18} color="var(--risk-danger)" />
            <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#ffffff' }}>
              QR Claim vs Payment Intent Mismatch
            </h3>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '10px',
            marginBottom: '12px'
          }}>
            <div style={{ padding: '10px 12px', background: 'var(--bg-surface-0)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '600' }}>
                Sender Claimed
              </div>
              <div style={{ fontSize: '0.88rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                "Incoming Refund / Prize / Credit"
              </div>
            </div>

            <div style={{ padding: '10px 12px', background: 'var(--risk-danger-bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--risk-danger-border)' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--risk-danger)', textTransform: 'uppercase', fontWeight: '600' }}>
                Actual QR Action
              </div>
              <div style={{ fontSize: '0.9rem', fontWeight: '800', color: 'var(--risk-danger)' }}>
                OUTGOING DEBIT (YOU SEND MONEY)
              </div>
            </div>

            {qr_payload?.amount && (
              <div style={{ padding: '10px 12px', background: 'var(--bg-surface-0)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '600' }}>
                  Pre-populated Amount
                </div>
                <div style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                  ₹{Number(qr_payload.amount).toLocaleString()}
                </div>
              </div>
            )}
          </div>

          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            <strong>Rule of UPI:</strong> You <em>never</em> scan a QR code or enter your UPI PIN to receive funds. Entering your PIN always approves an outgoing transfer from your account.
          </p>
        </div>
      )}

      {/* Two Column Section: Why IRIS Flagged This vs What You Should Do */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '16px',
        marginBottom: '18px'
      }}>
        {/* WHY THIS WAS FLAGGED */}
        <div className="surface-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <AlertTriangle size={16} color={isHighRisk ? 'var(--risk-danger)' : isSuspicious ? 'var(--risk-suspicious)' : 'var(--risk-safe)'} />
            <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#ffffff' }}>Why IRIS flagged this</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {reasons.map((reason, idx) => (
              <div key={idx} style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '8px',
                padding: '9px 11px',
                background: 'var(--bg-surface-0)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)'
              }}>
                <span style={{
                  color: isHighRisk ? 'var(--risk-danger)' : isSuspicious ? 'var(--risk-suspicious)' : 'var(--risk-safe)',
                  fontWeight: '700',
                  fontSize: '0.85rem',
                  lineHeight: '1.4'
                }}>
                  ●
                </span>
                <span style={{ fontSize: '0.84rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>
                  {reason}
                </span>
              </div>
            ))}
          </div>

          {/* Itemized Risk Contribution Badges */}
          {signals.length > 0 && (
            <div style={{ marginTop: '16px' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: '600', textTransform: 'uppercase' }}>
                Itemized Signal Contributions ({signals.length})
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                {signals.map((sig, idx) => (
                  <span
                    key={idx}
                    className="surface-subtle"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '0.72rem',
                      padding: '3px 7px'
                    }}
                  >
                    <span style={{ fontWeight: '700', color: sig.severity > 25 ? 'var(--risk-danger)' : 'var(--text-primary)' }}>
                      +{sig.severity}
                    </span>
                    <span className="mono" style={{ color: 'var(--text-secondary)' }}>{sig.signal_name}</span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.68rem' }}>({Math.round(sig.confidence * 100)}%)</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* WHAT YOU SHOULD DO */}
        <div className="surface-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <ShieldCheck size={16} color="var(--risk-safe)" />
            <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#ffffff' }}>What you should do</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {recommended_actions.map((act, idx) => (
              <div key={idx} style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '8px',
                padding: '9px 11px',
                background: 'var(--bg-surface-0)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)'
              }}>
                <Check size={15} color="var(--risk-safe)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span style={{ fontSize: '0.84rem', color: 'var(--text-primary)', lineHeight: 1.5, fontWeight: '500' }}>
                  {act}
                </span>
              </div>
            ))}
          </div>

          {/* Helpline Callout */}
          <div style={{
            marginTop: '16px',
            padding: '10px 12px',
            background: 'var(--bg-surface-0)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <HelpCircle size={16} color="var(--text-secondary)" style={{ flexShrink: 0 }} />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              If unauthorized debits occurred, contact your bank and dial <strong>1930</strong> (National Cyber Crime Helpline).
            </span>
          </div>
        </div>
      </div>

      {/* Extracted Identifiers (if any) */}
      {extracted_entities && Object.values(extracted_entities).some(v => Array.isArray(v) && v.length > 0) && (
        <div className="surface-card" style={{ padding: '16px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
            <FileCheck size={15} color="var(--text-secondary)" />
            <h4 style={{ fontSize: '0.85rem', fontWeight: '600', color: '#ffffff' }}>Extracted Technical Entities</h4>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {extracted_entities.urls?.map((url, i) => (
              <span key={i} className="mono surface-subtle" style={{ fontSize: '0.75rem', padding: '3px 7px', color: 'var(--text-primary)' }}>
                URL: {url}
              </span>
            ))}
            {extracted_entities.upi_ids?.map((vpa, i) => (
              <span key={i} className="mono surface-subtle" style={{ fontSize: '0.75rem', padding: '3px 7px', color: 'var(--text-primary)' }}>
                VPA: {vpa}
              </span>
            ))}
            {extracted_entities.phones?.map((p, i) => (
              <span key={i} className="mono surface-subtle" style={{ fontSize: '0.75rem', padding: '3px 7px' }}>
                TEL: {p}
              </span>
            ))}
            {extracted_entities.amounts?.map((a, i) => (
              <span key={i} className="mono surface-subtle" style={{ fontSize: '0.75rem', padding: '3px 7px', color: 'var(--text-primary)' }}>
                AMT: {a}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
