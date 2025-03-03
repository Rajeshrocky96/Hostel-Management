import React, { useState, useEffect } from "react";
import { Card, Typography, Spin, Alert } from "antd";
import Chart from "react-apexcharts";
import showToastAlert from "../ShowAlert";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const { Text } = Typography;

const AttendCard = ({ id }) => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userInfo, setUserInfo] = useState({ name: "", email: "", department: "" });

  useEffect(() => {
    if (id) {
      fetchAttendance();
    }
  }, [id]);

  const fetchAttendance = async () => {
    setLoading(true);
    setError(null);
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
        } else {
          setError("No attendance records found.");
          showToastAlert("error", "No attendance records found.");
        }
      } else {
        setError(data.error || "Error fetching attendance records.");
        showToastAlert("error", data.error || "Error fetching attendance records.");
      }
    } catch (err) {
      setError("Error fetching attendance records.");
      showToastAlert("error", "Error fetching attendance records.");
    } finally {
      setLoading(false);
    }
  };

  const presentDays = attendance.filter((a) => a.status === "Present").length;
  const absentDays = attendance.filter((a) => a.status === "Absent").length;

  const chartOptions = {
    options: {
      labels: ["Present", "Absent"],
      colors: ["#36CFC9", "#FAAD14"], // Modern color palette
      legend: { position: "bottom" },
      dataLabels: {
        enabled: true,
        style: {
          fontSize: "14px",
          fontWeight: "bold",
          colors: ["#fff"],
        },
      },
    },
    series: [presentDays, absentDays],
  };

  return (
    <div>
      <Card
        bordered={false}
        style={{
          maxWidth: 400,
          margin: "20px auto",
          padding: "20px",
          borderRadius: 12,
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
          background: "#ffffff",
        }}
      >
        {loading ? (
          <Spin size="large" style={{ display: "block", margin: "20px auto" }} />
        ) :  (
          <>
            {/* Donut Chart for Attendance */}
            <Card
              style={{
                background: "#f0f2f5",
                padding: "10px",
                borderRadius: 8,
                textAlign: "center",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Chart options={chartOptions.options} series={chartOptions.series} type="donut" width={320} height={170} />
            </Card>
          </>
        )}
      </Card>
      <ToastContainer />
    </div>
  );
};

export default AttendCard;
