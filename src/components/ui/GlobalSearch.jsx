import { useState, useEffect, useMemo } from 'react';
import { Search, X, Sparkles } from 'lucide-react';
import { lsGet } from '../../data/storage';
import { DEFAULT_GOALS, DEFAULT_SUBJECTS, DEFAULT_ENC } from '../../data/defaults';
import { LIFE_MILESTONES } from '../../data/goals';
import { getSubjectNotes } from '../../data/storage';

const QUICK_NAV = [
  { label: 'Home', dest: '/home' },
  { label: 'Calendar', dest: '/calendar' },
  { label: 'Goals', dest: '/life' },
  { label: 'Agents', dest: '/agents' },
  { label: 'Coach', dest: '/coach' },
  { label: 'Tasks', dest: '/todo' },
];

export default function GlobalSearch({ open, onClose, onNavigate }) {
  const [q, setQ] = useState('');

  useEffect(() => {
    if (!open) setQ('');
  }, [open]);

  useEffect(() => {
    function onKey(e) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (open) onClose();
      }
      if (e.key === 'Escape' && open) onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const results = useMemo(() => {
    if (!q.trim()) return [];
    const term = q.toLowerCase();
    const out = [];
    (lsGet('todos', []) || []).forEach((t) => {
      if (t.text?.toLowerCase().includes(term)) out.push({ type: 'task', label: t.text, dest: '/todo' });
    });
    (lsGet('goals', DEFAULT_GOALS) || []).forEach((g) => {
      if (g.text?.toLowerCase().includes(term)) out.push({ type: 'goal', label: g.text.slice(0, 80), dest: '/life' });
    });
    LIFE_MILESTONES.forEach((m) => {
      m.items.forEach((item) => {
        if (item.toLowerCase().includes(term)) out.push({ type: 'milestone', label: `${m.year}: ${item}`, dest: '/life' });
      });
    });
    (lsGet('subjects', DEFAULT_SUBJECTS) || []).forEach((s) => {
      if (s.n?.toLowerCase().includes(term)) out.push({ type: 'subject', label: s.n, dest: '/brain' });
      getSubjectNotes(s.id).forEach((n) => {
        if (n.title?.toLowerCase().includes(term) || n.content?.toLowerCase().includes(term)) {
          out.push({ type: 'note', label: n.title, dest: '/brain' });
        }
      });
    });
    const enc = lsGet('enc', DEFAULT_ENC) || DEFAULT_ENC;
    (enc.quotes || []).forEach((item) => {
      if (item.t?.toLowerCase().includes(term)) out.push({ type: 'quote', label: item.t.slice(0, 60), dest: '/encyclopedia' });
    });
    return out.slice(0, 14);
  }, [q]);

  if (!open) return null;

  return (
    <div className="search-overlay" onClick={onClose}>
      <div className="search-panel glass-card--neon" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-8 mb-8">
          <Sparkles size={16} color="var(--neon)" />
          <span className="text-micro" style={{ color: 'var(--neon)' }}>NEURAL SEARCH</span>
        </div>
        <div className="flex items-center gap-12 mb-16">
          <Search size={18} color="var(--neon)" />
          <input className="glass-input flex-1" autoFocus placeholder="Search everything — ⌘K" value={q} onChange={(e) => setQ(e.target.value)} />
          <button type="button" className="glass-pill" onClick={onClose}><X size={14} /></button>
        </div>
        {!q && (
          <div className="feature-chips mb-12">
            {QUICK_NAV.map((n) => (
              <button key={n.dest} type="button" className="feature-chip" onClick={() => { onNavigate(n.dest); onClose(); }}>{n.label}</button>
            ))}
          </div>
        )}
        {results.length === 0 && q && <p className="text-secondary text-caption">No neural matches found</p>}
        {results.map((r, i) => (
          <div key={i} className="search-result" onClick={() => { onNavigate(r.dest); onClose(); }}>
            <span className="text-micro" style={{ color: 'var(--neon)' }}>{r.type}</span>
            <div className="text-headline" style={{ fontSize: 14 }}>{r.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
