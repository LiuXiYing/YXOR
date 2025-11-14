import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { TeamInfo, TeamMember, Achievement, Application } from './models.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/yxor_team';

// ==================== 中间件 ====================

app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 错误处理中间件
app.use((err, req, res, next) => {
    console.error('❌ 错误:', err.message);
    res.status(err.status || 500).json({
        error: '服务器内部错误',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// ==================== 数据库连接 ====================

async function connectDatabase() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ MongoDB 连接成功');
    } catch (error) {
        console.error('❌ MongoDB 连接失败:', error.message);
        process.exit(1);
    }
}

// ==================== 战队信息 API ====================

// 获取战队信息
app.get('/api/team/info', async (req, res) => {
    try {
        let teamInfo = await TeamInfo.findOne();
        if (!teamInfo) {
            // 如果不存在，创建默认的
            teamInfo = await TeamInfo.create({
                name: 'YXOR Team',
                description: 'YXOR是一支致力于网络安全研究和CTF竞赛的精英团队。',
                founded: '2020',
                contactEmail: 'join@yxorteam.com'
            });
        }
        res.json(teamInfo);
    } catch (error) {
        res.status(500).json({ error: '获取战队信息失败' });
    }
});

// 更新战队信息
app.put('/api/team/info', async (req, res) => {
    try {
        const { name, description, founded, contactEmail, logo } = req.body;

        let teamInfo = await TeamInfo.findOne();
        if (!teamInfo) {
            teamInfo = new TeamInfo();
        }

        if (name) teamInfo.name = name;
        if (description) teamInfo.description = description;
        if (founded) teamInfo.founded = founded;
        if (contactEmail) teamInfo.contactEmail = contactEmail;
        if (logo) teamInfo.logo = logo;
        teamInfo.updatedAt = Date.now();

        await teamInfo.save();
        res.json({ message: '战队信息更新成功', data: teamInfo });
    } catch (error) {
        res.status(500).json({ error: '更新战队信息失败', details: error.message });
    }
});

// ==================== 团队成员 API ====================

// 获取所有成员
app.get('/api/team/members', async (req, res) => {
    try {
        const members = await TeamMember.find({ isActive: true }).sort({ joinDate: -1 });
        res.json(members);
    } catch (error) {
        res.status(500).json({ error: '获取成员列表失败' });
    }
});

// 获取所有成员（包括非活跃）- 管理员
app.get('/api/team/members/all', async (req, res) => {
    try {
        const members = await TeamMember.find().sort({ joinDate: -1 });
        res.json(members);
    } catch (error) {
        res.status(500).json({ error: '获取成员列表失败' });
    }
});

// 获取单个成员
app.get('/api/team/members/:id', async (req, res) => {
    try {
        const member = await TeamMember.findById(req.params.id);
        if (!member) {
            return res.status(404).json({ error: '成员不存在' });
        }
        res.json(member);
    } catch (error) {
        res.status(500).json({ error: '获取成员信息失败' });
    }
});

// 创建成员
app.post('/api/team/members', async (req, res) => {
    try {
        const { name, role, avatar, signature, blog, direction } = req.body;

        if (!name || !role) {
            return res.status(400).json({ error: '缺少必要字段：name, role' });
        }

        const member = await TeamMember.create({
            name,
            role,
            avatar: avatar || '',
            signature: signature || '',
            blog: blog || '',
            direction: direction || ''
        });

        res.status(201).json({ message: '成员添加成功', data: member });
    } catch (error) {
        res.status(500).json({ error: '添加成员失败', details: error.message });
    }
});

// 更新成员信息
app.put('/api/team/members/:id', async (req, res) => {
    try {
        const { name, role, avatar, signature, blog, direction, isActive } = req.body;

        let member = await TeamMember.findById(req.params.id);
        if (!member) {
            return res.status(404).json({ error: '成员不存在' });
        }

        if (name) member.name = name;
        if (role) member.role = role;
        if (avatar !== undefined) member.avatar = avatar;
        if (signature !== undefined) member.signature = signature;
        if (blog !== undefined) member.blog = blog;
        if (direction !== undefined) member.direction = direction;
        if (isActive !== undefined) member.isActive = isActive;
        member.updatedAt = Date.now();

        await member.save();
        res.json({ message: '成员信息更新成功', data: member });
    } catch (error) {
        res.status(500).json({ error: '更新成员失败', details: error.message });
    }
});

// 删除成员（软删除）
app.delete('/api/team/members/:id', async (req, res) => {
    try {
        const member = await TeamMember.findByIdAndUpdate(
            req.params.id,
            { isActive: false, updatedAt: Date.now() },
            { new: true }
        );

        if (!member) {
            return res.status(404).json({ error: '成员不存在' });
        }

        res.json({ message: '成员已删除', data: member });
    } catch (error) {
        res.status(500).json({ error: '删除成员失败', details: error.message });
    }
});

// 永久删除成员
app.delete('/api/team/members/:id/permanent', async (req, res) => {
    try {
        const member = await TeamMember.findByIdAndDelete(req.params.id);

        if (!member) {
            return res.status(404).json({ error: '成员不存在' });
        }

        res.json({ message: '成员已永久删除', data: member });
    } catch (error) {
        res.status(500).json({ error: '永久删除成员失败', details: error.message });
    }
});

// ==================== 成就 API ====================

// 获取所有成就
app.get('/api/team/achievements', async (req, res) => {
    try {
        const achievements = await Achievement.find().sort({ year: -1 });
        res.json(achievements);
    } catch (error) {
        res.status(500).json({ error: '获取成就列表失败' });
    }
});

// 获取单个成就
app.get('/api/team/achievements/:id', async (req, res) => {
    try {
        const achievement = await Achievement.findById(req.params.id);
        if (!achievement) {
            return res.status(404).json({ error: '成就不存在' });
        }
        res.json(achievement);
    } catch (error) {
        res.status(500).json({ error: '获取成就失败' });
    }
});

// 创建成就
app.post('/api/team/achievements', async (req, res) => {
    try {
        const { year, title, award, description, location } = req.body;

        if (!year || !title || !award) {
            return res.status(400).json({ error: '缺少必要字段：year, title, award' });
        }

        const achievement = await Achievement.create({
            year,
            title,
            award,
            description: description || '',
            location: location || ''
        });

        res.status(201).json({ message: '成就添加成功', data: achievement });
    } catch (error) {
        res.status(500).json({ error: '添加成就失败', details: error.message });
    }
});

// 更新成就
app.put('/api/team/achievements/:id', async (req, res) => {
    try {
        const { year, title, award, description, location } = req.body;

        let achievement = await Achievement.findById(req.params.id);
        if (!achievement) {
            return res.status(404).json({ error: '成就不存在' });
        }

        if (year !== undefined) achievement.year = year;
        if (title) achievement.title = title;
        if (award) achievement.award = award;
        if (description !== undefined) achievement.description = description;
        if (location !== undefined) achievement.location = location;
        achievement.updatedAt = Date.now();

        await achievement.save();
        res.json({ message: '成就更新成功', data: achievement });
    } catch (error) {
        res.status(500).json({ error: '更新成就失败', details: error.message });
    }
});

// 删除成就
app.delete('/api/team/achievements/:id', async (req, res) => {
    try {
        const achievement = await Achievement.findByIdAndDelete(req.params.id);

        if (!achievement) {
            return res.status(404).json({ error: '成就不存在' });
        }

        res.json({ message: '成就已删除', data: achievement });
    } catch (error) {
        res.status(500).json({ error: '删除成就失败', details: error.message });
    }
});

// ==================== 申请 API ====================

// 获取所有申请
app.get('/api/team/applications', async (req, res) => {
    try {
        const status = req.query.status;
        const query = status ? { status } : {};
        const applications = await Application.find(query).sort({ submittedAt: -1 });
        res.json(applications);
    } catch (error) {
        res.status(500).json({ error: '获取申请列表失败' });
    }
});

// 获取单个申请
app.get('/api/team/applications/:id', async (req, res) => {
    try {
        const application = await Application.findById(req.params.id);
        if (!application) {
            return res.status(404).json({ error: '申请不存在' });
        }
        res.json(application);
    } catch (error) {
        res.status(500).json({ error: '获取申请失败' });
    }
});

// 提交申请
app.post('/api/team/apply', async (req, res) => {
    try {
        const { name, email, phone, skills, message } = req.body;

        if (!name || !email || !skills) {
            return res.status(400).json({ error: '请填写必要信息' });
        }

        // 验证邮箱格式
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: '邮箱格式不正确' });
        }

        const application = await Application.create({
            name,
            email,
            phone: phone || '',
            skills,
            message: message || ''
        });

        res.status(201).json({
            success: true,
            message: '感谢你的申请！我们会尽快与你联系。',
            data: application,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({ error: '提交申请失败', details: error.message });
    }
});

// 更新申请状态
app.patch('/api/team/applications/:id/status', async (req, res) => {
    try {
        const { status, reviewNotes } = req.body;

        if (!status) {
            return res.status(400).json({ error: '缺少状态字段' });
        }

        const validStatuses = ['pending', 'reviewed', 'approved', 'rejected'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: '无效的状态值' });
        }

        let application = await Application.findById(req.params.id);
        if (!application) {
            return res.status(404).json({ error: '申请不存在' });
        }

        application.status = status;
        if (reviewNotes) application.reviewNotes = reviewNotes;
        application.reviewedAt = Date.now();

        await application.save();
        res.json({ message: '申请状态已更新', data: application });
    } catch (error) {
        res.status(500).json({ error: '更新申请失败', details: error.message });
    }
});

// 删除申请
app.delete('/api/team/applications/:id', async (req, res) => {
    try {
        const application = await Application.findByIdAndDelete(req.params.id);

        if (!application) {
            return res.status(404).json({ error: '申请不存在' });
        }

        res.json({ message: '申请已删除', data: application });
    } catch (error) {
        res.status(500).json({ error: '删除申请失败', details: error.message });
    }
});

// ==================== 统计和健康检查 ====================

// 获取统计信息
app.get('/api/stats', async (req, res) => {
    try {
        const memberCount = await TeamMember.countDocuments({ isActive: true });
        const achievementCount = await Achievement.countDocuments();
        const applicationCount = await Application.countDocuments();
        const pendingApplications = await Application.countDocuments({ status: 'pending' });

        res.json({
            members: memberCount,
            achievements: achievementCount,
            applications: applicationCount,
            pendingApplications: pendingApplications
        });
    } catch (error) {
        res.status(500).json({ error: '获取统计信息失败' });
    }
});

// 健康检查
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    });
});

// 首页API文档
app.get('/api', (req, res) => {
    res.json({
        name: 'YXOR Team API',
        version: '1.0.0',
        description: 'CTF战队展示网站后端API',
        endpoints: {
            teamInfo: {
                get: '/api/team/info',
                put: '/api/team/info'
            },
            members: {
                getAll: '/api/team/members',
                getOne: '/api/team/members/:id',
                post: '/api/team/members',
                put: '/api/team/members/:id',
                delete: '/api/team/members/:id',
                permanentDelete: '/api/team/members/:id/permanent'
            },
            achievements: {
                getAll: '/api/team/achievements',
                getOne: '/api/team/achievements/:id',
                post: '/api/team/achievements',
                put: '/api/team/achievements/:id',
                delete: '/api/team/achievements/:id'
            },
            applications: {
                getAll: '/api/team/applications',
                getOne: '/api/team/applications/:id',
                post: '/api/team/apply',
                patch: '/api/team/applications/:id/status',
                delete: '/api/team/applications/:id'
            },
            stats: '/api/stats',
            health: '/api/health'
        }
    });
});

// ==================== 启动服务器 ====================

async function startServer() {
    try {
        await connectDatabase();

        app.listen(PORT, () => {
            console.log(`
╔════════════════════════════════════════════════════════════════════╗
║                                                                    ║
║     ✅ YXOR Team 后端服务已启动                                  ║
║                                                                    ║
║     🌐 服务地址: http://localhost:${PORT}                           ║
║     📖 API文档: http://localhost:${PORT}/api                       ║
║     ❤️  健康检查: http://localhost:${PORT}/api/health             ║
║                                                                    ║
║     数据库: MongoDB (${MONGODB_URI})        ║
║                                                                    ║
╚════════════════════════════════════════════════════════════════════╝
      `);
        });
    } catch (error) {
        console.error('❌ 启动失败:', error);
        process.exit(1);
    }
}

startServer();

export default app;
