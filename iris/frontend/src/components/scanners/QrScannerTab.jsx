import React, { useState, useRef } from 'react';
import { QrCode, UploadCloud, AlertCircle, Check } from 'lucide-react';

export default function QrScannerTab({ onAnalyze }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [contextClaim, setContextClaim] = useState('');
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedFile) return;
    onAnalyze(selectedFile, contextClaim.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="animate-fade-in">
      {/* File Dropzone */}
      <div className="form-group">
        <label className="form-label">
          <span>Upload UPI QR Code Image</span>
          <span className="form-hint">PNG, JPEG, WebP</span>
        </label>

        <div
          className="dropzone-container"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />

          {previewUrl ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <img
                src={previewUrl}
                alt="QR Preview"
                style={{ maxHeight: '140px', borderRadius: '6px', border: '1px solid var(--border-default)' }}
              />
              <span style={{ fontSize: '0.78rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Check size={13} color="var(--accent-light)" /> {selectedFile?.name} (Click to change)
              </span>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '8px',
                background: 'var(--bg-surface-2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-muted)'
              }}>
                <UploadCloud size={20} />
              </div>
              <div style={{ fontWeight: '600', fontSize: '0.88rem', color: '#ffffff' }}>
                Click to browse or drop QR image here
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Supports stickers, WhatsApp forwards, or mobile camera captures
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Claim vs Intent Mismatch Input */}
      <div className="form-group" style={{
        padding: '14px',
        background: 'var(--bg-surface-0)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)'
      }}>
        <label className="form-label" htmlFor="claim-input">
          <span style={{ color: 'var(--text-primary)' }}>
            Sender's Claim / Promised Context
          </span>
          <span className="form-hint">Claim-Intent Mismatch Engine</span>
        </label>
        <input
          id="claim-input"
          type="text"
          className="form-input"
          placeholder="e.g. 'Scan this QR code to receive your ₹5,000 refund' or 'Cashback bonus'"
          value={contextClaim}
          onChange={(e) => setContextClaim(e.target.value)}
          style={{ background: 'var(--bg-input)' }}
        />
        <div style={{
          fontSize: '0.72rem',
          color: 'var(--text-muted)',
          marginTop: '6px',
          display: 'flex',
          alignItems: 'center',
          gap: '5px'
        }}>
          <AlertCircle size={12} color="var(--text-muted)" style={{ flexShrink: 0 }} />
          <span>Entering what the sender promised enables IRIS to verify whether the QR debits or credits funds.</span>
        </div>
      </div>

      {/* Quick Claim Presets */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{
          fontSize: '0.75rem',
          color: 'var(--text-muted)',
          marginBottom: '6px'
        }}>
          Quick Claim Presets:
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
          <button
            type="button"
            className="btn btn-secondary"
            style={{ fontSize: '0.72rem', padding: '4px 8px' }}
            onClick={() => setContextClaim('Scan this QR code to receive your refund of ₹5,000')}
          >
            Pre-fill: "Receive ₹5,000 refund"
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            style={{ fontSize: '0.72rem', padding: '4px 8px' }}
            onClick={() => setContextClaim('Scan to claim your cashback prize bonus')}
          >
            Pre-fill: "Claim cashback prize"
          </button>
        </div>
      </div>

      <button
        type="submit"
        className="btn btn-primary"
        style={{ width: '100%', padding: '10px' }}
        disabled={!selectedFile}
      >
        <QrCode size={15} /> Decode Payload & Verify Payment Intent
      </button>
    </form>
  );
}
