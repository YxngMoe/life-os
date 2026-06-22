import { useState, useEffect, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Mic, Send, Target, Zap } from 'lucide-react';
import GlassCard from '../ui/GlassCard';
import ScreenHero from '../ui/ScreenHero';
import AgentPills from '../ui/AgentPills';
import CountUp from '../ui/CountUp';
import { useStorage } from '../../hooks/useStorage';
import { useToast } from '../../context/ToastContext';
import { AGENTS, AGENT_PROMPTS, DEFAULT_SUBJECTS } from '../../data/defaults';
import { getAgentChat, setAgentChat, getSubjectNotes, lsGet, lsSet } from '../../data/storage';
import { useOpenClaw, resolveAIReply } from '../../hooks/useOpenClaw';
import { calcGoalProgress, getGoalsStats } from '../../data/goals';
import AgentHub from '../agents/AgentHub';
import { screenEnter } from '../../utils/motion';

const MODES = [
  { id: 'command', label: '🤖 Command' },
  { id: 'voice', label: '🎙️ Voice' },
  { id: 'chat', label: '💬 Chat' },
  { id: 'agents', label: '🤖 Agents' },
  { id: 'feynman', label: '📚 Feynman' },
  { id: 'interview', label: '🎤 Interview' },
];

const QUICK = ['Focus for today?', 'Quiz me on what I studied', 'ABW progress check', 'Morning motivation', 'Meal plan check', 'Feynman: '];
const INTERVIEW_TYPES = ['JPMC Behavioral', 'General Tech', 'ABW Pitch Practice', 'Communication Coach'];

function buildGoalBrief(goals) {
  const stats = getGoalsStats(goals);
  const critical = goals.filter((g) => !g.done && g.priority === 'critical').slice(0, 5);
  const lines = critical.map((g) => `- ${g.text} (${calcGoalProgress(g)}%)`);
  return `Goals briefing: ${stats.active} active, ${stats.critical} critical, ${stats.avgProgress}% avg progress.\nCritical:\n${lines.join('\n') || 'none'}`;
}

export default function CoachScreen({ onNavigate }) {
  const toast = useToast();
  const [goals] = useStorage('goals', []);
  const goalStats = useMemo(() => getGoalsStats(goals), [goals]);
  const criticalGoals = useMemo(() => goals.filter((g) => !g.done && g.priority === 'critical').slice(0, 4), [goals]);
  const dynamicQuick = useMemo(() => {
    const chips = ['Goals briefing', 'What should I do right now?', 'Critical goals check-in'];
    criticalGoals.forEach((g) => chips.push(`Progress on: ${g.text.slice(0, 40)}`));
    return [...chips, ...QUICK];
  }, [criticalGoals]);
  const [mode, setMode] = useState('chat');
  const [agent, setAgent] = useState('moe');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [messages, setMessagesState] = useState(() => getAgentChat('moe'));
  const [feynmanSubject, setFeynmanSubject] = useState('tech');
  const [feynmanActive, setFeynmanActive] = useState(false);
  const [interviewType, setInterviewType] = useState('');
  const { status, sendMessage, lastError } = useOpenClaw();
  const [aiDiag, setAiDiag] = useState(null);
  const recRef = useRef(null);
  const agentData = AGENTS.find((a) => a.id === agent);

  useEffect(() => {
    fetch('/api/ai-status').then((r) => r.json()).then(setAiDiag).catch(() => {});
  }, []);

  useEffect(() => { setMessagesState(getAgentChat(agent)); }, [agent]);

  function saveMessages(msgs) {
    setMessagesState(msgs);
    setAgentChat(agent, msgs);
  }

  async function send(userText, logAction) {
    if (!userText?.trim() || loading) return;
    const userMsg = { role: 'user', content: userText.trim(), ts: Date.now() };
    const next = [...messages, userMsg];
    saveMessages(next);
    setInput('');
    setLoading(true);

    const { reply, via } = await resolveAIReply(
      sendMessage,
      AGENT_PROMPTS[agent],
      userText,
      agent,
      next,
    );

    saveMessages([...next, { role: 'assistant', content: reply, via, ts: Date.now() }]);
    setLoading(false);

    if (logAction) {
      lsSet('agent_log', [{ agent, action: logAction, ts: Date.now() }, ...(lsGet('agent_log') || []).slice(0, 9)]);
    }

    if (mode === 'voice' && 'speechSynthesis' in window) {
      setSpeaking(true);
      const u = new SpeechSynthesisUtterance(reply.slice(0, 800));
      u.onend = () => setSpeaking(false);
      speechSynthesis.speak(u);
    }
  }

  useEffect(() => {
    const pendingAgent = sessionStorage.getItem('los_coach_agent');
    const pendingPrompt = sessionStorage.getItem('los_coach_prompt');
    if (pendingAgent) {
      setAgent(pendingAgent);
      setMode('chat');
      sessionStorage.removeItem('los_coach_agent');
    }
    if (pendingPrompt) {
      sessionStorage.removeItem('los_coach_prompt');
      setTimeout(() => send(pendingPrompt, 'Delegated mission'), 400);
    }
  }, []);

  function toggleVoice() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { toast('Voice not supported in this browser', 'amber'); return; }
    if (listening && recRef.current) { recRef.current.stop(); return; }
    const rec = new SR();
    rec.lang = 'en-US';
    rec.onstart = () => setListening(true);
    rec.onend = () => setListening(false);
    rec.onresult = (e) => send(e.results[0][0].transcript, 'Voice message');
    rec.start();
    recRef.current = rec;
  }

  function startFeynman() {
    setFeynmanActive(true);
    setMode('chat');
    const notes = getSubjectNotes(feynmanSubject).map((n) => n.content).join('\n').slice(0, 2000);
    send(`Start Feynman session on ${feynmanSubject}. My notes: ${notes || 'none yet'}. Quiz me hard.`, 'Feynman session started');
  }

  function saveFeynman() {
    lsSet(`feynman_${new Date().toISOString().slice(0, 10)}`, { subject: feynmanSubject, transcript: messages, gaps: [], ts: Date.now() });
    toast('Session saved', 'emerald');
    setFeynmanActive(false);
  }

  const statusDot = status === 'connected' ? 'green' : status === 'idle' ? 'amber' : 'red';

  return (
    <motion.div className="screen" style={{ display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - 140px)' }} {...screenEnter}>
      <ScreenHero
        icon="✨"
        title="AI Neural Coach"
        subtitle="Voice · Chat · Agents · Feynman · Interview prep"
        accent="#f472b6"
        badge={status === 'connected' ? 'OPENCLAW GATEWAY' : 'GATEWAY OFFLINE'}
        stats={[
          { label: 'Goals active', value: goalStats.active },
          { label: 'Critical', value: goalStats.critical, color: '#f87171' },
          { label: 'Agent', value: agentData?.name || 'Moe' },
        ]}
      />

      <AgentPills active={agent} onSelect={setAgent} />

      {lastError && (
        <div className="offline-banner mb-12" style={{ position: 'relative', top: 0 }}>
          OpenClaw chat blocked: {lastError}
        </div>
      )}

      {aiDiag && !aiDiag.hasOpenClawToken && (
        <div className="offline-banner mb-12" style={{ position: 'relative', top: 0, borderColor: 'rgba(251,191,36,0.4)', color: '#fbbf24' }}>
          {aiDiag.host === 'netlify' ? 'Netlify' : 'This host'} has no OPENCLAW_GATEWAY_TOKEN — Vercel env vars are separate. Add the token on {aiDiag.host || 'your host'}, redeploy.
        </div>
      )}

      <div className="coach-goals-bar mb-16">
        <GlassCard accentColor="#6366f1" style={{ padding: '12px 16px', flex: 1 }}>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-8">
              <Target size={16} color="#6366f1" />
              <span className="text-caption">Goals linked</span>
            </div>
            <div className="flex gap-12 text-micro">
              <span><CountUp value={goalStats.active} /> active</span>
              <span style={{ color: '#f87171' }}><CountUp value={goalStats.critical} /> critical</span>
              <span style={{ color: '#34d399' }}>{goalStats.avgProgress}% avg</span>
            </div>
          </div>
        </GlassCard>
        <button type="button" className="glass-btn glass-btn--primary" style={{ flexShrink: 0 }} onClick={() => send(buildGoalBrief(goals), 'Goals briefing')}>
          <Zap size={14} /> Brief
        </button>
      </div>

      <div className="segmented mb-16">
        {MODES.map((m) => (
          <button key={m.id} type="button" className={mode === m.id ? 'active' : ''} onClick={() => setMode(m.id)}>{m.label}</button>
        ))}
      </div>

      {mode === 'command' && <AgentHub embedded onNavigate={onNavigate} />}

      {mode === 'agents' && (
        <div className="grid-2 mb-16">
          {AGENTS.map((a) => {
            const hist = getAgentChat(a.id);
            const last = hist[hist.length - 1];
            return (
              <GlassCard key={a.id} hover index={0} style={{ padding: 18, boxShadow: `0 0 24px ${a.color}33` }} onClick={() => { setAgent(a.id); setMode('chat'); }}>
                <div style={{ fontSize: 40 }}>{a.emoji}</div>
                <div className="text-headline">{a.name}</div>
                <div className="text-caption text-secondary">{a.desc}</div>
                {last && <div className="text-micro text-tertiary" style={{ marginTop: 8 }}>{last.content?.slice(0, 50)}…</div>}
                <span className={`status-dot ${statusDot}`} style={{ marginTop: 8 }} />
              </GlassCard>
            );
          })}
        </div>
      )}

      {mode === 'voice' && (
        <div style={{ textAlign: 'center', padding: '24px 0' }}>
          <div className={`voice-sphere ${listening || speaking ? 'listening' : ''}`} style={{ boxShadow: `0 0 40px ${agentData?.color}55` }} onClick={toggleVoice}>
            <Mic size={36} color={agentData?.color || 'var(--indigo)'} />
          </div>
          <p className="text-caption text-secondary">{listening ? 'Listening…' : speaking ? 'Speaking…' : 'Tap to speak'}</p>
          <div className="chat-messages" style={{ maxHeight: 240, marginTop: 20 }}>
            {messages.slice(-4).map((m, i) => (
              m.role === 'user' ? <div key={i} className="chat-user">{m.content}</div> : (
                <GlassCard key={i} className="chat-assistant">
                  {agentData?.emoji} {m.content}
                  {m.via && (
                    <div className="text-micro text-tertiary mt-8" style={{ opacity: 0.7 }}>
                      {m.via === 'openclaw' ? 'via OpenClaw' : m.via === 'openclaw-error' ? 'OpenClaw config needed' : 'via Claude (fallback)'}
                    </div>
                  )}
                </GlassCard>
              )
            ))}
          </div>
        </div>
      )}

      {mode === 'feynman' && (
        <GlassCard style={{ padding: 20, marginBottom: 16 }}>
          <select className="glass-input mb-12" value={feynmanSubject} onChange={(e) => setFeynmanSubject(e.target.value)}>
            {DEFAULT_SUBJECTS.map((s) => <option key={s.id} value={s.id}>{s.n}</option>)}
          </select>
          {!feynmanActive ? (
            <button type="button" className="glass-btn glass-btn--primary glass-btn--glow w-full" onClick={startFeynman}>Start Feynman Session</button>
          ) : (
            <button type="button" className="glass-btn w-full" onClick={saveFeynman}>End & Save Session</button>
          )}
        </GlassCard>
      )}

      {mode === 'interview' && (
        <div className="grid-2 mb-16">
          {INTERVIEW_TYPES.map((t) => (
            <button key={t} type="button" className={`glass-pill ${interviewType === t ? 'glass-pill--active' : ''}`} style={{ padding: 14, justifyContent: 'center' }}
              onClick={() => { setInterviewType(t); setMode('chat'); send(`Start ${t} interview. Ask me one question at a time and give STAR feedback.`, t); }}>
              {t}
            </button>
          ))}
        </div>
      )}

      {(mode === 'chat' || feynmanActive) && mode !== 'agents' && mode !== 'voice' && mode !== 'command' && (
        <>
          <div className="chat-messages flex-1">
            {messages.length === 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {dynamicQuick.map((p) => (
                  <button key={p} type="button" className="glass-pill" onClick={() => {
                    if (p === 'Goals briefing') send(buildGoalBrief(goals), 'Goals briefing');
                    else if (p === 'Critical goals check-in') send(`Review my ${goalStats.critical} critical goals. For each one: current status, next action, and whether I'm on track.`, 'Critical check-in');
                    else send(p);
                  }}>{p}</button>
                ))}
              </div>
            )}
            {messages.map((m, i) => (
              m.role === 'user' ? <div key={i} className="chat-user">{m.content}</div> :
                <GlassCard key={i} className="chat-assistant">
                  {agentData?.emoji} {m.content}
                  {m.via && (
                    <div className="text-micro text-tertiary mt-8" style={{ opacity: 0.7 }}>
                      {m.via === 'openclaw' ? 'via OpenClaw' : m.via === 'openclaw-error' ? 'OpenClaw config needed' : 'via Claude (fallback)'}
                    </div>
                  )}
                </GlassCard>
            ))}
            {loading && <GlassCard className="chat-assistant"><motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1 }}>···</motion.span></GlassCard>}
          </div>
          <div className="flex gap-8" style={{ paddingTop: 12, marginTop: 'auto' }}>
            <input className="glass-input flex-1" placeholder="Message…" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && send(input, 'Chat message')} />
            <button type="button" className="glass-btn glass-btn--primary" onClick={() => send(input, 'Chat message')} disabled={loading}><Send size={16} /></button>
          </div>
        </>
      )}
    </motion.div>
  );
}
