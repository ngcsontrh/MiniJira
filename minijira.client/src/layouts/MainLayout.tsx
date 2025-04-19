import React from 'react';
import { Layout, Menu, Avatar, Dropdown, theme } from 'antd';
import { 
  ProjectOutlined, 
  BugOutlined, 
  UserOutlined, 
  LogoutOutlined,
  DashboardOutlined,
  AppstoreOutlined
} from '@ant-design/icons';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import './MainLayout.css';

const { Header, Content } = Layout;

const MainLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = theme.useToken();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Set the active menu item based on the current path
  const getSelectedKey = () => {
    const path = location.pathname;
    if (path.includes('/projects')) return ['projects'];
    if (path.includes('/issues')) return ['issues'];
    if (path.includes('/users')) return ['users'];
    if (path.includes('/kanban')) return ['kanban'];
    return ['dashboard'];
  };

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Hồ sơ',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Đăng xuất',
      danger: true,
    },
  ];

  const handleUserMenuClick = ({ key }: { key: string }) => {
    if (key === 'logout') {
      handleLogout();
    } else if (key === 'profile') {
      navigate('/profile');
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header className="main-header" style={{ height: 48, lineHeight: '48px' }}>
        <div className="logo-header">
            <Link to="/dashboard" className="logo-link">
            <img src="/logo.png" alt="Logo" className="logo" style={{ width: '250px', height: 'auto' }} />
            </Link>
        </div>
        <Menu
          theme="light"
          mode="horizontal"
          defaultSelectedKeys={getSelectedKey()}
          selectedKeys={getSelectedKey()}
          className="nav-menu"
          style={{ height: 48, lineHeight: '48px' }}
          items={[
            {
              key: 'dashboard',
              icon: <DashboardOutlined />,
              label: <Link to="/dashboard">Trang chủ</Link>,
            },
            {
              key: 'projects',
              icon: <ProjectOutlined />,
              label: <Link to="/projects">Dự án</Link>,
            },
            {
              key: 'issues',
              icon: <BugOutlined />,
              label: <Link to="/issues">Công việc</Link>,
            },
            {
              key: 'kanban',
              icon: <AppstoreOutlined />,
              label: <Link to="/kanban">Bảng Kanban</Link>,
            },
            // Only show the Users menu item for Admin users
            ...(user?.role === 'Admin' ? [{
              key: 'users',
              icon: <UserOutlined />,
              label: <Link to="/users">Người dùng</Link>,
            }] : []),
          ]}
        />
        <div className="header-right">
          <Dropdown 
            menu={{ 
              items: userMenuItems,
              onClick: handleUserMenuClick,
            }} 
            placement="bottomRight"
          >
            <div className="user-info">
              <span className="user-name">{user?.username}</span>
              <Avatar 
                size="small"
                icon={<UserOutlined />}
                style={{ backgroundColor: token.colorPrimary }}
              />
            </div>
          </Dropdown>
        </div>
      </Header>
      <Content className="main-content">
        <Outlet />
      </Content>
    </Layout>
  );
};

export default MainLayout;