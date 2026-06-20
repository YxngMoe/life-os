import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import GlassCard from '../ui/GlassCard';
import BottomSheet from '../ui/BottomSheet';
import { useStorage } from '../../hooks/useStorage';
import { NON_NEGOTIABLES } from '../../data/defaults';
import { EVENT_COLORS } from '../../data/defaults';
import { dateKey, formatShortDate, getMonthGrid, addDays } from '../../utils/dates';

export default function CalendarScreen({ editMode }) {
  const [view, setView] = useState('month');
  const [selected, setSelected] = useState(new Date());
  const [events, setEvents] = useStorage('events', {});
  const [sheetOpen, setSheetOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({ text: '', time: '09:00', color: EVENT_COLORS[0] });

  const key = dateKey(selected);
  const dayEvents = events[key] || [];
  const isToday = dateKey() === key;

  function addEvent() {
    if (!newEvent.text.trim()) return;
    setEvents((prev) => ({
      ...prev,
      [key]: [...(prev[key] || []), { id: Date.now().toString(), ...newEvent }],
    }));
    setNewEvent({ text: '', time: '09:00', color: EVENT_COLORS[0] });
    setSheetOpen(false);
  }

  function deleteEvent(id) {
    setEvents((prev) => ({ ...prev, [key]: (prev[key] || []).filter((e) => e.id !== id) }));
  }

  return (
    <motion.div className="screen" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
      <div className="screen-header">
        <h1 className="text-title2">📅 Calendar</h1>
      </div>

      <div className="segmented mb-16">
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
          <button type="button" className="glass-btn glass-btn--primary mb-16" onClick={() => setSheetOpen(true)}>
            <Plus size={16} /> Add Event
          </button>
          {dayEvents.map((ev) => (
            <GlassCard key={ev.id} accentColor={ev.color} style={{ padding: '12px 16px', marginBottom: 8 }}>
              <div className="flex justify-between">
                <div>
                  <div style={{ color: ev.color, fontWeight: 700, fontSize: 13 }}>{ev.time}</div>
                  <div>{ev.text}</div>
                </div>
                {editMode && <button type="button" onClick={() => deleteEvent(ev.id)} style={{ background: 'none', border: 'none', color: 'var(--accent-rose)', cursor: 'pointer' }}>×</button>}
              </div>
            </GlassCard>
          ))}
          {isToday && (
            <div className="mt-16">
              <div className="text-caption mb-12">Non-Negotiables</div>
              {NON_NEGOTIABLES.map((n) => (
                <GlassCard key={n.id} style={{ padding: '10px 14px', marginBottom: 6, fontSize: 13 }}>{n.label}</GlassCard>
              ))}
            </div>
          )}
        </>
      )}

      {view === 'month' && (
        <>
          <div className="flex items-center justify-between mb-16">
            <button type="button" className="glass-pill" onClick={() => setSelected(new Date(selected.getFullYear(), selected.getMonth() - 1, 1))}><ChevronLeft size={16} /></button>
            <span className="text-headline">{selected.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
            <button type="button" className="glass-pill" onClick={() => setSelected(new Date(selected.getFullYear(), selected.getMonth() + 1, 1))}><ChevronRight size={16} /></button>
          </div>
          <div className="calendar-grid mb-8">
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d) => (
              <div key={d} className="text-micro text-tertiary" style={{ textAlign: 'center', padding: 4 }}>{d}</div>
            ))}
          </div>
          <div className="calendar-grid">
            {getMonthGrid(selected).map((day, i) => {
              if (!day) return <div key={`e-${i}`} />;
              const dk = dateKey(day);
              const evs = events[dk] || [];
              const today = dateKey() === dk;
              return (
                <div
                  key={dk}
                  className={`calendar-cell ${today ? 'today' : ''}`}
                  onClick={() => { setSelected(day); setView('day'); }}
                >
                  {day.getDate()}
                  {evs.slice(0, 3).map((ev) => (
                    <div key={ev.id} className="event-pill" style={{ background: ev.color }}>{ev.text}</div>
                  ))}
                  {evs.length > 3 && <div className="text-micro text-tertiary">+{evs.length - 3}</div>}
                </div>
              );
            })}
          </div>
        </>
      )}

      {(view === 'week' || view === 'year') && (
        <GlassCard style={{ padding: 24, textAlign: 'center' }}>
          <p className="text-secondary">{view === 'week' ? 'Week view — tap a day in Month view for details' : 'Year view — 12 mini-months coming in next update'}</p>
          <button type="button" className="glass-btn mt-16" style={{ marginTop: 16 }} onClick={() => setView('month')}>Go to Month</button>
        </GlassCard>
      )}

      <BottomSheet open={sheetOpen} onClose={() => setSheetOpen(false)} title={`Add Event — ${formatShortDate(selected)}`}>
        <input className="glass-input mb-12" type="time" value={newEvent.time} onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })} />
        <input className="glass-input mb-12" placeholder="Event title" value={newEvent.text} onChange={(e) => setNewEvent({ ...newEvent, text: e.target.value })} />
        <div className="color-dots mb-16">
          {EVENT_COLORS.map((c) => (
            <button key={c} type="button" className={`color-dot ${newEvent.color === c ? 'selected' : ''}`} style={{ background: c }} onClick={() => setNewEvent({ ...newEvent, color: c })} />
          ))}
        </div>
        <div className="flex gap-8">
          <button type="button" className="glass-btn flex-1" onClick={() => setSheetOpen(false)}>Cancel</button>
          <button type="button" className="glass-btn glass-btn--primary flex-1" onClick={addEvent}>Add</button>
        </div>
      </BottomSheet>
    </motion.div>
  );
}
