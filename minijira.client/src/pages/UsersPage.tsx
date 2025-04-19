import React, { useState } from 'react';
import {
  Typography,
  Button,
  Table,
  Space,
  Tag,
  Avatar,
  Modal,
  Form,
  Input,  
  message,
} from 'antd';
import {
  PlusOutlined,
  UserOutlined,
  MailOutlined,
  EyeOutlined
} from '@ant-design/icons';
import { useUsers, useRegisterUser } from '../hooks/useUsers';
import { User } from '../models/User';
import useAuth from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const UsersPage: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  
  // Use the useUsers hook to fetch users
  const { data: users = [], isLoading, refetch } = useUsers();  
  
  // Use the useRegisterUser mutation hook for creating users
  const registerUserMutation = useRegisterUser();

  const showCreateModal = () => {
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      // Create user using the mutation hook
      await registerUserMutation.mutateAsync({
        username: values.username,
        email: values.email,
        role: values.role,
        password: values.password, // This will be used by the API but not stored
      });
      
      messageApi.success('Tạo người dùng thành công');
      refetch(); // Refresh the users list after creating a new user
      setIsModalVisible(false);
    } catch (error) {
      console.error('Submit failed:', error);
      messageApi.error('Không thể lưu người dùng. Vui lòng thử lại.');
    }
  };

  // Updated to use the UserRole from models/User.ts
  const getRoleTag = (role: string) => {
    const roleColors: Record<string, string> = {
      admin: 'red',
      user: 'blue',
    };

    return <Tag color={roleColors[role] || 'default'}>{role.toUpperCase()}</Tag>;
  };

  const columns = [
    {
      title: 'Người dùng',
      key: 'user',
      render: (_: unknown, record: User) => (
        <Space>
          <Avatar 
            icon={<UserOutlined />}
          />
          <span>{record.username}</span>
          {currentUser?.id === record.id && (
            <Tag color="blue">Bạn</Tag>
          )}
        </Space>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (text: string) => (
        <Space>
          <MailOutlined />
          {text}
        </Space>
      ),
    },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => getRoleTag(role),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text: string) => new Date(text).toLocaleDateString(),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_: unknown, record: User) => (
        <Button
          type="primary"
          size="small"
          icon={<EyeOutlined />}
          onClick={() => {
            if (record.id) {
              navigate(`/users/${record.id}`);
            }
          }}
        >
          Xem chi tiết
        </Button>
      ),
    },  
  ];

  return (
    <div>
      {contextHolder}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <Title level={2}>Người dùng</Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={showCreateModal}
        >
          Tạo người dùng mới
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={users}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        loading={isLoading}
      />

      <Modal
        title="Tạo người dùng mới"
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="username"
            label="Tên người dùng"
            rules={[
              { required: true, message: "Vui lòng nhập tên người dùng" },
              { min: 3, message: "Tên người dùng phải có ít nhất 3 ký tự" },
              { max: 20, message: "Tên người dùng không được vượt quá 20 ký tự" },
              {
                pattern: /^[a-zA-Z][a-zA-Z0-9_]*$/,
                message: "Tên người dùng chỉ được chứa chữ cái, số và dấu gạch dưới, và phải bắt đầu bằng chữ cái"
              }
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Vui lòng nhập email" },
              { type: "email", message: "Vui lòng nhập email hợp lệ" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu!' },
              { min: 5, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }            ]}
          >
            <Input.Password />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UsersPage;