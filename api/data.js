/** Vercel proxy → Life OS JSON data store (Obsidian vault folder on droplet) */

import { dataSyncHealth, dataSyncGetAll, dataSyncBulk } from '../lib/data-sync-proxy.js';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const health = await dataSyncHealth();
      if (!health.ok && req.query?.mode !== 'full') {
        return res.status(health.status || 502).json(health.data);
      }
      if (req.query?.mode === 'health') {
        return res.status(health.ok ? 200 : 502).json(health.data);
      }
      const all = await dataSyncGetAll();
      return res.status(all.ok ? 200 : all.status).json(all.data);
    } catch (e) {
      return res.status(502).json({ error: e.message });
    }
  }

  if (req.method === 'POST') {
    const { keys } = req.body || {};
    if (!keys || typeof keys !== 'object') {
      return res.status(400).json({ error: 'keys object required' });
    }
    try {
      const result = await dataSyncBulk(keys);
      return res.status(result.ok ? 200 : result.status).json(result.data);
    } catch (e) {
      return res.status(502).json({ error: e.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
