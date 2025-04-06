import React, { useState } from "react";
import { Typography, Card, Col, Row, Button, Popover, Select, Breadcrumb } from "antd";
import { Link } from "react-router-dom";

const { Title } = Typography;
const { Option } = Select;

interface Issue {
  id: string;
  code: string;
  summary: string;
  status: string;
}

const initialIssues: Issue[] = [
  { id: "1", code: "ISSUE-001", summary: "Fix login bug", status: "Backlog" },
  { id: "2", code: "ISSUE-002", summary: "Add dark mode", status: "In Progress" },
  { id: "3", code: "ISSUE-003", summary: "Update documentation", status: "Done" },
  { id: "4", code: "ISSUE-004", summary: "Improve performance", status: "To Do" },
];

const columns = ["Backlog", "To Do", "In Progress", "Done"];

const KanbanBoard: React.FC = () => {
  const [issues, setIssues] = useState<Issue[]>(initialIssues);

  const handleStatusChange = (id: string, newStatus: string) => {
    const updatedIssues = issues.map((issue) =>
      issue.id === id ? { ...issue, status: newStatus } : issue
    );
    setIssues(updatedIssues);
  };

  const renderPopoverContent = (issue: Issue) => (
    <Select
      defaultValue={issue.status}
      style={{ width: 120 }}
      onChange={(value) => handleStatusChange(issue.id, value)}
    >
      {columns.map((status) => (
        <Option key={status} value={status}>
          {status}
        </Option>
      ))}
    </Select>
  );

  return (
    <div style={{ padding: 16 }}>
      {/* Breadcrumb */}
      <Breadcrumb style={{ marginBottom: 16 }}>
        <Breadcrumb.Item>
          <Link to="/">Home</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Kanban Board</Breadcrumb.Item>
      </Breadcrumb>

      {/* Kanban Board */}
      <Row gutter={16} style={{ display: "flex", alignItems: "stretch" }}>
        {columns.map((column) => (
          <Col key={column} span={6} style={{ display: "flex", flexDirection: "column" }}>
            <Title level={4} style={{ textAlign: "center" }}>
              {column}
            </Title>
            <div
              style={{
                background: "#f5f5f5",
                padding: 16,
                borderRadius: 8,
                flex: 1, // Đảm bảo các cột có chiều cao bằng nhau
                display: "flex",
                flexDirection: "column",
              }}
            >
              {issues
                .filter((issue) => issue.status === column)
                .map((issue) => (
                  <Card
                    key={issue.id}
                    style={{
                      marginBottom: 16,
                      border: "1px solid #d9d9d9",
                      borderRadius: 8,
                      background: "#fff",
                    }}
                  >
                    <Typography.Text strong style={{ fontSize: 16 }}>
                      {issue.code}
                    </Typography.Text>
                    <div style={{ fontSize: 14, marginTop: 8 }}>{issue.summary}</div>
                    <Popover
                      content={renderPopoverContent(issue)}
                      title="Change Status"
                      trigger="click"
                    >
                      <Button
                        type="primary"
                        style={{
                          backgroundColor: "#FF8C00", // Màu cam
                          borderColor: "#FF8C00",
                          color: "#fff",
                          marginTop: 8,
                        }}
                      >
                        Change Status
                      </Button>
                    </Popover>
                    <div style={{ marginTop: 8 }}>
                      <Link to={`/issues/${issue.id}`}>
                        <Button type="dashed">View Details</Button>
                      </Link>
                    </div>
                  </Card>
                ))}
            </div>
          </Col>
        ))}
      </Row>

      {/* Back Button */}
      <div style={{ marginTop: 24, textAlign: "center" }}>
        <Link to="/issues">
          <Button type="default">Back to Issues</Button>
        </Link>
      </div>
    </div>
  );
};

export default KanbanBoard;