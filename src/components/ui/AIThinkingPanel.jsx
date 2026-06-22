import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Check, Loader2, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

function fmtMs(ms) {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

export default function AIThinkingPanel({ active, steps = [], provider = 'openclaw', agentEmoji = '🧠' }) {
  const [expanded, setExpanded] = useState(true);
  const last = steps[steps.length - 1];
  const label = active
    ? (last?.message?.includes('Claude') ? 'Claude thinking' : 'OpenClaw thinking')
    : 'Ready';

  if (!active && !steps.length) return null;

  return (
    <AnimatePresence>
      {(active || steps.length > 0) && (
        <motion.div
          className="ai-thinking"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
        >
          <button type="button" className="ai-thinking__head" onClick={() => setExpanded((e) => !e)}>
            <span className="ai-thinking__pulse" data-active={active} />
            <Brain size={14} className="ai-thinking__icon" />
            <span className="ai-thinking__label">
              {agentEmoji} {active ? label : 'Response complete'}
            </span>
            {active && <Loader2 size={13} className="ai-thinking__spin" />}
            <span className="ai-thinking__provider">{provider === 'anthropic' ? 'Claude' : 'OpenClaw'}</span>
            {last && <span className="ai-thinking__time">{fmtMs(last.ms)}</span>}
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          {expanded && (
            <motion.ol className="ai-thinking__log" initial={{ height: 0 }} animate={{ height: 'auto' }}>
              {steps.map((step) => (
                <li key={step.id} className={`ai-thinking__step ai-thinking__step--${step.status}`}>
                  <span className="ai-thinking__step-icon">
                    {step.status === 'active' && <Loader2 size={11} className="ai-thinking__spin" />}
                    {step.status === 'done' && <Check size={11} />}
                    {step.status === 'error' && <AlertCircle size={11} />}
                  </span>
                  <span className="ai-thinking__step-msg">{step.message}</span>
                  <span className="ai-thinking__step-time">{fmtMs(step.ms)}</span>
                </li>
              ))}
              {active && (
                <li className="ai-thinking__step ai-thinking__step--active ai-thinking__step--cursor">
                  <span className="ai-thinking__step-icon"><span className="ai-thinking__dot" /></span>
                  <span className="ai-thinking__step-msg">Waiting for model…</span>
                </li>
              )}
            </motion.ol>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
