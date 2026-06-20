import { useState, useEffect, useCallback } from 'react';
import { lsGet, lsSet } from '../data/storage';

export function useStorage(key, initialValue) {
  const [value, setValueState] = useState(() => lsGet(key, initialValue));

  const setValue = useCallback((next) => {
    setValueState((prev) => {
      const resolved = typeof next === 'function' ? next(prev) : next;
      lsSet(key, resolved);
      return resolved;
    });
  }, [key]);

  useEffect(() => {
    const stored = lsGet(key);
    if (stored !== null) setValueState(stored);
  }, [key]);

  return [value, setValue];
}
