import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import GlassCard from '../ui/GlassCard';
import { useStorage } from '../../hooks/useStorage';
import { DEFAULT_GOALS, GOAL_CATEGORIES } from '../../data/defaults';
import { compressFiles } from '../../utils/compress';
import { screenEnter } from '../../utils/motion';

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

  const grouped = GOAL_CATEGORIES.map((cat) => ({
    ...cat,
    items: goals.filter((g) => g.cat === cat.id),
  })).filter((g) => g.items.length > 0);

  async function handlePhotos(e) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const compressed = await compressFiles(files);
    setVb((prev) => [...prev, ...compressed]);
  }

  return (
    <motion.div className="screen" {...screenEnter}>
      <div className="screen-header">
        <h1 className="text-title gradient-text">🎯 Life</h1>
        <p className="text-caption text-secondary">Goals · Dua · Vision</p>
      </div>

      <div className="segmented mb-16">
        {['goals', 'dua', 'vision'].map((t) => (
          <button key={t} type="button" className={tab === t ? 'active' : ''} onClick={() => setTab(t)}>
            {t === 'goals' && '🎯 Goals'}{t === 'dua' && '🤲 Dua'}{t === 'vision' && '🌟 Vision'}
          </button>
        ))}
      </div>

      {tab === 'goals' && (
        <>
          <GlassCard style={{ padding: 16, marginBottom: 16 }}>
            <textarea className="glass-input mb-12" placeholder="Write a goal..." value={newGoal} onChange={(e) => setNewGoal(e.target.value)} rows={3} />
            <div className="agent-pills mb-12">
              {GOAL_CATEGORIES.map((c) => (
                <button key={c.id} type="button" className={`glass-pill ${goalCat === c.id ? 'glass-pill--active' : ''}`} style={goalCat === c.id ? { borderColor: c.color, color: c.color } : {}} onClick={() => setGoalCat(c.id)}>
                  {c.emoji} {c.label}
                </button>
              ))}
            </div>
            <div className="flex gap-8">
              <button type="button" className="glass-btn" onClick={() => setNewGoal(GOAL_TEMPLATE)}>📋 Template</button>
              <button type="button" className="glass-btn glass-btn--primary" onClick={() => {
                if (!newGoal.trim()) return;
                setGoals([...goals, { id: Date.now().toString(), text: newGoal.trim(), done: false, cat: goalCat, created: Date.now() }]);
                setNewGoal('');
              }}>Add Goal</button>
            </div>
          </GlassCard>

          {grouped.map((group) => (
            <div key={group.id} className="mb-16">
              <div className="flex items-center gap-8 mb-12">
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: group.color }} />
                <span className="text-caption">{group.label} ({group.items.length})</span>
              </div>
              {group.items.map((g) => (
                <GlassCard key={g.id} accentColor={group.color} style={{ padding: 14, marginBottom: 8, opacity: g.done ? 0.4 : 1 }}>
                  <div className="flex gap-12 items-start">
                    <div
                      className={`check-square ${g.done ? 'check-square--done' : ''}`}
                      style={{ '--check-color': group.color, cursor: 'pointer' }}
                      onClick={() => setGoals(goals.map((x) => x.id === g.id ? { ...x, done: !x.done } : x))}
                    >✓</div>
                    <div style={{ flex: 1, whiteSpace: 'pre-wrap', textDecoration: g.done ? 'line-through' : 'none', fontSize: 14 }}>{g.text}</div>
                    <button type="button" onClick={() => setGoals(goals.filter((x) => x.id !== g.id))} style={{ background: 'none', border: 'none', color: 'var(--accent-rose)', cursor: 'pointer' }}>×</button>
                  </div>
                </GlassCard>
              ))}
            </div>
          ))}
        </>
      )}

      {tab === 'dua' && (
        <>
          <GlassCard accentColor="var(--accent-amber)" style={{ padding: 14, marginBottom: 12, background: 'rgba(251,191,36,0.08)' }}>
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
    </motion.div>
  );
}
