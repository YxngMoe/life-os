import { useState, useEffect, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import { lsGet } from '../../data/storage';
import { DEFAULT_GOALS, DEFAULT_SUBJECTS } from '../../data/defaults';
import { getSubjectNotes } from '../../data/storage';

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
      if (t.text?.toLowerCase().includes(term)) out.push({ type: 'todo', label: t.text, dest: '/todo' });
    });
    (lsGet('goals', DEFAULT_GOALS) || []).forEach((g) => {
      if (g.text?.toLowerCase().includes(term)) out.push({ type: 'goal', label: g.text.slice(0, 80), dest: '/life' });
    });
    (lsGet('subjects', DEFAULT_SUBJECTS) || []).forEach((s) => {
      if (s.n?.toLowerCase().includes(term)) out.push({ type: 'subject', label: s.n, dest: '/brain' });
      getSubjectNotes(s.id).forEach((n) => {
        if (n.title?.toLowerCase().includes(term) || n.content?.toLowerCase().includes(term)) {
          out.push({ type: 'note', label: n.title, dest: '/brain' });
        }
      });
    });
    return out.slice(0, 12);
  }, [q]);

  if (!open) return null;

  return (
    <div className="search-overlay" onClick={onClose}>
      <div className="search-panel" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-12 mb-16">
          <Search size={18} color="var(--indigo)" />
          <input className="glass-input flex-1" autoFocus placeholder="Search notes, goals, todos..." value={q} onChange={(e) => setQ(e.target.value)} />
          <button type="button" className="glass-pill" onClick={onClose}><X size={14} /></button>
        </div>
        {results.length === 0 && q && <p className="text-secondary text-caption">No results</p>}
        {results.map((r, i) => (
          <div key={i} className="search-result" onClick={() => { onNavigate(r.dest); onClose(); }}>
            <span className="text-micro" style={{ color: 'var(--indigo)' }}>{r.type}</span>
            <div className="text-headline" style={{ fontSize: 14 }}>{r.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
