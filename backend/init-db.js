// 数据库初始化脚本 - 导入示例数据

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { TeamInfo, TeamMember, Achievement } from './models.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/yxor_team';

// 初始化数据
const initialTeamInfo = {
    name: 'YXOR Team',
    description: 'YXOR是一支致力于网络安全研究和CTF竞赛的精英团队。我们专注于漏洞发现、渗透测试和安全防御领域。',
    founded: '2020',
    contactEmail: 'join@yxorteam.com'
};

const initialMembers = [
    {
        name: '张三',
        role: 'Web安全',
        avatar: 'https://ui-avatars.com/api/?name=张三&background=0D8ABC&color=fff&bold=true',
        signature: '找到漏洞的人，才是真正的艺术家',
        blog: 'https://example.com/blog1',
        direction: 'Web安全研究，PHP/Python漏洞挖掘'
    },
    {
        name: '李四',
        role: '二进制安全',
        avatar: 'https://ui-avatars.com/api/?name=李四&background=F37335&color=fff&bold=true',
        signature: '逆向工程是理解世界的另一种方式',
        blog: 'https://example.com/blog2',
        direction: 'Reverse Engineering，PWN题解'
    },
    {
        name: '王五',
        role: '密码学',
        avatar: 'https://ui-avatars.com/api/?name=王五&background=2196F3&color=fff&bold=true',
        signature: '用数学破解世界上最复杂的谜题',
        blog: 'https://example.com/blog3',
        direction: '密码分析，数论与离散数学'
    },
    {
        name: '赵六',
        role: 'Misc',
        avatar: 'https://ui-avatars.com/api/?name=赵六&background=4CAF50&color=fff&bold=true',
        signature: '信息隐藏，艺术与科学的完美结合',
        blog: 'https://example.com/blog4',
        direction: '隐写分析，取证技术'
    },
    {
        name: '孙七',
        role: '系统安全',
        avatar: 'https://ui-avatars.com/api/?name=孙七&background=FF9800&color=fff&bold=true',
        signature: '每一个系统都有它的弱点',
        blog: 'https://example.com/blog5',
        direction: 'Linux内核研究，系统漏洞利用'
    }
];

const initialAchievements = [
    { year: 2024, title: '全国高校CTF联赛冠军', award: 'Champion', description: '在全国高校CTF联赛中获得第一名' },
    { year: 2023, title: 'DEF CON CTF 全球前16强', award: 'Top 16', description: '参加全球顶级安全竞赛' },
    { year: 2023, title: '中国CTF联赛一等奖', award: 'First Prize', description: '国内CTF竞赛最高荣誉' },
    { year: 2022, title: 'HITB CTF 最佳创意解题', award: 'Best Innovation', description: '展现创新的解题思路' }
];

async function initializeDatabase() {
    try {
        console.log('🔄 连接MongoDB数据库...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ MongoDB连接成功');

        // 清空现有数据
        console.log('🗑️  清空现有数据...');
        await TeamInfo.deleteMany({});
        await TeamMember.deleteMany({});
        await Achievement.deleteMany({});

        // 导入初始数据
        console.log('📥 导入战队信息...');
        await TeamInfo.create(initialTeamInfo);

        console.log('📥 导入团队成员...');
        await TeamMember.insertMany(initialMembers);

        console.log('📥 导入成就记录...');
        await Achievement.insertMany(initialAchievements);

        console.log('✅ 数据库初始化完成！');
        console.log(`
  ╔═══════════════════════════════════════╗
  ║     数据库初始化成功！              ║
  ╠═══════════════════════════════════════╣
  ║ 战队信息: 1条                      ║
  ║ 团队成员: ${initialMembers.length}条                      ║
  ║ 成就记录: ${initialAchievements.length}条                      ║
  ╚═══════════════════════════════════════╝
    `);

        process.exit(0);
    } catch (error) {
        console.error('❌ 初始化失败:', error.message);
        process.exit(1);
    }
}

initializeDatabase();
