export default async () => {
  const token = process.env.OPENCLAW_GATEWAY_TOKEN || process.env.OPENCLAW_TOKEN || process.env.VITE_OPENCLAW_TOKEN || '';
  const anthropic = process.env.ANTHROPIC_API_KEY || process.env.VITE_ANTHROPIC_KEY || '';
  const openclawUrl = process.env.OPENCLAW_URL || process.env.VITE_OPENCLAW_URL || 'http://67.205.162.212:18789';

  return Response.json({
    host: 'netlify',
    openclawUrl,
    hasOpenClawToken: Boolean(token),
    hasAnthropicKey: Boolean(anthropic),
    tokenLength: token ? token.length : 0,
    hint: !token
      ? 'OPENCLAW_GATEWAY_TOKEN is empty on Netlify — copy the same vars from Vercel into Netlify → Site configuration → Environment variables, then redeploy.'
      : undefined,
  });
};
