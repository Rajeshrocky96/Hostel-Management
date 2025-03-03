import React, { useState, useEffect } from "react";
import { Table, Spin, Card, Typography, Row, Col, Statistic } from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  UserOutlined,
  MailOutlined,
  ApartmentOutlined,
  CalendarOutlined,
  SmileOutlined,
  FrownOutlined,
} from "@ant-design/icons";
import moment from "moment";
import showToastAlert from "../ShowAlert";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const { Title, Text } = Typography;

const Attendance = ({ id }) => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState({ name: "", email: "", department: "" });

  useEffect(() => {
    if (id) {
      fetchAttendance();
    }
  }, [id]);

  const fetchAttendance = async () => {
    setLoading(true);
 
    try {
      const response = await fetch(`http://localhost:5000/user_attendance?user_id=${id}`);
      const data = await response.json();

      if (response.ok) {
        if (data.length > 0) {
          setUserInfo({
            name: data[0].name,
            email: data[0].email,
            department: data[0].department,
          });
          setAttendance(data);
        } 
      } else {
    
        // showToastAlert(data.error || "Error fetching attendance records.", "error");
      }
    } catch (err) {
      console.error("Error fetching attendance:", err);
      // showToastAlert("Error fetching attendance records.", "error");
    } finally {
      setLoading(false);
    }
  };

  const presentDays = attendance.filter((a) => a.status === "Present").length;
  const absentDays = attendance.filter((a) => a.status === "Absent").length;

  const columns = [
    {
      title: <Text strong><CalendarOutlined /> Date</Text>,
      dataIndex: "attendance_date",
      key: "date",
      render: (text) => moment(text).format("YYYY-MM-DD"),
    },
    {
      title: <Text strong>Status</Text>,
      dataIndex: "status",
      key: "status",
      render: (status) =>
        status === "Present" ? (
          <span><CheckCircleOutlined style={{ color: "green", fontSize: 18 }} /> Present</span>
        ) : (
          <span><CloseCircleOutlined style={{ color: "red", fontSize: 18 }} /> Absent</span>
        ),
    },
  ];

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "2vh",
        padding: 20,
        marginLeft: "700px",
        marginTop: "10px",
      }}
    >
      <div
        style={{
          background: "linear-gradient(135deg, #ff758c, #ff7eb3)",
          padding: "30px",
          borderRadius: "16px",
          width: "1000px",
         
          boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
        }}
      >
        <Card style={{ borderRadius: "12px" }}>
          <Title level={3} style={{ textAlign: "center", color: "#333" }}>
            📅 Attendance Record
          </Title>

          {loading ? (
            <div style={{ textAlign: "center", padding: "20px" }}>
              <Spin tip="Loading..." size="large" />
            </div>
          ) : (
            <>
              {/* User Info Card */}
              <Card style={{ background: "#f9f9f9", borderRadius: 8, marginBottom: 20 }}>
                <Row gutter={[16, 16]}>
                  <Col span={8} style={{ display: "flex", alignItems: "center" }}>
                    <UserOutlined style={{ fontSize: 20, color: "#1890ff" }} />
                    <Text style={{ marginLeft: 8, fontWeight: 600 }}>{userInfo.name}</Text>
                  </Col>
                  <Col span={8} style={{ display: "flex", alignItems: "center" }}>
                    <MailOutlined style={{ fontSize: 20, color: "#52c41a" }} />
                    <Text style={{ marginLeft: 8, fontWeight: 600 }}>{userInfo.email}</Text>
                  </Col>
                  <Col span={8} style={{ display: "flex", alignItems: "center" }}>
                    <ApartmentOutlined style={{ fontSize: 20, color: "#faad14" }} />
                    <Text style={{ marginLeft: 10, fontWeight: 600 }}>{userInfo.department}</Text>
                  </Col>
                </Row>
              </Card>

              {/* Attendance Summary */}
              <Row gutter={16} style={{ marginBottom: 20 }}>
                <Col span={12}>
                  <Card
                    style={{
                      background: "#d4edda",
                      borderColor: "#c3e6cb",
                      textAlign: "center",
                      borderRadius: 8,
                    }}
                  >
                    <Statistic
                      title="Days Present"
                      value={presentDays}
                      valueStyle={{ color: "green" }}
                      prefix={<SmileOutlined />}
                    />
                  </Card>
                </Col>
                <Col span={12}>
                  <Card
                    style={{
                      background: "#f8d7da",
                      borderColor: "#f5c6cb",
                      textAlign: "center",
                      borderRadius: 8,
                    }}
                  >
                    <Statistic
                      title="Days Absent"
                      value={absentDays}
                      valueStyle={{ color: "red" }}
                      prefix={<FrownOutlined />}
                    />
                  </Card>
                </Col>
              </Row>

              {/* Attendance Table */}
              <Table
                columns={columns}
                dataSource={attendance}
                rowKey="attendance_date"
                pagination={{ pageSize: 5 }}
                size="small"
                style={{
                  background: "#fff",
                  borderRadius: 8,
                  overflow: "hidden",
                }}
              />
            </>
          )}
        </Card>
        <ToastContainer />
      </div>
    </div>
  );
};

export default Attendance;
