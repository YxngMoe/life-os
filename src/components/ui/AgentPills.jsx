import { AGENTS } from '../../data/defaults';

export default function AgentPills({ active, onSelect }) {
  return (
    <div className="agent-pills">
      {AGENTS.map((agent) => (
        <button
          key={agent.id}
          type="button"
          className={`agent-pill ${active === agent.id ? 'active' : ''}`}
          style={{
            '--pill-color': agent.color,
            '--pill-glow': `${agent.color}40`,
          }}
          onClick={() => onSelect(agent.id)}
        >
          <span>{agent.emoji}</span>
          {agent.name}
        </button>
      ))}
    </div>
  );
}
