import { METRIKA_ID } from './constants';

/* ── UTM-параметры ──────────────────────────────────────────────────────── */
// Из app.js строки 9–22

export function captureUtmParams() {
  const KEYS = [
    'utm_source', 'utm_medium', 'utm_campaign',
    'utm_content', 'utm_term', 'utm_referrer',
  ];
  const p = new URLSearchParams(window.location.search);
  let hit = false;
  KEYS.forEach((k) => {
    const v = p.get(k);
    if (v) { sessionStorage.setItem(k, v); hit = true; }
  });
  if (hit) {
    sessionStorage.setItem('utm_captured_at', new Date().toISOString());
    sessionStorage.setItem('utm_landing_url', window.location.href);
  }
}

export function getStoredUtm() {
  return ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']
    .reduce((a, k) => {
      const v = sessionStorage.getItem(k);
      if (v) a[k] = v;
      return a;
    }, {});
}

/* ── Метрика ────────────────────────────────────────────────────────────── */

export function reachGoal(goalName, params = {}) {
  if (typeof ym === 'function') {
    try { ym(METRIKA_ID, 'reachGoal', goalName, params); } catch (_) {}
  }
}

export function track(action, params = {}) {
  const payload = { action, ...params, ...getStoredUtm(), ts: Date.now() };
  reachGoal(action, payload);
  if (
    location.hostname === 'localhost' ||
    location.hostname === '127.0.0.1'
  ) {
    console.log('[track]', action, payload);
  }
}
