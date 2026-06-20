import { useState, useEffect, useCallback } from 'react';

const OPENCLAW_URL = import.meta.env.VITE_OPENCLAW_URL || 'http://67.205.162.212:18789';

export function useOpenClaw() {
  const [status, setStatus] = useState('checking');

  const checkHealth = useCallback(async () => {
    try {
      const res = await fetch(`${OPENCLAW_URL}/health`, {
        method: 'GET',
        signal: AbortSignal.timeout(5000),
      });
      setStatus(res.ok ? 'connected' : 'idle');
    } catch {
      setStatus('offline');
    }
  }, []);

  useEffect(() => {
    checkHealth();
    const id = setInterval(checkHealth, 60000);
    return () => clearInterval(id);
  }, [checkHealth]);

  const sendMessage = async (message, agent, context = '') => {
    try {
      const res = await fetch(`${OPENCLAW_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, agent, context }),
        signal: AbortSignal.timeout(30000),
      });
      if (!res.ok) throw new Error('OpenClaw error');
      const data = await res.json();
      return data.reply || data.message || data.content;
    } catch {
      return null;
    }
  };

  return { status, checkHealth, sendMessage, url: OPENCLAW_URL };
}

export async function sendAnthropicFallback(systemPrompt, messages) {
  const key = import.meta.env.VITE_ANTHROPIC_KEY;
  if (!key) return 'Add VITE_ANTHROPIC_KEY to .env for AI chat.';

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': key,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      system: systemPrompt,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    return `API error: ${err.slice(0, 120)}`;
  }

  const data = await res.json();
  return data.content?.[0]?.text || 'No response.';
}
