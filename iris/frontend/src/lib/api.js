const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export async function checkHealth() {
  const res = await fetch(`${API_BASE}/health`);
  if (!res.ok) throw new Error(`Health check failed: ${res.statusText}`);
  return res.json();
}

export async function analyzeMessage(text) {
  const res = await fetch(`${API_BASE}/analyze/message`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || 'Message analysis failed');
  }
  return res.json();
}

export async function analyzeURL(url) {
  const res = await fetch(`${API_BASE}/analyze/url`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || 'URL analysis failed');
  }
  return res.json();
}

export async function analyzeQR(file, contextClaim = '') {
  const formData = new FormData();
  formData.append('file', file);
  if (contextClaim) {
    formData.append('context_claim', contextClaim);
  }

  const res = await fetch(`${API_BASE}/analyze/qr`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || 'QR analysis failed');
  }
  return res.json();
}

export async function analyzeScreenshot(file) {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${API_BASE}/analyze/screenshot`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || 'Screenshot analysis failed');
  }
  return res.json();
}

export async function analyzeTransaction(transactionData) {
  const res = await fetch(`${API_BASE}/analyze/transaction`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(transactionData),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || 'Transaction analysis failed');
  }
  return res.json();
}

export async function getStats() {
  const res = await fetch(`${API_BASE}/stats`);
  if (!res.ok) return null;
  return res.json();
}

export async function getHistory(limit = 20) {
  const res = await fetch(`${API_BASE}/analysis/history?limit=${limit}`);
  if (!res.ok) return [];
  return res.json();
}

export async function getAnalysisDetail(analysisId) {
  const res = await fetch(`${API_BASE}/analysis/${analysisId}`);
  if (!res.ok) throw new Error('Analysis record not found');
  return res.json();
}

export async function getDemoScenarios() {
  const res = await fetch(`${API_BASE}/demo-scenarios`);
  if (!res.ok) return [];
  return res.json();
}
