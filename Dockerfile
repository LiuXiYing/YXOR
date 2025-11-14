FROM node:18-alpine

WORKDIR /app

# 复制后端
COPY backend/package*.json ./backend/
WORKDIR /app/backend
RUN npm install --production

# 复制后端代码
COPY backend/server.js .
COPY backend/.env .env || true

WORKDIR /app

# 复制前端
COPY frontend/package*.json ./frontend/
WORKDIR /app/frontend
RUN npm install

# 构建前端
COPY frontend . 
RUN npm run build

# 最终阶段
FROM node:18-alpine

WORKDIR /app

# 复制后端依赖和代码
COPY --from=0 /app/backend/node_modules ./backend/node_modules
COPY backend/server.js ./backend/
COPY backend/.env ./backend/.env || true

# 复制前端构建产物
COPY --from=0 /app/frontend/dist ./frontend/dist

# 设置环境变量
ENV NODE_ENV=production
ENV PORT=3001

EXPOSE 3001

WORKDIR /app/backend

CMD ["node", "server.js"]
