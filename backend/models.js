import mongoose from 'mongoose';

// ==================== 数据库模式定义 ====================

// 战队信息Schema
const teamInfoSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        default: 'YXOR Team'
    },
    description: {
        type: String,
        default: 'YXOR是一支致力于网络安全研究和CTF竞赛的精英团队。'
    },
    founded: {
        type: String,
        default: '2020'
    },
    logo: {
        type: String,
        default: 'https://ui-avatars.com/api/?name=YXOR&background=0ea5e9'
    },
    contactEmail: {
        type: String,
        required: true,
        default: 'join@yxorteam.com'
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// 团队成员Schema
const teamMemberSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        default: ''
    },
    signature: {
        type: String,
        default: ''
    },
    blog: {
        type: String,
        default: ''
    },
    direction: {
        type: String,
        default: ''
    },
    joinDate: {
        type: Date,
        default: Date.now
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// 成就Schema
const achievementSchema = new mongoose.Schema({
    year: {
        type: Number,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    award: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ''
    },
    location: {
        type: String,
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// 申请记录Schema
const applicationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        default: ''
    },
    skills: {
        type: String,
        required: true
    },
    message: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        enum: ['pending', 'reviewed', 'approved', 'rejected'],
        default: 'pending'
    },
    submittedAt: {
        type: Date,
        default: Date.now
    },
    reviewedAt: {
        type: Date,
        default: null
    },
    reviewNotes: {
        type: String,
        default: ''
    }
});

// 创建模型
export const TeamInfo = mongoose.model('TeamInfo', teamInfoSchema);
export const TeamMember = mongoose.model('TeamMember', teamMemberSchema);
export const Achievement = mongoose.model('Achievement', achievementSchema);
export const Application = mongoose.model('Application', applicationSchema);
