#!/bin/bash
# Life OS JSON sync — same vault folder OpenClaw uses (DigitalOcean / any VPS).
set -euo pipefail

REPO_DIR="${1:-/root/life-os}"
VAULT_DIR="${2:-}"
PORT=18790

if [[ -z "$VAULT_DIR" ]]; then
  VAULT_DIR="${HOME}/.openclaw/workspace/obsidian/Moe's Life-OS"
fi

TOKEN="${3:-}"
if [[ -z "$TOKEN" ]] && [[ -f "${HOME}/.openclaw/openclaw.json" ]]; then
  TOKEN=$(node -e "
    const fs = require('fs');
    const p = process.env.HOME + '/.openclaw/openclaw.json';
    const j = JSON.parse(fs.readFileSync(p, 'utf8'));
    const t = j.gateway?.auth?.token || j.auth?.token || '';
    process.stdout.write(t);
  " 2>/dev/null || true)
fi

echo "Life OS data sync → OpenClaw vault"
echo "  Repo:  ${REPO_DIR}"
echo "  Vault: ${VAULT_DIR}"
echo "  JSON:  ${VAULT_DIR}/Life OS/data/"
echo "  Port:  ${PORT}"

mkdir -p "${VAULT_DIR}/Life OS/data"

cat > /etc/systemd/system/life-os-data.service <<UNIT
[Unit]
Description=Life OS JSON data sync (OpenClaw vault)
After=network.target

[Service]
Type=simple
WorkingDirectory=${REPO_DIR}
Environment=LIFE_OS_VAULT_DIR=${VAULT_DIR}
Environment=LIFE_OS_DATA_PORT=${PORT}
Environment=LIFE_OS_DATA_TOKEN=${TOKEN}
ExecStart=/usr/bin/node ${REPO_DIR}/server/data-sync.mjs
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
UNIT

systemctl daemon-reload
systemctl enable life-os-data
systemctl restart life-os-data

if command -v ufw >/dev/null 2>&1; then
  ufw allow "${PORT}/tcp" 2>/dev/null || true
fi

echo "Done. Test: curl -s http://127.0.0.1:${PORT}/health"
systemctl status life-os-data --no-pager | head -8 || true
