import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:3001/api';

export default function AdminAchievements() {
    const [achievements, setAchievements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [message, setMessage] = useState('');
    const [formData, setFormData] = useState({
        year: new Date().getFullYear(),
        title: '',
        award: '',
        description: '',
        location: ''
    });

    // 获取成就列表
    useEffect(() => {
        fetchAchievements();
    }, []);

    const fetchAchievements = async () => {
        try {
            const res = await axios.get(`${API_BASE}/team/achievements`);
            setAchievements(res.data.data || []);
            setLoading(false);
        } catch (error) {
            console.error('获取成就列表失败:', error);
            setMessage('❌ 获取成就列表失败');
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'year' ? parseInt(value) : value
        }));
    };

    const resetForm = () => {
        setFormData({
            year: new Date().getFullYear(),
            title: '',
            award: '',
            description: '',
            location: ''
        });
        setEditingId(null);
        setShowForm(false);
    };

    const handleAddAchievement = async (e) => {
        e.preventDefault();
        if (!formData.title || !formData.award) {
            setMessage('⚠️ 请填写成就名称和奖项');
            return;
        }

        try {
            if (editingId) {
                // 编辑模式
                await axios.put(`${API_BASE}/team/achievements/${editingId}`, formData);
                setMessage('✅ 成就已更新');
            } else {
                // 添加模式
                await axios.post(`${API_BASE}/team/achievements`, formData);
                setMessage('✅ 新成就已添加');
            }
            fetchAchievements();
            resetForm();
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage('❌ 操作失败: ' + error.message);
        }
    };

    const handleEditAchievement = (achievement) => {
        setFormData(achievement);
        setEditingId(achievement._id || achievement.id);
        setShowForm(true);
    };

    const handleDeleteAchievement = async (id) => {
        if (!confirm('确定要删除该成就吗？')) return;

        try {
            await axios.delete(`${API_BASE}/team/achievements/${id}`);
            setMessage('✅ 成就已删除');
            fetchAchievements();
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage('❌ 删除失败: ' + error.message);
        }
    };

    if (loading) {
        return <div className="text-center text-slate-400">加载中...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">🏆 成就管理</h2>
                {!showForm && (
                    <button
                        onClick={() => setShowForm(true)}
                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition"
                    >
                        + 添加新成就
                    </button>
                )}
            </div>

            {/* 状态消息 */}
            {message && (
                <div className={`p-3 rounded-lg ${message.includes('✅')
                        ? 'bg-green-900 text-green-200'
                        : 'bg-red-900 text-red-200'
                    }`}>
                    {message}
                </div>
            )}

            {/* 添加/编辑表单 */}
            {showForm && (
                <form onSubmit={handleAddAchievement} className="bg-slate-700 rounded-lg p-6 space-y-4">
                    <h3 className="text-lg font-bold text-white">
                        {editingId ? '编辑成就' : '添加新成就'}
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                年份
                            </label>
                            <input
                                type="number"
                                name="year"
                                value={formData.year}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-slate-600 text-white border border-slate-500 rounded-lg focus:outline-none focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                成就名称 *
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-slate-600 text-white border border-slate-500 rounded-lg focus:outline-none focus:border-blue-500"
                                placeholder="如: CTF全国总决赛"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                奖项 *
                            </label>
                            <input
                                type="text"
                                name="award"
                                value={formData.award}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-slate-600 text-white border border-slate-500 rounded-lg focus:outline-none focus:border-blue-500"
                                placeholder="如: 一等奖"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                地点/活动
                            </label>
                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-slate-600 text-white border border-slate-500 rounded-lg focus:outline-none focus:border-blue-500"
                                placeholder="如: 北京"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                详细描述
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="3"
                                className="w-full px-4 py-2 bg-slate-600 text-white border border-slate-500 rounded-lg focus:outline-none focus:border-blue-500"
                                placeholder="输入成就的详细描述..."
                            />
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition"
                        >
                            {editingId ? '✏️ 更新成就' : '➕ 添加成就'}
                        </button>
                        <button
                            type="button"
                            onClick={resetForm}
                            className="bg-slate-600 hover:bg-slate-500 text-white font-bold py-2 px-6 rounded-lg transition"
                        >
                            取消
                        </button>
                    </div>
                </form>
            )}

            {/* 成就列表 */}
            <div className="space-y-3">
                {achievements.map(achievement => (
                    <div key={achievement._id || achievement.id} className="bg-slate-700 rounded-lg p-4 border border-slate-600 hover:border-blue-500 transition">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-2xl">🏆</span>
                                    <h4 className="text-lg font-bold text-white">{achievement.title}</h4>
                                    <span className="text-sm font-medium text-yellow-400 bg-slate-600 px-2 py-1 rounded">
                                        {achievement.award}
                                    </span>
                                </div>
                                <p className="text-sm text-slate-400 mb-2">
                                    <span className="font-medium">年份:</span> {achievement.year}
                                </p>
                                {achievement.location && (
                                    <p className="text-sm text-slate-400 mb-2">
                                        <span className="font-medium">地点:</span> {achievement.location}
                                    </p>
                                )}
                                {achievement.description && (
                                    <p className="text-sm text-slate-300 mb-2">{achievement.description}</p>
                                )}
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleEditAchievement(achievement)}
                                    className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold py-2 px-3 rounded transition"
                                >
                                    ✏️
                                </button>
                                <button
                                    onClick={() => handleDeleteAchievement(achievement._id || achievement.id)}
                                    className="bg-red-600 hover:bg-red-700 text-white text-sm font-bold py-2 px-3 rounded transition"
                                >
                                    🗑️
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {achievements.length === 0 && !showForm && (
                <div className="text-center py-8 text-slate-400">
                    <p>暂无成就，点击"添加新成就"按钮创建</p>
                </div>
            )}
        </div>
    );
}
