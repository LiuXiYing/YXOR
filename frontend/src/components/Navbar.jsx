import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function Navbar() {
    const [teamName, setTeamName] = useState('YXOR Team');
    const [logo, setLogo] = useState('');

    useEffect(() => {
        fetchTeamInfo();
    }, []);

    const fetchTeamInfo = async () => {
        try {
            const res = await axios.get('http://localhost:3001/api/team/info');
            if (res.data.data) {
                setTeamName(res.data.data.name || 'YXOR Team');
                setLogo(res.data.data.logo || '');
            }
        } catch (error) {
            console.error('获取战队信息失败:', error);
        }
    };

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        element?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded flex items-center justify-center overflow-hidden bg-gray-100 border border-gray-200">
                            {logo ? (
                                <img src={logo} alt="Logo" className="w-full h-full object-contain p-1" />
                            ) : (
                                <span className="text-gray-700 font-bold text-sm">{teamName.charAt(0)}</span>
                            )}
                        </div>
                        <span className="text-lg font-bold text-gray-900">
                            {teamName}
                        </span>
                    </div>
                    <div className="hidden md:flex space-x-6 items-center text-sm">
                        <button onClick={() => scrollToSection('intro')} className="text-gray-700 hover:text-gray-900 transition">介绍</button>
                        <button onClick={() => scrollToSection('members')} className="text-gray-700 hover:text-gray-900 transition">成员</button>
                        <button onClick={() => scrollToSection('achievements')} className="text-gray-700 hover:text-gray-900 transition">成就</button>
                        <button onClick={() => scrollToSection('apply')} className="text-gray-700 hover:text-gray-900 transition">申请</button>
                        <Link
                            to="/admin"
                            className="bg-gray-900 hover:bg-gray-800 text-white px-3 py-1 rounded text-sm transition font-medium"
                        >
                            管理
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}
