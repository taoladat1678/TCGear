import React, { useEffect, useState } from 'react';
import './login.css';
import 'aos/dist/aos.css';
import AOS from 'aos';
import { Eye, EyeOff, Facebook } from 'react-feather';
import { useGoogleLogin } from '@react-oauth/google';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [requireVerification, setRequireVerification] = useState(false);
  const [identifierEmail, setIdentifierEmail] = useState('');

  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: 'ease-out-cubic',
      once: true,
      offset: 0,
    });
    AOS.refresh();

    // Xử lý callback từ Facebook hoặc Google (nếu redirect về với query params)
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const userStr = urlParams.get('user');
    const fbError = urlParams.get('error');

    if (fbError) {
      setError('Đăng nhập Facebook thất bại. Vui lòng thử lại.');
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (token && userStr) {
      try {
        const user = JSON.parse(decodeURIComponent(userStr));
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        setSuccess(true);
        setTimeout(() => {
          window.location.href = '/';
        }, 1500);
      } catch (err) {
        setError('Lỗi xử lý dữ liệu đăng nhập từ bên thứ ba');
        console.error('Parse user error:', err);
      }
      // Xóa query params để URL sạch sẽ
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const identifier = formData.get('identifier')?.toString().trim();
    const password = formData.get('password')?.toString();

    if (!identifier || !password) {
      setError('Vui lòng cung cấp username/email và mật khẩu');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
      });
      const data = await response.json();

      if (data.status === 'success') {
        setSuccess(true);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setTimeout(() => (window.location.href = '/'), 1500);
      } else {
        setError(data.message || 'Đăng nhập thất bại');
        if (data.require_verification) {
          setRequireVerification(true);
          setIdentifierEmail(data.email || identifier);
        } else {
          setRequireVerification(false);
        }
      }
    } catch (err) {
      setError('Lỗi kết nối server. Vui lòng thử lại.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:3000/api/user/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: identifierEmail })
      });
      const data = await res.json();
      if (data.status === 'success') {
        alert('Đã gửi lại email xác nhận. Vui lòng kiểm tra hộp thư của bạn.');
      } else {
        alert(data.message || 'Có lỗi xảy ra khi gửi lại email.');
      }
    } catch (err) {
      alert('Lỗi kết nối.');
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      console.log('Google Auth Code nhận được:', codeResponse.code);
      await handleGoogleCode(codeResponse.code);
    },
    onError: (errorResponse) => {
      console.log('Google login error:', errorResponse);
      setError('Đăng nhập Google thất bại');
      setGoogleLoading(false);
    },
    flow: 'auth-code',
    ux_mode: 'popup',
  });

  const handleGoogleCode = async (code: string) => {
    setGoogleLoading(true);
    setError('');
    setSuccess(false);
    try {
      const res = await fetch('http://localhost:3000/api/user/google-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();

      if (res.ok && data.status === 'success') {
        setSuccess(true);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setTimeout(() => (window.location.href = '/'), 1500);
      } else {
        setError(data.message || 'Đăng nhập Google thất bại từ server');
      }
    } catch (err) {
      console.error('Google code fetch error:', err);
      setError('Lỗi kết nối server khi gửi code Google');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleFacebookLogin = () => {
    window.location.href = 'http://localhost:3000/api/user/facebook-login';
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
              ĐĂNG NHẬP TCGEAR
            </h1>
            <p className="text-accent/70 text-sm font-open-sans">
              Chào mừng trở lại! Đăng nhập để tiếp tục hành trình game thủ
            </p>
          </div>

          {success && (
            <div className="mb-6 p-4 bg-green-600/20 border border-green-600 rounded-md text-green-400 text-center">
              Đăng nhập thành công! Đang chuyển hướng...
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-600/20 border border-red-600 rounded-md text-red-400 text-center flex flex-col items-center gap-3">
              <span>{error}</span>
              {requireVerification && (
                <button
                  type="button"
                  onClick={handleResendVerification}
                  disabled={loading}
                  className="px-4 py-2 border border-red-500 rounded text-red-400 hover:bg-red-500 hover:text-white transition disabled:opacity-50"
                >
                  Gửi lại email xác nhận
                </button>
              )}
            </div>
          )}

          <form id="login-form" className="space-y-6" onSubmit={handleSubmit}>
            <div data-aos="fade-up" data-aos-delay="100">
              <label htmlFor="identifier" className="block text-sm font-medium mb-2 font-open-sans text-accent">
                Username hoặc Email <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="identifier"
                name="identifier"
                className="input-field w-full"
                placeholder="username hoặc your@email.com"
                required
                autoComplete="username email"
              />
            </div>

            <div className="flex items-center space-x-2" data-aos="fade-up" data-aos-delay="200">
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
                  autoComplete="current-password"
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

            <div className="flex justify-end mb-4" data-aos="fade-up" data-aos-delay="250">
              <a href="/forgot-password" className="text-sm text-primary hover:underline font-open-sans">
                Quên mật khẩu?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading || googleLoading}
              className="w-full bg-primary hover:bg-primary/90 disabled:opacity-70 text-white py-3 px-4 max-[499px]:py-2 max-[374px]:text-sm rounded-md font-semibold transition flex items-center justify-center font-orbitron text-base"
              data-aos="fade-up"
              data-aos-delay="300"
            >
              {loading ? 'Đang xử lý...' : 'Đăng nhập'}
            </button>

            <div className="mt-6 space-y-4" data-aos="fade-up" data-aos-delay="350">
              <p className="text-center text-accent/70 text-sm font-open-sans">
                Hoặc đăng nhập bằng
              </p>

              <button
                type="button"
                onClick={() => {
                  setGoogleLoading(true);
                  googleLogin();
                }}
                disabled={loading || googleLoading}
                className="w-full bg-[#4285F4] hover:bg-[#357ae8] text-white py-3 px-4 max-[499px]:py-2 max-[374px]:text-sm rounded-md font-semibold transition flex items-center justify-center gap-3 disabled:opacity-60 font-orbitron text-base"
              >
                {googleLoading ? (
                  'Đang xử lý...'
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48">
                      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59L2.56 13.22C1.85 15.15 1.5 17.3 1.5 19.5c0 2.2.35 4.35 1.06 6.28l7.97-6.19z" />
                      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                    </svg>
                    Đăng nhập bằng Google
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleFacebookLogin}
                disabled={loading || googleLoading}
                className="w-full bg-[#1877F2] hover:bg-[#166FE5] text-white py-3 px-4 max-[499px]:py-2 max-[374px]:text-sm rounded-md font-semibold transition flex items-center justify-center gap-3 font-orbitron text-base"
                data-aos="fade-up"
                data-aos-delay="400"
              >
                <Facebook size={20} />
                Đăng nhập bằng Facebook
              </button>
            </div>
          </form>

          <div className="text-center mt-6 space-y-3" data-aos="fade-up" data-aos-delay="450">
            <p className="text-accent/70 text-sm font-open-sans">
              Chưa có tài khoản?
              <a href="/register" className="text-primary hover:underline ml-1">
                Đăng ký ngay
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;