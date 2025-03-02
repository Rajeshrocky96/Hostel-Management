import { useState, useEffect } from "react";
import axios from "axios";
import { Table, message, Card, Tag } from "antd";
import { IdcardOutlined, FileTextOutlined, CalendarOutlined, CheckCircleOutlined, CloseCircleOutlined, ClockCircleOutlined } from "@ant-design/icons";

const Requests = ({ id }) => {
  const [requests, setRequests] = useState([]);

  const fetchRequests = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/requests/${id}`);
      setRequests(response.data);
    } catch (error) {
      message.error("Failed to fetch requests");
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const columns = [
    {
      title: "🔍 ID",
      dataIndex: "id",
      key: "id",
      render: (text) => (
        <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <IdcardOutlined style={{ color: "#ff4d4f" }} />
          {text}
        </span>
      ),
    },
    {
      title: "📩 Request",
      dataIndex: "request",
      key: "request",
      render: (text) => (
        <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <FileTextOutlined style={{ color: "#1890ff" }} />
          {text}
        </span>
      ),
    },
    {
      title: "📅 Date",
      dataIndex: "date",
      key: "date",
      render: (text) => (
        <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <CalendarOutlined style={{ color: "#52c41a" }} />
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
        minHeight: "80vh",
        padding: 20,
        marginLeft:"800px"
      }}
    >
      {/* Gradient Box Centered Around Card */}
      <div
        style={{
          background: "linear-gradient(135deg, #36d1dc, #5b86e5)",
          padding: "40px",
          borderRadius: "16px",
          boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
        }}
      >
        <Card
          title={<span style={{ color: "#333", fontSize: "22px", fontWeight: "bold" }}>📩 User Requests</span>}
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
            dataSource={requests}
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

export default Requests;
