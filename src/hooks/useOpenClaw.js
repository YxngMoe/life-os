import { useState, useEffect, useCallback } from 'react';
import { ANTHROPIC_MODEL } from '../constants/ai';

const OPENCLAW_URL = import.meta.env.VITE_OPENCLAW_URL || 'http://67.205.162.212:18789';
const IS_DEV = import.meta.env.DEV;

async function proxyHealth() {
  const res = await fetch('/api/openclaw', { signal: AbortSignal.timeout(8000) });
  return res.ok;
}

async function directHealth() {
  const res = await fetch(`${OPENCLAW_URL}/health`, { signal: AbortSignal.timeout(5000) });
  return res.ok;
}

async function proxyChat(message, agent, context) {
  const res = await fetch('/api/openclaw', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, agent, context }),
    signal: AbortSignal.timeout(120000),
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.reply || null;
}

async function directChat(message, agent, context, token) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  const messages = context
    ? [{ role: 'system', content: context }, { role: 'user', content: message }]
    : [{ role: 'user', content: message }];

  const res = await fetch(`${OPENCLAW_URL}/v1/chat/completions`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      model: 'openclaw/default',
      user: agent ? `life-os:${agent}` : 'life-os',
      messages,
      stream: false,
    }),
    signal: AbortSignal.timeout(120000),
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.choices?.[0]?.message?.content || data.reply || null;
}

export function useOpenClaw() {
  const [status, setStatus] = useState('checking');

  const checkHealth = useCallback(async () => {
    try {
      const ok = IS_DEV ? await directHealth() : await proxyHealth();
      setStatus(ok ? 'connected' : 'idle');
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
    if (IS_DEV) {
      const token = import.meta.env.VITE_OPENCLAW_TOKEN || '';
      return directChat(message, agent, context, token);
    }
    return proxyChat(message, agent, context);
  };

  return { status, checkHealth, sendMessage, url: OPENCLAW_URL };
}

export async function sendAnthropicFallback(systemPrompt, messages) {
  try {
    const res = await fetch('/api/anthropic', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ systemPrompt, messages }),
      signal: AbortSignal.timeout(45000),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.reply) return data.reply;
    }
    if (res.status === 503) {
      return 'Add ANTHROPIC_API_KEY in Vercel → Settings → Environment Variables, then Redeploy.';
    }
  } catch {
    /* local dev — try direct key below */
  }

  const key = import.meta.env.VITE_ANTHROPIC_KEY;
  if (!key) {
    return 'AI unavailable — set ANTHROPIC_API_KEY on Vercel (or VITE_ANTHROPIC_KEY in .env for local dev), then redeploy.';
  }

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': key,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: ANTHROPIC_MODEL,
      max_tokens: 1000,
      system: systemPrompt || '',
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
