import React, { useEffect } from 'react';
import { Card, Form, Input, Button, Typography, message } from 'antd';
import { LockOutlined, MailOutlined, ProfileOutlined } from '@ant-design/icons';
import useAuth from '../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import './LoginPage.css'; // Reusing the same CSS for now

const { Title, Text } = Typography;

const RegisterPage: React.FC = () => {
  const { register, registerLoading, registerError, isAuth } = useAuth();
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuth) {
      navigate('/dashboard');
    }
  }, [isAuth, navigate]);

  const onFinish = async (values: { username: string; email: string; password: string; confirmPassword: string }) => {
    if (values.password !== values.confirmPassword) {
      messageApi.error('Passwords do not match!');
      return;
    }

    try {
      await register({
        username: values.username,
        email: values.email,
        password: values.password,        
      });
      messageApi.success('Registration successful! Please login.');
      navigate('/login');      
    } catch {
        // Error is already handled in the hook
        messageApi.error('Registration failed! Please try again.');
    }
  };

  return (
    <div className="login-container">
      {contextHolder}
      <Card className="login-card">
        <div className="login-logo">
          <Title level={2} style={{ color: '#fa8c16' }}>Mini Jira</Title>
          <Title level={4}>Tạo tài khoản</Title>
        </div>
        
        <Form
          form={form}
          name="register"
          layout="vertical"
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            rules={[
              { required: true, message: 'Vui lòng nhập tên người dùng!' },
              { min: 3, message: 'Tên người dùng phải có ít nhất 3 ký tự!' },
              { max: 20, message: 'Tên người dùng không được vượt quá 20 ký tự!' },
              {
                pattern: /^[a-zA-Z][a-zA-Z0-9_]*$/,
                message: 'Tên người dùng chỉ được chứa chữ cái, số và dấu gạch dưới, và phải bắt đầu bằng chữ cái!'
              }
            ]}
          >
            <Input 
              prefix={<ProfileOutlined />} 
              placeholder="Tên người dùng" 
              size="large" 
            />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Vui lòng nhập email!' },
              { type: 'email', message: 'Vui lòng nhập email hợp lệ!' }
            ]}
          >
            <Input 
              prefix={<MailOutlined />} 
              placeholder="Email" 
              size="large" 
            />
          </Form.Item>
          
          <Form.Item
            name="password"
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu!' },
              { min: 5, message: 'Mật khẩu phải có ít nhất 5 ký tự!' }
            ]}
          >
            <Input.Password 
              prefix={<LockOutlined />} 
              placeholder="Mật khẩu" 
              size="large" 
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            rules={[
              { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
              { min: 5, message: 'Mật khẩu phải có ít nhất 5 ký tự!' }
            ]}
          >
            <Input.Password 
              prefix={<LockOutlined />} 
              placeholder="Xác nhận mật khẩu" 
              size="large" 
            />
          </Form.Item>
          
          {registerError && (
            <div className="login-error">
              <Text type="danger">{registerError instanceof Error ? registerError.message : 'Đăng ký thất bại'}</Text>
            </div>
          )}
          
          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              size="large" 
              block 
              loading={registerLoading}
            >
              Đăng ký
            </Button>
          </Form.Item>
          
          <div className="login-links">
            <Text>Đã có tài khoản? </Text>
            <Link to="/login">Đăng nhập tại đây</Link>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default RegisterPage;