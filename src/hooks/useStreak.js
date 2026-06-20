import { useCallback } from 'react';
import { lsGet, lsSet } from '../data/storage';
import { NON_NEGOTIABLES } from '../data/defaults';

function dateKey(d = new Date()) {
  return d.toISOString().slice(0, 10);
}

function yesterdayKey() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return dateKey(d);
}

export function useStreak(checks) {
  const updateStreak = useCallback(() => {
    const allDone = NON_NEGOTIABLES.every((item) => checks[item.id]);
    if (!allDone) return;

    const streak = lsGet('streak', { cur: 0, best: 0, last: null });
    const today = dateKey();

    if (streak.last === today) return;

    const next = { ...streak };
    if (streak.last === yesterdayKey()) {
      next.cur = (streak.cur || 0) + 1;
    } else {
      next.cur = 1;
    }
    next.best = Math.max(next.best || 0, next.cur);
    next.last = today;
    lsSet('streak', next);
    return next;
  }, [checks]);

  return { updateStreak };
}

export function getStreak() {
  return lsGet('streak', { cur: 0, best: 0, last: null });
}

export function countNonNegotiablesDone(checks) {
  return NON_NEGOTIABLES.filter((item) => checks[item.id]).length;
}
