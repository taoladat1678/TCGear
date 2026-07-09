import React from 'react';
import { Link } from 'react-router-dom';
import './verify-email.css';

const VerifyPending: React.FC = () => {
  return (
    <div className="verify-email-container">
      <div className="verify-email-box">
        <h2 className="verify-title">Đăng Ký Thành Công</h2>
        
        <div className="verify-status success">
          <div className="icon">✉️</div>
          <p>Email xác thực đã được gửi, vui lòng kiểm tra hộp thư của bạn (cả mục Spam) và nhấn vào liên kết xác thực để hoàn tất quá trình đăng ký.</p>
          <Link to="/" className="btn-login-redirect mt-4">Về Trang Chủ</Link>
        </div>
      </div>
    </div>
  );
};

export default VerifyPending;
