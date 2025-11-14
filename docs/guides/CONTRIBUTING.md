# 贡献指南

感谢你对 YXOR Team 项目的关注！我们欢迎任何形式的贡献。

## 如何贡献

### 报告问题

遇到 Bug？请提交一个 Issue，包含：
- 详细的问题描述
- 复现步骤
- 预期行为 vs 实际行为
- 环境信息（浏览器、Node.js 版本等）

### 提交代码

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 打开 Pull Request

### 改进文档

- 修复拼写错误或不清楚的说明
- 添加代码示例
- 改进 API 文档

## 代码规范

### JavaScript/React
- 使用 2 空格缩进
- 使用 ES6+ 语法
- 遵循 ESLint 规则
- 添加必要的注释

### 提交信息规范
```
type(scope): subject

body

footer
```

类型（type）:
- feat: 新功能
- fix: 修复
- docs: 文档
- style: 样式修改
- refactor: 代码重构
- test: 添加测试
- chore: 构建、依赖等

示例：
```
feat(members): add member filtering by role

Add ability to filter team members by their role/direction.

Closes #123
```

## 开发工作流

1. **克隆项目**
   ```bash
   git clone <repo-url>
   cd yxor
   ```

2. **安装依赖**
   ```bash
   ./install.sh
   ```

3. **创建功能分支**
   ```bash
   git checkout -b feature/your-feature
   ```

4. **开发测试**
   ```bash
   ./start.sh
   ```

5. **提交更改**
   ```bash
   git add .
   git commit -m "feat: add your feature"
   git push origin feature/your-feature
   ```

## 优先级

当前优先处理的工作：
- [ ] 数据库集成
- [ ] 成员申请邮件通知
- [ ] 更多成就展示方式
- [ ] 国际化支持
- [ ] 移动端响应优化

## 问题咨询

- 📧 Email: join@yxorteam.com
- 💬 Discussions: GitHub Discussions

感谢你的贡献！ ❤️
