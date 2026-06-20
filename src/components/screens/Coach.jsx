import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mic } from 'lucide-react';
import GlassCard from '../ui/GlassCard';
import AgentPills from '../ui/AgentPills';
import { useStorage } from '../../hooks/useStorage';
import { AGENTS, AGENT_PROMPTS, DEFAULT_SUBJECTS } from '../../data/defaults';
import { getAgentChat, setAgentChat } from '../../data/storage';
import { useOpenClaw, sendAnthropicFallback } from '../../hooks/useOpenClaw';

const MODES = ['voice', 'chat', 'agents', 'feynman', 'interview'];
const QUICK_PROMPTS = ['Focus for today?', 'Quiz me on what I studied', 'ABW progress check', 'Morning motivation', "What's my meal plan?", 'Feynman: '];

export default function CoachScreen({ onNavigate }) {
  const [mode, setMode] = useState('chat');
  const [agent, setAgent] = useState('moe');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [messages, setMessagesState] = useState(() => getAgentChat('moe'));
  const [feynmanSubject, setFeynmanSubject] = useState('tech');
  const { status, sendMessage } = useOpenClaw();
  const recognitionRef = useRef(null);

  useEffect(() => {
    setMessagesState(getAgentChat(agent));
  }, [agent]);

  function saveMessages(msgs) {
    setMessagesState(msgs);
    setAgentChat(agent, msgs);
  }

  async function send(userText) {
    if (!userText.trim() || loading) return;
    const userMsg = { role: 'user', content: userText.trim(), ts: Date.now() };
    const next = [...messages, userMsg];
    saveMessages(next);
    setInput('');
    setLoading(true);

    let reply = await sendMessage(userText, agent, AGENT_PROMPTS[agent]);
    if (!reply) {
      const apiMessages = next.map((m) => ({ role: m.role, content: m.content }));
      reply = await sendAnthropicFallback(AGENT_PROMPTS[agent], apiMessages);
    }

    saveMessages([...next, { role: 'assistant', content: reply, ts: Date.now() }]);
    setLoading(false);

    if (mode === 'voice' && 'speechSynthesis' in window) {
      const u = new SpeechSynthesisUtterance(reply.slice(0, 500));
      speechSynthesis.speak(u);
    }
  }

  function startVoice() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { send('Voice not supported — type instead.'); return; }
    const rec = new SR();
    rec.lang = 'en-US';
    rec.onstart = () => setListening(true);
    rec.onend = () => setListening(false);
    rec.onresult = (e) => send(e.results[0][0].transcript);
    rec.start();
    recognitionRef.current = rec;
  }

  return (
    <motion.div className="screen" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)', paddingBottom: 0 }} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
      <div className="screen-header">
        <h1 className="text-title2">✨ Coach</h1>
        <p className="text-secondary">Voice · Chat · Agents · Feynman · Interview</p>
      </div>

      <div className="segmented mb-12">
        {MODES.map((m) => (
          <button key={m} type="button" className={mode === m ? 'active' : ''} onClick={() => setMode(m)}>
            {m === 'voice' && '🎙️'}{m === 'chat' && '💬'}{m === 'agents' && '🤖'}{m === 'feynman' && '📚'}{m === 'interview' && '🎤'}
          </button>
        ))}
      </div>

      <AgentPills active={agent} onSelect={setAgent} />

      {mode === 'agents' && (
        <div className="grid-2 mb-16">
          {AGENTS.map((a) => (
            <GlassCard key={a.id} hover onClick={() => { setAgent(a.id); setMode('chat'); }} style={{ padding: 16 }}>
              <div style={{ fontSize: 28 }}>{a.emoji}</div>
              <div className="text-headline">{a.name}</div>
              <div className="text-secondary" style={{ fontSize: 13 }}>{a.desc}</div>
              <span className={`agent-status-dot ${status === 'connected' ? 'green' : status === 'idle' ? 'amber' : 'red'}`} style={{ marginTop: 8 }} />
            </GlassCard>
          ))}
        </div>
      )}

      {mode === 'voice' && (
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <div className={`voice-sphere ${listening ? 'listening' : ''}`} onClick={startVoice}>
            <Mic size={32} color="var(--accent-indigo)" />
          </div>
          <p className="text-secondary">{listening ? 'Listening...' : 'Tap to speak'}</p>
        </div>
      )}

      {mode === 'feynman' && (
        <GlassCard style={{ padding: 16, marginBottom: 16 }}>
          <select className="glass-input mb-12" value={feynmanSubject} onChange={(e) => setFeynmanSubject(e.target.value)}>
            {DEFAULT_SUBJECTS.map((s) => <option key={s.id} value={s.id}>{s.n}</option>)}
          </select>
          <button type="button" className="glass-btn glass-btn--primary w-full" onClick={() => send(`Start a Feynman session on ${feynmanSubject}. Quiz me hard.`)}>Start Feynman Session</button>
        </GlassCard>
      )}

      {mode === 'interview' && (
        <div className="grid-2 mb-16">
          {['JPMC Behavioral', 'General Tech', 'ABW Pitch', 'Communication'].map((type) => (
            <button key={type} type="button" className="glass-pill" style={{ padding: 14 }} onClick={() => send(`Start ${type} interview practice. Ask me one question.`)}>
              {type}
            </button>
          ))}
        </div>
      )}

      {(mode === 'chat' || mode === 'voice') && (
        <>
          <div className="chat-messages flex-1">
            {messages.length === 0 && (
              <div className="flex gap-8" style={{ flexWrap: 'wrap' }}>
                {QUICK_PROMPTS.map((p) => (
                  <button key={p} type="button" className="glass-pill" onClick={() => send(p)}>{p}</button>
                ))}
              </div>
            )}
            {messages.map((m, i) => (
              m.role === 'user' ? (
                <div key={i} className="chat-user">{m.content}</div>
              ) : (
                <GlassCard key={i} className="chat-assistant">✨ {m.content}</GlassCard>
              )
            ))}
            {loading && <GlassCard className="chat-assistant" style={{ padding: '12px 20px' }}>...</GlassCard>}
          </div>

          <div className="flex gap-8" style={{ padding: '12px 0', marginTop: 'auto' }}>
            <input className="glass-input flex-1" placeholder="Message..." value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && send(input)} />
            <button type="button" className="glass-btn glass-btn--primary" onClick={() => send(input)} disabled={loading}>Send</button>
          </div>
        </>
      )}
    </motion.div>
  );
}
