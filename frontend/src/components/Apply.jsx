import React, { useState } from 'react';
import axios from 'axios';

export default function Apply() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        skills: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await axios.post('http://localhost:3001/api/team/apply', formData, {
                timeout: 10000
            });
            setSuccess(true);
            setFormData({ name: '', email: '', phone: '', skills: '', message: '' });

            // 3秒后隐藏成功消息
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            console.error('提交申请失败:', err);
            console.error('Error details:', err.response?.data);
            setError(err.response?.data?.error || '提交失败，请重试');
        } finally {
            setLoading(false);
        }
    };

    return null;
}
