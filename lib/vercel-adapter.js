/** Adapt Node http req/res for Vercel-style serverless handlers (local Vite dev). */

export function runVercelHandler(handler, nodeReq, nodeRes) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    nodeReq.on('data', (c) => chunks.push(c));
    nodeReq.on('end', async () => {
      const raw = Buffer.concat(chunks).toString('utf8');
      let body = {};
      if (raw) {
        try {
          body = JSON.parse(raw);
        } catch {
          body = {};
        }
      }

      const req = { method: nodeReq.method, body };

      const res = {
        statusCode: 200,
        status(code) {
          this.statusCode = code;
          return this;
        },
        type() {
          return this;
        },
        send(data) {
          nodeRes.statusCode = this.statusCode;
          if (typeof data === 'string') nodeRes.end(data);
          else nodeRes.end(JSON.stringify(data));
          resolve();
        },
        json(data) {
          nodeRes.statusCode = this.statusCode;
          nodeRes.setHeader('Content-Type', 'application/json');
          nodeRes.end(JSON.stringify(data));
          resolve();
        },
      };

      try {
        await handler(req, res);
      } catch (e) {
        reject(e);
      }
    });
    nodeReq.on('error', reject);
  });
}
