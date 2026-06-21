import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import GlassCard from '../ui/GlassCard';
import BuildBadge from '../ui/BuildBadge';
import DashboardWidget from './DashboardWidget';
import { getDashboardConfig, DASHBOARD_VERSION } from '../../data/dashboards';
import { lsGet, lsSet } from '../../data/storage';
import { screenEnter } from '../../utils/motion';

function loadState(dashId) {
  const version = lsGet(`dc_v_${dashId}`, 0);
  if (version >= DASHBOARD_VERSION) {
    const saved = lsGet(`dc_state_${dashId}`, null);
    if (saved) return saved;
  }
  const cfg = getDashboardConfig(dashId);
  const state = {
    tab: cfg.tabs[0]?.id,
    tabs: cfg.tabs.map((t) => ({ id: t.id, widgets: JSON.parse(JSON.stringify(t.widgets)) })),
  };
  lsSet(`dc_v_${dashId}`, DASHBOARD_VERSION);
  lsSet(`dc_state_${dashId}`, state);
  return state;
}

function saveState(dashId, state) {
  lsSet(`dc_state_${dashId}`, state);
  lsSet(`dc_v_${dashId}`, DASHBOARD_VERSION);
}

export default function DashboardDetail({ dash, onBack, editMode }) {
  const [state, setState] = useState(() => loadState(dash.id));
  const cfg = getDashboardConfig(dash.id);
  const activeTab = state.tabs.find((t) => t.id === state.tab) || state.tabs[0];

  useEffect(() => {
    saveState(dash.id, state);
  }, [dash.id, state]);

  function updateWidget(widgetId, data) {
    setState((prev) => ({
      ...prev,
      tabs: prev.tabs.map((t) => t.id !== prev.tab ? t : {
        ...t,
        widgets: t.widgets.map((w) => (w.id === widgetId ? data : w)),
      }),
    }));
  }

  const tabMeta = cfg.tabs.find((t) => t.id === state.tab);
  const allWidgets = state.tabs.flatMap((t) => t.widgets);
  const checklistWidgets = allWidgets.filter((w) => w.type === 'section-checklist' || w.type === 'task-list');
  const totalChecks = checklistWidgets.reduce((s, w) => s + (w.items?.length || 0), 0);
  const doneChecks = checklistWidgets.reduce((s, w) => s + (w.items?.filter((i) => i.done).length || 0), 0);
  const dashPct = totalChecks ? Math.round((doneChecks / totalChecks) * 100) : 0;

  return (
    <motion.div className="screen dash-screen" {...screenEnter}>
      <button type="button" className="glass-pill mb-12" onClick={onBack}><ArrowLeft size={14} /> All Dashboards</button>

      <GlassCard className="dash-hero mb-16" accentColor={dash.c} style={{ padding: '20px 22px', borderLeft: `3px solid ${dash.c}` }}>
        <div className="flex justify-between items-start">
          <div>
            <div className="text-micro" style={{ color: dash.c, letterSpacing: '0.12em' }}>DASHBOARD</div>
            <h1 className="text-title" style={{ marginTop: 4 }}>{dash.i} {dash.l}</h1>
            <p className="text-caption text-secondary" style={{ marginTop: 6 }}>{dash.d}</p>
          </div>
          {totalChecks > 0 && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 28, fontWeight: 900, color: dash.c }}>{dashPct}%</div>
              <div className="text-micro">{doneChecks}/{totalChecks}</div>
            </div>
          )}
        </div>
        {totalChecks > 0 && (
          <div className="day-progress" style={{ marginTop: 14 }}>
            <div className="day-progress-fill" style={{ width: `${dashPct}%`, background: dash.c }} />
          </div>
        )}
      </GlassCard>

      {cfg.tabs.length > 1 && (
        <div className="dash-tabs mb-16">
          {cfg.tabs.map((t) => (
            <button key={t.id} type="button" className={`dash-tab ${state.tab === t.id ? 'dash-tab--active' : ''}`}
              style={{ '--tab-accent': dash.c }}
              onClick={() => setState((prev) => ({ ...prev, tab: t.id }))}>
              <span>{t.icon}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </div>
      )}

      <div className="text-micro mb-12">{tabMeta?.icon} {tabMeta?.label}</div>

      {(activeTab?.widgets || []).map((widget) => (
        <DashboardWidget
          key={widget.id}
          widget={widget}
          dashColor={dash.c}
          editMode={editMode}
          onUpdate={(data) => updateWidget(widget.id, data)}
        />
      ))}

      <BuildBadge variant="compact" className="mb-24" />
    </motion.div>
  );
}
