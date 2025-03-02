import { useState, useEffect } from "react";
import axios from "axios";
import { Table, message, Card, Tag } from "antd";
import { 
  IdcardOutlined, 
  FileTextOutlined, 
  CalendarOutlined, 
  CheckCircleOutlined, 
  ClockCircleOutlined, 
  CloseCircleOutlined 
} from "@ant-design/icons";

const Complaints = ({ id }) => {
  const [complaints, setComplaints] = useState([]);

  const fetchComplaints = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/complaints/${id}`);
      setComplaints(response.data);
    } catch (error) {
      message.error("Failed to fetch complaints");
    }
  };

  useEffect(() => {
    fetchComplaints();
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
      title: "📢 Complaint",
      dataIndex: "complaint",
      key: "complaint",
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
    },
    {
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
        marginLeft: "800px",
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
          title={<span style={{ color: "#333", fontSize: "22px", fontWeight: "bold" }}>📢 User Complaints</span>}
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
            dataSource={complaints}
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

export default Complaints;
