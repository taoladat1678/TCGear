import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import './verify-email.css';

const VerifyEmail: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Đang xác thực...');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Không tìm thấy mã xác nhận.');
      return;
    }

    const verifyToken = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/user/verify-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token })
        });
        const data = await response.json();
        
        if (data.status === 'success') {
          setStatus('success');
          setMessage(data.message || 'Xác nhận email thành công. Bạn đã có thể đăng nhập.');
        } else {
          setStatus('error');
          setMessage(data.message || 'Liên kết xác nhận không hợp lệ hoặc đã hết hạn.');
        }
      } catch (err) {
        setStatus('error');
        setMessage('Lỗi kết nối đến máy chủ.');
      }
    };

    verifyToken();
  }, [token]);

  return (
    <div className="verify-email-container">
      <div className="verify-email-box">
        <h2 className="verify-title">Xác Nhận Email</h2>
        
        {status === 'loading' && (
          <div className="verify-status loading">
            <div className="spinner"></div>
            <p>{message}</p>
          </div>
        )}

        {status === 'success' && (
          <div className="verify-status success">
            <div className="icon">✓</div>
            <p>{message}</p>
            <Link to="/login" className="btn-login-redirect">Đăng Nhập Ngay</Link>
          </div>
        )}

        {status === 'error' && (
          <div className="verify-status error">
            <div className="icon">✕</div>
            <p>{message}</p>
            <Link to="/login" className="btn-login-redirect">Quay về Đăng nhập</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
