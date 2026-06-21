import { useState } from 'react';
import { motion } from 'framer-motion';
import GlassCard from '../ui/GlassCard';
import BuildBadge from '../ui/BuildBadge';
import { useStorage } from '../../hooks/useStorage';
import { DEFAULT_DASHBOARDS } from '../../data/defaults';
import { DASHBOARD_VERSION } from '../../data/dashboards';
import { lsGet, lsSet } from '../../data/storage';
import DashboardDetail from '../dashboard/DashboardDetail';
import { screenEnter, cardHover } from '../../utils/motion';

export default function DashboardsScreen({ editMode }) {
  const [dashes, setDashes] = useStorage('dashes', DEFAULT_DASHBOARDS);
  const [active, setActive] = useState(null);

  if (active) {
    return <DashboardDetail dash={active} onBack={() => setActive(null)} editMode={editMode} />;
  }

  return (
    <motion.div className="screen" {...screenEnter}>
      <div className="screen-header flex justify-between items-start">
        <div>
          <h1 className="text-title gradient-text">📊 Dashboards</h1>
          <p className="text-caption text-secondary">Full mission control — Finance · ABW · Fitness · Islam · Writing · Vocab</p>
        </div>
        <BuildBadge variant="compact" />
      </div>

      <div className="grid-2 grid-2-md-3">
        {dashes.map((d) => (
          <motion.div key={d.id} {...cardHover}>
            <GlassCard
              accentColor={d.c}
              hover
              glow
              onClick={() => {
                if (lsGet(`dc_v_${d.id}`, 0) < DASHBOARD_VERSION) {
                  lsSet(`dc_v_${d.id}`, 0);
                }
                setActive(d);
              }}
              style={{ padding: 16, position: 'relative', minHeight: 160 }}
            >
              <span className="subject-watermark">{d.i}</span>
              <div style={{ fontSize: 32, marginBottom: 8 }}>{d.i}</div>
              <div className="text-headline">{d.l}</div>
              <div className="text-secondary" style={{ fontSize: 13, margin: '6px 0 12px' }}>{d.d}</div>
              <span style={{ color: d.c, fontSize: 13, fontWeight: 600 }}>Open full dashboard →</span>
              {editMode && (
                <button type="button" style={{ position: 'absolute', top: 10, right: 10, background: 'none', border: 'none', color: 'var(--rose)', cursor: 'pointer' }} onClick={(e) => { e.stopPropagation(); setDashes(dashes.filter((x) => x.id !== d.id)); }}>🗑</button>
              )}
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
