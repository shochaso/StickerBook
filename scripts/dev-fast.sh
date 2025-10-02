#!/bin/zsh
# 最速起動: Viteのみ、Chrome起動なし、HMR最適化
# Usage: ./scripts/dev-fast.sh

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")"/.. && pwd)"
SITE_DIR="$REPO_ROOT/apps/site"
PORT=3001

echo "🚀 Starting Vite dev server (Fast Mode with Polling)..."
echo "📍 URL: http://localhost:$PORT/"
echo "⚡ HMR enabled, Network FS polling active"
echo ""

cd "$SITE_DIR"

# ポーリング有効化でネットワークFS対応
VITE_USE_POLLING=true exec pnpm dev --host --port $PORT

# Notes:
# - Chrome起動なし（手動で http://localhost:3000/ を開く）
# - VITE_USE_POLLING=true でGoogle Drive等のネットワークドライブ対応
# - --host で 0.0.0.0 にバインド（LAN内アクセス可能）
# - HMR反映速度: 通常 0.2-0.8秒、ネットワークFS時 0.5-1.5秒
# 
# 初回のみChromeを開く場合:
#   ./scripts/run_chrome.sh
# 
# 以降は保存するだけでHMRが自動反映

