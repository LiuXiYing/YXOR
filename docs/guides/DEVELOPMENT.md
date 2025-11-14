# 开发指南

## 项目概览

YXOR Team是一个展示CTF战队信息的前后端分离项目。

### 架构设计

```
┌─────────────────────────────────────┐
│     用户浏览器 (Frontend)            │
│  http://localhost:5173              │
├─────────────────────────────────────┤
│         React + Vite                │
│  ┌─────────────────────────────┐    │
│  │ 导航栏 / 主页 / 成员展示等  │    │
│  │ 使用 Axios 调用 API        │    │
│  └─────────────────────────────┘    │
└─────────────┬───────────────────────┘
              │ HTTP/CORS
              ↓
┌─────────────────────────────────────┐
│     后端服务器 (Backend)             │
│  http://localhost:3001              │
├─────────────────────────────────────┤
│      Node.js + Express              │
│  ┌─────────────────────────────┐    │
│  │ REST API 路由               │    │
│  │ 战队信息 / 成员 / 成就等    │    │
│  └─────────────────────────────┘    │
└─────────────────────────────────────┘
```

## 前端开发

### 文件结构
```
frontend/
├── src/
│   ├── components/          # React组件
│   │   ├── Navbar.jsx       # 导航栏
│   │   ├── Hero.jsx         # 主题部分
│   │   ├── TeamIntro.jsx    # 战队介绍
│   │   ├── Members.jsx      # 成员展示
│   │   ├── Achievements.jsx # 成就展示
│   │   ├── Apply.jsx        # 申请表单
│   │   └── Footer.jsx       # 页脚
│   ├── App.jsx              # 主应用组件
│   ├── main.jsx             # 入口文件
│   └── index.css            # 全局样式
├── index.html               # HTML入口
├── vite.config.js           # Vite配置
├── tailwind.config.js       # Tailwind配置
├── postcss.config.js        # PostCSS配置
└── package.json
```

### 修改战队信息

1. **修改战队基本信息**
   
   编辑 `backend/server.js` 中的 `teamInfo` 对象：
   ```javascript
   const teamInfo = {
     name: 'YXOR Team',
     description: '修改描述文本...',
     founded: '2020',
     contactEmail: 'join@yxorteam.com'
   };
   ```

2. **修改成员列表**
   
   编辑 `backend/server.js` 中的 `teamMembers` 数组：
   ```javascript
   const teamMembers = [
     {
       id: 1,
       name: '成员名字',
       role: '专业方向',
       avatar: '头像URL',
       signature: '个人签名',
       blog: '博客链接',
       direction: '研究方向描述'
     }
   ];
   ```

3. **修改成就列表**
   
   编辑 `teamInfo` 中的 `achievements` 数组：
   ```javascript
   achievements: [
     { year: 2024, title: '竞赛标题', award: '奖项名称' }
   ]
   ```

### 样式定制

- **Tailwind配置**: 修改 `tailwind.config.js`
  ```javascript
  theme: {
    extend: {
      colors: {
        'yxor-dark': '#0f172a',
        'yxor-blue': '#0ea5e9'
      }
    }
  }
  ```

- **全局样式**: 编辑 `src/index.css`
  ```css
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
  ```

### 添加新页面

1. 创建新组件 `frontend/src/components/NewPage.jsx`
2. 在 `App.jsx` 中引入和使用
3. 在 `Navbar.jsx` 中添加导航链接

## 后端开发

### API 路由

所有API路由在 `backend/server.js` 中定义：

| 方法 | 路由 | 说明 |
|------|------|------|
| GET | `/api/team/info` | 获取战队信息 |
| GET | `/api/team/members` | 获取所有成员 |
| GET | `/api/team/members/:id` | 获取单个成员 |
| GET | `/api/team/achievements` | 获取成就列表 |
| POST | `/api/team/apply` | 提交入队申请 |
| GET | `/api/health` | 健康检查 |

### 添加新API

在 `server.js` 中添加新路由：

```javascript
// 获取统计数据
app.get('/api/team/stats', (req, res) => {
  res.json({
    totalMembers: 5,
    totalAchievements: 4,
    founded: 2020
  });
});

// POST 处理数据
app.post('/api/team/feedback', (req, res) => {
  const { message, email } = req.body;
  // 处理反馈...
  res.json({ success: true });
});
```

### 环境配置

编辑 `backend/.env`：
```
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

## 本地开发流程

### 1. 初始化
```bash
# 克隆项目后
chmod +x install.sh start.sh
./install.sh
```

### 2. 启动开发服务
```bash
# 方法A: 使用启动脚本
./start.sh

# 方法B: 手动启动
# 终端1 - 后端
cd backend && npm run dev

# 终端2 - 前端
cd frontend && npm run dev
```

### 3. 打开浏览器
```
http://localhost:5173
```

## 常见开发任务

### 添加新成员
1. 编辑 `backend/server.js`
2. 在 `teamMembers` 数组中添加新成员对象
3. 前端自动从API获取并显示

### 修改样式
1. 编辑相应组件的 `className`
2. 使用 Tailwind CSS 类名
3. Vite会自动热更新

### 调试API
```bash
# 使用curl测试
curl http://localhost:3001/api/team/info
curl http://localhost:3001/api/team/members
```

## 生产构建

### 前端构建
```bash
cd frontend
npm run build
# 产物在 dist/ 目录
```

### 后端部署
```bash
# 使用PM2
npm install -g pm2
pm2 start backend/server.js --name yxor-api
pm2 save
pm2 startup
```

## 故障排查

### 端口被占用
```bash
# 查找占用端口的进程
lsof -i :3001
lsof -i :5173

# 杀死进程
kill -9 <PID>
```

### API连接失败
1. 确保后端正在运行 (http://localhost:3001)
2. 检查 CORS 配置
3. 查看浏览器控制台的错误信息

### 样式不生效
1. 确保 Tailwind 类名正确
2. 重启 Vite 开发服务
3. 清空浏览器缓存

## 代码规范

### 命名规范
- 组件文件: `PascalCase` (e.g., `Members.jsx`)
- 普通文件: `camelCase` (e.g., `server.js`)
- 常量: `UPPER_SNAKE_CASE`

### React最佳实践
```javascript
// ✅ 好的做法
export default function MyComponent() {
  const [state, setState] = React.useState(null);
  
  React.useEffect(() => {
    // 获取数据
  }, []);
  
  return <div>...</div>;
}

// ❌ 避免
function myComponent() { } // 小写开头
```

## 文档更新

编辑文件时，不要忘记更新相关文档：
- `README.md` - 项目总体文档
- `QUICK_START.md` - 快速开始指南
- `DEVELOPMENT.md` - 开发指南（本文件）

---

**需要帮助？** 发送邮件至 join@yxorteam.com
