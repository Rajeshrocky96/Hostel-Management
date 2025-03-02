import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Card, Input, Button, message } from 'antd';

const UserLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:5000/login', { email, password });

      if (response.data.role === 'user') {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('role', response.data.role);
        message.success('User logged in successfully!');
        navigate('/user-dashboard');
      } else {
        message.error('Only Users can access this page!');
      }
    } catch (err) {
      message.error('Invalid email or password');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <Card title="User Login" bordered={false} style={{ width: 400 }}>
        <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="mb-2" />
        <Input.Password placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="mb-2" />
        <Button type="primary" block onClick={handleLogin}>Login as User</Button>
      </Card>
    </div>
  );
};

export default UserLogin;
