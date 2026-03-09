const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

export async function uploadFIR(file) {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch(`${API_BASE}/api/upload`, { method: 'POST', body: formData });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Upload failed' }));
    throw new Error(err.error || 'Upload failed');
  }
  return res.json();
}

export async function analyzeText(text, firId = '') {
  const res = await fetch(`${API_BASE}/api/analyze-text`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, fir_id: firId }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Analysis failed' }));
    throw new Error(err.error || 'Analysis failed');
  }
  return res.json();
}

export async function sendChatMessage(sessionId, message) {
  const res = await fetch(`${API_BASE}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ session_id: sessionId, message }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Chat failed' }));
    throw new Error(err.error || 'Chat failed');
  }
  return res.json();
}

export async function getSession(sessionId) {
  const res = await fetch(`${API_BASE}/api/session/${sessionId}`);
  if (!res.ok) throw new Error('Session not found');
  return res.json();
}

export async function getAnalyses({ page = 1, limit = 20, status, search } = {}) {
  const params = new URLSearchParams({ page, limit });
  if (status && status !== 'all') params.set('status', status);
  if (search) params.set('search', search);
  const res = await fetch(`${API_BASE}/api/analyses?${params}`);
  if (!res.ok) throw new Error('Failed to fetch analyses');
  return res.json();
}

export async function getAnalytics() {
  const res = await fetch(`${API_BASE}/api/analytics`);
  if (!res.ok) throw new Error('Failed to fetch analytics');
  return res.json();
}

export async function deleteAnalysis(sessionId) {
  const res = await fetch(`${API_BASE}/api/analyses/${sessionId}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete analysis');
  return res.json();
}

export async function getHealth() {
  const res = await fetch(`${API_BASE}/api/health`);
  if (!res.ok) throw new Error('Health check failed');
  return res.json();
}
