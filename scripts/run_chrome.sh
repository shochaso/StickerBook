#!/bin/zsh
# 初回のみChrome起動、Vite dev serverが既に起動している前提
# 2回目以降はHMRに任せるため何もしない（冪等性保証）

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")"/.. && pwd)"
SITE_DIR="$REPO_ROOT/apps/site"
PORT=3001
URL="http://localhost:$PORT/"

# Vite dev serverの起動確認（起動していなければエラー）
if ! lsof -ti:$PORT >/dev/null 2>&1; then
  echo "❌ Error: Vite dev server not running on port $PORT"
  echo ""
  echo "Please start the dev server first:"
  echo "  ./scripts/dev-fast.sh"
  echo "or"
  echo "  pnpm dev:fast"
  echo ""
  exit 1
fi

echo "✅ Vite dev server detected at $URL"

# Open Chrome and navigate to URL (macOS only, for Cursor environment)
# Chromeが既にタブを開いている場合は何もしない（HMRに任せる）
if [ "$(uname)" = "Darwin" ]; then
  # Chrome起動済みで該当タブが既に存在するかチェック
  EXISTING_TAB=$(/usr/bin/osascript -e 'tell application "Google Chrome"
    if it is running then
      repeat with w in windows
        repeat with t in tabs of w
          if URL of t starts with "http://localhost:3001/" then return "found"
        end repeat
      end repeat
    end if
    return "not_found"
  end tell' 2>/dev/null || echo "not_found")

  if [ "$EXISTING_TAB" = "found" ]; then
    echo "🌐 Chrome tab already open, HMR will auto-reload on save"
    echo "[Run OK]"
    exit 0
  fi

  echo "🌐 Opening Chrome..."
  /usr/bin/osascript <<'APPLESCRIPT'
tell application "Google Chrome"
  activate
  set targetURL to "http://localhost:3001/"
  
  if (count of windows) > 0 then
    tell window 1 to set URL of (make new tab) to targetURL
  else
    make new window
    tell window 1 to set URL of active tab to targetURL
  end if
end tell
APPLESCRIPT
else
  echo "⚠️  Non-macOS detected, please open manually: $URL"
fi

echo ""
echo "💡 Next: Just save files, HMR will auto-reload (0.2-1.5s)"
echo "   No need to run this script again!"
echo "[Run OK]"
