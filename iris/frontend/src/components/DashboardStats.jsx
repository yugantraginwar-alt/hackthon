import React, { useEffect, useState } from 'react';
import { ShieldCheck, AlertTriangle, ShieldAlert, Activity, BarChart3, Clock, RefreshCw } from 'lucide-react';
import { getStats } from '../lib/api';

export default function DashboardStats({ onViewRecord }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStatsData = async () => {
    setLoading(true);
    try {
      const data = await getStats();
      setStats(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatsData();
  }, []);

  const total = stats?.total_scans || 0;
  const safe = stats?.safe_count || 0;
  const suspicious = stats?.suspicious_count || 0;
  const highRisk = stats?.high_risk_count || 0;

  const safePct = total > 0 ? Math.round((safe / total) * 100) : 0;
  const suspPct = total > 0 ? Math.round((suspicious / total) * 100) : 0;
  const highPct = total > 0 ? Math.round((highRisk / total) * 100) : 0;

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '36px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#ffffff' }}>Security Intelligence</h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            Aggregated threat telemetry and evaluation metrics
          </p>
        </div>
        <button className="btn btn-secondary" onClick={fetchStatsData} disabled={loading} style={{ padding: '7px 12px', fontSize: '0.8rem' }}>
          <RefreshCw size={13} className={loading ? 'animate-spin' : ''} /> Refresh Telemetry
        </button>
      </div>

      {/* KPI Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
        gap: '12px',
        marginBottom: '20px'
      }}>
        <div className="surface-card" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>
              Total Scans
            </span>
            <Activity size={15} color="var(--text-secondary)" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#ffffff' }}>
            {total}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            Across 5 modalities
          </div>
        </div>

        <div className="surface-card" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>
              Safe Content
            </span>
            <ShieldCheck size={15} color="var(--risk-safe)" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#ffffff' }}>
            {safe} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: '500' }}>({safePct}%)</span>
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            Zero malicious signals
          </div>
        </div>

        <div className="surface-card" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>
              Suspicious Activity
            </span>
            <AlertTriangle size={15} color="var(--risk-suspicious)" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#ffffff' }}>
            {suspicious} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: '500' }}>({suspPct}%)</span>
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            Requires verification
          </div>
        </div>

        <div className="surface-card" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>
              High-Risk Intercepted
            </span>
            <ShieldAlert size={15} color="var(--risk-danger)" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#ffffff' }}>
            {highRisk} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: '500' }}>({highPct}%)</span>
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            Prevented credential theft
          </div>
        </div>
      </div>

      {/* Breakdown & Recent Activity */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '16px'
      }}>
        {/* Top Threat Categories */}
        <div className="surface-card" style={{ padding: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '14px' }}>
            <BarChart3 size={15} color="var(--text-secondary)" />
            <h3 style={{ fontSize: '0.94rem', fontWeight: '700', color: '#ffffff' }}>Scam Vector Breakdown</h3>
          </div>

          {stats?.top_categories && Object.keys(stats.top_categories).length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {Object.entries(stats.top_categories).map(([cat, count], idx) => {
                const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                return (
                  <div key={idx}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '3px' }}>
                      <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{cat.replace('_', ' ')}</span>
                      <span style={{ color: 'var(--text-muted)' }}>{count} scans ({pct}%)</span>
                    </div>
                    <div style={{ height: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', overflow: 'hidden' }}>
                      <div style={{
                        height: '100%',
                        width: `${pct}%`,
                        background: 'var(--accent-primary-hover)',
                        borderRadius: '2px'
                      }} />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem', padding: '14px 0' }}>
              No threat categories recorded yet. Run a scan to populate telemetry.
            </div>
          )}
        </div>

        {/* Recent Detections Feed */}
        <div className="surface-card" style={{ padding: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '14px' }}>
            <Clock size={15} color="var(--text-secondary)" />
            <h3 style={{ fontSize: '0.94rem', fontWeight: '700', color: '#ffffff' }}>Recent Detections</h3>
          </div>

          {stats?.recent_scans && stats.recent_scans.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {stats.recent_scans.map((item, idx) => {
                const isHigh = item.classification === 'HIGH_RISK';
                const isSusp = item.classification === 'SUSPICIOUS';
                return (
                  <div
                    key={idx}
                    onClick={() => onViewRecord && onViewRecord(item.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '7px 10px',
                      background: 'var(--bg-surface-0)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-subtle)',
                      cursor: 'pointer',
                      transition: 'background 0.15s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-surface-2)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'var(--bg-surface-0)'}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <span className="mono" style={{ fontSize: '0.68rem', textTransform: 'uppercase', padding: '1px 4px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px' }}>
                          {item.input_type}
                        </span>
                        <span style={{ fontSize: '0.8rem', fontWeight: '600', color: '#ffffff' }}>
                          {item.scam_category ? item.scam_category.replace('_', ' ') : 'General Scan'}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '1px' }}>
                        {item.created_at ? new Date(item.created_at).toLocaleTimeString() : 'Just now'}
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span style={{
                        fontSize: '0.82rem',
                        fontWeight: '700',
                        color: isHigh ? 'var(--risk-danger)' : isSusp ? 'var(--risk-suspicious)' : 'var(--risk-safe)'
                      }}>
                        {item.risk_score}/100
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem', padding: '14px 0' }}>
              No scan activity logged yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
