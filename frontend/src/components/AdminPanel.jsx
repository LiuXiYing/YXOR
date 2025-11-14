import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminTeamInfo from './AdminTeamInfo';
import AdminMembers from './AdminMembers';
import AdminAchievements from './AdminAchievements';
import AdminApplications from './AdminApplications';

export default function AdminPanel() {
    const [activeTab, setActiveTab] = useState('teamInfo');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [password, setPassword] = useState('');
    const [showLoginForm, setShowLoginForm] = useState(true);
    const [backendConnected, setBackendConnected] = useState(false);
    const navigate = useNavigate();

    const ADMIN_PASSWORD = 'admin123'; // 生产环境应使用真实认证

    // 检查后端连接
    const checkBackendConnection = async () => {
        try {
            const res = await axios.get('http://localhost:3001/api/health', {
                timeout: 3000
            });
            setBackendConnected(res.data.status === 'ok');
            console.log('后端连接状态:', res.data.status === 'ok');
        } catch (error) {
            console.log('后端未连接:', error.message);
            setBackendConnected(false);
        }
    };

    const handleLogin = (e) => {
        e.preventDefault();
        if (password === ADMIN_PASSWORD) {
            setIsLoggedIn(true);
            setShowLoginForm(false);
            localStorage.setItem('adminLoggedIn', 'true');
            // 登录后检查后端连接
            setTimeout(checkBackendConnection, 500);
        } else {
            alert('密码错误！');
            setPassword('');
        }
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setShowLoginForm(true);
        localStorage.removeItem('adminLoggedIn');
        setPassword('');
    };

    // 检查是否已登录
    useEffect(() => {
        if (localStorage.getItem('adminLoggedIn')) {
            setIsLoggedIn(true);
            setShowLoginForm(false);
            // 检查后端连接
            checkBackendConnection();
            // 每5秒检查一次连接状态
            const interval = setInterval(checkBackendConnection, 5000);
            return () => clearInterval(interval);
        }
    }, []);

    if (!isLoggedIn) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
                <div className="bg-slate-800 rounded-lg shadow-2xl p-8 w-full max-w-md border border-slate-700">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-white mb-2">YXOR</h1>
                        <p className="text-slate-400">管理员登录</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                管理员密码
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-2 bg-slate-700 text-white border border-slate-600 rounded-lg focus:outline-none focus:border-blue-500 transition"
                                placeholder="输入管理员密码"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition"
                        >
                            登录
                        </button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-slate-700">
                        <p className="text-slate-400 text-sm text-center">
                            🔐 这是一个演示密码。生产环境请修改默认密码！
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            {/* 顶部导航栏 */}
            <nav className="bg-slate-800 border-b border-slate-700 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <h1 className="text-2xl font-bold text-white">YXOR 管理系统</h1>
                            <span className="text-slate-400 text-sm">v2.0</span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                                <div className={`w-2 h-2 rounded-full ${backendConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                <span className={`text-xs font-medium ${backendConnected ? 'text-green-400' : 'text-red-400'}`}>
                                    {backendConnected ? '✅ 已连接' : '❌ 后端离线'}
                                </span>
                            </div>
                            <button
                                onClick={() => navigate('/')}
                                className="text-slate-300 hover:text-white transition text-sm font-medium"
                            >
                                ← 返回首页
                            </button>
                            <button
                                onClick={handleLogout}
                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition text-sm font-medium"
                            >
                                退出登录
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* 主容器 */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* 选项卡导航 */}
                <div className="bg-slate-800 rounded-lg border border-slate-700 mb-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-0">
                        {[
                            { id: 'teamInfo', label: '📋 战队信息', icon: '🏢' },
                            { id: 'members', label: '👥 成员管理', icon: '👤' },
                            { id: 'achievements', label: '🏆 成就管理', icon: '⭐' },
                            { id: 'applications', label: '📝 申请审批', icon: '📨' }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-4 py-4 font-medium transition text-center border-b-2 ${activeTab === tab.id
                                    ? 'bg-slate-700 border-blue-500 text-blue-400'
                                    : 'border-slate-600 text-slate-400 hover:text-slate-300'
                                    }`}
                            >
                                <div className="text-lg mb-1">{tab.icon}</div>
                                <div className="text-xs md:text-sm">{tab.label}</div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* 内容区域 */}
                <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
                    {activeTab === 'teamInfo' && <AdminTeamInfo />}
                    {activeTab === 'members' && <AdminMembers />}
                    {activeTab === 'achievements' && <AdminAchievements />}
                    {activeTab === 'applications' && <AdminApplications />}
                </div>

                {/* 底部说明 */}
                <div className="mt-8 bg-slate-800 rounded-lg border border-slate-700 p-4 text-sm text-slate-400">
                    <p>✅ 所有更改都会自动保存到数据库</p>
                    <p>⚠️ 请谨慎删除数据，已删除的数据可能无法恢复</p>
                </div>
            </div>
        </div>
    );
}
