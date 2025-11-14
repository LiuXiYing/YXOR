#!/bin/bash
# YXOR Team 项目启动脚本 - macOS/Linux

set -e  # 如果任何命令失败，脚本退出

echo "🚀 ====================================="
echo "   YXOR Team CTF战队展示网站"
echo "   项目启动脚本"
echo "====================================="
echo ""

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检查系统
check_command() {
  if ! command -v $1 &> /dev/null; then
    echo -e "${RED}❌ $1 未安装${NC}"
    return 1
  fi
  return 0
}

# 检查前提条件
echo -e "${YELLOW}📋 检查环境...${NC}"
if ! check_command node; then
  echo "请访问 https://nodejs.org 安装 Node.js"
  exit 1
fi
echo -e "${GREEN}✅ Node.js $(node --version)${NC}"

if ! check_command npm; then
  echo "请确保已安装 npm"
  exit 1
fi
echo -e "${GREEN}✅ npm $(npm --version)${NC}"

echo ""
echo -e "${YELLOW}📦 安装依赖...${NC}"

# 安装后端依赖
echo "  🔧 后端依赖..."
cd backend
if [ ! -d "node_modules" ]; then
  npm install > /dev/null 2>&1
else
  echo "  ✓ 后端依赖已存在"
fi
if [ ! -f .env ]; then
  cp .env.example .env 2>/dev/null || true
  echo "  ✓ 已创建 .env 配置文件"
fi
cd ..

# 安装前端依赖
echo "  🎨 前端依赖..."
cd frontend
if [ ! -d "node_modules" ]; then
  npm install > /dev/null 2>&1
else
  echo "  ✓ 前端依赖已存在"
fi
cd ..

echo ""
echo -e "${GREEN}✅ 依赖安装完成！${NC}"
echo ""
echo -e "${YELLOW}🚀 启动应用...${NC}"
echo ""
echo "后端地址: http://localhost:3001"
echo "前端地址: http://localhost:5173"
echo ""
echo -e "${YELLOW}📝 说明${NC}"
echo "  • 按 Ctrl+C 停止服务"
echo "  • 后端使用 watch 模式自动重启"
echo "  • 前端有热更新功能"
echo ""

# 同时启动前后端
if command -v concurrently &> /dev/null; then
  npm run dev
else
  echo "📌 提示：已安装 concurrently，可同时运行前后端"
  echo "     手动启动方式："
  echo ""
  echo "   终端1 - 后端服务:"
  echo "   cd backend && npm run dev"
  echo ""
  echo "   终端2 - 前端应用:"
  echo "   cd frontend && npm run dev"
  echo ""
  
  # 启动后端
  echo "🔧 启动后端服务..."
  cd backend
  npm run dev &
  BACKEND_PID=$!
  cd ..
  
  # 等待后端启动
  sleep 3
  
  # 启动前端
  echo "🎨 启动前端应用..."
  cd frontend
  npm run dev &
  FRONTEND_PID=$!
  cd ..
  
  # 等待用户中断
  echo ""
  echo "✅ 应用已启动！按 Ctrl+C 停止"
  trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT TERM
  wait
fi
