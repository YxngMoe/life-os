/** Remote JSON sync — Obsidian vault folder on droplet via /api/data */

import { lsGet, lsSetLocal, lsGetMeta, lsSetMeta, exportAllLosData } from './storage';

let pushTimer = null;
let pendingKeys = new Set();
let syncing = false;

export function onHydrated(callback) {
  window.addEventListener('los-hydrated', callback);
  return () => window.removeEventListener('los-hydrated', callback);
}

export function notifyHydrated() {
  window.dispatchEvent(new Event('los-hydrated'));
}

export function scheduleRemotePush(key) {
  pendingKeys.add(key);
  clearTimeout(pushTimer);
  pushTimer = setTimeout(() => flushRemotePush(), 1200);
}

export async function flushRemotePush() {
  if (syncing || !pendingKeys.size) return { ok: true, skipped: true };
  syncing = true;
  const keys = {};
  for (const key of pendingKeys) {
    keys[key] = lsGet(key);
  }
  pendingKeys.clear();

  try {
    const res = await fetch('/api/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ keys }),
      signal: AbortSignal.timeout(45000),
    });
    if (!res.ok) throw new Error(`Sync failed (${res.status})`);
    const now = new Date().toISOString();
    Object.keys(keys).forEach((k) => lsSetMeta(k, now));
    lsSetLocal('last_sync', now);
    return { ok: true, at: now };
  } catch (e) {
    Object.keys(keys).forEach((k) => pendingKeys.add(k));
    return { ok: false, error: e.message };
  } finally {
    syncing = false;
  }
}

export async function hydrateFromRemote() {
  try {
    const res = await fetch('/api/data', { signal: AbortSignal.timeout(45000) });
    if (!res.ok) return { ok: false, error: `Remote read ${res.status}` };
    const { keys = {} } = await res.json();
    let applied = 0;

    for (const [key, entry] of Object.entries(keys)) {
      if (!entry || entry.value === undefined) continue;
      const remoteAt = entry.updatedAt || '';
      const localAt = lsGetMeta(key) || '';
      const localVal = lsGet(key);

      if (localVal === null || !localAt || remoteAt >= localAt) {
        lsSetLocal(key, entry.value);
        lsSetMeta(key, remoteAt);
        applied += 1;
      }
    }

    if (applied) notifyHydrated();

    const localAll = exportAllLosData();
    if (Object.keys(keys).length < Object.keys(localAll).length) {
      await pushAllToRemote();
    }

    return { ok: true, applied };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

export async function pushAllToRemote() {
  pendingKeys = new Set(Object.keys(exportAllLosData()));
  return flushRemotePush();
}

export async function fullSync() {
  const pull = await hydrateFromRemote();
  const push = await pushAllToRemote();
  return { pull, push };
}
