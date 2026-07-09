import React, { useEffect, useState } from 'react';
import './register.css';
import 'aos/dist/aos.css';
import AOS from 'aos';
import { Eye, EyeOff } from 'react-feather';

const Register: React.FC = () => {
  const [previewAvatar, setPreviewAvatar] = useState<string>(
    "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/T1_esports_logo.svg/1200px-T1_esports_logo.svg.png"
  );
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>('Đăng ký thành công! Đang chuyển hướng...');

  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: 'ease-out-cubic',
      once: true,
      offset: 0,
    });
    AOS.refresh();
  }, []);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          setPreviewAvatar(ev.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    // ==================== DEBUG FRONTEND ====================
    console.log("=== DEBUG FORM DATA FRONTEND ===");
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`${key}: FILE → ${value.name} (${(value.size / 1024).toFixed(1)} KB)`);
      } else {
        console.log(`${key}: ${value}`);
      }
    }
    // =======================================================

    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirm-password') as string;

    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setError('Mật khẩu phải có ít nhất 8 ký tự');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/user/register', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.status === 'success') {
        setSuccess(true);
        setSuccessMessage(data.message || 'Đăng ký thành công!');

        if (data.require_verification) {
          setTimeout(() => {
            window.location.href = '/verify-pending';
          }, 1500);
        } else {
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
          setTimeout(() => {
            window.location.href = '/';
          }, 2000);
        }
      } else {
        setError(data.message || 'Đăng ký thất bại');
      }
    } catch (err) {
      setError('Lỗi kết nối server. Vui lòng thử lại.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section 
      className="register-container py-16 px-4 sm:px-6 lg:px-8 max-[499px]:px-4 max-[499px]:py-8 max-[374px]:py-6 flex items-center justify-center bg-secondary text-accent"
      data-aos="fade-in"
      data-aos-duration="800"
    >
      <div className="max-w-md w-full">
        <div className="register-card p-8 max-[499px]:p-6 max-[374px]:p-4" data-aos="zoom-in" data-aos-delay="0">
          <div className="text-center mb-8" data-aos="fade-down" data-aos-delay="0">
            <h1 className="text-3xl md:text-4xl max-[767px]:text-2xl max-[499px]:text-xl max-[374px]:text-lg font-bold mb-3 font-orbitron text-accent">
              THAM GIA TCGEAR
            </h1>
            <p className="text-accent/70 text-sm font-open-sans">
              Tạo tài khoản của bạn và tham gia cộng đồng game thủ đỉnh cao
            </p>
          </div>

          {success && (
            <div className="mb-6 p-4 bg-green-600/20 border border-green-600 rounded-md text-green-400 text-center">
              {successMessage}
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-600/20 border border-red-600 rounded-md text-red-400 text-center">
              {error}
            </div>
          )}

          <form id="register-form" className="space-y-6" onSubmit={handleSubmit}>
            <div 
              className="avatar-upload-container text-center"
              data-aos="fade-up"
              data-aos-delay="0"
            >
              <img
                src={previewAvatar}
                id="avatar-preview"
                className="avatar-preview mx-auto rounded-full w-32 h-32 object-cover border-4 border-primary"
                alt="Ảnh đại diện"
              />
              <label htmlFor="avatar" className="block text-sm font-medium mt-4 mb-2 font-open-sans text-accent">
                Ảnh đại diện (tùy chọn)
              </label>
              <input
                type="file"
                id="avatar"
                name="avatar"
                accept="image/jpeg,image/png,image/jpg"
                className="input-field w-full"
                aria-label="Tải lên ảnh đại diện"
                onChange={handleAvatarChange}
              />
            </div>

            <div 
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              <div>
                <label htmlFor="first-name" className="block text-sm font-medium mb-2 font-open-sans text-accent">
                  Tên <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="first-name"
                  name="first-name"
                  className="input-field w-full"
                  placeholder="Nguyễn"
                  required
                />
              </div>
              <div>
                <label htmlFor="last-name" className="block text-sm font-medium mb-2 font-open-sans text-accent">
                  Họ và tên đệm <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="last-name"
                  name="last-name"
                  className="input-field w-full"
                  placeholder="Văn A"
                  required
                />
              </div>
            </div>

            <div data-aos="fade-up" data-aos-delay="200">
              <label htmlFor="email" className="block text-sm font-medium mb-2 font-open-sans text-accent">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="input-field w-full"
                placeholder="your@email.com"
                required
              />
            </div>

            <div data-aos="fade-up" data-aos-delay="300">
              <label htmlFor="phone" className="block text-sm font-medium mb-2 font-open-sans text-accent">
                Số điện thoại <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                className="input-field w-full"
                placeholder="+84 123 456 789"
                required
              />
            </div>

            <div className="flex items-center space-x-2" data-aos="fade-up" data-aos-delay="400">
              <div className="flex-1">
                <label htmlFor="password" className="block text-sm font-medium mb-2 font-open-sans text-accent">
                  Mật khẩu <span className="text-red-500">*</span>
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  className="input-field w-full"
                  placeholder="••••••••"
                  required
                  minLength={8}
                />
              </div>
              <div className="toggle-password-container">
                <div
                  className="toggle-password cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={24} /> : <Eye size={24} />}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2" data-aos="fade-up" data-aos-delay="500">
              <div className="flex-1">
                <label htmlFor="confirm-password" className="block text-sm font-medium mb-2 font-open-sans text-accent">
                  Xác nhận mật khẩu <span className="text-red-500">*</span>
                </label>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirm-password"
                  name="confirm-password"
                  className="input-field w-full"
                  placeholder="••••••••"
                  required
                  minLength={8}
                />
              </div>
              <div className="toggle-password-container">
                <div
                  className="toggle-password cursor-pointer"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={24} /> : <Eye size={24} />}
                </div>
              </div>
            </div>

            <div className="flex items-center" data-aos="fade-up" data-aos-delay="600">
              <input
                type="checkbox"
                id="terms"
                name="terms"
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                required
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-accent/70 font-open-sans">
                Tôi đồng ý với
                <a href="/terms" className="text-primary hover:underline ml-1">Điều khoản Dịch vụ và Chính sách bảo mật</a>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 disabled:opacity-70 text-white py-3 px-4 max-[499px]:py-2 max-[374px]:text-sm rounded-md font-semibold transition flex items-center justify-center font-orbitron"
              data-aos="fade-up"
              data-aos-delay="700"
            >
              {loading ? 'Đang xử lý...' : 'Tạo tài khoản'}
            </button>
          </form>

          <div className="text-center mt-6" data-aos="fade-up" data-aos-delay="800">
            <p className="text-accent/70 text-sm font-open-sans">
              Đã có tài khoản?
              <a href="/login" className="text-primary hover:underline ml-1"> Đăng nhập</a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Register;