const PREFIX = 'los_';
const META_PREFIX = 'los_meta_';

export function lsGet(key, fallback = null) {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    if (raw === null) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

/** Write local only — no remote push (used during hydrate). */
export function lsSetLocal(key, value) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch (e) {
    console.warn('localStorage write failed', key, e);
  }
}

export function lsGetMeta(key) {
  try {
    return localStorage.getItem(META_PREFIX + key) || null;
  } catch {
    return null;
  }
}

export function lsSetMeta(key, iso) {
  try {
    localStorage.setItem(META_PREFIX + key, iso);
  } catch { /* ignore */ }
}

let remotePush = null;

export function bindRemotePush(fn) {
  remotePush = fn;
}

export function lsSet(key, value) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
    const now = new Date().toISOString();
    lsSetMeta(key, now);
    remotePush?.(key);
  } catch (e) {
    console.warn('localStorage write failed', key, e);
  }
}

export function initStorage(defaults) {
  Object.entries(defaults).forEach(([key, value]) => {
    if (lsGet(key) === null) lsSetLocal(key, value);
  });
}

export function exportAllLosData() {
  const data = {};
  for (let i = 0; i < localStorage.length; i += 1) {
    const k = localStorage.key(i);
    if (k?.startsWith(PREFIX) && !k.startsWith(META_PREFIX)) {
      try {
        data[k.slice(PREFIX.length)] = JSON.parse(localStorage.getItem(k));
      } catch { /* skip */ }
    }
  }
  return data;
}

export function getSubjectNotes(id) {
  return lsGet(`n_${id}`, []);
}

export function setSubjectNotes(id, data) {
  lsSet(`n_${id}`, data);
}

export function getSubjectCards(id) {
  return lsGet(`f_${id}`, []);
}

export function setSubjectCards(id, data) {
  lsSet(`f_${id}`, data);
}

export function getSubjectConnections(id) {
  return lsGet(`c_${id}`, []);
}

export function setSubjectConnections(id, data) {
  lsSet(`c_${id}`, data);
}

export function getSubjectTasks(id) {
  return lsGet(`st_${id}`, []);
}

export function setSubjectTasks(id, data) {
  lsSet(`st_${id}`, data);
}

export function getDashboardComponents(id) {
  return lsGet(`dc_${id}`, []);
}

export function setDashboardComponents(id, data) {
  lsSet(`dc_${id}`, data);
}

export function getAgentChat(agentId) {
  return lsGet(`chat_${agentId}`, []);
}

export function setAgentChat(agentId, data) {
  lsSet(`chat_${agentId}`, data);
}

export function migrateLegacyKeys() {
  const legacy = [
    ['home_tiles_v1', 'qa'],
    ['los_checks', 'checks'],
  ];
  legacy.forEach(([oldKey, newKey]) => {
    try {
      const raw = localStorage.getItem(oldKey);
      if (raw && lsGet(newKey) === null) {
        localStorage.setItem(PREFIX + newKey, raw);
      }
    } catch { /* ignore */ }
  });
}
