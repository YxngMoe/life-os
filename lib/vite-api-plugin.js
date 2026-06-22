import { runVercelHandler } from './vercel-adapter.js';

const ROUTES = {
  '/api/openclaw': () => import('../api/openclaw.js'),
  '/api/anthropic': () => import('../api/anthropic.js'),
  '/api/data': () => import('../api/data.js'),
};

export function apiRoutesPlugin() {
  return {
    name: 'life-os-api-routes',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const path = req.url?.split('?')[0];
        const load = ROUTES[path];
        if (!load) return next();

        try {
          const mod = await load();
          await runVercelHandler(mod.default, req, res);
        } catch (e) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: e.message || 'API error' }));
        }
      });
    },
  };
}
