import React, { useState } from 'react';
import {
  Typography,
  Button,
  Table,
  Space,
  Avatar,
  Modal,
  Form,
  Input,
  message,
  Spin,
  Flex,
  Pagination,
  Select
} from 'antd';
import {
  PlusOutlined,
  UserOutlined,
  EditOutlined,
  ProjectOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useProjects, useCreateProject } from '../hooks/useProjects';
import { Project, ProjectFilter } from '../models/Project';
import { useUsers } from '../hooks/useUsers';
import useAuth from '../hooks/useAuth';
import { queryClient } from '../utils/QueryProvider';

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const ProjectsPage: React.FC = () => {
  const { user } = useAuth();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [filter, setFilter] = useState<ProjectFilter>({ pageIndex: 1, pageSize: 10 });
  const [showMyProjects, setShowMyProjects] = useState(false);
  const [ownerId, setOwnerId] = useState<string | undefined>(undefined);

  const { data: users = [] } = useUsers();

  // Use the projects hook to fetch projects with unique query key based on filter
  const { data: projectsData = { items: [], total: 0 }, isLoading, refetch } = useProjects(filter);
  // Extract the projects array from the PageData structure
  const projects = projectsData.items || [];
  const total = projectsData.total || 0;

  // Use the createProject mutation hook
  const createProjectMutation = useCreateProject();

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

      // Create project using the mutation hook
      await createProjectMutation.mutateAsync({
        name: values.name,
        key: values.key,
        description: values.description,
        ownerId: values.ownerId,
        memberIds: values.memberIds || []
      });

      messageApi.success('Project created successfully');
      refetch(); // Refresh the projects list
      setIsModalVisible(false);
    } catch (error) {
      console.error('Submit failed:', error);
      messageApi.error('Failed to create project. Please try again.');
    }
  };

  const handlePaginationChange = (page: number, pageSize: number) => {
    setFilter((prev) => ({
      ...prev,
      pageIndex: page,
      pageSize: pageSize,
    }));
    refetch();
  };

  const toggleMyProjects = () => {
    const newShowMyProjects = !showMyProjects;
    setShowMyProjects(newShowMyProjects);
    
    // Clear the existing projects cache before changing the filter
    queryClient.removeQueries({ queryKey: ['projects', 'list'] });
    
    // Create a new filter object instead of modifying the existing one
    const newFilter = {
      pageIndex: 1, // Reset to first page when toggling filter
      pageSize: filter.pageSize,
      memberId: newShowMyProjects ? user?.id : undefined,
    };
    
    setFilter(newFilter);
  };

  const columns = [
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
      render: (ownerId: string) => (
        <Space>
          <Avatar size="small" icon={<UserOutlined />} />
          {users.find((user) => user.id === ownerId)?.username}
        </Space>
      ),
    },
    {
      title: 'Xem công việc',
      key: 'viewIssues',
      render: (_: unknown, record: Project) => (
        <Link to={`/issues?projectId=${record.id}`}>
          <Button type="link">Xem công việc</Button>
        </Link>
      ),
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
      render: (_: unknown, record: Project) => (
        <Space>
          <Link to={`/projects/${record.id}`}>
            <Button type="text" icon={<EditOutlined />} />
          </Link>
        </Space>
      ),
    },
  ];

  if (isLoading) {
    return <Spin size="large" tip="Loading projects..." />;
  }

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
        <Title level={2}>Dự án</Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={showCreateModal}
        >
          Tạo dự án mới
        </Button>
      </div>

      <Flex justify="space-between" align="center" style={{ marginBottom: 16 }}>
        <Button
          onClick={toggleMyProjects}
          type={showMyProjects ? "primary" : "default"}
          style={{
            backgroundColor: showMyProjects ? "#fa8c16" : undefined,
            borderColor: showMyProjects ? "#fa8c16" : undefined,
          }}
        >
          {showMyProjects ? "Tất cả dự án" : "Dự án của tôi"}
        </Button>
      </Flex>

      <Table
        columns={columns}
        dataSource={projects}
        rowKey="id"
        pagination={false}
      />

      <Flex justify="end" style={{ marginTop: 16 }}>
        <Pagination
          current={filter?.pageIndex}
          total={total}
          pageSize={filter?.pageSize}
          onChange={handlePaginationChange}
        />
      </Flex>

      <Modal
        title="Tạo dự án mới"
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Tên dự án"
            rules={[{ required: true, message: "Vui lòng nhập tên dự án" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="key"
            label="Mã dự án"
            rules={[{ required: true, message: "Vui lòng nhập mã dự án" }]}
            tooltip="Một định danh ngắn cho dự án, ví dụ: 'PROJ'"
          >
            <Input maxLength={10} style={{ textTransform: "uppercase" }} />
          </Form.Item>

          <Form.Item name="description" label="Mô tả">
            <TextArea rows={4} />
          </Form.Item>

          <Form.Item
            name="ownerId"
            label="Chủ sở hữu"
            rules={[{ required: true, message: "Vui lòng chọn chủ sở hữu" }]}
          >
            <Select placeholder="Chọn chủ sở hữu" onChange={(value) => setOwnerId(value)}>
              {users.map((u) => (
                <Option key={u.id} value={u.id}>
                  {u.username}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="memberIds" label="Thành viên">
            <Select
              mode="multiple"
              placeholder="Chọn thành viên"
              style={{ width: "100%" }}
              optionFilterProp="children"
            >
              {users.filter(x => x.id !== ownerId).map((u) => (
                <Option key={u.id} value={u.id}>
                  {u.username}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProjectsPage;