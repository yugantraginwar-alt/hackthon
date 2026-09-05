import React, { useState, useRef } from 'react';
import { Scan, UploadCloud, Check } from 'lucide-react';

export default function ScreenshotScannerTab({ onAnalyze }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
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
    onAnalyze(selectedFile);
  };

  return (
    <form onSubmit={handleSubmit} className="animate-fade-in">
      <div className="form-group">
        <label className="form-label">
          <span>Upload Chat / Payment Screenshot</span>
          <span className="form-hint">OCR + Link + QR Extraction</span>
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
                alt="Screenshot Preview"
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
                Click to browse or drop screenshot
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                WhatsApp chats, SMS alerts, fake receipts, or login interfaces
              </div>
            </div>
          )}
        </div>
      </div>

      <div style={{
        padding: '10px 12px',
        background: 'var(--bg-surface-0)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-subtle)',
        fontSize: '0.78rem',
        color: 'var(--text-muted)',
        marginBottom: '20px'
      }}>
        <strong style={{ color: 'var(--text-secondary)' }}>Unified Pipeline:</strong> Preprocesses image with adaptive thresholding, extracts text via OCR, parses embedded QR codes, and checks links against threat-intel heuristics.
      </div>

      <button
        type="submit"
        className="btn btn-primary"
        style={{ width: '100%', padding: '10px' }}
        disabled={!selectedFile}
      >
        <Scan size={15} /> Run Multi-Modal Screenshot Inspection
      </button>
    </form>
  );
}
