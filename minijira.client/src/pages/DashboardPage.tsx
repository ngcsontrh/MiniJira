import React from 'react';
import { 
  Typography, 
  Row, 
  Col, 
  Card, 
  Statistic, 
  Table, 
  Tag, 
  Space,
  Avatar,
  Spin
} from 'antd';
import { 
  ProjectOutlined, 
  BugOutlined, 
  CheckCircleOutlined,
  UserOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useProjects } from '../hooks/useProjects';
import { useIssues } from '../hooks/useIssues';
import { Project } from '../models/Project';
import { Issue, IssueStatus } from '../models/Issue';
import useAuth from '../hooks/useAuth';

const { Title } = Typography;

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  
  // Fetch projects - limit to 5 for dashboard
  const { 
    data: projectsData = { items: [], total: 0 }, 
    isLoading: projectsLoading 
  } = useProjects({ pageSize: 5 });
  // Extract the projects array from the PageData structure
  const projects = projectsData.items || [];
  
  // Fetch issues assigned to current user - limit to 5 recent ones
  const { 
    data: myIssuesData = { items: [], total: 0 }, 
    isLoading: issuesLoading 
  } = useIssues({ 
    assigneeId: user?.id,
    pageSize: 5
  });
  // Extract the issues array from the PageData structure
  const myIssues = myIssuesData.items || [];
  
  // Get issue status tag color
  const getStatusColor = (status?: IssueStatus) => {
    const colors: Record<IssueStatus, string> = {
      'todo': 'default',
      'in_progress': 'processing',
      'in_review': 'warning',
      'done': 'success'
    };
    
    return colors[status as IssueStatus] || 'default';
  };
  
  // Project columns for table
  const projectColumns = [
    {
      title: 'Dự án',
      key: 'name',
      render: (_: unknown, record: Project) => (
        <Link to={`/projects/${record.id}`}>
          <Space>
            <ProjectOutlined />
            {record.name}
          </Space>
        </Link>
      ),
    },
    {
      title: 'Mã',
      dataIndex: 'key',
      key: 'key',
    },
    {
      title: 'Chủ sở hữu',
      dataIndex: 'ownerId',
      key: 'ownerId',
      render: (_: unknown, record: Project) => (
        <Space>
          <Avatar size="small" icon={<UserOutlined />} />
          {record.ownerName}
        </Space>
      ),
    },
  ];
  
  // Issue columns for table
  const issueColumns = [
    {
      title: 'Công việc',
      key: 'title',
      render: (record: Issue) => (
        <Link to={`/issues/${record.id}`}>
          <Space>
            <BugOutlined />
            {record.title}
          </Space>
        </Link>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: IssueStatus) => (
        <Tag color={getStatusColor(status)}>
          {status?.toUpperCase().replace('_', ' ')}
        </Tag>
      ),
    },
    {
      title: 'Dự án',
      dataIndex: 'projectId',
      key: 'projectId',
      render: (_: unknown, issue: Issue) => (
        <Link to={`/projects/${issue.projectId}`}>
          {issue.projectName}
        </Link>
      )
    },
  ];

  if (projectsLoading || issuesLoading) {
    return <Spin size="large" tip="Đang tải dữ liệu..." />;
  }

  return (
    <div>
      <Title level={2}>Trang chủ</Title>

      {/* Stats Cards */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Dự án của tôi"
              value={projects.length}
              prefix={<ProjectOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Công việc cần làm"
              value={myIssues.filter((i) => i.status === "todo").length}
              prefix={<BugOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Đang tiến hành"
              value={myIssues.filter((i) => i.status === "in_progress").length}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: "#faad14" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Đã hoàn thành"
              value={myIssues.filter((i) => i.status === "done").length}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: "#3f8600" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Recent Projects */}
      <Card
        title="Dự án gần đây"
        extra={<Link to="/projects">Xem tất cả</Link>}
        style={{ marginBottom: 24 }}
      >
        <Table
          columns={projectColumns}
          dataSource={projects}
          rowKey="id"
          pagination={false}
        />
      </Card>

      {/* My Issues */}
      <Card
        title="Công việc của tôi"
        extra={<Link to="/issues">Xem tất cả</Link>}
      >
        <Table
          columns={issueColumns}
          dataSource={myIssues}
          rowKey="id"
          pagination={false}
        />
      </Card>
    </div>
  );
};

export default DashboardPage;