import { useState } from 'react';
import { motion } from 'framer-motion';
import GlassCard from '../ui/GlassCard';
import { useStorage } from '../../hooks/useStorage';
import { DEFAULT_DASHBOARDS, getDefaultDashboardComponents } from '../../data/defaults';
import { getDashboardComponents, setDashboardComponents } from '../../data/storage';
import DashboardDetail from './DashboardDetail';

export default function DashboardsScreen({ editMode }) {
  const [dashes, setDashes] = useStorage('dashes', DEFAULT_DASHBOARDS);
  const [active, setActive] = useState(null);

  if (active) {
    return <DashboardDetail dash={active} onBack={() => setActive(null)} editMode={editMode} />;
  }

  return (
    <motion.div className="screen" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
      <div className="screen-header">
        <h1 className="text-title2">📊 Dashboards</h1>
      </div>

      <div className="grid-2 grid-2-md-3">
        {dashes.map((d) => (
          <GlassCard
            key={d.id}
            accentColor={d.c}
            hover
            onClick={() => {
              if (!getDashboardComponents(d.id).length) {
                setDashboardComponents(d.id, getDefaultDashboardComponents(d.id));
              }
              setActive(d);
            }}
            style={{ padding: 16, position: 'relative', minHeight: 150 }}
          >
            <span className="subject-watermark">{d.i}</span>
            <div style={{ fontSize: 32, marginBottom: 8 }}>{d.i}</div>
            <div className="text-headline">{d.l}</div>
            <div className="text-secondary" style={{ fontSize: 13, margin: '6px 0 12px' }}>{d.d}</div>
            <span style={{ color: d.c, fontSize: 13, fontWeight: 600 }}>Open →</span>
            {editMode && (
              <button type="button" style={{ position: 'absolute', top: 10, right: 10, background: 'none', border: 'none', color: 'var(--accent-rose)', cursor: 'pointer' }} onClick={(e) => { e.stopPropagation(); setDashes(dashes.filter((x) => x.id !== d.id)); }}>🗑</button>
            )}
          </GlassCard>
        ))}
      </div>
    </motion.div>
  );
}
