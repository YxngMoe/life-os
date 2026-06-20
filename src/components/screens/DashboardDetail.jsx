import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import GlassCard from '../ui/GlassCard';
import { getDashboardComponents, setDashboardComponents } from '../../data/storage';
import { screenEnter } from '../../utils/motion';

export default function DashboardDetail({ dash, onBack, editMode }) {
  const [components, setComponentsState] = useState(() => getDashboardComponents(dash.id));

  function save(comps) {
    setComponentsState(comps);
    setDashboardComponents(dash.id, comps);
  }

  function toggleChecklistItem(compId, itemIdx) {
    save(components.map((c) => {
      if (c.id !== compId || c.type !== 'checklist') return c;
      const items = c.items.map((item, i) => (i === itemIdx ? { ...item, done: !item.done } : item));
      return { ...c, items };
    }));
  }

  return (
    <motion.div className="screen" {...screenEnter}>
      <button type="button" className="glass-pill mb-16" onClick={onBack}><ArrowLeft size={14} /> Back</button>
      <div className="glass-card glow" style={{ background: `linear-gradient(135deg, ${dash.c}22, transparent)`, padding: 20, borderRadius: 16, marginBottom: 20, borderLeft: `3px solid ${dash.c}` }}>
        <h1 className="text-title2">{dash.i} {dash.l}</h1>
        <p className="text-secondary">{dash.d}</p>
      </div>

      {components.map((comp) => (
        <GlassCard key={comp.id} accentColor={dash.c} glow style={{ padding: 16, marginBottom: 12 }}>
          <div className="text-caption" style={{ color: dash.c, marginBottom: 10 }}>{comp.title}</div>

          {comp.type === 'note' && <div style={{ whiteSpace: 'pre-wrap', fontSize: 14 }}>{comp.content}</div>}

          {comp.type === 'metric' && (
            <div style={{ fontSize: 36, fontWeight: 800, color: dash.c }}>{comp.value}</div>
          )}

          {comp.type === 'checklist' && (comp.items || []).map((item, i) => (
            <div key={i} className="flex items-center gap-10 mb-8" style={{ cursor: 'pointer' }} onClick={() => toggleChecklistItem(comp.id, i)}>
              <div className={`check-square ${item.done ? 'check-square--done' : ''}`} style={{ '--check-color': dash.c }}>✓</div>
              <span className={item.done ? 'strikethrough opacity-45' : ''}>{typeof item === 'string' ? item : item.text}</span>
            </div>
          ))}

          {comp.type === 'tasks' && (comp.items || []).map((item, i) => (
            <div key={i} className="mb-8">{item.text || item}</div>
          ))}

          {editMode && (
            <button type="button" onClick={() => save(components.filter((c) => c.id !== comp.id))} style={{ marginTop: 8, color: 'var(--accent-rose)', background: 'none', border: 'none', cursor: 'pointer' }}>Remove component</button>
          )}
        </GlassCard>
      ))}
    </motion.div>
  );
}
