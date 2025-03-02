import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Card, Input, Button, message } from 'antd';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await axios.post('http://localhost:5000/register', { email, password });
      message.success('User registered successfully!');
      navigate('/login-user');
    } catch (err) {
      message.error(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <Card title="User Registration" bordered={false} style={{ width: 400 }}>
        <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="mb-2" />
        <Input.Password placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="mb-2" />
        <Button type="primary" block onClick={handleRegister}>Register</Button>
      </Card>
    </div>
  );
};

export default Register;
