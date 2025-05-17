/* eslint-disable @typescript-eslint/no-explicit-any */
import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { 
  Card, 
  Typography, 
  Button, 
  Space, 
  Descriptions, 
  Divider, 
  Tag, 
  Modal, 
  message,
  Skeleton, 
  Empty,
  Badge,
  Avatar,
  List,
  Form,
  Input,
  Tabs,
  Select,
  Upload
} from 'antd';
import { Comment } from "@ant-design/compatible";

import { 
  EditOutlined, 
  DeleteOutlined, 
  ExclamationCircleOutlined,
  ArrowLeftOutlined,
  PaperClipOutlined,
  SendOutlined,
  InboxOutlined,
  DownloadOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { useIssue, useUpdateIssue, useDeleteIssue } from '../hooks/useIssues';
import { useProject } from '../hooks/useProjects';
import { useComments, useAddComment, useDeleteComment } from '../hooks/useComments';
import { useAttachments, useUploadAttachment, useUploadMultipleAttachments, useDownloadAttachment } from '../hooks/useAttachments';
import { useUsers } from '../hooks/useUsers';
import { IssueStatus, IssueType, IssuePriority } from '../models/Issue';
import { Comment as CommentModel } from '../models/Comment';
import useAuth from '../hooks/useAuth';
import "json-diff-kit/dist/viewer.css";

const { Title, Text, Paragraph } = Typography;
const { confirm } = Modal;
const { TextArea } = Input;
const { TabPane } = Tabs;
const { Option } = Select;

const ISSUE_TYPES = [
  { id: 'bug', label: 'Bug', icon: () => <Tag color="red">Bug</Tag> },
  { id: 'task', label: 'Task', icon: () => <Tag color="blue">Task</Tag> },
  { id: 'story', label: 'Story', icon: () => <Tag color="green">Story</Tag> },
  { id: 'epic', label: 'Epic', icon: () => <Tag color="purple">Epic</Tag> }
];

const ISSUE_PRIORITIES = [
  { id: 'highest', label: 'Cao nhất', icon: () => <Tag color="red">Cao nhất</Tag> },
  { id: 'high', label: 'Cao', icon: () => <Tag color="orange">Cao</Tag> },
  { id: 'medium', label: 'Trung bình', icon: () => <Tag color="yellow">Trung bình</Tag> },
  { id: 'low', label: 'Thấp', icon: () => <Tag color="blue">Thấp</Tag> },
  { id: 'lowest', label: 'Thấp nhất', icon: () => <Tag color="gray">Thấp nhất</Tag> }
];

const IssueDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [comment, setComment] = useState('');
  const [isEditIssueModalVisible, setIsEditIssueModalVisible] = useState(false);
  const [issueEditForm] = Form.useForm();
  
  // Fetch issue data
  const { 
    data: issue, 
    isLoading: isIssueLoading, 
    error: issueError 
  } = useIssue(id || '');
  
  // Get related project
  const {
    data: project,
    isLoading: isProjectLoading
  } = useProject(issue?.projectId || '');
  
  // Get users for assignee selection
  const { data: usersData = [] } = useUsers();
  
  // Get comments for this issue
  const {
    data: comments = [],
    isLoading: isCommentsLoading,
    refetch: refetchComments
  } = useComments(id || '');
  
  // Get attachments for this issue
  const {
    data: attachments = [],
    isLoading: isAttachmentsLoading,
    refetch: refetchAttachments
  } = useAttachments(id || '');
  
  // Mutations
  const updateIssueMutation = useUpdateIssue();
  const deleteIssueMutation = useDeleteIssue();
  const addCommentMutation = useAddComment();
  const deleteCommentMutation = useDeleteComment();
  const uploadAttachmentMutation = useUploadAttachment();
  const uploadMultipleAttachmentsMutation = useUploadMultipleAttachments();
  const downloadAttachmentMutation = useDownloadAttachment();
  
  // Handle edit issue
  const handleEdit = () => {
    // Initialize form with current issue data
    issueEditForm.setFieldsValue({
      title: issue!.title,
      description: issue!.description,
      type: issue!.type,
      priority: issue!.priority,
      assigneeId: issue!.assigneeId
    });
    setIsEditIssueModalVisible(true);
  };
  
  // Handle delete issue
  const handleDelete = () => {
    if (!issue) return;
    
    confirm({
      title: 'Bạn có chắc chắn muốn xóa công việc này không?',
      icon: <ExclamationCircleOutlined />,
      content: 'Hành động này không thể hoàn tác.',
      okText: 'Xác nhận',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk() {
        deleteIssueMutation.mutate(issue, {
          onSuccess: () => {
            message.success('Issue deleted successfully');
            navigate('/issues');
          }
        });
      }
    });
  };
  
  // Handle status change
  const handleStatusChange = (newStatus: IssueStatus) => {
    if (!issue) return;
    
    const updatedIssue = { ...issue, status: newStatus };
    updateIssueMutation.mutate(updatedIssue, {
      onSuccess: () => {
        message.success(`Trạng thái được cập nhật thành công`);
      }
    });
  };
  
  // Handle add comment
  const handleAddComment = () => {
    if (!comment.trim() || !user?.id || !id) return;
    
    const newComment: CommentModel = {
      content: comment,
      issueId: id,
      userId: user.id
    };
    
    addCommentMutation.mutate(newComment, {
      onSuccess: () => {
        setComment('');
        message.success('Đã thêm bình luận thành công');
        refetchComments(); // Refresh comments after adding
      },
      onError: (error) => {
        message.error('Thêm bình luận thất bại: ' + error);
      }
    });
  };
  
  // Handle delete comment
  const handleDeleteComment = (commentId: string) => {
    confirm({
      title: 'Bạn có chắc chắn muốn xóa bình luận này không?',
      icon: <ExclamationCircleOutlined />,
      content: 'Hành động này không thể hoàn tác.',
      okText: 'Xác nhận',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk() {
        deleteCommentMutation.mutate({ id: commentId } as CommentModel, {
          onSuccess: () => {
            message.success('Comment deleted successfully');
            refetchComments(); // Refresh comments after deleting
          },
          onError: (error) => {
            message.error(`Failed to delete comment: ${error}`);
          }
        });
      }
    });
  };
  
  // Handle upload attachment immediately after file selection
  const handleImmediateFileUpload = (file: File) => {
    if (!id) return false;
    
    uploadAttachmentMutation.mutate({ issueId: id, file }, {
      onSuccess: (data) => {
        message.success(`${file.name} đã được tải lên thành công`);
        
        // Add the new attachment ID to the issue's attachmentIds array
        if (data.id && issue) {
          const attachmentIds = [...(issue.attachmentIds || []), data.id];
          const updatedIssue = { ...issue, attachmentIds };
          
          // Update the issue with the new attachmentIds array
          updateIssueMutation.mutate(updatedIssue, {
            onSuccess: () => {
              refetchAttachments(); // Refresh attachments after uploading
            },
            onError: (error) => {
              message.error(`Cập nhật file đính kèm thất bại: ${error}`);
            }
          });
        } else {
          refetchAttachments(); // Still refresh attachments even if we can't update the issue
        }
      },
      onError: (error) => {
        message.error(`Tải lên file đính kèm thất bại ${file.name}: ${error}`);
      }
    });
    
    // Return false to prevent default upload behavior
    return false;
  };
  
  // Handle download attachment
  const handleDownloadAttachment = (id: string, fileName: string) => {
    downloadAttachmentMutation.mutate(
      { id, fileName },
      {
        onSuccess: () => {
          message.success("Tải xuống tệp đính kèm thành công");
        },
        onError: (error) => {
          message.error(`Tải xuống file đính kèm thất bại: ${error}`);
        },
      }
    );
  };
  
  // Handle delete attachment
  const handleDeleteAttachment = (attachmentId: string) => {
    confirm({
      title: 'Bạn có chắc chắn muốn xóa tệp đính kèm này không?',
      icon: <ExclamationCircleOutlined />,
      content: 'Hành động này không thể hoàn tác.',
      okText: 'Xác nhận',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk() {
        // We just need to update the issue's attachmentIds array
        if (issue) {
          const updatedAttachmentIds = (issue.attachmentIds || []).filter(id => id !== attachmentId);
          const updatedIssue = { ...issue, attachmentIds: updatedAttachmentIds };
          
          updateIssueMutation.mutate(updatedIssue, {
            onSuccess: () => {
              message.success('Tệp đính kèm đã được xóa thành công');
              refetchAttachments(); // Refresh attachments after deletion
            },
            onError: (error) => {
              message.error(`Xóa tệp đính kèm thất bại: ${error}`);
            }
          });
        }
      }
    });
  };
  
  // Issue status badge mapping
  const getStatusBadge = (status?: IssueStatus) => {
    const mapping: Record<IssueStatus, { status: string, text: string }> = {
      'todo': { status: 'default', text: 'TO DO' },
      'in_progress': { status: 'processing', text: 'IN PROGRESS' },
      'in_review': { status: 'warning', text: 'IN REVIEW' },
      'done': { status: 'success', text: 'DONE' }
    };
    return status ? 
      <Badge status={mapping[status].status as any} text={mapping[status].text} /> : 
      <Badge status="default" text="UNKNOWN" />;
  };
  
  // Issue type badge mapping
  const getTypeLabel = (type?: IssueType) => {
    if (!type) return null;
    
    const mapping: Record<IssueType, { color: string, label: string }> = {
      'bug': { color: 'red', label: 'Bug' },
      'task': { color: 'blue', label: 'Task' },
      'story': { color: 'green', label: 'Story' },
      'epic': { color: 'purple', label: 'Epic' }
    };
    
    // Make sure the type exists in our mapping
    if (mapping[type]) {
      return <Tag color={mapping[type].color}>{mapping[type].label}</Tag>;
    }
    
    // Fallback for unknown types
    return <Tag>Unknown</Tag>;
  };
  
  // Issue priority badge mapping
  const getPriorityLabel = (priority?: IssuePriority) => {
    const mapping: Record<IssuePriority, { color: string, label: string }> = {
      'highest': { color: 'red', label: 'Cao nhất' },
      'high': { color: 'orange', label: 'Cao' },
      'medium': { color: 'yellow', label: 'Trung bình' },
      'low': { color: 'blue', label: 'Thấp' },
      'lowest': { color: 'gray', label: 'Thấp nhất' }
    };
    return priority ? <Tag color={mapping[priority].color}>{mapping[priority].label}</Tag> : null;
  };
  
  if (isIssueLoading || isProjectLoading) {
    return <Skeleton active />;
  }
  
  if (issueError) {
    return <div>Error loading issue: {(issueError as Error).message}</div>;
  }
  
  if (!issue) {
    return <Empty description="Không tìm thấy công việc" />;
  }

  return (
    <div style={{ padding: "24px" }}>
      <div style={{ marginBottom: "16px" }}>
        <Button
          type="link"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/issues")}
        >
          Quay lại danh sách công việc
        </Button>
      </div>

      <Card>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "16px",
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "8px",
              }}
            >
              {getTypeLabel(issue.type)}
              <Text>{issue.key}</Text>
            </div>
            <Title level={2} style={{ marginTop: 0 }}>
              {issue.title}
            </Title>
          </div>
          <Space>
            <Button icon={<EditOutlined />} onClick={handleEdit}>
              Sửa
            </Button>
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={handleDelete}
              loading={deleteIssueMutation.isPending}
            >
              Xóa
            </Button>
          </Space>
        </div>

        <Tabs defaultActiveKey="details">
          <TabPane tab="Chi tiết" key="details">
            <Descriptions bordered column={2}>
              <Descriptions.Item label="Trạng thái" span={1}>
                {getStatusBadge(issue.status)}
              </Descriptions.Item>
              <Descriptions.Item label="Mức ưu tiên" span={1}>
                {getPriorityLabel(issue.priority)}
              </Descriptions.Item>
              <Descriptions.Item label="Dự án" span={1}>
                {project?.name || issue.projectId}
              </Descriptions.Item>
              <Descriptions.Item label="Người báo cáo" span={1}>
                {issue.reporterName || issue.reporterId || "Không xác định"}
              </Descriptions.Item>
              <Descriptions.Item label="Người được giao" span={1}>
                {issue.assigneeName || issue.assigneeId || "Chưa giao"}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày tạo" span={1}>
                {issue.createdAt
                  ? dayjs(issue.createdAt).format("YYYY-MM-DD HH:mm:ss")
                  : "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày cập nhật" span={1}>
                {issue.updatedAt
                  ? dayjs(issue.updatedAt).format("YYYY-MM-DD HH:mm:ss")
                  : "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Mô tả" span={2}>
                <Paragraph>{issue.description || "Không có mô tả"}</Paragraph>
              </Descriptions.Item>
            </Descriptions>

            {user?.role !== "Stakeholder" && (
              <>
                <Divider orientation="left">Chuyển trạng thái</Divider>
                <div style={{ marginBottom: "24px" }}>
                  <Space>
                    <Button
                      type={issue.status === "todo" ? "primary" : "default"}
                      onClick={() => handleStatusChange("todo")}
                      disabled={issue.status === "todo"}
                    >
                      Cần làm
                    </Button>
                    <Button
                      type={
                        issue.status === "in_progress" ? "primary" : "default"
                      }
                      onClick={() => handleStatusChange("in_progress")}
                      disabled={issue.status === "in_progress"}
                    >
                      Đang làm
                    </Button>
                    <Button
                      type={
                        issue.status === "in_review" ? "primary" : "default"
                      }
                      onClick={() => handleStatusChange("in_review")}
                      disabled={issue.status === "in_review"}
                    >
                      Đang xem xét
                    </Button>
                    <Button
                      type={issue.status === "done" ? "primary" : "default"}
                      onClick={() => handleStatusChange("done")}
                      disabled={issue.status === "done"}
                    >
                      Hoàn thành
                    </Button>
                  </Space>
                </div>
              </>
            )}
          </TabPane>

          <TabPane tab="Bình luận" key="comments">
            {isCommentsLoading ? (
              <Skeleton active />
            ) : (
              <List
                className="comment-list"
                header={`${comments.length} ${
                  comments.length > 1 ? "bình luận" : "bình luận"
                }`}
                itemLayout="horizontal"
                dataSource={comments}
                locale={{ emptyText: "Chưa có bình luận nào" }}
                renderItem={(item) => (
                  <li>
                    <Comment
                      author={item.userId || "Người dùng"}
                      avatar={
                        <Avatar>
                          {(item.userId?.[0] || "U").toUpperCase()}
                        </Avatar>
                      }
                      content={item.content}
                      datetime={
                        item.createdAt
                          ? dayjs(item.createdAt).format("YYYY-MM-DD HH:mm:ss")
                          : "N/A"
                      }
                      actions={[
                        <Button
                          key="delete"
                          type="text"
                          danger
                          size="small"
                          onClick={() =>
                            item.id && handleDeleteComment(item.id)
                          }
                          disabled={item.userId !== user?.id}
                        >
                          Xóa
                        </Button>,
                      ]}
                    />
                  </li>
                )}
              />
            )}

            <Divider />

            <div>
              <Form layout="vertical">
                <Form.Item>
                  <TextArea
                    rows={4}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Thêm bình luận..."
                  />
                </Form.Item>
                <Form.Item>
                  <Button
                    htmlType="submit"
                    loading={addCommentMutation.isPending}
                    onClick={handleAddComment}
                    type="primary"
                    icon={<SendOutlined />}
                    disabled={!comment.trim()}
                  >
                    Thêm bình luận
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </TabPane>

          {user?.role !== "Stakeholder" && (
            <TabPane tab="Tệp đính kèm" key="attachments">
              {isAttachmentsLoading ? (
                <Skeleton active />
              ) : (
                <>
                  <Upload.Dragger
                    name="files"
                    multiple
                    customRequest={({ file, onSuccess }) => {
                      handleImmediateFileUpload(file as File);
                      onSuccess?.("ok");
                    }}
                    showUploadList={false}
                  >
                    <p className="ant-upload-drag-icon">
                      <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">
                      Nhấn hoặc kéo tệp vào khu vực này để tải lên
                    </p>
                    <p className="ant-upload-hint">
                      Hỗ trợ tải lên một hoặc nhiều tệp.
                    </p>
                  </Upload.Dragger>

                  <Divider />

                  <List
                    itemLayout="horizontal"
                    dataSource={attachments}
                    renderItem={(attachment, index) => (
                      <List.Item
                        actions={[
                          <Button
                            type="link"
                            icon={<DownloadOutlined />}
                            onClick={() =>
                              handleDownloadAttachment(
                                attachment.id!,
                                attachment.fileName!
                              )
                            }
                          >
                            Tải xuống
                          </Button>,
                          <Button
                            type="text"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() =>
                              handleDeleteAttachment(attachment.id!)
                            }
                          >
                            Xóa
                          </Button>,
                        ]}
                      >
                        <List.Item.Meta
                          avatar={<PaperClipOutlined />}
                          title={`Tệp đính kèm ${index + 1}`}
                          description={
                            attachment.fileName || attachment.filePath
                          }
                        />
                      </List.Item>
                    )}
                  />
                </>
              )}
            </TabPane>
          )}

          <TabPane tab="Lịch sử thay đổi" key="history">
            <List
              itemLayout="vertical"
              dataSource={issue.logs}
              renderItem={(log, index) => {
                let oldData, newData;

                try {
                  oldData =
                    typeof log.oldData === "string"
                      ? JSON.parse(log.oldData)
                      : log.oldData;
                  newData =
                    typeof log.newData === "string"
                      ? JSON.parse(log.newData)
                      : log.newData;
                } catch (err) {
                  console.error("Lỗi parse JSON:", err);
                  return <List.Item>Lỗi dữ liệu JSON</List.Item>;
                }

                // Tìm các key bị thay đổi
                const changedFields = Object.keys(newData).filter((key) => {
                  // So sánh đơn giản, nếu cần sâu hơn thì dùng deep compare
                  return oldData?.[key] !== newData?.[key];
                });

                return (
                  <List.Item>
                    <List.Item.Meta title={`Thay đổi ${index + 1}`} />
                    {changedFields.length === 0 ? (
                      <Text type="secondary">Không có thay đổi.</Text>
                    ) : (
                      changedFields.map((key) => (
                        <div key={key} style={{ marginBottom: 8 }}>
                          <Text strong>{key}</Text>
                          <br />
                          <Text type="secondary">Giá trị cũ: </Text>
                          {JSON.stringify(oldData[key])}
                          <br />
                          <Text type="secondary">Giá trị mới: </Text>
                          {JSON.stringify(newData[key])}
                        </div>
                      ))
                    )}
                  </List.Item>
                );
              }}
            />
          </TabPane>
        </Tabs>
      </Card>

      {/* Edit Issue Modal */}
      <Modal
        title="Sửa công việc"
        open={isEditIssueModalVisible}
        onCancel={() => setIsEditIssueModalVisible(false)}
        onOk={() => {
          issueEditForm
            .validateFields()
            .then((values) => {
              // Get attachment files from the form
              const { files } = values;
              const fileList = files?.fileList || [];
              const attachmentFiles = fileList.map((f: any) => f.originFileObj);

              // Prepare updated issue with all needed fields
              const updatedIssue = {
                ...issue,
                title: values.title,
                description: values.description,
                type: values.type,
                priority: values.priority,
                assigneeId: values.assigneeId,
              };

              // Call update mutation
              updateIssueMutation.mutate(updatedIssue, {
                onSuccess: () => {
                  message.success("Công việc đã được cập nhật thành công");
                  setIsEditIssueModalVisible(false);

                  // Upload attachments if any
                  if (attachmentFiles.length > 0 && id) {
                    uploadMultipleAttachmentsMutation.mutate(
                      { files: attachmentFiles, issueId: id },
                      {
                        onSuccess: () => {
                          message.success(
                            "Tệp đính kèm đã được tải lên thành công"
                          );
                          refetchAttachments();
                        },
                        onError: (error) => {
                          message.error(
                            `Không thể tải lên tệp đính kèm: ${error}`
                          );
                        },
                      }
                    );
                  }
                },
                onError: (error) => {
                  message.error(`Không thể cập nhật công việc: ${error}`);
                },
              });
            })
            .catch((info) => {
              console.log("Validate Failed:", info);
            });
        }}
        confirmLoading={updateIssueMutation.isPending}
        width={600}
      >
        <Form form={issueEditForm} layout="vertical">
          <Form.Item
            name="title"
            label="Tiêu đề"
            rules={[
              { required: true, message: "Vui lòng nhập tiêu đề công việc" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="key"
            label="Mã công việc"
            rules={[{ required: false, message: "Vui lòng nhập mã công việc" }]}
          >
            <Input placeholder="Mã công việc (tự động tạo nếu để trống)" />
          </Form.Item>

          <Form.Item
            name="reporterId"
            label="Người báo cáo"
            initialValue={issue.reporterId}
            rules={[{ required: true, message: "Vui lòng chọn người báo cáo" }]}
          >
            <Select placeholder="Chọn người báo cáo">
              {usersData?.map((u) => (
                <Option key={u.id} value={u.id}>
                  {u.username}
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
            rules={[
              { required: false, message: "Vui lòng chọn người được giao" },
            ]}
          >
            <Select
              placeholder="Chọn người được giao"
              defaultValue={issue.assigneeId}
            >
              {usersData?.map((u) => (
                <Option key={u.id} value={u.id}>
                  {u.username}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="description" label="Mô tả">
            <TextArea rows={4} />
          </Form.Item>

          <Form.Item
            name="files"
            label="Tệp đính kèm"
            valuePropName="fileList"
            getValueFromEvent={(e) => {
              if (Array.isArray(e)) {
                return e;
              }
              return e?.fileList;
            }}
          >
            <Upload.Dragger
              name="files"
              multiple
              customRequest={({ file, onSuccess }) => {
                if (!id) return;
                uploadAttachmentMutation.mutate(
                  { file: file as File, issueId: id },
                  {
                    onSuccess: (data) => {
                      message.success(
                        `${(file as File).name} đã được tải lên thành công`
                      );
                      // Store the attachment data returned from the server
                      (file as any).attachmentId = data.id;
                      (file as any).attachmentData = data;
                      onSuccess?.(data, new XMLHttpRequest());

                      // Add the new attachment ID to the issue's attachmentIds array
                      if (data.id && issue) {
                        const attachmentIds = [
                          ...(issue.attachmentIds || []),
                          data.id,
                        ];
                        const updatedIssue = { ...issue, attachmentIds };

                        // Update the issue with the new attachmentIds array
                        updateIssueMutation.mutate(updatedIssue, {
                          onSuccess: () => {
                            refetchAttachments();
                          },
                          onError: (error) => {
                            message.error(
                              `Không thể cập nhật tệp đính kèm của công việc: ${error}`
                            );
                          },
                        });
                      }
                    },
                    onError: (error) => {
                      message.error(
                        `Không thể tải lên ${(file as File).name}: ${error}`
                      );
                    },
                  }
                );
              }}
              listType="picture"
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                Nhấn hoặc kéo tệp vào khu vực này để tải lên
              </p>
              <p className="ant-upload-hint">
                Hỗ trợ tải lên một hoặc nhiều tệp.
              </p>
            </Upload.Dragger>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default IssueDetailPage;