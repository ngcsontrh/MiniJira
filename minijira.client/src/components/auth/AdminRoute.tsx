import { Outlet } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { Result, Button } from 'antd';

const AdminRoute = () => {
  const { user } = useAuth();

  // Kiểm tra xem người dùng có phải là admin không
  if (user?.role !== 'Admin') {
    // Hiển thị trang từ chối truy cập
    return (
      <Result
        status="403"
        title="403"
        subTitle="Xin lỗi, bạn không có quyền truy cập trang này."
        extra={
          <Button type="primary" onClick={() => window.history.back()}>
            Quay lại
          </Button>
        }
      />
    );
  }

  return <Outlet />;
};

export default AdminRoute;