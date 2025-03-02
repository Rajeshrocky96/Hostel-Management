import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Card, Input, Button, Typography } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import showToastAlert from "./ShowAlert";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UserDashboard from "./UserDashboard";
import AdminDashboard from "./AdminDashboard";

const { Title, Text } = Typography;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [afterSignup, setAfterSignup] = useState(false);
  const navigate = useNavigate();
  // ✅ Clear fields when switching between Login and Sign Up
  const toggleForm = () => {
    setIsRegistering(!isRegistering);
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setAfterSignup(false);
  };

  // ✅ Handle Login
  const handleLogin = async () => {
    if (!email || !password) {
      showToastAlert("Please enter your email and password", "warning");
      return;
    }
  
    console.log("Attempting login with:", { email, password });
  
    try {
      const response = await axios.post("http://localhost:5000/login", {
        email,
        password,
      });
  
      console.log("Login Response:", response.data);
  
      if (response.data.token) {
        const { token, user } = response.data;
  
        localStorage.setItem("token", token);
        localStorage.setItem("id", user.id);
        localStorage.setItem("email", user.email);
        localStorage.setItem("role", user.role);
  
        console.log("Stored in localStorage:", {
          token,
          id: user.id,
          email: user.email,
          role: user.role,
        });
  
        showToastAlert("Login successful!", "success");
       
        setTimeout(() => {
          navigate(user.role === "admin" ? "/admin-dashboard" : "/user-dashboard", {
            state: { email: user.email },
          });
        }, 1000);
      }
    } catch (error) {

      showToastAlert(error.response?.data.message, "error");
    }
  };
  
  

  // ✅ Handle Register
  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      showToastAlert("Please fill in all fields", "warning");
      return;
    }

    if (password !== confirmPassword) {
      showToastAlert("Passwords do not match!", "error");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/register", {
        email,
        password,
        role: "user",
      });

      if (response.data) {
        showToastAlert("User registered successfully!", "success");
        setAfterSignup(true);
      }
    } catch (error) {
      showToastAlert(error.response?.data?.message || "Registration failed", "error");
    }
  };

  return (
    <div style={{ marginLeft: "500px" }}>
    <Card
      title={
        <Title level={3} style={{ textAlign: "center", marginBottom: 10 }}>
          {isRegistering ? "Create Account" : "Welcome Back!!!"}
        </Title>
      }
      bordered={false}
      style={{
        width: 420,
        padding: "30px",
        borderRadius: "15px",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
        background: "#fff",

      }}
    >
      {/* Email Input */}
      <Input
        size="large"
        placeholder="UserName"
        prefix={<MailOutlined style={{ color: "#1890ff" }} />}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ marginBottom: "15px" }}
      />

      {/* Password Input */}
      <Input.Password
        size="large"
        placeholder="Password"
        prefix={<LockOutlined style={{ color: "#1890ff" }} />}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ marginBottom: "15px" }}
      />

      {/* Confirm Password (Only for Registration) */}
      {isRegistering && (
        <Input.Password
          size="large"
          placeholder="Confirm Password"
          prefix={<LockOutlined style={{ color: "#1890ff" }} />}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          style={{ marginBottom: "12px" }}
        />
      )}

        {!isRegistering && (
            <span
              onClick={() => navigate("/forgot-password")}
            style={{ color: "#ff4d4f", cursor: "pointer", display: "block", textAlign: "right" }}
            >
              Forgot Password?
            </span>
         )}

      {/* Buttons */}
      {isRegistering ? (
        <>
          <Button
            type="primary"
            block
            size="large"
            style={{ background: "#52c41a", borderColor: "#52c41a", marginBottom: "15px" }}
            onClick={handleRegister}
          >
            Sign Up
          </Button>

          {afterSignup && (
            <div className="text-center text-green-600">
              <Text type="success">Registered successfully!</Text>
            </div>
          )}

          <p className="text-center">
            Already have an account?{" "}
            <span
              className="cursor-pointer"
              onClick={toggleForm}
              style={{ color: "#1890ff", fontWeight: "bold", cursor: "pointer" }}
            >
              Login
            </span>
          </p>
        </>
      ) : (
        <>
          <Button
            type="primary"
            block
            size="large"
            style={{ background: "#1890ff", borderColor: "#1890ff", marginBottom: "15px" }}
            onClick={handleLogin}
          >
            Login
          </Button>

          <p className="text-center" style={{textAlign:"center"}}>
            New user?
            <span
              className="cursor-pointer"
              onClick={toggleForm}
              style={{ color: "#1890ff", fontWeight: "bold", cursor: "pointer" }}
            >
              Sign Up
            </span>
          </p>

         
        </>
      )}
    </Card>

    {/* Toast Notification */}
    <ToastContainer />
    </div>
  );
};

export default Login;
