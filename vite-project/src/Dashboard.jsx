import React from 'react';
import { Card, Button } from 'antd';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem('role');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/');
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <Card title={`Welcome ${role}`} bordered={false} style={{ width: 500 }}>
        <Button type="primary" block className="mb-2">Room Management</Button>
        <Button type="primary" block className="mb-2">User Management</Button>
        <Button type="primary" block className="mb-2">Attendance</Button>
        <Button type="danger" block onClick={handleLogout}>Logout</Button>
      </Card>
    </div>
  );
};

export default Dashboard;
