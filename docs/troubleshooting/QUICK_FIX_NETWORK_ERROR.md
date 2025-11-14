# 🚨 快速修复指南 - Network Error 问题

## 问题症状
- ❌ 管理系统显示 "Network Error"
- ❌ 无法获取战队信息
- ❌ 无法保存修改

## 原因分析

99% 的情况是：**后端服务没有运行**

## ✅ 快速解决方案

### 第 1 步：检查后端是否运行

打开浏览器，访问：
```
http://localhost:3001/api/health
```

**预期结果**：看到类似这样的 JSON 响应
```json
{"status":"ok","message":"YXOR Team 后端服务正常运行"}
```

**如果看到错误**：继续第 2 步

### 第 2 步：启动后端服务

打开**新的终端**窗口，执行：

```bash
# 进入后端目录
cd /Users/enter/Project/yxor/backend

# 启动后端服务
npm run dev:sqlite
```

**预期看到**：
```
✅ YXOR Team 后端服务已启动
📊 使用数据库: SQLite (data.db)
监听端口: 3001
```

### 第 3 步：重新访问管理系统

1. 返回浏览器
2. 硬刷新页面：`Cmd+Shift+R` (Mac) 或 `Ctrl+Shift+R` (Windows)
3. 重新登录管理系统（密码: admin123）

**查看连接状态**：
- ✅ 导航栏显示绿色 "✅ 已连接" → 成功！
- ❌ 导航栏显示红色 "❌ 后端离线" → 继续排查

### 第 4 步：如果还是不行

```bash
# 1. 强制杀死所有 Node 进程
killall node

# 2. 重新启动后端
cd /Users/enter/Project/yxor/backend
npm run dev:sqlite

# 3. 再次验证
curl http://localhost:3001/api/health
```

### 第 5 步：检查端口占用

如果后端启动失败，可能是端口 3001 被占用：

```bash
# 查看占用端口 3001 的进程
lsof -i :3001

# 如果有进程，杀死它
kill -9 <PID>
```

## 📊 管理系统连接状态指示

登录管理系统后，左上角会显示连接状态：

- 🟢 **✅ 已连接** - 后端运行正常，所有功能可用
- 🔴 **❌ 后端离线** - 后端未启动或无法连接，所有操作会失败

## 🎯 完整启动步骤

如果是第一次运行，按照以下顺序启动：

### 终端 1：启动后端
```bash
cd backend
npm run dev:sqlite
# 看到 ✅ 消息说明成功
```

### 终端 2：启动前端
```bash
cd frontend
npm run dev
# 看到 http://localhost:5173 可以访问
```

### 浏览器：访问应用
```
首页: http://localhost:5173/
管理: http://localhost:5173/admin (密码: admin123)
```

## 常见问题排查

| 现象 | 原因 | 解决方案 |
|------|------|--------|
| Network Error | 后端未启动 | 启动后端服务 |
| 获取信息失败 | 后端崩溃 | 查看后端日志，重启 |
| 保存失败 | 数据库错误 | 检查 data.db 文件 |
| 文件过大 (413) | Logo 太大 | 使用 URL 或压缩图片 |

## 📞 获取更多帮助

- 查看完整诊断指南：`NETWORK_ERROR_GUIDE.md`
- 查看部署文档：`../guides/DEPLOYMENT.md`
- 查看快速参考：`QUICK_REFERENCE.md`

---

**✨ 99% 的问题通过启动后端服务可以解决！**
