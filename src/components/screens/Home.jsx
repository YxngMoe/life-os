import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Cloud, ChevronDown, ChevronUp } from 'lucide-react';
import GlassCard from '../ui/GlassCard';
import ArcRing from '../ui/ArcRing';
import LiveClock from '../ui/LiveClock';
import CountUp from '../ui/CountUp';
import BottomSheet from '../ui/BottomSheet';
import BuildBadge from '../ui/BuildBadge';
import GoalsCommand from '../goals/GoalsCommand';
import { useToast } from '../../context/ToastContext';
import { useStorage } from '../../hooks/useStorage';
import { getStreak, countNonNegotiablesDone, useStreak } from '../../hooks/useStreak';
import {
  NON_NEGOTIABLES, NN_COLORS, DEFAULT_QUICK_TILES, LIFT_DAYS, ISLAMIC_TOPICS,
  DEFAULT_GOALS, DEFAULT_ENC, AGENTS, TODO_CATS,
} from '../../data/defaults';
import { calcGoalProgress } from '../../data/goals';
import { SCHEDULE_BLOCKS } from '../../data/schedule';
import { getGreeting, formatDate, getDayIndex } from '../../utils/dates';
import { screenEnter } from '../../utils/motion';
import { syncToObsidian, getLastSyncLabel } from '../../utils/sync';
import {
  IDENTITY_CHIPS, DAILY_AFFIRMATION, BODY_METRICS, ABW_TRACKER, JPMC_FOCUS,
  STUDY_PROTOCOLS, MEAL_SUMMARY, LIFE_PRIORITIES, COACH_QUICK_ACTIONS,
  LIFT_DETAILS, getExperimentProgress, getTodayTheme,
} from '../../data/lifeContext';

const NN_CAT_COLOR = { prayer: 'var(--amber)', physical: 'var(--pink)', study: 'var(--indigo)', default: 'var(--violet)' };

function Confetti({ show }) {
  if (!show) return null;
  const colors = ['#6366f1', '#34d399', '#fbbf24', '#f472b6', '#2dd4bf'];
  return (
    <>
      {Array.from({ length: 15 }).map((_, i) => (
        <div key={i} className="confetti-piece" style={{
          left: `${Math.random() * 100}%`, top: 0,
          background: colors[i % colors.length],
          animationDelay: `${Math.random() * 0.3}s`,
        }} />
      ))}
    </>
  );
}

function NNItem({ item, done, onToggle, index }) {
  const [strikeW, setStrikeW] = useState(done ? 100 : 0);
  const color = NN_CAT_COLOR[item.cat] || NN_COLORS.default;

  useEffect(() => {
    if (done) setStrikeW(100);
    else setStrikeW(0);
  }, [done]);

  function handle() {
    if (navigator.vibrate) navigator.vibrate(10);
    onToggle();
  }

  return (
    <GlassCard index={index} accentColor={done ? 'var(--emerald)' : color} doneGreen={done}
      className="nn-item" onClick={handle}>
      <motion.div className={`nn-check ${done ? 'nn-check--done' : ''}`}
        animate={done ? { scale: [1, 1.18, 1] } : { scale: 1 }}
        transition={{ duration: 0.12 }}>
        {done && '✓'}
      </motion.div>
      <span className={`nn-label ${done ? 'nn-label--done' : ''}`}>
        {item.label}
        <span className="nn-strike" style={{ width: `${strikeW}%` }} />
      </span>
    </GlassCard>
  );
}

export default function Home({ onNavigate, editMode, openClawStatus, onSync, syncState, onToggleTheme, lightMode }) {
  const toast = useToast();
  const [checks, setChecks] = useStorage('checks', {});
  const [schk, setSchk] = useStorage('schk', {});
  const [todos, setTodos] = useStorage('todos', []);
  const [goals, setGoals] = useStorage('goals', DEFAULT_GOALS);
  const [tiles] = useStorage('qa', DEFAULT_QUICK_TILES);
  const [agentLog] = useStorage('agent_log', []);
  const [todoExpanded, setTodoExpanded] = useState(false);
  const [streak, setStreakState] = useState(getStreak());
  const [showFlash, setShowFlash] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [streakSheet, setStreakSheet] = useState(false);
  const [newTodo, setNewTodo] = useState('');
  const prevAllDone = useRef(false);
  const { updateStreak } = useStreak(checks);

  const dayIdx = getDayIndex();
  const nnDone = countNonNegotiablesDone(checks);
  const nnPct = Math.round((nnDone / NON_NEGOTIABLES.length) * 100);
  const activeGoals = goals.filter((g) => !g.done);
  const goalsCompletePct = goals.length ? Math.round((goals.filter((g) => g.done).length / goals.length) * 100) : 0;
  const todayTodos = todos.filter((t) => !t.done && (t.cat === 'today' || t.date === new Date().toDateString()));
  const quoteIdx = new Date().getDate() % (DEFAULT_ENC.quotes?.length || 1);
  const quote = DEFAULT_ENC.quotes[quoteIdx];
  const routineDone = SCHEDULE_BLOCKS.filter((b) => schk[b.id]).length;
  const dayProgress = Math.round((routineDone / SCHEDULE_BLOCKS.length) * 100);
  const topPriority = todayTodos[0]?.text || activeGoals[0]?.text?.slice(0, 60) || 'Complete non-negotiables';
  const exp = getExperimentProgress();
  const todayTheme = getTodayTheme(dayIdx);
  const liftExercises = LIFT_DETAILS[LIFT_DAYS[dayIdx]] || [];
  const weightPct = Math.round(((BODY_METRICS.weightCurrent - 130) / (BODY_METRICS.weightTarget - 130)) * 100);
  const abwPct = Math.round((ABW_TRACKER.capitalSaved / 75000) * 100);

  useEffect(() => {
    const updated = updateStreak();
    if (updated) setStreakState(updated);
    const allDone = nnDone === NON_NEGOTIABLES.length;
    if (allDone && !prevAllDone.current) {
      setShowFlash(true);
      setShowConfetti(true);
      toast('🔥 Day complete! Streak updated.', 'emerald');
      setTimeout(() => { setShowFlash(false); setShowConfetti(false); }, 1200);
    }
    prevAllDone.current = allDone;
  }, [checks, updateStreak, nnDone, toast]);

  function toggleCheck(id) {
    setChecks((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function toggleRoutine(id) {
    setSchk((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function addTodo() {
    if (!newTodo.trim()) return;
    setTodos((prev) => [...prev, { id: Date.now().toString(), text: newTodo.trim(), done: false, cat: 'today', date: new Date().toDateString() }]);
    setNewTodo('');
  }

  return (
    <motion.div className="screen" {...screenEnter}>
      {showFlash && <div className="flash-overlay" />}
      <Confetti show={showConfetti} />

      <div className="flex justify-between items-start mb-24">
        <div>
          <span className="screen-hero__badge" style={{ display: 'inline-block', marginBottom: 8 }}>NEURAL OS · HOME</span>
          <h1 className="text-display gradient-text">{getGreeting()}</h1>
          <p className="text-caption text-secondary" style={{ marginTop: 6 }}>{formatDate(new Date())}</p>
          <LiveClock />
          <div className="day-progress"><div className="day-progress-fill" style={{ width: `${dayProgress}%` }} /></div>
          <p className="text-micro text-tertiary" style={{ marginTop: 6 }}>{routineDone} / {SCHEDULE_BLOCKS.length} blocks · {dayProgress}%</p>
        </div>
        <div className="header-pill">
          <button type="button" className="glass-pill" style={{ border: 'none', padding: 6 }} onClick={onToggleTheme}>
            {lightMode ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button type="button" className="glass-pill" style={{ border: 'none', padding: 6 }} onClick={onSync}>
            <Cloud size={16} /> {syncState === 'syncing' ? '…' : syncState === 'synced' ? '✓' : ''}
          </button>
        </div>
      </div>

      <BuildBadge variant="prominent" className="mb-20" />

      <div className="identity-chips mb-20">
        {IDENTITY_CHIPS.map((chip) => (
          <span key={chip.label} className="identity-chip" style={{ '--chip-color': chip.color }}>
            {chip.emoji} {chip.label}
          </span>
        ))}
      </div>

      {exp.active && (
        <GlassCard index={0} className="mb-20" accentColor="var(--violet)" style={{ padding: '16px 18px' }}>
          <div className="flex justify-between items-center mb-8">
            <span className="text-micro">🚗 60-Day Discipline Experiment</span>
            <span className="glass-pill glass-pill--active">Day {exp.elapsed} / {exp.total}</span>
          </div>
          <div className="day-progress mb-8"><div className="day-progress-fill" style={{ width: `${exp.pct}%`, background: 'linear-gradient(90deg, var(--violet), #a78bfa)' }} /></div>
          <p className="text-caption text-secondary">{exp.remaining} days left · TSC base · in car by 9pm</p>
        </GlassCard>
      )}

      <GlassCard index={1} className="mb-20" accentColor="var(--indigo)" style={{ padding: '16px 18px' }}>
        <div className="text-micro mb-8">✦ Daily Affirmation</div>
        <p className="text-headline" style={{ fontSize: 16, lineHeight: 1.6 }}>{DAILY_AFFIRMATION}</p>
      </GlassCard>

      <div className="stat-row">
        <GlassCard index={0} className="stat-card" accentColor="var(--amber)" onClick={() => setStreakSheet(true)} hover>
          <div className="streak-num"><CountUp value={streak.cur || 0} /><span className="streak-fire">🔥</span></div>
          <div className="text-micro">Streak</div>
          <div className="text-micro text-tertiary" style={{ marginTop: 4 }}>
            {(streak.cur || 0) === 0 ? 'Begin today' : `Best: ${streak.best || 0} days`}
          </div>
        </GlassCard>
        <GlassCard index={1} className="stat-card">
          <ArcRing value={nnPct} color="#6366f1" />
          <div className="text-micro" style={{ marginTop: 8 }}>Today</div>
          <div className="text-micro text-secondary">{nnDone} of 15</div>
        </GlassCard>
        <GlassCard index={2} className="stat-card">
          <ArcRing value={goalsCompletePct} color="#34d399" />
          <div className="text-micro" style={{ marginTop: 8 }}>Goals</div>
          <div className="text-micro text-secondary">{activeGoals.length} active</div>
        </GlassCard>
      </div>

      <div className="stat-row mb-20">
        <GlassCard index={8} className="stat-card" accentColor="var(--pink)">
          <div className="streak-num" style={{ fontSize: 28, color: 'var(--pink)' }}><CountUp value={BODY_METRICS.weightCurrent} /></div>
          <div className="text-micro">Weight (lbs)</div>
          <div className="text-micro text-secondary">→ {BODY_METRICS.weightTarget} target</div>
          <div className="day-progress" style={{ marginTop: 8 }}><div className="day-progress-fill" style={{ width: `${Math.max(5, weightPct)}%`, background: 'var(--pink)' }} /></div>
        </GlassCard>
        <GlassCard index={9} className="stat-card" accentColor="var(--orange)" onClick={() => onNavigate('/dashboards')}>
          <div className="streak-num" style={{ fontSize: 22, color: 'var(--orange)' }}>${ABW_TRACKER.capitalSaved.toLocaleString()}</div>
          <div className="text-micro">ABW Fund</div>
          <div className="text-micro text-secondary">Goal $75K</div>
          <div className="day-progress" style={{ marginTop: 8 }}><div className="day-progress-fill" style={{ width: `${Math.max(2, abwPct)}%`, background: 'var(--orange)' }} /></div>
        </GlassCard>
        <GlassCard index={10} className="stat-card" accentColor="var(--cyan)">
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--cyan)' }}>{BODY_METRICS.calories}</div>
          <div className="text-micro">Cal / day</div>
          <div className="text-micro text-secondary">{BODY_METRICS.protein} protein</div>
        </GlassCard>
      </div>

      <GlassCard index={11} className="mb-20" accentColor="var(--teal)" style={{ padding: '16px 18px' }}>
        <div className="flex justify-between mb-12">
          <span className="text-micro">📅 {todayTheme.day} — {todayTheme.theme}</span>
          <span className="glass-pill">{JPMC_FOCUS.leetcode} LC</span>
        </div>
        <div className="focus-row"><span className="focus-dot" style={{ background: 'var(--pink)' }} />💪 <strong>{todayTheme.lift}</strong></div>
        <div className="focus-row"><span className="focus-dot" style={{ background: 'var(--amber)' }} />☾ <strong>{todayTheme.study}</strong></div>
        {liftExercises.length > 0 && (
          <div className="lift-list mt-12">
            {liftExercises.map((ex) => <span key={ex} className="glass-pill" style={{ fontSize: 11 }}>{ex}</span>)}
          </div>
        )}
      </GlassCard>

      <div className="text-micro mb-12">🧠 Study Protocols</div>
      <div className="grid-2 mb-24">
        {STUDY_PROTOCOLS.map((p, i) => (
          <GlassCard key={p.title} index={i} style={{ padding: '14px 16px' }}>
            <div style={{ fontSize: 20, marginBottom: 6 }}>{p.icon}</div>
            <div className="text-headline" style={{ fontSize: 14, marginBottom: 4 }}>{p.title}</div>
            <p className="text-caption text-secondary" style={{ fontSize: 12, lineHeight: 1.5 }}>{p.desc}</p>
          </GlassCard>
        ))}
      </div>

      <GlassCard index={12} className="mb-20" accentColor="var(--orange)" style={{ padding: '16px 18px' }}>
        <div className="flex justify-between mb-12">
          <span className="text-micro">🍗 ABW Franchise — {ABW_TRACKER.location}</span>
          <button type="button" className="glass-pill" onClick={() => onNavigate('/dashboards')}>Dashboard →</button>
        </div>
        {ABW_TRACKER.milestones.map((m) => (
          <div key={m.id} className="focus-row">
            <span className={`nn-check ${m.done ? 'nn-check--done' : ''}`} style={{ width: 16, height: 16, fontSize: 9 }}>{m.done && '✓'}</span>
            <span style={{ fontSize: 13 }}>{m.label}</span>
          </div>
        ))}
      </GlassCard>

      <GlassCard index={13} className="mb-20" accentColor="var(--cyan)" style={{ padding: '16px 18px' }}>
        <div className="text-micro mb-12">💻 JPMC This Week</div>
        {JPMC_FOCUS.weekly.map((item) => (
          <div key={item} className="focus-row">
            <span className="focus-dot" style={{ background: 'var(--cyan)' }} />
            <span style={{ fontSize: 13 }}>{item}</span>
          </div>
        ))}
        <div className="flex gap-8 mt-12" style={{ flexWrap: 'wrap' }}>
          {JPMC_FOCUS.stack.map((s) => <span key={s} className="glass-pill" style={{ fontSize: 11 }}>{s}</span>)}
        </div>
      </GlassCard>

      <div className="text-micro mb-12">🍽 Today&apos;s 9 Meals</div>
      <div className="meal-timeline mb-24">
        {MEAL_SUMMARY.map((m) => (
          <GlassCard key={m.time} style={{ padding: '10px 14px', marginBottom: 6 }}>
            <div className="flex justify-between items-center">
              <span className="text-micro" style={{ color: 'var(--amber)', minWidth: 48 }}>{m.time}</span>
              <span style={{ fontSize: 13, flex: 1, marginLeft: 10 }}>{m.meal}</span>
              <span className="text-tertiary" style={{ fontSize: 11 }}>{m.cal}</span>
            </div>
          </GlassCard>
        ))}
      </div>

      <div className="text-micro mb-12">🎯 Life Priorities</div>
      <div className="priority-grid mb-24">
        {LIFE_PRIORITIES.map((p) => (
          <GlassCard key={p.rank} accentColor="var(--indigo)" style={{ padding: '12px 14px' }}>
            <div className="text-micro" style={{ color: 'var(--indigo)' }}>#{p.rank} {p.area}</div>
            <p className="text-caption text-secondary" style={{ fontSize: 12, marginTop: 4, lineHeight: 1.45 }}>{p.focus}</p>
          </GlassCard>
        ))}
      </div>

      <GlassCard index={14} className="mission-card mb-24" style={{ padding: '16px 18px' }}>
        <div className="flex justify-between mb-12">
          <span className="text-micro">🎯 Goals Command — {goals.length} total</span>
          <button type="button" className="glass-pill glass-pill--active" onClick={() => onNavigate('/life')}>Full command →</button>
        </div>
        <GoalsCommand goals={goals} setGoals={setGoals} editMode={false} compact />
      </GlassCard>

      <GlassCard index={3} className="mb-20" accentColor="var(--amber)" style={{ padding: '18px 20px', position: 'relative' }}>
        <span className="quote-watermark">&ldquo;</span>
        <div className="text-micro" style={{ color: 'var(--amber)', marginBottom: 10 }}>✦ Today</div>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ fontStyle: 'italic', fontSize: 15, lineHeight: 1.75 }}>
          &ldquo;{quote?.t}&rdquo;
        </motion.p>
        <p style={{ color: 'var(--amber)', fontSize: 13, marginTop: 10 }}>— {quote?.a}</p>
      </GlassCard>

      <GlassCard index={4} focusGlow className="mb-20" style={{ padding: '18px 20px' }}>
        <div className="text-micro mb-16">Today&apos;s Focus</div>
        <div className="focus-row" style={{ cursor: 'pointer' }} onClick={() => onNavigate('/life')}>
          <span className="focus-dot" style={{ background: 'var(--pink)' }} />💪 Lift: <strong>{LIFT_DAYS[dayIdx]}</strong>
        </div>
        <div className="focus-row" style={{ cursor: 'pointer' }} onClick={() => onNavigate('/brain')}>
          <span className="focus-dot" style={{ background: 'var(--amber)' }} />☾ Study: <strong>{ISLAMIC_TOPICS[dayIdx]}</strong>
        </div>
        <div className="focus-row" style={{ cursor: 'pointer' }} onClick={() => onNavigate('/todo')}>
          <span className="focus-dot" style={{ background: 'var(--indigo)' }} />⭐ <strong>{topPriority}</strong>
        </div>
      </GlassCard>

      <div className="flex justify-between items-center mb-12">
        <span className="text-micro">Non-Negotiables</span>
        <span className="glass-pill glass-pill--active">{nnDone} / 15</span>
      </div>
      <div className="nn-grid mb-24">
        {NON_NEGOTIABLES.map((item, i) => (
          <NNItem key={item.id} item={item} done={!!checks[item.id]} onToggle={() => toggleCheck(item.id)} index={i} />
        ))}
      </div>

      <div className="text-micro mb-12">Quick Launch</div>
      <div className="quick-grid mb-24">
        {tiles.map((tile, i) => (
          <GlassCard key={tile.id} index={i} className="quick-tile" hover onClick={() => onNavigate(tile.dest)}>
            <span className="quick-emoji">{tile.icon}</span>
            <span className="quick-label">{tile.label}</span>
            <span className="text-tertiary" style={{ fontSize: 10 }}>→</span>
          </GlassCard>
        ))}
      </div>

      <GlassCard index={5} className="mb-20" style={{ padding: '16px 18px' }}>
        <div className="flex justify-between items-center mb-12" style={{ cursor: 'pointer' }} onClick={() => setTodoExpanded(!todoExpanded)}>
          <span className="text-micro">Today&apos;s To-Do</span>
          <div className="flex items-center gap-8">
            <span className="glass-pill glass-pill--active">{todayTodos.length}</span>
            <button type="button" className="glass-pill" onClick={(e) => { e.stopPropagation(); onNavigate('/todo'); }}>All →</button>
            {todoExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
        </div>
        <div className="flex gap-8 mb-12">
          <input className="glass-input flex-1" placeholder="Add something..." value={newTodo} onChange={(e) => setNewTodo(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addTodo()} />
          <button type="button" className="glass-btn glass-btn--primary" style={{ padding: '10px 14px', borderRadius: '50%', minWidth: 44 }} onClick={addTodo}>+</button>
        </div>
        <div className="todo-drawer" style={{ maxHeight: todoExpanded ? 200 : 0 }}>
          {todayTodos.slice(0, 7).map((t) => (
            <div key={t.id} className="flex items-center gap-12 mb-8" style={{ cursor: 'pointer' }}
              onClick={() => setTodos((prev) => prev.map((x) => x.id === t.id ? { ...x, done: !x.done } : x))}>
              <div className={`nn-check ${t.done ? 'nn-check--done' : ''}`} style={{ borderColor: 'var(--indigo)' }}>✓</div>
              <span style={{ fontSize: 14 }}>{t.text}</span>
              <span className="glass-pill" style={{ fontSize: 9, marginLeft: 'auto' }}>{TODO_CATS[t.cat]?.label || 'Today'}</span>
            </div>
          ))}
        </div>
      </GlassCard>

      <GlassCard index={6} className="mb-20" style={{ padding: '16px 18px' }}>
        <div className="flex justify-between mb-12">
          <span className="text-micro">Critical Goals</span>
          <button type="button" className="glass-pill glass-pill--active" onClick={() => onNavigate('/life')}>All {goals.length} →</button>
        </div>
        {goals.filter((g) => !g.done && g.priority === 'critical').slice(0, 6).map((g) => (
          <div key={g.id} className="focus-row" style={{ cursor: 'pointer' }} onClick={() => onNavigate('/life')}>
            <span className="focus-dot" style={{ background: 'var(--rose)' }} />
            <span style={{ fontSize: 14, flex: 1 }}>{g.text.slice(0, 70)}{g.text.length > 70 ? '…' : ''}</span>
            <span className="glass-pill" style={{ fontSize: 9 }}>{calcGoalProgress(g)}%</span>
          </div>
        ))}
      </GlassCard>

      <GlassCard index={7} className="mission-card mb-24" style={{ padding: '16px 18px' }}>
        <div className="flex justify-between mb-12">
          <span className="text-micro">🎛 Mission Control</span>
          <span className="text-micro text-tertiary">{getLastSyncLabel()}</span>
        </div>
        <div className="agent-pills mb-12">
          {AGENTS.map((a) => (
            <span key={a.id} className="agent-pill">
              <span className={`status-dot ${openClawStatus === 'connected' ? 'green' : openClawStatus === 'idle' ? 'amber' : 'red'}`} />
              {a.emoji} {a.name}
            </span>
          ))}
        </div>
        {(agentLog.slice(0, 3)).map((log, i) => (
          <div key={i} className="text-caption text-secondary mb-8">{log.action} · {Math.round((Date.now() - log.ts) / 60000)}m ago</div>
        ))}
        <div className="flex gap-8" style={{ flexWrap: 'wrap', marginTop: 12 }}>
          {COACH_QUICK_ACTIONS.map((a) => (
            <button key={a.label} type="button" className="glass-pill" onClick={() => onNavigate('/coach')}>{a.label}</button>
          ))}
        </div>
      </GlassCard>

      <div className="flex justify-between mb-12">
        <span className="text-micro">⏰ Today&apos;s Full Routine</span>
        <button type="button" className="glass-pill" onClick={() => onNavigate('/calendar')}>Day View →</button>
      </div>
      {SCHEDULE_BLOCKS.map((block, i) => {
        const done = schk[block.id];
        return (
          <GlassCard key={block.id} index={i % 5} accentColor={done ? 'var(--emerald)' : 'var(--indigo)'}
            checked={done} className="routine-card" onClick={() => toggleRoutine(block.id)}>
            <div style={{ flex: 1 }}>
              <div className="routine-time">{block.time}</div>
              <div className={`routine-title ${done ? 'strikethrough' : ''}`}>{block.emoji} {block.title}</div>
              <ul className="routine-items">
                {block.items.slice(0, 3).map((item, j) => <li key={j}>{item}</li>)}
              </ul>
            </div>
            <div className={`nn-check ${done ? 'nn-check--done' : ''}`}>{done && '✓'}</div>
          </GlassCard>
        );
      })}

      <BuildBadge variant="compact" className="mb-24" />

      <BottomSheet open={streakSheet} onClose={() => setStreakSheet(false)} title="Streak History">
        <div style={{ textAlign: 'center', padding: 20 }}>
          <div className="streak-num"><CountUp value={streak.cur || 0} /></div>
          <p className="text-caption text-secondary" style={{ marginTop: 12 }}>Current streak · Best {streak.best || 0} days</p>
        </div>
      </BottomSheet>
    </motion.div>
  );
}