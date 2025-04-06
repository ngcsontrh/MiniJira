import React, { useState } from "react";
import {
  Typography,
  Form,
  Input,
  Select,
  Divider,
  Button,
  DatePicker,
  Space,
  message,
  Row,
  Col,
  Popconfirm,
  Breadcrumb,
  Tag,
} from "antd";
import { Link } from "react-router-dom"; // Import Link từ react-router-dom
import dayjs from "dayjs"; // Import dayjs để xử lý ngày tháng

const { Title, Text, Link: AntLink } = Typography;

const IssueDetail: React.FC = () => {
  const [isEditMode, setIsEditMode] = useState(false); // Quản lý chế độ xem/chỉnh sửa
  const [form] = Form.useForm();

  // Dữ liệu mẫu (có thể thay bằng dữ liệu thực tế từ API)
  const issue = {
    code: "ISSUE-001",
    summary: "Fix login bug",
    type: "Bug",
    priority: "High",
    description: "This is a detailed description of the issue.",
    assignee: "John Doe",
    reporter: "Jane Smith",
    createdDate: "2025-04-01",
    updatedDate: "2025-04-02",
    status: "Open", // Trạng thái của issue
    attachments: [
      { name: "Design Document", url: "https://example.com/design-doc" },
      { name: "Error Logs", url: "https://example.com/error-logs" },
    ],
  };

  // Hàm xác định màu của Tag dựa trên trạng thái
  const getStatusTagColor = (status: string) => {
    switch (status) {
      case "Open":
        return "green";
      case "In Progress":
        return "blue";
      case "Closed":
        return "red";
      default:
        return "default";
    }
  };

  const handleEdit = () => {
    setIsEditMode(true); // Chuyển sang chế độ chỉnh sửa
  };

  const handleCancel = () => {
    setIsEditMode(false); // Quay lại chế độ xem
    form.resetFields(); // Reset form về giá trị ban đầu
  };

  const handleUpdate = () => {
    form.validateFields().then((values) => {
      console.log("Updated values:", values);
      message.success("Issue updated successfully!");
      setIsEditMode(false); // Quay lại chế độ xem sau khi cập nhật
    });
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "calc(100vh - 48px)", // Trừ chiều cao header/footer nếu có
      }}
    >
      {/* Breadcrumb */}
      <Breadcrumb style={{ marginBottom: 16 }}>
        <Breadcrumb.Item>Home</Breadcrumb.Item>
        <Breadcrumb.Item>Issues</Breadcrumb.Item>
        <Breadcrumb.Item>{issue.code}</Breadcrumb.Item>
      </Breadcrumb>

      {/* Header */}
      <div
        style={{
          marginBottom: 24,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Title level={4}>
          {issue.code} - {issue.summary}{" "}
          <Tag color={getStatusTagColor(issue.status)}>{issue.status}</Tag>
        </Title>
        <Space>
          {!isEditMode ? (
            <Button type="primary" onClick={handleEdit}>
              Edit
            </Button>
          ) : (
            <>
              <Button type="primary" onClick={handleUpdate}>
                Update
              </Button>
              <Popconfirm
                title="Cancel edit"
                description="Are you sure to cancel edit?"
                placement="right"
                okText="Yes"
                cancelText="No"
                onConfirm={handleCancel}
              >
                <Button danger>Cancel</Button>
              </Popconfirm>
            </>
          )}
          <Popconfirm
            title="Delete the task"
            description="Are you sure to delete this task?"
            placement="right"
            okText="Yes"
            cancelText="No"
          >
            <Button type="primary" danger>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "row",
        }}
      >
        {/* Phần bên trái (6 phần) */}
        <div style={{ flex: 6, paddingRight: 24 }}>
          <Form
            form={form}
            layout="vertical"
            initialValues={{
              ...issue,
              createdDate: dayjs(issue.createdDate),
              updatedDate: dayjs(issue.updatedDate),
            }}
          >
            {/* Type Section */}
            <Divider />
            <Text strong style={{ fontSize: 16 }}>Type</Text>
            <Form.Item name="type" style={{ marginTop: 8 }}>
              <Select disabled={!isEditMode}>
                <Select.Option value="Bug">Bug</Select.Option>
                <Select.Option value="Feature">Feature</Select.Option>
                <Select.Option value="Task">Task</Select.Option>
              </Select>
            </Form.Item>

            {/* Priority Section */}
            <Divider />
            <Text strong style={{ fontSize: 16 }}>Priority</Text>
            <Form.Item name="priority" style={{ marginTop: 8 }}>
              <Select disabled={!isEditMode}>
                <Select.Option value="Low">Low</Select.Option>
                <Select.Option value="Medium">Medium</Select.Option>
                <Select.Option value="High">High</Select.Option>
              </Select>
            </Form.Item>

            {/* Description Section */}
            <Divider />
            <Text strong style={{ fontSize: 16 }}>Description</Text>
            <Form.Item name="description" style={{ marginTop: 8 }}>
              <Input.TextArea rows={4} disabled={!isEditMode} />
            </Form.Item>

            {/* Attachment Section */}
            <Divider />
            <Text strong style={{ fontSize: 16 }}>Attachments</Text>
            <div style={{ marginTop: 8 }}>
              {issue.attachments.map((attachment, index) => (
                <div key={index}>
                  <AntLink href={attachment.url} target="_blank">
                    {attachment.name}
                  </AntLink>
                </div>
              ))}
            </div>
          </Form>
        </div>

        {/* Phần bên phải (4 phần) */}
        <div
          style={{ flex: 4, paddingLeft: 24, borderLeft: "1px solid #D9D9D9" }}
        >
          <Form
            form={form}
            initialValues={{
              ...issue,
              createdDate: dayjs(issue.createdDate),
              updatedDate: dayjs(issue.updatedDate),
            }}
          >
            {/* People Section */}
            <Divider />
            <Text strong style={{ fontSize: 16 }}>People</Text>
            <Row style={{ flex: 1 }}>
              <Col span={24}>
                <Form.Item label="Assignee" name="assignee">
                  <Select disabled={!isEditMode}>
                    <Select.Option value="John Doe">John Doe</Select.Option>
                    <Select.Option value="Alice Johnson">Alice Johnson</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label="Reporter" name="reporter">
                  <Select disabled={!isEditMode}>
                    <Select.Option value="Jane Smith">Jane Smith</Select.Option>
                    <Select.Option value="Bob Brown">Bob Brown</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            {/* Date Section */}
            <Divider />
            <Text strong style={{ fontSize: 16 }}>Date</Text>
            <Row style={{ flex: 1 }}>
              <Col span={24}>
                <Form.Item label="Created Date" name="createdDate">
                  <DatePicker disabled={!isEditMode} style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label="Updated Date" name="updatedDate">
                  <DatePicker disabled={!isEditMode} style={{ width: "100%" }} />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
      </div>

      {/* Nút Quay Lại */}
      <div style={{ marginTop: 24, textAlign: "center" }}>
        <Link to="/issues">
          <Button type="default">Back to Issues</Button>
        </Link>
      </div>
    </div>
  );
};

export default IssueDetail;
