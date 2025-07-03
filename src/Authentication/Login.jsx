import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, message, Spin, Card, Typography } from "antd";
import {
  UserOutlined,
  LockOutlined,
  EyeOutlined,
  EyeInvisibleOutlined
} from "@ant-design/icons";
import axios from "axios";
import Cookies from "js-cookie";
import { useAuth } from "./AuthContext";
import { API_URL } from "../api/axiosConfig"; // Adjust if needed

const { Title, Text } = Typography;

const LoginPage = () => {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  // The only code change: use FormData for API request!
  const handleFinish = async (values) => {
    setLoading(true);
    try {
      const apiUrl = `${API_URL}/Auth/login`;
      const formData = new FormData();
      formData.append("username", values.username);
      formData.append("password", values.password);

      const response = await axios.post(apiUrl, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const userData = {
        ...response.data
      };

      localStorage.setItem("authToken", userData.token);
      localStorage.setItem("userData", JSON.stringify(userData));
      Cookies.set("id", userData.id, { expires: 7 });

      login(userData);

      message.success("Login successful! Redirecting...");
      setTimeout(() => navigate("/dashboard"), 800);
    } catch (error) {
      if (error.response) {
        message.error(error.response.data?.message || "Login failed. Please check your credentials.");
      } else if (error.request) {
        message.error("Network error. Please check your connection.");
      } else {
        message.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f9fbfc",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "system-ui, 'Segoe UI', sans-serif"
      }}
    >
      <Card
        style={{
          width: 360,
          boxShadow: "0 8px 32px rgba(80, 170, 220, 0.12)",
          border: "1px solid #dde9f7",
          borderRadius: 16
        }}
      >
        <div style={{ textAlign: "center", paddingBottom: 30 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #22d3ee 0%, #2563eb 100%)",
              margin: "0 auto 12px auto",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <UserOutlined style={{ color: "#fff", fontSize: 32 }} />
          </div>
          <Title level={3} style={{ fontWeight: 600, color: "#2563eb", marginBottom: 0 }}>
            Device Monitor
          </Title>
          <Text type="secondary" style={{ fontSize: 15 }}>
            Secure Monitoring Dashboard Access
          </Text>
        </div>

        <Form layout="vertical" onFinish={handleFinish} requiredMark={false} autoComplete="off">
          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true, message: "Please enter your username" }]}
          >
            <Input
              size="large"
              placeholder="Username"
              prefix={<UserOutlined style={{ color: "#22d3ee" }} />}
              style={{ backgroundColor: "#fff" }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: "Please enter your password" }]}
            style={{ marginTop: 12 }}
          >
            <Input
              type={showPassword ? "text" : "password"}
              size="large"
              placeholder="Password"
              prefix={<LockOutlined style={{ color: "#22d3ee" }} />}
              suffix={
                <span
                  onClick={() => setShowPassword((s) => !s)}
                  style={{
                    cursor: "pointer",
                    color: "#2563eb",
                    fontSize: 18
                  }}
                  title="Toggle password visibility"
                >
                  {showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                </span>
              }
              style={{ backgroundColor: "#fff" }}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={loading}
              block
              style={{
                background: "linear-gradient(90deg, #22d3ee 0%, #2563eb 100%)",
                border: "none",
                borderRadius: 8,
                marginTop: 20,
                fontWeight: 500
              }}
              disabled={loading}
            >
              {loading ? <Spin size="small" style={{ marginRight: 8 }} /> : null}
              Sign in
            </Button>
          </Form.Item>
        </Form>
        <div style={{ marginTop: 18, textAlign: "center" }}>
          <Text type="secondary" style={{ fontSize: 13 }}>
            © {new Date().getFullYear()} Device Monitoring System
          </Text>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;