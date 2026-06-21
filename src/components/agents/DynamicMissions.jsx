import { Zap, ChevronRight } from 'lucide-react';
import GlassCard from '../ui/GlassCard';
import { AGENTS } from '../../data/defaults';
import { useNeuralOptional } from '../../context/NeuralContext';

export default function DynamicMissions({ onNavigate, onDelegate, compact = false }) {
  const neural = useNeuralOptional();
  const missions = neural?.missions || [];

  if (!missions.length) {
    return (
      <GlassCard holographic style={{ padding: 16, marginBottom: compact ? 0 : 20, textAlign: 'center' }}>
        <div className="text-caption text-secondary">All missions clear — execute the schedule</div>
      </GlassCard>
    );
  }

  return (
    <div className={compact ? '' : 'mb-20'}>
      {!compact && (
        <div className="flex justify-between items-center mb-12">
          <span className="text-micro">⚡ DYNAMIC MISSIONS · AUTO-GENERATED</span>
          <span className="glass-pill glass-pill--active">{missions.length} active</span>
        </div>
      )}
      <div className="mission-board">
        {missions.map((m, i) => {
          const agent = AGENTS.find((a) => a.id === m.agent);
          return (
            <GlassCard
              key={m.id}
              holographic
              accentColor={m.priority === 'now' ? 'var(--neon)' : m.priority === 'critical' ? '#f87171' : agent?.color}
              className={`mission-board__item mission-board__item--${m.priority}`}
              hover
              index={i}
              style={{ padding: '12px 14px', marginBottom: 8 }}
              onClick={() => onNavigate?.(m.action)}
            >
              <div className="flex items-center gap-12">
                <div className="mission-board__rank">{i + 1}</div>
                <div className="flex-1 min-w-0">
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{m.label}</div>
                  <div className="text-micro text-tertiary" style={{ marginTop: 2 }}>{m.detail}</div>
                </div>
                {agent && (
                  <button
                    type="button"
                    className="glass-pill"
                    style={{ fontSize: 10, borderColor: agent.color, color: agent.color }}
                    onClick={(e) => { e.stopPropagation(); onDelegate?.(agent.id, m); }}
                  >
                    {agent.emoji} Delegate
                  </button>
                )}
                <ChevronRight size={14} style={{ opacity: 0.4, flexShrink: 0 }} />
              </div>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
}
