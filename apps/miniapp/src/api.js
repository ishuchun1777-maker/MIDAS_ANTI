// ============================================
// MIDAS API Config — Barcha URL shu yerdan
// ============================================

const RAW = import.meta.env.VITE_API_URL || 'https://api-production-35ba.up.railway.app';
export const API_BASE = RAW.endsWith('/api/v1') ? RAW : `${RAW}/api/v1`;

// Token helpers
export const getToken = () => localStorage.getItem('token');
export const setToken = (t) => localStorage.setItem('token', t);
export const clearToken = () => localStorage.removeItem('token');

// Auth headers
export const authHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getToken()}`
});

// Generic fetch wrapper
export async function api(path, options = {}) {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, {
    headers: authHeaders(),
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Xato yuz berdi' }));
    throw new Error(err.detail || `HTTP ${res.status}`);
  }
  return res.json();
}

// Auth
export const authApi = {
  telegramLogin: (initData) =>
    fetch(`${API_BASE}/auth/telegram-webapp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ init_data: initData }),
    }).then(r => r.json()),
};

// Profiles
export const profileApi = {
  getMe: () => api('/profiles/me'),
  createBuyer: () => api('/profiles/buyer', { method: 'POST' }),
  createSeller: () => api('/profiles/seller', { method: 'POST' }),
};

// Inventory
export const inventoryApi = {
  getMyAssets: () => api('/inventory/assets/mine'),
  createAsset: (data) => api('/inventory/assets', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateAsset: (id, data) => api(`/inventory/assets/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),
  deleteAsset: (id) => api(`/inventory/assets/${id}`, { method: 'DELETE' }),
};

// Discovery
export const discoveryApi = {
  getAssets: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return api(`/discovery/assets${q ? '?' + q : ''}`);
  },
};

// Shortlist
export const shortlistApi = {
  getAll: () => api('/shortlist/'),
  addItem: (assetId) => api('/shortlist/', {
    method: 'POST',
    body: JSON.stringify({ media_asset_id: assetId }),
  }),
  removeItem: (id) => api(`/shortlist/${id}`, { method: 'DELETE' }),
};

// Offers
export const offerApi = {
  getAll: (type = 'all') => api(`/offers/?type=${type}`),
  create: (data) => api('/offers/', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  accept: (id) => api(`/offers/${id}/accept`, { method: 'PATCH' }),
  reject: (id) => api(`/offers/${id}/reject`, { method: 'PATCH' }),
};

// Deals
export const dealApi = {
  getAll: () => api('/deals/'),
  getOne: (id) => api(`/deals/${id}`),
};

// Chat
export const chatApi = {
  getRooms: () => api('/chats/rooms/'),
  getMessages: (roomId) => api(`/chats/rooms/${roomId}/messages/`),
  sendMessage: (roomId, text) => api(`/chats/rooms/${roomId}/messages/`, {
    method: 'POST',
    body: JSON.stringify({ text, message_type: 'text' }),
  }),
};
