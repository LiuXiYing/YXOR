# 🚀 后端快速参考

## 三种启动方式

### 1️⃣ 内存版（无数据库）- 最快上手
```bash
npm run dev
# 数据重启丢失，仅用于演示
```

### 2️⃣ SQLite版（推荐初期使用）✅
```bash
npm run dev:sqlite
# ✅ 最简单，无需配置
# ✅ 完整的CRUD功能
# ✅ 数据自动保存
# ✅ 数据库文件: data.db
```

### 3️⃣ MongoDB版（生产环境）
```bash
# 配置 .env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/yxor_team

npm run init-db      # 初始化数据库
npm run dev:db       # 启动开发服务
```

---

## API 端点速查

### 战队信息
```bash
GET    /api/team/info              # 获取战队信息
PUT    /api/team/info              # 更新战队信息
```

### 成员管理
```bash
GET    /api/team/members           # 获取所有活跃成员
POST   /api/team/members           # 添加新成员
GET    /api/team/members/:id       # 获取单个成员
PUT    /api/team/members/:id       # 更新成员
DELETE /api/team/members/:id       # 删除成员（软删除）
DELETE /api/team/members/:id/permanent  # 永久删除
```

### 成就管理
```bash
GET    /api/team/achievements      # 获取所有成就
POST   /api/team/achievements      # 添加新成就
GET    /api/team/achievements/:id  # 获取单个成就
PUT    /api/team/achievements/:id  # 更新成就
DELETE /api/team/achievements/:id  # 删除成就
```

### 申请管理
```bash
GET    /api/team/applications               # 获取所有申请
GET    /api/team/applications?status=pending # 按状态过滤
POST   /api/team/apply                       # 提交申请
PATCH  /api/team/applications/:id/status     # 更新申请状态
DELETE /api/team/applications/:id            # 删除申请
```

### 其他
```bash
GET    /api/stats                  # 获取统计信息
GET    /api/health                 # 健康检查
GET    /api                        # API文档
```

---

## 快速测试

### 使用脚本自动测试
```bash
node test-api.js
```

### 使用curl测试
```bash
# 添加成员
curl -X POST http://localhost:3001/api/team/members \
  -H "Content-Type: application/json" \
  -d '{"name":"张三","role":"Web安全"}'

# 获取成员列表
curl http://localhost:3001/api/team/members

# 提交申请
curl -X POST http://localhost:3001/api/team/apply \
  -H "Content-Type: application/json" \
  -d '{"name":"李四","email":"li@example.com","skills":"PWN"}'
```

### 使用Postman
1. 打开Postman
2. 导入 API 端点
3. 测试各个接口

---

## 数据模型

### 成员对象
```javascript
{
  id: "...",              // ID (MongoDB: ObjectId / SQLite: 整数)
  name: "张三",           // 姓名
  role: "Web安全",        // 角色
  avatar: "https://...",  // 头像URL
  signature: "...",       // 个性签名
  blog: "https://...",    // 博客链接
  direction: "...",       // 研究方向
  isActive: true,         // 是否活跃
  joinDate: "2024-01-01", // 加入时间
  createdAt: "...",       // 创建时间
  updatedAt: "..."        // 更新时间
}
```

### 成就对象
```javascript
{
  id: "...",              // ID
  year: 2024,             // 年份
  title: "...",           // 标题
  award: "Champion",      // 奖项
  description: "...",     // 描述
  location: "...",        // 地点
  createdAt: "...",
  updatedAt: "..."
}
```

### 申请对象
```javascript
{
  id: "...",              // ID
  name: "张三",           // 姓名
  email: "...",           // 邮箱
  phone: "...",           // 电话
  skills: "Web安全",      // 专业
  message: "...",         // 自我介绍
  status: "pending",      // 状态 (pending/reviewed/approved/rejected)
  reviewNotes: "...",     // 审核备注
  submittedAt: "...",     // 提交时间
  reviewedAt: "..."       // 审核时间
}
```

---

## 常见操作

### 导入初始数据（MongoDB）
```bash
npm run init-db
```

### 添加一个新成员
```bash
curl -X POST http://localhost:3001/api/team/members \
  -H "Content-Type: application/json" \
  -d '{
    "name": "王五",
    "role": "密码学",
    "avatar": "https://ui-avatars.com/api/?name=王五",
    "signature": "用数学破解密码",
    "blog": "https://example.com",
    "direction": "密码分析"
  }'
```

### 查看统计数据
```bash
curl http://localhost:3001/api/stats
```

### 查看所有待审批申请
```bash
curl "http://localhost:3001/api/team/applications?status=pending"
```

### 审批申请
```bash
curl -X PATCH http://localhost:3001/api/team/applications/1/status \
  -H "Content-Type: application/json" \
  -d '{"status":"approved","review_notes":"欢迎加入！"}'
```

---

## 环境变量

```env
PORT=3001                                    # 服务端口
NODE_ENV=development                        # 开发/生产
CORS_ORIGIN=http://localhost:5173          # 前端地址
MONGODB_URI=mongodb://localhost:27017/...  # MongoDB连接（可选）
```

---

## 常见问题

**Q: SQLite版本和MongoDB版本有什么区别？**
A: SQLite是轻量级本地数据库，MongoDB是云数据库。SQLite适合快速开发，MongoDB适合生产环境。

**Q: 如何切换数据库版本？**
A: 修改 `package.json` 中的 `dev` 脚本或直接运行 `npm run dev:sqlite/dev:db`

**Q: 数据存储在哪里？**
A: SQLite版本存储在 `backend/data.db`；MongoDB版本存储在指定的MongoDB服务器。

**Q: 如何永久删除数据？**
A: 使用 `DELETE /api/team/members/:id/permanent` 端点永久删除。

---

## 后续改进

- [ ] 添加用户认证
- [ ] 添加权限管理
- [ ] 添加日志系统
- [ ] 添加速率限制
- [ ] 添加缓存层
- [ ] 添加文件上传

---

📖 详见 `DATABASE.md` 获取完整文档
