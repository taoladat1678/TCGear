// forgot-password.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './forgot-password.css'; // Import the custom CSS
import feather from 'feather-icons';
import AOS from 'aos';
import 'aos/dist/aos.css';

// Note: For production, replace feather icons with a React icon library like react-feather.
// Here, we're keeping the original data-feather attributes for simplicity.

const ForgotPassword: React.FC = () => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Initialize AOS
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: true,
      offset: 50,
    });

    // Initialize Feather Icons
    feather.replace();

    // Refresh AOS after a short delay to ensure elements are rendered
    const timer = setTimeout(() => {
      AOS.refresh();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Refresh AOS when showSuccess changes to animate the success message
    if (showSuccess) {
      AOS.refresh();
    }
  }, [showSuccess]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate form submission delay
    setTimeout(() => {
      setIsLoading(false);
      setShowSuccess(true);
    }, 1000);
  };

  const handleResend = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const link = e.currentTarget;
    const originalText = link.innerHTML;

    // Show loading state
    link.innerHTML = '<i data-feather="loader" class="h-4 w-4 animate-spin"></i> Đang gửi...';
    feather.replace();

    // Simulate resend delay
    setTimeout(() => {
      link.innerHTML = originalText;
      feather.replace();

      // Show success alert
      const successAlert = document.createElement('div');
      successAlert.className = 'mt-4 text-sm text-green-500 font-open-sans';
      successAlert.textContent = 'Liên kết đặt lại đã được gửi lại thành công!';
      const successMessage = document.getElementById('success-message');
      if (successMessage) {
        successMessage.appendChild(successAlert);
      }

      setTimeout(() => {
        if (successAlert.parentNode) {
          successAlert.remove();
        }
      }, 3000);
    }, 1500);
  };

  return (
    <main className="min-h-[calc(100vh-64px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80')] bg-cover bg-center relative" data-aos="fade-in">
      <div className="absolute inset-0 auth-gradient"></div>
      <div className="w-full max-w-md space-y-8 z-10 relative" data-aos="fade-up" data-aos-delay="200">
        <div className="text-center" data-aos="fade-down" data-aos-delay="100">
          <h2 className="text-3xl font-bold font-orbitron">Đặt Lại Mật Khẩu</h2>
          <p className="mt-2 text-accent/70 font-open-sans">
            Nhập email của bạn để nhận liên kết đặt lại mật khẩu
          </p>
        </div>

        {!showSuccess ? (
          <form id="reset-form" className="mt-8 space-y-6" onSubmit={handleSubmit} data-aos="fade-up" data-aos-delay="300">
            <div className="space-y-4">
              <div data-aos="fade-right" data-aos-delay="400">
                <label htmlFor="email" className="block text-sm font-medium font-open-sans">
                  Địa Chỉ Email
                </label>
                <div className="mt-1 relative">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="block w-full px-4 py-3 bg-secondary border border-primary/20 rounded-md focus:ring-primary focus:border-primary placeholder-accent/50 font-open-sans"
                    placeholder="your@email.com"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <i data-feather="mail" className="h-5 w-5 text-primary"></i>
                  </div>
                </div>
              </div>
            </div>

            <div data-aos="fade-left" data-aos-delay="500">
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition font-orbitron disabled:opacity-50"
              >
                Gửi Liên Kết Đặt Lại
              </button>
            </div>
          </form>
        ) : (
          <div
            id="success-message"
            className="text-center p-4 bg-green-500/10 border border-green-500/30 rounded-md"
            data-aos="zoom-in"
            data-aos-delay="200"
          >
            <div className="flex justify-center mb-2" data-aos="fade-up" data-aos-delay="100">
              <i data-feather="check-circle" className="h-10 w-10 text-green-500"></i>
            </div>
            <h3 className="text-lg font-medium text-green-500 font-orbitron" data-aos="fade-up" data-aos-delay="200">Đã Gửi Liên Kết Đặt Lại!</h3>
            <p className="mt-1 text-sm text-accent/80 font-open-sans" data-aos="fade-up" data-aos-delay="300">
              Chúng tôi đã gửi liên kết đặt lại mật khẩu đến địa chỉ email của bạn. Vui lòng kiểm tra hộp thư đến.
            </p>
            <p className="mt-4 text-sm text-accent/70 font-open-sans" data-aos="fade-up" data-aos-delay="400">
              Không nhận được email?
              <a
                href="#"
                id="resend-link"
                className="font-medium text-primary hover:text-primary/80 font-open-sans ml-1"
                onClick={handleResend}
              >
                Gửi lại
              </a>
            </p>
          </div>
        )}

        <div className="text-center text-sm" data-aos="fade-up" data-aos-delay="600">
          <p className="text-accent/70 font-open-sans">
            Nhớ mật khẩu của bạn?
            <Link
              to="/login"
              className="font-medium text-primary hover:text-primary/80 font-open-sans ml-1"
            >
              Đăng nhập
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
};

export default ForgotPassword;