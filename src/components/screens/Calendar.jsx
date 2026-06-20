import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import GlassCard from '../ui/GlassCard';
import BottomSheet from '../ui/BottomSheet';
import { useStorage } from '../../hooks/useStorage';
import { NON_NEGOTIABLES, EVENT_COLORS } from '../../data/defaults';
import { dateKey, formatShortDate, getMonthGrid, addDays } from '../../utils/dates';
import { screenEnter } from '../../utils/motion';

const HOURS = Array.from({ length: 24 }, (_, i) => i);

function parseHour(time) {
  if (!time) return 9;
  const [h] = time.split(':').map(Number);
  return h || 0;
}

export default function CalendarScreen({ editMode }) {
  const [view, setView] = useState('day');
  const [selected, setSelected] = useState(new Date());
  const [events, setEvents] = useStorage('events', {});
  const [sheetOpen, setSheetOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({ text: '', time: '09:00', duration: 60, color: EVENT_COLORS[0], notes: '' });

  const key = dateKey(selected);
  const dayEvents = events[key] || [];
  const isToday = dateKey() === key;
  const nowHour = new Date().getHours() + new Date().getMinutes() / 60;

  const weekDays = useMemo(() => {
    const d = new Date(selected);
    const day = d.getDay();
    const mon = addDays(d, day === 0 ? -6 : 1 - day);
    return Array.from({ length: 7 }, (_, i) => addDays(mon, i));
  }, [selected]);

  function addEvent() {
    if (!newEvent.text.trim()) return;
    setEvents((prev) => ({
      ...prev,
      [key]: [...(prev[key] || []), { id: Date.now().toString(), ...newEvent }],
    }));
    setNewEvent({ text: '', time: '09:00', duration: 60, color: EVENT_COLORS[0], notes: '' });
    setSheetOpen(false);
  }

  function deleteEvent(id) {
    setEvents((prev) => ({ ...prev, [key]: (prev[key] || []).filter((e) => e.id !== id) }));
  }

  return (
    <motion.div className="screen" {...screenEnter}>
      <h1 className="text-title gradient-text mb-16">📅 Calendar</h1>

      <div className="segmented mb-20">
        {['day', 'week', 'month', 'year'].map((v) => (
          <button key={v} type="button" className={view === v ? 'active' : ''} onClick={() => setView(v)}>
            {v.charAt(0).toUpperCase() + v.slice(1)}
          </button>
        ))}
      </div>

      {view === 'day' && (
        <>
          <div className="flex items-center justify-between mb-16">
            <button type="button" className="glass-pill" onClick={() => setSelected(addDays(selected, -1))}><ChevronLeft size={16} /></button>
            <span className="text-headline">{formatShortDate(selected)}</span>
            <button type="button" className="glass-pill" onClick={() => setSelected(addDays(selected, 1))}><ChevronRight size={16} /></button>
          </div>
          <button type="button" className="glass-btn glass-btn--primary mb-16" onClick={() => setSheetOpen(true)}><Plus size={16} /> Add Event</button>

          <div className="time-grid glass-card" style={{ padding: 0, overflow: 'hidden' }}>
            {isToday && <div className="time-now-line" style={{ top: `${(nowHour / 24) * 100}%` }} />}
            {HOURS.map((h) => {
              const slotEvents = dayEvents.filter((e) => parseHour(e.time) === h);
              return (
                <div key={h} className="time-slot">
                  <div className="time-label">{h === 0 ? '12a' : h < 12 ? `${h}a` : h === 12 ? '12p' : `${h - 12}p`}</div>
                  <div className="time-content" onClick={() => { setNewEvent((e) => ({ ...e, time: `${h.toString().padStart(2, '0')}:00` })); setSheetOpen(true); }}>
                    {slotEvents.map((ev) => (
                      <div key={ev.id} className="event-block" style={{ borderColor: ev.color, background: `${ev.color}22` }}>
                        <strong>{ev.time}</strong> {ev.text}
                        {editMode && <button type="button" onClick={(e) => { e.stopPropagation(); deleteEvent(ev.id); }} style={{ float: 'right', background: 'none', border: 'none', color: 'var(--rose)', cursor: 'pointer' }}>×</button>}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {isToday && (
            <div className="mt-20">
              <div className="text-micro mb-12">Non-Negotiables</div>
              <div className="nn-grid">
                {NON_NEGOTIABLES.slice(0, 6).map((n) => (
                  <GlassCard key={n.id} style={{ padding: '10px 12px', fontSize: 12 }}>{n.label}</GlassCard>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {view === 'week' && (
        <>
          <div className="calendar-grid mb-8">
            {weekDays.map((d) => {
              const dk = dateKey(d);
              const today = dateKey() === dk;
              const evs = events[dk] || [];
              return (
                <GlassCard key={dk} accentColor={today ? 'var(--indigo)' : undefined} style={{ padding: 8, minHeight: 120, cursor: 'pointer' }} onClick={() => { setSelected(d); setView('day'); }}>
                  <div className="text-micro" style={{ color: today ? 'var(--indigo)' : undefined }}>{d.toLocaleDateString('en', { weekday: 'short' })}</div>
                  <div className="text-headline" style={{ fontSize: 16 }}>{d.getDate()}</div>
                  {evs.slice(0, 4).map((ev) => (
                    <div key={ev.id} className="event-pill" style={{ background: ev.color }}>{ev.text}</div>
                  ))}
                </GlassCard>
              );
            })}
          </div>
        </>
      )}

      {view === 'month' && (
        <>
          <div className="flex items-center justify-between mb-16">
            <button type="button" className="glass-pill" onClick={() => setSelected(new Date(selected.getFullYear(), selected.getMonth() - 1, 1))}><ChevronLeft size={16} /></button>
            <span className="text-headline">{selected.toLocaleDateString('en', { month: 'long', year: 'numeric' })}</span>
            <button type="button" className="glass-pill" onClick={() => setSelected(new Date(selected.getFullYear(), selected.getMonth() + 1, 1))}><ChevronRight size={16} /></button>
          </div>
          <div className="calendar-grid mb-8">
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d) => <div key={d} className="text-micro text-center">{d}</div>)}
          </div>
          <div className="calendar-grid">
            {getMonthGrid(selected).map((day, i) => {
              if (!day) return <div key={`e-${i}`} />;
              const dk = dateKey(day);
              const evs = events[dk] || [];
              const today = dateKey() === dk;
              return (
                <div key={dk} className={`calendar-cell ${today ? 'today' : ''}`} onClick={() => { setSelected(day); setView('day'); }}>
                  {day.getDate()}
                  {evs.slice(0, 3).map((ev) => <div key={ev.id} className="event-pill" style={{ background: ev.color }}>{ev.text}</div>)}
                  {evs.length > 3 && <div className="text-micro">+{evs.length - 3}</div>}
                </div>
              );
            })}
          </div>
        </>
      )}

      {view === 'year' && (
        <div className="grid-3">
          {Array.from({ length: 12 }, (_, m) => {
            const monthDate = new Date(selected.getFullYear(), m, 1);
            const cells = getMonthGrid(monthDate);
            const hasEvents = cells.some((d) => d && (events[dateKey(d)] || []).length);
            return (
              <GlassCard key={m} hover style={{ padding: 12, cursor: 'pointer' }} onClick={() => { setSelected(monthDate); setView('month'); }}>
                <div className="text-micro mb-8">{monthDate.toLocaleDateString('en', { month: 'short' })}</div>
                <div className="calendar-grid" style={{ gap: 2 }}>
                  {cells.slice(0, 35).map((d, i) => (
                    <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: d ? (dateKey() === dateKey(d) ? 'var(--indigo)' : hasEvents ? 'var(--teal)' : 'rgba(255,255,255,0.1)') : 'transparent' }} />
                  ))}
                </div>
              </GlassCard>
            );
          })}
        </div>
      )}

      <BottomSheet open={sheetOpen} onClose={() => setSheetOpen(false)} title={`Add Event — ${formatShortDate(selected)}`}>
        <input className="glass-input mb-12 text-headline" placeholder="Event title" value={newEvent.text} onChange={(e) => setNewEvent({ ...newEvent, text: e.target.value })} />
        <input className="glass-input mb-12" type="time" value={newEvent.time} onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })} />
        <input className="glass-input mb-12" type="number" placeholder="Duration (min)" value={newEvent.duration} onChange={(e) => setNewEvent({ ...newEvent, duration: +e.target.value })} />
        <textarea className="glass-input mb-12" placeholder="Notes (optional)" value={newEvent.notes} onChange={(e) => setNewEvent({ ...newEvent, notes: e.target.value })} rows={2} />
        <div className="color-dots mb-16" style={{ display: 'flex', gap: 8 }}>
          {EVENT_COLORS.map((c) => (
            <button key={c} type="button" className={`color-dot ${newEvent.color === c ? 'selected' : ''}`} style={{ background: c, width: 28, height: 28, borderRadius: '50%', border: newEvent.color === c ? '2px solid #fff' : 'none' }} onClick={() => setNewEvent({ ...newEvent, color: c })} />
          ))}
        </div>
        <div className="flex gap-8">
          <button type="button" className="glass-btn flex-1" onClick={() => setSheetOpen(false)}>Cancel</button>
          <button type="button" className="glass-btn glass-btn--primary flex-1" onClick={addEvent}>Save</button>
        </div>
      </BottomSheet>
    </motion.div>
  );
}
