/**
 * API-клиент для взаимодействия с tochilka-api.
 * Все запросы идут с credentials: 'include' (httpOnly cookie).
 */

const BASE_URL = import.meta.env.VITE_API_URL || '/api/v2';

const api = {
  async get(path) {
    const res = await fetch(`${BASE_URL}${path}`, { credentials: 'include' });
    if (!res.ok) throw new Error(`API ${res.status}: ${path}`);
    return res.json();
  },

  async post(path, body) {
    const res = await fetch(`${BASE_URL}${path}`, {
      method:      'POST',
      credentials: 'include',
      headers:     { 'Content-Type': 'application/json' },
      body:        JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`API ${res.status}: ${path}`);
    return res.json();
  },

  async patch(path, body) {
    const res = await fetch(`${BASE_URL}${path}`, {
      method:      'PATCH',
      credentials: 'include',
      headers:     { 'Content-Type': 'application/json' },
      body:        JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`API ${res.status}: ${path}`);
    return res.json();
  },

  async delete(path) {
    const res = await fetch(`${BASE_URL}${path}`, {
      method:      'DELETE',
      credentials: 'include',
    });
    if (!res.ok) throw new Error(`API ${res.status}: ${path}`);
    return res.json();
  },
};

export default api;
