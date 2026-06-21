import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Shuffle, Search } from 'lucide-react';
import GlassCard from '../ui/GlassCard';
import ScreenHero from '../ui/ScreenHero';
import { useStorage } from '../../hooks/useStorage';
import { DEFAULT_ENC } from '../../data/defaults';
import { screenEnter, stagger } from '../../utils/motion';

const TABS = [
  { id: 'quotes', label: '✦ Quotes', color: '#fbbf24' },
  { id: 'tv', label: '📺 TV', color: '#22d3ee' },
  { id: 'mov', label: '🎬 Movies', color: '#c084fc' },
  { id: 'mus', label: '🎵 Music', color: '#f472b6' },
  { id: 'rap', label: '🎤 Rappers', color: '#fb923c' },
  { id: 'food', label: '🍗 Food', color: '#34d399' },
  { id: 'books', label: '📚 Books', color: '#2dd4bf' },
];

export default function EncyclopediaScreen({ editMode }) {
  const [enc, setEnc] = useStorage('enc', DEFAULT_ENC);
  const [tab, setTab] = useState('quotes');
  const [newItem, setNewItem] = useState('');
  const [search, setSearch] = useState('');
  const [randomQuote, setRandomQuote] = useState(null);

  const tabMeta = TABS.find((t) => t.id === tab) || TABS[0];
  const items = enc[tab] || [];
  const totalEntries = useMemo(() => TABS.reduce((a, t) => a + (enc[t.id]?.length || 0), 0), [enc]);

  const filtered = useMemo(() => {
    if (!search.trim()) return items;
    const q = search.toLowerCase();
    return items.filter((item) => JSON.stringify(item).toLowerCase().includes(q));
  }, [items, search]);

  function removeItem(id) {
    setEnc((prev) => ({ ...prev, [tab]: (prev[tab] || []).filter((x) => x.id !== id) }));
  }

  function pickRandom() {
    const quotes = enc.quotes || [];
    if (!quotes.length) return;
    setRandomQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    setTab('quotes');
  }

  return (
    <motion.div className="screen" {...screenEnter}>
      <ScreenHero
        icon="📖"
        title="Personal Encyclopedia"
        subtitle="Curated database · culture · wisdom · taste"
        accent="#fbbf24"
        badge="DATA VAULT"
        stats={[
          { label: 'Total', value: totalEntries },
          { label: 'Category', value: items.length },
          { label: 'Sections', value: TABS.length },
        ]}
      />

      <div className="enc-stat-pills">
        {TABS.map((t) => (
          <span key={t.id} className="glass-pill" style={{ fontSize: 10, color: t.color, borderColor: t.color }}>
            {t.label.split(' ')[0]} {(enc[t.id] || []).length}
          </span>
        ))}
      </div>

      <div className="enc-search-wrap">
        <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--neon)', opacity: 0.6 }} />
        <input className="glass-input" style={{ paddingLeft: 40 }} placeholder="Search encyclopedia..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <button type="button" className="glass-btn enc-random w-full mb-16" onClick={pickRandom}>
        <Shuffle size={14} /> Random wisdom
      </button>

      {randomQuote && tab === 'quotes' && (
        <GlassCard holographic accentColor="#fbbf24" style={{ padding: 16, marginBottom: 16 }}>
          <div className="text-micro" style={{ color: '#fbbf24', marginBottom: 6 }}>✦ RANDOM PICK</div>
          <p style={{ fontStyle: 'italic', fontSize: 15 }}>&ldquo;{randomQuote.t}&rdquo;</p>
          <p style={{ color: '#fbbf24', fontSize: 13, marginTop: 6 }}>— {randomQuote.a}</p>
        </GlassCard>
      )}

      <div className="agent-pills mb-16">
        {TABS.map((t) => (
          <button key={t.id} type="button"
            className={`agent-pill ${tab === t.id ? 'active' : ''}`}
            style={tab === t.id ? { borderColor: t.color, color: t.color, boxShadow: `0 0 16px ${t.color}33` } : {}}
            onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'quotes' && filtered.map((q, i) => (
        <motion.div key={q.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={stagger(i)}>
          <GlassCard holographic accentColor="#fbbf24" style={{ padding: 16, marginBottom: 8 }}>
            <div className="text-micro" style={{ color: '#fbbf24', marginBottom: 6 }}>✦</div>
            <p style={{ fontStyle: 'italic', fontSize: 15 }}>&ldquo;{q.t}&rdquo;</p>
            <p style={{ color: '#fbbf24', fontSize: 13, marginTop: 6 }}>— {q.a}</p>
            {editMode && <button type="button" onClick={() => removeItem(q.id)} style={{ marginTop: 8, color: 'var(--rose)', background: 'none', border: 'none', cursor: 'pointer' }}>×</button>}
          </GlassCard>
        </motion.div>
      ))}

      {tab === 'tv' && filtered.map((item, i) => (
        <GlassCard key={item.id} holographic accentColor={tabMeta.color} style={{ padding: 14, marginBottom: 8 }}>
          <strong>{i + 1}. {item.title}</strong> — {item.rating}
          <div className="text-secondary" style={{ fontSize: 13 }}>{item.note}</div>
          {editMode && <button type="button" onClick={() => removeItem(item.id)} style={{ color: 'var(--rose)', background: 'none', border: 'none', cursor: 'pointer' }}>×</button>}
        </GlassCard>
      ))}

      {tab === 'mov' && filtered.map((item, i) => (
        <GlassCard key={item.id} holographic style={{ padding: 14, marginBottom: 8 }}>
          <strong>{i + 1}. {item.title}</strong> — {item.rating}
          <div className="text-secondary">{item.note}</div>
        </GlassCard>
      ))}

      {tab === 'mus' && filtered.map((item) => (
        <GlassCard key={item.id} holographic accentColor="#f472b6" style={{ padding: 14, marginBottom: 8 }}>
          <strong>{item.title}</strong> — {item.artist}
          <div className="text-secondary">{item.note}</div>
        </GlassCard>
      ))}

      {tab === 'rap' && filtered.map((item) => (
        <GlassCard key={item.id} holographic style={{ padding: 14, marginBottom: 8 }}>
          <strong>{item.name}</strong> — {item.note}
        </GlassCard>
      ))}

      {tab === 'food' && filtered.map((item) => (
        <GlassCard key={item.id} holographic accentColor="#34d399" style={{ padding: 14, marginBottom: 8 }}>
          <strong>{item.item}</strong> ({item.category}) — {item.note}
        </GlassCard>
      ))}

      {tab === 'books' && filtered.map((item) => (
        <GlassCard key={item.id} holographic accentColor="#2dd4bf" style={{ padding: 14, marginBottom: 8 }}>
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
          }}>Add to vault</button>
        </div>
      )}
    </motion.div>
  );
}
