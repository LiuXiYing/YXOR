import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import TeamIntro from './components/TeamIntro';
import Members from './components/Members';
import Achievements from './components/Achievements';
import Apply from './components/Apply';
import Footer from './components/Footer';
import AdminPanel from './components/AdminPanel';
import './index.css';

function App() {
    return (
        <Routes>
            {/* 主页 */}
            <Route
                path="/"
                element={
                    <div className="min-h-screen bg-white">
                        {/* <Navbar /> 导航条已隐藏 */}
                        <Hero />
                        <TeamIntro />
                        <Members />
                        <Achievements />
                        <Apply />
                        <Footer />
                    </div>
                }
            />
            {/* 管理系统 */}
            <Route path="/admin" element={<AdminPanel />} />
        </Routes>
    );
}

export default App;
