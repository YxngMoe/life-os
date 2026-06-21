import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Zap } from 'lucide-react';
import GlassCard from '../ui/GlassCard';
import ArcRing from '../ui/ArcRing';
import CountUp from '../ui/CountUp';
import { GOAL_CATEGORIES } from '../../data/defaults';
import { GOAL_PRIORITIES, calcGoalProgress, LIFE_MILESTONES } from '../../data/goals';

function MilestoneList({ milestones, onToggle, color }) {
  if (!milestones?.length) return null;
  return (
    <div className="goal-milestones">
      {milestones.map((m) => (
        <div key={m.id} className="goal-milestone-row" onClick={() => onToggle(m.id)}>
          <div className={`nn-check ${m.done ? 'nn-check--done' : ''}`} style={{ width: 16, height: 16, fontSize: 8, borderColor: color }}>{m.done && '✓'}</div>
          <span className={m.done ? 'nn-label--done' : ''} style={{ fontSize: 12 }}>{m.text}</span>
        </div>
      ))}
    </div>
  );
}

function GoalCard({ goal, onUpdate, onDelete, expanded, onExpand, editMode }) {
  const cat = GOAL_CATEGORIES.find((c) => c.id === goal.cat) || { emoji: '🎯', color: '#6366f1', label: goal.cat };
  const pri = GOAL_PRIORITIES[goal.priority] || GOAL_PRIORITIES.normal;
  const pct = calcGoalProgress(goal);

  function toggleMilestone(mid) {
    onUpdate({
      ...goal,
      milestones: goal.milestones.map((m) => (m.id === mid ? { ...m, done: !m.done } : m)),
    });
  }

  function updateMetric(field, val) {
    if (!goal.metric) return;
    onUpdate({ ...goal, metric: { ...goal.metric, [field]: +val || 0 } });
  }

  return (
    <GlassCard
      accentColor={goal.done ? 'var(--emerald)' : cat.color}
      className={`goal-card ${goal.priority === 'critical' ? 'goal-card--critical' : ''} ${goal.done ? 'goal-card--done' : ''}`}
      style={{ padding: 0, marginBottom: 10, overflow: 'hidden' }}
      hover={!goal.done}
    >
      <button type="button" className="goal-card__head" onClick={onExpand}>
        <div className="goal-card__left">
          <span className="goal-card__emoji">{cat.emoji}</span>
          <div className="goal-card__text">
            <div className={`goal-card__title ${goal.done ? 'nn-label--done' : ''}`}>{goal.text}</div>
            <div className="goal-card__meta">
              {goal.priority !== 'normal' && (
                <span className="glass-pill" style={{ fontSize: 9, color: pri.color, borderColor: pri.color }}>{pri.label}</span>
              )}
              {goal.deadline && <span className="text-micro text-tertiary">📅 {goal.deadline}</span>}
            </div>
          </div>
        </div>
        <div className="goal-card__right">
          {!goal.done && <ArcRing value={pct} color={cat.color} size={44} stroke={3} />}
          <div
            className={`nn-check ${goal.done ? 'nn-check--done' : ''}`}
            style={{ width: 22, height: 22, fontSize: 10 }}
            onClick={(e) => { e.stopPropagation(); onUpdate({ ...goal, done: !goal.done, progress: goal.done ? pct : 100 }); }}
          >{goal.done && '✓'}</div>
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div className="goal-card__body" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
            {goal.why && <p className="goal-why"><strong>Why:</strong> {goal.why}</p>}
            {goal.metric && (
              <div className="goal-metric-row">
                <span className="text-micro">Progress</span>
                <div className="flex gap-8 items-center">
                  <input className="glass-input goal-metric-input" type="number" value={goal.metric.current}
                    onChange={(e) => updateMetric('current', e.target.value)} />
                  <span className="text-micro">→ {goal.metric.target}{goal.metric.unit}</span>
                </div>
                <div className="day-progress" style={{ marginTop: 8 }}><div className="day-progress-fill" style={{ width: `${pct}%`, background: cat.color }} /></div>
              </div>
            )}
            <MilestoneList milestones={goal.milestones} onToggle={toggleMilestone} color={cat.color} />
            <div className="flex gap-8 mt-12">
              <input className="glass-input" type="range" min={0} max={100} value={goal.progress || pct}
                onChange={(e) => onUpdate({ ...goal, progress: +e.target.value })} style={{ flex: 1 }} />
              <span className="text-micro">{goal.progress || pct}%</span>
            </div>
            {editMode && (
              <button type="button" className="glass-pill" style={{ marginTop: 10, color: 'var(--rose)', fontSize: 11 }} onClick={() => onDelete(goal.id)}>Delete goal</button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </GlassCard>
  );
}

export default function GoalsCommand({ goals, setGoals, editMode, compact = false }) {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState(null);
  const [showTimeline, setShowTimeline] = useState(!compact);

  const stats = {
    total: goals.length,
    done: goals.filter((g) => g.done).length,
    critical: goals.filter((g) => !g.done && g.priority === 'critical').length,
    avg: goals.filter((g) => !g.done).length
      ? Math.round(goals.filter((g) => !g.done).reduce((s, g) => s + calcGoalProgress(g), 0) / goals.filter((g) => !g.done).length)
      : 100,
  };

  const filtered = goals.filter((g) => {
    if (search && !g.text.toLowerCase().includes(search.toLowerCase())) return false;
    if (filter === 'all') return true;
    if (filter === 'done') return g.done;
    if (filter === 'critical') return !g.done && g.priority === 'critical';
    return g.cat === filter && !g.done;
  });

  const catStats = GOAL_CATEGORIES.map((cat) => {
    const items = goals.filter((g) => g.cat === cat.id);
    const done = items.filter((g) => g.done).length;
    return { ...cat, total: items.length, done, pct: items.length ? Math.round((done / items.length) * 100) : 0 };
  }).filter((c) => c.total > 0);

  function updateGoal(updated) {
    setGoals(goals.map((g) => (g.id === updated.id ? updated : g)));
  }

  if (compact) {
    return (
      <div className="goals-compact">
        <div className="stat-row mb-16">
          {catStats.slice(0, 4).map((c) => (
            <GlassCard key={c.id} className="stat-card" accentColor={c.color} onClick={() => setFilter(c.id)} hover>
              <div style={{ fontSize: 20 }}>{c.emoji}</div>
              <ArcRing value={c.pct} color={c.color} size={40} stroke={3} />
              <div className="text-micro">{c.done}/{c.total}</div>
            </GlassCard>
          ))}
        </div>
        {goals.filter((g) => !g.done && g.priority === 'critical').slice(0, 5).map((g) => (
          <GoalCard key={g.id} goal={g} onUpdate={updateGoal} onDelete={(id) => setGoals(goals.filter((x) => x.id !== id))}
            expanded={expanded === g.id} onExpand={() => setExpanded(expanded === g.id ? null : g.id)} editMode={editMode} />
        ))}
      </div>
    );
  }

  return (
    <div className="goals-command">
      <GlassCard focusGlow className="goals-hero mb-20" style={{ padding: '20px 22px' }}>
        <div className="flex justify-between items-start">
          <div>
            <div className="text-micro" style={{ color: 'var(--indigo)' }}>🎯 GOALS COMMAND</div>
            <div className="text-display gradient-text" style={{ fontSize: 36, marginTop: 4 }}>
              <CountUp value={stats.total} /> Goals
            </div>
            <p className="text-caption text-secondary" style={{ marginTop: 6 }}>
              {stats.done} complete · {stats.critical} critical active · {stats.avg}% avg progress
            </p>
          </div>
          <ArcRing value={stats.total ? Math.round((stats.done / stats.total) * 100) : 0} color="#34d399" size={72} />
        </div>
        <div className="day-progress" style={{ marginTop: 14 }}>
          <div className="day-progress-fill" style={{ width: `${stats.total ? (stats.done / stats.total) * 100 : 0}%`, background: 'var(--emerald)' }} />
        </div>
      </GlassCard>

      <div className="goals-orbit mb-20">
        {catStats.map((c) => (
          <button key={c.id} type="button" className={`goals-orbit__chip ${filter === c.id ? 'goals-orbit__chip--active' : ''}`}
            style={{ '--orbit-color': c.color }} onClick={() => setFilter(filter === c.id ? 'all' : c.id)}>
            <span>{c.emoji}</span>
            <span className="goals-orbit__label">{c.label}</span>
            <span className="goals-orbit__pct">{c.pct}%</span>
          </button>
        ))}
      </div>

      <div className="flex gap-8 mb-16">
        <input className="glass-input flex-1" placeholder="Search goals..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <button type="button" className={`glass-pill ${filter === 'critical' ? 'glass-pill--active' : ''}`} onClick={() => setFilter(filter === 'critical' ? 'all' : 'critical')}>
          <Zap size={12} /> Critical ({stats.critical})
        </button>
        <button type="button" className={`glass-pill ${filter === 'done' ? 'glass-pill--active' : ''}`} onClick={() => setFilter(filter === 'done' ? 'all' : 'done')}>Done</button>
      </div>

      {showTimeline && (
        <GlassCard className="mb-20" accentColor="var(--violet)" style={{ padding: '16px 18px' }}>
          <div className="flex justify-between mb-12">
            <span className="text-micro">🗓 Life Timeline</span>
            <button type="button" className="glass-pill" style={{ fontSize: 10 }} onClick={() => setShowTimeline(false)}>Hide</button>
          </div>
          <div className="life-timeline">
            {LIFE_MILESTONES.map((m) => (
              <div key={m.year} className="life-timeline__year">
                <div className="life-timeline__label">{m.year}</div>
                <div className="text-headline" style={{ fontSize: 14, marginBottom: 6 }}>{m.label}</div>
                {m.items.map((item) => <div key={item} className="focus-row"><span className="focus-dot" style={{ background: 'var(--violet)' }} />{item}</div>)}
              </div>
            ))}
          </div>
        </GlassCard>
      )}

      <div className="text-micro mb-12">
        {filter === 'all' ? 'All Goals' : filter === 'critical' ? 'Critical' : filter === 'done' ? 'Completed' : GOAL_CATEGORIES.find((c) => c.id === filter)?.label}
        {' '}({filtered.length})
      </div>

      {filtered.map((g) => (
        <GoalCard key={g.id} goal={g} onUpdate={updateGoal} onDelete={(id) => setGoals(goals.filter((x) => x.id !== id))}
          expanded={expanded === g.id} onExpand={() => setExpanded(expanded === g.id ? null : g.id)} editMode={editMode} />
      ))}
    </div>
  );
}

export { calcGoalProgress };
