import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, Popconfirm, message } from "antd";
import {
  DeleteOutlined,
  UserOutlined,
  MailOutlined,
  IdcardOutlined,
  ApartmentOutlined,
} from "@ant-design/icons";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import showToastAlert from "./ShowAlert"; // Ensure this is correctly imported

const AdminSettings = () => {
  const [users, setUsers] = useState([]);

  // Fetch Users Data
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/users")
      .then((response) => {
        console.log("Fetched Users:", response.data);
        setUsers(response.data.map((user) => ({ ...user, key: user.user_id })));
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
        message.error("Failed to fetch users.");
      });
  }, []);

  // Delete User Function
  const handleDelete = async (userId) => {
    console.log("Deleting user:", userId);
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/delete-user/${userId}`
      );

      if (response.status === 200) {
        showToastAlert("User deleted successfully!", "success");
        setUsers(users.filter((user) => user.user_id !== userId));
      } else {
        showToastAlert("Failed to delete user.", "error");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      showToastAlert("An error occurred while deleting the user.", "error");
    }
  };

  // Define Columns for Ant Design Table
  const columns = [
    {
      title: "S.No",
      dataIndex: "index",
      key: "index",
      align: "center",
      width: 60,
      render: (text, record, index) => (
        <strong style={{ color: "#4CAF50" }}>{index + 1}</strong>
      ),
    },
    {
      title: (
        <span style={{ color: "#FF5722" }}>
          <IdcardOutlined style={{ color: "#FF5722", marginRight: 5 }} />
          User ID
        </span>
      ),
      dataIndex: "user_id",
      key: "user_id",
      align: "center",
    },
    {
      title: (
        <span style={{ color: "#3F51B5" }}>
          <UserOutlined style={{ color: "#3F51B5", marginRight: 5 }} />
          Username
        </span>
      ),
      dataIndex: "full_name",
      key: "full_name",
      align: "center",
    },
    {
      title: (
        <span style={{ color: "#009688" }}>
          <ApartmentOutlined style={{ color: "#009688", marginRight: 5 }} />
          Department
        </span>
      ),
      dataIndex: "department",
      key: "department",
      align: "center",
    },
    {
      title: (
        <span style={{ color: "#E91E63" }}>
          <MailOutlined style={{ color: "#E91E63", marginRight: 5 }} />
          Email
        </span>
      ),
      dataIndex: "email",
      key: "email",
      align: "center",
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      render: (text, record) => (
        <Popconfirm
          title="Are you sure you want to delete this user?"
          onConfirm={() => handleDelete(record.user_id)}
          okText="Yes"
          cancelText="No"
          okButtonProps={{ danger: true }}
        >
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            style={{
              transition: "0.3s",
              borderRadius: "8px",
              backgroundColor: "#F44336",
              borderColor: "#F44336",
            }}
            onMouseEnter={(e) =>
              (e.target.style.backgroundColor = "#D32F2F")
            }
            onMouseLeave={(e) =>
              (e.target.style.backgroundColor = "#F44336")
            }
          />
        </Popconfirm>
      ),
    },
  ];

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "30vh",
        padding: 20,
        marginLeft: "200px",
        marginTop: "-20px",
        borderRadius: "16px",
        background: "linear-gradient(135deg, #1e3c72, #2a5298)", // Deep Blue Gradient
      }}
    >
      <div
        style={{
          background: "white",
          padding: "40px",
          borderRadius: "16px",
          boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
          maxWidth: "900px",
          width: "100%",
          
        }}
      >
        <h2
          style={{
            textAlign: "center",
            marginBottom: 20,
            fontSize: "24px",
            fontWeight: "bold",
            background: "linear-gradient(90deg, #ff758c, #ff7eb3)",
            WebkitBackgroundClip: "text",
            color: "transparent",
          }}
        >
          Admin Settings - Manage Users
        </h2>
        <div><Table
          columns={columns}
          dataSource={users}
          rowKey="user_id"
          bordered
          size="small"
          pagination={{ pageSize: 5 }}
          style={{
            backgroundColor: "white",
            width: "100%",
            borderRadius: 10,
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          }}
        /></div>
        
        <ToastContainer />
      </div>
    </div>
  );
};

export default AdminSettings;
