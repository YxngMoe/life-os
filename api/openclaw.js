/** Vercel proxy → OpenClaw gateway (HTTPS site → HTTP droplet) */

const OPENCLAW_URL = process.env.OPENCLAW_URL || process.env.VITE_OPENCLAW_URL || 'http://67.205.162.212:18789';
const TOKEN = process.env.OPENCLAW_GATEWAY_TOKEN || process.env.OPENCLAW_TOKEN || '';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const r = await fetch(`${OPENCLAW_URL}/health`, { signal: AbortSignal.timeout(8000) });
      const body = await r.text();
      return res.status(r.status).type('application/json').send(body);
    } catch (e) {
      return res.status(502).json({ ok: false, error: e.message });
    }
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!TOKEN) {
    return res.status(503).json({
      error: 'Missing OPENCLAW_GATEWAY_TOKEN',
      hint: 'Run on droplet: openclaw config get gateway.auth.token — add to Vercel env, redeploy.',
    });
  }

  const { message, agent, context, messages: clientMessages } = req.body || {};
  const systemPrompt = context || '';
  const messages = clientMessages?.length
    ? clientMessages
    : [{ role: 'user', content: message }];

  const withSystem = systemPrompt
    ? [{ role: 'system', content: systemPrompt }, ...messages.filter((m) => m.role !== 'system')]
    : messages;

  try {
    const upstream = await fetch(`${OPENCLAW_URL}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${TOKEN}`,
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
      return res.status(upstream.status).json({
        error: text.slice(0, 300),
        hint: upstream.status === 404
          ? 'Enable chat on droplet: openclaw config set gateway.http.endpoints.chatCompletions.enabled true && openclaw gateway restart'
          : undefined,
      });
    }

    let data;
    try { data = JSON.parse(text); } catch { return res.status(502).json({ error: text.slice(0, 200) }); }

    const reply = data.choices?.[0]?.message?.content
      || data.reply
      || data.message
      || data.content;

    return res.status(200).json({ reply: reply || 'No response from OpenClaw.' });
  } catch (e) {
    return res.status(502).json({ error: e.message || 'OpenClaw request failed' });
  }
}
