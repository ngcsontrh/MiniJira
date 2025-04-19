import React, { useEffect } from 'react';
import { Card, Form, Input, Button, Typography, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import useAuth from '../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import './LoginPage.css';

const { Title, Text } = Typography;

const LoginPage: React.FC = () => {
  const { login, loginLoading, loginError, isAuth } = useAuth();
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuth) {
      navigate('/dashboard');
    }
  }, [isAuth, navigate]);

  const onFinish = async (values: { username: string; password: string }) => {
    try {
      const result = await login({
        username: values.username,
        password: values.password
      });
      
      if (result) {
        messageApi.success('Login successful!');
        // Navigation happens automatically via the useEffect hook when isAuth changes
      }
    } catch {
      // Error is already handled in the hook
    }
  };

  return (
    <div className="login-container">
      {contextHolder}
      <Card className="login-card">
        <div className="login-logo">
          <Title level={2} style={{ color: '#fa8c16' }}>Mini Jira</Title>
        </div>
        
        <Form
          form={form}
          name="login"
          layout="vertical"
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="Tên đăng nhập" 
              size="large" 
            />
          </Form.Item>
          
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
          >
            <Input.Password 
              prefix={<LockOutlined />} 
              placeholder="Mật khẩu" 
              size="large" 
            />
          </Form.Item>
          
          {loginError && (
            <div className="login-error">
              <Text type="danger">
                {loginError instanceof Error 
                  ? loginError.message.includes('status code 400') 
                    ? 'Tên đăng nhập hoặc mật khẩu không chính xác' 
                    : loginError.message 
                  : 'Đăng nhập thất bại'}
              </Text>
            </div>
          )}
          
          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              size="large" 
              block 
              loading={loginLoading}
            >
              Đăng nhập
            </Button>
          </Form.Item>
          
          <div className="login-links">
            <Text>Chưa có tài khoản? </Text>
            <Link to="/register">Đăng ký tại đây</Link>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default LoginPage;