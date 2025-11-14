import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:3001/api';

export default function AdminApplications() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    // 获取申请列表
    useEffect(() => {
        fetchApplications();
    }, [filterStatus]);

    const fetchApplications = async () => {
        try {
            const url = filterStatus === 'all'
                ? `${API_BASE}/team/applications`
                : `${API_BASE}/team/applications?status=${filterStatus}`;
            const res = await axios.get(url);
            setApplications(res.data.data || []);
            setLoading(false);
        } catch (error) {
            console.error('获取申请列表失败:', error);
            setMessage('❌ 获取申请列表失败');
            setLoading(false);
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            await axios.patch(`${API_BASE}/team/applications/${id}/status`, {
                status: newStatus
            });
            setMessage(`✅ 申请状态已更新为: ${getStatusLabel(newStatus)}`);
            fetchApplications();
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage('❌ 更新失败: ' + error.message);
        }
    };

    const handleDeleteApplication = async (id) => {
        if (!confirm('确定要删除该申请吗？')) return;

        try {
            await axios.delete(`${API_BASE}/team/applications/${id}`);
            setMessage('✅ 申请已删除');
            fetchApplications();
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage('❌ 删除失败: ' + error.message);
        }
    };

    const getStatusLabel = (status) => {
        const labels = {
            pending: '待审批',
            approved: '已通过',
            rejected: '已拒绝'
        };
        return labels[status] || status;
    };

    const getStatusColor = (status) => {
        const colors = {
            pending: 'bg-yellow-900 text-yellow-200',
            approved: 'bg-green-900 text-green-200',
            rejected: 'bg-red-900 text-red-200'
        };
        return colors[status] || 'bg-slate-600 text-slate-300';
    };

    if (loading) {
        return <div className="text-center text-slate-400">加载中...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">📝 申请审批</h2>
                <div className="flex gap-2">
                    {['all', 'pending', 'approved', 'rejected'].map(status => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={`px-4 py-2 rounded-lg transition font-medium text-sm ${filterStatus === status
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                                }`}
                        >
                            {status === 'all' ? '全部' : getStatusLabel(status)}
                        </button>
                    ))}
                </div>
            </div>

            {/* 统计信息 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                    { label: '总申请数', value: applications.length, color: 'blue' },
                    { label: '待审批', value: applications.filter(a => a.status === 'pending').length, color: 'yellow' },
                    { label: '已通过', value: applications.filter(a => a.status === 'approved').length, color: 'green' },
                    { label: '已拒绝', value: applications.filter(a => a.status === 'rejected').length, color: 'red' }
                ].map((stat, idx) => (
                    <div key={idx} className={`bg-${stat.color}-900 rounded-lg p-4 text-center`}>
                        <p className={`text-2xl font-bold text-${stat.color}-200`}>{stat.value}</p>
                        <p className={`text-sm text-${stat.color}-300`}>{stat.label}</p>
                    </div>
                ))}
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

            {/* 申请列表 */}
            <div className="space-y-4">
                {applications.map(app => (
                    <div key={app._id || app.id} className="bg-slate-700 rounded-lg p-6 border border-slate-600 hover:border-blue-500 transition">
                        <div className="flex items-start justify-between gap-4 mb-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <h4 className="text-lg font-bold text-white">{app.name}</h4>
                                    <span className={`text-xs font-bold px-2 py-1 rounded ${getStatusColor(app.status)}`}>
                                        {getStatusLabel(app.status)}
                                    </span>
                                </div>
                                <p className="text-sm text-slate-400 mb-1">
                                    <span className="font-medium">邮箱:</span> {app.email}
                                </p>
                                {app.phone && (
                                    <p className="text-sm text-slate-400 mb-1">
                                        <span className="font-medium">电话:</span> {app.phone}
                                    </p>
                                )}
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-slate-400">
                                    {new Date(app.createdAt).toLocaleDateString('zh-CN')}
                                </p>
                            </div>
                        </div>

                        {app.skills && (
                            <div className="mb-3">
                                <p className="text-sm font-medium text-slate-300 mb-1">技能:</p>
                                <p className="text-sm text-slate-400">{app.skills}</p>
                            </div>
                        )}

                        {app.message && (
                            <div className="mb-3 bg-slate-800 rounded p-3 border border-slate-600">
                                <p className="text-sm font-medium text-slate-300 mb-1">申请理由:</p>
                                <p className="text-sm text-slate-400">{app.message}</p>
                            </div>
                        )}

                        {app.reviewNotes && (
                            <div className="mb-3 bg-blue-900 rounded p-3 border border-blue-700">
                                <p className="text-sm font-medium text-blue-300 mb-1">审批备注:</p>
                                <p className="text-sm text-blue-200">{app.reviewNotes}</p>
                            </div>
                        )}

                        <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-600">
                            {app.status !== 'approved' && (
                                <button
                                    onClick={() => handleStatusChange(app._id || app.id, 'approved')}
                                    className="bg-green-600 hover:bg-green-700 text-white text-sm font-bold py-2 px-4 rounded transition"
                                >
                                    ✅ 批准
                                </button>
                            )}
                            {app.status !== 'rejected' && (
                                <button
                                    onClick={() => handleStatusChange(app._id || app.id, 'rejected')}
                                    className="bg-red-600 hover:bg-red-700 text-white text-sm font-bold py-2 px-4 rounded transition"
                                >
                                    ❌ 拒绝
                                </button>
                            )}
                            {app.status !== 'pending' && (
                                <button
                                    onClick={() => handleStatusChange(app._id || app.id, 'pending')}
                                    className="bg-yellow-600 hover:bg-yellow-700 text-white text-sm font-bold py-2 px-4 rounded transition"
                                >
                                    ⏳ 待审
                                </button>
                            )}
                            <button
                                onClick={() => handleDeleteApplication(app._id || app.id)}
                                className="bg-slate-600 hover:bg-slate-500 text-white text-sm font-bold py-2 px-4 rounded transition ml-auto"
                            >
                                🗑️ 删除
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {applications.length === 0 && (
                <div className="text-center py-8 text-slate-400">
                    <p>暂无申请</p>
                </div>
            )}
        </div>
    );
}
