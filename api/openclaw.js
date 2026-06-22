/** Vercel proxy → OpenClaw gateway (HTTPS site → HTTP droplet) */

import { getOpenClawConfig, openclawHealth, openclawChat } from '../lib/openclaw-proxy.js';

export default async function handler(req, res) {
  const { url, token } = getOpenClawConfig();

  if (req.method === 'GET') {
    try {
      const health = await openclawHealth(url);
      if (!health.ok) {
        return res.status(health.status === 200 ? 502 : health.status).json({
          ok: false,
          error: health.error || 'OpenClaw health check failed',
          data: health.data,
        });
      }
      return res.status(200).json(health.data);
    } catch (e) {
      return res.status(502).json({ ok: false, error: e.message });
    }
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const result = await openclawChat({ url, token, ...req.body });
    if (!result.ok) {
      return res.status(result.status).json({
        error: result.error,
        hint: result.hint,
      });
    }
    return res.status(200).json({ reply: result.reply, source: 'openclaw' });
  } catch (e) {
    return res.status(502).json({ error: e.message || 'OpenClaw request failed' });
  }
}
