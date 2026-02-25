// vouchers.tsx
import React, { useEffect } from 'react';
import './vouchers.css';
import AOS from 'aos'; // Assuming AOS is installed and imported
import 'aos/dist/aos.css'; // Import AOS CSS if not global

AOS.init({
  duration: 800,
  easing: 'ease-in-out',
  once: true,
});

const Vouchers: React.FC = () => {
  useEffect(() => {
    // Initialize Feather Icons if needed
    // feather.replace(); // Assuming feather-icons is set up
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
        // feather.replace();
      }, 2000);
    });
  };

  const voucherData = [
    {
      id: 1,
      tag: 'MỚI',
      discount: 'GIẢM 15%',
      title: 'Ưu đãi Chào mừng',
      description: 'Nhận giảm 15% cho đơn hàng đầu tiên trên tất cả sản phẩm',
      code: 'WELCOME15',
      expiry: '31/12/2025',
      used: 125,
      progress: 65,
      delay: 100,
    },
    {
      id: 2,
      tag: 'PHỔ BIẾN',
      discount: 'GIẢM 25$',
      title: 'Ưu đãi Gói Thiết bị',
      description: 'Giảm 25$ khi chi tiêu từ 150$ trở lên cho thiết bị chơi game',
      code: 'GEAR25',
      expiry: '15/01/2026',
      used: 89,
      progress: 45,
      delay: 200,
    },
    {
      id: 3,
      tag: 'GIỚI HẠN',
      discount: 'GIẢM 20%',
      title: 'Ưu đãi Áo đấu',
      description: 'Giảm 20% cho tất cả áo đấu esports và trang phục đội',
      code: 'JERSEY20',
      expiry: '30/11/2025',
      used: 203,
      progress: 80,
      delay: 300,
    },
  ];

  return (
    <div className="bg-secondary text-accent">
      {/* Preloader - Optional for component */}

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
          <h1 className="text-4xl md:text-6xl font-bold mb-6 font-orbitron">
            VOUCHER ĐỘC QUYỀN
          </h1>
          <p className="text-xl mb-8 font-open-sans">
            Nhận ưu đãi đặc biệt cho thiết bị chơi game và áo đấu cao cấp
          </p>
          <div className="flex justify-center">
            <a
              href="#newsletter"
              className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-md font-semibold transition font-orbitron"
            >
              Nhận Voucher của Bạn
            </a>
          </div>
        </div>
      </section>

      {/* Active Vouchers */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center font-orbitron" data-aos="fade-up">
          VOUCHER ĐANG HOẠT ĐỘNG
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {voucherData.map((voucher) => (
            <div
              key={voucher.id}
              className="voucher-card bg-secondary/50 rounded-lg p-6 border border-primary/20 shadow-md"
              data-aos="fade-up"
              data-aos-delay={voucher.delay}
            >
              <div className="flex justify-between items-start mb-4">
                <span className="bg-primary text-white text-sm px-3 py-1 rounded font-open-sans">
                  {voucher.tag}
                </span>
                <span className="text-primary font-bold text-lg font-open-sans">{voucher.discount}</span>
              </div>
              <h3 className="font-semibold text-xl mb-2 font-open-sans">{voucher.title}</h3>
              <p className="text-accent/70 mb-4 font-open-sans">{voucher.description}</p>
              <div className="voucher-code p-3 rounded text-center font-mono text-lg mb-4 font-open-sans">
                {voucher.code}
              </div>
              <div className="flex justify-between items-center text-sm text-accent/70 mb-4 font-open-sans">
                <span>Hiệu lực đến: {voucher.expiry}</span>
                <span>Đã sử dụng: {voucher.used}</span>
              </div>
              <div className="progress-bar mb-2">
                <div className="progress-fill" style={{ width: `${voucher.progress}%` }}></div>
              </div>
              <p className="text-xs text-accent/70 text-center font-open-sans">
                {voucher.progress}% voucher đã được nhận
              </p>
              <button
                className="copy-btn w-full bg-transparent border border-primary text-primary py-2 rounded mt-4 font-orbitron"
                onClick={(e) => handleCopy(voucher.code, e.currentTarget as HTMLButtonElement)}
              >
                Sao chép Mã
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* How to Use */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-black" data-aos="fade-up">
        <h2 className="text-3xl font-bold mb-8 text-center font-orbitron">
          CÁCH SỬ DỤNG VOUCHER
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center" data-aos="fade-up" data-aos-delay={100}>
            <div className="bg-primary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <i data-feather="copy" className="h-8 w-8 text-white"></i>
            </div>
            <h3 className="font-semibold text-lg mb-2 font-open-sans">1. Sao chép Mã</h3>
            <p className="text-accent/70 font-open-sans">
              Nhấn nút "Sao chép Mã" trên bất kỳ voucher đang hoạt động
            </p>
          </div>

          <div className="text-center" data-aos="fade-up" data-aos-delay={200}>
            <div className="bg-primary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <i data-feather="shopping-cart" className="h-8 w-8 text-white"></i>
            </div>
            <h3 className="font-semibold text-lg mb-2 font-open-sans">
              2. Thêm vào Giỏ hàng
            </h3>
            <p className="text-accent/70 font-open-sans">
              Thêm sản phẩm vào giỏ hàng và tiến hành thanh toán
            </p>
          </div>

          <div className="text-center" data-aos="fade-up" data-aos-delay={300}>
            <div className="bg-primary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <i data-feather="tag" className="h-8 w-8 text-white"></i>
            </div>
            <h3 className="font-semibold text-lg mb-2 font-open-sans">
              3. Áp dụng Voucher
            </h3>
            <p className="text-accent/70 font-open-sans">
              Dán mã vào trường voucher trong quá trình thanh toán
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Vouchers;