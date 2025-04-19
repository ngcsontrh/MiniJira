import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const RequireAuth = () => {
  const { isAuth } = useAuth();
  const location = useLocation();

  if (!isAuth) {
    // Chuyển hướng đến trang đăng nhập nhưng lưu lại vị trí đã cố truy cập
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default RequireAuth;