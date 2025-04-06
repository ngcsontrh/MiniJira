import React from "react";
import { Layout, ConfigProvider, Menu, Input, Button, Dropdown, Space } from "antd";
import { Outlet, Link } from "react-router-dom";
import { useAuthStore } from "./stores/authStore";

const { Header, Content, Footer } = Layout;
const { Search } = Input;

const AppHeader: React.FC = () => {
  const { isLoggedIn, username, login, logout } = useAuthStore();

  const userMenu = (
    <Menu
      items={[
        { key: "logout", label: <span onClick={logout}>Logout</span> },
      ]}
    />
  );

  const menuItems = isLoggedIn
    ? [
        { key: "home", label: <Link to="/">Home</Link> },
        { key: "projects", label: <Link to="/projects">Projects</Link> },
        { key: "issues", label: <Link to="/issues">Issues</Link> },
      ]
    : []; // Không hiển thị menu nếu chưa đăng nhập

  return (
    <Header style={{ display: "flex", alignItems: "center", background: "#F4F5F7", padding: "0 24px", height: 48 }}>
      <div
        style={{
          width: 200,
          display: "flex",
          alignItems: "center",
          padding: "0 16px",
          borderRadius: "8px",
        }}
      >
        <img src="/logo.jpg" alt="logo" style={{ width: 30, height: 30, marginRight: 8 }} />
        <span style={{ fontSize: 16, fontWeight: "bold", color: "#4A4A4A" }}>MiniJira</span>
      </div>
      <Menu
        theme="light"
        mode="horizontal"
        style={{ flex: 1, lineHeight: "48px", marginLeft: 16 }}
        items={menuItems}
      />
      <Search
        placeholder="Search..."
        style={{
          width: 200,
          marginRight: 16,
          backgroundColor: "#FFFFFF",
          color: "#4A4A4A",
          border: "1px solid #D9D9D9",
          borderRadius: 4,
        }}
        onSearch={(value) => console.log(value)}
      />
      {isLoggedIn ? (
        <Dropdown overlay={userMenu} placement="bottomRight">
          <Space style={{ cursor: "pointer", fontWeight: "bold", color: "#4A4A4A" }}>
            {username}
          </Space>
        </Dropdown>
      ) : (
        <Button
          type="primary"
          style={{
            backgroundColor: "#FF8C00",
            borderColor: "#FF8C00",
            fontWeight: "bold",
          }}
          onClick={() => login("John Doe")} // Giả lập đăng nhập
        >
          Login
        </Button>
      )}
    </Header>
  );
};

const App: React.FC = () => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#FF8C00",
          colorBgContainer: "#F4F5F7",
          borderRadiusLG: 8,
        },
      }}
    >
      <Layout style={{ minHeight: "100vh" }}>
        <AppHeader />
        <Layout style={{ background: "#F4F5F7" }}>
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: "calc(100vh - 144px)",
              background: "#FFFFFF",
              borderRadius: 8,
            }}
          >
            <Outlet /> {/* Render nội dung từ các route */}
          </Content>
          <Footer
            style={{
              textAlign: "center",
              background: "#F4F5F7",
              padding: "16px 24px",
              color: "#4A4A4A",
            }}
          >
            MiniJira ©2025 Created by Your Team
          </Footer>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

export default App;
