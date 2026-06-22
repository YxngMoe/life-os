/** Proxy → Life OS data sync server on droplet */

import { SECRETS } from './secrets.js';

const SYNC_URL = SECRETS.DATA_SYNC_URL || 'http://67.205.162.212:18790';
const TOKEN = SECRETS.DATA_SYNC_TOKEN || SECRETS.OPENCLAW_GATEWAY_TOKEN || '';

async function upstream(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
    ...options.headers,
  };
  const res = await fetch(`${SYNC_URL}${path}`, { ...options, headers, signal: AbortSignal.timeout(60000) });
  const text = await res.text();
  let data;
  try { data = JSON.parse(text); } catch { data = { raw: text }; }
  return { ok: res.ok, status: res.status, data };
}

export async function dataSyncHealth() {
  return upstream('/health');
}

export async function dataSyncGetAll() {
  return upstream('/data');
}

export async function dataSyncBulk(keys) {
  return upstream('/bulk', {
    method: 'POST',
    body: JSON.stringify({ keys }),
  });
}

export function getDataSyncConfig() {
  return { url: SYNC_URL, hasToken: Boolean(TOKEN) };
}
