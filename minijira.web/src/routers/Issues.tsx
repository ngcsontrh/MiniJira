import React, { useState } from "react";
import { Breadcrumb, Button, Space } from "antd";
import { Link, useParams } from "react-router-dom"; // Import useParams
import IssueList from "../components/Issues/IssueList";
import CreateIssueModal from "../components/Issues/CreateIssueModal";

const Issues: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>(); // Lấy projectId từ URL
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        <Breadcrumb>
          <Breadcrumb.Item>
            <Link to="/">Home</Link>
          </Breadcrumb.Item>
          {projectId && (
            <Breadcrumb.Item>
              <Link to={`/projects/${projectId}`}>Project {projectId}</Link>
            </Breadcrumb.Item>
          )}
          <Breadcrumb.Item>Issues</Breadcrumb.Item>
        </Breadcrumb>
        <Space>
          <Link to="/kanban">
            <Button type="default">Kanban Board</Button>
          </Link>
          <Button type="primary" onClick={showModal}>
            Create
          </Button>
        </Space>
      </div>
      <IssueList projectId={projectId} /> {/* Truyền projectId vào IssueList */}
      <CreateIssueModal visible={isModalVisible} onClose={handleModalClose} />
      {projectId && ( // Hiển thị nút quay lại nếu có projectId
        <div style={{ marginTop: "16px", textAlign: "center" }}>
          <Link to="/projects">
            <Button type="default">Back to Projects</Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Issues;
