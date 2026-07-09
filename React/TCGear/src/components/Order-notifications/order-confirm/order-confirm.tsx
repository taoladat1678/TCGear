// order-confirm.tsx
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

const OrderConfirm: React.FC = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,
    });
    if (typeof window !== 'undefined') {
      import('feather-icons').then((feather) => {
        feather.replace();
      });
    }

    const confirmOrder = async () => {
      if (!orderId) {
        setStatus('error');
        setMessage('Không tìm thấy mã đơn hàng.');
        return;
      }
      try {
        const res = await fetch(`http://localhost:3000/api/orders/${orderId}/confirm-email`, {
          method: 'PUT'
        });
        const data = await res.json();
        if (data.status === 'success') {
          setStatus('success');
        } else {
          setStatus('error');
          setMessage(data.message || 'Xác nhận thất bại');
        }
      } catch (err) {
        console.error(err);
        setStatus('error');
        setMessage('Lỗi kết nối máy chủ');
      }
    };

    confirmOrder();
  }, [orderId]);

  return (
    <>
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
          {status === 'loading' && (
            <h1 className="text-3xl md:text-5xl font-bold mb-4 font-orbitron">
              Đang xác nhận đơn hàng...
            </h1>
          )}

          {status === 'success' && (
            <>
              <div className="success-icon mb-6">
                <i data-feather="check" className="h-12 w-12 text-accent"></i>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4 font-orbitron uppercase">
                Xác nhận đơn hàng {orderId} thành công
              </h1>
              <p className="text-lg md:text-xl text-accent/80 mb-8 font-open-sans">
                Đơn hàng sẽ được giao đến bạn trong thời gian sớm nhất
              </p>
              <div className="flex justify-center">
                <button
                  onClick={() => navigate('/orders')}
                  className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-md font-semibold transition font-orbitron"
                >
                  Kiểm Tra Đơn Hàng
                </button>
              </div>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="mb-6">
                <i data-feather="x-circle" className="h-12 w-12 text-red-500 mx-auto"></i>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold mb-4 font-orbitron text-red-500">
                Xác nhận thất bại
              </h1>
              <p className="text-lg md:text-xl text-white mb-8 font-open-sans">
                {message}
              </p>
              <div className="flex justify-center">
                <button
                  onClick={() => navigate('/orders')}
                  className="bg-transparent border-2 border-accent hover:bg-accent hover:text-secondary text-accent px-8 py-3 rounded-md font-semibold transition font-orbitron"
                >
                  Xem Đơn Hàng Của Bạn
                </button>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
};

export default OrderConfirm;
