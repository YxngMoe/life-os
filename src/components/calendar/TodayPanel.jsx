import { motion } from 'framer-motion';
import GlassCard from '../ui/GlassCard';
import ArcRing from '../ui/ArcRing';
import { formatDate, dateKey, addDays } from '../../utils/dates';
import { buildDayAgenda, getCurrentBlockIndex } from '../../utils/schedule';
import { SCHEDULE_BLOCKS } from '../../data/schedule';

export default function TodayPanel({
  selected, onSelectDay, schk, setSchk, checks, setChecks, events, todos,
}) {
  const today = new Date();
  const todayKey = dateKey(today);
  const selectedKey = dateKey(selected);
  const isToday = todayKey === selectedKey;
  const agenda = buildDayAgenda({
    date: selected,
    schk,
    checks,
    dayEvents: events[selectedKey] || [],
    todos,
  });
  const currentBlockIdx = isToday ? getCurrentBlockIndex() : -1;
  const schedulePct = agenda.totalSchedule ? Math.round((agenda.doneSchedule / agenda.totalSchedule) * 100) : 0;
  const nnPct = agenda.totalNn ? Math.round((agenda.doneNn / agenda.totalNn) * 100) : 0;

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    const day = d.getDay();
    const monOffset = day === 0 ? -6 : 1 - day;
    return addDays(d, monOffset + i);
  });

  function toggleSchedule(id) {
    setSchk((prev) => ({ ...prev, [id]: !prev[id] }));
  }
  function toggleNn(id) {
    setChecks((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <div className="today-panel mb-24">
      {/* Week strip — today highlighted */}
      <div className="week-strip mb-16">
        {weekDays.map((d) => {
          const dk = dateKey(d);
          const isT = dk === todayKey;
          const isSel = dk === selectedKey;
          const evCount = (events[dk] || []).length;
          return (
            <button
              key={dk}
              type="button"
              className={`week-strip__day ${isT ? 'week-strip__day--today' : ''} ${isSel ? 'week-strip__day--selected' : ''}`}
              onClick={() => onSelectDay(d)}
            >
              <span className="week-strip__dow">{d.toLocaleDateString('en', { weekday: 'short' })}</span>
              <span className="week-strip__num">{d.getDate()}</span>
              {evCount > 0 && <span className="week-strip__dot" />}
            </button>
          );
        })}
      </div>

      {/* Hero — selected day */}
      <GlassCard focusGlow className="today-hero mb-16" accentColor="var(--indigo)" style={{ padding: '20px 22px' }}>
        <div className="flex justify-between items-start mb-12">
          <div>
            {isToday && <div className="today-hero__badge">TODAY</div>}
            <h2 className="text-title gradient-text" style={{ fontSize: 22 }}>
              {isToday ? 'Your Day' : formatDate(selected)}
            </h2>
            <p className="text-caption text-secondary" style={{ marginTop: 4 }}>
              {agenda.meta.theme} · 💪 {agenda.meta.lift} · ☾ {agenda.meta.study}
            </p>
          </div>
          <div className="flex gap-12">
            <div style={{ textAlign: 'center' }}>
              <ArcRing value={schedulePct} color="#6366f1" size={48} />
              <div className="text-micro" style={{ marginTop: 4 }}>Routine</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <ArcRing value={nnPct} color="#fbbf24" size={48} />
              <div className="text-micro" style={{ marginTop: 4 }}>NN</div>
            </div>
          </div>
        </div>
        <div className="day-progress">
          <div className="day-progress-fill" style={{ width: `${schedulePct}%` }} />
        </div>
        <p className="text-micro text-tertiary" style={{ marginTop: 8 }}>
          {agenda.doneSchedule}/{agenda.totalSchedule} blocks · {agenda.doneNn}/{agenda.totalNn} non-negotiables
          {agenda.eventItems.length > 0 && ` · ${agenda.eventItems.length} events`}
          {agenda.todoItems.length > 0 && ` · ${agenda.todoItems.length} tasks`}
        </p>
      </GlassCard>

      {/* Full day list */}
      <div className="text-micro mb-12">📋 Everything Today</div>
      <div className="day-agenda-list">
        {agenda.scheduleItems.map((item, i) => {
          const isCurrent = isToday && i === currentBlockIdx;
          const isPast = isToday && i < currentBlockIdx;
          return (
            <motion.div key={item.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.02 }}>
              <GlassCard
                className={`agenda-item ${isCurrent ? 'agenda-item--current' : ''} ${isPast && !item.done ? 'agenda-item--past' : ''} ${item.done ? 'agenda-item--done' : ''}`}
                accentColor={item.done ? 'var(--emerald)' : isCurrent ? 'var(--indigo)' : undefined}
                style={{ padding: '12px 16px', marginBottom: 8, cursor: 'pointer' }}
                onClick={() => toggleSchedule(item.id)}
              >
                <div className="flex items-center gap-12">
                  <span className="agenda-time">{item.time}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-headline" style={{ fontSize: 14 }}>{item.title}</div>
                    {item.subtitle && <div className="text-caption text-secondary" style={{ fontSize: 11, marginTop: 2 }}>{item.subtitle}</div>}
                  </div>
                  {isCurrent && <span className="glass-pill glass-pill--active" style={{ fontSize: 9 }}>NOW</span>}
                  <div className={`nn-check ${item.done ? 'nn-check--done' : ''}`} style={{ width: 20, height: 20, fontSize: 10, flexShrink: 0 }}>
                    {item.done && '✓'}
                  </div>
                </div>
                {isCurrent && item.items && (
                  <ul className="agenda-subitems">
                    {item.items.slice(0, 4).map((sub) => <li key={sub}>{sub}</li>)}
                  </ul>
                )}
              </GlassCard>
            </motion.div>
          );
        })}

        {agenda.eventItems.length > 0 && (
          <>
            <div className="text-micro mb-8 mt-16">📌 Custom Events</div>
            {agenda.eventItems.map((item) => (
              <GlassCard key={item.id} style={{ padding: '12px 16px', marginBottom: 8, borderLeft: `3px solid ${item.color}` }}>
                <div className="flex items-center gap-12">
                  <span className="agenda-time">{item.time}</span>
                  <span className="text-headline" style={{ fontSize: 14 }}>{item.title}</span>
                </div>
              </GlassCard>
            ))}
          </>
        )}

        <div className="text-micro mb-8 mt-16">⭐ Non-Negotiables</div>
        <div className="nn-grid mb-16">
          {agenda.nnItems.map((item) => (
            <GlassCard key={item.id} accentColor={item.done ? 'var(--emerald)' : 'var(--amber)'}
              className="nn-item" onClick={() => toggleNn(item.id)} style={{ minHeight: 48 }}>
              <div className={`nn-check ${item.done ? 'nn-check--done' : ''}`}>{item.done && '✓'}</div>
              <span className={`nn-label ${item.done ? 'nn-label--done' : ''}`} style={{ fontSize: 12 }}>{item.title}</span>
            </GlassCard>
          ))}
        </div>

        {agenda.todoItems.length > 0 && (
          <>
            <div className="text-micro mb-8">✅ Open Tasks</div>
            {agenda.todoItems.map((item) => (
              <GlassCard key={item.id} style={{ padding: '10px 14px', marginBottom: 6 }}>
                <span style={{ fontSize: 13 }}>{item.title}</span>
              </GlassCard>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

export { SCHEDULE_BLOCKS };
