import React, { useState } from 'react';
import { 
  Typography, 
  Card, 
  Avatar, 
  Descriptions, 
  Button,
  Spin,
  Form,
  Input,
  message,
  Divider
} from 'antd';
import { 
  UserOutlined, 
  MailOutlined, 
  IdcardOutlined,
  LockOutlined
} from '@ant-design/icons';
import { useAuth } from '../hooks/useAuth';
import { useUser, useChangePassword } from '../hooks/useUsers';
import { ChangePassword } from '../models/User';

const { Title, Text } = Typography;

const ProfilePage: React.FC = () => {
  const { user: authUser, logout } = useAuth();
  const userId = authUser?.id || '';
  const { data: user, isLoading, error } = useUser(userId);
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  
  // Password change mutation
  const passwordMutation = useChangePassword();
  
  if (isLoading) {
    return <Spin size="large" tip="Loading profile..." />;
  }
  
  if (error) {
    return <div>Error loading profile: {error.toString()}</div>;
  }
  
  if (!user) {
    return <div>User profile not found</div>;
  }
  
  const handlePasswordChange = async (values: { currentPassword: string; newPassword: string; confirmPassword: string }) => {
    if (values.newPassword !== values.confirmPassword) {
      messageApi.error('Mật khẩu mới không khớp với xác nhận mật khẩu!');
      return;
    }
    
    try {
      const changePasswordData: ChangePassword = {
        username: user.username || '',
        currentPassword: values.currentPassword,
        newPassword: values.newPassword
      };
      
      await passwordMutation.mutateAsync(changePasswordData);
      
      messageApi.success('Đổi mật khẩu thành công!');
      form.resetFields();
      setShowPasswordForm(false);
    } catch {
      messageApi.error('Đổi mật khẩu thất bại. Vui lòng kiểm tra lại mật khẩu hiện tại!');
    }
  };
  
  return (
    <div>
      {contextHolder}
      <Title level={2}>Hồ sơ của tôi</Title>
      
      <Card style={{ marginBottom: 24 }}>
        <div
          style={{ display: "flex", alignItems: "center", marginBottom: 24 }}
        >
          <Avatar size={80} icon={<UserOutlined />} />
          <div style={{ marginLeft: 24 }}>
            <Title level={3} style={{ margin: 0 }}>
              {user.username}
            </Title>
            <div style={{ color: "#888", marginTop: 4 }}>
              <IdcardOutlined style={{ marginRight: 8 }} />
              {user.role}
            </div>
          </div>
        </div>

        <Descriptions title="Thông tin người dùng">
          <Descriptions.Item label="Tên" span={3}>
            <UserOutlined style={{ marginRight: 8 }} />
            {user.username}
          </Descriptions.Item>

          <Descriptions.Item label="Email" span={3}>
            <MailOutlined style={{ marginRight: 8 }} />
            {user.email}
          </Descriptions.Item>

          <Descriptions.Item label="Vai trò" span={3}>
            <IdcardOutlined style={{ marginRight: 8 }} />
            {user.role}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="Bảo mật tài khoản">
        {!showPasswordForm ? (
          <>
            <Button 
              type="primary" 
              style={{ marginRight: 16 }}
              onClick={() => setShowPasswordForm(true)}
            >
              Đổi mật khẩu
            </Button>
            <Button danger onClick={logout}>
              Đăng xuất
            </Button>
          </>
        ) : (
          <>
            <Title level={4}>Đổi mật khẩu</Title>
            <Form
              form={form}
              name="changePassword"
              layout="vertical"
              onFinish={handlePasswordChange}
            >
              <Form.Item
                name="currentPassword"
                rules={[
                  { required: true, message: 'Vui lòng nhập mật khẩu hiện tại!' },
                  { min: 5, message: 'Mật khẩu phải có ít nhất 5 ký tự!' }
                ]}
              >
                <Input.Password 
                  prefix={<LockOutlined />} 
                  placeholder="Mật khẩu hiện tại" 
                  size="large" 
                />
              </Form.Item>
              
              <Form.Item
                name="newPassword"
                rules={[
                  { required: true, message: 'Vui lòng nhập mật khẩu mới!' },
                  { min: 5, message: 'Mật khẩu phải có ít nhất 5 ký tự!' }
                ]}
              >
                <Input.Password 
                  prefix={<LockOutlined />} 
                  placeholder="Mật khẩu mới" 
                  size="large" 
                />
              </Form.Item>
              
              <Form.Item
                name="confirmPassword"
                rules={[
                  { required: true, message: 'Vui lòng xác nhận mật khẩu mới!' },
                  { min: 5, message: 'Mật khẩu phải có ít nhất 5 ký tự!' }
                ]}
              >
                <Input.Password 
                  prefix={<LockOutlined />} 
                  placeholder="Xác nhận mật khẩu mới" 
                  size="large" 
                />
              </Form.Item>
              
              {passwordMutation.error && (
                <div style={{ marginBottom: 16 }}>
                  <Text type="danger">
                    {passwordMutation.error instanceof Error 
                      ? passwordMutation.error.message 
                      : 'Đổi mật khẩu thất bại'}
                  </Text>
                </div>
              )}
              
              <Form.Item>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  loading={passwordMutation.isPending}
                  style={{ marginRight: 8 }}
                >
                  Lưu thay đổi
                </Button>
                <Button onClick={() => {
                  setShowPasswordForm(false);
                  form.resetFields();
                }}>
                  Hủy
                </Button>
              </Form.Item>
            </Form>
            <Divider />
            <Button danger onClick={logout}>
              Đăng xuất
            </Button>
          </>
        )}
      </Card>
    </div>
  );
};

export default ProfilePage;