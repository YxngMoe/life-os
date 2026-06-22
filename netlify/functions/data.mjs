import { SECRETS } from '../../lib/secrets.js';

const SYNC_URL = SECRETS.DATA_SYNC_URL || 'http://67.205.162.212:18790';
const TOKEN = SECRETS.DATA_SYNC_TOKEN || SECRETS.OPENCLAW_GATEWAY_TOKEN || '';

async function upstream(path, options = {}) {
  const res = await fetch(`${SYNC_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
      ...options.headers,
    },
  });
  const text = await res.text();
  let data;
  try { data = JSON.parse(text); } catch { data = { raw: text }; }
  return new Response(JSON.stringify(data), { status: res.status, headers: { 'Content-Type': 'application/json' } });
}

export default async (req) => {
  if (req.method === 'GET') {
    const url = new URL(req.url);
    if (url.searchParams.get('mode') === 'health') return upstream('/health');
    return upstream('/data');
  }
  if (req.method === 'POST') {
    const { keys } = await req.json();
    return upstream('/bulk', { method: 'POST', body: JSON.stringify({ keys }) });
  }
  return Response.json({ error: 'Method not allowed' }, { status: 405 });
};
