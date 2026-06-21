import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Zap, Target, Calendar, Flag } from 'lucide-react';
import GlassCard from '../ui/GlassCard';
import CountUp from '../ui/CountUp';
import { useStorage } from '../../hooks/useStorage';
import { TODO_CATS } from '../../data/defaults';
import { GOAL_PRIORITIES } from '../../data/goals';
import { screenEnter } from '../../utils/motion';

const FILTERS = ['all', 'today', 'critical', 'jpmc', 'business', 'personal', 'health', 'finance', 'done'];
const PRIORITY_ORDER = { critical: 0, high: 1, normal: 2 };

function isOverdue(due) {
  if (!due) return false;
  const d = new Date(due);
  d.setHours(23, 59, 59, 999);
  return d < new Date() && d.toDateString() !== new Date().toDateString();
}

function formatDue(due) {
  if (!due) return '';
  const d = new Date(due);
  const today = new Date();
  if (d.toDateString() === today.toDateString()) return 'Today';
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  if (d.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function TodoScreen() {
  const [todos, setTodos] = useStorage('todos', []);
  const [goals] = useStorage('goals', []);
  const [text, setText] = useState('');
  const [cat, setCat] = useState('today');
  const [priority, setPriority] = useState('normal');
  const [due, setDue] = useState('');
  const [goalId, setGoalId] = useState('');
  const [filter, setFilter] = useState('all');

  const activeGoals = useMemo(() => goals.filter((g) => !g.done), [goals]);

  const stats = useMemo(() => {
    const pending = todos.filter((t) => !t.done);
    return {
      pending: pending.length,
      critical: pending.filter((t) => t.priority === 'critical').length,
      overdue: pending.filter((t) => isOverdue(t.due)).length,
      doneToday: todos.filter((t) => t.done && t.completedAt && new Date(t.completedAt).toDateString() === new Date().toDateString()).length,
    };
  }, [todos]);

  const sorted = useMemo(() => {
    return [...todos].sort((a, b) => {
      if (a.done !== b.done) return a.done ? 1 : -1;
      const pa = PRIORITY_ORDER[a.priority || 'normal'] ?? 2;
      const pb = PRIORITY_ORDER[b.priority || 'normal'] ?? 2;
      if (pa !== pb) return pa - pb;
      if (a.due && b.due) return new Date(a.due) - new Date(b.due);
      if (a.due) return -1;
      if (b.due) return 1;
      return 0;
    });
  }, [todos]);

  const pending = sorted.filter((t) => {
    if (filter === 'done') return t.done;
    if (t.done) return false;
    if (filter === 'all') return true;
    if (filter === 'today') return t.cat === 'today' || (t.due && new Date(t.due).toDateString() === new Date().toDateString());
    if (filter === 'critical') return t.priority === 'critical';
    return t.cat === filter;
  });

  const completed = sorted.filter((t) => t.done && filter !== 'done');

  function add() {
    if (!text.trim()) return;
    setTodos([...todos, {
      id: Date.now().toString(),
      text: text.trim(),
      done: false,
      cat,
      priority,
      due: due || null,
      goalId: goalId || null,
      date: new Date().toDateString(),
      createdAt: Date.now(),
    }]);
    setText('');
    setDue('');
    setGoalId('');
    setPriority('normal');
  }

  function toggleDone(id) {
    setTodos(todos.map((x) => x.id === id
      ? { ...x, done: !x.done, completedAt: !x.done ? Date.now() : null }
      : x));
  }

  return (
    <motion.div className="screen" {...screenEnter}>
      <div className="flex justify-between items-center mb-16">
        <div>
          <h1 className="text-title gradient-text">✅ Mission Queue</h1>
          <p className="text-caption text-secondary">Priority · deadlines · goal-linked tasks</p>
        </div>
        <span className="glass-pill glass-pill--active"><CountUp value={stats.pending} /> pending</span>
      </div>

      <div className="todo-stats mb-16">
        <GlassCard style={{ padding: '12px 14px', textAlign: 'center' }}>
          <div className="text-micro text-tertiary">Pending</div>
          <div className="text-headline"><CountUp value={stats.pending} /></div>
        </GlassCard>
        <GlassCard accentColor="#f87171" style={{ padding: '12px 14px', textAlign: 'center' }}>
          <div className="text-micro text-tertiary">Critical</div>
          <div className="text-headline" style={{ color: '#f87171' }}><CountUp value={stats.critical} /></div>
        </GlassCard>
        <GlassCard accentColor="#fb923c" style={{ padding: '12px 14px', textAlign: 'center' }}>
          <div className="text-micro text-tertiary">Overdue</div>
          <div className="text-headline" style={{ color: stats.overdue ? '#fb923c' : 'inherit' }}><CountUp value={stats.overdue} /></div>
        </GlassCard>
        <GlassCard accentColor="#34d399" style={{ padding: '12px 14px', textAlign: 'center' }}>
          <div className="text-micro text-tertiary">Done today</div>
          <div className="text-headline" style={{ color: '#34d399' }}><CountUp value={stats.doneToday} /></div>
        </GlassCard>
      </div>

      <GlassCard className="todo-composer mb-16" style={{ padding: 14 }}>
        <input
          className="glass-input w-full mb-8"
          placeholder="What needs to get done?"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && add()}
        />
        <div className="flex gap-8 flex-wrap">
          <select className="glass-input" style={{ flex: 1, minWidth: 90 }} value={cat} onChange={(e) => setCat(e.target.value)}>
            {Object.entries(TODO_CATS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
          <select className="glass-input" style={{ flex: 1, minWidth: 90 }} value={priority} onChange={(e) => setPriority(e.target.value)}>
            {Object.entries(GOAL_PRIORITIES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
          <input type="date" className="glass-input" style={{ flex: 1, minWidth: 130 }} value={due} onChange={(e) => setDue(e.target.value)} />
        </div>
        {activeGoals.length > 0 && (
          <select className="glass-input w-full mt-8" value={goalId} onChange={(e) => setGoalId(e.target.value)}>
            <option value="">Link to goal (optional)</option>
            {activeGoals.map((g) => <option key={g.id} value={g.id}>{g.text.slice(0, 60)}{g.text.length > 60 ? '…' : ''}</option>)}
          </select>
        )}
        <button type="button" className="glass-btn glass-btn--primary glass-btn--glow w-full mt-8" onClick={add}>Deploy task</button>
      </GlassCard>

      <div className="agent-pills mb-16">
        {FILTERS.map((f) => (
          <button key={f} type="button"
            className={`glass-pill ${filter === f ? 'glass-pill--active' : ''}`}
            style={filter === f && f !== 'all' && f !== 'done' && f !== 'critical' ? { background: TODO_CATS[f]?.color + '33', borderColor: TODO_CATS[f]?.color, color: TODO_CATS[f]?.color } : filter === f && f === 'critical' ? { background: '#f8717133', borderColor: '#f87171', color: '#f87171' } : {}}
            onClick={() => setFilter(f)}>
            {f === 'all' ? 'All' : f === 'critical' ? '🔥 Critical' : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {pending.map((t) => {
        const c = TODO_CATS[t.cat] || TODO_CATS.personal;
        const pri = GOAL_PRIORITIES[t.priority || 'normal'] || GOAL_PRIORITIES.normal;
        const linkedGoal = t.goalId ? goals.find((g) => g.id === t.goalId) : null;
        const overdue = isOverdue(t.due);
        return (
          <GlassCard
            key={t.id}
            accentColor={t.priority === 'critical' ? pri.color : c.color}
            className={`todo-row ${t.priority === 'critical' ? 'todo-row--critical' : ''} ${overdue ? 'todo-row--overdue' : ''}`}
            style={{ padding: 14, marginBottom: 8 }}
          >
            <div className="flex items-center gap-12">
              <div
                className={`check-square ${t.done ? 'check-square--done' : ''}`}
                style={{ '--check-color': pri.color, cursor: 'pointer' }}
                onClick={() => toggleDone(t.id)}
              >✓</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: t.priority === 'critical' ? 600 : 400 }}>{t.text}</div>
                <div className="flex gap-6 flex-wrap" style={{ marginTop: 6 }}>
                  <span className="glass-pill" style={{ fontSize: 10, color: c.color, borderColor: c.color }}>{c.label}</span>
                  {t.priority !== 'normal' && (
                    <span className="glass-pill" style={{ fontSize: 10, color: pri.color, borderColor: pri.color }}>
                      <Flag size={9} style={{ marginRight: 3 }} />{pri.label}
                    </span>
                  )}
                  {t.due && (
                    <span className="glass-pill" style={{ fontSize: 10, color: overdue ? '#fb923c' : undefined }}>
                      <Calendar size={9} style={{ marginRight: 3 }} />{formatDue(t.due)}{overdue ? ' · overdue' : ''}
                    </span>
                  )}
                  {linkedGoal && (
                    <span className="glass-pill" style={{ fontSize: 10, color: '#6366f1' }}>
                      <Target size={9} style={{ marginRight: 3 }} />{linkedGoal.text.slice(0, 28)}{linkedGoal.text.length > 28 ? '…' : ''}
                    </span>
                  )}
                </div>
              </div>
              <button type="button" onClick={() => setTodos(todos.filter((x) => x.id !== t.id))} style={{ background: 'none', border: 'none', color: 'var(--accent-rose)', cursor: 'pointer', flexShrink: 0 }}>×</button>
            </div>
          </GlassCard>
        );
      })}

      {pending.length === 0 && filter !== 'done' && (
        <GlassCard style={{ padding: 24, textAlign: 'center', opacity: 0.7 }}>
          <Zap size={28} style={{ margin: '0 auto 8px', color: 'var(--indigo)' }} />
          <div className="text-caption">Queue clear — stack wins on your goals</div>
        </GlassCard>
      )}

      {completed.length > 0 && filter !== 'done' && (
        <>
          <div className="text-caption text-tertiary mb-12" style={{ marginTop: 20 }}>Completed ({completed.length})</div>
          {completed.slice(0, 8).map((t) => (
            <GlassCard key={t.id} style={{ padding: 12, marginBottom: 6, opacity: 0.45 }}>
              <span className="strikethrough" style={{ cursor: 'pointer' }} onClick={() => toggleDone(t.id)}>{t.text}</span>
            </GlassCard>
          ))}
        </>
      )}
    </motion.div>
  );
}
