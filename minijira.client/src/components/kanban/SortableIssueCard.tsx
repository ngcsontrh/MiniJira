import React from "react";
import { Card, Space, Tag, Avatar, Button } from "antd";
import { UserOutlined, EditOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { Issue } from "../../models/Issue";
import { ISSUE_TYPES, ISSUE_PRIORITIES } from "../../utils/constants";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import useAuth from "../../hooks/useAuth";

interface SortableIssueCardProps {
  issue: Issue;
  index: number;
}

export const SortableIssueCard: React.FC<SortableIssueCardProps> = ({ issue }) => {
  const { user } = useAuth();
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: issue.id || "" });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    marginBottom: "8px",
  };

  // Lấy thông tin loại công việc, màu sắc và biểu tượng
  const getIssueTypeInfo = (type?: string) => {
    const issueType = ISSUE_TYPES.find((t) => t.id === type);
    return {
      label: issueType?.label || "Không xác định",
      icon: issueType?.icon ? issueType.icon() : null,
    };
  };

  // Lấy thông tin mức độ ưu tiên, màu sắc và biểu tượng
  const getIssuePriorityInfo = (priority?: string) => {
    const issuePriority = ISSUE_PRIORITIES.find((p) => p.id === priority);
    return {
      label: issuePriority?.label || "Không xác định",
      icon: issuePriority?.icon ? issuePriority.icon() : null,
    };
  };

  // Tìm thông tin dự án
  const project = { key: issue.key };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card
        size="small"
        title={
          <Link to={`/issues/${issue.id}`}>
            <Space>
              {getIssueTypeInfo(issue.type).icon}
              <span>{issue.title}</span>
            </Space>
          </Link>
        }
        extra={
          <Space>
            <Link to={`/issues/${issue.id}`}>
              <Button type="text" icon={<EditOutlined />} />
            </Link>
          </Space>
        }
      >
        <div style={{ marginBottom: "8px" }}>
          <Tag color="blue">{getIssueTypeInfo(issue.type).label}</Tag>
          <Tag color="orange">
            {getIssuePriorityInfo(issue.priority).label}
          </Tag>
          {project && (
            <Link to={`/projects/${issue.projectId}`}>
              <Tag color="green">{project.key}</Tag>
            </Link>
          )}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>{issue.description?.substring(0, 50)}{issue.description && issue.description.length > 50 ? "..." : ""}</div>
          <Avatar
            icon={<UserOutlined />}
            style={{
              backgroundColor:
                issue.assigneeId === user?.id ? "#fa8c16" : "#1890ff",
            }}
          />
        </div>
      </Card>
    </div>
  );
};