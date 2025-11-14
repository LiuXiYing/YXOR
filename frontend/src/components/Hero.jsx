import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Hero() {
    const [teamInfo, setTeamInfo] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTeamInfo();
    }, []);

    const fetchTeamInfo = async () => {
        try {
            const res = await axios.get('http://localhost:3001/api/team/info');
            if (res.data.data) {
                setTeamInfo(res.data.data);
            } else {
                setTeamInfo({
                    name: 'YXOR TEAM',
                    logo: '',
                    tagline: '网络安全精英团队 · CTF竞赛专家',
                    description: '专注于漏洞发现、渗透测试和安全防御研究，致力于推动网络安全技术发展'
                });
            }
        } catch (error) {
            console.error('获取战队信息失败:', error);
            setTeamInfo({
                name: 'YXOR TEAM',
                logo: '',
                tagline: '网络安全精英团队 · CTF竞赛专家',
                description: '专注于漏洞发现、渗透测试和安全防御研究，致力于推动网络安全技术发展'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white">
            {/* 极简背景 */}
            <div className="absolute inset-0 -z-10 bg-white"></div>

            <div className="text-center z-10 px-4">
                {/* 放大的 LOGO 区域 - 仅显示 Logo */}
                {teamInfo && (
                    <div>
                        {teamInfo.logo ? (
                            <div className="w-80 h-80 md:w-96 md:h-96 mx-auto rounded-full flex items-center justify-center shadow-lg overflow-hidden bg-white border-2 border-gray-200 animate-pulse">
                                <img src={teamInfo.logo} alt="Team Logo" className="w-full h-full object-contain p-8" />
                            </div>
                        ) : (
                            <div className="w-80 h-80 md:w-96 md:h-96 mx-auto bg-gradient-to-br from-gray-50 to-gray-100 rounded-full flex items-center justify-center shadow-lg border-2 border-gray-200 animate-pulse">
                                <div className="text-9xl font-black text-gray-300">{teamInfo.name.charAt(0)}</div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <style>{`
      `}</style>
        </section>
    );
}
