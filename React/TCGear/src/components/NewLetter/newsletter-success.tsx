import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

const NewsletterSuccess: React.FC = () => {
  useEffect(() => {
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
      <section className="relative h-[80vh] flex items-center justify-center bg-black">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80"
            srcSet="
              https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80 800w,
              https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80 1770w
            "
            sizes="(max-width: 800px) 800px, 1770px"
            alt="Nền thiết lập chơi game"
            className="w-full h-full object-cover opacity-40"
            loading="lazy"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>

        <div
          className="relative z-10 text-center px-4 max-w-3xl mx-auto"
          data-aos="fade-up"
        >
          <div className="mb-6 inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/20 border-2 border-primary">
            <i data-feather="mail" className="h-10 w-10 text-primary"></i>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4 font-orbitron text-white uppercase">
            Gia nhập thành công
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-8 font-open-sans">
            Hãy kiểm tra email thường xuyên để nhận các ưu đãi hấp dẫn từ TCGear.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-md font-semibold transition font-orbitron shadow-lg hover:shadow-primary/50"
            >
              Về Trang Chủ
            </Link>
            <Link
              to="/shop"
              className="bg-transparent border-2 border-primary hover:bg-primary hover:text-white text-primary px-8 py-3 rounded-md font-semibold transition font-orbitron"
            >
              Tiếp Tục Mua Sắm
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default NewsletterSuccess;
