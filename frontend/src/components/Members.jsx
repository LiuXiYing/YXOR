import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Members() {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMembers();
    }, []);

    const fetchMembers = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/team/members', {
                timeout: 5000
            });
            setMembers(response.data.data || []);
        } catch (error) {
            console.error('获取团队成员失败:', error);
            console.error('Error details:', error.response?.data);
            setMembers([]);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="text-center py-20">加载中...</div>;
    }

    return (
        <section id="members" className="py-20 px-4 bg-white border-t border-gray-200">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
                        Members
                    </h2>
                    <p className="text-gray-500 text-lg"></p>
                </div>

                <div className="flex flex-wrap gap-12 justify-center">
                    {members.map((member) => (
                        <div
                            key={member._id || member.id}
                            className="relative group"
                        >
                            {/* 圆形头像容器 */}
                            <div className="relative w-32 h-32 md:w-40 md:h-40 mx-auto">
                                <img
                                    src={member.avatar}
                                    alt={member.name}
                                    className="w-full h-full rounded-full border-4 border-gray-200 object-cover shadow-md group-hover:shadow-xl transition-shadow duration-300"
                                />

                                {/* 鼠标浮动时显示的信息 */}
                                <div className="absolute inset-0 rounded-full bg-black bg-opacity-0 group-hover:bg-opacity-75 transition-all duration-300 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer">
                                    <div className="text-center text-white px-4">
                                        <h3 className="font-bold text-lg mb-1">{member.name}</h3>
                                        <p className="text-sm text-gray-200 mb-2">{member.role}</p>
                                        <p className="text-xs text-gray-300 mb-2">{member.direction}</p>
                                        {member.blog && (
                                            <a
                                                href={member.blog}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-xs text-red-400 hover:text-red-300 transition"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                查看博客 →
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
