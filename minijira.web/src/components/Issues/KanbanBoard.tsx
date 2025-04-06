import React, { useState } from "react";
import { Typography, Card, Col, Row, Button, Popover, Select } from "antd";

const { Title } = Typography;
const { Option } = Select;

interface Issue {
  id: string;
  code: string;
  summary: string;
  status: string;
}

const initialIssues: Issue[] = [
  { id: "1", code: "ISSUE-001", summary: "Fix login bug", status: "To Do" },
  { id: "2", code: "ISSUE-002", summary: "Add dark mode", status: "In Progress" },
  { id: "3", code: "ISSUE-003", summary: "Update documentation", status: "Done" },
  { id: "4", code: "ISSUE-004", summary: "Improve performance", status: "To Do" },
];

const columns = ["To Do", "In Progress", "Done"];

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
    <Row gutter={16} style={{ padding: 16 }}>
      {columns.map((column) => (
        <Col key={column} span={8}>
          <Title level={4} style={{ textAlign: "center" }}>
            {column}
          </Title>
          <div
            style={{
              background: "#f5f5f5",
              padding: 16,
              borderRadius: 8,
              minHeight: 400,
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
                  }}
                >
                  <Typography.Text strong>{issue.code}</Typography.Text>
                  <div>{issue.summary}</div>
                  <Popover
                    content={renderPopoverContent(issue)}
                    title="Change Status"
                    trigger="click"
                  >
                    <Button type="link" style={{ padding: 0, marginTop: 8 }}>
                      Change Status
                    </Button>
                  </Popover>
                </Card>
              ))}
          </div>
        </Col>
      ))}
    </Row>
  );
};

export default KanbanBoard;