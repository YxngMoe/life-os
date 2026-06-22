#!/bin/bash
# Run on your DigitalOcean droplet (as root) to enable Life OS ↔ Obsidian JSON sync.
set -euo pipefail

REPO_DIR="${1:-/root/life-os}"
VAULT_DIR="${2:-/root/obsidian-vault}"
PORT=18790
TOKEN="${3:-$(grep -o '"token"[[:space:]]*:[[:space:]]*"[^"]*"' /root/.openclaw/openclaw.json 2>/dev/null | sed 's/.*"\([^"]*\)"$/\1/' || true)}"

echo "Life OS data sync setup"
echo "  Repo:  $REPO_DIR"
echo "  Vault: $VAULT_DIR"
echo "  Port:  $PORT"

mkdir -p "$VAULT_DIR/Life OS/data"

cat > /etc/systemd/system/life-os-data.service <<EOF
[Unit]
Description=Life OS JSON data sync (Obsidian folder)
After=network.target

[Service]
Type=simple
WorkingDirectory=$REPO_DIR
Environment=LIFE_OS_VAULT_DIR=$VAULT_DIR
Environment=LIFE_OS_DATA_PORT=$PORT
Environment=LIFE_OS_DATA_TOKEN=$TOKEN
ExecStart=/usr/bin/node $REPO_DIR/server/data-sync.mjs
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable life-os-data
systemctl restart life-os-data
ufw allow "$PORT/tcp" 2>/dev/null || true

echo "Done. Data folder: $VAULT_DIR/Life OS/data/"
systemctl status life-os-data --no-pager | head -8
