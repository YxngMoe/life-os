import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import GlassCard from '../ui/GlassCard';
import BuildBadge from '../ui/BuildBadge';
import GoalsCommand from '../goals/GoalsCommand';
import ScreenHero from '../ui/ScreenHero';
import { getGoalsStats } from '../../data/goals';
import { useStorage } from '../../hooks/useStorage';
import { DEFAULT_GOALS, GOAL_CATEGORIES } from '../../data/defaults';
import { compressFiles } from '../../utils/compress';
import { screenEnter } from '../../utils/motion';
import {
  IDENTITY, IDENTITY_CHIPS, BODY_METRICS, ABW_TRACKER, JPMC_FOCUS,
  STUDY_PROTOCOLS, MEAL_SUMMARY, SUPPLEMENTS, LIFE_PRIORITIES,
} from '../../data/lifeContext';

const GOAL_TEMPLATE = `What: 
Why (the real reason): 
How:
1.
2.
3.
Deadline: 
I'll know I succeeded when: `;

export default function LifeScreen({ editMode }) {
  const [tab, setTab] = useState('goals');
  const [goals, setGoals] = useStorage('goals', DEFAULT_GOALS);
  const [dua, setDua] = useStorage('dua', '');
  const [vb, setVb] = useStorage('vb', []);
  const [newGoal, setNewGoal] = useState('');
  const [goalCat, setGoalCat] = useState('fitness');
  const fileRef = useRef(null);

  async function handlePhotos(e) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const compressed = await compressFiles(files);
    setVb((prev) => [...prev, ...compressed]);
  }

  function addGoal() {
    if (!newGoal.trim()) return;
    setGoals([...goals, {
      id: `custom-${Date.now()}`,
      text: newGoal.trim(),
      done: false,
      cat: goalCat,
      progress: 0,
      priority: 'normal',
      deadline: '',
      why: '',
      milestones: [],
      created: Date.now(),
    }]);
    setNewGoal('');
  }

  const goalStats = getGoalsStats(goals);

  return (
    <motion.div className="screen" {...screenEnter}>
      <ScreenHero
        icon="🎯"
        title="Life Command Center"
        subtitle={`${goals.length} goals · identity · vision · full context`}
        accent="#fb923c"
        badge="LIFE MATRIX"
        stats={[
          { label: 'Active', value: goalStats.active },
          { label: 'Critical', value: goalStats.critical, color: '#f87171' },
          { label: 'Progress', value: `${goalStats.avgProgress}%`, color: '#34d399' },
        ]}
      >
        <div style={{ marginTop: 10, display: 'flex', justifyContent: 'flex-end' }}>
          <BuildBadge variant="compact" />
        </div>
      </ScreenHero>

      <div className="segmented mb-16">
        {['goals', 'dua', 'vision', 'context'].map((t) => (
          <button key={t} type="button" className={tab === t ? 'active' : ''} onClick={() => setTab(t)}>
            {t === 'goals' && '🎯 Goals'}{t === 'dua' && '🤲 Dua'}{t === 'vision' && '🌟 Vision'}{t === 'context' && '📋 Context'}
          </button>
        ))}
      </div>

      {tab === 'goals' && (
        <>
          <GlassCard style={{ padding: 16, marginBottom: 16 }}>
            <textarea className="glass-input mb-12" placeholder="Add a custom goal..." value={newGoal} onChange={(e) => setNewGoal(e.target.value)} rows={2} />
            <div className="agent-pills mb-12">
              {GOAL_CATEGORIES.map((c) => (
                <button key={c.id} type="button" className={`glass-pill ${goalCat === c.id ? 'glass-pill--active' : ''}`} style={goalCat === c.id ? { borderColor: c.color, color: c.color } : {}} onClick={() => setGoalCat(c.id)}>
                  {c.emoji} {c.label}
                </button>
              ))}
            </div>
            <div className="flex gap-8">
              <button type="button" className="glass-btn" onClick={() => setNewGoal(GOAL_TEMPLATE)}>📋 Template</button>
              <button type="button" className="glass-btn glass-btn--primary" onClick={addGoal}>Add Goal</button>
            </div>
          </GlassCard>
          <GoalsCommand goals={goals} setGoals={setGoals} editMode={editMode} />
        </>
      )}

      {tab === 'dua' && (
        <>
          <GlassCard accentColor="var(--amber)" style={{ padding: 14, marginBottom: 12, background: 'rgba(251,191,36,0.08)' }}>
            Read after Fajr and Tahajjud. Every word slowly.
          </GlassCard>
          <textarea
            className="glass-input"
            placeholder="Ya Allah, I ask you for..."
            value={dua}
            onChange={(e) => setDua(e.target.value)}
            style={{ minHeight: 420, fontSize: 16, lineHeight: 1.9 }}
          />
        </>
      )}

      {tab === 'vision' && (
        <>
          <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={handlePhotos} />
          <button type="button" className="glass-btn glass-btn--primary mb-16" onClick={() => fileRef.current?.click()}>+ Add Photos</button>
          {vb.length === 0 ? (
            <GlassCard style={{ padding: 40, textAlign: 'center' }}>
              <div style={{ fontSize: 48 }}>🌟</div>
              <h3 className="text-headline" style={{ marginTop: 12 }}>Your Vision Board</h3>
              <p className="text-secondary">Add photos of what you&apos;re working toward.</p>
            </GlassCard>
          ) : (
            <div className="vision-grid">
              {vb.map((src, i) => (
                <div key={i} style={{ position: 'relative' }} className={i % 3 === 0 ? 'tall' : 'short'}>
                  <img src={src} alt="" />
                  {editMode && (
                    <button type="button" onClick={() => setVb(vb.filter((_, j) => j !== i))} style={{ position: 'absolute', top: 4, right: 4, width: 22, height: 22, borderRadius: '50%', background: 'rgba(0,0,0,0.7)', color: '#fff', border: 'none', cursor: 'pointer' }}>×</button>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {tab === 'context' && (
        <>
          <BuildBadge variant="prominent" className="mb-16" />
          <GlassCard accentColor="var(--indigo)" style={{ padding: 16, marginBottom: 16 }}>
            <div className="text-micro mb-12">Who I Am</div>
            <div className="identity-chips mb-12">
              {IDENTITY_CHIPS.map((c) => (
                <span key={c.label} className="identity-chip" style={{ '--chip-color': c.color }}>{c.emoji} {c.label}</span>
              ))}
            </div>
            <div className="grid-2" style={{ gap: 8, fontSize: 13 }}>
              <div><span className="text-tertiary">Age</span> · {IDENTITY.age} ({IDENTITY.birthday})</div>
              <div><span className="text-tertiary">Base</span> · {IDENTITY.base}</div>
              <div><span className="text-tertiary">Job</span> · {IDENTITY.job} @ {IDENTITY.company}</div>
              <div><span className="text-tertiary">Office</span> · {IDENTITY.office}</div>
              <div><span className="text-tertiary">Partner</span> · {IDENTITY.partner}</div>
              <div><span className="text-tertiary">Living</span> · {IDENTITY.living}</div>
            </div>
          </GlassCard>

          <GlassCard style={{ padding: 16, marginBottom: 16 }}>
            <div className="text-micro mb-12">Body & Medical</div>
            <p className="text-caption mb-8">Weight: {BODY_METRICS.weightCurrent} → {BODY_METRICS.weightTarget} {BODY_METRICS.weightUnit} · Bench {BODY_METRICS.benchGoal} · Mile {BODY_METRICS.mileCurrent} → {BODY_METRICS.mileGoal}</p>
            {BODY_METRICS.medical.map((m) => <div key={m} className="focus-row"><span className="focus-dot" style={{ background: 'var(--rose)' }} />{m}</div>)}
          </GlassCard>

          <GlassCard style={{ padding: 16, marginBottom: 16 }}>
            <div className="text-micro mb-12">🍗 ABW — {ABW_TRACKER.location}</div>
            <p className="text-caption text-secondary mb-8">Startup {ABW_TRACKER.startupRange} · Target {ABW_TRACKER.capitalTarget}</p>
            {ABW_TRACKER.milestones.map((m) => (
              <div key={m.id} className="focus-row"><span className="focus-dot" style={{ background: 'var(--orange)' }} />{m.label}</div>
            ))}
          </GlassCard>

          <GlassCard style={{ padding: 16, marginBottom: 16 }}>
            <div className="text-micro mb-12">💻 JPMC Focus</div>
            {JPMC_FOCUS.weekly.map((w) => <div key={w} className="focus-row"><span className="focus-dot" style={{ background: 'var(--cyan)' }} />{w}</div>)}
          </GlassCard>

          <GlassCard style={{ padding: 16, marginBottom: 16 }}>
            <div className="text-micro mb-12">Study Protocols</div>
            {STUDY_PROTOCOLS.map((p) => (
              <div key={p.title} className="mb-12">
                <div className="text-headline" style={{ fontSize: 14 }}>{p.icon} {p.title}</div>
                <p className="text-caption text-secondary">{p.desc}</p>
              </div>
            ))}
          </GlassCard>

          <GlassCard style={{ padding: 16, marginBottom: 16 }}>
            <div className="text-micro mb-12">9 Meals + Supplements</div>
            {MEAL_SUMMARY.map((m) => (
              <div key={m.time} className="focus-row"><span className="text-micro" style={{ minWidth: 44, color: 'var(--amber)' }}>{m.time}</span>{m.meal}</div>
            ))}
            <div className="text-micro mt-12 mb-8">Morning</div>
            <div className="flex gap-8" style={{ flexWrap: 'wrap' }}>{SUPPLEMENTS.morning.map((s) => <span key={s} className="glass-pill" style={{ fontSize: 10 }}>{s}</span>)}</div>
          </GlassCard>

          <GlassCard style={{ padding: 16 }}>
            <div className="text-micro mb-12">Life Priorities</div>
            {LIFE_PRIORITIES.map((p) => (
              <div key={p.rank} className="focus-row">
                <span className="glass-pill glass-pill--active" style={{ fontSize: 10 }}>#{p.rank}</span>
                <span style={{ fontSize: 13 }}><strong>{p.area}</strong> — {p.focus}</span>
              </div>
            ))}
          </GlassCard>
        </>
      )}
    </motion.div>
  );
}
