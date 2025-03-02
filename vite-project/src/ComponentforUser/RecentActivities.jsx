import { useState, useEffect } from "react";
import axios from "axios";
import { Table, message, Card, Tag } from "antd";
import { CalendarOutlined, SyncOutlined, IdcardOutlined, ClockCircleOutlined, CloseCircleOutlined, CheckCircleOutlined } from "@ant-design/icons";

const RecentActivities = ({ id }) => {
  const [activities, setActivities] = useState([]);

  const fetchActivities = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/recent-activities/${id}`);
      setActivities(response.data);
    } catch (error) {
      message.error("Failed to fetch recent activities");
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const columns = [
    {
      title: <span style={{ color: "#ff4d4f" }}>🔢 ID</span>,
      dataIndex: "id",
      key: "id",
      width: 100,
      render: (text) => (
        <span>
          <IdcardOutlined style={{ color: "#ff4d4f", marginRight: 8 }} />
          {text}
        </span>
      ),
    },
    {
      title: <span style={{ color: "#1890ff" }}>🔄 Activity</span>,
      dataIndex: "activity",
      key: "activity",
      render: (text) => (
        <span>
          <SyncOutlined style={{ color: "#1890ff", marginRight: 8 }} />
          {text}
        </span>
      ),
    },
    {
      title: <span style={{ color: "#52c41a" }}>📅 Date</span>,
      dataIndex: "date",
      key: "date",
      render: (text) => (
        <span>
          <CalendarOutlined style={{ color: "#52c41a", marginRight: 8 }} />
          {text}
        </span>
      ),
    }, {
      title: "📌 Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color, icon;
        switch (status) {
          case "Resolved":
            color = "green";
            icon = <CheckCircleOutlined />;
            break;
          case "Rejected":
            color = "red";
            icon = <CloseCircleOutlined />;
            break;
          default:
            color = "gold";
            icon = <ClockCircleOutlined />;
        }
        return (
          <Tag color={color} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            {icon} {status}
          </Tag>
        );
      },
    },
  ];

  return (
    <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "20vh",
      padding: 20,
       marginLeft:"800px"
    }}
  >
    {/* Gradient Background Only Around the Card */}
    <div
      style={{
        background: "linear-gradient(135deg, #667eea, #764ba2)",
        padding: "40px",
        borderRadius: "16px",
        boxShadow: "0 8px 16px rgba(0,0,0,0.2)",

      }}
    >
      <Card
        title={<span style={{ color: "#333", fontSize: "22px", fontWeight: "bold" }}>📌 Recent Activities</span>}
        bordered={false}
        style={{
          width: "1000px",
          boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
          borderRadius: "12px",
          background: "#fff",
          padding: "40px",
        }}
      >
        <Table
          dataSource={activities}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 5 }}
          style={{
            minWidth: "90%",
            borderRadius: "10px",
            overflow: "hidden",
          }}
        />
      </Card>
    </div>
  </div>
  
  );
};

export default RecentActivities;
