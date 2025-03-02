import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Card, Input, Button, message } from 'antd';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:5000/login', { email, password });
      
      if (response.data.role === 'admin') {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('role', response.data.role);
        message.success('Admin logged in successfully!');
        navigate('/admin-dashboard');
      } else {
        message.error('Only Admins can access this page!');
      }
    } catch (err) {
      message.error('Invalid email or password');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <Card title="Admin Login" bordered={false} style={{ width: 400 }}>
        <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="mb-2" />
        <Input.Password placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="mb-2" />
        <Button type="primary" block onClick={handleLogin}>Login as Admin</Button>
      </Card>
    </div>
  );
};

export default AdminLogin;
