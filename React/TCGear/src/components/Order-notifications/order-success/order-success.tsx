// order-success.tsx
import React from 'react';
import './order-success.css';
import AOS from 'aos';
import 'aos/dist/aos.css';

const OrderSuccess: React.FC = () => {
  React.useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,
    });
    // Initialize Feather Icons
    if (typeof window !== 'undefined') {
      import('feather-icons').then((feather) => {
        feather.replace();
      });
    }
  }, []);

  return (
    <>
      {/* Order Success Notification Section */}
      <section className="relative h-[80vh] flex items-center justify-center">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80"
            srcSet="
              https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80 800w,
              https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80 1770w
            "
            sizes="(max-width: 800px) 800px, 1770px"
            alt="Nền thiết lập chơi game"
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
        <div className="absolute inset-0 hero-gradient"></div>

        <div
          className="relative z-10 text-center px-4 max-w-3xl mx-auto"
          data-aos="fade-up"
        >
          <div className="success-icon mb-6">
            <i data-feather="check" className="h-12 w-12 text-accent"></i>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4 font-orbitron uppercase">
            Đặt hàng thành công
          </h1>
          <p className="text-lg md:text-xl text-accent/80 mb-8 font-open-sans">
            ĐẶT HÀNG THÀNH CÔNG, HÃY KIỂM TRA EMAIL ĐỂ XÁC NHẬN ĐƠN HÀNG
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="shop"
              className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-md font-semibold transition font-orbitron"
            >
              Tiếp Tục Mua Sắm
            </a>
            <a
              href="orders"
              className="bg-transparent border-2 border-accent hover:bg-accent hover:text-secondary text-accent px-8 py-3 rounded-md font-semibold transition font-orbitron"
            >
              Xem Đơn Hàng
            </a>
          </div>
        </div>
      </section>
    </>
  );
};

export default OrderSuccess;