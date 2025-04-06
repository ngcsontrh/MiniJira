import React from "react";
import { List } from "antd";
import { useNavigate } from "react-router-dom";

interface Issue {
  key: string;
  code: string;
  summary: string;
}

const IssueListForHome: React.FC = () => {
  const navigate = useNavigate();

  const data: Issue[] = [
    { key: "1", code: "ISSUE-001", summary: "Fix login bug" },
    { key: "2", code: "ISSUE-002", summary: "Add dark mode" },
    { key: "3", code: "ISSUE-003", summary: "Update documentation" },
  ];

  const redirectToDetail = (key: string) => {
    navigate(`/issues/${key}`); // Điều hướng đến trang chi tiết issue
  };

  return (
    <div style={{ backgroundColor: "#f5f5f5", borderRadius: 8 }}>
      <List
        bordered
        dataSource={data}
        renderItem={(item) => (
          <List.Item
            style={{ cursor: "pointer" }}
            onClick={() => redirectToDetail(item.key)}
          >
            <a style={{ color: "#1890ff" }}>
                {item.code} - {item.summary}
            </a>
          </List.Item>
        )}
      />
    </div>
  );
};

export default IssueListForHome;