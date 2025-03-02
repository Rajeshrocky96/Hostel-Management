import React, { useEffect, useState } from "react";
import { Card, Statistic, Row, Col, Spin, Alert, Table, Tag, Avatar, Tooltip } from "antd";
import { 
  HomeOutlined, 
  CheckCircleOutlined, 
  CloseCircleOutlined, 
  UserOutlined, 
  ApartmentOutlined, 
  PhoneOutlined 
} from "@ant-design/icons";
import Chart from "react-apexcharts";

const TOTAL_ROOMS = 50; // Total available hostel rooms

const RoomDetailsAdmin = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchHostelRegistrations();
  }, []);

  const fetchHostelRegistrations = async () => {
    try {
      const response = await fetch("http://localhost:5000/hostel-registrations");
      const data = await response.json();

      if (Array.isArray(data)) {
        setRegistrations(data);
      } else {
        setError("Invalid data format received.");
      }
    } catch (err) {
      setError("Error fetching hostel registrations.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const registeredRooms = registrations.length;
  const availableRooms = TOTAL_ROOMS - registeredRooms;

  // Count AC & Non-AC rooms
  const acRooms = registrations.filter((r) => r.hostel_type === "ac").length;
  const nonAcRooms = registeredRooms - acRooms;

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
      categories: ["AC Rooms", "Non-AC Rooms", "Available Rooms"],
    },
    colors: ["#1890ff", "#ff4d4f", "#52c41a"],
  };

  const chartSeries = [
    {
      name: "Rooms",
      data: [acRooms, nonAcRooms, availableRooms],
    },
  ];

  // Table columns
  const columns = [
    {
      title: <span><UserOutlined style={{ color: "#1890ff" }} /> User Name</span>,
      dataIndex: "user_name",
      key: "user_name",
      render: (text) => (
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <Avatar size={23} style={{ backgroundColor: "#71f1e4 " }} icon={<UserOutlined />} />
        <b style={{ fontSize: "14px", color: "#333" }}>{text}</b>
      </div>
      
      ),
    },
    {
        title: <span><ApartmentOutlined style={{ color: "#722ed1" }} /> Room Type</span>,
        dataIndex: "hostel_type",
        key: "hostel_type",
        render: (type) => (
          <Tooltip title={type === "ac" ? "Air Conditioned" : "Non-Air Conditioned"}>
            <Tag color={type === "ac" ? "green" : "red"} style={{ fontSize: "12px" }}>
              {type === "ac" ? <CheckCircleOutlined /> : <CloseCircleOutlined />} {type === "ac" ? "AC" : "Non-AC"}
            </Tag>
          </Tooltip>
        ),
      },
      
    {
      title: <span><ApartmentOutlined style={{ color: "#faad14" }} /> Department</span>,
      dataIndex: "department",
      key: "department",
      render: (text) => (
        <Tag  style={{ fontSize: "12px",  }}>
          {text}
        </Tag>
      ),
    },
    {
      title: <span><PhoneOutlined style={{ color: "#13c2c2" }} /> Phone Number</span>,
      dataIndex: "phone_number",
      key: "phone_number",
      render: (text) => (
        <Tooltip title="Call Now">
          <Tag  style={{ fontSize: "12px",  cursor: "pointer" }}>
            {text}
          </Tag>
        </Tooltip>
      ),
    },
  ];

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "10vh",
        padding: 20,
        marginLeft: "600px",
        marginTop:"65px"
      }}
    >
      <div
        style={{
          background: "linear-gradient(135deg, #ff758c, #ff7eb3)",
          padding: "40px",
          borderRadius: "16px",
          boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
        }}
      >
      <Card
        title={
          <span style={{ color: "#333", fontSize: "22px", fontWeight: "bold" }}>
            <HomeOutlined style={{ color: "#ff4d4f" }} /> 🏨 Hostel Room Availability
          </span>
        }
        bordered={false}
        style={{
          width: "1100px",
          boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
          borderRadius: "16px",
          background: "#fff",
          padding: "40px",
        }}
      >
        {loading ? (
          <Spin tip="Loading room details..." />
        ) : error ? (
          <Alert message={error} type="error" showIcon />
        ) : (
          <>
            {/* Room Stats */}
            <Row gutter={[16, 16]} style={{ marginBottom: "20px" }}>
  <Col span={8}>
    <Card bordered={false} style={{ textAlign: "center", background: "#d9f7be", color: "#333" }}>
      <Statistic title="Available Rooms" value={availableRooms} valueStyle={{ color: "#389e0d" }} />
    </Card>
  </Col>
  <Col span={8}>
    <Card bordered={false} style={{ textAlign: "center", background: "#bae7ff", color: "#333" }}>
      <Statistic title="AC Rooms" value={acRooms} valueStyle={{ color: "#096dd9" }} />
    </Card>
  </Col>
  <Col span={8}>
    <Card bordered={false} style={{ textAlign: "center", background: "#ffccc7", color: "#333" }}>
      <Statistic title="Non-AC Rooms" value={nonAcRooms} valueStyle={{ color: "#cf1322" }} />
    </Card>
  </Col>
</Row>


            {/* Chart */}
          

            {/* Table */}
            <Table
              columns={columns}
              dataSource={registrations}
              rowKey="user_id"
              size="small"
              pagination={{ pageSize: 5 }}
              style={{ borderRadius: "10px", overflow: "hidden" }}
            />
          </>
        )}
      </Card>
    </div></div>
  );
};

export default RoomDetailsAdmin;
