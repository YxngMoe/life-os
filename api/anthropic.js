/** Vercel serverless — Anthropic proxy */

import { SECRETS } from '../lib/secrets.js';

const ANTHROPIC_MODEL = 'claude-sonnet-4-6';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const key = SECRETS.ANTHROPIC_API_KEY;
  if (!key) {
    return res.status(503).json({ error: 'Missing ANTHROPIC_API_KEY in lib/secrets.js' });
  }

  const { systemPrompt, messages } = req.body || {};
  if (!messages?.length) {
    return res.status(400).json({ error: 'messages required' });
  }

  try {
    const upstream = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': key,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: ANTHROPIC_MODEL,
        max_tokens: 1000,
        system: systemPrompt || '',
        messages: messages.map((m) => ({ role: m.role, content: m.content })),
      }),
    });

    if (!upstream.ok) {
      const err = await upstream.text();
      return res.status(upstream.status).json({ error: err.slice(0, 200) });
    }

    const data = await upstream.json();
    return res.status(200).json({ reply: data.content?.[0]?.text || 'No response.' });
  } catch (e) {
    return res.status(500).json({ error: e.message || 'Anthropic request failed' });
  }
}
