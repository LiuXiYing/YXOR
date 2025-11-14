# 后端数据库集成指南

## 概述

项目现在提供三种后端方案：

1. **原始版本** (`server.js`) - 内存数据存储（开发测试用）
2. **MongoDB版本** (`server-db.js`) - 云数据库方案（推荐生产环境）
3. **SQLite版本** (`server-sqlite.js`) - 轻量级本地数据库（推荐快速部署）

## 方案对比

| 特性 | server.js | server-db.js (MongoDB) | server-sqlite.js |
|------|-----------|--------|-----------|
| 外部依赖 | ❌ 无 | ✅ MongoDB Atlas | ❌ 无 |
| 数据持久化 | ❌ 否 | ✅ 是 | ✅ 是 |
| 易用性 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| 性能 | 最高 | 优秀 | 很好 |
| 扩展性 | 低 | 高 | 中等 |
| 推荐场景 | 快速演示 | 生产环境 | 快速部署 |

## SQLite 版本（推荐初期使用）

### 快速开始

```bash
cd backend
npm install
npm run dev:sqlite
```

**优点**：
- ✅ 无需外部数据库
- ✅ 一键启动
- ✅ 自动创建数据库
- ✅ 完整的CRUD功能
- ✅ 适合快速开发

### 特性

- 完整的CRUD操作（增删改查）
- 成员软删除和永久删除
- 申请状态管理
- 数据统计接口
- 所有数据存储在 `backend/data.db`

### 数据库文件

数据库文件自动创建在 `backend/data.db`，包含以下表：

```sql
team_info        -- 战队信息
team_members     -- 团队成员
achievements     -- 成就荣誉
applications     -- 入队申请
```

## MongoDB 版本（推荐生产环境）

### 前置要求

选择以下之一：

1. **本地 MongoDB** (开发环境)
   ```bash
   # macOS
   brew install mongodb-community
   brew services start mongodb-community

   # Linux
   sudo systemctl start mongod
   ```

2. **MongoDB Atlas** (云服务，推荐)
   - 访问 https://www.mongodb.com/cloud/atlas
   - 注册免费账户
   - 创建集群（M0免费层）
   - 获取连接字符串

### 安装配置

```bash
cd backend
npm install
```

编辑 `backend/.env`：

```env
# 本地开发
MONGODB_URI=mongodb://localhost:27017/yxor_team

# 或使用 MongoDB Atlas (推荐)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/yxor_team?retryWrites=true&w=majority
```

### 启动

```bash
# 初始化数据库
npm run init-db

# 启动开发服务器
npm run dev:db

# 或生产启动
npm start:db
```

### 特性

- 完整的CRUD操作
- Mongoose 模式验证
- 自动时间戳
- 高级查询能力
- 适合大规模应用

## 完整 API 文档

### 战队信息

```bash
# 获取战队信息
GET /api/team/info

# 更新战队信息
PUT /api/team/info
Body: { name, description, founded, contactEmail, logo }
```

### 团队成员

```bash
# 获取所有活跃成员
GET /api/team/members

# 获取所有成员（含非活跃）
GET /api/team/members/all

# 获取单个成员
GET /api/team/members/:id

# 添加成员
POST /api/team/members
Body: { name, role, avatar, signature, blog, direction }

# 更新成员
PUT /api/team/members/:id
Body: { name, role, avatar, signature, blog, direction, isActive }

# 软删除成员
DELETE /api/team/members/:id

# 永久删除成员
DELETE /api/team/members/:id/permanent
```

### 成就

```bash
# 获取所有成就
GET /api/team/achievements

# 获取单个成就
GET /api/team/achievements/:id

# 添加成就
POST /api/team/achievements
Body: { year, title, award, description, location }

# 更新成就
PUT /api/team/achievements/:id
Body: { year, title, award, description, location }

# 删除成就
DELETE /api/team/achievements/:id
```

### 申请

```bash
# 获取所有申请
GET /api/team/applications

# 按状态过滤申请
GET /api/team/applications?status=pending

# 获取单个申请
GET /api/team/applications/:id

# 提交申请
POST /api/team/apply
Body: { name, email, phone, skills, message }

# 更新申请状态
PATCH /api/team/applications/:id/status
Body: { status, review_notes }

# 删除申请
DELETE /api/team/applications/:id
```

### 统计和健康

```bash
# 获取统计信息
GET /api/stats
Response: { members, achievements, applications, pendingApplications }

# 健康检查
GET /api/health
Response: { status, database, timestamp }

# API文档
GET /api
```

## 数据模型

### TeamInfo (战队信息)

```javascript
{
  _id: ObjectId,
  name: String,           // 战队名称
  description: String,    // 战队介绍
  founded: String,        // 成立年份
  logo: String,          // 标志URL
  contactEmail: String,   // 联系邮箱
  createdAt: Date,
  updatedAt: Date
}
```

### TeamMember (团队成员)

```javascript
{
  _id: ObjectId,
  name: String,          // 成员名字
  role: String,          // 专业方向
  avatar: String,        // 头像URL
  signature: String,     // 个人签名
  blog: String,          // 博客链接
  direction: String,     // 研究方向
  joinDate: Date,        // 加入时间
  isActive: Boolean,     // 是否活跃
  createdAt: Date,
  updatedAt: Date
}
```

### Achievement (成就)

```javascript
{
  _id: ObjectId,
  year: Number,          // 年份
  title: String,         // 标题
  award: String,         // 奖项
  description: String,   // 描述
  location: String,      // 地点
  createdAt: Date,
  updatedAt: Date
}
```

### Application (申请)

```javascript
{
  _id: ObjectId,
  name: String,          // 申请人
  email: String,         // 邮箱
  phone: String,         // 电话
  skills: String,        // 专业方向
  message: String,       // 自我介绍
  status: String,        // 状态 (pending/reviewed/approved/rejected)
  submittedAt: Date,     // 提交时间
  reviewedAt: Date,      // 审核时间
  reviewNotes: String,   // 审核备注
  createdAt: Date
}
```

## 管理操作

### 查看所有数据（SQLite）

```bash
# 登录数据库
sqlite3 backend/data.db

# 查看表结构
.schema

# 查看所有成员
SELECT * FROM team_members;

# 查看所有申请
SELECT * FROM applications;

# 导出为CSV
.mode csv
.output members.csv
SELECT * FROM team_members;
```

### 导入示例数据（MongoDB）

```bash
npm run init-db
```

### 备份数据

#### SQLite
```bash
# 复制数据库文件
cp backend/data.db backend/data.backup.db

# 或导出SQL
sqlite3 backend/data.db .dump > backup.sql
```

#### MongoDB
```bash
# 导出
mongodump --db yxor_team --out backup/

# 导入
mongorestore --db yxor_team backup/yxor_team/
```

## 迁移指南

### 从 SQLite 迁移到 MongoDB

1. **导出 SQLite 数据**
```bash
# 导出为JSON
sqlite3 backend/data.db -json "SELECT * FROM team_members;" > members.json
```

2. **导入到 MongoDB**
```bash
# 使用 mongoimport 或在应用中编写导入脚本
node scripts/migrate-to-mongodb.js
```

### 在不同版本间切换

```bash
# 使用 SQLite 版本
npm run dev:sqlite

# 切换到 MongoDB 版本
npm run dev:db

# 切换回原始版本
npm run dev
```

## 常见问题

### SQLite 版本无法写入

检查文件权限：
```bash
chmod 644 backend/data.db
```

### MongoDB 连接超时

- 检查网络连接
- 确认 IP 白名单配置
- 验证连接字符串

### 数据丢失

确保定期备份：
```bash
# SQLite
cp backend/data.db backend/data.backup.$(date +%s).db

# MongoDB
mongodump --db yxor_team
```

## 性能优化

### SQLite
- 创建索引：`CREATE INDEX idx_member_name ON team_members(name);`
- 定期 VACUUM：`VACUUM;`

### MongoDB
- 创建索引：`db.teamMembers.createIndex({ name: 1 })`
- 启用压缩

## 安全建议

1. **数据验证**
   - 所有API端点都有输入验证
   - 邮箱格式检查
   - 必填字段验证

2. **访问控制**
   - 添加用户认证
   - 实施权限管理
   - 使用环境变量存储敏感信息

3. **数据备份**
   - 定期备份数据库
   - 测试恢复流程
   - 保存多个版本备份

## 下一步

1. **选择合适的版本** - SQLite(快速) 或 MongoDB(扩展)
2. **启动服务器** - `npm run dev:sqlite` 或 `npm run dev:db`
3. **测试API** - 使用 Postman 或 curl 测试端点
4. **配置前端** - 前端已自动适配新API
5. **部署上线** - 根据选择的版本部署

---

**需要帮助？** 查看各版本的注释代码或提交 Issue。
