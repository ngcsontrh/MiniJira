import React, { useState } from "react";
import { Breadcrumb, Button, Space } from "antd";
import ProjectList from "../components/Projects/ProjectList";
import CreateProjectModal from "../components/Projects/CreateProjectModal";

const Projects: React.FC = () => {
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
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item>Projects</Breadcrumb.Item>
        </Breadcrumb>
        <Space>
          <Button type="primary" onClick={showModal}>
            Create Project
          </Button>
        </Space>
      </div>
      <ProjectList />
      <CreateProjectModal visible={isModalVisible} onClose={handleModalClose} />
    </div>
  );
};

export default Projects;