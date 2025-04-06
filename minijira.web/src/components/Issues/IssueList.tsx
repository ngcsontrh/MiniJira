import React from "react";
import { Table, Space, Button, Tag, Popconfirm } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import type { TableProps } from "antd";

interface Issue {
  key: string;
  code: string;
  summary: string;
  assignee: string;
  reporter: string;
  status: string;
  created: string;
  updated: string;
  projectId: string; // Thêm projectId để liên kết với Project
}

interface IssueListProps {
  projectId?: string; // Thêm prop projectId để lọc danh sách Issues
}

const IssueList: React.FC<IssueListProps> = ({ projectId }) => {
  const navigate = useNavigate();

  const data: Issue[] = [
    {
      key: "1",
      code: "ISSUE-001",
      summary: "Fix login bug",
      assignee: "John Doe",
      reporter: "Jane Smith",
      status: "Open",
      created: "2025-04-01",
      updated: "2025-04-02",
      projectId: "1",
    },
    {
      key: "2",
      code: "ISSUE-002",
      summary: "Add dark mode",
      assignee: "Alice Johnson",
      reporter: "Bob Brown",
      status: "In Progress",
      created: "2025-04-03",
      updated: "2025-04-04",
      projectId: "1",
    },
    {
      key: "3",
      code: "ISSUE-003",
      summary: "Update documentation",
      assignee: "Charlie Davis",
      reporter: "Eve White",
      status: "Closed",
      created: "2025-04-05",
      updated: "2025-04-06",
      projectId: "2",
    },
  ];

  // Lọc danh sách Issues theo projectId (nếu có)
  const filteredData = projectId
    ? data.filter((issue) => issue.projectId === projectId)
    : data;

  const redirectToDetail = (key: string) => {
    navigate(`/issues/${key}`); // Điều hướng đến chế độ xem chi tiết Issue
  };

  const columns: TableProps<Issue>["columns"] = [
    {
      title: "Code",
      dataIndex: "code",
      key: "code",
      render: (text, record) => (
        <a
          href="#"
          style={{ color: "#1890ff" }}
          onClick={(e) => {
            e.preventDefault();
            redirectToDetail(record.key);
          }}
        >
          {text}
        </a>
      ),
    },
    {
      title: "Summary",
      dataIndex: "summary",
      key: "summary",
      render: (text, record) => (
        <a
          href="#"
          style={{ color: "#1890ff" }}
          onClick={(e) => {
            e.preventDefault();
            redirectToDetail(record.key);
          }}
        >
          {text}
        </a>
      ),
    },
    {
      title: "Assignee",
      dataIndex: "assignee",
      key: "assignee",
    },
    {
      title: "Reporter",
      dataIndex: "reporter",
      key: "reporter",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color = "green";
        if (status === "In Progress") color = "blue";
        if (status === "Closed") color = "red";
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Created",
      dataIndex: "created",
      key: "created",
    },
    {
      title: "Updated",
      dataIndex: "updated",
      key: "updated",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => redirectToDetail(record.key)}
          />
          <Popconfirm
            title="Delete the issue"
            description="Are you sure to delete this issue?"
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return <Table<Issue> columns={columns} dataSource={filteredData} bordered />;
};

export default IssueList;
