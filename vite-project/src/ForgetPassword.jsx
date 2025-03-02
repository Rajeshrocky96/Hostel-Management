import React, { useState } from "react";
import { Input, Button, Card, Typography, Space, Divider, Modal } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import showToastAlert from "./ShowAlert";
import { ToastContainer } from "react-toastify";

const { Title, Text } = Typography;

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [afterReset, setAfterReset] = useState(false);
  const navigate = useNavigate();

  const handleForgotPassword = async () => {
    if (!email) {
      showToastAlert("Please enter your UserName.", "error");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/forgot-password", { email });

      if (response.data.exists) {
        setIsModalVisible(true);
        showToastAlert("UserName found. You can reset your password.", "success");
      } else {
        showToastAlert("UserName does not exist.", "error");
      }
    } catch (error) {
      showToastAlert(error.response?.data.message , "error");
    }
  };

  const handleResetPassword = async () => {
    if (!password || !confirmPassword) {
      showToastAlert("Please fill in all fields", "warning");
      return;
    }

    if (password !== confirmPassword) {
      showToastAlert("Passwords do not match!", "error");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/reset-password", {
        email,
        password,
        confirmPassword,
      });

      if (response.status === 200) {
        showToastAlert("Password updated successfully!", "success");

        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setAfterReset(true);

      } else {
        showToastAlert("Failed to update password. Try again.", "error");
      }
    } catch (error) {
      setIsModalVisible(false);
      showToastAlert(error.response?.data?.message || "Error updating password.", "error");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Card
        style={{
          width: 400,
          textAlign: "center",
          borderRadius: 12,
          boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
           marginLeft:"500px"
        }}
      >
        <Title level={3} style={{ marginBottom: 20, color: "#1890ff" }}>
          Forgot Password?
        </Title>
        <Text type="secondary">Enter your email address to reset your password.</Text>

        <Divider />
        <Input
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ marginBottom: 15, borderRadius: 8 }}
        />
        <Button type="primary" block onClick={handleForgotPassword} style={{ borderRadius: 8 }}>
          Check Username
        </Button>
      </Card>

      {/* Modal for Reset Password */}
      <Modal
  title={
    <Title level={3} style={{ color: "#1890ff", marginBottom: 0, textAlign: "center" }}>
      Reset Password
    </Title>
  }
  open={isModalVisible}
  footer={null}
  onCancel={() => setIsModalVisible(false)}
  centered
  width={360} // Slightly wider for better alignment
  bodyStyle={{ padding: "20px 24px", textAlign: "center" }} // Center content properly
>
  <Space direction="vertical" style={{ width: "100%", gap: 10 }}>
    <Input.Password
      placeholder="Enter new password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      style={{
        width: "100%",
        height: 38,
        borderRadius: 6,
        borderColor: "#d9d9d9",
        transition: "0.3s",
      }}
    />
    <Input.Password
      placeholder="Confirm new password"
      value={confirmPassword}
      onChange={(e) => setConfirmPassword(e.target.value)}
      style={{
        width: "100%",
        height: 38,
        borderRadius: 6,
        borderColor: "#d9d9d9",
        transition: "0.3s",
      }}
    />
    <Button
      type="primary"
      block
      onClick={handleResetPassword}
      style={{
        height: 42,
        borderRadius: 6,
        fontWeight: "bold",
        background: "#1890ff",
        transition: "0.3s",
      }}
      hover={{ background: "#40a9ff" }} // Interactive hover effect
    >
      Reset Password
    </Button>
  </Space>

  {afterReset && (
    <div style={{ marginTop: 15, textAlign: "center" }}>
      <Text style={{ color: "green", fontWeight: "bold", fontSize: 14 }}>
        ✅ Password changed successfully!
      </Text>
      <br />
      <Text
        onClick={() => navigate("/login")}
        style={{
          color: "#1890ff",
          cursor: "pointer",
          fontWeight: "bold",
          fontSize: 14,
          transition: "0.3s",
        }}
        onMouseEnter={(e) => (e.target.style.color = "#40a9ff")}
        onMouseLeave={(e) => (e.target.style.color = "#1890ff")}
      >
        🔗 Go to login page
      </Text>
    </div>
  )}
</Modal>



      <ToastContainer />
    </div>
  );
};

export default ForgotPassword;
