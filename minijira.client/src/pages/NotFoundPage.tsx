import React from 'react';
import { Result, Button } from 'antd';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  return (
    <Result
      status="404"
      title="404"
      subTitle="Xin lỗi, trang bạn truy cập không tồn tại."
      extra={
        <Link to="/">
          <Button type="primary">Quay lại trang chủ</Button>
        </Link>
      }
    />
  );
};

export default NotFoundPage;