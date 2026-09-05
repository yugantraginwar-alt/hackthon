const API_BASE = import.meta.env.VITE_API_URL || 'https://hackthon-yv7s.onrender.com/api';

async function fetchWithTimeout(url, options = {}, timeoutMs = 30000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return response;
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new Error('Inspection timed out. The security engine may be spinning up, please try again.');
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function checkHealth() {
  const res = await fetchWithTimeout(`${API_BASE}/health`, {}, 10000);
  if (!res.ok) throw new Error(`Health check failed: ${res.statusText}`);
  return res.json();
}

export async function analyzeMessage(text) {
  const res = await fetchWithTimeout(`${API_BASE}/analyze/message`, {
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
  const res = await fetchWithTimeout(`${API_BASE}/analyze/url`, {
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

  const res = await fetchWithTimeout(`${API_BASE}/analyze/qr`, {
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

  const res = await fetchWithTimeout(`${API_BASE}/analyze/screenshot`, {
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
  const res = await fetchWithTimeout(`${API_BASE}/analyze/transaction`, {
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
  const res = await fetchWithTimeout(`${API_BASE}/stats`, {}, 10000);
  if (!res.ok) return null;
  return res.json();
}

export async function getHistory(limit = 20) {
  const res = await fetchWithTimeout(`${API_BASE}/analysis/history?limit=${limit}`, {}, 10000);
  if (!res.ok) return [];
  return res.json();
}

export async function getAnalysisDetail(analysisId) {
  const res = await fetchWithTimeout(`${API_BASE}/analysis/${analysisId}`, {}, 10000);
  if (!res.ok) throw new Error('Analysis record not found');
  return res.json();
}

export async function getDemoScenarios() {
  const res = await fetchWithTimeout(`${API_BASE}/demo-scenarios`, {}, 10000);
  if (!res.ok) return [];
  return res.json();
}

