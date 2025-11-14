# 🎯 管理系统使用指南

## 📌 访问管理系统

### 登录地址
```
http://localhost:5173/admin
```

### 默认密码
```
admin123
```

⚠️ **重要**: 生产环境请修改默认密码！

---

## 📝 管理系统功能

### 1️⃣ 战队信息管理
**路径**: 管理系统 → 📋 战队信息

可以编辑以下内容：
- 🏢 **战队名称** - 如 "YXOR"
- 📖 **战队描述** - 详细介绍
- 📅 **成立年份** - 如 "2020"
- 🖼️ **Logo URL** - 上传战队 Logo 图片链接
- 📧 **联系邮箱** - 战队联系方式

**操作步骤**:
1. 点击"📋 战队信息"标签页
2. 编辑相关信息
3. 点击"💾 保存更改"

---

### 2️⃣ 成员管理
**路径**: 管理系统 → 👥 成员管理

#### ✨ 添加成员
```
1. 点击"+ 添加新成员"按钮
2. 填写以下信息:
   - 成员名称 * (必填)
   - 角色/职位 * (必填)
   - 头像 URL (可选)
   - 个性签名 (可选)
   - 博客链接 (可选)
   - 研究方向 (可选)
3. 点击"➕ 添加成员"
```

#### 📝 示例数据
```
名称: 张三
角色: Web安全
头像: https://example.com/avatar.jpg
签名: "热爱安全，追求极致"
博客: https://blog.example.com
方向: 代码审计、漏洞挖掘
```

#### 🔄 编辑成员
1. 找到要编辑的成员卡片
2. 点击"✏️ 编辑"按钮
3. 修改信息
4. 点击"✏️ 更新成员"

#### 🗑️ 删除成员
1. 点击成员卡片上的"🗑️ 删除"按钮
2. 确认删除

---

### 3️⃣ 成就管理
**路径**: 管理系统 → 🏆 成就管理

#### ✨ 添加成就
```
1. 点击"+ 添加新成就"按钮
2. 填写以下信息:
   - 年份 (如 2024)
   - 成就名称 * (必填)
   - 奖项 * (必填)
   - 地点/活动 (可选)
   - 详细描述 (可选)
3. 点击"➕ 添加成就"
```

#### 📝 示例数据
```
年份: 2024
名称: CTF全国总决赛
奖项: 一等奖
地点: 北京
描述: "凭借扎实的技能和团队协作，获得全国总决赛一等奖"
```

#### 🔄 编辑/删除
- 点击成就列表中的"✏️"或"🗑️"按钮

---

### 4️⃣ 申请审批
**路径**: 管理系统 → 📝 申请审批

#### 📊 申请统计
- 显示总申请数、待审批、已通过、已拒绝的统计

#### 🔍 查看申请
- 申请者信息 (名字、邮箱、电话)
- 技能描述
- 申请理由
- 审批备注

#### ✅ 审批操作
- **✅ 批准** - 通过申请
- **❌ 拒绝** - 拒绝申请
- **⏳ 待审** - 恢复到待审批状态
- **🗑️ 删除** - 删除申请记录

#### 🔎 筛选申请
点击上方按钮筛选:
- **全部** - 显示所有申请
- **待审批** - 仅显示待审批
- **已通过** - 仅显示已通过
- **已拒绝** - 仅显示已拒绝

---

## 🛠️ API 调用示例

### 使用 curl 添加成员
```bash
curl -X POST http://localhost:3001/api/team/members \
  -H "Content-Type: application/json" \
  -d '{
    "name": "张三",
    "role": "Web安全",
    "avatar": "https://example.com/avatar.jpg",
    "signature": "热爱安全",
    "blog": "https://blog.example.com",
    "direction": "代码审计"
  }'
```

### 使用 curl 删除成员
```bash
# 软删除（推荐，保留历史）
curl -X DELETE http://localhost:3001/api/team/members/{id}

# 永久删除
curl -X DELETE http://localhost:3001/api/team/members/{id}/permanent
```

### 使用 curl 获取成员列表
```bash
# 仅获取活跃成员
curl http://localhost:3001/api/team/members

# 获取所有成员（包括已删除）
curl http://localhost:3001/api/team/members/all
```

---

## 📱 在前端查看更改

管理系统所有的更改都会实时显示在前端网站上：

1. **成员** - 在"团队成员"部分显示
2. **成就** - 在"成就荣誉"部分显示
3. **战队信息** - 在"战队介绍"部分显示

刷新网页即可看到最新内容！

---

## ⚙️ 登出与返回

### 登出管理系统
- 点击右上角"退出登录"按钮

### 返回首页
- 点击右上角"← 返回首页"链接
- 或访问 `http://localhost:5173/`

---

## 🔐 安全建议

### 生产环境配置
1. **修改默认密码**
   - 编辑 `frontend/src/components/AdminPanel.jsx`
   - 修改 `ADMIN_PASSWORD` 常量
   
2. **启用 HTTPS**
   - 使用 SSL 证书保护登录页面

3. **添加真实认证**
   - 实现用户账户系统
   - 支持多账户权限管理

4. **定期备份**
   - 定期备份 SQLite 数据库 (`backend/data.db`)
   - 或定期导出 MongoDB 数据

---

## 💾 数据备份

### SQLite 备份
```bash
# 复制数据库文件
cp backend/data.db backend/data.db.backup
```

### MongoDB 备份
```bash
# 导出数据
mongodump --uri="mongodb+srv://user:pass@cluster.mongodb.net/yxor_team"

# 导入数据
mongorestore --uri="mongodb+srv://user:pass@cluster.mongodb.net/yxor_team" dump/
```

---

## ❓ 常见问题

### Q: 如何添加更多管理员？
A: 当前版本仅支持单个密码。未来版本可以实现多用户认证系统。

### Q: 删除的数据能恢复吗？
A: 软删除的数据可以通过 API 恢复。永久删除则无法恢复。

### Q: 如何修改密码？
A: 编辑 `frontend/src/components/AdminPanel.jsx` 中的 `ADMIN_PASSWORD`。

### Q: 能否导出数据？
A: 可以通过 API 获取所有数据，然后导出为 JSON/CSV。

---

## 📞 技术支持

如有问题，请查看：
- `backend/DATABASE.md` - 数据库配置
- `backend/API-REFERENCE.md` - API 文档
- `backend/FEATURES.md` - 功能列表

---

**版本**: 2.0.0  
**更新日期**: 2025-01-13  
**状态**: ✅ 生产就绪
