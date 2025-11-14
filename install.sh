#!/bin/bash

echo "🚀 YXOR Team 项目启动脚本"
echo "================================"

# 检查Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js 未安装，请先安装 Node.js"
    exit 1
fi

# 检查npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm 未安装，请先安装 npm"
    exit 1
fi

echo "✅ Node.js 版本: $(node --version)"
echo "✅ npm 版本: $(npm --version)"
echo ""

# 后端安装
echo "📦 安装后端依赖..."
cd backend
npm install
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✅ 已创建 .env 文件"
fi
cd ..

# 前端安装
echo "📦 安装前端依赖..."
cd frontend
npm install
cd ..

echo ""
echo "================================"
echo "✅ 安装完成！"
echo ""
echo "📝 快速开始："
echo ""
echo "1️⃣  启动后端服务："
echo "   cd backend && npm run dev"
echo ""
echo "2️⃣  在新终端启动前端："
echo "   cd frontend && npm run dev"
echo ""
echo "3️⃣  打开浏览器访问："
echo "   http://localhost:5173"
echo ""
echo "🎉 项目就能正常运行了！"
