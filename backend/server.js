import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// 中间件
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());

// ==================== 模拟数据库 ====================

// 战队信息
const teamInfo = {
    name: 'YXOR Team',
    description: 'YXOR是一支致力于网络安全研究和CTF竞赛的精英团队。我们专注于漏洞发现、渗透测试和安全防御领域。',
    founded: '2020',
    achievements: [
        { year: 2024, title: '全国高校CTF联赛冠军', award: 'Champion' },
        { year: 2023, title: 'DEF CON CTF 全球前16强', award: 'Top 16' },
        { year: 2023, title: '中国CTF联赛一等奖', award: 'First Prize' },
        { year: 2022, title: 'HITB CTF 最佳创意解题', award: 'Best Innovation' }
    ],
    contactEmail: 'join@yxorteam.com'
};

// 团队成员
const teamMembers = [
    {
        id: 1,
        name: '张三',
        role: 'Web安全',
        avatar: 'https://ui-avatars.com/api/?name=张三&background=0D8ABC&color=fff&bold=true',
        signature: '找到漏洞的人，才是真正的艺术家',
        blog: 'https://example.com/blog1',
        direction: 'Web安全研究，PHP/Python漏洞挖掘'
    },
    {
        id: 2,
        name: '李四',
        role: '二进制安全',
        avatar: 'https://ui-avatars.com/api/?name=李四&background=F37335&color=fff&bold=true',
        signature: '逆向工程是理解世界的另一种方式',
        blog: 'https://example.com/blog2',
        direction: 'Reverse Engineering，PWN题解'
    },
    {
        id: 3,
        name: '王五',
        role: '密码学',
        avatar: 'https://ui-avatars.com/api/?name=王五&background=2196F3&color=fff&bold=true',
        signature: '用数学破解世界上最复杂的谜题',
        blog: 'https://example.com/blog3',
        direction: '密码分析，数论与离散数学'
    },
    {
        id: 4,
        name: '赵六',
        role: 'Misc',
        avatar: 'https://ui-avatars.com/api/?name=赵六&background=4CAF50&color=fff&bold=true',
        signature: '信息隐藏，艺术与科学的完美结合',
        blog: 'https://example.com/blog4',
        direction: '隐写分析，取证技术'
    },
    {
        id: 5,
        name: '孙七',
        role: '系统安全',
        avatar: 'https://ui-avatars.com/api/?name=孙七&background=FF9800&color=fff&bold=true',
        signature: '每一个系统都有它的弱点',
        blog: 'https://example.com/blog5',
        direction: 'Linux内核研究，系统漏洞利用'
    }
];

// ==================== API 路由 ====================

// 获取战队信息
app.get('/api/team/info', (req, res) => {
    res.json(teamInfo);
});

// 获取所有团队成员
app.get('/api/team/members', (req, res) => {
    res.json(teamMembers);
});

// 获取单个团队成员
app.get('/api/team/members/:id', (req, res) => {
    const member = teamMembers.find(m => m.id === parseInt(req.params.id));
    if (!member) {
        return res.status(404).json({ error: '成员不存在' });
    }
    res.json(member);
});

// 获取战队成就
app.get('/api/team/achievements', (req, res) => {
    res.json(teamInfo.achievements);
});

// 申请入队（模拟）
app.post('/api/team/apply', (req, res) => {
    const { name, email, phone, skills, message } = req.body;

    // 基本验证
    if (!name || !email || !skills) {
        return res.status(400).json({ error: '请填写必要信息' });
    }

    // 这里可以保存到数据库或发送邮件
    console.log('新的入队申请:', { name, email, phone, skills, message });

    res.json({
        success: true,
        message: '感谢你的申请！我们会尽快与你联系。',
        timestamp: new Date().toISOString()
    });
});

// 健康检查
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 错误处理中间件
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: '服务器内部错误',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`✅ YXOR Team后端服务运行在 http://localhost:${PORT}`);
    console.log(`📝 API文档: http://localhost:${PORT}/api`);
});
