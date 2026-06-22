#!/usr/bin/env node
/**
 * Life OS data sync server — stores JSON in an Obsidian-friendly folder.
 * Run on droplet: node server/data-sync.mjs
 * Default: /root/obsidian-vault/Life OS/data/
 */

import http from 'http';
import fs from 'fs/promises';
import path from 'path';

const PORT = Number(process.env.LIFE_OS_DATA_PORT || 18790);
const TOKEN = process.env.LIFE_OS_DATA_TOKEN || process.env.OPENCLAW_GATEWAY_TOKEN || '';
const VAULT_ROOT = process.env.LIFE_OS_VAULT_DIR
  || path.join(process.env.HOME || '/root', '.openclaw', 'workspace', 'obsidian', "Moe's Life-OS");
const DATA_DIR = path.join(VAULT_ROOT, 'Life OS', 'data');
const MANIFEST = path.join(VAULT_ROOT, 'Life OS', 'manifest.json');
const INDEX_MD = path.join(VAULT_ROOT, 'Life OS', 'index.md');

async function ensureDirs() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

function auth(req) {
  if (!TOKEN) return true;
  const h = req.headers.authorization || '';
  return h === `Bearer ${TOKEN}`;
}

function safeKey(key) {
  return /^[a-zA-Z0-9_-]+$/.test(key) ? key : null;
}

async function readManifest() {
  try {
    const raw = await fs.readFile(MANIFEST, 'utf8');
    return JSON.parse(raw);
  } catch {
    return { updatedAt: null, keys: {} };
  }
}

async function writeManifest(keys) {
  const manifest = { updatedAt: new Date().toISOString(), keys };
  await fs.writeFile(MANIFEST, JSON.stringify(manifest, null, 2));
  const lines = [
    '# Life OS Data (server copy)',
    '',
    `Last sync: ${manifest.updatedAt}`,
    '',
    '**Important:** This folder lives on your DigitalOcean server — not iCloud.',
    'Use **Obsidian Git** (or pull this repo) to see files on your phone/Mac.',
    '',
    'JSON below powers the Life OS web app. Markdown notes live in sibling folders (ABW, Journal, etc.).',
    '',
    '## Files',
    ...Object.keys(keys).sort().map((k) => `- [[data/${k}.json]]`),
    '',
  ];
  await fs.writeFile(INDEX_MD, lines.join('\n'));
  return manifest;
}

async function readKey(key) {
  const file = path.join(DATA_DIR, `${key}.json`);
  const raw = await fs.readFile(file, 'utf8');
  return JSON.parse(raw);
}

async function writeKey(key, value) {
  const updatedAt = new Date().toISOString();
  const entry = { updatedAt, value };
  await fs.writeFile(path.join(DATA_DIR, `${key}.json`), JSON.stringify(entry, null, 2));
  const manifest = await readManifest();
  manifest.keys[key] = updatedAt;
  await writeManifest(manifest.keys);
  return entry;
}

async function readAll() {
  const manifest = await readManifest();
  const keys = {};
  for (const key of Object.keys(manifest.keys)) {
    try {
      keys[key] = await readKey(key);
    } catch { /* skip missing */ }
  }
  return { manifest, keys };
}

function send(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(typeof body === 'string' ? body : JSON.stringify(body));
}

async function parseBody(req) {
  const chunks = [];
  for await (const c of req) chunks.push(c);
  const raw = Buffer.concat(chunks).toString('utf8');
  if (!raw) return {};
  return JSON.parse(raw);
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,PUT,POST,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    });
    return res.end();
  }

  const url = new URL(req.url, `http://127.0.0.1:${PORT}`);

  // Public health check (no token needed for curl / monitoring)
  if (req.method === 'GET' && (url.pathname === '/' || url.pathname === '/health')) {
    return send(res, 200, { ok: true, dataDir: DATA_DIR, authRequired: Boolean(TOKEN) });
  }

  if (!auth(req)) return send(res, 401, { error: 'Unauthorized' });

  try {
    await ensureDirs();
    const parts = url.pathname.split('/').filter(Boolean);
      return send(res, 200, await readManifest());
    }

    if (req.method === 'GET' && url.pathname === '/data') {
      return send(res, 200, await readAll());
    }

    if (req.method === 'GET' && parts[0] === 'data' && parts.length === 2) {
      const key = safeKey(parts[1]);
      if (!key) return send(res, 400, { error: 'Invalid key' });
      return send(res, 200, await readKey(key));
    }

    if (req.method === 'PUT' && parts[0] === 'data' && parts.length === 2) {
      const key = safeKey(parts[1]);
      if (!key) return send(res, 400, { error: 'Invalid key' });
      const body = await parseBody(req);
      return send(res, 200, await writeKey(key, body.value));
    }

    if (req.method === 'POST' && url.pathname === '/bulk') {
      const body = await parseBody(req);
      const written = {};
      for (const [key, value] of Object.entries(body.keys || {})) {
        const k = safeKey(key);
        if (!k) continue;
        written[k] = await writeKey(k, value);
      }
      return send(res, 200, { ok: true, written: Object.keys(written) });
    }

    return send(res, 404, { error: 'Not found' });
  } catch (e) {
    return send(res, 500, { error: e.message });
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Life OS data sync on :${PORT} → ${DATA_DIR}`);
});
