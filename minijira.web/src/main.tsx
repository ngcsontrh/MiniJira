import React from "react";
import ReactDOM from "react-dom/client";
import "antd/dist/reset.css"; // Reset Ant Design styles
import AppRouter from "./routers/AppRouter";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <React.StrictMode>
    <AppRouter />
  </React.StrictMode>
);
