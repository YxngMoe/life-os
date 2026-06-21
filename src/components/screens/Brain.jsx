import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Zap } from 'lucide-react';
import GlassCard from '../ui/GlassCard';
import ScreenHero from '../ui/ScreenHero';
import { useStorage } from '../../hooks/useStorage';
import { DEFAULT_SUBJECTS } from '../../data/defaults';
import { getSubjectNotes, getSubjectCards, getSubjectTasks } from '../../data/storage';
import SubjectDetail from './SubjectDetail';
import { screenEnter } from '../../utils/motion';

function calcMastery(notes, cards, tasks) {
  const total = notes.length + cards.length + tasks.length;
  if (!total) return 0;
  const doneTasks = tasks.filter((t) => t.done).length;
  return Math.min(100, Math.round(((notes.length * 10 + cards.length * 15 + doneTasks * 20) / Math.max(total * 15, 1)) * 100));
}

export default function BrainScreen({ editMode, onNavigate }) {
  const [subjects, setSubjects] = useStorage('subjects', DEFAULT_SUBJECTS);
  const [search, setSearch] = useState('');
  const [activeSubject, setActiveSubject] = useState(null);
  const [sortBy, setSortBy] = useState('name');

  const enriched = useMemo(() => subjects.map((s) => {
    const notes = getSubjectNotes(s.id);
    const cards = getSubjectCards(s.id);
    const tasks = getSubjectTasks(s.id);
    return { ...s, notes, cards, tasks, mastery: calcMastery(notes, cards, tasks) };
  }), [subjects]);

  const totals = useMemo(() => ({
    notes: enriched.reduce((a, s) => a + s.notes.length, 0),
    cards: enriched.reduce((a, s) => a + s.cards.length, 0),
    avgMastery: enriched.length ? Math.round(enriched.reduce((a, s) => a + s.mastery, 0) / enriched.length) : 0,
  }), [enriched]);

  const filtered = useMemo(() => {
    let list = enriched.filter((s) => s.n.toLowerCase().includes(search.toLowerCase()));
    if (sortBy === 'mastery') list = [...list].sort((a, b) => b.mastery - a.mastery);
    else if (sortBy === 'notes') list = [...list].sort((a, b) => b.notes.length - a.notes.length);
    return list;
  }, [enriched, search, sortBy]);

  if (activeSubject) {
    return (
      <SubjectDetail
        subject={activeSubject}
        onBack={() => setActiveSubject(null)}
        editMode={editMode}
      />
    );
  }

  return (
    <motion.div className="screen" {...screenEnter}>
      <ScreenHero
        icon="🧠"
        title="Neural Knowledge Hub"
        subtitle="Second brain · notes · flashcards · Feynman-ready"
        accent="#c084fc"
        badge="NEURAL LINK"
        stats={[
          { label: 'Subjects', value: subjects.length },
          { label: 'Notes', value: totals.notes },
          { label: 'Cards', value: totals.cards },
          { label: 'Mastery', value: totals.avgMastery, color: '#c084fc' },
        ]}
      />

      <div className="feature-chips">
        <button type="button" className="feature-chip" onClick={() => onNavigate?.('/coach')}>
          <Sparkles size={12} style={{ marginRight: 4 }} /> AI Study Mode
        </button>
        <button type="button" className="feature-chip" onClick={() => setSortBy('mastery')}>Sort by mastery</button>
        <button type="button" className="feature-chip" onClick={() => setSortBy('notes')}>Most notes</button>
        <button type="button" className="feature-chip" onClick={() => setSortBy('name')}>A–Z</button>
      </div>

      <input
        className="glass-input mb-16"
        placeholder="Search neural subjects..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="grid-2 grid-2-md-3">
        {filtered.map((sub, i) => (
          <GlassCard
            key={sub.id}
            accentColor={sub.c}
            holographic
            hover
            index={i}
            onClick={() => setActiveSubject(sub)}
            style={{ padding: '16px', position: 'relative', minHeight: 160 }}
          >
            <span className="subject-watermark">{sub.i}</span>
            <div style={{ fontSize: 30, marginBottom: 8 }}>{sub.i}</div>
            <div className="text-headline" style={{ marginBottom: 4 }}>{sub.n}</div>
            <div className="text-secondary" style={{ fontSize: 13, marginBottom: 10 }}>{sub.d}</div>
            <div className="flex gap-8 mb-8">
              <span className="glass-pill">{sub.notes.length} notes</span>
              <span className="glass-pill">{sub.cards.length} cards</span>
              <span className="glass-pill" style={{ color: sub.c }}>{sub.mastery}%</span>
            </div>
            <div className="brain-mastery">
              <div className="brain-mastery__fill" style={{ width: `${sub.mastery}%`, background: `linear-gradient(90deg, ${sub.c}, var(--neon2))` }} />
            </div>
            {editMode && (
              <button
                type="button"
                style={{ position: 'absolute', top: 10, right: 10, background: 'none', border: 'none', color: 'var(--rose)', cursor: 'pointer', fontSize: 18 }}
                onClick={(e) => { e.stopPropagation(); setSubjects((prev) => prev.filter((s) => s.id !== sub.id)); }}
              >×</button>
            )}
          </GlassCard>
        ))}
      </div>

      {filtered.length === 0 && (
        <GlassCard holographic style={{ padding: 24, textAlign: 'center' }}>
          <Zap size={24} style={{ margin: '0 auto 8px', color: 'var(--neon)' }} />
          <div className="text-caption">No subjects match — try a different search</div>
        </GlassCard>
      )}
    </motion.div>
  );
}
