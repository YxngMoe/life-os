/** Diagnostic — hardcoded secrets status (never exposes values). */

import { SECRETS } from '../lib/secrets.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  return res.status(200).json({
    mode: 'hardcoded',
    openclawUrl: SECRETS.OPENCLAW_URL,
    hasOpenClawToken: Boolean(SECRETS.OPENCLAW_GATEWAY_TOKEN),
    hasAnthropicKey: Boolean(SECRETS.ANTHROPIC_API_KEY),
    tokenLength: SECRETS.OPENCLAW_GATEWAY_TOKEN?.length || 0,
  });
}
