import { useState } from 'react';
import { motion } from 'framer-motion';
import GlassCard from '../ui/GlassCard';
import { useStorage } from '../../hooks/useStorage';
import { TODO_CATS } from '../../data/defaults';

const FILTERS = ['all', 'today', 'jpmc', 'business', 'personal', 'health', 'finance', 'done'];

export default function TodoScreen({ editMode }) {
  const [todos, setTodos] = useStorage('todos', []);
  const [text, setText] = useState('');
  const [cat, setCat] = useState('today');
  const [filter, setFilter] = useState('all');

  const pending = todos.filter((t) => {
    if (filter === 'done') return t.done;
    if (t.done) return false;
    if (filter === 'all') return true;
    if (filter === 'today') return t.cat === 'today';
    return t.cat === filter;
  });

  const completed = todos.filter((t) => t.done && filter !== 'done');

  function add() {
    if (!text.trim()) return;
    setTodos([...todos, {
      id: Date.now().toString(), text: text.trim(), done: false, cat, date: new Date().toDateString(),
    }]);
    setText('');
  }

  return (
    <motion.div className="screen" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
      <div className="screen-header flex justify-between items-center">
        <h1 className="text-title2">✅ To-Do</h1>
        <span className="glass-pill">{todos.filter((t) => !t.done).length} pending</span>
      </div>

      <div className="flex gap-8 mb-12">
        <input className="glass-input flex-1" placeholder="Add task..." value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && add()} />
        <select className="glass-input" style={{ width: 110 }} value={cat} onChange={(e) => setCat(e.target.value)}>
          {Object.entries(TODO_CATS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
        <button type="button" className="glass-btn glass-btn--primary" onClick={add}>+</button>
      </div>

      <div className="agent-pills mb-16">
        {FILTERS.map((f) => (
          <button key={f} type="button" className={`glass-pill ${filter === f ? 'glass-pill--active' : ''}`} onClick={() => setFilter(f)}>
            {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {pending.map((t) => {
        const c = TODO_CATS[t.cat] || TODO_CATS.personal;
        return (
          <GlassCard key={t.id} accentColor={c.color} style={{ padding: 14, marginBottom: 8 }}>
            <div className="flex items-center gap-12">
              <div
                className={`check-square ${t.done ? 'check-square--done' : ''}`}
                style={{ '--check-color': c.color, cursor: 'pointer' }}
                onClick={() => setTodos(todos.map((x) => x.id === t.id ? { ...x, done: !x.done } : x))}
              >✓</div>
              <div style={{ flex: 1 }}>
                <div>{t.text}</div>
                <span className="glass-pill" style={{ marginTop: 4, fontSize: 10 }}>{c.label}</span>
              </div>
              <span className="text-micro text-tertiary">{t.date?.slice(0, 10)}</span>
              <button type="button" onClick={() => setTodos(todos.filter((x) => x.id !== t.id))} style={{ background: 'none', border: 'none', color: 'var(--accent-rose)', cursor: 'pointer' }}>×</button>
            </div>
          </GlassCard>
        );
      })}

      {completed.length > 0 && filter !== 'done' && (
        <>
          <div className="text-caption text-tertiary mb-12" style={{ marginTop: 20 }}>Completed ({completed.length})</div>
          {completed.map((t) => (
            <GlassCard key={t.id} style={{ padding: 12, marginBottom: 6, opacity: 0.45 }}>
              <span className="strikethrough" style={{ cursor: 'pointer' }} onClick={() => setTodos(todos.map((x) => x.id === t.id ? { ...x, done: false } : x))}>{t.text}</span>
            </GlassCard>
          ))}
        </>
      )}
    </motion.div>
  );
}
