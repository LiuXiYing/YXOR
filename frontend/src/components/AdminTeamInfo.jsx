import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:3001/api';

export default function AdminTeamInfo() {
    const [teamInfo, setTeamInfo] = useState({
        name: '',
        description: '',
        founded: '',
        logo: '',
        tagline: '',
        contactEmail: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    // 获取战队信息
    useEffect(() => {
        fetchTeamInfo();
    }, []);

    const fetchTeamInfo = async () => {
        try {
            console.log('正在获取战队信息...');
            const res = await axios.get(`${API_BASE}/team/info`, {
                timeout: 5000
            });
            console.log('成功获取战队信息:', res.data);
            setTeamInfo(res.data.data || {
                name: '',
                description: '',
                founded: '',
                logo: '',
                tagline: '',
                contactEmail: ''
            });
            setLoading(false);
        } catch (error) {
            console.error('获取战队信息失败:', error.message);
            console.error('错误详情:', error.response?.data || error);
            setMessage('❌ 获取信息失败，请检查后端是否启动');
            setLoading(false);
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // 转换为 Base64
        const reader = new FileReader();
        reader.onload = (event) => {
            const base64String = event.target.result;
            setTeamInfo(prev => ({
                ...prev,
                logo: base64String
            }));
        };
        reader.readAsDataURL(file);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTeamInfo(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            console.log('正在保存战队信息...');
            const res = await axios.put(`${API_BASE}/team/info`, teamInfo, {
                timeout: 10000,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log('保存成功:', res.data);
            setMessage('✅ 战队信息已保存');
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            console.error('保存失败:', error.message);
            console.error('错误详情:', error.response?.data || error);

            if (error.code === 'ECONNABORTED') {
                setMessage('❌ 保存失败: 请求超时，可能是文件过大');
            } else if (error.response?.status === 413) {
                setMessage('❌ 保存失败: 文件过大，请使用较小的图片');
            } else {
                setMessage('❌ 保存失败: ' + (error.response?.data?.error || error.message));
            }
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="space-y-4">
                <div className="text-center text-slate-400 py-8">加载中...</div>
                {message && (
                    <div className={`p-3 rounded-lg ${message.includes('✅')
                        ? 'bg-green-900 text-green-200'
                        : 'bg-red-900 text-red-200'
                        }`}>
                        {message}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">📋 战队基本信息</h2>

            <div className="space-y-4">
                {/* 战队名称 */}
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                        战队名称
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={teamInfo.name}
                        onChange={handleChange}
                        className="w-full px-4 py-2 bg-slate-700 text-white border border-slate-600 rounded-lg focus:outline-none focus:border-blue-500"
                        placeholder="如: YXOR"
                    />
                </div>

                {/* 战队描述 */}
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                        战队描述
                    </label>
                    <textarea
                        name="description"
                        value={teamInfo.description}
                        onChange={handleChange}
                        rows="4"
                        className="w-full px-4 py-2 bg-slate-700 text-white border border-slate-600 rounded-lg focus:outline-none focus:border-blue-500"
                        placeholder="输入战队的详细描述..."
                    />
                </div>

                {/* 成立年份 */}
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                        成立年份
                    </label>
                    <input
                        type="number"
                        name="founded"
                        value={teamInfo.founded}
                        onChange={handleChange}
                        className="w-full px-4 py-2 bg-slate-700 text-white border border-slate-600 rounded-lg focus:outline-none focus:border-blue-500"
                        placeholder="如: 2020"
                    />
                </div>

                {/* 战队标志/标语 */}
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                        战队标志 / 标语
                    </label>
                    <input
                        type="text"
                        name="tagline"
                        value={teamInfo.tagline}
                        onChange={handleChange}
                        className="w-full px-4 py-2 bg-slate-700 text-white border border-slate-600 rounded-lg focus:outline-none focus:border-blue-500"
                        placeholder="如: 网络安全精英团队 · CTF竞赛专家"
                    />
                </div>

                {/* Logo 上传 */}
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                        Logo 图片上传 / URL
                    </label>
                    <div className="space-y-2">
                        {/* 文件上传 */}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="w-full px-4 py-2 bg-slate-700 text-white border border-slate-600 rounded-lg focus:outline-none focus:border-blue-500 file:bg-blue-600 file:text-white file:border-0 file:px-3 file:py-1 file:rounded cursor-pointer"
                            placeholder="选择图片文件"
                        />
                        {/* URL 输入 */}
                        <input
                            type="url"
                            name="logo"
                            value={teamInfo.logo}
                            onChange={handleChange}
                            className="w-full px-4 py-2 bg-slate-700 text-white border border-slate-600 rounded-lg focus:outline-none focus:border-blue-500"
                            placeholder="或输入图片 URL (https://example.com/logo.png)"
                        />
                    </div>
                    {teamInfo.logo && (
                        <div className="mt-2">
                            <img
                                src={teamInfo.logo}
                                alt="Logo 预览"
                                className="max-w-xs h-32 object-contain rounded-lg"
                                onError={() => setMessage('⚠️ 图片加载失败')}
                            />
                        </div>
                    )}
                </div>

                {/* 联系邮箱 */}
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                        联系邮箱
                    </label>
                    <input
                        type="email"
                        name="contactEmail"
                        value={teamInfo.contactEmail}
                        onChange={handleChange}
                        className="w-full px-4 py-2 bg-slate-700 text-white border border-slate-600 rounded-lg focus:outline-none focus:border-blue-500"
                        placeholder="contact@example.com"
                    />
                </div>
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

            {/* 保存按钮 */}
            <div className="flex gap-3 pt-4">
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-900 text-white font-bold py-2 px-6 rounded-lg transition"
                >
                    {saving ? '保存中...' : '💾 保存更改'}
                </button>
                <button
                    onClick={fetchTeamInfo}
                    className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-6 rounded-lg transition"
                >
                    ↻ 重置
                </button>
            </div>

            {/* 预览 */}
            <div className="border border-slate-700 rounded-lg p-4 bg-slate-700 bg-opacity-30">
                <h3 className="text-sm font-medium text-slate-300 mb-3">📊 预览</h3>
                <div className="space-y-2 text-sm text-slate-400">
                    <p><strong className="text-slate-300">名称:</strong> {teamInfo.name || '未设置'}</p>
                    <p><strong className="text-slate-300">标语:</strong> {teamInfo.tagline || '未设置'}</p>
                    <p><strong className="text-slate-300">成立:</strong> {teamInfo.founded || '未设置'}</p>
                    <p><strong className="text-slate-300">邮箱:</strong> {teamInfo.contactEmail || '未设置'}</p>
                </div>
            </div>
        </div>
    );
}
