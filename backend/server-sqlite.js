import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, 'data.db');

// ==================== 中间件 ====================

app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// ==================== 数据库初始化 ====================

const db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
        console.error('❌ 数据库连接失败:', err.message);
        process.exit(1);
    }
    console.log('✅ SQLite 数据库已连接');
    initializeTables();
});

function initializeTables() {
    db.serialize(() => {
        // 战队信息表
        db.run(`
      CREATE TABLE IF NOT EXISTS team_info (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT DEFAULT 'YXOR Team',
        description TEXT,
        founded TEXT,
        logo TEXT,
        tagline TEXT,
        contact_email TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

        // 团队成员表
        db.run(`
      CREATE TABLE IF NOT EXISTS team_members (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        role TEXT NOT NULL,
        avatar TEXT,
        signature TEXT,
        blog TEXT,
        direction TEXT,
        is_active BOOLEAN DEFAULT 1,
        join_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

        // 成就表
        db.run(`
      CREATE TABLE IF NOT EXISTS achievements (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        year INTEGER NOT NULL,
        title TEXT NOT NULL,
        award TEXT NOT NULL,
        description TEXT,
        location TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

        // 申请表
        db.run(`
      CREATE TABLE IF NOT EXISTS applications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT,
        skills TEXT NOT NULL,
        message TEXT,
        status TEXT DEFAULT 'pending',
        review_notes TEXT,
        submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        reviewed_at DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

        console.log('📊 数据库表已初始化');
    });
}

// ==================== 工具函数 ====================

function runAsync(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.run(sql, params, (err) => {
            if (err) reject(err);
            else resolve();
        });
    });
}

function getAsync(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
}

function allAsync(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows || []);
        });
    });
}

// ==================== 战队信息 API ====================

app.get('/api/team/info', async (req, res) => {
    try {
        let info = await getAsync('SELECT * FROM team_info LIMIT 1');
        if (!info) {
            await runAsync(
                'INSERT INTO team_info (name, description, founded, contact_email, tagline) VALUES (?, ?, ?, ?, ?)',
                ['YXOR Team', 'YXOR是一支致力于网络安全研究和CTF竞赛的精英团队。', '2020', 'join@yxorteam.com', '网络安全精英团队 · CTF竞赛专家']
            );
            info = await getAsync('SELECT * FROM team_info LIMIT 1');
        }
        // 将下划线字段转换为驼峰命名
        const formattedInfo = {
            ...info,
            contactEmail: info.contact_email,
            founded: info.founded,
            tagline: info.tagline
        };
        res.json({ data: formattedInfo });
    } catch (error) {
        res.status(500).json({ error: '获取战队信息失败', details: error.message });
    }
});

app.put('/api/team/info', async (req, res) => {
    try {
        const { name, description, founded, contactEmail, logo, tagline } = req.body;

        const updates = [];
        const values = [];

        if (name) {
            updates.push('name = ?');
            values.push(name);
        }
        if (description) {
            updates.push('description = ?');
            values.push(description);
        }
        if (founded) {
            updates.push('founded = ?');
            values.push(founded);
        }
        if (contactEmail) {
            updates.push('contact_email = ?');
            values.push(contactEmail);
        }
        if (logo) {
            updates.push('logo = ?');
            values.push(logo);
        }
        if (tagline) {
            updates.push('tagline = ?');
            values.push(tagline);
        }

        updates.push('updated_at = CURRENT_TIMESTAMP');

        if (updates.length > 1) {
            await runAsync(
                `UPDATE team_info SET ${updates.join(', ')} WHERE id = 1`,
                values
            );
        }

        const info = await getAsync('SELECT * FROM team_info WHERE id = 1');
        res.json({ message: '战队信息已更新', data: info });
    } catch (error) {
        res.status(500).json({ error: '更新战队信息失败', details: error.message });
    }
});

// ==================== 团队成员 API ====================

app.get('/api/team/members', async (req, res) => {
    try {
        const members = await allAsync(
            'SELECT * FROM team_members ORDER BY join_date DESC'
        );
        res.json({ data: members });
    } catch (error) {
        res.status(500).json({ error: '获取成员列表失败', details: error.message });
    }
});

app.get('/api/team/members/all', async (req, res) => {
    try {
        const members = await allAsync(
            'SELECT * FROM team_members ORDER BY join_date DESC'
        );
        res.json({ data: members });
    } catch (error) {
        res.status(500).json({ error: '获取成员列表失败', details: error.message });
    }
});

app.get('/api/team/members/:id', async (req, res) => {
    try {
        const member = await getAsync('SELECT * FROM team_members WHERE id = ?', [req.params.id]);
        if (!member) {
            return res.status(404).json({ error: '成员不存在' });
        }
        res.json({ data: member });
    } catch (error) {
        res.status(500).json({ error: '获取成员失败', details: error.message });
    }
});

app.post('/api/team/members', async (req, res) => {
    try {
        const { name, role, avatar, signature, blog, direction } = req.body;

        if (!name || !role) {
            return res.status(400).json({ error: '缺少必要字段：name, role' });
        }

        await runAsync(
            `INSERT INTO team_members (name, role, avatar, signature, blog, direction)
       VALUES (?, ?, ?, ?, ?, ?)`,
            [name, role, avatar || '', signature || '', blog || '', direction || '']
        );

        const member = await getAsync(
            'SELECT * FROM team_members ORDER BY id DESC LIMIT 1'
        );

        res.status(201).json({ message: '成员添加成功', data: member });
    } catch (error) {
        res.status(500).json({ error: '添加成员失败', details: error.message });
    }
});

app.put('/api/team/members/:id', async (req, res) => {
    try {
        const { name, role, avatar, signature, blog, direction, is_active } = req.body;

        const updates = [];
        const values = [];

        if (name) {
            updates.push('name = ?');
            values.push(name);
        }
        if (role) {
            updates.push('role = ?');
            values.push(role);
        }
        if (avatar !== undefined) {
            updates.push('avatar = ?');
            values.push(avatar);
        }
        if (signature !== undefined) {
            updates.push('signature = ?');
            values.push(signature);
        }
        if (blog !== undefined) {
            updates.push('blog = ?');
            values.push(blog);
        }
        if (direction !== undefined) {
            updates.push('direction = ?');
            values.push(direction);
        }
        if (is_active !== undefined) {
            updates.push('is_active = ?');
            values.push(is_active ? 1 : 0);
        }

        if (updates.length > 0) {
            updates.push('updated_at = CURRENT_TIMESTAMP');
            values.push(req.params.id);

            await runAsync(
                `UPDATE team_members SET ${updates.join(', ')} WHERE id = ?`,
                values
            );
        }

        const member = await getAsync('SELECT * FROM team_members WHERE id = ?', [req.params.id]);
        res.json({ message: '成员更新成功', data: member });
    } catch (error) {
        res.status(500).json({ error: '更新成员失败', details: error.message });
    }
});

app.delete('/api/team/members/:id', async (req, res) => {
    try {
        const member = await getAsync('SELECT * FROM team_members WHERE id = ?', [req.params.id]);
        if (!member) {
            return res.status(404).json({ error: '成员不存在' });
        }

        await runAsync('DELETE FROM team_members WHERE id = ?', [req.params.id]);

        res.json({ message: '成员已删除', data: member });
    } catch (error) {
        res.status(500).json({ error: '删除成员失败', details: error.message });
    }
});

app.delete('/api/team/members/:id/permanent', async (req, res) => {
    try {
        const member = await getAsync('SELECT * FROM team_members WHERE id = ?', [req.params.id]);
        if (!member) {
            return res.status(404).json({ error: '成员不存在' });
        }

        await runAsync('DELETE FROM team_members WHERE id = ?', [req.params.id]);

        res.json({ message: '成员已永久删除', data: member });
    } catch (error) {
        res.status(500).json({ error: '永久删除成员失败', details: error.message });
    }
});

// ==================== 成就 API ====================

app.get('/api/team/achievements', async (req, res) => {
    try {
        const achievements = await allAsync(
            'SELECT * FROM achievements ORDER BY year DESC'
        );
        res.json({ data: achievements });
    } catch (error) {
        res.status(500).json({ error: '获取成就列表失败', details: error.message });
    }
});

app.get('/api/team/achievements/:id', async (req, res) => {
    try {
        const achievement = await getAsync('SELECT * FROM achievements WHERE id = ?', [req.params.id]);
        if (!achievement) {
            return res.status(404).json({ error: '成就不存在' });
        }
        res.json({ data: achievement });
    } catch (error) {
        res.status(500).json({ error: '获取成就失败', details: error.message });
    }
});

app.post('/api/team/achievements', async (req, res) => {
    try {
        const { year, title, award, description, location } = req.body;

        if (!year || !title || !award) {
            return res.status(400).json({ error: '缺少必要字段：year, title, award' });
        }

        await runAsync(
            `INSERT INTO achievements (year, title, award, description, location)
       VALUES (?, ?, ?, ?, ?)`,
            [year, title, award, description || '', location || '']
        );

        const achievement = await getAsync(
            'SELECT * FROM achievements ORDER BY id DESC LIMIT 1'
        );

        res.status(201).json({ message: '成就添加成功', data: achievement });
    } catch (error) {
        res.status(500).json({ error: '添加成就失败', details: error.message });
    }
});

app.put('/api/team/achievements/:id', async (req, res) => {
    try {
        const { year, title, award, description, location } = req.body;

        const updates = [];
        const values = [];

        if (year !== undefined) {
            updates.push('year = ?');
            values.push(year);
        }
        if (title) {
            updates.push('title = ?');
            values.push(title);
        }
        if (award) {
            updates.push('award = ?');
            values.push(award);
        }
        if (description !== undefined) {
            updates.push('description = ?');
            values.push(description);
        }
        if (location !== undefined) {
            updates.push('location = ?');
            values.push(location);
        }

        if (updates.length > 0) {
            updates.push('updated_at = CURRENT_TIMESTAMP');
            values.push(req.params.id);

            await runAsync(
                `UPDATE achievements SET ${updates.join(', ')} WHERE id = ?`,
                values
            );
        }

        const achievement = await getAsync('SELECT * FROM achievements WHERE id = ?', [req.params.id]);
        res.json({ message: '成就更新成功', data: achievement });
    } catch (error) {
        res.status(500).json({ error: '更新成就失败', details: error.message });
    }
});

app.delete('/api/team/achievements/:id', async (req, res) => {
    try {
        const achievement = await getAsync('SELECT * FROM achievements WHERE id = ?', [req.params.id]);
        if (!achievement) {
            return res.status(404).json({ error: '成就不存在' });
        }

        await runAsync('DELETE FROM achievements WHERE id = ?', [req.params.id]);

        res.json({ message: '成就已删除', data: achievement });
    } catch (error) {
        res.status(500).json({ error: '删除成就失败', details: error.message });
    }
});

// ==================== 申请 API ====================

app.get('/api/team/applications', async (req, res) => {
    try {
        const status = req.query.status;
        const sql = status
            ? 'SELECT * FROM applications WHERE status = ? ORDER BY submitted_at DESC'
            : 'SELECT * FROM applications ORDER BY submitted_at DESC';
        const params = status ? [status] : [];

        const applications = await allAsync(sql, params);
        res.json({ data: applications });
    } catch (error) {
        res.status(500).json({ error: '获取申请列表失败', details: error.message });
    }
});

app.get('/api/team/applications/:id', async (req, res) => {
    try {
        const application = await getAsync('SELECT * FROM applications WHERE id = ?', [req.params.id]);
        if (!application) {
            return res.status(404).json({ error: '申请不存在' });
        }
        res.json(application);
    } catch (error) {
        res.status(500).json({ error: '获取申请失败', details: error.message });
    }
});

app.post('/api/team/apply', async (req, res) => {
    try {
        const { name, email, phone, skills, message } = req.body;

        if (!name || !email || !skills) {
            return res.status(400).json({ error: '请填写必要信息' });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: '邮箱格式不正确' });
        }

        await runAsync(
            `INSERT INTO applications (name, email, phone, skills, message)
       VALUES (?, ?, ?, ?, ?)`,
            [name, email, phone || '', skills, message || '']
        );

        res.status(201).json({
            success: true,
            message: '感谢你的申请！我们会尽快与你联系。',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({ error: '提交申请失败', details: error.message });
    }
});

app.patch('/api/team/applications/:id/status', async (req, res) => {
    try {
        const { status, review_notes } = req.body;

        if (!status) {
            return res.status(400).json({ error: '缺少状态字段' });
        }

        const validStatuses = ['pending', 'reviewed', 'approved', 'rejected'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: '无效的状态值' });
        }

        let sql = 'UPDATE applications SET status = ?, reviewed_at = CURRENT_TIMESTAMP';
        const params = [status];

        if (review_notes) {
            sql += ', review_notes = ?';
            params.push(review_notes);
        }

        sql += ' WHERE id = ?';
        params.push(req.params.id);

        await runAsync(sql, params);

        const application = await getAsync('SELECT * FROM applications WHERE id = ?', [req.params.id]);
        res.json({ message: '申请状态已更新', data: application });
    } catch (error) {
        res.status(500).json({ error: '更新申请失败', details: error.message });
    }
});

app.delete('/api/team/applications/:id', async (req, res) => {
    try {
        const application = await getAsync('SELECT * FROM applications WHERE id = ?', [req.params.id]);
        if (!application) {
            return res.status(404).json({ error: '申请不存在' });
        }

        await runAsync('DELETE FROM applications WHERE id = ?', [req.params.id]);

        res.json({ message: '申请已删除', data: application });
    } catch (error) {
        res.status(500).json({ error: '删除申请失败', details: error.message });
    }
});

// ==================== 统计和健康检查 ====================

app.get('/api/stats', async (req, res) => {
    try {
        const [
            { count: memberCount } = { count: 0 },
            { count: achievementCount } = { count: 0 },
            { count: applicationCount } = { count: 0 },
            { count: pendingCount } = { count: 0 }
        ] = await Promise.all([
            getAsync('SELECT COUNT(*) as count FROM team_members WHERE is_active = 1'),
            getAsync('SELECT COUNT(*) as count FROM achievements'),
            getAsync('SELECT COUNT(*) as count FROM applications'),
            getAsync('SELECT COUNT(*) as count FROM applications WHERE status = "pending"')
        ]);

        res.json({
            members: memberCount,
            achievements: achievementCount,
            applications: applicationCount,
            pendingApplications: pendingCount
        });
    } catch (error) {
        res.status(500).json({ error: '获取统计信息失败', details: error.message });
    }
});

app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        database: 'sqlite3',
        timestamp: new Date().toISOString()
    });
});

app.get('/api', (req, res) => {
    res.json({
        name: 'YXOR Team API',
        version: '1.0.0',
        description: 'CTF战队展示网站后端API',
        database: 'SQLite3 (无需外部依赖)',
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

app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════════════════════════════╗
║                                                                    ║
║     ✅ YXOR Team 后端服务已启动 (SQLite3)                        ║
║                                                                    ║
║     🌐 服务地址: http://localhost:${PORT}                           ║
║     📖 API文档: http://localhost:${PORT}/api                       ║
║     ❤️  健康检查: http://localhost:${PORT}/api/health             ║
║                                                                    ║
║     💾 数据库: SQLite3 (${DB_PATH})  ║
║                                                                    ║
╚════════════════════════════════════════════════════════════════════╝
  `);
});

export default app;
