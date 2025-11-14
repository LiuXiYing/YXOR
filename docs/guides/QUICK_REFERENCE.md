# 🚀 一分钟快速开始

## 最快启动方式

```bash
# 进入项目目录
cd /Users/enter/Project/yxor

# 一键安装和启动
chmod +x install.sh start.sh
./install.sh && ./start.sh
```

## 打开浏览器
```
http://localhost:5173
```

---

## 📋 核心命令速查

### 安装依赖
```bash
./install.sh           # 一键安装所有依赖
```

### 启动开发环境
```bash
./start.sh            # 一键启动前后端
```

### 手动启动

**后端**（终端1）
```bash
cd backend
npm install
npm run dev           # 运行在 http://localhost:3001
```

**前端**（终端2）
```bash
cd frontend
npm install
npm run dev           # 运行在 http://localhost:5173
```

### 生产构建
```bash
cd frontend
npm run build         # 构建前端
# 产物在 frontend/dist/
```

---

## 📝 快速修改

### 修改战队信息

编辑 `backend/server.js`，修改这部分：

```javascript
const teamInfo = {
  name: 'YXOR Team',
  description: '你的战队介绍...',
  founded: '2020',
  contactEmail: 'join@yxorteam.com'
};
```

### 修改成员列表

编辑 `backend/server.js` 中的 `teamMembers` 数组：

```javascript
const teamMembers = [
  {
    id: 1,
    name: '成员名字',
    role: 'Web安全',
    avatar: '头像URL',
    signature: '个人签名',
    blog: '博客链接',
    direction: '研究方向'
  }
  // ...添加更多成员
];
```

### 修改成就列表

在 `teamInfo` 中的 `achievements` 数组：

```javascript
achievements: [
  { year: 2024, title: '竞赛标题', award: 'Champion' },
  // ...更多成就
]
```

---

## 🌐 访问地址

| 服务 | 地址 | 说明 |
|------|------|------|
| 前端应用 | http://localhost:5173 | 主网站 |
| 后端API | http://localhost:3001 | API服务 |
| 战队信息API | /api/team/info | 获取战队信息 |
| 成员列表API | /api/team/members | 获取所有成员 |

---

## 📧 入队邮箱

```
join@yxorteam.com
```

---

## 📚 重要文档

| 文档 | 描述 |
|------|------|
| [README.md](README.md) | 📖 完整项目文档（必读） |
| [QUICK_START.md](QUICK_START.md) | ⚡ 快速开始指南 |
| [DEVELOPMENT.md](DEVELOPMENT.md) | 🛠️ 开发指南 |
| [DEPLOYMENT.md](DEPLOYMENT.md) | 🚀 部署指南 |
| [PROJECT_INFO.md](PROJECT_INFO.md) | 📋 项目详细信息 |

---

## 🐛 常见问题

### 端口已被占用？
```bash
# 查找占用的进程
lsof -i :3001   # 后端端口
lsof -i :5173   # 前端端口

# 杀死进程
kill -9 <PID>
```

### 依赖安装失败？
```bash
# 清理npm缓存
npm cache clean --force

# 删除node_modules和package-lock.json
rm -rf node_modules package-lock.json

# 重新安装
npm install
```

### API连接失败？
1. 确保后端正在运行 `npm run dev`
2. 检查 http://localhost:3001/api/health
3. 查看浏览器控制台错误信息

---

## ✨ 主要功能

✅ **战队介绍** - 大面积Logo展示  
✅ **团队成员** - 完整信息展示  
✅ **成就荣誉** - 竞赛奖项  
✅ **在线申请** - 入队表单  
✅ **响应式设计** - 完美适配

---

## 🔧 技术栈

- **前端**: React 18 + Vite + Tailwind CSS
- **后端**: Node.js + Express
- **部署**: Docker / PM2 / Vercel

---

## 📞 需要帮助？

- 📖 查看文档
- 📧 发送邮件至 join@yxorteam.com
- 💬 查看代码注释

---

**快乐开发！** 🎉
