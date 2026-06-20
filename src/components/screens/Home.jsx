import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, ChevronDown, ChevronUp } from 'lucide-react';
import GlassCard from '../ui/GlassCard';
import ArcRing from '../ui/ArcRing';
import { useStorage } from '../../hooks/useStorage';
import { getStreak, countNonNegotiablesDone, useStreak } from '../../hooks/useStreak';
import {
  NON_NEGOTIABLES, DEFAULT_QUICK_TILES, LIFT_DAYS, ISLAMIC_TOPICS, DEFAULT_GOALS, DEFAULT_ENC,
} from '../../data/defaults';
import { SCHEDULE_BLOCKS } from '../../data/schedule';
import { getGreeting, formatDate, getDayIndex } from '../../utils/dates';
import { AGENTS } from '../../data/defaults';

const screenEnter = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { type: 'spring', stiffness: 400, damping: 35 },
};

export default function Home({ onNavigate, editMode, openClawStatus }) {
  const [checks, setChecks] = useStorage('checks', {});
  const [schk, setSchk] = useStorage('schk', {});
  const [todos, setTodos] = useStorage('todos', []);
  const [goals] = useStorage('goals', DEFAULT_GOALS);
  const [tiles] = useStorage('qa', DEFAULT_QUICK_TILES);
  const [lightMode, setLightMode] = useStorage('lm', false);
  const [agentLog] = useStorage('agent_log', []);
  const [todoExpanded, setTodoExpanded] = useState(false);
  const [streak, setStreakState] = useState(getStreak());
  const { updateStreak } = useStreak(checks);

  const dayIdx = getDayIndex();
  const nnDone = countNonNegotiablesDone(checks);
  const nnPct = Math.round((nnDone / NON_NEGOTIABLES.length) * 100);
  const activeGoals = goals.filter((g) => !g.done);
  const goalsPct = goals.length ? Math.round((goals.filter((g) => g.done).length / goals.length) * 100) : 0;
  const todayTodos = todos.filter((t) => !t.done && (t.cat === 'today' || t.date === new Date().toDateString()));
  const quoteIdx = new Date().getDate() % (DEFAULT_ENC.quotes?.length || 1);
  const quote = DEFAULT_ENC.quotes[quoteIdx];

  useEffect(() => {
    const updated = updateStreak();
    if (updated) setStreakState(updated);
  }, [checks, updateStreak]);

  function toggleCheck(id) {
    setChecks((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function toggleRoutine(id) {
    setSchk((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function addTodo(text) {
    if (!text.trim()) return;
    setTodos((prev) => [...prev, {
      id: Date.now().toString(), text: text.trim(), done: false, cat: 'today', date: new Date().toDateString(),
    }]);
  }

  function toggleTodo(id) {
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  }

  const topPriority = todayTodos[0]?.text || activeGoals[0]?.text || 'Complete non-negotiables';

  return (
    <motion.div className="screen" {...screenEnter}>
      <div className="flex justify-between items-start mb-20">
        <div>
          <h1 className="text-display gradient-text">{getGreeting()}</h1>
          <p className="text-secondary" style={{ marginTop: 6 }}>{formatDate(new Date())}</p>
        </div>
        <button type="button" className="glass-pill" onClick={() => setLightMode(!lightMode)}>
          {lightMode ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>

      <div className="stat-row">
        <GlassCard className="stat-card" accentColor="var(--accent-amber)">
          <div className="stat-number" style={{ color: 'var(--accent-amber)' }}>
            {streak.cur || 0} 🔥
          </div>
          <div className="text-micro text-tertiary">Streak</div>
          <div className="text-micro text-tertiary" style={{ marginTop: 4 }}>Best: {streak.best || 0} days</div>
        </GlassCard>
        <GlassCard className="stat-card">
          <ArcRing value={nnPct} color="#6366f1" />
          <div className="text-micro text-tertiary" style={{ textAlign: 'center', marginTop: 6 }}>Today</div>
          <div className="text-micro text-secondary" style={{ textAlign: 'center' }}>{nnDone} / {NON_NEGOTIABLES.length} done</div>
        </GlassCard>
        <GlassCard className="stat-card">
          <ArcRing value={100 - goalsPct} color="#34d399" />
          <div className="text-micro text-tertiary" style={{ textAlign: 'center', marginTop: 6 }}>Goals</div>
          <div className="text-micro text-secondary" style={{ textAlign: 'center' }}>{activeGoals.length} active</div>
        </GlassCard>
      </div>

      <GlassCard className="mb-16" accentColor="var(--accent-amber)" style={{ padding: '16px 18px' }}>
        <div className="text-micro" style={{ color: 'var(--accent-amber)', marginBottom: 8 }}>✦ Daily Quote</div>
        <p style={{ fontStyle: 'italic', fontSize: 15, lineHeight: 1.5 }}>&ldquo;{quote?.t}&rdquo;</p>
        <p style={{ color: 'var(--accent-amber)', fontSize: 13, marginTop: 8 }}>— {quote?.a}</p>
      </GlassCard>

      <GlassCard className="mb-16" style={{ padding: '16px 18px', boxShadow: '0 0 32px rgba(99,102,241,0.15)' }}>
        <div className="text-micro text-tertiary mb-12">Today&apos;s Focus</div>
        <div className="flex flex-col gap-8">
          <div>💪 Today&apos;s lift: <strong>{LIFT_DAYS[dayIdx]}</strong></div>
          <div>☾ Islamic study: <strong>{ISLAMIC_TOPICS[dayIdx]}</strong></div>
          <div>⭐ Top priority: <strong>{topPriority}</strong></div>
        </div>
      </GlassCard>

      <div className="section-label">
        <span className="text-caption">Non-Negotiables</span>
        <span className="glass-pill">{nnDone} / {NON_NEGOTIABLES.length}</span>
      </div>
      <div className="nn-grid mb-20">
        {NON_NEGOTIABLES.map((item) => {
          const done = checks[item.id];
          return (
            <GlassCard
              key={item.id}
              className={`nn-item ${done ? 'done' : ''}`}
              doneGreen={done}
              onClick={() => toggleCheck(item.id)}
            >
              <div className={`check-circle ${done ? 'check-circle--done' : ''}`}>
                {done && '✓'}
              </div>
              <span>{item.label}</span>
            </GlassCard>
          );
        })}
      </div>

      <div className="section-label mb-12">
        <span className="text-caption">Quick Launch</span>
      </div>
      <div className="grid-3 grid-2-md-3 mb-20">
        {tiles.map((tile) => (
          <GlassCard key={tile.id} className="quick-tile" hover onClick={() => onNavigate(tile.dest)}>
            <span className="quick-tile-emoji">{tile.icon}</span>
            <span className="quick-tile-label">{tile.label}</span>
            <span className="quick-tile-arrow">→</span>
          </GlassCard>
        ))}
      </div>

      <GlassCard className="mb-16" style={{ padding: '14px 16px' }}>
        <div className="flex justify-between items-center mb-12" style={{ cursor: 'pointer' }} onClick={() => setTodoExpanded(!todoExpanded)}>
          <span className="text-caption">Today&apos;s To-Do</span>
          <div className="flex items-center gap-8">
            <span className="glass-pill">{todayTodos.length} pending</span>
            <button type="button" className="glass-pill" onClick={(e) => { e.stopPropagation(); onNavigate('/todo'); }}>All →</button>
            {todoExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
        </div>
        <input
          className="glass-input mb-12"
          placeholder="Add task for today..."
          onKeyDown={(e) => { if (e.key === 'Enter') { addTodo(e.target.value); e.target.value = ''; } }}
        />
        {todoExpanded && todayTodos.slice(0, 7).map((t) => (
          <div key={t.id} className="flex items-center gap-12 mb-12" style={{ cursor: 'pointer' }} onClick={() => toggleTodo(t.id)}>
            <div className={`check-square ${t.done ? 'check-square--done' : ''}`} style={{ '--check-color': '#6366f1' }}>✓</div>
            <span className={t.done ? 'strikethrough opacity-45' : ''}>{t.text}</span>
          </div>
        ))}
      </GlassCard>

      <GlassCard className="mb-16" style={{ padding: '14px 16px' }}>
        <div className="section-label">
          <span className="text-caption">Active Goals</span>
          <button type="button" className="glass-pill" onClick={() => onNavigate('/life')}>See all →</button>
        </div>
        {activeGoals.slice(0, 4).map((g) => (
          <div key={g.id} className="flex items-center gap-12 mb-12">
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-indigo)', flexShrink: 0 }} />
            <span style={{ fontSize: 14 }}>{g.text}</span>
          </div>
        ))}
      </GlassCard>

      <GlassCard className="mb-16" style={{ padding: '14px 16px' }}>
        <div className="section-label">
          <span className="text-caption">🎛 Mission Control</span>
          <span className="text-micro text-tertiary">{agentLog[0] ? 'Updated recently' : 'No activity yet'}</span>
        </div>
        <div className="agent-pills mb-12">
          {AGENTS.map((a) => (
            <div key={a.id} className="agent-pill" style={{ cursor: 'default' }}>
              <span className={`agent-status-dot ${openClawStatus === 'connected' ? 'green' : openClawStatus === 'idle' ? 'amber' : 'red'}`} />
              {a.emoji} {a.name}
            </div>
          ))}
        </div>
        <div className="flex gap-8" style={{ flexWrap: 'wrap' }}>
          {['Morning Brief', 'Quiz Me', 'ABW Update', 'Log Checklist'].map((label) => (
            <button key={label} type="button" className="glass-pill" onClick={() => onNavigate('/coach')}>{label}</button>
          ))}
        </div>
      </GlassCard>

      <div className="section-label">
        <span className="text-caption">⏰ Today&apos;s Full Routine</span>
        <button type="button" className="glass-pill" onClick={() => onNavigate('/calendar')}>Day View →</button>
      </div>
      {SCHEDULE_BLOCKS.map((block) => {
        const done = schk[block.id];
        return (
          <GlassCard
            key={block.id}
            className={`routine-block ${done ? 'glass-card--checked' : ''}`}
            accentColor={done ? 'var(--accent-emerald)' : undefined}
            checked={done}
            onClick={() => toggleRoutine(block.id)}
          >
            <div className="routine-block-content">
              <div className="text-micro routine-time">{block.time}</div>
              <div className="routine-title">{block.emoji} {block.title}</div>
              <ul className="routine-items">
                {block.items.slice(0, 3).map((item, i) => <li key={i}>{item}</li>)}
                {block.items.length > 3 && <li>+{block.items.length - 3} more</li>}
              </ul>
            </div>
            <div className={`check-square ${done ? 'check-square--done' : ''}`} style={{ '--check-color': 'var(--accent-emerald)' }}>
              {done && '✓'}
            </div>
          </GlassCard>
        );
      })}
    </motion.div>
  );
}
