#!/bin/bash

# ============================================================
# Tap-Taza Dev Stopper
# Cleanly shuts down all services
# ============================================================

PROJECT_ROOT="$(cd "$(dirname "$0")" && pwd)"

RED='\033[0;31m'
GREEN='\033[0;32m'
CYAN='\033[0;36m'
NC='\033[0m'

log()  { echo -e "${CYAN}[tap-taza]${NC} $1"; }
ok()   { echo -e "${GREEN}[✓]${NC} $1"; }

log "Stopping Expo..."
pkill -f "expo start" 2>/dev/null && ok "Expo stopped" || echo "  (not running)"

log "Stopping ngrok..."
pkill -f "ngrok start" 2>/dev/null && ok "ngrok stopped" || echo "  (not running)"
pkill -f "ngrok http" 2>/dev/null || true

log "Stopping Docker containers..."
cd "$PROJECT_ROOT" && docker-compose down 2>/dev/null && ok "Containers stopped" || echo "  (not running)"

echo ""
ok "All Tap-Taza services stopped"
