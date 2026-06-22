import { useState, useEffect, useCallback } from 'react';
import { lsGet, lsSet } from '../data/storage';
import { useSync } from '../context/SyncContext';

export function useStorage(key, initialValue) {
  const { hydrated, tick } = useSync();
  const [value, setValueState] = useState(() => lsGet(key, initialValue));

  const setValue = useCallback((next) => {
    setValueState((prev) => {
      const resolved = typeof next === 'function' ? next(prev) : next;
      lsSet(key, resolved);
      return resolved;
    });
  }, [key]);

  useEffect(() => {
    if (!hydrated) return;
    const stored = lsGet(key);
    if (stored !== null) setValueState(stored);
  }, [key, hydrated, tick]);

  return [value, setValue];
}
