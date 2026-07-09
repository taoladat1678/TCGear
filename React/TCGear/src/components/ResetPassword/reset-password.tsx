import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import './reset-password.css';
import feather from 'feather-icons';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Eye, EyeOff } from 'react-feather';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: true,
    });
    feather.replace();
    
    if (!token) {
      setError('Không tìm thấy token hợp lệ.');
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp.');
      setIsLoading(false);
      return;
    }
    
    if (password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự.');
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch('http://localhost:3000/api/user/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password })
      });
      const data = await res.json();
      
      if (data.status === 'success') {
        setSuccess(true);
      } else {
        setError(data.message || 'Có lỗi xảy ra khi đặt lại mật khẩu.');
      }
    } catch (err) {
      setError('Lỗi kết nối tới server.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-64px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 max-[499px]:px-4 max-[499px]:py-8 max-[374px]:py-6 bg-[url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80')] bg-cover bg-center relative" data-aos="fade-in">
      <div className="absolute inset-0 hero-gradient"></div>
      <div className="w-full max-w-md space-y-8 z-10 relative reset-card p-8" data-aos="fade-up" data-aos-delay="200">
        <div className="text-center" data-aos="fade-down" data-aos-delay="100">
          <h2 className="text-3xl max-[767px]:text-2xl max-[499px]:text-xl max-[374px]:text-lg font-bold font-orbitron text-white">Đặt Mật Khẩu Mới</h2>
          <p className="mt-2 text-accent/70 font-open-sans">
            Vui lòng nhập mật khẩu mới cho tài khoản của bạn
          </p>
        </div>

        {error && (
          <div className="p-4 bg-red-600/20 border border-red-600 rounded-md text-red-400 text-center font-open-sans text-sm">
            {error}
          </div>
        )}

        {success ? (
          <div className="text-center p-4 bg-green-500/10 border border-green-500/30 rounded-md" data-aos="zoom-in">
            <div className="flex justify-center mb-2">
              <i data-feather="check-circle" className="h-10 w-10 text-green-500"></i>
            </div>
            <h3 className="text-lg font-medium text-green-500 font-orbitron">Đặt Lại Thành Công!</h3>
            <p className="mt-2 text-sm text-accent/80 font-open-sans">
              Mật khẩu của bạn đã được thay đổi thành công.
            </p>
            <div className="mt-6">
              <Link to="/login" className="inline-block bg-primary hover:bg-primary/90 text-white font-orbitron py-2 px-6 rounded-md transition">
                Đăng nhập ngay
              </Link>
            </div>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit} data-aos="fade-up" data-aos-delay="300">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium font-open-sans text-white mb-2">
                  Mật Khẩu Mới
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="block w-full px-4 py-3 bg-[#2a2a2a] border border-primary/20 rounded-md focus:ring-primary focus:border-primary text-white placeholder-gray-500 font-open-sans"
                    placeholder="••••••••"
                  />
                  <div 
                    className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-gray-400 hover:text-white" 
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium font-open-sans text-white mb-2">
                  Xác Nhận Mật Khẩu
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="block w-full px-4 py-3 bg-[#2a2a2a] border border-primary/20 rounded-md focus:ring-primary focus:border-primary text-white placeholder-gray-500 font-open-sans"
                    placeholder="••••••••"
                  />
                  <div 
                    className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-gray-400 hover:text-white" 
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !token}
              className="w-full flex justify-center py-3 px-4 border border-transparent font-medium rounded-md text-white bg-primary hover:bg-primary/90 transition font-orbitron disabled:opacity-50"
            >
              {isLoading ? 'Đang xử lý...' : 'Cập Nhật Mật Khẩu'}
            </button>
          </form>
        )}
      </div>
    </main>
  );
};

export default ResetPassword;
