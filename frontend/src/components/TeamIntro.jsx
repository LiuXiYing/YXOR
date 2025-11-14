import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function TeamIntro() {
    const [teamInfo, setTeamInfo] = useState(null);
    const [memberCount, setMemberCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTeamInfo();
        fetchMemberCount();
    }, []);

    const fetchTeamInfo = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/team/info', {
                timeout: 5000
            });
            setTeamInfo(response.data.data);
        } catch (error) {
            console.error('获取战队信息失败:', error);
            console.error('Error details:', error.response?.data);
        } finally {
            setLoading(false);
        }
    };

    const fetchMemberCount = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/team/members', {
                timeout: 5000
            });
            if (Array.isArray(response.data.data)) {
                setMemberCount(response.data.data.length);
            } else if (response.data.members) {
                setMemberCount(response.data.members.length);
            }
        } catch (error) {
            console.error('获取成员数失败:', error);
        }
    };

    if (loading) {
        return <div className="text-center py-20">加载中...</div>;
    }

    return (
        <section id="intro" className="py-32 px-4 bg-white">
            <div className="max-w-6xl mx-auto">
                <div className="grid md:grid-cols-2 gap-16">
                    {/* 左侧：战队名称 */}
                    <div className="flex flex-col justify-center pt-12">
                        <div className="flex items-center">
                            <h1 className="text-6xl md:text-7xl font-black text-gray-900">
                                {teamInfo?.name}
                            </h1>
                            <style>{`
                                @keyframes blink {
                                    0%, 49% { opacity: 1; }
                                    50%, 100% { opacity: 0; }
                                }
                                .cursor-blink {
                                    animation: blink 1s infinite;
                                    display: inline-block;
                                }
                            `}</style>
                            <span className="cursor-blink text-6xl md:text-7xl font-black text-red-500 ml-1 -mt-3">|</span>
                        </div>
                    </div>

                    {/* 右侧：详细信息 */}
                    <div>
                        <div className="space-y-8">
                            {/* 战队精神 */}
                            {teamInfo?.tagline && (
                                <div>
                                    <p className="text-sm text-gray-500 font-semibold uppercase tracking-widest mb-3">战队精神</p>
                                    <p className="text-3xl font-bold text-gray-900">
                                        {teamInfo.tagline}
                                    </p>
                                </div>
                            )}

                            {/* 战队介绍 */}
                            <div>
                                <p className="text-sm text-gray-500 font-semibold uppercase tracking-widest mb-3">介绍</p>
                                <p className="text-3xl font-bold text-gray-900 leading-relaxed">
                                    {teamInfo?.description}
                                </p>
                            </div>

                            {/* 关键信息 */}
                            <div className="grid grid-cols-2 gap-8 pt-8 border-t border-gray-200">
                                <div>
                                    <p className="text-gray-500 text-sm font-semibold uppercase tracking-widest mb-4">成立于</p>
                                    <p className="text-4xl font-bold text-gray-900">{teamInfo?.founded}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-sm font-semibold uppercase tracking-widest mb-4">成员</p>
                                    <p className="text-4xl font-bold text-gray-900">{memberCount}+</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
