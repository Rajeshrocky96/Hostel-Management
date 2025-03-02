import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./login";
import AdminDashboard from "./AdminDashboard";
import UserDashboard from "./UserDashboard";
import ForgotPassword from "./ForgetPassword";
import AdminSetting from "./AdminSetting";
import Requests from "./ComponentforUser/UserRequests";
import Complaints from "./ComponentforUser/Complaints";
import RecentActivities from "./ComponentforUser/RecentActivities";

const ProtectedRoute = ({ element, roleRequired }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (roleRequired && role !== roleRequired) {
    return <Navigate to="/" />;
  }

  return element;
};

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Protected Routes */}
        <Route
          path="/admin-dashboard"
          element={<ProtectedRoute element={<AdminDashboard />} roleRequired="admin" />}
        />
        <Route
          path="/user-dashboard"
          element={<ProtectedRoute element={<UserDashboard />} roleRequired="user" />}
        />

        {/* Other Protected Pages (Both User and Admin can access) */}
        <Route path="/admin-settings" element={<ProtectedRoute element={<AdminSetting />} />} />
        <Route path="/requests" element={<ProtectedRoute element={<Requests />} />} />
        <Route path="/complaints" element={<ProtectedRoute element={<Complaints />} />} />
        <Route path="/recent-activities" element={<ProtectedRoute element={<RecentActivities />} />} />

        {/* Catch-All: Redirect Unauthorized Users */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
