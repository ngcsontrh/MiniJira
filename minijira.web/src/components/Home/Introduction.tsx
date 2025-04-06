import React from "react";
import { Typography } from "antd";

const { Title, Paragraph } = Typography;

const Introduction: React.FC = () => (
  <div style={{ flex: 1, paddingRight: 24 }}>
    <Title level={2} style={{ color: "#4A4A4A" }}>
      Welcome to MiniJira
    </Title>
    <Paragraph style={{ fontSize: 16, color: "#4A4A4A" }}>
      MiniJira is a lightweight project management tool inspired by Jira. Manage your projects, track issues,
      and collaborate with your team efficiently.
    </Paragraph>
  </div>
);

export default Introduction;