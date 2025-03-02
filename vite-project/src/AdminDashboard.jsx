import React, { useEffect, useState } from "react";
import {
  Layout,
  Menu,
  Button,
  Dropdown,
  Typography,
  Card,
  Row,
  Col,
  Statistic,
  Avatar,
} from "antd";
import { useNavigate } from "react-router-dom";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  LogoutOutlined,
  BarChartOutlined,
  SolutionOutlined,
  TeamOutlined,
  HomeOutlined,
  CheckCircleOutlined,
  QuestionCircleOutlined,
  ExclamationCircleOutlined,
  MessageOutlined,
  FileTextOutlined,
  CloseCircleOutlined,
  WarningOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import AdminSetting from "./AdminSetting";
import axios from "axios";
import ComplaintAdmin from "./ComponentforAdmin/ComplaintAdmin";
import RecentActivitiesAdmin from "./ComponentforAdmin/RecentActivitiesAdmin";
import RequestAdmin from "./ComponentforAdmin/UserRequestsAdmin";
import RoomDetailsAdmin from "./ComponentforAdmin/RoomDetailsAdmin";
import Chart from "react-apexcharts";
import UserMessDetailsAdmin from "./ComponentforAdmin/UserMessDetailsAdmin";
import UserAttendanceAdmin from "./ComponentforAdmin/UserAttendanceAdmin";

const { Header, Sider, Content } = Layout;
const { Title,Text } = Typography;

const AdminDashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [activePage, setActivePage] = useState("dashboard");
  const navigate = useNavigate();

  const API_URL = "http://localhost:5000";

  const statistics = {
    users: 120,
    rooms: { ac: 40, nonAc: 60 },
    attendance: 100,
    requests: 25, // Number of requests
    complaints: 15, // Number of complaints
  };

  const userMenu = (
    <Menu
      style={{
        borderRadius: "8px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        padding: "8px",
        minWidth: "180px",
      }}
    >
      <Menu.Item
        key="settings"
        icon={
          <UserOutlined
            style={{
              fontSize: "16px",
              transition: "transform 0.2s ease-in-out",
            }}
          />
        }
        onClick={() => setActivePage("settings")}
        style={{
          padding: "10px 15px",
          borderRadius: "6px",
          fontWeight: "bold",
          transition: "0.3s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "#e6f7ff")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
      >
        Admin Settings
      </Menu.Item>
  
      <Menu.Item
        key="logout"
        icon={
          <LogoutOutlined
            style={{
              fontSize: "16px",
              transition: "transform 0.2s ease-in-out",
            }}
          />
        }
        onClick={() => navigate("/login")}
        style={{
          padding: "10px 15px",
          borderRadius: "6px",
          fontWeight: "bold",
          transition: "0.3s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "#ffe6e6")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
      >
        Logout
      </Menu.Item>
    </Menu>
  );
  
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch users
  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/allusersdetails");
      setUsers(response.data);
     console.log(JSON.stringify(response.data))
    } catch (err) {
      setError("Error fetching users");
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };
  const [totalRequests, setTotalRequests] = useState([]);
  const [totalComplaints, setTotalComplaints] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);

  // Fetch Total Requests
  const fetchTotalRequests = async () => {
    try {
      const response = await axios.get(`${API_URL}/total-requests`);
      setTotalRequests(response.data);
      console.log("r"+JSON.stringify(response.data))
    } catch (error) {
      console.error("Error fetching total requests:", error);
    }
  };

  // Fetch Total Complaints
  const fetchTotalComplaints = async () => {
    try {
      const response = await axios.get(`${API_URL}/total-complaints`);
      setTotalComplaints(response.data);
      // console.log("c"+JSON.stringify(response.data))
    } catch (error) {
      console.error("Error fetching total complaints:", error);
    }
  };

  // Fetch Recent Activities
  const fetchRecentActivities = async () => {
    try {
      const response = await axios.get(`${API_URL}/recent-activity`);
      setRecentActivities(response.data);
      // console.log("a"+JSON.stringify(response.data))
    } catch (error) {
      console.error("Error fetching recent activities:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchTotalRequests();
    fetchTotalComplaints();
    fetchRecentActivities();
    fetchHostelRegistrations();
  }, []);

  const fetchHostelRegistrations = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/hostel-registrations"
      );
      const data = await response.json();

      if (Array.isArray(data)) {
        setRegistrations(data);
      } else {
        setError("Invalid data format received.");
      }
    } catch (err) {
      setError("Error fetching hostel registrations.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  const TOTAL_ROOMS = 50;
  const [registrations, setRegistrations] = useState([]);
  const registeredRooms = registrations.length;
  const availableRooms = TOTAL_ROOMS - registeredRooms;

  // Count AC & Non-AC rooms
  const acRooms = registrations.filter((r) => r.hostel_type === "ac").length;
  const nonAcRooms = registeredRooms - acRooms;

  const chartOptions = {
    chart: {
      type: "bar",
      height: 250,
      toolbar: { show: false }, // Hide default toolbar
      animations: { enabled: true, easing: "easeinout", speed: 800 },
      zoom: { enabled: true }, // Enable zoom for interaction
    },
    plotOptions: {
      bar: {
        borderRadius: 6,
        horizontal: false, // Change to `true` for horizontal bars
        columnWidth: "50%",
        endingShape: "rounded",
      },
    },
    colors: ["#1890ff", "#52c41a", "#f5222d"], // Custom colors for bars
    dataLabels: {
      enabled: true,
      style: { colors: ["#fff"], fontSize: "12px", fontWeight: "bold" },
    },
    tooltip: {
      enabled: true,
      theme: "dark", // Dark mode tooltip
      y: { formatter: (value) => `${value} Rooms` },
    },
    grid: { borderColor: "#ddd", strokeDashArray: 5 },
    xaxis: {
      categories: ["Total Rooms", "Registered Rooms", "Available Rooms"],
      labels: { style: { fontSize: "14px", fontWeight: "bold" } },
    },
    yaxis: { labels: { style: { fontSize: "14px", fontWeight: "bold" } } },
  };

  const chartSeries = [
    { name: "Rooms", data: [TOTAL_ROOMS, registeredRooms, availableRooms] },
  ];
  const cardStyle = {
    textAlign: "center",
    background: "linear-gradient(135deg,rgb(219, 203, 242),rgb(244, 216, 227))",
    borderRadius: 12,
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: "20px",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
  };
  
  const iconStyle = (color) => ({
    fontSize: 50,
    color: color,
    marginBottom: 10,
  });
  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        breakpoint="lg"
        collapsedWidth="0"
        style={{
          background: "#fff",
          boxShadow: "2px 0 5px rgba(0,0,0,0.1)",
          position: "fixed",
          height: "100vh",
          zIndex: 1000,
          transition: "all 0.3s ease-in-out",
          fontWeight: "bold",
        }}
      >
        <div
          style={{
            padding: "16px",
            textAlign: "center",
            fontWeight: "bold",
            fontSize: 18,
          }}
        >
          {!collapsed && (
           <div
           style={{
             fontSize: "22px",
             fontWeight: "bold",
             color: "#333",
             textAlign: "center",
             padding: "10px",
             borderBottom: "3px solid #007bff",
             display: "inline-block",
           }}
         >
           Admin Dashboard
         </div>
         
          )}
        </div>
        <Menu mode="inline" defaultSelectedKeys={["dashboard"]}>
          <Menu.Item
            key="dashboard"
            icon={<BarChartOutlined />}
            onClick={() => setActivePage("dashboard")}
          >
            User Statistics
          </Menu.Item>
          <Menu.Item
            key="attendance"
            icon={<SolutionOutlined />}
            onClick={() => setActivePage("attendance")}
          >
            User Attendance
          </Menu.Item>
          <Menu.Item
            key="rooms"
            icon={<HomeOutlined />}
            onClick={() => setActivePage("rooms")}
          >
            Rooms
          </Menu.Item>
          <Menu.Item
            key="requests"
            icon={<TeamOutlined />}
            onClick={() => setActivePage("requests")}
          >
            User Requests
          </Menu.Item>
          <Menu.Item
            key="complaints"
            icon={<MessageOutlined />}
            onClick={() => setActivePage("complaints")}
          >
            Complaints
          </Menu.Item>
          <Menu.Item
            key="RecentActivities"
            icon={<MessageOutlined />}
            onClick={() => setActivePage("recentactivities")}
          >
            RecentActivities
          </Menu.Item>
          {/* <Menu.Item
            key="mess"
            icon={<FileTextOutlined />}
            onClick={() => setActivePage("mess")}
          >
            User Mess Details
          </Menu.Item> */}
        </Menu>
      </Sider>

      <Layout
        style={{
          marginLeft: collapsed ? 0 : 200,
          transition: "margin-left 0.3s ease",
        }}
      >
        {/* Navbar */}
        <Header
          style={{
            background: "#fff",
            padding: "0 20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
            position: "fixed",
            width: `calc(100% - ${collapsed ? "0px" : "200px"})`,
            transition: "width 0.3s ease",
            zIndex: 999,
          }}
        >
         <Button
  type="primary"
  shape="square"
  size="large"
  icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
  onClick={() => setCollapsed(!collapsed)}
  style={{
    background: "gray",
    color: "white",
    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
    transition: "all 0.3s ease",
    border: "none",
  }}
  hoverable={{ background: "#0056b3" }}
/>

         <Title
           level={4}
           style={{
             margin: 0,
             textAlign: "center",
             display: "flex",
             alignItems: "center",
             justifyContent: "center",
             gap: "10px",
             fontWeight: "bold",
             color: "#1890ff", // Stylish blue color
             background: "linear-gradient(135deg,rgb(85, 192, 204), #bbdefb)", // Light blue gradient
             padding: "10px 20px",
             borderRadius: "10px",
             boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", // Subtle shadow
           }}
         >
           <HomeOutlined style={{ fontSize: "28px", color: "#1890ff" }} />
           Hostel Management
         </Title>
         <Dropdown overlay={userMenu} placement="bottomRight" trigger={['click']}>
      <Button type="text" style={{ padding: 0, border: "none", background: "none" }}>
        <Avatar
          size={40}
          src="E:\React_HotelManagement/vite-project/src/assets/download.png" // Replace with actual user image URL
          icon={<UserOutlined />}
          style={{ cursor: "pointer", border: "2px solid #1890ff" }}
        />
      </Button>
    </Dropdown>
        </Header>

        {/* Content Section */}
        {activePage === "dashboard" && (
          <Content style={{ margin: "100px 70px 20px", padding: 20 }}>
            {/* Row of Cards with Proper Alignment */}
            <Row
              gutter={[16, 16]}
              justify="space-between"
              style={{
                display: "flex",
                flexWrap: "nowrap", // Prevents wrapping to the next line
                // Allows horizontal scrolling if needed
                padding: "10px",
               
              }}
            >
              {/* Users Card */}
              <Col
                flex="1 1 300px"
                style={{ minWidth: 350,display: "flex", marginTop: 0 }}
              >
                <Card
                  title={
                    <span style={{ fontSize: 18, fontWeight: "bold" }}>
                      🏠 Rooms Overview
                    </span>
                  }
                  bordered={false}
                  style={{
                    textAlign: "center",
                    background: "linear-gradient(135deg,rgb(219, 203, 242),rgb(244, 216, 227))",
                    borderRadius: 12,
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    padding: 15,
                    transition: "0.3s",
                    // boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                    position: "relative",
                  }}
                  hoverable
                  bodyStyle={{ paddingBottom: 10 }}
                >
                  <Row gutter={[16, 16]} justify="center" align="middle">
                    <Col span={8}>
                      <Statistic
                        title="Total Rooms"
                        value={TOTAL_ROOMS}
                        valueStyle={{ fontWeight: "bold", fontSize: 18 }}
                        prefix={
                          <HomeOutlined
                            style={{ color: "#1890ff", fontSize: 22 }}
                          />
                        }
                      />
                    </Col>
                    <Col span={8}>
                      <Statistic
                        title="Registered Rooms"
                        value={registeredRooms}
                        valueStyle={{ fontWeight: "bold", fontSize: 18 }}
                        prefix={
                          <CheckCircleOutlined
                            style={{ color: "#52c41a", fontSize: 22 }}
                          />
                        }
                      />
                    </Col>
                    <Col span={8}>
                      <Statistic
                        title="Available Rooms"
                        value={availableRooms}
                        valueStyle={{ fontWeight: "bold", fontSize: 18 }}
                        prefix={
                          <CloseCircleOutlined
                            style={{ color: "#f5222d", fontSize: 22 }}
                          />
                        }
                      />
                    </Col>
                  </Row>
                </Card>
              </Col>

              {/* Rooms Card */}

              <Col flex="1 1 300px" style={{ minWidth: 700, display: "flex" }}>
                <Card
                  title="Rooms Available"
                  bordered={false}
                  style={{
                    textAlign: "center",
                    background: "linear-gradient(135deg,rgb(219, 203, 242),rgb(244, 216, 227))",
                    borderRadius: 10,
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <div
                    style={{
                      margin: "20px 0",
                      padding: "10px",
                      background: "#fff",
                      borderRadius: "10px",
                      boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <Chart
                      options={chartOptions}
                      series={chartSeries}
                      type="bar"
                      height={250}
                    />
                  </div>
                </Card>
              </Col>
            </Row>

            {/* Second Row of Cards */}
            <Row
              gutter={[16, 16]}
              justify="space-between"
              style={{
                display: "flex",
                flexWrap: "nowrap", // Prevents wrapping to the next line
                // Allows horizontal scrolling if needed
                padding: "10px",
              }}
            >
             <>
    {/* Requests Card */}
    <Col flex="1 1 300px" style={{ minWidth: 350, display: "flex" }}>
      <Card title="Requests" bordered={false} style={cardStyle}>
        <MessageOutlined style={iconStyle("#1890ff")} />
        <Title level={2} style={{ color: "#333" }}>
          {totalRequests.filter((req) => req.status === "Pending").length}
        </Title>
        <Text type="secondary">Pending Requests</Text>
      </Card>
    </Col>

    {/* Complaints Card */}
    <Col flex="1 1 300px" style={{ minWidth: 350, display: "flex" }}>
      <Card title="Complaints" bordered={false} style={cardStyle}>
        <WarningOutlined style={iconStyle("#ff4d4f")} />
        <Title level={2} style={{ color: "#333" }}>
          {totalComplaints.filter((req) => req.status === "Pending").length}
        </Title>
        <Text type="secondary">Pending Complaints</Text>
      </Card>
    </Col>

    {/* Recent Activities Card */}
    <Col flex="1 1 300px" style={{ minWidth: 350, display: "flex" }}>
      <Card title="Recent Activities" bordered={false} style={cardStyle}>
        <ClockCircleOutlined style={iconStyle("#52c41a")} />
        <Title level={2} style={{ color: "#333" }}>
          {recentActivities.filter((req) => req.status === "Pending").length}
        </Title>
        <Text type="secondary">Pending Activities</Text>
      </Card>
    </Col>
  </>
            </Row>
          </Content>
        )}
        {activePage === "settings" && (
          <Content style={{ margin: "100px 20px 20px", padding: 20 }}>
            {" "}
            <Row
              gutter={[16, 16]}
              justify="space-between"
              style={{
                display: "flex",
                flexWrap: "nowrap", // Prevents wrapping to the next line
                // Allows horizontal scrolling if needed
                padding: "10px",
              }}
            >
              <AdminSetting />
            </Row>
          </Content>
        )}
        {activePage === "complaints" && <ComplaintAdmin />}
        {activePage === "recentactivities" && <RecentActivitiesAdmin />}
        {activePage === "requests" && <RequestAdmin />}
        {activePage === "rooms" && <RoomDetailsAdmin />}
        {/* {activePage === "mess" && <UserMessDetailsAdmin />} */}
        {activePage === "attendance" && <UserAttendanceAdmin />}
      </Layout>
    </Layout>
  );
};

export default AdminDashboard;
