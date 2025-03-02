import React, { useEffect, useState } from "react";
import { Table, Button, Select, message, DatePicker, Card, Spin, Alert } from "antd";
import { CalendarOutlined, UserOutlined, CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import moment from "moment";
import showToastAlert from "../ShowAlert";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const { Option } = Select;

const UserAttendanceAdmin = () => {
  const [users, setUsers] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:5000/matched-users`);
      const data = await response.json();
      if (Array.isArray(data)) {
        setUsers(data);
      } else {
        setError("Invalid data format received.");
      }
    } catch (err) {
      setError("Error fetching user data.");
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (date) => {
    if (!date) return;
    setSelectedDate(date);
    setAttendance({});
  };

  const disabledDate = (current) => {
    return current && current > moment().endOf("day");
  };

  const markAttendance = async () => {
    if (!selectedDate) {
      showToastAlert("Please select a date.", "error");
      return;
    }

    const date = new Date(selectedDate);
    const options = { year: "numeric", month: "2-digit", day: "2-digit", timeZone: "Asia/Kolkata" };
    const formattedDate = new Intl.DateTimeFormat("en-CA", options).format(date);

    const requests = Object.entries(attendance).map(async ([user_id, status]) => {
      try {
        const checkResponse = await fetch(
          `http://localhost:5000/check-attendance?user_id=${user_id}&date=${formattedDate}`
        );
        const checkData = await checkResponse.json();

        if (checkData.exists) {
          const updateResponse = await fetch("http://localhost:5000/update-attendance", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id, attendance_date: formattedDate, status }),
          });

          if (!updateResponse.ok) throw new Error("Failed to update attendance");

          showToastAlert("Attendance updated successfully!", "success");
        } else {
          const insertResponse = await fetch("http://localhost:5000/attendance", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id, attendance_date: formattedDate, status }),
          });

          if (!insertResponse.ok) throw new Error("Failed to mark attendance");

          showToastAlert("Attendance marked successfully!", "success");
        }
      } catch (err) {
        showToastAlert("An error occurred while marking attendance.", "error");
      }
    });

    await Promise.all(requests);
    setAttendance({});
    setSelectedDate("");
    fetchUsers();
  };

  const columns = [
    { title: <UserOutlined />, dataIndex: "full_name", key: "full_name" },
    { title: "📧 Email", dataIndex: "email", key: "email" },
    { title: "📞 Number", dataIndex: "number", key: "number" },
    { title: "🏢 Department", dataIndex: "dept", key: "dept" },
    {
      title: "📊 Attendance",
      key: "attendance",
      render: (_, record) => (
        <Select
          style={{ width: 120 }}
          value={attendance[record.id] || "Mark"}
          onChange={(value) => setAttendance((prev) => ({ ...prev, [record.id]: value }))}
        >
          <Option value="Present">
            <CheckCircleOutlined style={{ color: "green" }} /> Present
          </Option>
          <Option value="Absent">
            <CloseCircleOutlined style={{ color: "red" }} /> Absent
          </Option>
        </Select>
      ),
    },
  ];

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "20vh",
          padding: 20,
          marginLeft: "600px",
          marginTop: "100px",
        }}
      >
        <div
          style={{
            background: "linear-gradient(135deg, #1e90ff, #87ceeb)",
            padding: "40px",
            borderRadius: "16px",
            boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
          }}
        >
          <Card
            title={
              <span style={{ fontSize: "20px", fontWeight: "bold" }}>
                📅 Manage User Attendance
              </span>
            }
            style={{ maxWidth: 1000, margin: "20px auto" }}
          >
            <div style={{ marginBottom: 16 }}>
              <DatePicker
                value={selectedDate}
                onChange={handleDateChange}
                disabledDate={disabledDate}
                style={{ width: "100%", padding: "10px", borderRadius: "8px" }}
                suffixIcon={<CalendarOutlined style={{ color: "#1890ff" }} />}
              />
            </div>

            {loading ? (
              <Spin tip="Loading users..." />
            ) : error ? (
              <Alert message={error} type="error" showIcon />
            ) : (
              <div style={{ width: "800px" }}>
                <Table columns={columns} dataSource={users} size="small" pagination={{ pageSize: 5 }} />
              </div>
            )}

            <Button
              type="primary"
              onClick={markAttendance}
              disabled={!selectedDate || Object.keys(attendance).length === 0}
              style={{
                marginTop: 16,
                marginLeft: "300px",
                fontWeight: "bold",
                padding: "10px 20px",
                borderRadius: "8px",
              }}
            >
              ✅ Submit Attendance
            </Button>
          </Card>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default UserAttendanceAdmin;
