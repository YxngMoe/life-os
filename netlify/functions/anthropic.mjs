import { SECRETS } from '../../lib/secrets.js';

const ANTHROPIC_MODEL = 'claude-sonnet-4-6';

export default async (req) => {
  if (req.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 });
  }

  const key = SECRETS.ANTHROPIC_API_KEY;
  if (!key) {
    return Response.json({ error: 'Missing ANTHROPIC_API_KEY in lib/secrets.js' }, { status: 503 });
  }

  const { systemPrompt, messages } = await req.json();
  if (!messages?.length) {
    return Response.json({ error: 'messages required' }, { status: 400 });
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
      return Response.json({ error: err.slice(0, 200) }, { status: upstream.status });
    }

    const data = await upstream.json();
    return Response.json({ reply: data.content?.[0]?.text || 'No response.', source: 'anthropic' });
  } catch (e) {
    return Response.json({ error: e.message || 'Anthropic request failed' }, { status: 500 });
  }
};
