import { SECRETS } from '../../lib/secrets.js';

export default async () => Response.json({
  mode: 'hardcoded',
  host: 'netlify',
  openclawUrl: SECRETS.OPENCLAW_URL,
  hasOpenClawToken: Boolean(SECRETS.OPENCLAW_GATEWAY_TOKEN),
  hasAnthropicKey: Boolean(SECRETS.ANTHROPIC_API_KEY),
  tokenLength: SECRETS.OPENCLAW_GATEWAY_TOKEN?.length || 0,
});
