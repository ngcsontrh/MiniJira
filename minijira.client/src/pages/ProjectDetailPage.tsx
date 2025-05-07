/* eslint-disable @typescript-eslint/no-explicit-any */
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import { 
  Card, 
  Typography, 
  Button, 
  Space, 
  Descriptions, 
  Table, 
  Tag, 
  Modal, 
  message,
  Skeleton,
  Empty,
  Badge,
  Form,
  Input,
  Select,
  Tabs,
  Upload
} from 'antd';
import { UploadFile } from 'antd/es/upload/interface';
import { 
  EditOutlined, 
  PlusOutlined,
  ExclamationCircleOutlined,
  ArrowLeftOutlined,
  UserAddOutlined,
  UserDeleteOutlined,
  InboxOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { useProject, useUpdateProject } from '../hooks/useProjects';
import { useIssues, useCreateIssue } from '../hooks/useIssues';
import { useProjectMembers, useAddProjectMember, useRemoveProjectMember, useUpdateProjectMember } from '../hooks/useProjectMembers';
import { useUsers } from '../hooks/useUsers';
import { useUploadAttachment } from '../hooks/useAttachments';
import { Issue, IssueStatus, IssueType, IssuePriority } from '../models/Issue';
import { ProjectMember, ProjectMemberRole } from '../models/ProjectMember';
import { User } from '../models/User';
import { ISSUE_TYPES, ISSUE_PRIORITIES } from '../utils/constants';
import useAuth from '../hooks/useAuth';

const { Title, Text } = Typography;
const { confirm } = Modal;
const { TextArea } = Input;
const { Option } = Select;
const { TabPane } = Tabs;

const ProjectDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [form] = Form.useForm();
  const [memberForm] = Form.useForm();
  const [projectEditForm] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  
  const [isCreateIssueModalVisible, setIsCreateIssueModalVisible] = useState(false);
  const [isAddMemberModalVisible, setIsAddMemberModalVisible] = useState(false);
  const [isEditProjectModalVisible, setIsEditProjectModalVisible] = useState(false);
  const [attachmentFiles, setAttachmentFiles] = useState<File[]>([]);
  const [uploadedAttachmentIds, setUploadedAttachmentIds] = useState<string[]>([]);
  const [ownerId, setOwnerId] = useState<string | undefined>(undefined);
  
  // Fetch project data
  const { 
    data: project, 
    isLoading: isProjectLoading, 
    error: projectError 
  } = useProject(id || '');
  
  // Project update mutation
  const updateProjectMutation = useUpdateProject();
  
  // Fetch issues for this project
  const { 
    data: issuesData, 
    isLoading: isIssuesLoading,
    refetch: refetchIssues
  } = useIssues({ projectId: id });

  // Fetch project members
  const {
    data: members = [],
    isLoading: isMembersLoading,
    refetch: refetchMembers
  } = useProjectMembers(id || '');
  
  // Fetch all users for adding members
  const { data: users = [] } = useUsers();
  
  // Project member mutations
  const addMemberMutation = useAddProjectMember();
  const updateMemberMutation = useUpdateProjectMember();
  const removeMemberMutation = useRemoveProjectMember();
  
  // Create issue mutation
  const createIssueMutation = useCreateIssue();

  const uploadAttachmentMutation = useUploadAttachment();

  
  // Handle immediate file upload
  const handleImmediateFileUpload = (file: File) => {
    uploadAttachmentMutation.mutate({ file }, {
      onSuccess: (data) => {
        messageApi.success(`${file.name} uploaded successfully`);
        
        // Thêm file vào state để hiển thị trong UI
        setAttachmentFiles(prev => [...prev, file]);
        
        // Lưu ID của file đính kèm đã tải lên để dùng khi tạo issue
        if (data.id) {
          setUploadedAttachmentIds(prev => [...prev, data.id!]);
        }
      },
      onError: (error) => {
        messageApi.error(`Failed to upload ${file.name}: ${error}`);
      }
    });
    
    return false;
  };

  // Handle edit project
  const handleEdit = () => {
    // Initialize form with current project data
    projectEditForm.setFieldsValue({
      name: project!.name,
      key: project!.key,
      description: project!.description,
      ownerId: project!.ownerId,
      memberIds: members.map(member => member.memberId)
    });
    setIsEditProjectModalVisible(true);
  };
  
  // Handle adding a project member
  const handleAddMember = async (userId: string, role: ProjectMemberRole) => {
    try {
      await addMemberMutation.mutateAsync({
        projectId: id,
        memberId: userId,
        role: role
      });
      
      messageApi.success('Member added successfully');
      setIsAddMemberModalVisible(false);
      refetchMembers();
    } catch (error) {
      messageApi.error(`Failed to add member: ${(error as Error).message}`);
    }
  };
  
  // Handle updating a project member's role
  const handleRoleChange = async (memberId: string, role: ProjectMemberRole) => {
    try {
      await updateMemberMutation.mutateAsync({
        id: memberId,
        projectId: id,
        role: role
      });
      
      messageApi.success('Member role updated successfully');
      refetchMembers();
    } catch (error) {
      messageApi.error(`Failed to update member role: ${(error as Error).message}`);
    }
  };
  
  // Handle removing a project member
  const handleRemoveMember = (memberId: string) => {
    confirm({
      title: 'Are you sure you want to remove this member?',
      icon: <ExclamationCircleOutlined />,
      content: 'This action cannot be undone.',
      okText: 'Yes, Remove',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          await removeMemberMutation.mutateAsync({
            id: memberId,
            projectId: id
          });
          
          messageApi.success('Member removed successfully');
          refetchMembers();
        } catch (error) {
          messageApi.error(`Failed to remove member: ${(error as Error).message}`);
        }
      }
    });
  };
  
  // Issue status color mapping
  const getStatusColor = (status?: IssueStatus) => {
    const mapping: Record<IssueStatus, string> = {
      'todo': 'default',
      'in_progress': 'processing',
      'in_review': 'warning',
      'done': 'success'
    };
    return status ? mapping[status] : 'default';
  };
  
  // Issue type icon/badge mapping
  const getTypeLabel = (type?: IssueType) => {
    const mapping: Record<IssueType, { color: string, label: string }> = {
      'bug': { color: 'red', label: 'Bug' },
      'task': { color: 'blue', label: 'Task' },
      'story': { color: 'green', label: 'Story' },
      'epic': { color: 'purple', label: 'Epic' }
    };
    return type ? <Tag color={mapping[type].color}>{mapping[type].label}</Tag> : null;
  };
  
  // Issue priority badge mapping
  const getPriorityLabel = (priority?: IssuePriority) => {
    const mapping: Record<IssuePriority, { color: string, label: string }> = {
      'highest': { color: 'red', label: 'Highest' },
      'high': { color: 'orange', label: 'High' },
      'medium': { color: 'yellow', label: 'Medium' },
      'low': { color: 'blue', label: 'Low' },
      'lowest': { color: 'gray', label: 'Lowest' }
    };
    return priority ? <Tag color={mapping[priority].color}>{mapping[priority].label}</Tag> : null;
  };
  
  // Table columns for issues
  const issueColumns = [
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Loại công việc',
      dataIndex: 'type',
      key: 'type',
      render: (type: IssueType) => getTypeLabel(type),
    },
    {
      title: 'Mức độ ưu tiên',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority: IssuePriority) => getPriorityLabel(priority),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: IssueStatus) => (
        <Badge status={getStatusColor(status) as any} text={status?.replace('_', ' ').toUpperCase()} />
      ),
    },
    {
      title: 'Người được giao',
      dataIndex: 'assigneeName',
      key: 'assigneeName',
      render: (assigneeName: string) => assigneeName || 'Unassigned',
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: any) => date ? dayjs(date).format('YYYY-MM-DD') : 'N/A',
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_: any, record: Issue) => (
        <Link to={`/issues/${record.id}`}>
          <Button type="link" icon={<EditOutlined />} />
        </Link>
      ),
    }
  ];
  
  if (isProjectLoading || isIssuesLoading) {
    return <Skeleton active />;
  }
  
  if (projectError) {
    return <div>Error loading project: {(projectError as Error).message}</div>;
  }
  
  if (!project) {
    return <Empty description="Project not found" />;
  }

  return (
    <div style={{ padding: '24px' }}>
      {contextHolder}
      <div style={{ marginBottom: '16px' }}>
        <Button 
          type="link" 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate('/projects')}
        >
          Quay lại dự án
        </Button>
      </div>
      
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <Title level={2}>{project.name}</Title>
            <Text type="secondary">{project.key}</Text>
          </div>
          <Space>
            <Button 
              icon={<EditOutlined />} 
              onClick={handleEdit}
            >
              Sửa
            </Button>
          </Space>
        </div>
        
        <Descriptions bordered>
          <Descriptions.Item label="Mã dự án" span={3}>{project.key}</Descriptions.Item>
          <Descriptions.Item label="Mô tả" span={3}>{project.description || 'Không có mô tả'}</Descriptions.Item>
          <Descriptions.Item label="Ngày tạo">{project.createdAt ? dayjs(project.createdAt).format('YYYY-MM-DD HH:mm:ss') : 'N/A'}</Descriptions.Item>
          <Descriptions.Item label="Ngày cập nhật">{project.updatedAt ? dayjs(project.updatedAt).format('YYYY-MM-DD HH:mm:ss') : 'N/A'}</Descriptions.Item>
          <Descriptions.Item label="ID Chủ sở hữu">{project.ownerId || 'N/A'}</Descriptions.Item>
        </Descriptions>
        
        <Tabs defaultActiveKey="issues" style={{ marginTop: 20 }}>
          <TabPane tab="Công việc" key="issues">
            <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'flex-end' }}>
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={() => setIsCreateIssueModalVisible(true)}
              >
                Tạo công việc mới
              </Button>
            </div>
            
            <Table 
              dataSource={issuesData?.items || []} 
              columns={issueColumns}
              rowKey="id"
              loading={isIssuesLoading}
              pagination={{
                total: issuesData?.total || 0,
                showSizeChanger: true,
                showTotal: (total) => `Tổng số ${total} công việc`,
              }}
            />
          </TabPane>
          
          <TabPane tab="Thành viên" key="members">
            <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'flex-end' }}>
              <Button 
                type="primary" 
                icon={<UserAddOutlined />}
                onClick={() => setIsAddMemberModalVisible(true)}
              >
                Thêm thành viên
              </Button>
            </div>
            
            <MembersTable 
              members={members} 
              loading={isMembersLoading} 
              onRoleChange={handleRoleChange}
              onRemove={handleRemoveMember}
              users={users}
            />
          </TabPane>
        </Tabs>
      </Card>

      <AddMemberModal 
        visible={isAddMemberModalVisible}
        onCancel={() => setIsAddMemberModalVisible(false)}
        onAdd={handleAddMember}
        form={memberForm}
        users={users}
        members={members}
        loading={addMemberMutation.isPending}
      />

      <Modal
        title="Tạo công việc mới"
        open={isCreateIssueModalVisible}
        onCancel={() => {
          setIsCreateIssueModalVisible(false);
          form.resetFields();
          setAttachmentFiles([]);
          setUploadedAttachmentIds([]);
        }}
        onOk={() => {
          form.validateFields()
            .then(values => {
              // Tạo issue mới với attachmentIds đã tải lên trước đó
              createIssueMutation.mutateAsync({
                title: values.title,
                key: values.key, // Optional key field
                description: values.description,
                type: values.type,
                priority: values.priority,
                status: 'todo', // Default status for new issues
                projectId: id,
                reporterId: values.reporterId || user?.id,                
                assigneeId: values.assigneeId, // Assignee selected from form
                attachmentIds: uploadedAttachmentIds // Thêm IDs của các file đính kèm đã tải lên
              })
              .then(() => {
                messageApi.success('Tạo công việc thành công');
                // Refetch để lấy dữ liệu mới nhất
                refetchIssues();
                
                setIsCreateIssueModalVisible(false);
                form.resetFields();
                setAttachmentFiles([]);
                setUploadedAttachmentIds([]);
              })
              .catch((error) => {
                messageApi.error(`Tạo công việc thất bại: ${error.message}`);
              });
            })
            .catch(info => {
              console.log('Validate Failed:', info);
            });
        }}
        confirmLoading={createIssueMutation.isPending}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="title"
            label="Tiêu đề"
            rules={[
              { required: true, message: 'Vui lòng nhập tiêu đề công việc' },
              { max: 255, message: 'Tiêu đề không được quá 255 ký tự' },
            ]}
          >
            <Input />
          </Form.Item>
          
          <Form.Item
            name="key"
            label="Mã"
            rules={[
              { required: true, message: "Vui lòng nhập mã công việc" },
              {
                pattern: /^[a-zA-Z0-9]+$/,
                message: "Chỉ được nhập chữ cái và số (không dấu, không ký tự đặc biệt)"
              },
              { max: 50, message: 'Mã công việc không được quá 50 ký tự' },
            ]}
          >
            <Input placeholder="Mã công việc" />
          </Form.Item>
          
          <Form.Item
            name="type"
            label="Loại công việc"
            rules={[{ required: true, message: 'Vui lòng chọn loại công việc' }]}
          >
            <Select placeholder="Chọn loại công việc">
              {ISSUE_TYPES.map(type => (
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
            rules={[{ required: true, message: 'Vui lòng chọn mức ưu tiên' }]}
          >
            <Select placeholder="Chọn mức ưu tiên">
              {ISSUE_PRIORITIES.map(priority => (
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
              {users && users.map((u) => (
                <Option key={u.id} value={u.id}>
                  {u.username}
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
              {users ? users.map((u) => (
                <Option key={u.id} value={u.id}>
                  {u.username}
                </Option>
              )) : 
              <Option value={user?.id}>{user?.username}</Option>}
            </Select>
          </Form.Item>
          
          <Form.Item
            name="description"
            label="Mô tả"
            rules={[
              { max: 1000, message: 'Mô tả không được quá 1000 ký tự' },
            ]}
          >
            <TextArea rows={4} />
          </Form.Item>
          
          <Form.Item
            label="Tệp đính kèm"
          >
            <Upload.Dragger
              name="files"
              multiple
              beforeUpload={(file) => {
                const isLt10MB = file.size / 1024 / 1024 < 10;
                if (!isLt10MB) {
                  message.error(`${file.name} vượt quá dung lượng cho phép (tối đa 10MB).`);
                  return Upload.LIST_IGNORE;
                }
                return true; // Cho phép upload tiếp tục
              }}
              customRequest={({ file, onSuccess }) => {
                // Tải file lên ngay lập tức
                handleImmediateFileUpload(file as File);
                onSuccess?.("ok");
              }}
              fileList={attachmentFiles.map((file, index) => {
                const uploadFile: UploadFile = {
                  uid: `-${index}`,
                  name: file.name,
                  status: 'done',
                  size: file.size,
                  type: file.type,
                  originFileObj: file as any
                };
                return uploadFile;
              })}
              onRemove={(file) => {
                setAttachmentFiles(prev => 
                  prev.filter(f => f.name !== file.name)
                );
                return true;
              }}
              showUploadList={true}
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">Nhấn hoặc kéo tệp vào khu vực này để tải lên</p>
              <p className="ant-upload-hint">Hỗ trợ tải lên một tệp hoặc nhiều tệp cùng lúc.</p>
            </Upload.Dragger>
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit Project Modal */}
      <Modal
        title="Sửa dự án"
        open={isEditProjectModalVisible}
        onCancel={() => setIsEditProjectModalVisible(false)}
        onOk={() => {
          projectEditForm.validateFields()
            .then(values => {
              // Prepare updated project with all needed fields
              const updatedProject = {
                id: project.id,
                key: values.key,
                name: values.name,
                description: values.description,
                ownerId: values.ownerId || project.ownerId,
                memberIds: values.memberIds || []
              };
              
              // Call update mutation
              updateProjectMutation.mutateAsync(updatedProject)
                .then(() => {
                  messageApi.success('Cập nhật dự án thành công');
                  setIsEditProjectModalVisible(false);
                  projectEditForm.resetFields();
                })
                .catch((error) => {
                  messageApi.error(`Cập nhật dự án thất bại: ${error.message}`);
                });
            })
            .catch(info => {
              console.log('Validate Failed:', info);
            });
        }}
        confirmLoading={updateProjectMutation.isPending}
        width={600}
      >
        <Form form={projectEditForm} layout="vertical">
          <Form.Item
            name="name"
            label="Tên dự án"
            rules={[{ required: true, message: 'Vui lòng nhập tên dự án' }]}
          >
            <Input />
          </Form.Item>
          
          <Form.Item
            name="key"
            label="Mã dự án"
            rules={[{ required: true, message: 'Vui lòng nhập mã dự án' }]}
          >
            <Input />
          </Form.Item>
          
          <Form.Item
            name="description"
            label="Mô tả"
          >
            <TextArea rows={4} />
          </Form.Item>
          
          <Form.Item
            name="ownerId"
            label="Chủ sở hữu"
            rules={[{ required: true, message: 'Vui lòng chọn chủ sở hữu' }]}
          >
            <Select placeholder="Chọn chủ sở hữu" onChange={(value) => setOwnerId(value)}>
              {users.map((user) => (
                <Option key={user.id} value={user.id}>
                  {user.username}
                </Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item
            name="memberIds"
            label="Thành viên"
          >
            <Select 
              mode="multiple" 
              placeholder="Chọn thành viên" 
              style={{ width: '100%' }}
              optionFilterProp="children"
            >
              {users.filter(x => x.id !== ownerId).map((user) => (
                <Option key={user.id} value={user.id}>
                  {user.username}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

interface MembersTableProps {
  members: ProjectMember[];
  loading: boolean;
  onRoleChange: (memberId: string, role: ProjectMemberRole) => void;
  onRemove: (memberId: string) => void;
  users: User[];
}

// Table component for displaying project members
const MembersTable = ({ members, loading, onRoleChange, onRemove, users }: MembersTableProps) => {
  const memberColumns = [
    {
      title: 'Tên người dùng',
      dataIndex: 'username',
      key: 'username',
      render: (_: any, record: ProjectMember) => {
        const user = users.find(u => u.id === record.memberId);
        return user ? user.username : record.memberId;
      },
    },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      key: 'role',
      render: (_: any, record: ProjectMember) => (
        <Select
          value={record.role as ProjectMemberRole}
          style={{ width: 120 }}
          onChange={(value) => onRoleChange(record.id!, value)}
        >
          <Option value="owner">Chủ sở hữu</Option>
          <Option value="developer">Lập trình viên</Option>
          <Option value="tester">Kiểm thử viên</Option>
        </Select>
      ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_: any, record: ProjectMember) => (
        <Button
          type="text"
          danger
          icon={<UserDeleteOutlined />}
          onClick={() => onRemove(record.id!)}
        >
          Xóa
        </Button>
      ),
    },
  ];

  return (
    <Table
      dataSource={members}
      columns={memberColumns}
      rowKey="id"
      loading={loading}
      pagination={{ pageSize: 10 }}
    />
  );
};

interface AddMemberModalProps {
  visible: boolean;
  onCancel: () => void;
  onAdd: (userId: string, role: ProjectMemberRole) => void;
  form: any;
  users: User[];
  members: ProjectMember[];
  loading: boolean;
}

// Modal component for adding new project members
const AddMemberModal = ({ 
  visible, 
  onCancel, 
  onAdd, 
  form, 
  users, 
  members, 
  loading 
}: AddMemberModalProps) => {
  const existingMemberIds = members.map(m => m.memberId);
  
  // Filter out users who are already members
  const availableUsers = users.filter(user => !existingMemberIds.includes(user.id));
  
  return (
    <Modal
      title="Thêm thành viên dự án"
      open={visible}
      onCancel={onCancel}
      onOk={() => {
        form.validateFields()
          .then((values: any) => {
            onAdd(values.userId, values.role);
            form.resetFields();
          })
          .catch((info: any) => {
            console.log('Validate Failed:', info);
          });
      }}
      confirmLoading={loading}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="userId"
          label="Người dùng"
          rules={[{ required: true, message: 'Vui lòng chọn người dùng' }]}
        >
          <Select placeholder="Chọn người dùng">
            {availableUsers.map(user => (
              <Option key={user.id} value={user.id}>
                {user.username}
              </Option>
            ))}
          </Select>
        </Form.Item>
        
        <Form.Item
          name="role"
          label="Vai trò"
          rules={[{ required: true, message: 'Vui lòng chọn vai trò' }]}
          initialValue="developer"
        >
          <Select placeholder="Chọn vai trò">
            <Option value="owner">Chủ sở hữu</Option>
            <Option value="developer">Lập trình viên</Option>
            <Option value="tester">Kiểm thử viên</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ProjectDetailPage;