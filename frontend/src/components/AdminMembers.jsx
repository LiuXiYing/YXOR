import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:3001/api';

export default function AdminMembers() {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [message, setMessage] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        role: '',
        avatar: '',
        signature: '',
        blog: '',
        direction: ''
    });

    // 获取成员列表
    useEffect(() => {
        fetchMembers();
    }, []);

    const fetchMembers = async () => {
        try {
            const res = await axios.get(`${API_BASE}/team/members/all`);
            setMembers(res.data.data || []);
            setLoading(false);
        } catch (error) {
            console.error('获取成员列表失败:', error);
            setMessage('❌ 获取成员列表失败');
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const resetForm = () => {
        setFormData({
            name: '',
            role: '',
            avatar: '',
            signature: '',
            blog: '',
            direction: ''
        });
        setEditingId(null);
        setShowForm(false);
    };

    const handleAddMember = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.role) {
            setMessage('⚠️ 请填写成员名称和角色');
            return;
        }

        try {
            if (editingId) {
                // 编辑模式
                await axios.put(`${API_BASE}/team/members/${editingId}`, formData);
                setMessage('✅ 成员信息已更新');
            } else {
                // 添加模式
                await axios.post(`${API_BASE}/team/members`, formData);
                setMessage('✅ 新成员已添加');
            }
            fetchMembers();
            resetForm();
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage('❌ 操作失败: ' + error.message);
        }
    };

    const handleEditMember = (member) => {
        setFormData(member);
        setEditingId(member._id || member.id);
        setShowForm(true);
    };

    const handleDeleteMember = async (id) => {
        if (!confirm('确定要删除该成员吗？')) return;

        try {
            await axios.delete(`${API_BASE}/team/members/${id}`);
            setMessage('✅ 成员已删除');
            // 删除后立即重新获取成员列表
            await fetchMembers();
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
                <h2 className="text-2xl font-bold text-white">👥 成员管理</h2>
                {!showForm && (
                    <button
                        onClick={() => setShowForm(true)}
                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition"
                    >
                        + 添加新成员
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
                <form onSubmit={handleAddMember} className="bg-slate-700 rounded-lg p-6 space-y-4">
                    <h3 className="text-lg font-bold text-white">
                        {editingId ? '编辑成员' : '添加新成员'}
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                成员名称 *
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-slate-600 text-white border border-slate-500 rounded-lg focus:outline-none focus:border-blue-500"
                                placeholder="如: 张三"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                角色/职位 *
                            </label>
                            <input
                                type="text"
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-slate-600 text-white border border-slate-500 rounded-lg focus:outline-none focus:border-blue-500"
                                placeholder="如: Web安全"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                头像 URL
                            </label>
                            <input
                                type="url"
                                name="avatar"
                                value={formData.avatar}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-slate-600 text-white border border-slate-500 rounded-lg focus:outline-none focus:border-blue-500"
                                placeholder="https://example.com/avatar.jpg"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                个性签名
                            </label>
                            <input
                                type="text"
                                name="signature"
                                value={formData.signature}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-slate-600 text-white border border-slate-500 rounded-lg focus:outline-none focus:border-blue-500"
                                placeholder="输入个性签名"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                博客链接
                            </label>
                            <input
                                type="url"
                                name="blog"
                                value={formData.blog}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-slate-600 text-white border border-slate-500 rounded-lg focus:outline-none focus:border-blue-500"
                                placeholder="https://blog.example.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                研究方向
                            </label>
                            <input
                                type="text"
                                name="direction"
                                value={formData.direction}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-slate-600 text-white border border-slate-500 rounded-lg focus:outline-none focus:border-blue-500"
                                placeholder="如: 逆向分析"
                            />
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition"
                        >
                            {editingId ? '✏️ 更新成员' : '➕ 添加成员'}
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

            {/* 成员列表 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {members.map(member => (
                    <div key={member._id || member.id} className="bg-slate-700 rounded-lg p-4 border border-slate-600">
                        {member.avatar && (
                            <img
                                src={member.avatar}
                                alt={member.name}
                                className="w-full h-32 object-cover rounded-lg mb-3"
                            />
                        )}
                        <h4 className="text-lg font-bold text-white mb-1">{member.name}</h4>
                        <p className="text-sm text-blue-400 mb-2">{member.role}</p>
                        {member.signature && (
                            <p className="text-xs text-slate-400 mb-2 italic">"{member.signature}"</p>
                        )}
                        {member.direction && (
                            <p className="text-xs text-slate-400 mb-2">方向: {member.direction}</p>
                        )}
                        {member.blog && (
                            <p className="text-xs text-slate-400 mb-3">
                                📝 <a href={member.blog} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                                    查看博客
                                </a>
                            </p>
                        )}
                        <div className="flex gap-2 pt-3 border-t border-slate-600">
                            <button
                                onClick={() => handleEditMember(member)}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold py-2 rounded transition"
                            >
                                ✏️ 编辑
                            </button>
                            <button
                                onClick={() => handleDeleteMember(member._id || member.id)}
                                className="flex-1 bg-red-600 hover:bg-red-700 text-white text-sm font-bold py-2 rounded transition"
                            >
                                🗑️ 删除
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {members.length === 0 && !showForm && (
                <div className="text-center py-8 text-slate-400">
                    <p>暂无成员，点击"添加新成员"按钮创建</p>
                </div>
            )}
        </div>
    );
}
