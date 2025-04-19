import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Card, 
  Typography, 
  Descriptions, 
  Space, 
  Button, 
  Avatar, 
  Tag, 
  Skeleton, 
} from 'antd';
import { 
  UserOutlined, 
  MailOutlined, 
  ClockCircleOutlined, 
  ArrowLeftOutlined 
} from '@ant-design/icons';
import { useUser } from '../hooks/useUsers';
import useAuth from '../hooks/useAuth';

const { Title, Text } = Typography;

const UserDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();

  // Fetch user details using the useUser hook
  const { 
    data: user, 
    isLoading, 
    isError
  } = useUser(id || '');

  // Handle going back to users list
  const handleBack = () => {
    navigate('/users');
  };

  // Function to get role tag with color
  const getRoleTag = (role: string) => {
    const roleColors: Record<string, string> = {
      admin: 'red',
      user: 'blue',
    };

    return <Tag color={roleColors[role.toLowerCase()] || 'default'}>{role.toUpperCase()}</Tag>;
  };

  if (isError) {
    return (
      <Card>
        <Title level={4}>Lỗi</Title>
        <Text type="danger">Không thể tải thông tin người dùng. Người dùng không tồn tại hoặc bạn không có quyền xem.</Text>
        <div style={{ marginTop: 16 }}>
          <Button icon={<ArrowLeftOutlined />} onClick={handleBack}>Quay lại danh sách người dùng</Button>
        </div>
      </Card>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={handleBack}>
          Quay lại danh sách người dùng
        </Button>
      </div>

      <Card 
        title={
          <Space>
            <Title level={3}>Chi tiết người dùng</Title>
            {user && user.id === currentUser?.id && (
              <Tag color="blue">Bạn</Tag>
            )}
          </Space>
        }
      >
        {isLoading ? (
          <Skeleton active avatar paragraph={{ rows: 4 }} />
        ) : (
          <>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
              <Avatar 
                size={64} 
                icon={<UserOutlined />}
                style={{ marginRight: 16 }}
              />
              <div>
                <Title level={4} style={{ margin: 0 }}>{user?.username}</Title>
                <Text type="secondary">{user?.email}</Text>
                <div style={{ marginTop: 8 }}>
                  {user?.role && getRoleTag(user.role)}
                </div>
              </div>
            </div>

            <Descriptions bordered column={1}>
              <Descriptions.Item label="ID người dùng">{user?.id}</Descriptions.Item>
              <Descriptions.Item label="Tên người dùng">{user?.username}</Descriptions.Item>
              <Descriptions.Item label="Email">
                <Space>
                  <MailOutlined />
                  {user?.email}
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Vai trò">
                {user?.role && getRoleTag(user.role)}
              </Descriptions.Item>
              <Descriptions.Item label="Tạo lúc">
                <Space>
                  <ClockCircleOutlined />
                  {user?.createdAt && new Date(user.createdAt.toString()).toLocaleString()}
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Cập nhật lúc">
                <Space>
                  <ClockCircleOutlined />
                  {user?.updatedAt && new Date(user.updatedAt.toString()).toLocaleString()}
                </Space>
              </Descriptions.Item>
            </Descriptions>

            {/* Có thể thêm các phần khác ở đây như danh sách dự án của người dùng, v.v. */}
          </>
        )}
      </Card>
    </div>
  );
};

export default UserDetailPage;