/** Bridge Netlify Functions (Web Request) ↔ Vercel-style handlers. */

export async function runNetlifyHandler(handler, request) {
  const body = request.method !== 'GET' && request.method !== 'HEAD'
    ? await request.json().catch(() => ({}))
    : {};

  const req = { method: request.method, body };
  let statusCode = 200;
  let headers = { 'Content-Type': 'application/json' };
  let payload = '';

  const res = {
    status(code) {
      statusCode = code;
      return this;
    },
    type(ct) {
      headers['Content-Type'] = ct;
      return this;
    },
    send(data) {
      payload = typeof data === 'string' ? data : JSON.stringify(data);
      return this;
    },
    json(data) {
      payload = JSON.stringify(data);
      return this;
    },
  };

  await handler(req, res);

  return new Response(payload, { status: statusCode, headers });
}
