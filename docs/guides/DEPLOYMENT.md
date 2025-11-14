# 部署指南

## 本地开发部署

### 快速启动
```bash
# 一键启动脚本
chmod +x start.sh
./start.sh
```

访问 http://localhost:5173

## 生产环境部署

### 选项 1: 使用 PM2（推荐）

#### 前端构建
```bash
cd frontend
npm run build
# 将 dist/ 目录部署到 Web 服务器（Nginx、Apache等）
```

#### 后端部署
```bash
# 全局安装 PM2
npm install -g pm2

# 在项目根目录
cd backend
npm install --production

# 启动应用
pm2 start ecosystem.config.js --name yxor-api

# 设置开机自启
pm2 startup
pm2 save

# 查看应用状态
pm2 status
pm2 logs yxor-api
```

### 选项 2: 使用 Docker

#### 构建镜像
```bash
docker build -t yxor-team:latest .
```

#### 运行容器
```bash
docker run -d \
  --name yxor-api \
  -p 3001:3001 \
  -e NODE_ENV=production \
  -e PORT=3001 \
  -e CORS_ORIGIN=https://yourdomain.com \
  yxor-team:latest
```

#### 使用 Docker Compose
```bash
docker-compose up -d
```

### 选项 3: 使用 Vercel/Netlify

#### 前端部署到 Vercel
```bash
# 安装 Vercel CLI
npm install -g vercel

# 部署
cd frontend
vercel
```

#### 后端部署到 Vercel Functions
在 `backend/vercel.json` 中配置：
```json
{
  "version": 2,
  "builds": [
    { "src": "server.js", "use": "@vercel/node" }
  ],
  "routes": [
    { "src": "/(.*)", "dest": "server.js" }
  ]
}
```

### 选项 4: 手动部署到 VPS

#### 1. 连接到服务器
```bash
ssh user@your-server-ip
```

#### 2. 克隆项目
```bash
git clone <your-repo-url>
cd yxor
```

#### 3. 安装依赖
```bash
# 后端
cd backend
npm install --production
cp .env.example .env
# 编辑 .env 配置生产环境

# 前端
cd ../frontend
npm install
npm run build
```

#### 4. 配置 Nginx
```nginx
server {
    listen 80;
    server_name your-domain.com;

    # 前端
    location / {
        root /path/to/yxor/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # 后端 API
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### 5. 启动应用
```bash
cd backend
pm2 start server.js --name yxor-api
pm2 save
pm2 startup
```

#### 6. 启用 SSL（推荐）
```bash
# 使用 Certbot
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

## 环境变量配置

### 后端生产环境 (.env)
```
PORT=3001
NODE_ENV=production
CORS_ORIGIN=https://your-domain.com
# 邮件配置（可选）
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### 前端
在 `frontend/vite.config.js` 中配置 API 代理

## 数据库集成（可选）

如果需要持久化存储数据，可以集成数据库：

### 使用 MongoDB

1. 安装 mongoose
```bash
npm install mongoose
```

2. 修改 `backend/server.js`
```javascript
import mongoose from 'mongoose';

// 连接数据库
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));
```

### 使用 PostgreSQL

1. 安装 pg
```bash
npm install pg
```

2. 配置连接...

## 监控和日志

### 使用 PM2 监控
```bash
# 查看实时日志
pm2 logs yxor-api

# 查看内存使用
pm2 monit

# 查看详细信息
pm2 show yxor-api
```

### 日志文件位置
```
backend/logs/err.log      # 错误日志
backend/logs/out.log      # 输出日志
backend/logs/combined.outerr.log  # 合并日志
```

## 备份和恢复

### 自动备份脚本
```bash
#!/bin/bash
BACKUP_DIR="/backups/yxor"
DATE=$(date +%Y%m%d_%H%M%S)

# 备份后端
tar -czf $BACKUP_DIR/backend_$DATE.tar.gz backend/

# 备份前端构建产物
tar -czf $BACKUP_DIR/frontend_$DATE.tar.gz frontend/dist/

echo "备份完成: $DATE"
```

## 常见问题排查

### CORS 错误
- 检查 `.env` 中的 `CORS_ORIGIN` 设置
- 确保前端和后端的地址正确配置

### 连接超时
- 检查防火墙设置
- 确保端口 3001 开放
- 检查 Nginx 代理配置

### 内存不足
```bash
# 增加 Node.js 内存限制
node --max-old-space-size=4096 server.js
```

### 性能优化
- 启用 Gzip 压缩
- 使用 CDN 分发静态文件
- 实施缓存策略
- 数据库查询优化

## 运维命令参考

```bash
# PM2 常用命令
pm2 start app.js              # 启动应用
pm2 stop all                  # 停止所有应用
pm2 restart all               # 重启所有应用
pm2 delete all                # 删除所有应用
pm2 save                      # 保存 PM2 进程列表
pm2 startup                   # 设置启动自启
pm2 unstartup                 # 取消启动自启

# Docker 命令
docker ps                     # 查看运行的容器
docker logs -f container_id   # 查看日志
docker stop container_id      # 停止容器
docker rm container_id        # 删除容器
docker prune                  # 清理未使用的资源
```

## 支持

遇到问题？发送邮件至 join@yxorteam.com

---

**最后更新**: 2025-11-13
