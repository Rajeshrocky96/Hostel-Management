import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Select, message, Card, Tag } from "antd";
import {
  IdcardOutlined,
  UserOutlined,
  FileTextOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  EditOutlined,
} from "@ant-design/icons";

const RequestAdmin = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [status, setStatus] = useState("");

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/admin/requests");
      const result = await response.json();
      setRequests(result);
    } catch (error) {
      message.error("Failed to fetch requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleUpdateStatus = async () => {
    if (!status) {
      message.warning("Please select a status.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/admin/update-request/${selectedRequest.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        }
      );

      if (response.ok) {
        message.success("Request status updated successfully!");
        fetchRequests();
        setIsModalVisible(false);
      } else {
        message.error("Failed to update request.");
      }
    } catch (error) {
      message.error("Error updating request.");
    }
  };

  const openModal = (request) => {
    setSelectedRequest(request);
    setStatus(request.status);
    setIsModalVisible(true);
  };

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
          title: "👤 User",
          dataIndex: "user_name", // Updated from "user_id"
          key: "user_name",
          render: (text) => (
            <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <UserOutlined style={{ color: "#1890ff" }} />
              {text}
            </span>
          ),
        },
    {
      title: "📢 Request",
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
         render: (text) => {
           const formattedDate = new Date(text).toISOString().split("T")[0]; // Extract only YYYY-MM-DD
           return (
             <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
               <CalendarOutlined style={{ color: "#52c41a" }} />
               {formattedDate}
             </span>
           );
         },
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
    {
      title: "⚡ Action",
      key: "action",
      render: (_, record) => (
        <Button type="primary" onClick={() => openModal(record)}>
          <EditOutlined/>
        </Button>
      ),
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
        marginLeft: "600px",
        marginTop:"100px"
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
          title={<span style={{ color: "#333", fontSize: "22px", fontWeight: "bold" }}>📋 Manage Requests</span>}
          bordered={false}
          style={{
            width: "1000px",
            boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
            borderRadius: "12px",
            background: "#fff",
            padding: "40px",
          }}
        >
          <Table dataSource={requests} size="small" columns={columns} rowKey="id" loading={loading} pagination={{ pageSize: 5 }} />
        </Card>
      </div>

      {/* Status Update Modal */}
      <Modal
        title="Update Request Status"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleUpdateStatus}
      >
        <p>
          <strong>Request:</strong> {selectedRequest?.request}
        </p>
        <p>
          <strong>Date:</strong> {selectedRequest?.date}
        </p>
        <Select
          value={status}
          style={{ width: "100%" }}
          onChange={(value) => setStatus(value)}
        >
          <Select.Option value="Pending">Pending</Select.Option>
          <Select.Option value="Resolved">Resolved</Select.Option>
          <Select.Option value="Rejected">Rejected</Select.Option>
        </Select>
      </Modal>
    </div>
  );
};

export default RequestAdmin;
