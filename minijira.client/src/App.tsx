import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { themeConfig } from './assets/styles/theme';
import { QueryProvider } from './utils/QueryProvider';

// Layouts
import MainLayout from './layouts/MainLayout';

// Pages
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UsersPage from './pages/UsersPage';
import UserDetailPage from './pages/UserDetailPage';
import ProjectsPage from './pages/ProjectsPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import IssuesPage from './pages/IssuesPage';
import IssueDetailPage from './pages/IssueDetailPage';
import KanbanBoard from './pages/Kanban';
import NotFoundPage from './pages/NotFoundPage';
import ProfilePage from './pages/ProfilePage';

// Components
import RequireAuth from './components/auth/RequireAuth';
import AdminRoute from './components/auth/AdminRoute';

import './App.css';

function App() {  

  // Check if user is already logged in

  return (
    <QueryProvider>
      <ConfigProvider theme={themeConfig}>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* Redirect to login if not authenticated */}
            
            {/* Protected Routes */}
            <Route element={<RequireAuth />}>
              <Route element={<MainLayout />}>
                {/* Default route redirects to dashboard */}
                <Route path="/" element={<DashboardPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/projects" element={<ProjectsPage />} />
                <Route path="/projects/:id" element={<ProjectDetailPage />} />
                <Route path="/issues" element={<IssuesPage />} />
                <Route path="/issues/:id" element={<IssueDetailPage />} />
                <Route path="/kanban" element={<KanbanBoard />} />
                
                {/* Admin only routes */}
                <Route element={<AdminRoute />}>
                  <Route path="/users" element={<UsersPage />} />
                  <Route path="/users/:id" element={<UserDetailPage />} />
                </Route>
                
                <Route path="/profile" element={<ProfilePage />} />
              </Route>
            </Route>
            
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </ConfigProvider>
    </QueryProvider>
  );
}

export default App;
