#!/bin/bash
# Wire the Hetzner/OpenClaw vault to a private git remote so Obsidian Git can pull on your devices.
# Usage: bash scripts/setup-vault-git.sh "/root/.openclaw/workspace/obsidian/Moe's Life-OS" git@github.com:YOU/moe-vault.git
set -euo pipefail

VAULT_DIR="${1:-$HOME/.openclaw/workspace/obsidian/Moe's Life-OS}"
REMOTE="${2:-}"

if [[ -z "$REMOTE" ]]; then
  echo "Usage: $0 [vault-path] <git-remote-url>"
  echo "Example: $0 \"\$HOME/.openclaw/workspace/obsidian/Moe's Life-OS\" git@github.com:YxngMoe/moe-life-vault.git"
  exit 1
fi

cd "$VAULT_DIR"

if [[ ! -d .git ]]; then
  git init
  git branch -M main
fi

git config user.email "life-os@hetzner.local" 2>/dev/null || true
git config user.name "Life OS Server" 2>/dev/null || true

if git remote get-url origin &>/dev/null; then
  git remote set-url origin "$REMOTE"
else
  git remote add origin "$REMOTE"
fi

cat > .gitignore <<'EOF'
.DS_Store
.obsidian/workspace.json
.obsidian/workspace-mobile.json
.trash/
EOF

git add -A
git commit -m "Vault bootstrap from Hetzner" || true
git push -u origin main || echo "Push failed — add deploy key or PAT on server, then: git push -u origin main"

cat > SYNC_README.md <<'EOF'
# Vault sync (Hetzner ↔ your devices)

This vault on the server is **not** connected to iCloud automatically.

## On your Mac/iPhone (Obsidian Git plugin)
1. Clone the same private repo into iCloud Obsidian folder, OR
2. Point your existing vault at this remote and enable auto pull every N minutes.

## On the server (after OpenClaw or Life OS writes files)
```bash
cd "$HOME/.openclaw/workspace/obsidian/Moe's Life-OS"
git add -A && git commit -m "sync" && git push
```

## Cron (optional — auto-push every 5 min)
```
*/5 * * * * cd /root/.openclaw/workspace/obsidian/Moe\'s Life-OS && git add -A && git commit -m "auto sync" -q && git push -q
```
EOF

git add SYNC_README.md .gitignore
git commit -m "Add vault sync readme" 2>/dev/null || true

echo "Vault git remote: $REMOTE"
echo "Next: install Obsidian Git on Mac, clone/pull this repo into your iCloud vault path."
