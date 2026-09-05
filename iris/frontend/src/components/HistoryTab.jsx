import React, { useState, useEffect } from 'react';
import { History, Eye, RefreshCw } from 'lucide-react';
import { getHistory } from '../lib/api';

export default function HistoryTab({ onSelectAnalysis }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const data = await getHistory(50);
      setHistory(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '36px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#ffffff' }}>Audit Trail</h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            Session-scoped verification log for messages, URLs, QRs, and transactions
          </p>
        </div>
        <button className="btn btn-secondary" onClick={loadHistory} disabled={loading} style={{ padding: '7px 12px', fontSize: '0.8rem' }}>
          <RefreshCw size={13} className={loading ? 'animate-spin' : ''} /> Refresh Log
        </button>
      </div>

      {history.length === 0 ? (
        <div className="surface-card" style={{ padding: '36px 18px', textAlign: 'center' }}>
          <History size={32} color="var(--text-muted)" style={{ margin: '0 auto 8px auto' }} />
          <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#ffffff', marginBottom: '4px' }}>No Analysis Records Yet</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
            Run a scan using any of the input tabs or demo scenarios to populate the audit trail.
          </p>
        </div>
      ) : (
        <div className="surface-card" style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '10px 14px', fontWeight: '600', fontSize: '0.72rem', textTransform: 'uppercase' }}>Type</th>
                <th style={{ padding: '10px 14px', fontWeight: '600', fontSize: '0.72rem', textTransform: 'uppercase' }}>Input Reference</th>
                <th style={{ padding: '10px 14px', fontWeight: '600', fontSize: '0.72rem', textTransform: 'uppercase' }}>Score</th>
                <th style={{ padding: '10px 14px', fontWeight: '600', fontSize: '0.72rem', textTransform: 'uppercase' }}>Classification</th>
                <th style={{ padding: '10px 14px', fontWeight: '600', fontSize: '0.72rem', textTransform: 'uppercase' }}>Category</th>
                <th style={{ padding: '10px 14px', fontWeight: '600', fontSize: '0.72rem', textTransform: 'uppercase' }}>Timestamp</th>
                <th style={{ padding: '10px 14px', fontWeight: '600', fontSize: '0.72rem', textTransform: 'uppercase', textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {history.map((rec) => {
                const isHigh = rec.classification === 'HIGH_RISK';
                const isSusp = rec.classification === 'SUSPICIOUS';
                const badgeClass = isHigh ? 'badge-danger' : isSusp ? 'badge-suspicious' : 'badge-safe';

                return (
                  <tr
                    key={rec.analysis_id}
                    style={{
                      borderBottom: '1px solid var(--border-subtle)',
                      transition: 'background 0.15s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '10px 14px' }}>
                      <span className="mono" style={{
                        fontSize: '0.68rem',
                        textTransform: 'uppercase',
                        padding: '1px 5px',
                        borderRadius: '3px',
                        background: 'rgba(255,255,255,0.05)',
                        fontWeight: '600'
                      }}>
                        {rec.input_type}
                      </span>
                    </td>
                    <td style={{ padding: '10px 14px', maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      <span className="mono" style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                        {rec.sanitized_input_ref || 'N/A'}
                      </span>
                    </td>
                    <td style={{ padding: '10px 14px', fontWeight: '700' }}>
                      <span style={{ color: isHigh ? 'var(--risk-danger)' : isSusp ? 'var(--risk-suspicious)' : 'var(--risk-safe)' }}>
                        {rec.risk_score}
                      </span>
                    </td>
                    <td style={{ padding: '10px 14px' }}>
                      <span className={`badge ${badgeClass}`}>
                        {rec.classification.replace('_', ' ')}
                      </span>
                    </td>
                    <td style={{ padding: '10px 14px', color: 'var(--text-secondary)' }}>
                      {rec.scam_category ? rec.scam_category.replace('_', ' ') : '—'}
                    </td>
                    <td style={{ padding: '10px 14px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {rec.created_at ? new Date(rec.created_at).toLocaleTimeString() : '—'}
                    </td>
                    <td style={{ padding: '10px 14px', textAlign: 'right' }}>
                      <button
                        className="btn btn-secondary"
                        style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                        onClick={() => onSelectAnalysis(rec.analysis_id)}
                      >
                        <Eye size={12} /> View
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
