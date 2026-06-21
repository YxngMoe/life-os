import { useState } from 'react';
import { ChevronDown, ChevronUp, Plus } from 'lucide-react';
import GlassCard from '../ui/GlassCard';
import ArcRing from '../ui/ArcRing';
import { LIFT_DAYS, ISLAMIC_TOPICS } from '../../data/defaults';
import { LIFT_DETAILS } from '../../data/lifeContext';
import { getDayIndex } from '../../utils/dates';

function ProgressBar({ pct, color = 'var(--indigo)' }) {
  return (
    <div className="dash-progress">
      <div className="dash-progress__fill" style={{ width: `${Math.min(100, pct)}%`, background: color }} />
    </div>
  );
}

function SectionChecklist({ widget, color, onToggle, collapsed, onCollapse }) {
  const items = widget.items || [];
  const done = items.filter((i) => i.done).length;
  const pct = items.length ? Math.round((done / items.length) * 100) : 0;
  const allDone = done === items.length && items.length > 0;

  return (
    <GlassCard accentColor={color} className={`dash-section ${allDone ? 'dash-section--done' : ''}`} style={{ padding: 0, marginBottom: 10, overflow: 'hidden' }}>
      <button type="button" className="dash-section__head" onClick={onCollapse}>
        <span className="text-headline" style={{ fontSize: 13, color: allDone ? color : undefined }}>{widget.title}</span>
        <span className="text-micro" style={{ color }}>{done}/{items.length}</span>
        <ProgressBar pct={pct} color={color} />
        {collapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
      </button>
      {!collapsed && (
        <div className="dash-section__body">
          {items.map((item, i) => (
            <div key={item.id ?? i} className="dash-check-row" onClick={() => onToggle(i)}>
              <div className={`nn-check ${item.done ? 'nn-check--done' : ''}`} style={{ width: 18, height: 18, fontSize: 9 }}>{item.done && '✓'}</div>
              <span className={item.done ? 'nn-label--done' : ''} style={{ fontSize: 13 }}>{item.text}</span>
            </div>
          ))}
        </div>
      )}
    </GlassCard>
  );
}

export default function DashboardWidget({ widget, dashColor, onUpdate, editMode }) {
  const [collapsed, setCollapsed] = useState({});

  function patch(data) {
    onUpdate({ ...widget, ...data });
  }

  switch (widget.type) {
    case 'banner': {
      const items = widget.items || [];
      const done = items.filter((i) => i.done).length;
      const total = items.length || 1;
      const pct = widget.progressKey ? Math.round((done / total) * 100) : null;
      return (
        <GlassCard accentColor={dashColor} className="dash-banner mb-12" style={{ padding: '16px 18px' }}>
          <div className="flex justify-between items-center mb-8">
            <div>
              <div className="text-micro" style={{ color: dashColor }}>{widget.title}</div>
              <p className="text-caption text-secondary">{widget.subtitle}</p>
            </div>
            {pct !== null && <ArcRing value={pct} color={dashColor} size={52} />}
          </div>
          {pct !== null && <ProgressBar pct={pct} color={dashColor} />}
        </GlassCard>
      );
    }

    case 'metrics-row':
      return (
        <div className="dash-metrics-row mb-12">
          {(widget.items || []).map((m) => (
            <GlassCard key={m.label} className="stat-card" style={{ padding: '14px 12px' }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: m.accent || dashColor }}>{m.value}</div>
              <div className="text-micro">{m.label}</div>
            </GlassCard>
          ))}
        </div>
      );

    case 'progress-group':
      return (
        <GlassCard className="mb-12" style={{ padding: '16px 18px' }}>
          <div className="text-micro mb-12">{widget.title || 'Progress'}</div>
          {(widget.items || []).map((item) => {
            const pct = item.invert
              ? Math.max(0, Math.min(100, Math.round(((item.current - item.target) / (item.current || 1)) * -100 + 100)))
              : Math.round((item.current / item.target) * 100);
            return (
              <div key={item.label} className="mb-16">
                <div className="flex justify-between mb-6">
                  <span className="text-caption">{item.label}</span>
                  <span className="text-caption" style={{ color: dashColor }}>
                    {item.unit === '$' ? `$${item.current.toLocaleString()}` : `${item.current}${item.unit || ''}`}
                    {' / '}
                    {item.unit === '$' ? `$${item.target.toLocaleString()}` : `${item.target}${item.unit || ''}`}
                  </span>
                </div>
                <ProgressBar pct={pct} color={dashColor} />
              </div>
            );
          })}
        </GlassCard>
      );

    case 'section-checklist':
      return (
        <SectionChecklist
          widget={widget}
          color={widget.color || dashColor}
          collapsed={!!collapsed[widget.id]}
          onCollapse={() => setCollapsed((c) => ({ ...c, [widget.id]: !c[widget.id] }))}
          onToggle={(i) => {
            const items = widget.items.map((item, idx) => (idx === i ? { ...item, done: !item.done } : item));
            patch({ items });
          }}
        />
      );

    case 'note':
      return (
        <GlassCard accentColor={dashColor} className="mb-12" style={{ padding: '16px 18px' }}>
          <div className="text-micro mb-8" style={{ color: dashColor }}>{widget.title}</div>
          <div style={{ whiteSpace: 'pre-wrap', fontSize: 14, lineHeight: 1.65 }}>{widget.content}</div>
        </GlassCard>
      );

    case 'editable-list':
      return (
        <GlassCard className="mb-12" style={{ padding: '16px 18px' }}>
          <div className="text-micro mb-12">{widget.title}</div>
          {(widget.fields || []).map((f, i) => (
            <div key={f.label} className="dash-kv-row">
              <span className="text-caption text-secondary">{f.label}</span>
              <input
                className="glass-input dash-kv-input"
                placeholder="$0"
                value={f.value}
                onChange={(e) => {
                  const fields = widget.fields.map((x, idx) => (idx === i ? { ...x, value: e.target.value } : x));
                  patch({ fields });
                }}
              />
            </div>
          ))}
        </GlassCard>
      );

    case 'task-list':
      return (
        <GlassCard className="mb-12" style={{ padding: '16px 18px' }}>
          <div className="text-micro mb-12">{widget.title}</div>
          {(widget.items || []).map((item, i) => (
            <div key={i} className="dash-check-row" onClick={() => {
              const items = widget.items.map((x, idx) => (idx === i ? { ...x, done: !x.done } : x));
              patch({ items });
            }}>
              <div className={`nn-check ${item.done ? 'nn-check--done' : ''}`} style={{ width: 18, height: 18, fontSize: 9 }}>{item.done && '✓'}</div>
              <span className={item.done ? 'nn-label--done' : ''} style={{ fontSize: 13, flex: 1 }}>{item.text}</span>
              <span className="glass-pill" style={{ fontSize: 9 }}>{item.cat}</span>
            </div>
          ))}
        </GlassCard>
      );

    case 'watchlist':
      return (
        <GlassCard className="mb-12" style={{ padding: '16px 18px' }}>
          <div className="text-micro mb-12">{widget.title}</div>
          {(widget.items || []).map((item, i) => (
            <div key={item.ticker} className="dash-kv-row">
              <span className="glass-pill glass-pill--active" style={{ fontFamily: 'monospace' }}>{item.ticker}</span>
              <input className="glass-input dash-kv-input" placeholder="Notes..." value={item.notes}
                onChange={(e) => {
                  const items = widget.items.map((x, idx) => (idx === i ? { ...x, notes: e.target.value } : x));
                  patch({ items });
                }} />
            </div>
          ))}
        </GlassCard>
      );

    case 'lift-today': {
      const dayIdx = getDayIndex();
      const lift = LIFT_DAYS[dayIdx];
      const exercises = LIFT_DETAILS[lift] || [];
      return (
        <GlassCard accentColor="var(--pink)" className="mb-12" style={{ padding: '16px 18px' }}>
          <div className="text-micro mb-8" style={{ color: 'var(--pink)' }}>{widget.title}</div>
          <div className="text-headline mb-12">💪 {lift}</div>
          {exercises.map((ex) => (
            <div key={ex} className="focus-row"><span className="focus-dot" style={{ background: 'var(--pink)' }} />{ex}</div>
          ))}
        </GlassCard>
      );
    }

    case 'study-rotation':
      return (
        <GlassCard accentColor="var(--amber)" className="mb-12" style={{ padding: '16px 18px' }}>
          <div className="text-micro mb-12">{widget.title}</div>
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d, i) => (
            <div key={d} className={`focus-row ${getDayIndex() === i ? 'focus-row--today' : ''}`}>
              <span className="glass-pill" style={{ fontSize: 10, minWidth: 36 }}>{d}</span>
              <span style={{ fontSize: 13 }}>{ISLAMIC_TOPICS[i]}</span>
            </div>
          ))}
        </GlassCard>
      );

    case 'week-split':
      return (
        <GlassCard className="mb-12" style={{ padding: '16px 18px' }}>
          <div className="text-micro mb-12">{widget.title}</div>
          {LIFT_DAYS.map((lift, i) => (
            <div key={lift} className={`focus-row ${getDayIndex() === i ? 'focus-row--today' : ''}`}>
              <span className="glass-pill" style={{ fontSize: 10 }}>{['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}</span>
              <span style={{ fontSize: 13 }}>{lift}</span>
            </div>
          ))}
        </GlassCard>
      );

    case 'pr-table':
      return (
        <GlassCard className="mb-12" style={{ padding: '16px 18px' }}>
          <div className="text-micro mb-12">{widget.title}</div>
          {(widget.rows || []).map((row, i) => (
            <div key={row.lift} className="dash-kv-row">
              <span className="text-caption">{row.lift}</span>
              <input className="glass-input dash-kv-input" placeholder="PR" value={row.pr}
                onChange={(e) => {
                  const rows = widget.rows.map((x, idx) => (idx === i ? { ...x, pr: e.target.value } : x));
                  patch({ rows });
                }} />
              <span className="text-micro text-tertiary">→ {row.goal}</span>
            </div>
          ))}
        </GlassCard>
      );

    case 'word-bank':
      return (
        <GlassCard className="mb-12" style={{ padding: '16px 18px' }}>
          <div className="flex justify-between mb-12">
            <span className="text-micro">{widget.title}</span>
            <button type="button" className="glass-pill" onClick={() => patch({ words: [...(widget.words || []), { word: '', root: '', sentence: '' }] })}>
              <Plus size={12} /> Add
            </button>
          </div>
          {(widget.words || []).map((w, i) => (
            <div key={i} className="mb-12">
              <input className="glass-input mb-6" placeholder="Word" value={w.word}
                onChange={(e) => {
                  const words = widget.words.map((x, idx) => (idx === i ? { ...x, word: e.target.value } : x));
                  patch({ words });
                }} />
              <input className="glass-input" placeholder="Root / etymology" value={w.root}
                onChange={(e) => {
                  const words = widget.words.map((x, idx) => (idx === i ? { ...x, root: e.target.value } : x));
                  patch({ words });
                }} />
            </div>
          ))}
          {!(widget.words || []).length && <p className="text-caption text-secondary">Add words as you learn them.</p>}
        </GlassCard>
      );

    case 'mile-log':
      return (
        <GlassCard className="mb-12" style={{ padding: '16px 18px' }}>
          <div className="text-micro mb-12">{widget.title}</div>
          {(widget.entries || []).slice(0, 7).map((e, i) => (
            <div key={i} className="flex justify-between text-caption mb-6">
              <span>{e.date}</span><span style={{ color: dashColor, fontWeight: 700 }}>{e.time}</span>
            </div>
          ))}
          {!(widget.entries || []).length && <p className="text-caption text-secondary">Log mile times from evening run block.</p>}
        </GlassCard>
      );

    case 'trade-log':
      return (
        <GlassCard className="mb-12" style={{ padding: '16px 18px' }}>
          <div className="text-micro mb-12">{widget.title}</div>
          {(widget.entries || []).length ? widget.entries.map((e, i) => (
            <div key={i} className="mb-8 text-caption">{e.date} · {e.ticker} · {e.result}</div>
          )) : <p className="text-caption text-secondary">No trades logged yet.</p>}
        </GlassCard>
      );

    default:
      return null;
  }
}
