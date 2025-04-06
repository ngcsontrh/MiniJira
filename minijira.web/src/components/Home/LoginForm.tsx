import React, { useState } from "react";
import { Form, Input, Button, Typography } from "antd";

const { Title } = Typography;

const LoginForm: React.FC = () => {
  const [isRegister, setIsRegister] = useState(false); // Quản lý trạng thái giữa đăng nhập và đăng ký

  const handleSwitchForm = () => {
    setIsRegister(!isRegister); // Chuyển đổi giữa form đăng nhập và đăng ký
  };

  return (
    <div
      style={{
        flex: 1,
        paddingLeft: 24,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 400,
          padding: 24,
          background: "#F4F5F7",
          borderRadius: 8,
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Title level={3} style={{ textAlign: "center", color: "#4A4A4A" }}>
          {isRegister ? "Register" : "Login"}
        </Title>
        <Form
          name={isRegister ? "register" : "login"}
          layout="vertical"
          onFinish={(values) =>
            console.log(
              isRegister ? "Register values:" : "Login values:",
              values
            )
          }
        >
          {/* Hidden Action Field */}
          <Form.Item name="action" initialValue={isRegister ? "register" : "login"} hidden>
            <Input type="hidden" />
          </Form.Item>

          {/* Username Field */}
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Please enter your username!" }]}
          >
            <Input placeholder="Enter your username" />
          </Form.Item>

          {/* Password Field */}
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please enter your password!" }]}
          >
            <Input.Password placeholder="Enter your password" />
          </Form.Item>

          {/* Confirm Password Field (Chỉ hiển thị khi đăng ký) */}
          {isRegister && (
            <Form.Item
              label="Confirm Password"
              name="confirmPassword"
              rules={[
                { required: true, message: "Please confirm your password!" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("The two passwords do not match!")
                    );
                  },
                }),
              ]}
            >
              <Input.Password placeholder="Confirm your password" />
            </Form.Item>
          )}

          {/* Submit Button */}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{
                width: "100%",
                backgroundColor: "#FF8C00",
                borderColor: "#FF8C00",
              }}
            >
              {isRegister ? "Register" : "Login"}
            </Button>
          </Form.Item>
        </Form>

        {/* Switch Form Button */}
        <div style={{ textAlign: "center" }}>
          <Button type="link" onClick={handleSwitchForm}>
            {isRegister
              ? "Already have an account? Login"
              : "Don't have an account? Register"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;