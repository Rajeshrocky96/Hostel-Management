import React, { useEffect, useState } from "react";
import { Card, Statistic, Row, Col, Spin, Alert, Table } from "antd";
import { HomeOutlined, CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import Chart from "react-apexcharts";

const UserMessDetailsAdmin = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMessDetails();
  }, []);

  const fetchMessDetails = async () => {
    try {
      const response = await fetch("http://localhost:5000/hostel-registrations");
      const data = await response.json();

      if (Array.isArray(data)) {
        setUsers(data);
      } else {
        setError("Invalid data format received.");
      }
    } catch (err) {
      setError("Error fetching mess details.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const totalUsers = users.length;

  // Count Veg & Non-Veg users
  const vegCount = users.filter((user) => user.mess_type === "Veg").length;
  const nonVegCount = totalUsers - vegCount;

  // ApexChart Configuration
  const chartOptions = {
    chart: { type: "bar", height: 300 },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "50%",
      },
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: ["Veg", "Non-Veg"],
    },
    colors: ["#52c41a", "#ff4d4f"],
  };

  const chartSeries = [
    {
      name: "Users",
      data: [vegCount, nonVegCount],
    },
  ];

  // Table columns
  const columns = [
    {
      title: "User Name (Email)",
      dataIndex: "user_name",
      key: "user_name",
    },
    {
      title: "Full Name",
      dataIndex: "full_name",
      key: "full_name",
    },
    {
      title: "Mess Type",
      dataIndex: "mess_type",
      key: "mess_type",
      render: (type) =>
        type === "veg" ? (
          <CheckCircleOutlined style={{ color: "green" }} />
        ) : (
          <CloseCircleOutlined style={{ color: "red" }} />
        ),
    },
    {
      title: "Department",
      dataIndex: "department",
      key: "department",
    },
    {
      title: "Phone Number",
      dataIndex: "phone_number",
      key: "phone_number",
    },
    {
      title: "Hostel Type",
      dataIndex: "hostel_type",
      key: "hostel_type",
    },
  ];

  return (
    <Card
      title={<span><HomeOutlined /> 🍽️ Mess Details</span>}
      style={{ maxWidth: 900, margin: "20px auto" }}
    >
      {loading ? (
        <Spin tip="Loading mess details..." />
      ) : error ? (
        <Alert message={error} type="error" showIcon />
      ) : (
        <>
          <Row gutter={16}>
            <Col span={12}>
              <Statistic title="Total Users" value={totalUsers} />
            </Col>
            <Col span={6}>
              <Statistic title="Veg Users" value={vegCount} />
            </Col>
            <Col span={6}>
              <Statistic title="Non-Veg Users" value={nonVegCount} />
            </Col>
          </Row>

          {/* Apex Chart */}
          <div style={{ margin: "20px 0" }}>
            <Chart options={chartOptions} series={chartSeries} type="bar" height={300} />
          </div>

          {/* Table of users */}
          <Table
            columns={columns}
            dataSource={users}
            rowKey="user_id"
            pagination={{ pageSize: 5 }}
          />
        </>
      )}
    </Card>
  );
};

export default UserMessDetailsAdmin;
