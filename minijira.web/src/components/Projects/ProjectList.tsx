import React from "react";
import { Table, Button, Space } from "antd";
import { Link } from "react-router-dom";

const ProjectList: React.FC = () => {
  const dataSource = [
    {
      key: "1",
      name: "Project Alpha",
      description: "This is the first project.",
    },
    {
      key: "2",
      name: "Project Beta",
      description: "This is the second project.",
    },
  ];

  const columns = [
    {
      title: "STT",
      key: "index",
      render: (_: any, __: any, index: number) => <span>{index + 1}</span>,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: any) => (
        <Link to={`/projects/${record.key}`}>{text}</Link>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record: any) => (
        <Space>
          <Button type="primary">
            <Link to={`/projects/${record.key}/issues`} style={{ color: "#fff" }}>
              View Issues
            </Link>
          </Button>
          <Button type="primary" danger>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return <Table dataSource={dataSource} columns={columns} />;
};

export default ProjectList;