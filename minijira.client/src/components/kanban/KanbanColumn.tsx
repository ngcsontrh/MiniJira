import React from "react";
import { Card, Col } from "antd";
import { Issue, IssueStatus } from "../../models/Issue";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { SortableIssueCard } from "./SortableIssueCard";

interface KanbanColumnProps {
  title: string;
  status: IssueStatus;
  issues: Issue[];
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({ title, status, issues }) => {
  // Sử dụng hook useDroppable để biến div thành một vùng có thể thả
  const { setNodeRef } = useDroppable({
    id: status,
    data: {
      status: status,
      accepts: ['issue']
    }
  });

  return (
    <Col span={6}>
      <Card
        title={<div style={{ textAlign: "center" }}>{title}</div>}
        style={{ height: "100%" }}
        bodyStyle={{ 
          height: "calc(100% - 45px)", 
          padding: "8px", 
          overflow: "auto",
          maxHeight: "calc(100vh - 275px)", // Giới hạn chiều cao tối đa
          overflowY: "auto", // Cho phép cuộn dọc
          overflowX: "hidden" // Ẩn cuộn ngang
        }}
      >
        <div ref={setNodeRef} style={{ minHeight: "100%" }}>
          <SortableContext items={issues.map((issue) => issue.id || "")} strategy={verticalListSortingStrategy}>
            {issues.map((issue, index) => (
              <SortableIssueCard key={issue.id} issue={issue} index={index} />
            ))}
          </SortableContext>
        </div>
      </Card>
    </Col>
  );
};