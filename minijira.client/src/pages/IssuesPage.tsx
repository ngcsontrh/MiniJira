import React, { useEffect, useState } from "react";
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
  Select,
  message,
  Popconfirm,
  Spin,
  Upload,
  Flex,
  Pagination,
} from "antd";
import {
  PlusOutlined,
  UserOutlined,
  EditOutlined,
  DeleteOutlined,
  InboxOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import { UploadFile } from "antd/es/upload/interface";
import { Link, useLocation } from "react-router-dom";
import {
  useIssues,
  useCreateIssue,
  useChangeIssueStatus,
} from "../hooks/useIssues";
import { useUsers } from "../hooks/useUsers";
import { useProjects } from "../hooks/useProjects";
import { useUploadAttachment } from "../hooks/useAttachments";
import { exportToExcel } from "../services/issueService";
import {
  Issue,
  IssueType,
  IssueStatus,
  IssuePriority,
  IssueFilter,
} from "../models/Issue";
import { ISSUE_TYPES, ISSUE_PRIORITIES } from "../utils/constants";
import useAuth from "../hooks/useAuth";
import { queryClient } from '../utils/QueryProvider';

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const IssuesPage: React.FC = () => {
  const { user } = useAuth();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [attachmentFiles, setAttachmentFiles] = useState<File[]>([]);
  const [uploadedAttachmentIds, setUploadedAttachmentIds] = useState<string[]>(
    []
  );
  const [filter, setFilter] = useState<IssueFilter | null>(null);
  const location = useLocation();

  // Use attachment upload hook
  const uploadAttachmentMutation = useUploadAttachment();

  const getQueryParams = React.useCallback((): IssueFilter => {
    const searchParams = new URLSearchParams(location.search);
    const typeParam = searchParams.get("type");
    const priorityParam = searchParams.get("priority");
    const statusParam = searchParams.get("status");
    
    return {
      pageIndex: 1,
      pageSize: 10,
      type: typeParam as IssueType | undefined,
      priority: priorityParam as IssuePriority | undefined,
      status: statusParam as IssueStatus | undefined,
      projectId: searchParams.get("projectId") || undefined,
      assigneeId: searchParams.get("assigneeId") || undefined,
    };
  }, [location.search]);

  useEffect(() => {
    const query = getQueryParams();
    const hasAny = Object.values(query).some(Boolean);
    if (hasAny) {
      setFilter(query);
    }
  }, [getQueryParams]);

  // Handle immediate file upload
  const handleImmediateFileUpload = (file: File) => {
    uploadAttachmentMutation.mutate(
      { file },
      {
        onSuccess: (data) => {
          messageApi.success(`${file.name} uploaded successfully`);

          // Add file to state for UI display
          setAttachmentFiles((prev) => [...prev, file]);

          // Save ID of uploaded attachment to use when creating the issue
          if (data.id) {
            setUploadedAttachmentIds((prev) => [...prev, data.id!]);
          }
        },
        onError: (error) => {
          messageApi.error(`Failed to upload ${file.name}: ${error}`);
        },
      }
    );

    return false;
  };

  // Use the issues hook to fetch issues
  const {
    data: issuesData = { items: [], total: 0 },
    isLoading: issuesLoading,
    refetch,
  } = useIssues(filter ?? undefined);
  // Extract the issues array from the PageData structure
  const issues = issuesData.items || [];
  const total = issuesData.total || 0;

  // Use the users hook to fetch users for assignee dropdown
  const { data: usersData = [], isLoading: usersLoading } = useUsers();

  // Use the projects hook to fetch projects for dropdown
  const {
    data: projectsData = { items: [], total: 0 },
    isLoading: projectsLoading,
  } = useProjects();
  // Extract the projects array from the PageData structure
  const projects = projectsData.items || [];

  // Use the mutation hooks
  const createIssueMutation = useCreateIssue();
  const changeStatusMutation = useChangeIssueStatus();

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

      // Create issue using the mutation hook
      await createIssueMutation.mutateAsync({
        title: values.title,
        description: values.description,
        type: values.type,
        priority: values.priority,
        status: "todo", // Default status for new issues
        projectId: values.projectId,
        reporterId: user?.id,
        reporterName: user?.username,
        assigneeId: values.assigneeId || user?.id, // Default to self if not specified
        assigneeName: user?.username, // Will be updated by server with actual assignee name
        attachmentIds: uploadedAttachmentIds, // Include attachment IDs
      });

      messageApi.success("Issue created successfully");
      refetch(); // Refresh the issues list
      setIsModalVisible(false);

      // Reset attachment states
      setAttachmentFiles([]);
      setUploadedAttachmentIds([]);
    } catch (error) {
      console.error("Submit failed:", error);
      messageApi.error("Failed to create issue. Please try again.");
    }
  };

  const handleStatusChange = async (issue: Issue, newStatus: IssueStatus) => {
    try {
      await changeStatusMutation.mutateAsync({
        ...issue,
        status: newStatus,
      });

      messageApi.success("Status updated successfully");
      refetch(); // Refresh the issues list
    } catch (error) {
      console.error("Status change failed:", error);
      messageApi.error("Failed to update status. Please try again.");
    }
  };

  const handleExportExcel = async () => {
    try {
      messageApi.loading('Preparing Excel export...');
      await exportToExcel(filter ?? undefined);
      messageApi.success('Issues exported to Excel successfully');
    } catch (error) {
      console.error('Export failed:', error);
      messageApi.error('Failed to export issues. Please try again.');
    }
  };

  // Get issue type tag color and icon
  const getIssueTypeInfo = (type?: IssueType) => {
    const issueType = ISSUE_TYPES.find((t) => t.id === type);
    return {
      label: issueType?.label || "Unknown",
      icon: issueType?.icon ? issueType.icon() : null,
    };
  };

  // Get issue priority tag color and icon
  const getIssuePriorityInfo = (priority?: IssuePriority) => {
    const issuePriority = ISSUE_PRIORITIES.find((p) => p.id === priority);
    return {
      label: issuePriority?.label || "Unknown",
      icon: issuePriority?.icon ? issuePriority.icon() : null,
    };
  };

  const handleFilter = (key: keyof IssueFilter, value: string) => {
    // Clear the existing issues cache before changing the filter
    queryClient.removeQueries({ queryKey: ['issues', 'list'] });
    
    // Create a new filter object 
    const newFilter = {
      ...filter,
      pageIndex: 1, // Reset to first page when changing filter
      pageSize: filter?.pageSize || 10,
      [key]: value,
    };
    
    setFilter(newFilter);
  };

  const handlePaginationChange = (page: number, pageSize: number) => {
    // Clear the existing issues cache before changing pagination
    queryClient.removeQueries({ queryKey: ['issues', 'list'] });
    
    // Create new filter with updated pagination
    const newFilter = {
      ...filter,
      pageIndex: page,
      pageSize: pageSize,
    };
    
    setFilter(newFilter);
  };


  const columns = [
    {
      title: "Công việc",
      key: "title",
      render: (_: unknown, record: Issue) => (
        <Link to={`/issues/${record.id}`}>
          <Space>
            {getIssueTypeInfo(record.type).icon}
            <span>{record.title}</span>
          </Space>
        </Link>
      ),
    },
    {
      title: "Loại",
      dataIndex: "type",
      key: "type",
      render: (type: IssueType) => (
        <Tag color="blue">{getIssueTypeInfo(type).label}</Tag>
      ),
    },
    {
      title: "Ưu tiên",
      dataIndex: "priority",
      key: "priority",
      render: (priority: IssuePriority) => (
        <Space>
          {getIssuePriorityInfo(priority).icon}
          <span>{getIssuePriorityInfo(priority).label}</span>
        </Space>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: IssueStatus, record: Issue) => {
        const isAdminOrPMOrTester = user?.role === "Admin" || user?.role === "ProjectManager" || user?.role === "Tester";

        const isAssignee = record.assigneeId === user?.id;

        const canEdit = isAdminOrPMOrTester || isAssignee;

        return (
          <Select
            value={status}
            style={{ width: 130 }}
            disabled={!canEdit}
            onChange={(newStatus) =>
              handleStatusChange(record, newStatus as IssueStatus)
            }
          >
            <Option value="todo">Cần làm</Option>
            <Option value="in_progress">Đang làm</Option>
            <Option value="in_review">Đang xem xét</Option>
            <Option value="done">Hoàn thành</Option>
          </Select>
        );
      },
    },
    {
      title: "Dự án",
      dataIndex: "projectId",
      key: "projectId",
      render: (projectId: string) => {
        const project = projects.find((p) => p.id === projectId);
        return project ? (
          <Link to={`/projects/${projectId}`}>
            <Tag color="green">{project.key}</Tag>
          </Link>
        ) : (
          projectId
        );
      },
    },
    {
      title: "Người được giao",
      dataIndex: "assigneeId",
      key: "assigneeId",
      render: (_: unknown, issue: Issue) => {
        const assignee = usersData.find((u) => u.id === issue.assigneeId);
        return (
          <Space>
            <Avatar size="small" icon={<UserOutlined />} />
            {assignee ? assignee.username : "Chưa được giao"}
          </Space>
        );
      },
    },
    ...(() => {
      const isDisplay =
        user?.role === "Admin" ||
        user?.role === "ProjectManager" ||
        user?.role === "Tester";
      if (!isDisplay) return [];
      return [
        {
          title: "Thao tác",
          key: "actions",
          render: (_: unknown, record: Issue) => (
            <Space>
              <Link to={`/issues/${record.id}`}>
                <Button type="text" icon={<EditOutlined />} />
              </Link>
              <Popconfirm
                title="Bạn có chắc chắn muốn xóa công việc này không?"
                onConfirm={() => console.log("Delete issue", record.id)}
                okText="Có"
                cancelText="Không"
              >
                <Button type="text" danger icon={<DeleteOutlined />} />
              </Popconfirm>
            </Space>
          ),
        },
      ];
    })(),
  ];

  if (issuesLoading || projectsLoading || usersLoading) {
    return <Spin size="large" tip="Đang tải dữ liệu..." />;
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
        <Title level={2}>Công việc</Title>
        {(() => {
          const isDisplay =
            user?.role === "Admin" ||
            user?.role === "ProjectManager" ||
            user?.role === "Tester";

          if (!isDisplay) return null;

          return (
            <Space>
              <Button
                type="primary"
                icon={<DownloadOutlined />}
                onClick={handleExportExcel}
              >
                Xuất Excel
              </Button>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={showCreateModal}
              >
                Tạo công việc mới
              </Button>
            </Space>
          );
        })()}
      </div>

      <Flex gap={5} style={{ marginBottom: "15px" }}>
        <Select
          allowClear
          placeholder="Loại công việc"
          value={filter?.type ?? null}
          style={{ width: 160 }}
          onChange={(value) => handleFilter("type", value)}
          options={[
            { value: "bug", label: "Bug" },
            { value: "task", label: "Task" },
            { value: "story", label: "Story" },
            { value: "epic", label: "Epic" },
          ]}
        />

        <Select
          allowClear
          placeholder="Mức ưu tiên"
          value={filter?.priority ?? null}
          style={{ width: 160 }}
          onChange={(value) => handleFilter("priority", value)}
          options={[
            { value: "lowest", label: "Thấp nhất" },
            { value: "low", label: "Thấp" },
            { value: "medium", label: "Trung bình" },
            { value: "high", label: "Cao" },
            { value: "highest", label: "Cao nhất" },
          ]}
        />

        <Select
          allowClear
          placeholder="Trạng thái"
          value={filter?.status ?? null}
          style={{ width: 160 }}
          onChange={(value) => handleFilter("status", value)}
          options={[
            { value: "todo", label: "Cần làm" },
            { value: "in_progress", label: "Đang làm" },
            { value: "in_review", label: "Đang xem xét" },
            { value: "done", label: "Hoàn thành" },
          ]}
        />

        <Select
          allowClear
          placeholder="Dự án"
          value={filter?.projectId ?? null}
          style={{ width: 160 }}
          onChange={(value) => handleFilter("projectId", value)}
          options={projects.map((project) => ({
            label: project.name,
            value: project.id,
          }))}
        />

        <Select
          allowClear
          placeholder="Người được giao"
          value={filter?.assigneeId ?? null}
          style={{ width: 160 }}
          onChange={(value) => handleFilter("assigneeId", value)}
          options={usersData.map((user) => ({
            label: user.username,
            value: user.id,
          }))}
        />
      </Flex>

      <Table
        columns={columns}
        dataSource={issues}
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
        title="Tạo công việc mới"
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={handleCancel}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="title"
            label="Tiêu đề"
            rules={[
              { required: true, message: "Vui lòng nhập tiêu đề công việc" },
              { max: 255, message: "Tiêu đề không được quá 255 ký tự" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="key"
            label="Mã"
            rules={[
              { required: true, message: "Vui lòng nhập mã dự án" },
              {
                pattern: /^[a-zA-Z0-9]*$/,
                message:
                  "Chỉ được nhập chữ và số (không dấu, không ký tự đặc biệt)",
              },
              { max: 50, message: "Mã không được quá 50 ký tự" },
            ]}
            tooltip="Một định danh ngắn cho dự án, ví dụ: 'PROJ'"
          >
            <Input placeholder="Mã công việc" />
          </Form.Item>

          <Form.Item
            name="projectId"
            label="Dự án"
            rules={[{ required: true, message: "Vui lòng chọn dự án" }]}
          >
            <Select placeholder="Chọn dự án">
              {projects.map((project) => (
                <Option key={project.id} value={project.id}>
                  {project.key} - {project.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="type"
            label="Loại công việc"
            rules={[
              { required: true, message: "Vui lòng chọn loại công việc" },
            ]}
          >
            <Select placeholder="Chọn loại công việc">
              {ISSUE_TYPES.map((type) => (
                <Option key={type.id} value={type.id}>
                  <Space>
                    {type.icon()}
                    {type.label}
                  </Space>
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="priority"
            label="Mức ưu tiên"
            rules={[{ required: true, message: "Vui lòng chọn mức ưu tiên" }]}
          >
            <Select placeholder="Chọn mức ưu tiên">
              {ISSUE_PRIORITIES.map((priority) => (
                <Option key={priority.id} value={priority.id}>
                  <Space>
                    {priority.icon()}
                    {priority.label}
                  </Space>
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="assigneeId"
            label="Người được giao"
            initialValue={user?.id}
          >
            <Select placeholder="Chọn người được giao" allowClear>
              {usersData.map((user) => (
                <Option key={user.id} value={user.id}>
                  {user.username}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="reporterId"
            label="Người báo cáo"
            initialValue={user?.id}
            rules={[{ required: true, message: "Vui lòng chọn người báo cáo" }]}
          >
            <Select placeholder="Chọn người báo cáo">
              {usersData.map((u) => (
                <Option key={u.id} value={u.id}>
                  {u.username}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="description"
            label="Mô tả"
            rules={[{ max: 1000, message: "Mô tả không được quá 1000 ký tự" }]}
          >
            <TextArea rows={4} />
          </Form.Item>

          <Form.Item label="Tệp đính kèm">
            <Upload.Dragger
              name="files"
              multiple
              beforeUpload={(file) => {
                const isLt10MB = file.size / 1024 / 1024 < 10;
                if (!isLt10MB) {
                  message.error(
                    `${file.name} vượt quá dung lượng cho phép (tối đa 10MB).`
                  );
                  return Upload.LIST_IGNORE;
                }
                return true; // Cho phép upload tiếp tục
              }}
              customRequest={({ file, onSuccess }) => {
                // Upload file immediately
                handleImmediateFileUpload(file as File);
                onSuccess?.("ok");
              }}
              fileList={attachmentFiles.map((file, index) => {
                const uploadFile: UploadFile = {
                  uid: `-${index}`,
                  name: file.name,
                  status: "done",
                  size: file.size,
                  type: file.type,
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  originFileObj: file as any,
                };
                return uploadFile;
              })}
              onRemove={(file) => {
                setAttachmentFiles((prev) =>
                  prev.filter((f) => f.name !== file.name)
                );
                return true;
              }}
              showUploadList={true}
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                Nhấn hoặc kéo tệp vào khu vực này để tải lên
              </p>
              <p className="ant-upload-hint">
                Hỗ trợ tải lên một tệp hoặc nhiều tệp cùng lúc.
              </p>
            </Upload.Dragger>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default IssuesPage;
