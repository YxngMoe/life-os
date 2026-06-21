import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import GlassCard from '../ui/GlassCard';
import ScreenHero from '../ui/ScreenHero';
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

  const hubStats = useMemo(() => ({
    dashboards: dashes.length,
    domains: dashes.map((d) => d.l).join(' · '),
  }), [dashes]);

  if (active) {
    return <DashboardDetail dash={active} onBack={() => setActive(null)} editMode={editMode} />;
  }

  return (
    <motion.div className="screen dash-screen" {...screenEnter}>
      <ScreenHero
        icon="📊"
        title="Mission Control Hub"
        subtitle="Finance · ABW · Fitness · Islam · Writing · Vocab"
        accent="#2dd4bf"
        badge="COMMAND CENTER"
        stats={[
          { label: 'Dashboards', value: hubStats.dashboards },
          { label: 'Active', value: hubStats.dashboards, color: '#2dd4bf' },
        ]}
      >
        <div style={{ marginTop: 12, display: 'flex', justifyContent: 'flex-end' }}>
          <BuildBadge variant="compact" />
        </div>
      </ScreenHero>

      <div className="grid-2 grid-2-md-3">
        {dashes.map((d, i) => (
          <motion.div key={d.id} {...cardHover}>
            <GlassCard
              accentColor={d.c}
              holographic
              neon
              hover
              index={i}
              onClick={() => {
                if (lsGet(`dc_v_${d.id}`, 0) < DASHBOARD_VERSION) {
                  lsSet(`dc_v_${d.id}`, 0);
                }
                setActive(d);
              }}
              style={{ padding: 16, position: 'relative', minHeight: 168 }}
            >
              <span className="subject-watermark">{d.i}</span>
              <div style={{ fontSize: 32, marginBottom: 8 }}>{d.i}</div>
              <div className="text-headline">{d.l}</div>
              <div className="text-secondary" style={{ fontSize: 13, margin: '6px 0 12px' }}>{d.d}</div>
              <span className="glass-pill" style={{ color: d.c, borderColor: d.c, fontSize: 10 }}>Launch →</span>
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
