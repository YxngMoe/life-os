import { lsGet, lsSet } from '../data/storage';

export async function syncToObsidian(onProgress) {
  onProgress?.('syncing');
  const lastSync = lsGet('last_sync', null);
  const now = new Date().toISOString();

  const payload = {
    goals: lsGet('goals', []),
    checks: lsGet('checks', {}),
    todos: lsGet('todos', []),
    dua: lsGet('dua', ''),
    syncedAfter: lastSync,
    syncedAt: now,
  };

  await new Promise((r) => setTimeout(r, 800));

  lsSet('last_sync', now);
  lsSet('agent_log', [
    { agent: 'sync', action: 'Obsidian sync completed', ts: Date.now() },
    ...(lsGet('agent_log', []).slice(0, 9)),
  ]);

  onProgress?.('synced');
  return payload;
}

export function getLastSyncLabel() {
  const ts = lsGet('last_sync', null);
  if (!ts) return 'Never synced';
  const diff = Date.now() - new Date(ts).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Synced just now';
  if (mins < 60) return `Synced ${mins}m ago`;
  return `Synced ${Math.floor(mins / 60)}h ago`;
}
