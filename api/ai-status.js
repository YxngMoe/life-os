/** Diagnostic — which server-side secrets are loaded (never exposes values). */

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const token = process.env.OPENCLAW_GATEWAY_TOKEN || process.env.OPENCLAW_TOKEN || process.env.VITE_OPENCLAW_TOKEN || '';
  const anthropic = process.env.ANTHROPIC_API_KEY || process.env.VITE_ANTHROPIC_KEY || '';
  const openclawUrl = process.env.OPENCLAW_URL || process.env.VITE_OPENCLAW_URL || 'http://67.205.162.212:18789';

  return res.status(200).json({
    host: 'vercel',
    openclawUrl,
    hasOpenClawToken: Boolean(token),
    hasAnthropicKey: Boolean(anthropic),
    tokenLength: token ? token.length : 0,
    hint: !token
      ? 'OPENCLAW_GATEWAY_TOKEN is empty on THIS host — add it here and redeploy (Vercel env vars do not sync to Netlify).'
      : undefined,
  });
}
