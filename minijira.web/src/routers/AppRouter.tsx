import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "../App";
import Home from "./Home";
import Issues from "./Issues";
import IssueDetail from "./IssueDetail";
import KanbanBoard from "./KanbanBoard";
import Projects from "./Projects";

const AppRouter: React.FC = () => (
  <Router>
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<Home />} />
        <Route path="issues" element={<Issues />} />
        <Route path="issues/:id" element={<IssueDetail />} />
        <Route path="/kanban" element={<KanbanBoard />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:projectId/issues" element={<Issues />} />
      </Route>
    </Routes>
  </Router>
);

export default AppRouter;
