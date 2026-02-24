#!/bin/bash
set -e

# ============================================================
# Tap-Taza Dev Launcher
# Starts backend, ngrok tunnels, updates config, launches Expo
# Everything goes through ngrok — no WiFi/LAN issues
# ============================================================

PROJECT_ROOT="$(cd "$(dirname "$0")" && pwd)"
FRONTEND_DIR="$PROJECT_ROOT/frontend"
BACKEND_DIR="$PROJECT_ROOT/backend"
CONFIG_FILE="$FRONTEND_DIR/src/config/index.ts"
QR_FILE="$PROJECT_ROOT/tap-taza-qr.png"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

log()  { echo -e "${CYAN}[tap-taza]${NC} $1"; }
ok()   { echo -e "${GREEN}[✓]${NC} $1"; }
warn() { echo -e "${YELLOW}[!]${NC} $1"; }
fail() { echo -e "${RED}[✗]${NC} $1"; exit 1; }

# ----------------------------------------------------------
# 1. Check prerequisites
# ----------------------------------------------------------
log "Checking prerequisites..."
command -v docker >/dev/null 2>&1 || fail "Docker not found"
command -v ngrok >/dev/null 2>&1  || fail "ngrok not found"
command -v npx >/dev/null 2>&1    || fail "npx not found"

# ----------------------------------------------------------
# 2. Start Docker Desktop if needed
# ----------------------------------------------------------
if ! docker info >/dev/null 2>&1; then
    log "Starting Docker Desktop..."
    open -a Docker
    for i in $(seq 1 30); do
        docker info >/dev/null 2>&1 && break
        sleep 3
    done
    docker info >/dev/null 2>&1 || fail "Docker failed to start"
fi
ok "Docker is running"

# ----------------------------------------------------------
# 3. Start backend via Docker Compose
# ----------------------------------------------------------
log "Starting backend services..."
cd "$PROJECT_ROOT"
docker rm -f taptaza-app taptaza-db 2>/dev/null || true
docker-compose up -d 2>&1

# Wait for backend to respond (check public API, not actuator)
log "Waiting for Spring Boot..."
for i in $(seq 1 30); do
    if curl -sf http://localhost:8080/api/companies >/dev/null 2>&1; then
        break
    fi
    sleep 3
done
curl -sf http://localhost:8080/api/companies >/dev/null 2>&1 || fail "Backend didn't start"
ok "Backend is running on :8080"

# ----------------------------------------------------------
# 4. Kill any existing ngrok and start fresh with both tunnels
# ----------------------------------------------------------
log "Starting ngrok tunnels..."
pkill -f "ngrok start" 2>/dev/null || true
pkill -f "ngrok http" 2>/dev/null || true
sleep 2

ngrok start --all --log=stdout > /tmp/ngrok-taptaza.log 2>&1 &
NGROK_PID=$!

# Wait for ngrok API to be ready
for i in $(seq 1 15); do
    curl -sf http://localhost:4040/api/tunnels >/dev/null 2>&1 && break
    sleep 2
done
curl -sf http://localhost:4040/api/tunnels >/dev/null 2>&1 || fail "ngrok failed to start"

# Extract tunnel URLs
BACKEND_URL=$(curl -s http://localhost:4040/api/tunnels | python3 -c "
import sys, json
data = json.load(sys.stdin)
for t in data.get('tunnels', []):
    if t.get('name','').startswith('backend') and t['public_url'].startswith('https'):
        print(t['public_url'])
        break
" 2>/dev/null)

EXPO_URL=$(curl -s http://localhost:4040/api/tunnels | python3 -c "
import sys, json
data = json.load(sys.stdin)
for t in data.get('tunnels', []):
    if t.get('name','').startswith('expo') and t['public_url'].startswith('https'):
        print(t['public_url'])
        break
" 2>/dev/null)

[ -z "$BACKEND_URL" ] && fail "Could not get backend ngrok URL"
[ -z "$EXPO_URL" ]    && fail "Could not get expo ngrok URL"

ok "Backend tunnel: $BACKEND_URL"
ok "Expo tunnel:    $EXPO_URL"

# ----------------------------------------------------------
# 5. Auto-update frontend config with new backend ngrok URL
# ----------------------------------------------------------
log "Updating frontend API config..."

# Replace any existing ngrok-free.app URL with the new one
sed -i '' "s|https://[a-z0-9-]*\.ngrok-free\.app/api|${BACKEND_URL}/api|g" "$CONFIG_FILE"

ok "Config updated: $BACKEND_URL/api"

# ----------------------------------------------------------
# 6. Kill any existing Expo and start with proxy URL
# ----------------------------------------------------------
log "Starting Expo dev server..."
pkill -f "expo start" 2>/dev/null || true
sleep 2

cd "$FRONTEND_DIR"
EXPO_PACKAGER_PROXY_URL="$EXPO_URL" npx expo start --port 8082 > /tmp/expo-taptaza.log 2>&1 &
EXPO_PID=$!

# Wait for Metro to be ready
for i in $(seq 1 15); do
    if curl -sf http://localhost:8082/status 2>/dev/null | grep -q "running"; then
        break
    fi
    sleep 3
done
curl -sf http://localhost:8082/status >/dev/null 2>&1 || fail "Expo failed to start"
ok "Expo is running (proxied through ngrok)"

# ----------------------------------------------------------
# 7. Generate QR code and open it
# ----------------------------------------------------------
log "Generating QR code..."
npx --yes qrcode -o "$QR_FILE" -w 500 "exp://${EXPO_URL#https://}" 2>/dev/null
open "$QR_FILE"
ok "QR code saved to $QR_FILE"

# ----------------------------------------------------------
# Done!
# ----------------------------------------------------------
echo ""
echo -e "${GREEN}════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}  Tap-Taza is running!${NC}"
echo -e "${GREEN}════════════════════════════════════════════════════${NC}"
echo -e "  Backend:  ${CYAN}${BACKEND_URL}${NC}"
echo -e "  Expo:     ${CYAN}${EXPO_URL}${NC}"
echo -e "  QR Code:  ${CYAN}${QR_FILE}${NC}"
echo ""
echo -e "  Scan the QR code with ${YELLOW}Expo Go${NC} on your phone"
echo -e "  Press ${YELLOW}Ctrl+C${NC} to stop everything"
echo -e "${GREEN}════════════════════════════════════════════════════${NC}"
echo ""

# ----------------------------------------------------------
# Trap Ctrl+C to clean up
# ----------------------------------------------------------
cleanup() {
    echo ""
    log "Shutting down..."
    pkill -f "ngrok start" 2>/dev/null || true
    pkill -f "expo start" 2>/dev/null || true
    cd "$PROJECT_ROOT" && docker-compose down 2>/dev/null || true
    ok "All services stopped"
    exit 0
}

trap cleanup INT TERM

# Keep script alive, tailing Expo logs
tail -f /tmp/expo-taptaza.log 2>/dev/null
