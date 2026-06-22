/** Shared OpenClaw proxy logic (Vercel + Netlify + Vite dev). */

import { SECRETS } from './secrets.js';

export function getOpenClawConfig() {
  return {
    url: SECRETS.OPENCLAW_URL,
    token: SECRETS.OPENCLAW_GATEWAY_TOKEN,
  };
}

export async function openclawHealth(url) {
  const r = await fetch(`${url}/health`, { signal: AbortSignal.timeout(8000) });
  const body = await r.text();
  let data;
  try {
    data = JSON.parse(body);
  } catch {
    return { ok: false, status: r.status, error: 'Invalid health response (not JSON — API route may be missing)' };
  }
  return { ok: r.ok && data.ok === true, status: r.status, data };
}

export async function openclawChat({ url, token, message, agent, context, clientMessages }) {
  if (!token) {
    return {
      ok: false,
      status: 503,
      error: 'Missing OPENCLAW_GATEWAY_TOKEN',
      hint: 'Set OPENCLAW_GATEWAY_TOKEN in lib/secrets.js',
    };
  }

  const systemPrompt = context || '';
  const messages = clientMessages?.length
    ? clientMessages
    : [{ role: 'user', content: message }];

  const withSystem = systemPrompt
    ? [{ role: 'system', content: systemPrompt }, ...messages.filter((m) => m.role !== 'system')]
    : messages;

  const upstream = await fetch(`${url}/v1/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      'x-openclaw-agent-id': agent || 'main',
    },
    body: JSON.stringify({
      model: 'openclaw/default',
      user: agent ? `life-os:${agent}` : 'life-os',
      messages: withSystem,
      stream: false,
    }),
    signal: AbortSignal.timeout(120000),
  });

  const text = await upstream.text();
  if (!upstream.ok) {
    return {
      ok: false,
      status: upstream.status,
      error: text.slice(0, 300),
      hint: upstream.status === 401
        ? 'Token mismatch — update OPENCLAW_GATEWAY_TOKEN in lib/secrets.js with droplet token.'
        : upstream.status === 404
          ? 'Enable chat: openclaw config set gateway.http.endpoints.chatCompletions.enabled true && openclaw gateway restart'
          : undefined,
    };
  }

  let data;
  try {
    data = JSON.parse(text);
  } catch {
    return { ok: false, status: 502, error: text.slice(0, 200) };
  }

  const reply = data.choices?.[0]?.message?.content
    || data.reply
    || data.message
    || data.content;

  return { ok: true, status: 200, reply: reply || 'No response from OpenClaw.' };
}
