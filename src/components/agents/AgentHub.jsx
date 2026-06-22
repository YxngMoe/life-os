import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bot, Zap, Radio, Send, Activity } from 'lucide-react';
import GlassCard from '../ui/GlassCard';
import ScreenHero from '../ui/ScreenHero';
import { useStorage } from '../../hooks/useStorage';
import { useOpenClaw, resolveAIReply } from '../../hooks/useOpenClaw';
import { useToast } from '../../context/ToastContext';
import { AGENTS, AGENT_PROMPTS } from '../../data/defaults';
import { AGENT_CAPABILITIES, AGENT_QUICK_ACTIONS } from '../../data/agentConfig';
import { getAgentChat, setAgentChat, lsGet, lsSet } from '../../data/storage';
import { useNeuralOptional } from '../../context/NeuralContext';
import DynamicMissions from './DynamicMissions';
import { screenEnter } from '../../utils/motion';

function AgentCard({ agent, recommended, onSelect, onQuickAction, loading }) {
  const caps = AGENT_CAPABILITIES[agent.id] || [];
  const actions = AGENT_QUICK_ACTIONS[agent.id] || [];
  const [expanded, setExpanded] = useState(recommended);

  return (
    <GlassCard
      holographic
      neon={recommended}
      accentColor={agent.color}
      className={`agent-card ${recommended ? 'agent-card--recommended' : ''}`}
      style={{ padding: 0, marginBottom: 12, overflow: 'hidden' }}
    >
      <button type="button" className="agent-card__head" onClick={() => setExpanded(!expanded)}>
        <div className="agent-card__avatar" style={{ boxShadow: `0 0 20px ${agent.color}55` }}>
          {agent.emoji}
          {recommended && <span className="agent-card__pulse" />}
        </div>
        <div className="flex-1 min-w-0 text-left">
          <div className="flex items-center gap-8">
            <span className="text-headline">{agent.name}</span>
            {recommended && <span className="agent-card__rec">RECOMMENDED</span>}
          </div>
          <div className="text-caption text-secondary">{agent.desc}</div>
        </div>
        <Radio size={16} style={{ color: recommended ? agent.color : 'var(--text3)' }} />
      </button>
      {expanded && (
        <motion.div className="agent-card__body" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}>
          <div className="agent-card__caps">
            {caps.map((c) => <span key={c} className="glass-pill" style={{ fontSize: 9 }}>{c}</span>)}
          </div>
          <div className="agent-card__actions">
            {actions.map((a) => (
              <button
                key={a.label}
                type="button"
                className="feature-chip"
                disabled={loading}
                onClick={() => onQuickAction(agent.id, a.prompt, a.label)}
              >
                {a.label}
              </button>
            ))}
          </div>
          <button type="button" className="glass-btn glass-btn--primary w-full mt-8" onClick={() => onSelect(agent.id)}>
            <Bot size={14} /> Open {agent.name} Chat
          </button>
        </motion.div>
      )}
    </GlassCard>
  );
}

export default function AgentHub({ onNavigate, embedded = false }) {
  const toast = useToast();
  const neural = useNeuralOptional();
  const { status, sendMessage } = useOpenClaw();
  const [agentLog, setAgentLog] = useStorage('agent_log', []);
  const [loading, setLoading] = useState(null);
  const [orchestratorMsg, setOrchestratorMsg] = useState('');
  const [tickerIdx, setTickerIdx] = useState(0);

  const tickers = neural?.tickerMessages || ['NEURAL OS · AGENTS ONLINE'];

  useEffect(() => {
    const id = setInterval(() => setTickerIdx((i) => (i + 1) % tickers.length), 4000);
    return () => clearInterval(id);
  }, [tickers.length]);

  async function runAgent(agentId, prompt, label) {
    setLoading(agentId);
    const agent = AGENTS.find((a) => a.id === agentId);
    const hist = getAgentChat(agentId);
    const userMsg = { role: 'user', content: prompt, ts: Date.now() };
    const next = [...hist, userMsg];
    setAgentChat(agentId, next);

    const { reply } = await resolveAIReply(
      sendMessage,
      AGENT_PROMPTS[agentId],
      prompt,
      agentId,
      next,
    );
    setAgentChat(agentId, [...next, { role: 'assistant', content: reply, ts: Date.now() }]);

    const entry = { agent: agentId, action: label || prompt.slice(0, 40), ts: Date.now(), preview: reply.slice(0, 80) };
    setAgentLog([entry, ...agentLog.slice(0, 19)]);
    lsSet('agent_log', [entry, ...(lsGet('agent_log') || []).slice(0, 19)]);
    lsSet('agent_last_reply', { agent: agentId, reply, ts: Date.now() });

    setLoading(null);
    toast(`${agent?.emoji} ${agent?.name} responded`, 'indigo');
    sessionStorage.setItem('los_coach_agent', agentId);
    onNavigate?.('/coach');
  }

  function handleDelegate(agentId, mission) {
    const prompt = `Mission delegated: ${mission.label}. Context: ${mission.detail}. What are my exact next 3 steps? Be ruthless and specific.`;
    runAgent(agentId, prompt, `Mission: ${mission.label.slice(0, 30)}`);
  }

  async function orchestrate() {
    if (!orchestratorMsg.trim()) return;
    const agentId = neural?.recommendedAgentId || 'moe';
    await runAgent(agentId, orchestratorMsg, 'Orchestrator');
    setOrchestratorMsg('');
  }

  const content = (
    <>
      {!embedded && (
        <ScreenHero
          icon="🤖"
          title="AI Agent Command"
          subtitle="5 specialized agents · auto-routing · live orchestration"
          accent="#c084fc"
          badge={status === 'connected' ? 'OPENCLAW GATEWAY' : 'GATEWAY OFFLINE'}
          stats={[
            { label: 'Agents', value: AGENTS.length },
            { label: 'Active', value: AGENTS.length, color: '#c084fc' },
            { label: 'Recommended', value: neural?.recommendedAgent?.name || 'Moe' },
          ]}
        />
      )}

      <GlassCard holographic neon className="orchestrator mb-20" style={{ padding: 16 }}>
        <div className="flex items-center gap-8 mb-12">
          <Zap size={16} color="var(--neon)" />
          <span className="text-micro" style={{ color: 'var(--neon)' }}>NEURAL ORCHESTRATOR</span>
          <span className="orchestrator__ticker">{tickers[tickerIdx]}</span>
        </div>
        <p className="text-caption text-secondary mb-12">
          Type anything — auto-routes to <strong style={{ color: neural?.recommendedAgent?.color }}>{neural?.recommendedAgent?.emoji} {neural?.recommendedAgent?.name}</strong> based on context
        </p>
        <div className="flex gap-8">
          <input
            className="glass-input flex-1"
            placeholder="Ask anything… agents will coordinate"
            value={orchestratorMsg}
            onChange={(e) => setOrchestratorMsg(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && orchestrate()}
          />
          <button type="button" className="glass-btn glass-btn--primary" onClick={orchestrate} disabled={!!loading}>
            <Send size={14} />
          </button>
        </div>
      </GlassCard>

      <DynamicMissions onNavigate={onNavigate} onDelegate={handleDelegate} />

      <div className="text-micro mb-12">🤖 AGENT ROSTER</div>
      {AGENTS.map((agent) => (
        <AgentCard
          key={agent.id}
          agent={agent}
          recommended={agent.id === neural?.recommendedAgentId}
          loading={!!loading}
          onSelect={(id) => {
            sessionStorage.setItem('los_coach_agent', id);
            onNavigate?.('/coach');
          }}
          onQuickAction={runAgent}
        />
      ))}

      {(agentLog.length > 0 || neural?.recentAgentActivity?.length > 0) && (
        <div className="mt-20">
          <div className="flex items-center gap-8 mb-12">
            <Activity size={14} color="var(--neon)" />
            <span className="text-micro">AGENT ACTIVITY FEED</span>
          </div>
          {(agentLog.length ? agentLog : neural.recentAgentActivity).slice(0, 6).map((entry, i) => {
            const agent = AGENTS.find((a) => a.id === entry.agent);
            return (
              <GlassCard key={i} style={{ padding: '10px 14px', marginBottom: 6, opacity: 0.85 }}>
                <div className="flex justify-between items-center">
                  <span>{agent?.emoji} <strong>{agent?.name}</strong></span>
                  <span className="text-micro text-tertiary">{new Date(entry.ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div className="text-caption text-secondary" style={{ marginTop: 4 }}>{entry.action}</div>
                {entry.preview && <div className="text-micro text-tertiary" style={{ marginTop: 4 }}>{entry.preview}…</div>}
              </GlassCard>
            );
          })}
        </div>
      )}
    </>
  );

  if (embedded) return content;

  return (
    <motion.div className="screen" {...screenEnter}>
      {content}
    </motion.div>
  );
}
