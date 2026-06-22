#!/bin/bash
# Wire OpenClaw vault to a private git remote → Obsidian Git on your devices.
# Usage:
#   bash setup-vault-git.sh "/path/to/vault" git@github.com:YOU/repo.git
set -euo pipefail

VAULT_DIR="${1:-}"
REMOTE="${2:-}"

if [[ -z "$VAULT_DIR" ]]; then
  VAULT_DIR="${HOME}/.openclaw/workspace/obsidian/Moe's Life-OS"
fi

if [[ -z "$REMOTE" ]]; then
  echo "Usage: $0 [vault-path] <git-remote-url>"
  echo 'Example:'
  echo '  bash setup-vault-git.sh "$HOME/.openclaw/workspace/obsidian/Moe'"'"'s Life-OS" git@github.com:YxngMoe/moe-life-vault.git'
  exit 1
fi

cd "${VAULT_DIR}"

if [[ ! -d .git ]]; then
  git init
  git branch -M main
fi

git config user.email "life-os@server.local" 2>/dev/null || true
git config user.name "Life OS Server" 2>/dev/null || true

if git remote get-url origin &>/dev/null; then
  git remote set-url origin "${REMOTE}"
else
  git remote add origin "${REMOTE}"
fi

cat > .gitignore <<'IGNORE'
.DS_Store
.obsidian/workspace.json
.obsidian/workspace-mobile.json
.trash/
IGNORE

git add -A
git commit -m "Vault bootstrap from server" || true
git push -u origin main || echo "Push failed — add GitHub deploy key on server, then: git push -u origin main"

cat > SYNC_README.md <<'README'
# Vault sync (server ↔ your devices)

This vault on the server is **not** connected to iCloud automatically.

## Mac / iPhone (Obsidian Git)
1. Create a private GitHub repo and clone it into your iCloud Obsidian folder, OR
2. Enable Obsidian Git auto-pull on your existing vault pointing at the same remote.

## Server — after OpenClaw or Life OS writes files
    git add -A && git commit -m "sync" && git push

## Optional cron (auto-push every 5 min)
    */5 * * * * cd VAULT_PATH && git add -A && git commit -m "auto sync" -q && git push -q
README

git add SYNC_README.md .gitignore 2>/dev/null || true
git commit -m "Add vault sync readme" 2>/dev/null || true

echo "Vault git remote: ${REMOTE}"
echo "Next: Obsidian Git on Mac — clone or pull this repo into your iCloud vault."
