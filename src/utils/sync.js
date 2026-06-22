import { lsGet, lsSet } from '../data/storage';
import { fullSync, pushAllToRemote } from '../data/remoteSync';

export async function syncToObsidian(onProgress) {
  onProgress?.('syncing');
  const result = await fullSync();
  if (!result.push?.ok && !result.pull?.ok) {
    throw new Error(result.push?.error || result.pull?.error || 'Sync failed');
  }
  onProgress?.('synced');
  return result;
}

export async function pushNow() {
  return pushAllToRemote();
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
