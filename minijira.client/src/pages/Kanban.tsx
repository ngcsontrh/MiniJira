import React, { useEffect, useState } from "react";
import {
  Typography,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Select,
  message,
  Spin,
  Upload,
  Flex,
  Row,
} from "antd";
import {
  PlusOutlined,
  InboxOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import { UploadFile } from "antd/es/upload/interface";
import { useLocation } from "react-router-dom";
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
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { KanbanColumn } from "../components/kanban/KanbanColumn";
import { queryClient } from '../utils/QueryProvider';

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const KanbanBoard: React.FC = () => {
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

  // Define sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Use attachment upload hook
  const uploadAttachmentMutation = useUploadAttachment();

  const getQueryParams = React.useCallback((): IssueFilter => {
    const searchParams = new URLSearchParams(location.search);
    const typeParam = searchParams.get("type");
    const priorityParam = searchParams.get("priority");
    const statusParam = searchParams.get("status");
    
    return {
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

  const handleFilter = (key: keyof IssueFilter, value: string) => {
    // Clear the existing issues cache before changing the filter
    queryClient.removeQueries({ queryKey: ['issues', 'list'] });
    
    // Create a new filter object 
    const newFilter = {
      ...filter,
      [key]: value,
    };
    
    setFilter(newFilter);
  };

  // Group issues by status for the Kanban board
  const getIssuesByStatus = () => {
    const groupedIssues: { [key in IssueStatus]?: Issue[] } = {
      todo: [],
      in_progress: [],
      in_review: [],
      done: [],
    };

    issues.forEach((issue) => {
      const status = issue.status || "todo";
      if (!groupedIssues[status]) {
        groupedIssues[status] = [];
      }
      groupedIssues[status]?.push(issue);
    });

    return groupedIssues;
  };

  // Handle drag and drop
  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    console.log("Drag event:", { active, over });

    const issue = issues.find((issue) => issue.id === active.id);
    if (!issue) {
      console.error("Issue not found for active.id:", active.id);
      return;
    }

    const newStatus = over.id as string;
    if (newStatus === "todo" || newStatus === "in_progress" || newStatus === "in_review" || newStatus === "done") {
      handleStatusChange(issue, newStatus as IssueStatus);
    } else {
      console.error("Invalid status:", newStatus);
    }
  };

  if (issuesLoading || projectsLoading || usersLoading) {
    return <Spin size="large" tip="Đang tải dữ liệu..." />;
  }

  const groupedIssues = getIssuesByStatus();

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
        <Title level={2}>Bảng Kanban</Title>
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
      </div>

      <Flex gap={5} style={{ marginBottom: "15px" }}>
        <Select
          allowClear
          placeholder="Loại công việc"
          value={filter?.type ?? null}
          style={{ width: 160 }}
          onChange={(value) => handleFilter("type", value)}
          options={[
            { value: "bug", label: "Lỗi" },
            { value: "task", label: "Nhiệm vụ" },
            { value: "story", label: "Câu chuyện" },
            { value: "epic", label: "Sử thi" },
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

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <Row gutter={16} style={{ height: "calc(100vh - 230px)" }}>
          <KanbanColumn title="Cần làm" status="todo" issues={groupedIssues.todo || []} />
          <KanbanColumn title="Đang làm" status="in_progress" issues={groupedIssues.in_progress || []} />
          <KanbanColumn title="Đang xem xét" status="in_review" issues={groupedIssues.in_review || []} />
          <KanbanColumn title="Hoàn thành" status="done" issues={groupedIssues.done || []} />
        </Row>
      </DndContext>

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
            rules={[{ required: true, message: "Vui lòng nhập tiêu đề công việc" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="key"
            label="Mã"
            rules={[{ required: false, message: "Vui lòng nhập mã công việc" }]}
          >
            <Input placeholder="Mã công việc (tự động tạo nếu để trống)" />
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
            name="type"
            label="Loại công việc"
            rules={[{ required: true, message: "Vui lòng chọn loại công việc" }]}
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
            rules={[{ required: false, message: "Vui lòng chọn người được giao" }]}
          >
            <Select placeholder="Chọn người được giao" defaultValue={user?.id}>
              {usersData.map((user) => (
                <Option key={user.id} value={user.id}>
                  {user.username}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="description" label="Mô tả">
            <TextArea rows={4} />
          </Form.Item>

          <Form.Item label="Tệp đính kèm">
            <Upload.Dragger
              name="files"
              multiple
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

export default KanbanBoard;