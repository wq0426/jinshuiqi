#!/usr/bin/env bash
#
# 净水器上门服务平台 —— 一键部署脚本
# 本地构建 admin(前端静态) + server(NestJS)，再 rsync 推送到远程，并用 PM2 重启后端。
#
# 用法:
#   ./deploy.sh            # 构建并部署 前端 + 后端
#   ./deploy.sh front      # 只部署前端(admin 静态)
#   ./deploy.sh back       # 只部署后端(server)
#   ./deploy.sh --seed     # 部署后端的同时执行一次数据库 seed(仅首次/需要重置数据时)
#
# 依赖: 本地需有 node/npm、rsync、ssh；远程需有 node、npm、pm2、nginx。
#
set -euo pipefail

# ============== 配置 ==============
SERVER_IP="101.201.57.214"
SERVER_USER="root"
SSH="${SERVER_USER}@${SERVER_IP}"
# SSH 选项：10s 连不上就报错(不再无限卡住)，并发保活、复用单条连接(缓解 MaxStartups)
SSH_OPTS="-o ConnectTimeout=10 -o ServerAliveInterval=15 -o ServerAliveCountMax=3"
SSH_CMD="ssh $SSH_OPTS"

# 前端静态文件的目标(nginx web 根目录)
FRONTEND_PATH="/var/www/html/jinshuiqi"
# 后端代码的目标(放在 web 根目录之外，避免源码被 nginx 直接暴露)
BACKEND_PATH="/var/www/jinshuiqi-server"

# PM2 进程名
PM2_APP="jinshuiqi-server"

# 脚本所在目录(项目根)
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# ==================================

GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; NC='\033[0m'
log()  { echo -e "${GREEN}[deploy]${NC} $*"; }
warn() { echo -e "${YELLOW}[deploy]${NC} $*"; }
die()  { echo -e "${RED}[deploy] $*${NC}" >&2; exit 1; }

# 参数解析
TARGET="all"
DO_SEED="no"
for arg in "$@"; do
  case "$arg" in
    front|back|all) TARGET="$arg" ;;
    --seed)         DO_SEED="yes" ;;
    *) die "未知参数: $arg" ;;
  esac
done

command -v rsync >/dev/null || die "本地缺少 rsync"
command -v ssh   >/dev/null || die "本地缺少 ssh"

# ---------- 部署前端 ----------
deploy_front() {
  log "构建前端 admin ..."
  cd "$ROOT/admin"
  npm install
  npm run build
  [ -d dist ] || die "admin/dist 不存在，构建失败"

  log "推送前端静态文件到 ${SSH}:${FRONTEND_PATH} ..."
  $SSH_CMD "$SSH" "mkdir -p '$FRONTEND_PATH'"
  # --delete: 远端与本地 dist 保持一致(清理旧资源 hash 文件)
  rsync -avz --delete -e "$SSH_CMD" "$ROOT/admin/dist/" "${SSH}:${FRONTEND_PATH}/"
  log "前端部署完成 → ${FRONTEND_PATH}"
}

# ---------- 部署后端 ----------
deploy_back() {
  log "构建后端 server ..."
  cd "$ROOT/server"
  npm install
  npm run build
  [ -d dist ] || die "server/dist 不存在，构建失败"

  log "推送后端到 ${SSH}:${BACKEND_PATH} ..."
  $SSH_CMD "$SSH" "mkdir -p '$BACKEND_PATH'"
  # 只推送运行所需文件；node_modules 在远端单独安装(避免跨平台二进制问题)
  rsync -avz --delete -e "$SSH_CMD" \
    --exclude 'node_modules' \
    "$ROOT/server/dist/" "${SSH}:${BACKEND_PATH}/dist/"
  rsync -avz -e "$SSH_CMD" "$ROOT/server/package.json" "${SSH}:${BACKEND_PATH}/package.json"
  [ -f "$ROOT/server/package-lock.json" ] && \
    rsync -avz -e "$SSH_CMD" "$ROOT/server/package-lock.json" "${SSH}:${BACKEND_PATH}/package-lock.json" || true

  # .env: 远端已存在则不覆盖(保护生产配置)，不存在则上传本地作为模板
  if $SSH_CMD "$SSH" "[ -f '$BACKEND_PATH/.env' ]"; then
    warn "远端已存在 .env，跳过覆盖(如需更新请手动改远端 $BACKEND_PATH/.env)"
  else
    warn "远端无 .env，上传本地 server/.env 作为初始配置 —— 请登录服务器修改生产数据库密码等!"
    rsync -avz -e "$SSH_CMD" "$ROOT/server/.env" "${SSH}:${BACKEND_PATH}/.env"
  fi

  log "远端安装生产依赖并(重)启动 PM2 ..."
  $SSH_CMD "$SSH" "bash -se" <<REMOTE
set -e
cd '$BACKEND_PATH'
if [ -f package-lock.json ]; then npm ci --omit=dev; else npm install --omit=dev; fi
command -v pm2 >/dev/null || npm install -g pm2
if [ "$DO_SEED" = "yes" ]; then
  echo "[remote] 执行数据库 seed (编译后的 dist/database/seed.js) ..."
  node dist/database/seed.js || echo "[remote] seed 失败，请手动检查"
fi
# dist/main.js 入口；reload 优雅重启，进程不存在则首次 start
if pm2 describe '$PM2_APP' >/dev/null 2>&1; then
  pm2 reload '$PM2_APP' --update-env
else
  pm2 start dist/main.js --name '$PM2_APP'
fi
pm2 save
pm2 status '$PM2_APP'
REMOTE
  log "后端部署完成 → ${BACKEND_PATH} (PM2: ${PM2_APP})"
}

case "$TARGET" in
  front) deploy_front ;;
  back)  deploy_back ;;
  all)   deploy_front; deploy_back ;;
esac

log "全部完成 ✅  访问: https://abc.hi.cn/"
