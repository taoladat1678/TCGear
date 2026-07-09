import React, { useEffect, useState } from 'react';
import './vouchers.css';
import AOS from 'aos';
import 'aos/dist/aos.css';

AOS.init({
  duration: 800,
  easing: 'ease-in-out',
  once: true,
});

interface Voucher {
  voucher_id: string;
  voucher_code: string;
  voucher_type: string;
  voucher_value: number;
  min_order_value: number;
  max_discount: number | null;
  voucher_usage_time: number;
  start_date: string;
  end_date: string;
  create_at: string;
  update_at: string;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

const Vouchers: React.FC = () => {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [subtotal, setSubtotal] = useState<number>(0);
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/user/vouchers');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        
        if (result.status === 'success' && Array.isArray(result.data)) {
          setVouchers(result.data);
        } else {
          setVouchers([]);
        }
      } catch (err: any) {
        setError(err.message || 'Có lỗi xảy ra khi tải danh sách voucher.');
      } finally {
        setLoading(false);
      }
    };

    fetchVouchers();
  }, []);

  useEffect(() => {
    const calculateSubtotal = () => {
      try {
        let itemsToProcess: any[] = [];
        const storedCart = localStorage.getItem('cartItems');
        if (storedCart) {
          const parsedCart = JSON.parse(storedCart);
          if (Array.isArray(parsedCart) && parsedCart.length > 0) {
            itemsToProcess = parsedCart;
          }
        }
        
        if (itemsToProcess.length === 0) {
          itemsToProcess = [
            { price: 129.99, quantity: 1 },
            { price: 64.99, quantity: 2 }
          ];
        }

        const currentSubtotal = itemsToProcess.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        setSubtotal(currentSubtotal);
      } catch (e) {
        console.error("Lỗi khi đọc cartItems từ localStorage:", e);
      }
    };

    calculateSubtotal();
    window.addEventListener('storage', calculateSubtotal);
    const interval = setInterval(calculateSubtotal, 1000);
    
    return () => {
      window.removeEventListener('storage', calculateSubtotal);
      clearInterval(interval);
    };
  }, []);

  const handleCopy = (code: string, button: HTMLButtonElement) => {
    navigator.clipboard.writeText(code).then(() => {
      const originalText = button.textContent;
      button.textContent = 'Đã sao chép!';
      button.style.background = '#e11d48';
      button.style.color = 'white';

      setTimeout(() => {
        button.textContent = originalText;
        button.style.background = 'transparent';
        button.style.color = '#e11d48';
      }, 2000);
    });
  };

  return (
    <div className="bg-secondary text-accent min-h-screen">
      {/* Vouchers Hero */}
      <section className="relative h-[60vh] flex items-center justify-center">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80"
            srcSet="
              https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80 800w,
              https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80 1770w
            "
            sizes="(max-width: 800px) 800px, 1770px"
            alt="Hình nền voucher"
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
        <div className="absolute inset-0 hero-gradient"></div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto" data-aos="fade-up">
          <h1 className="text-4xl md:text-6xl max-[499px]:text-3xl max-[374px]:text-2xl font-bold mb-6 font-orbitron">
            VOUCHER ĐỘC QUYỀN
          </h1>
          <p className="text-xl max-[499px]:text-base mb-8 font-open-sans">
            Nhận ưu đãi đặc biệt cho thiết bị chơi game và áo đấu cao cấp
          </p>
          <div className="flex justify-center">
            <a
              href="#active-vouchers"
              className="bg-primary hover:bg-primary/90 text-white px-8 py-3 max-[499px]:px-6 max-[499px]:py-2 max-[499px]:text-sm rounded-md font-semibold transition font-orbitron"
            >
              Nhận Voucher của Bạn
            </a>
          </div>
        </div>
      </section>

      {/* Active Vouchers */}
      <section id="active-vouchers" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h2 className="text-3xl max-[499px]:text-2xl font-bold mb-8 text-center font-orbitron" data-aos="fade-up">
          VOUCHER ĐANG HOẠT ĐỘNG
        </h2>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 font-semibold py-8 bg-secondary/50 rounded-lg border border-red-500/20">
            {error}
          </div>
        ) : vouchers.length === 0 ? (
          <div className="text-center text-accent/70 font-semibold py-12 bg-secondary/50 rounded-lg border border-primary/20">
            Không có voucher khả dụng lúc này.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-[499px]:gap-6">
            {vouchers.map((voucher, index) => {
              const isOutOfUsage = voucher.voucher_usage_time <= 0;
              const isExpired = new Date() > new Date(voucher.end_date);
              const isBelowMinOrder = subtotal < voucher.min_order_value;
              
              const isEligible = !isOutOfUsage && !isExpired && !isBelowMinOrder;
              const missingAmount = voucher.min_order_value - subtotal;
              
              let errorReason = '';
              if (isOutOfUsage) errorReason = 'Đã hết lượt sử dụng';
              else if (isExpired) errorReason = 'Đã hết hạn';
              else if (isBelowMinOrder) errorReason = 'Không khả dụng';
              
              return (
              <div
                key={voucher.voucher_id}
                className={`voucher-card bg-secondary/50 rounded-lg p-6 max-[499px]:p-4 border shadow-md flex flex-col justify-between relative ${isEligible ? 'border-primary/20' : 'border-gray-500/20 opacity-80'}`}
                data-aos="fade-up"
                data-aos-delay={(index % 3) * 100}
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span className="bg-primary text-white text-sm px-3 py-1 rounded font-open-sans">
                      {voucher.voucher_type === 'Phần trăm' ? 'GIẢM THEO %' : 'GIẢM CỐ ĐỊNH'}
                    </span>
                    <span className="text-primary font-bold text-lg max-[499px]:text-base font-open-sans">
                      {voucher.voucher_type === 'Phần trăm' ? `GIẢM ${voucher.voucher_value}%` : `GIẢM ${formatCurrency(voucher.voucher_value)}`}
                    </span>
                  </div>
                  
                  <div className="flex items-center mb-2 flex-wrap gap-2">
                    <h3 className="font-semibold text-xl max-[499px]:text-lg font-open-sans text-primary">
                      {voucher.voucher_code}
                    </h3>
                    {!isEligible && (
                      <div className="flex items-center bg-red-500/20 text-red-500 px-2 py-1 rounded">
                        <span className="text-xs font-bold font-open-sans mr-1">
                          {errorReason}
                        </span>
                        {isBelowMinOrder && !isOutOfUsage && !isExpired && (
                          <div 
                            className="relative flex items-center justify-center cursor-pointer"
                            onMouseEnter={() => setActiveTooltip(voucher.voucher_id)}
                            onMouseLeave={() => setActiveTooltip(null)}
                            onClick={() => setActiveTooltip(activeTooltip === voucher.voucher_id ? null : voucher.voucher_id)}
                          >
                            <div className="w-4 h-4 rounded-full bg-red-500 text-white flex items-center justify-center text-[10px] font-bold">
                              !
                            </div>
                            
                            {activeTooltip === voucher.voucher_id && (
                              <div className="absolute z-[100] w-[260px] p-4 bg-secondary border border-red-500/30 rounded-lg shadow-2xl text-sm left-1/2 transform -translate-x-1/2 bottom-full mb-2 cursor-default">
                                <h4 className="font-semibold text-red-500 mb-2">Điều kiện sử dụng</h4>
                                <ul className="space-y-1 text-accent font-open-sans text-left">
                                  <li>• Đơn hàng tối thiểu: <span className="font-bold">{formatCurrency(voucher.min_order_value)}</span></li>
                                  <li>• Đơn hàng hiện tại: <span className="font-bold">{formatCurrency(subtotal)}</span></li>
                                  <li className="text-red-500 mt-2 font-semibold">• Bạn cần mua thêm: {formatCurrency(missingAmount)} để sử dụng voucher này.</li>
                                </ul>
                                <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-8 border-transparent border-t-secondary"></div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <ul className="text-accent/80 text-sm font-open-sans space-y-2 mb-4 mt-2">
                    <li>
                      <strong>Đơn tối thiểu:</strong> {formatCurrency(voucher.min_order_value)}
                    </li>
                    <li>
                      <strong>Giảm tối đa:</strong> {voucher.max_discount ? formatCurrency(voucher.max_discount) : 'Không giới hạn'}
                    </li>
                    <li>
                      <strong>Số lượt còn lại:</strong> {voucher.voucher_usage_time} lượt
                    </li>
                  </ul>
                  
                  <div className="voucher-code p-3 rounded text-center font-mono text-lg max-[499px]:text-base mb-4 font-open-sans bg-black/30 border border-primary/30">
                    {voucher.voucher_code}
                  </div>
                  
                  <div className="flex justify-between items-center text-xs text-accent/60 mb-4 font-open-sans">
                    <span>Từ: {formatDate(voucher.start_date)}</span>
                    <span>Đến: {formatDate(voucher.end_date)}</span>
                  </div>
                </div>

                <button
                  className={`copy-btn w-full py-2 max-[499px]:py-1.5 max-[499px]:text-sm rounded mt-auto font-orbitron transition-colors ${
                    isEligible 
                      ? 'bg-transparent border border-primary text-primary hover:bg-primary hover:text-white' 
                      : 'bg-gray-500/20 border border-gray-500/30 text-gray-500 cursor-not-allowed'
                  }`}
                  onClick={(e) => isEligible && handleCopy(voucher.voucher_code, e.currentTarget as HTMLButtonElement)}
                  disabled={!isEligible}
                >
                  {isEligible ? 'Sao chép Mã' : errorReason}
                </button>
              </div>
            );
            })}
          </div>
        )}
      </section>

      {/* How to Use */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-black rounded-3xl mb-12" data-aos="fade-up">
        <h2 className="text-3xl max-[499px]:text-2xl font-bold mb-8 text-center font-orbitron">
          CÁCH SỬ DỤNG VOUCHER
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center" data-aos="fade-up" data-aos-delay={100}>
            <div className="bg-primary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <i data-feather="copy" className="h-8 w-8 text-white"></i>
            </div>
            <h3 className="font-semibold text-lg max-[499px]:text-base mb-2 font-open-sans">1. Sao chép Mã</h3>
            <p className="text-accent/70 font-open-sans max-[499px]:text-sm">
              Nhấn nút "Sao chép Mã" trên bất kỳ voucher đang hoạt động
            </p>
          </div>

          <div className="text-center" data-aos="fade-up" data-aos-delay={200}>
            <div className="bg-primary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <i data-feather="shopping-cart" className="h-8 w-8 text-white"></i>
            </div>
            <h3 className="font-semibold text-lg max-[499px]:text-base mb-2 font-open-sans">
              2. Thêm vào Giỏ hàng
            </h3>
            <p className="text-accent/70 font-open-sans max-[499px]:text-sm">
              Thêm sản phẩm vào giỏ hàng và tiến hành thanh toán
            </p>
          </div>

          <div className="text-center" data-aos="fade-up" data-aos-delay={300}>
            <div className="bg-primary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <i data-feather="tag" className="h-8 w-8 text-white"></i>
            </div>
            <h3 className="font-semibold text-lg max-[499px]:text-base mb-2 font-open-sans">
              3. Áp dụng Voucher
            </h3>
            <p className="text-accent/70 font-open-sans max-[499px]:text-sm">
              Dán mã vào trường voucher trong quá trình thanh toán
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Vouchers;