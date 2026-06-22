import { useState, useRef, useCallback } from 'react';

/** @typedef {{ id: number, message: string, status: 'active'|'done'|'error', ms: number }} ThinkingStep */

export function useAIThinking() {
  const [steps, setSteps] = useState([]);
  const [active, setActive] = useState(false);
  const startRef = useRef(0);

  const start = useCallback(() => {
    startRef.current = Date.now();
    setSteps([]);
    setActive(true);
  }, []);

  const push = useCallback((message, status = 'active') => {
    const ms = Date.now() - startRef.current;
    setSteps((prev) => {
      const closed = prev.map((s) => (s.status === 'active' ? { ...s, status: 'done' } : s));
      return [...closed, { id: Date.now(), message, status, ms }];
    });
  }, []);

  const end = useCallback(() => {
    setSteps((prev) => prev.map((s) => (s.status === 'active' ? { ...s, status: 'done' } : s)));
    setActive(false);
  }, []);

  const elapsed = active && startRef.current
    ? Date.now() - startRef.current
    : steps.length ? steps[steps.length - 1].ms : 0;

  return { steps, active, elapsed, start, push, end };
}
