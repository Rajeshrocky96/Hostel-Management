import React, { useState, useEffect } from "react";
import { Card, Typography, Spin, Alert } from "antd";
import showToastAlert from "../ShowAlert";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const { Text } = Typography;

const MessDetails = ({ id }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [attendanceSummary, setAttendanceSummary] = useState({ present: 0, absent: 0, totalBill: 0 });

  useEffect(() => {
    if (id) {
      fetchMessDetails();
    }
  }, [id]);

  const fetchMessDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:5000/mess_details?user_id=${id}`);
      const data = await response.json();

      if (response.ok) {
        if (data.attendance.length > 0 && data.hostel) {
          const presentCount = data.attendance.filter((entry) => entry.status === "Present").length;
          const messRate = data.hostel.mess_type.toLowerCase() === "non-veg" ? 300 : 200;
          const totalBill = presentCount * messRate;

          setAttendanceSummary({ present: presentCount, absent: data.attendance.length - presentCount, totalBill });
        } else {
          setError("No mess or attendance records found.");
          showToastAlert("error", "No mess or attendance records found.");
        }
      } else {
        setError(data.error || "Error fetching mess details.");
        showToastAlert("error", data.error || "Error fetching mess details.");
      }
    } catch (err) {
      setError("Error fetching mess details.");
      showToastAlert("error", "Error fetching mess details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card
        bordered={false}
        style={{
          maxWidth: 500,
          margin: "20px auto",
          padding: "20px",
          background: "#ffffff",
          borderRadius: 12,
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
          textAlign: "center",
        }}
      >
        {loading ? (
          <Spin size="large" style={{ display: "block", margin: "20px auto" }} />
        ) : error ? (
          <Alert message={error} type="error" showIcon />
        ) : (
          <Card
            style={{
              background: "linear-gradient(135deg, #ff758c 10%, #ff7eb3 100%)",
              borderRadius: 8,
              padding: "15px",
              textAlign: "center",
              boxShadow: "0 3px 8px rgba(0,0,0,0.2)",
              maxWidth: 220,
              margin: "auto",
            }}
          >
            <Text strong style={{ fontSize: "16px", color: "#fff", letterSpacing: "0.5px" }}>
              Total Mess Bill
            </Text>
            <div style={{ fontSize: "18px", fontWeight: "bold", color: "#fff", marginTop: 5 }}>
              ₹{attendanceSummary.totalBill}
            </div>

            {attendanceSummary.totalBill > 0 && (
              <button
              disabled
                href={`http://localhost:5000/payment?user_id=${id}`}
                style={{
                  display: "inline-block",
                  marginTop: 10,
                  padding: "8px 15px",
                  background: "#fff",
                  color: "blue",
                  borderRadius: 5,
                  textDecoration: "none",
                  fontWeight: "bold",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
                  transition: "0.3s",
                }}
                onMouseOver={(e) => (e.target.style.background = "#ffe5e9")}
                onMouseOut={(e) => (e.target.style.background = "#fff")}
              >
                Click here to Pay
              </button>
            )}
          </Card>
        )}
      </Card>
      <ToastContainer />
    </>
  );
};

export default MessDetails;
