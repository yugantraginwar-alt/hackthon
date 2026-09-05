import React, { useEffect, useState } from 'react';
import { Loader2, CheckCircle2 } from 'lucide-react';

const STAGES = [
  'Parsing input structure & metadata',
  'Extracting technical entities & payloads',
  'Evaluating deterministic security rules & threat-intel',
  'Running Risk Engine scoring & anomaly baselines',
  'Formulating explainable recommendations'
];

export default function ProcessingModal({ active }) {
  const [currentStage, setCurrentStage] = useState(0);

  useEffect(() => {
    if (!active) {
      setCurrentStage(0);
      return;
    }

    const interval = setInterval(() => {
      setCurrentStage((prev) => {
        if (prev < STAGES.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          return prev;
        }
      });
    }, 400);

    return () => clearInterval(interval);
  }, [active]);

  if (!active) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(5, 7, 10, 0.90)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      padding: '20px'
    }}>
      <div className="surface-elevated" style={{
        maxWidth: '420px',
        width: '100%',
        padding: '24px',
        boxShadow: '0 15px 35px rgba(0, 0, 0, 0.6)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '6px',
            background: 'var(--bg-surface-2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-light)'
          }}>
            <Loader2 size={18} className="animate-spin" />
          </div>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#ffffff' }}>IRIS Security Engine</h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Executing multi-stage security inspection...
            </p>
          </div>
        </div>

        {/* 5 Sequential Stages */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '18px' }}>
          {STAGES.map((text, idx) => {
            const isCompleted = idx < currentStage;
            const isActive = idx === currentStage;
            return (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '8px 10px',
                  borderRadius: 'var(--radius-md)',
                  background: isActive ? 'var(--bg-surface-2)' : isCompleted ? 'rgba(255, 255, 255, 0.02)' : 'transparent',
                  border: `1px solid ${isActive ? 'var(--border-strong)' : isCompleted ? 'var(--border-subtle)' : 'transparent'}`,
                  transition: 'all 0.18s ease'
                }}
              >
                {isCompleted ? (
                  <CheckCircle2 size={14} color="var(--risk-safe)" />
                ) : isActive ? (
                  <Loader2 size={14} color="var(--accent-light)" className="animate-spin" />
                ) : (
                  <div style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    border: '1px solid rgba(255, 255, 255, 0.15)'
                  }} />
                )}
                <span style={{
                  fontSize: '0.8rem',
                  color: isCompleted ? 'var(--text-primary)' : isActive ? '#ffffff' : 'var(--text-muted)',
                  fontWeight: isActive ? '600' : '400'
                }}>
                  {text}
                </span>
              </div>
            );
          })}
        </div>

        {/* Progress Bar */}
        <div style={{
          height: '2px',
          background: 'rgba(255, 255, 255, 0.08)',
          borderRadius: '2px',
          overflow: 'hidden'
        }}>
          <div style={{
            height: '100%',
            width: `${((currentStage + 1) / STAGES.length) * 100}%`,
            background: 'var(--accent-primary-hover)',
            transition: 'width 0.3s ease'
          }} />
        </div>
      </div>
    </div>
  );
}
