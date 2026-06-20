import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import GlassCard from '../ui/GlassCard';
import { useStorage } from '../../hooks/useStorage';
import { DEFAULT_SUBJECTS } from '../../data/defaults';
import { getSubjectNotes, setSubjectNotes, getSubjectCards, setSubjectCards, getSubjectTasks, setSubjectTasks } from '../../data/storage';
import SubjectDetail from './SubjectDetail';
import { screenEnter } from '../../utils/motion';

export default function BrainScreen({ editMode, onNavigate }) {
  const [subjects, setSubjects] = useStorage('subjects', DEFAULT_SUBJECTS);
  const [search, setSearch] = useState('');
  const [activeSubject, setActiveSubject] = useState(null);

  const filtered = subjects.filter((s) =>
    s.n.toLowerCase().includes(search.toLowerCase())
  );

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
      <div className="screen-header">
        <h1 className="text-title gradient-text">🧠 Second Brain</h1>
        <p className="text-caption text-secondary">Your personal knowledge hub</p>
      </div>

      <input
        className="glass-input mb-16"
        placeholder="Search subjects..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="grid-2 grid-2-md-3">
        {filtered.map((sub) => {
          const notes = getSubjectNotes(sub.id);
          const cards = getSubjectCards(sub.id);
          return (
            <GlassCard
              key={sub.id}
              accentColor={sub.c}
              hover
              onClick={() => setActiveSubject(sub)}
              style={{ padding: '16px', position: 'relative', minHeight: 140 }}
            >
              <span className="subject-watermark">{sub.i}</span>
              <div style={{ fontSize: 30, marginBottom: 8 }}>{sub.i}</div>
              <div className="text-headline" style={{ marginBottom: 4 }}>{sub.n}</div>
              <div className="text-secondary" style={{ fontSize: 13, marginBottom: 10 }}>{sub.d}</div>
              <div className="flex gap-8">
                <span className="glass-pill">{notes.length} notes</span>
                <span className="glass-pill">{cards.length} cards</span>
              </div>
              {editMode && (
                <button
                  type="button"
                  style={{ position: 'absolute', top: 10, right: 10, background: 'none', border: 'none', color: 'var(--accent-rose)', cursor: 'pointer', fontSize: 18 }}
                  onClick={(e) => { e.stopPropagation(); setSubjects((prev) => prev.filter((s) => s.id !== sub.id)); }}
                >×</button>
              )}
            </GlassCard>
          );
        })}
      </div>
    </motion.div>
  );
}
