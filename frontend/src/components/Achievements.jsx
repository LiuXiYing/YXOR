import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Achievements() {
    const [achievements, setAchievements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hoveredId, setHoveredId] = useState(null);

    useEffect(() => {
        fetchAchievements();
    }, []);

    const fetchAchievements = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/team/achievements', {
                timeout: 5000
            });
            setAchievements(response.data.data || []);
        } catch (error) {
            console.error('获取成就失败:', error.message);
            console.error('错误详情:', error.response?.data || error);
            setAchievements([]);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="text-center py-20">加载中...</div>;
    }

    // 按年份分组成就
    const achievementsByYear = achievements.reduce((acc, achievement) => {
        const year = achievement.year;
        if (!acc[year]) {
            acc[year] = [];
        }
        acc[year].push(achievement);
        return acc;
    }, {});

    // 按年份降序排序
    const sortedYears = Object.keys(achievementsByYear).sort((a, b) => parseInt(b) - parseInt(a));

    return (
        <section id="achievements" className="py-20 px-4 bg-white border-t border-gray-200">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
                        Achievements
                    </h2>
                    {/* <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        我们在各项CTF竞赛中取得的优异成绩，见证了团队的技术实力和协作精神
                    </p> */}
                </div>

                {sortedYears.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">🏆</div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">暂无成就记录</h3>
                        <p className="text-gray-500">期待我们在未来的比赛中创造辉煌！</p>
                    </div>
                ) : (
                    <div className="space-y-12">
                        {sortedYears.map((year) => (
                            <div key={year} className="relative">
                                {/* 年份标题 - 简约设计 */}
                                <div className="flex items-center mb-6">
                                    <div className="flex-shrink-0 text-2xl font-bold text-gray-800 border-l-4 border-gray-400 pl-3">
                                        {year} 年
                                    </div>
                                    <div className="flex-grow h-px bg-gray-200 ml-4"></div>
                                </div>

                                {/* 成就卡片 - 简约网格 */}
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                    {achievementsByYear[year].map((achievement) => (
                                        <AchievementCard
                                            key={`${year}-${achievement.title}`}
                                            achievement={achievement}
                                            // isHovered={hoveredId === `${year}-${achievement.title}`}
                                            // onHover={() => setHoveredId(`${year}-${achievement.title}`)}
                                            // onLeave={() => setHoveredId(null)}
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* 总体统计 - 简约设计 */}
                {/* {achievements.length > 0 && (
                    <div className="mt-16 bg-white border border-gray-200 rounded-lg p-6">
                        <div className="text-center">
                            <div className="inline-flex items-center space-x-8 text-gray-700">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-gray-800">{achievements.length}</div>
                                    <div className="text-sm text-gray-500">总成就数</div>
                                </div>
                                <div className="h-8 w-px bg-gray-300"></div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-gray-800">{sortedYears.length}</div>
                                    <div className="text-sm text-gray-500">活跃年份</div>
                                </div>
                            </div>
                        </div>
                    </div>
                )} */}
            </div>
        </section>
    );
}

// 简约成就卡片组件 - 参考团队成员页面的悬浮交互设计
function AchievementCard({ achievement, isHovered, onHover, onLeave }) {
    // 简约奖项标签样式
    const getAwardStyle = (award) => {
        const awardLower = award.toLowerCase();
        if (awardLower.includes('champion') || awardLower.includes('冠军')) {
            return 'bg-yellow-100 text-yellow-800 border border-yellow-300';
        } else if (awardLower.includes('first') || awardLower.includes('一等奖')) {
            return 'bg-orange-100 text-orange-800 border border-orange-300';
        } else if (awardLower.includes('second') || awardLower.includes('二等奖')) {
            return 'bg-blue-100 text-blue-800 border border-blue-300';
        } else if (awardLower.includes('top') || awardLower.includes('入围')) {
            return 'bg-purple-100 text-purple-800 border border-purple-300';
        } else {
            return 'bg-gray-100 text-gray-800 border border-gray-300';
        }
    };

    return (
        <div
            className="relative bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-lg transition-all duration-300 group"
            onMouseEnter={onHover}
            onMouseLeave={onLeave}
        >
            {/* 基础信息 - 始终显示 */}
            <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-bold text-gray-900 flex-1 pr-4">
                    {achievement.title}
                </h3>
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                    getAwardStyle(achievement.award)
                }`}>
                    {achievement.award}
                </span>
            </div>

            {/* 默认显示 - 年份和位置 */}
            <div className="flex items-center justify-between text-sm text-gray-500 pb-3 border-b border-gray-100">
                <div className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {achievement.year}年
                </div>

                {achievement.location && (
                    <div className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {achievement.location}
                    </div>
                )}
            </div>

            {/* 悬浮详情 - 类似团队成员页面的悬浮效果 */}
            {/* <div className={`absolute inset-0 rounded-xl bg-black bg-opacity-0 group-hover:bg-opacity-80 transition-all duration-300 flex items-center justify-center cursor-pointer ${
                isHovered ? 'bg-opacity-80' : ''
            }`}>
                <div className={`text-white text-center px-4 transition-opacity duration-300 ${
                    isHovered ? 'opacity-100' : 'opacity-0'
                }`}>
                    {achievement.description ? (
                        <p className="text-sm mb-3">
                            {achievement.description}
                        </p>
                    ) : (
                        <p className="text-sm mb-3 text-gray-300">
                            暂无详细描述
                        </p>
                    )}
                    <p className="text-xs text-gray-400 font-mono">
                        🏆 {achievement.award}
                    </p>
                </div>
            </div> */}
        </div>
    );
}