import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { bindRemotePush, lsGet } from '../data/storage';
import { hydrateFromRemote, scheduleRemotePush, onHydrated } from '../data/remoteSync';

const SyncContext = createContext({
  hydrated: false,
  syncing: false,
  lastSync: null,
  refresh: () => {},
});

export function SyncProvider({ children }) {
  const [hydrated, setHydrated] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [tick, setTick] = useState(0);
  const lastSync = lsGet('last_sync', null);

  const refresh = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => {
    bindRemotePush((key) => {
      scheduleRemotePush(key);
      setSyncing(true);
      setTimeout(() => {
        setSyncing(false);
        refresh();
      }, 1500);
    });
  }, [refresh]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      await hydrateFromRemote();
      if (!cancelled) setHydrated(true);
    })();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => onHydrated(refresh), [refresh]);

  return (
    <SyncContext.Provider value={{ hydrated, syncing, lastSync, refresh, tick }}>
      {children}
    </SyncContext.Provider>
  );
}

export function useSync() {
  return useContext(SyncContext);
}
