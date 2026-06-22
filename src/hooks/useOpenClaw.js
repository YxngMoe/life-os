import { useState, useEffect, useCallback } from 'react';
import { ANTHROPIC_MODEL } from '../constants/ai';
import { SECRETS } from '../../lib/secrets.js';

const OPENCLAW_URL = SECRETS.OPENCLAW_URL;

async function proxyHealth() {
  const res = await fetch('/api/openclaw', { signal: AbortSignal.timeout(8000) });
  const ct = res.headers.get('content-type') || '';
  if (!ct.includes('application/json')) return false;
  const data = await res.json().catch(() => ({}));
  return res.ok && data.ok === true;
}

/** @returns {{ reply: string|null, source: 'openclaw'|'anthropic', error?: string }} */
async function proxyChat(message, agent, context) {
  const res = await fetch('/api/openclaw', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, agent, context }),
    signal: AbortSignal.timeout(120000),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    return {
      reply: null,
      source: 'openclaw',
      error: data.hint || data.error || `OpenClaw HTTP ${res.status}`,
    };
  }
  return { reply: data.reply || null, source: data.source || 'openclaw' };
}

export function useOpenClaw() {
  const [status, setStatus] = useState('checking');
  const [lastError, setLastError] = useState(null);

  const checkHealth = useCallback(async () => {
    try {
      const ok = await proxyHealth();
      setStatus(ok ? 'connected' : 'idle');
      if (ok) setLastError(null);
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
    const result = await proxyChat(message, agent, context);
    if (result.error) setLastError(result.error);
    else setLastError(null);
    return result;
  };

  return { status, lastError, checkHealth, sendMessage, url: OPENCLAW_URL };
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
      if (data.reply) return { reply: data.reply, source: 'anthropic' };
    }
    if (res.status === 503) {
      return { reply: 'Missing ANTHROPIC_API_KEY in lib/secrets.js', source: 'anthropic' };
    }
  } catch {
    /* try direct key below */
  }

  const key = SECRETS.ANTHROPIC_API_KEY;
  if (!key) {
    return { reply: 'AI unavailable — set ANTHROPIC_API_KEY in lib/secrets.js', source: 'anthropic' };
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
    return { reply: `API error: ${err.slice(0, 120)}`, source: 'anthropic' };
  }

  const data = await res.json();
  return { reply: data.content?.[0]?.text || 'No response.', source: 'anthropic' };
}

/** Try OpenClaw first; never silently fall back when OpenClaw returned an error. */
export async function resolveAIReply(sendMessage, systemPrompt, userText, agent, history) {
  const oc = await sendMessage(userText, agent, systemPrompt);
  if (oc.reply) return { ...oc, via: 'openclaw' };

  if (oc.error) {
    return {
      reply: `OpenClaw could not reply.\n\n${oc.error}\n\nIf token is wrong, update OPENCLAW_GATEWAY_TOKEN in lib/secrets.js (droplet: grep token ~/.openclaw/openclaw.json).`,
      source: 'openclaw',
      via: 'openclaw-error',
    };
  }

  const fb = await sendAnthropicFallback(systemPrompt, history.map((m) => ({ role: m.role, content: m.content })));
  return {
    ...fb,
    via: 'anthropic-fallback',
    fallbackNote: 'OpenClaw returned no reply',
  };
}
