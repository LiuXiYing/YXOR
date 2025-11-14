# YXOR Team CTF展示网站

![YXOR Team](https://img.shields.io/badge/YXOR%20Team-CTF%20Elite-cyan)
![License](https://img.shields.io/badge/license-MIT-blue)

YXOR Team是一个专业的CTF竞赛战队展示网站，采用现代的前后端分离架构。展示战队信息、团队成员、竞赛成就和招募新成员的平台。

## 🎯 项目特性

- ✨ **现代化设计**：使用Tailwind CSS打造精美UI
- 🚀 **前后端分离**：React前端 + Node.js Express后端
- 📱 **响应式布局**：完美适配各种设备
- 🔌 **RESTful API**：标准的API接口设计
- 💨 **高性能**：使用Vite进行快速开发和构建
- 🎨 **动画效果**：流畅的页面过渡和交互动画
- 📧 **在线申请**：直观的团队成员申请表单

## 📋 项目结构

```
yxor/
├── frontend/                 # React前端项目
│   ├── src/
│   │   ├── components/      # React组件
│   │   │   ├── Navbar.jsx
│   │   │   ├── Hero.jsx
│   │   │   ├── TeamIntro.jsx
│   │   │   ├── Members.jsx
│   │   │   ├── Achievements.jsx
│   │   │   ├── Apply.jsx
│   │   │   └── Footer.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── package.json
│
├── backend/                  # Node.js后端项目
│   ├── server.js            # 主服务器文件
│   ├── package.json
│   └── .env.example
│
└── README.md
```

## 🚀 快速开始

### 前提条件
- Node.js >= 16.0.0
- npm 或 yarn

### 推荐方案：SQLite版（一键启动）⭐

```bash
cd backend
npm install
npm run dev:sqlite
```

然后在新的终端：

```bash
cd frontend
npm install
npm run dev
```

打开浏览器访问：http://localhost:5173

### 其他方案

**原始版本（内存存储，演示用）**
```bash
cd backend && npm run dev
```

**MongoDB版本（生产环境）**
```bash
# 配置 .env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/yxor_team

npm run init-db    # 初始化数据库
npm run dev:db     # 启动服务
```

详见 `docs/guides/DATABASE.md` 了解完整配置

### 后端安装与运行

```bash
# 进入后端目录
cd backend

# 安装依赖
npm install

# 复制环境配置
cp .env.example .env

# 启动开发服务器
npm run dev
# 或生产服务器
npm start
```

后端将运行在 `http://localhost:3001`

### 前端安装与运行

```bash
# 进入前端目录
cd frontend

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

前端将运行在 `http://localhost:5173`

## 📖 功能介绍

### 1. 战队介绍 (Hero & TeamIntro)
- 展示战队标志和名称
- 详细的战队介绍文本
- 战队成立时间和人员规模
- 联系邮箱

### 2. 团队成员 (Members)
- 展示所有团队成员的头像
- 成员的专业方向
- 个性签名
- 博客链接
- 卡片式设计，鼠标悬停有动画效果

### 3. 成就荣誉 (Achievements)
- 列出战队在各项竞赛中的成就
- 按年份展示奖项
- 成就统计信息

### 4. 在线申请 (Apply)
- 申请表单包含：姓名、邮箱、电话、专业方向、自我介绍
- 表单验证
- 提交后显示成功/错误提示
- 支持直接发送邮件

### 5. 页面导航 (Navbar & Footer)
- 固定导航栏，快速定位各个章节
- 完整的页脚，包含链接和社交媒体

## 🔌 API 文档

### 获取战队信息
```
GET /api/team/info
```
**响应**：
```json
{
  "name": "YXOR Team",
  "description": "...",
  "founded": "2020",
  "achievements": [...],
  "contactEmail": "join@yxorteam.com"
}
```

### 获取所有成员
```
GET /api/team/members
```

### 获取单个成员
```
GET /api/team/members/:id
```

### 获取成就列表
```
GET /api/team/achievements
```

### 提交入队申请
```
POST /api/team/apply
Content-Type: application/json

{
  "name": "张三",
  "email": "zhangsan@example.com",
  "phone": "13800138000",
  "skills": "Web安全",
  "message": "..."
}
```

### 健康检查
```
GET /api/health
```

## 🎨 技术栈

### 前端
- **React 18** - UI框架
- **Vite** - 构建工具
- **Tailwind CSS** - 样式框架
- **Axios** - HTTP客户端
- **PostCSS** - CSS处理器

### 后端
- **Express** - Web框架
- **CORS** - 跨域资源共享
- **dotenv** - 环境配置
- **Node.js** - 运行环境

## 🛠️ 开发指南

### 添加新成员

在 `backend/server.js` 中修改 `teamMembers` 数组：

```javascript
const teamMembers = [
  {
    id: 6,
    name: '新成员名字',
    role: '专业方向',
    avatar: 'https://ui-avatars.com/api/?name=新成员&background=FF9800&color=fff',
    signature: '个性签名',
    blog: 'https://blog.example.com',
    direction: '研究方向描述'
  },
  // ...
];
```

### 修改战队信息

在 `backend/server.js` 中修改 `teamInfo` 对象：

```javascript
const teamInfo = {
  name: 'YXOR Team',
  description: '更新的描述',
  founded: '2020',
  achievements: [...],
  contactEmail: 'join@yxorteam.com'
};
```

### 自定义样式

- 修改 `frontend/tailwind.config.js` 自定义Tailwind配置
- 修改 `frontend/src/index.css` 添加全局样式

## 📝 环境变量

### 后端 (.env)
```
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

### 前端
前端通过 `vite.config.js` 中的proxy配置自动代理API请求。

## 🚢 部署

### 前端部署

```bash
cd frontend
npm run build
```

构建产物在 `dist/` 目录，可部署到Vercel、Netlify等平台。

### 后端部署

1. 更新 `backend/.env` 中的生产环境配置
2. 使用PM2或其他进程管理器：
```bash
pm2 start backend/server.js --name yxor-api
```

## 🤝 贡献指南

欢迎提交Issue和Pull Request来改进这个项目！

## 📄 许可证

MIT License - 查看LICENSE文件了解详情

## 📧 联系方式

- 邮箱：join@yxorteam.com
- 网站：正在建设中...

---

**Made with ❤️ by YXOR Team**
