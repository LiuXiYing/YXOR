# 🔧 网络错误诊断指南

## ❌ 问题：管理系统显示 "Network Error"

### 可能的原因：

1. **后端没有启动**
   - 检查终端是否有运行 Node.js 进程
   - 应该看到类似的信息：
     ```
     ✅ YXOR Team 后端服务已启动
     监听端口: 3001
     ```

2. **后端进程被终止**
   - 可能是崩溃了
   - 需要重新启动后端

3. **CORS 配置问题**
   - 前端在 http://localhost:5173
   - 后端在 http://localhost:3001
   - 应该已配置但可能有问题

### 解决步骤：

#### 步骤 1：检查后端状态

```bash
# 在后端目录
cd backend

# 检查是否有 Node 进程运行
ps aux | grep node

# 如果有进程，杀死它
killall node

# 重新启动后端
npm run dev:sqlite
```

#### 步骤 2：检查数据库文件

```bash
# 检查 data.db 是否存在
ls -la backend/data.db

# 如果不存在，后端会自动创建
```

#### 步骤 3：测试 API 连接

在浏览器中打开：
```
http://localhost:3001/api/team/info
```

应该看到返回的 JSON 数据。如果看到错误或无法连接，说明后端有问题。

#### 步骤 4：检查浏览器控制台

1. 打开 http://localhost:5173/admin
2. 按 F12 打开开发者工具
3. 查看 Console 和 Network 选项卡
4. 查看是否有详细的错误消息

#### 步骤 5：检查前端配置

确保 `AdminTeamInfo.jsx` 中的 API_BASE 是正确的：
```javascript
const API_BASE = 'http://localhost:3001/api';
```

### 常见错误信息及解决方案：

| 错误信息 | 原因 | 解决方案 |
|---------|------|--------|
| Network Error | 后端未启动 | 启动后端服务 |
| 504 Gateway | 后端崩溃 | 检查后端日志，重启后端 |
| CORS error | 跨域配置 | 检查后端 CORS 配置 |
| 文件过大 (413) | Logo 图片太大 | 压缩图片或使用 URL |

### 完整重启流程：

```bash
# 1. 杀死所有 Node 进程
killall node

# 2. 进入后端目录
cd backend

# 3. 重新启动后端
npm run dev:sqlite

# 看到以下信息说明成功：
# ✅ YXOR Team 后端服务已启动
# 监听端口: 3001
```

### 快速测试脚本：

```bash
# 直接测试 API
curl -X GET http://localhost:3001/api/team/info

# 应该返回类似：
# {"data":{"id":1,"name":"YXOR Team",...}}
```

## 🆘 仍然无法解决？

1. 查看后端终端输出的错误信息
2. 检查 `backend/data.db` 是否可写
3. 查看 `backend/server-sqlite.js` 第 30 行的数据库连接错误
4. 确保端口 3001 未被其他进程占用

```bash
# 检查端口占用
lsof -i :3001

# 查看后端日志（如果有）
cat backend/server.log
```
