import { useState } from 'react';
import { motion } from 'framer-motion';
import GlassCard from '../ui/GlassCard';
import { useStorage } from '../../hooks/useStorage';
import { DEFAULT_ENC } from '../../data/defaults';
import { screenEnter, stagger } from '../../utils/motion';

const TABS = [
  { id: 'quotes', label: '✦ Quotes' },
  { id: 'tv', label: '📺 TV' },
  { id: 'mov', label: '🎬 Movies' },
  { id: 'mus', label: '🎵 Music' },
  { id: 'rap', label: '🎤 Rappers' },
  { id: 'food', label: '🍗 Food' },
  { id: 'books', label: '📚 Books' },
];

export default function EncyclopediaScreen({ editMode }) {
  const [enc, setEnc] = useStorage('enc', DEFAULT_ENC);
  const [tab, setTab] = useState('quotes');
  const [newItem, setNewItem] = useState('');

  function removeItem(id) {
    setEnc((prev) => ({ ...prev, [tab]: (prev[tab] || []).filter((x) => x.id !== id) }));
  }

  return (
    <motion.div className="screen" {...screenEnter}>
      <div className="screen-header">
        <h1 className="text-title gradient-text">📖 Encyclopedia</h1>
        <p className="text-caption text-secondary">Personal database · curated by Mohamed</p>
      </div>

      <div className="agent-pills mb-16">
        {TABS.map((t) => (
          <button key={t.id} type="button" className={`agent-pill ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'quotes' && (enc.quotes || []).map((q, i) => (
        <motion.div key={q.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={stagger(i)}>
        <GlassCard key={q.id} accentColor="var(--accent-amber)" glow style={{ padding: 16, marginBottom: 8 }}>
          <div className="text-micro" style={{ color: 'var(--accent-amber)', marginBottom: 6 }}>✦</div>
          <p style={{ fontStyle: 'italic', fontSize: 15 }}>&ldquo;{q.t}&rdquo;</p>
          <p style={{ color: 'var(--accent-amber)', fontSize: 13, marginTop: 6 }}>— {q.a}</p>
          {editMode && <button type="button" onClick={() => removeItem(q.id)} style={{ marginTop: 8, color: 'var(--accent-rose)', background: 'none', border: 'none', cursor: 'pointer' }}>×</button>}
        </GlassCard>
        </motion.div>
      ))}

      {tab === 'tv' && (enc.tv || []).map((item, i) => (
        <GlassCard key={item.id} style={{ padding: 14, marginBottom: 8 }}>
          <strong>{i + 1}. {item.title}</strong> — {item.rating}
          <div className="text-secondary" style={{ fontSize: 13 }}>{item.note}</div>
          {editMode && <button type="button" onClick={() => removeItem(item.id)} style={{ color: 'var(--accent-rose)', background: 'none', border: 'none', cursor: 'pointer' }}>×</button>}
        </GlassCard>
      ))}

      {tab === 'mov' && (enc.mov || []).map((item, i) => (
        <GlassCard key={item.id} style={{ padding: 14, marginBottom: 8 }}>
          <strong>{i + 1}. {item.title}</strong> — {item.rating}
          <div className="text-secondary">{item.note}</div>
        </GlassCard>
      ))}

      {tab === 'mus' && (enc.mus || []).map((item) => (
        <GlassCard key={item.id} style={{ padding: 14, marginBottom: 8 }}>
          <strong>{item.title}</strong> — {item.artist}
          <div className="text-secondary">{item.note}</div>
        </GlassCard>
      ))}

      {tab === 'rap' && (enc.rap || []).map((item) => (
        <GlassCard key={item.id} style={{ padding: 14, marginBottom: 8 }}>
          <strong>{item.name}</strong> — {item.note}
        </GlassCard>
      ))}

      {tab === 'food' && (enc.food || []).map((item) => (
        <GlassCard key={item.id} style={{ padding: 14, marginBottom: 8 }}>
          <strong>{item.item}</strong> ({item.category}) — {item.note}
        </GlassCard>
      ))}

      {tab === 'books' && (enc.books || []).map((item) => (
        <GlassCard key={item.id} style={{ padding: 14, marginBottom: 8 }}>
          <strong>{item.title}</strong> — {item.author}
          <div className="text-secondary">{item.note}</div>
        </GlassCard>
      ))}

      {editMode && (
        <div className="mt-16">
          <input className="glass-input mb-8" placeholder="Add new entry..." value={newItem} onChange={(e) => setNewItem(e.target.value)} />
          <button type="button" className="glass-btn glass-btn--primary" onClick={() => {
            if (!newItem.trim()) return;
            const id = Date.now().toString();
            if (tab === 'quotes') setEnc((p) => ({ ...p, quotes: [...(p.quotes || []), { id, t: newItem, a: 'Self' }] }));
            else if (tab === 'rap') setEnc((p) => ({ ...p, rap: [...(p.rap || []), { id, name: newItem, note: '' }] }));
            else setEnc((p) => ({ ...p, [tab]: [...(p[tab] || []), { id, title: newItem, rating: '', note: '' }] }));
            setNewItem('');
          }}>Add</button>
        </div>
      )}
    </motion.div>
  );
}
