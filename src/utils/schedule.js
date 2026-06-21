import { SCHEDULE_BLOCKS } from '../data/schedule';
import { NON_NEGOTIABLES } from '../data/defaults';
import { LIFT_DAYS, ISLAMIC_TOPICS } from '../data/defaults';
import { LIFT_DETAILS, getTodayTheme } from '../data/lifeContext';
import { getDayIndex } from './dates';

/** Parse "5:00am" / "3:30pm" → minutes from midnight */
export function parseBlockTime(timeStr) {
  if (!timeStr) return 0;
  const m = timeStr.match(/(\d{1,2}):(\d{2})\s*(am|pm)?/i);
  if (!m) return 0;
  let h = parseInt(m[1], 10);
  const min = parseInt(m[2], 10);
  const ap = (m[3] || 'am').toLowerCase();
  if (ap === 'pm' && h !== 12) h += 12;
  if (ap === 'am' && h === 12) h = 0;
  return h * 60 + min;
}

export function getCurrentBlockIndex(now = new Date()) {
  const mins = now.getHours() * 60 + now.getMinutes();
  let idx = 0;
  for (let i = 0; i < SCHEDULE_BLOCKS.length; i++) {
    if (parseBlockTime(SCHEDULE_BLOCKS[i].time) <= mins) idx = i;
  }
  return idx;
}

export function getDayMeta(date = new Date()) {
  const dayIdx = getDayIndex(date);
  const theme = getTodayTheme(dayIdx);
  return {
    dayIdx,
    lift: LIFT_DAYS[dayIdx],
    study: ISLAMIC_TOPICS[dayIdx],
    theme: theme.theme,
    liftExercises: LIFT_DETAILS[LIFT_DAYS[dayIdx]] || [],
  };
}

/** Unified agenda items for a day */
export function buildDayAgenda({ date = new Date(), schk = {}, checks = {}, dayEvents = [], todos = [] }) {
  const meta = getDayMeta(date);
  const scheduleItems = SCHEDULE_BLOCKS.map((block) => ({
    kind: 'schedule',
    id: block.id,
    time: block.time,
    title: `${block.emoji} ${block.title}`,
    subtitle: block.items.slice(0, 2).join(' · '),
    items: block.items,
    done: !!schk[block.id],
    color: block.color || 'var(--indigo)',
  }));

  const eventItems = dayEvents.map((ev) => ({
    kind: 'event',
    id: ev.id,
    time: ev.time || '—',
    title: ev.text,
    subtitle: ev.notes || '',
    color: ev.color || 'var(--violet)',
    done: false,
  }));

  const nnItems = NON_NEGOTIABLES.map((nn) => ({
    kind: 'nn',
    id: nn.id,
    time: 'All day',
    title: nn.label,
    subtitle: nn.cat,
    done: !!checks[nn.id],
    color: 'var(--amber)',
  }));

  const todoItems = todos
    .filter((t) => !t.done)
    .slice(0, 12)
    .map((t) => ({
      kind: 'todo',
      id: t.id,
      time: 'Task',
      title: t.text,
      subtitle: t.cat || 'today',
      done: false,
      color: 'var(--cyan)',
    }));

  return {
    meta,
    scheduleItems,
    eventItems,
    nnItems,
    todoItems,
    totalSchedule: scheduleItems.length,
    doneSchedule: scheduleItems.filter((i) => i.done).length,
    totalNn: nnItems.length,
    doneNn: nnItems.filter((i) => i.done).length,
  };
}
