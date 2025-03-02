import React, { useState, useEffect } from "react";
import {
  Layout,
  Menu,
  Button,
  Dropdown,
  Typography,
  Card,
  Row,
  Col,
  Modal,
  Form,
  Input,
  Select,
  Table,
  DatePicker,
  Tag,
  Avatar,
} from "antd";
import { useNavigate, useLocation } from "react-router-dom";
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
  EditOutlined,
  CoffeeOutlined,
  CalendarOutlined,
  FormOutlined,
  HistoryOutlined,
} from "@ant-design/icons";
import showToastAlert from "./ShowAlert";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { message } from "antd";
import axios from "axios";
import dayjs from "dayjs";
import RecentActivities from "./ComponentforUser/RecentActivities";
import Complaints from "./ComponentforUser/Complaints";
import Requests from "./ComponentforUser/UserRequests";
import Attendance from "./ComponentforUser/Attendance";
import MessDetails from "./ComponentforUser/MessDetails";
import AttendCard from "./ComponentforUser/AttendCard";

const { Header, Sider, Content } = Layout;
const { Title } = Typography;
const { Option } = Select;
const { Text } = Typography;

const UserDashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [activePage, setActivePage] = useState("dashboard");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalVisibleForUpdate, setIsModalVisibleForUpdate] = useState(false);
  const [isModalVisibleForForm, setIsModalVisibleForForm] = useState(false);
  const [email, setemail] = useState("");
  const [id, setId] = useState("");
  const navigate = useNavigate();

  // Simulated registration check (Replace with actual API call if needed)
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    if (!isRegistered) {
    }
  }, [isRegistered]);

  const handleRegisterClick = () => {
    setIsModalVisible(false);
    setIsModalVisibleForForm(true); // Open registration form
  };
  const location = useLocation();
  const emails = location.state?.email || localStorage.getItem("email");

  useEffect(() => {
    const email = localStorage.getItem("email");
    console.log("User Email:", email);
    const id = localStorage.getItem("id");
    console.log("User Email:", id);
    setemail(email);

    setId(id);
  }, []);
  useEffect(() => {
    checkUserRegistration();
    fetchHostelRegistrations();
    fetchUserData(id);
  }, [id]);
  const [form] = Form.useForm();
  const checkUserRegistration = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/check-registration/${id}`
      );
      const data = await response.json();
      console.log("user exist" + JSON.stringify(data));
      if (data.registered) {
        message.warning("You are already registered!");
        setIsModalVisible(false); // Close modal if registered
      } else {
        setIsModalVisible(true); // Open modal if not registered
      }
    } catch (error) {
      console.error("Error checking registration:", error);
      message.error("Failed to check registration");
    }
  };
  const [inform, setInform] = useState("");
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false); // Success Modal State

  const handleFormSubmit = async (values) => {
    console.log("Form values:", values);

    try {
      const payload = { id, ...values };

      const response = await fetch(
        "http://localhost:5000/registeringformforhostel",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();
      console.log("Server Response:", data);

      if (response.ok) {
        setIsModalVisibleForForm(false);
        setInform(""); // ✅ Clear error message on success
        setIsSuccessModalVisible(true); // ✅ Show success modal
      } else {
        const errorMessage =
          data.error || "Failed to submit the form. Please try again.";
        setInform(errorMessage); // ✅ Show error message
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      const errorMessage =
        error.response?.data?.error ||
        "Network error. Please check your connection.";
      setInform(errorMessage);
    }
  };

  const [UserRegistered, setUserRegistered] = useState({});
  const fetchUserData = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/registeringformforhostel/${id}`
      );
      const data = await response.json();
      console.log("Fetched Data:", data); // Debugging

      if (response.ok) {
        setUserRegistered(data); // Update state correctly
        form.setFieldsValue(data);
      } else {
        message.error(data.error);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      message.error("Failed to fetch user details");
    }
  };

  useEffect(() => {
    console.log("sseee" + JSON.stringify(UserRegistered));
  }, [UserRegistered]);
  const TotalUserAvailable = 50;
  const [noOfUserRegistered, setnoOfUserRegistered] = useState();

  const fetchHostelRegistrations = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/hostel-registrations"
      );
      const data = await response.json();

      if (Array.isArray(data)) {
        console.log("Total registrations:", data.length);
        setnoOfUserRegistered(data.length);
      } else {
        console.error("Invalid data format received:", data);
      }
    } catch (error) {
      console.error("Error fetching hostel registrations:", error);
    }
  };

  const handleFormSubmitForUpdate = async (values) => {
    console.log("Updating user:", values);

    try {
      const response = await fetch(
        `http://localhost:5000/registeringformforhostel/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            full_name: values.full_name || "", // Ensure non-null values
            father_name: values.father_name || "",
            address: values.address || "",
            phone_number: values.phone_number || "",
            department: values.department || "",
            hostel_type: values.hostel_type || "",
            mess_type: values.mess_type || "", // ✅ Added mess_type
          }),
        }
      );

      const data = await response.json();
      console.log("Response:", data);

      if (response.ok) {
        setIsModalVisibleForUpdate(false);
        showToastAlert("Updated Successfully", "success");
      } else {
        message.error(data.error);
      }
    } catch (error) {
      console.error("Error updating form:", error);
      showToastAlert("Failed to update details", "error");
    }
  };

  const Updatedata = () => {
    fetchUserData(id);
    setIsModalVisibleForUpdate(true);
  };

  const userMenu = (
    <Menu
      style={{
        borderRadius: "8px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        padding: "8px",
        minWidth: "160px",
      }}
    >
      <Menu.Item
        key="updateProfile"
        icon={
          <EditOutlined
            style={{
              fontSize: "16px",
              transition: "transform 0.2s ease-in-out",
            }}
            className="menu-icon"
          />
        }
        onClick={Updatedata}
        style={{
          padding: "10px 15px",
          borderRadius: "6px",
          fontWeight: "bold",
          transition: "0.3s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "#e6f7ff")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
      >
        Update Profile
      </Menu.Item>
  
      <Menu.Item
        key="logout"
        icon={
          <LogoutOutlined
            style={{
              fontSize: "16px",
              transition: "transform 0.2s ease-in-out",
            }}
            className="menu-icon"
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
  

  // Modal states
  const [isRecentActivitiesModalVisible, setRecentActivitiesModalVisible] =
    useState(false);
  const [isRequestsModalVisible, setRequestsModalVisible] = useState(false);
  const [isComplaintsModalVisible, setComplaintsModalVisible] = useState(false);

  // Form Data States
  const [recentActivity, setRecentActivity] = useState({
    activity: "",
    date: "",
    status: "Pending",
  });

  const [requestData, setRequestData] = useState({
    request: "",
    date: null,
    status: "Pending", // Default status
  });

  const [complaintData, setComplaintData] = useState({
    complaint: "",
    date: "",
    status: "Pending",
  });

  const handleRecentActivitiesSubmit = async () => {
    if (!recentActivity.activity || !recentActivity.date) {
      message.error("All fields are required!");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/recent-activities", {
        user_id: id,
        activity: recentActivity.activity,
        date: recentActivity.date,
        status: recentActivity.status || "Pending",
      });

      showToastAlert("Recent Activity added successfully!", "success");
      setRecentActivity({ activity: "", date: "", status: "Pending" });
      setRecentActivitiesModalVisible(false);
    } catch (error) {
      showToastAlert("Failed to add Recent Activity.", "error");
    }
  };
  const handleRequestsSubmit = async () => {
    if (!requestData.request || !requestData.date) {
      message.error("All fields are required!");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/requests", {
        user_id: id,
        request: requestData.request,
        date: requestData.date,
        status: requestData.status || "Pending",
      });

      showToastAlert("Request added successfully!", "success");
      setRequestData({ request: "", date: null, status: "Pending" }); // Reset form
      setRequestsModalVisible(false);
    } catch (error) {
      showToastAlert("Failed to add Request.", "error");
    }
  };

  const handleComplaintsSubmit = async () => {
    if (!complaintData.complaint || !complaintData.date) {
      message.error("All fields are required!");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/complaints", {
        user_id: id,
        complaint: complaintData.complaint,
        date: complaintData.date,
        status: complaintData.status || "Pending",
      });

      showToastAlert("Complaint added successfully!", "success");
      setComplaintData({ complaint: "", date: "", status: "Pending" });
      setComplaintsModalVisible(false);
    } catch (error) {
      showToastAlert("Failed to add complaint.", "error");
    }
  };

  const columnsaz = [
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (text, record) => (
        <span style={{ fontWeight: "bold", fontSize: "16px", color: "#555" }}>
          {record.icon} {text}
        </span>
      ),
    },
    {
      title: "Details",
      dataIndex: "value",
      key: "value",
      render: (text) => (
        <span style={{ fontSize: "15px", color: "#1890ff", fontWeight: "500" }}>
          {text || "Not Available"}
        </span>
      ),
    },
  ];
  const capitalizeWords = (str) => {
    return str
      ? str.replace(/\b\w/g, (char) => char.toUpperCase()) // Capitalize first letter of each word
      : "N/A";
  };
  const dataaz = [
    {
      key: "1",
      category: "Full Name",
      value: capitalizeWords(UserRegistered?.full_name),
      icon: <UserOutlined style={{ color: "#1890ff", marginRight: 8 }} />,
    },
    {
      key: "2",
      category: "Hostel Type",
      value: UserRegistered?.hostel_type || "N/A",
      icon: <HomeOutlined style={{ color: "#fa8c16", marginRight: 8 }} />,
    },
    {
      key: "3",
      category: "Mess Type",
      value: UserRegistered?.mess_type || "N/A",
      icon: <CoffeeOutlined style={{ color: "#52c41a", marginRight: 8 }} />,
    },
  ];
  const cardStyle = {
    borderRadius: 12,
    padding: "20px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
    textAlign: "center",
    cursor: "pointer",
    transition: "transform 0.2s, box-shadow 0.2s",
  };
  
  const hoverEffect = (e) => (e.currentTarget.style.transform = "scale(1.05)");
  const removeHoverEffect = (e) => (e.currentTarget.style.transform = "scale(1)");
  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Popup Modal for Hostel Registration */}
      {console.log(TotalUserAvailable, noOfUserRegistered)}
      {TotalUserAvailable <= noOfUserRegistered ? (
        <Modal
          title="Hostel Registration Unavailable"
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={[
            <Button key="close" onClick={() => setIsModalVisible(false)}>
              Close
            </Button>,
          ]}
        >
          <p>
            All hostel rooms have been filled. No more registrations available.
          </p>
        </Modal>
      ) : (
        <Modal
          title="Hostel Registration Required"
          open={isModalVisible}
          footer={[
            <Button type="primary" onClick={handleRegisterClick} key="register">
              Click here to fill the form
            </Button>,
          ]}
        >
          <p>You need to register for the hostel to access full features.</p>
        </Modal>
      )}

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
          {!collapsed &&<div
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
           User Dashboard
         </div>}
        </div>
        <Menu mode="inline" defaultSelectedKeys={["1"]}>
          <Menu.Item
            key="1"
            icon={<BarChartOutlined />}
            onClick={() => setActivePage("dashboard")}
          >
            User Dashboard
          </Menu.Item>
          <Menu.Item
            key="2"
            icon={<SolutionOutlined />}
            onClick={() => setActivePage("attendance")}
          >
            User Attendance
          </Menu.Item>
          <Menu.Item
            key="4"
            icon={<TeamOutlined />}
            onClick={() => setActivePage("requests")}
          >
            User Requests
          </Menu.Item>
          <Menu.Item
            key="5"
            icon={<MessageOutlined />}
            onClick={() => setActivePage("complaints")}
          >
            Complaints
          </Menu.Item>
          <Menu.Item
            key="6"
            icon={<FileTextOutlined />}
            onClick={() => setActivePage("recent-activities")}
          >
            Recent Activities
          </Menu.Item>
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
    background: "linear-gradient(135deg, #e3f2fd, #bbdefb)", // Light blue gradient
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
          <Content style={{ margin: "100px 20px 20px", padding: 20 }}>
            {/* Dashboard Cards */}
            <Row
              gutter={[16, 16]}
              justify="space-between"
              style={{ display: "flex", flexWrap: "nowrap", padding: "10px" }}
            >
              <Col flex="1 1 300px" style={{ minWidth: 350, display: "flex" }}>
                <Card
                  title={
                    <span
                      style={{
                        fontSize: "18px",
                        fontWeight: "bold",
                        color: "#333",
                      }}
                    >
                      <TeamOutlined
                        style={{
                          fontSize: "20px",
                          marginRight: 8,
                          color: "#1890ff",
                        }}
                      />
                      User Details
                    </span>
                  }
                  bordered={false}
                  style={{
                    background:
                    "linear-gradient(135deg,rgb(185, 215, 235) 10%,rgb(167, 232, 225) 100%)",
                    borderRadius: 10,
                    padding: "15px",
                    boxShadow: "0 3px 8px rgba(0,0,0,0.2)",
                  }}
                >
                  <div style={{ marginTop: "40px" }}>
                    <Table
                      columns={columnsaz}
                      dataSource={dataaz}
                      pagination={false}
                      bordered
                      size="large"
                      style={{
                        background: "#fff",
                        borderRadius: 8,
                        boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                      }}
                    />
                  </div>
                </Card>
              </Col>

              <Col flex="1 1 300px" style={{ minWidth: 350, display: "flex" }}>
                <Card
                  title={
                    <span style={{ fontSize: "18px", fontWeight: "bold", color: "#333", display: "flex", alignItems: "center" }}>
                      <CoffeeOutlined style={{ fontSize: "22px", color: "#faad14", marginRight: 10 }} />
                      Mess Details
                    </span>
                    
                  }
                  bordered={false}
                   style={{
                    background:
                    "linear-gradient(135deg,rgb(185, 215, 235) 10%,rgb(182, 228, 224) 100%)",
                    borderRadius: 10,
                    padding: "15px",
                    flex:1,
                    boxShadow: "0 3px 8px rgba(0,0,0,0.2)",
                  }}
                >
                  <MessDetails id={id} />
                </Card>
              </Col>

              <Col flex="1 1 300px" style={{ minWidth: 350, display: "flex" }}>
                <Card
                  title={
                    <span style={{ fontSize: "18px", fontWeight: "bold", color: "#333", display: "flex", alignItems: "center" }}>
                      <CalendarOutlined style={{ fontSize: "22px", color: "#1890ff", marginRight: 10 }} />
                      Attendance Overview
                    </span>
                  }
                  bordered={false}
                  style={{
                    background:
                      "linear-gradient(135deg,rgb(185, 215, 235) 10%,rgb(167, 232, 225) 100%)",
                    borderRadius: 10,
                    padding: "15px",
                    boxShadow: "0 3px 8px rgba(0,0,0,0.2)",
                  }}
                >
                  <AttendCard id={id} />
                </Card>
              </Col>
            </Row>

            <Row
              gutter={[16, 16]}
              justify="space-between"
              style={{ display: "flex", flexWrap: "nowrap", padding: "10px" }}
            >
             <Col flex="1 1 300px" style={{ minWidth: 350, display: "flex", justifyContent: "center" }}>
  {/* Requests Card */}
  <Card
    title={
      <span style={{ fontSize: "18px", fontWeight: "bold", color: "#333", display: "flex", alignItems: "center" }}>
        <FormOutlined style={{ fontSize: "22px", color: "#1890ff", marginRight: 10 }} />
        Requests
      </span>
    }
    bordered={false}
    style={{ ...cardStyle, background: "linear-gradient(135deg, #e0f7fa 10%, #80deea 100%)" }}
    onClick={() => setRequestsModalVisible(true)}
    onMouseEnter={hoverEffect}
    onMouseLeave={removeHoverEffect}
  >
    <FormOutlined style={{ fontSize: 50, color: "#1890ff", marginBottom: 10 }} />
    <Title level={2} style={{ margin: 0, color: "#333" }}></Title>
    <Text type="secondary" style={{ fontSize: 14 }}>Click here to fill</Text>
  </Card>
</Col>

<Col flex="1 1 300px" style={{ minWidth: 350, display: "flex", justifyContent: "center" }}>
  {/* Recent Activities Card */}
  <Card
    title={
      <span style={{ fontSize: "18px", fontWeight: "bold", color: "#333", display: "flex", alignItems: "center" }}>
        <HistoryOutlined style={{ fontSize: "22px", color: "#722ed1", marginRight: 10 }} />
        Recent Activities
      </span>
    }
    bordered={false}
    style={{ ...cardStyle, background: "linear-gradient(135deg, #ede7f6 10%, #d1c4e9 100%)" }}
    onClick={() => setRecentActivitiesModalVisible(true)}
    onMouseEnter={hoverEffect}
    onMouseLeave={removeHoverEffect}
  >
    <HistoryOutlined style={{ fontSize: 50, color: "#722ed1", marginBottom: 10 }} />
    <Title level={2} style={{ margin: 0, color: "#333" }}></Title>
    <Text type="secondary" style={{ fontSize: 14 }}>Click here to fill</Text>
  </Card>
</Col>

<Col flex="1 1 300px" style={{ minWidth: 350, display: "flex", justifyContent: "center" }}>
  {/* Complaints Card */}
  <Card
    title={
      <span style={{ fontSize: "18px", fontWeight: "bold", color: "#333", display: "flex", alignItems: "center" }}>
        <ExclamationCircleOutlined style={{ fontSize: "22px", color: "#ff4d4f", marginRight: 10 }} />
        Complaints
      </span>
    }
    bordered={false}
    style={{ ...cardStyle, background: "linear-gradient(135deg, #ffebee 10%, #ffcdd2 100%)" }}
    onClick={() => setComplaintsModalVisible(true)}
    onMouseEnter={hoverEffect}
    onMouseLeave={removeHoverEffect}
  >
    <ExclamationCircleOutlined style={{ fontSize: 50, color: "#ff4d4f", marginBottom: 10 }} />
    <Title level={2} style={{ margin: 0, color: "#333" }}></Title>
    <Text type="secondary" style={{ fontSize: 14 }}>Click here to fill</Text>
  </Card>
</Col>
            </Row>
          </Content>
        )}
        <div
          style={{
            flex: 7,
            display: "flex",
            justifyContent: "center", // Centers horizontally
            alignItems: "center", // Centers vertically
            height: "200vh",
            padding: "250px", // Reduced padding to move up
            marginTop: "-150px", // Moves content slightly upward
          }}
        >
          {activePage === "requests" && <Requests id={id} />}
          {activePage === "complaints" && <Complaints id={id} />}
          {activePage === "recent-activities" && <RecentActivities id={id} />}
          {activePage === "attendance" && <Attendance id={id} />}
        </div>

        {/* Registration Form Modal */}
        <Modal
          title={`Hi ${email}, Welcome back!`}
          open={isModalVisibleForForm}
          onCancel={() => setIsModalVisibleForForm(false)}
          footer={null}
        >
          <Form layout="horizontal" onFinish={handleFormSubmit}>
            <Form.Item
              label="Name"
              name="Name"
              rules={[{ required: true, message: "Please enter full name!" }]}
            >
              <Input placeholder="Enter full name" />
            </Form.Item>

            <Form.Item
              label="Father Name"
              name="FatherName"
              rules={[{ required: true, message: "Please enter father name!" }]}
            >
              <Input placeholder="Enter father name" />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[
                {
                  required: true,
                  type: "email",
                  message: "Please enter a valid email!",
                },
              ]}
            >
              <Input placeholder="Enter email" />
            </Form.Item>

            <Form.Item
              label="Phone Number"
              name="phoneNumber"
              rules={[
                { required: true, message: "Please enter phone number!" },
              ]}
            >
              <Input placeholder="Enter phone number" />
            </Form.Item>

            <Form.Item
              label="Dept"
              name="Dept"
              rules={[{ required: true, message: "Please enter department!" }]}
            >
              <Input placeholder="Enter department" />
            </Form.Item>

            <Form.Item
              label="Hostel Type"
              name="hostelType"
              rules={[
                { required: true, message: "Please select hostel type!" },
              ]}
            >
              <Select placeholder="Select hostel type">
                <Option value="ac">AC</Option>
                <Option value="nonAc">Non-AC</Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="Mess Type"
              name="mess_type"
              rules={[{ required: true, message: "Please select Mess type!" }]}
            >
              <Select placeholder="Select Mess Type">
                <Select.Option value="veg">Vegetarian</Select.Option>
                <Select.Option value="nonVeg">Non-Vegetarian</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              label="Address"
              name="address"
              rules={[{ required: true, message: "Please enter address!" }]}
            >
              <Input.TextArea rows={3} placeholder="Enter address" />
            </Form.Item>

            {/* ✅ Display Ant Design Alert for Error Messages */}
            {inform && (
              <div
                style={{
                  color: "red",
                  marginBottom: "10px",
                  textAlign: "center",
                }}
              >
                {inform}
              </div>
            )}

            <Button type="primary" htmlType="submit" block>
              Register
            </Button>
          </Form>
        </Modal>
        {/* Successregoation Form Modal */}
        <Modal
          open={isSuccessModalVisible}
          onCancel={() => setIsSuccessModalVisible(false)}
          footer={[
            <Button
              key="ok"
              type="primary"
              onClick={() => setIsSuccessModalVisible(false)}
            >
              OK
            </Button>,
          ]}
        >
          <p
            style={{
              textAlign: "center",
              fontSize: "16px",
              fontWeight: "bold",
              marginBottom: 0,
            }}
          >
            🎉 Registration Successful!
          </p>
        </Modal>
        {/* Update Form Modal */}
        <Modal
          title="Update My Profile"
          visible={isModalVisibleForUpdate}
          onCancel={() => setIsModalVisibleForUpdate(false)}
          footer={null}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleFormSubmitForUpdate}
          >
            <Form.Item
              label="Full Name"
              name="full_name"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Father Name"
              name="father_name"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>

            <Form.Item label="Address" name="address">
              <Input />
            </Form.Item>

            <Form.Item label="Phone Number" name="phone_number">
              <Input />
            </Form.Item>

            <Form.Item label="Department" name="department">
              <Input />
            </Form.Item>

            <Form.Item label="Hostel Type" name="hostel_type">
              <Select placeholder="Select Hostel Type">
                <Select.Option value="ac">AC</Select.Option>
                <Select.Option value="nonAc">Non-AC</Select.Option>
              </Select>
            </Form.Item>

            {/* ✅ Mess Type Selection */}
            <Form.Item label="Mess Type" name="mess_type">
              <Select placeholder="Select Mess Type">
                <Select.Option value="veg">Vegetarian</Select.Option>
                <Select.Option value="nonVeg">Non-Vegetarian</Select.Option>
              </Select>
            </Form.Item>

            {/* Save Changes Button - Always Visible */}
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <Button type="primary" htmlType="submit">
                Save Changes
              </Button>
            </div>
          </Form>
        </Modal>
        <>
          <Modal
            title="Add Recent Activity"
            open={isRecentActivitiesModalVisible}
            onOk={handleRecentActivitiesSubmit}
            onCancel={() => setRecentActivitiesModalVisible(false)}
          >
            <Input
              placeholder="Activity"
              value={recentActivity.activity}
              onChange={(e) =>
                setRecentActivity({
                  ...recentActivity,
                  activity: e.target.value,
                })
              }
            />
            <DatePicker
              style={{ width: "100%", marginTop: 10 }}
              value={recentActivity.date}
              onChange={(date) =>
                setRecentActivity({ ...recentActivity, date })
              }
            />
            <Select
              style={{ width: "100%", marginTop: 10 }}
              value={recentActivity.status}
              onChange={(value) =>
                setRecentActivity({ ...recentActivity, status: value })
              }
            >
              <Select.Option value="Pending">Pending</Select.Option>
              <Select.Option value="Resolved">Resolved</Select.Option>
            </Select>
          </Modal>
          <Modal
            title="Add Request"
            open={isRequestsModalVisible}
            onOk={handleRequestsSubmit}
            onCancel={() => setRequestsModalVisible(false)}
          >
            <Input
              placeholder="Request"
              value={requestData.request}
              onChange={(e) =>
                setRequestData({ ...requestData, request: e.target.value })
              }
            />
            <DatePicker
              style={{ width: "100%", marginTop: 10 }}
              value={requestData.date}
              onChange={(date) => setRequestData({ ...requestData, date })}
            />
            <Select
              style={{ width: "100%", marginTop: 10 }}
              value={requestData.status}
              onChange={(value) =>
                setRequestData({ ...requestData, status: value })
              }
            >
              <Select.Option value="Pending">Pending</Select.Option>
              <Select.Option value="Resolved">Resolved</Select.Option>
            </Select>
          </Modal>

          <Modal
            title="Add Complaint"
            open={isComplaintsModalVisible}
            onOk={handleComplaintsSubmit}
            onCancel={() => setComplaintsModalVisible(false)}
          >
            <Input
              placeholder="Complaint"
              value={complaintData.complaint}
              onChange={(e) =>
                setComplaintData({
                  ...complaintData,
                  complaint: e.target.value,
                })
              }
            />
            <DatePicker
              style={{ width: "100%", marginTop: 10 }}
              value={complaintData.date}
              onChange={(date) => setComplaintData({ ...complaintData, date })}
            />
            <Select
              style={{ width: "100%", marginTop: 10 }}
              value={complaintData.status}
              onChange={(value) =>
                setComplaintData({ ...complaintData, status: value })
              }
            >
              <Select.Option value="Pending">Pending</Select.Option>
              <Select.Option value="Resolved">Resolved</Select.Option>
            </Select>
          </Modal>
        </>
        <ToastContainer />
      </Layout>
    </Layout>
  );
};

export default UserDashboard;
