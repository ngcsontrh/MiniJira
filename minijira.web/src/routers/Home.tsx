import React from "react";
import Introduction from "../components/Home/Introduction";
import LoginForm from "../components/Home/LoginForm";
import IssueListForHome from "../components/Home/IssueListForHome"; // Import IssueListForHome
import { useAuthStore } from "../stores/authStore"; // Import Zustand store

const Home: React.FC = () => {
  const { isLoggedIn } = useAuthStore(); // Lấy trạng thái và hàm login từ Zustand

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center", // Căn giữa theo chiều ngang
        alignItems: "center", // Căn giữa theo chiều dọc
        background: "#FFFFFF",
      }}
    >
      <Introduction />
      {isLoggedIn ? (
        <div style={{ flex: 1, paddingLeft: 24 }}>
          <IssueListForHome /> {/* Hiển thị danh sách issue nếu đã đăng nhập */}
        </div>
      ) : (
        <LoginForm /> // Hiển thị form đăng nhập nếu chưa đăng nhập
      )}
    </div>
  );
};

export default Home;