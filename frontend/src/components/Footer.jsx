import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Footer() {
    const currentYear = new Date().getFullYear();
    const [teamInfo, setTeamInfo] = useState(null);
    const [contactEmail, setContactEmail] = useState('join@yxor.uno');

    useEffect(() => {
        fetchTeamInfo();
        // 每5秒刷新一次，确保Admin修改后能快速显示
        const interval = setInterval(fetchTeamInfo, 5000);
        return () => clearInterval(interval);
    }, []);

    const fetchTeamInfo = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/team/info', {
                timeout: 5000
            });
            const data = response.data.data;
            setTeamInfo(data);
            // 使用后端返回的 contactEmail
            const email = data?.contactEmail || 'join@yxor.uno';
            setContactEmail(email);
        } catch (error) {
            console.error('获取战队信息失败:', error);
        }
    };

    return (
        <footer className="bg-white border-t border-gray-200 py-12 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="grid md:grid-cols-2 gap-12 mb-12 items-center">
                    {/* 左侧：品牌信息 */}
                    <div>
                        <h3 className="text-3xl font-bold text-gray-900 mb-3">
                            YXOR Team
                        </h3>
                        <p className="font-bold text-gray-900 text-base leading-relaxed">
                            Capture The Flag
                        </p>
                    </div>

                    {/* 右侧：联系方式 */}
                    <div className="text-left md:text-right">
                        <p className="text-sm text-gray-500 font-semibold uppercase tracking-wide mb-2">联系我们</p>
                        <a
                            href={`mailto:${contactEmail}`}
                            className="text-lg font-bold text-gray-900 hover:text-red-500 transition"
                        >
                            {contactEmail}
                        </a>
                    </div>
                </div>

                {/* 底部信息 */}
                <div className="border-t border-gray-200 pt-8 text-center text-sm text-gray-600">
                    <p>© {currentYear} YXOR Team. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
