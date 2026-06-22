import { getOpenClawConfig, openclawHealth, openclawChat } from '../../lib/openclaw-proxy.js';

export default async (req) => {
  const { url, token } = getOpenClawConfig();

  if (req.method === 'GET') {
    try {
      const health = await openclawHealth(url);
      if (!health.ok) {
        return Response.json(
          { ok: false, error: health.error || 'OpenClaw health check failed', data: health.data },
          { status: health.status === 200 ? 502 : health.status },
        );
      }
      return Response.json(health.data);
    } catch (e) {
      return Response.json({ ok: false, error: e.message }, { status: 502 });
    }
  }

  if (req.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 });
  }

  try {
    const body = await req.json();
    const result = await openclawChat({ url, token, ...body });
    if (!result.ok) {
      return Response.json({ error: result.error, hint: result.hint }, { status: result.status });
    }
    return Response.json({ reply: result.reply, source: 'openclaw' });
  } catch (e) {
    return Response.json({ error: e.message || 'OpenClaw request failed' }, { status: 502 });
  }
};
