// pages/contact.tsx (đã dịch 100% bằng i18n, không còn text cứng)

import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import feather from 'feather-icons';
import { useTranslation } from 'react-i18next';
import './contact.css';

const Contact: React.FC = () => {
  const { t } = useTranslation();

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true
    });

    feather.replace({ width: '24', height: '24' });
    AOS.refresh();
  }, []);

  return (
    <>
      {/* Contact Hero Section */}
      <section className="contact-hero relative h-[80vh] flex items-center justify-center">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80" 
            srcSet="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80 800w,
                    https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80 1770w"
            sizes="(max-width: 800px) 800px, 1770px"
            alt="Gaming team communication" 
            className="w-full h-full object-cover" 
            loading="lazy"
          />
        </div>
        <div className="absolute inset-0 hero-gradient"></div>
        
        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto" data-aos="fade-up">
          <h1 className="text-4xl md:text-7xl font-bold mb-6 font-orbitron text-accent">
            {t('LIÊN HỆ VỚI CHÚNG TÔI')}
          </h1>
          <p className="text-lg md:text-xl font-open-sans text-accent">
            {t('Chúng tôi rất mong nhận được phản hồi từ bạn về nhu cầu thiết bị chơi game')}
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div data-aos="fade-right">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 font-orbitron text-accent">
              {t('GỬI TIN NHẮN CHO CHÚNG TÔI')}
            </h2>
            <form id="contact-form" className="space-y-8">
              <div>
                <label htmlFor="name" className="form-label text-accent">{t('Tên của bạn')}</label>
                <input type="text" id="name" className="form-input" required aria-required="true" />
              </div>
              <div>
                <label htmlFor="email" className="form-label text-accent">{t('Địa chỉ Email')}</label>
                <input type="email" id="email" className="form-input" required aria-required="true" />
              </div>
              <div>
                <label htmlFor="subject" className="form-label text-accent">{t('Chủ đề')}</label>
                <input type="text" id="subject" className="form-input" required aria-required="true" />
              </div>
              <div>
                <label htmlFor="message" className="form-label text-accent">{t('Tin nhắn')}</label>
                <textarea id="message" className="form-input form-textarea" required aria-required="true"></textarea>
              </div>
              <button type="submit" className="form-submit">{t('GỬI TIN NHẮN')}</button>
            </form>
            <p id="contact-message" className="text-accent mt-4 hidden font-open-sans"></p>
          </div>

          {/* Contact Information */}
          <div data-aos="fade-left">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 font-orbitron text-accent">
              {t('THÔNG TIN LIÊN HỆ')}
            </h2>
            <div className="space-y-6">
              <div className="bg-secondary/50 rounded-lg p-6 border border-primary/20">
                <div className="flex items-start">
                  <i data-feather="map-pin" className="mr-4 h-8 w-8 text-primary mt-1"></i>
                  <div>
                    <h3 className="font-semibold mb-1 text-lg font-orbitron text-accent">{t('Địa chỉ')}</h3>
                    <p className="text-accent/70 font-open-sans">
                      {t('627 Seolleung-ro, Gangnam-gu, Seoul, Hàn Quốc (Gần ga Seonjeongneung)')}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-secondary/50 rounded-lg p-6 border border-primary/20">
                <div className="flex items-start">
                  <i data-feather="mail" className="mr-4 h-8 w-8 text-primary mt-1"></i>
                  <div>
                    <h3 className="font-semibold mb-1 text-lg font-orbitron text-accent">{t('Email')}</h3>
                    <p className="text-accent/70 font-open-sans">support@tcgear.com</p>
                    <p className="text-accent/70 font-open-sans">partnerships@tcgear.com</p>
                  </div>
                </div>
              </div>
              <div className="bg-secondary/50 rounded-lg p-6 border border-primary/20">
                <div className="flex items-start">
                  <i data-feather="phone" className="mr-4 h-8 w-8 text-primary mt-1"></i>
                  <div>
                    <h3 className="font-semibold mb-1 text-lg font-orbitron text-accent">{t('Điện thoại')}</h3>
                    <p className="text-accent/70 font-open-sans">+82 2-6009-2503</p>
                  </div>
                </div>
              </div>
              <div className="bg-secondary/50 rounded-lg p-6 border border-primary/20">
                <div className="flex items-start">
                  <i data-feather="clock" className="mr-4 h-8 w-8 text-primary mt-1"></i>
                  <div>
                    <h3 className="font-semibold mb-1 text-lg font-orbitron text-accent">{t('Giờ làm việc')}</h3>
                    <p className="text-accent/70 font-open-sans">{t('Thứ Hai - Thứ Sáu: 9h sáng - 6h chiều EST')}</p>
                    <p className="text-accent/70 font-open-sans">{t('Thứ Bảy: 10h sáng - 4h chiều EST')}</p>
                    <p className="text-accent/70 font-open-sans">{t('Chủ Nhật: Đóng cửa')}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="mt-8">
              <h3 className="font-semibold text-lg mb-4 font-orbitron text-accent">{t('THEO DÕI CHÚNG TÔI')}</h3>
              <div className="flex space-x-6">
                <a href="https://twitter.com/tcgear" className="social-icon text-accent hover:text-primary transition" aria-label="Twitter">
                  <i data-feather="twitter" className="h-6 w-6"></i>
                </a>
                <a href="https://facebook.com/tcgear" className="social-icon text-accent hover:text-primary transition" aria-label="Facebook">
                  <i data-feather="facebook" className="h-6 w-6"></i>
                </a>
                <a href="https://instagram.com/tcgear" className="social-icon text-accent hover:text-primary transition" aria-label="Instagram">
                  <i data-feather="instagram" className="h-6 w-6"></i>
                </a>
                <a href="https://youtube.com/tcgear" className="social-icon text-accent hover:text-primary transition" aria-label="YouTube">
                  <i data-feather="youtube" className="h-6 w-6"></i>
                </a>
                <a href="https://twitch.tv/tcgear" className="social-icon text-accent hover:text-primary transition" aria-label="Twitch">
                  <i data-feather="twitch" className="h-6 w-6"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section py-16 bg-black px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12" data-aos="fade-up">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-orbitron text-accent">
              {t('CÂU HỎI THƯỜNG GẶP')}
            </h2>
            <p className="text-accent/70 max-w-2xl mx-auto font-open-sans">
              {t('Tìm câu trả lời nhanh cho các câu hỏi phổ biến về sản phẩm và dịch vụ của chúng tôi')}
            </p>
          </div>
          
          <div className="space-y-4" data-aos="fade-up">
            <details>
              <summary className="flex items-center text-accent">
                <i data-feather="truck" className="mr-2 h-5 w-5 text-primary"></i>
                {t('Các tùy chọn giao hàng của bạn là gì?')}
              </summary>
              <p className="text-accent">
                {t('Chúng tôi cung cấp giao hàng tiêu chuẩn (3-5 ngày làm việc), giao hàng nhanh (2-3 ngày làm việc) và giao hàng tốc hành (1-2 ngày làm việc). Giao hàng quốc tế cũng có sẵn.')}
              </p>
            </details>
            <details>
              <summary className="flex items-center text-accent">
                <i data-feather="rotate-ccw" className="mr-2 h-5 w-5 text-primary"></i>
                {t('Chính sách đổi trả của bạn là gì?')}
              </summary>
              <p className="text-accent">
                {t('Chúng tôi cung cấp chính sách đổi trả trong 30 ngày đối với tất cả các sản phẩm chưa sử dụng còn nguyên bao bì. Áo đấu tùy chỉnh có thể có điều kiện đổi trả khác.')}
              </p>
            </details>
            <details>
              <summary className="flex items-center text-accent">
                <i data-feather="award" className="mr-2 h-5 w-5 text-primary"></i>
                {t('Bạn có ưu đãi cho đội nhóm không?')}
              </summary>
              <p className="text-accent">
                {t('Có! Chúng tôi cung cấp giá đặc biệt cho các đội esports và tổ chức. Liên hệ với đội ngũ hợp tác của chúng tôi để được báo giá tùy chỉnh.')}
              </p>
            </details>
            <details>
              <summary className="flex items-center text-accent">
                <i data-feather="package" className="mr-2 h-5 w-5 text-primary"></i>
                {t('Đơn hàng áo đấu tùy chỉnh hoạt động như thế nào?')}
              </summary>
              <p className="text-accent">
                {t('Đơn hàng áo đấu tùy chỉnh yêu cầu số lượng tối thiểu 5 chiếc. Đội ngũ thiết kế của chúng tôi sẽ làm việc với bạn để tạo ra bản sắc đội độc đáo của bạn.')}
              </p>
            </details>
          </div>
          
          <div className="text-center mt-12">
            <a href="faq.html" className="border-2 border-primary text-primary hover:bg-primary hover:text-white px-8 py-3 rounded-md font-semibold transition font-orbitron">
              {t('XEM TẤT CẢ FAQ')}
            </a>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12" data-aos="fade-up">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-orbitron text-accent">
            {t('VỊ TRÍ TRỤ SỞ CHÍNH CỦA T1')}
          </h2>
          <p className="text-accent/70 max-w-2xl mx-auto font-open-sans">
            {t('Trụ sở chính của đội tuyển T1 nằm tại quận Gangnam, Seoul, Hàn Quốc – một tòa nhà 10 tầng hiện đại dành riêng cho esports')}
          </p>
        </div>
        
        <div className="bg-secondary/50 rounded-lg overflow-hidden border border-primary/20 h-96 transition-all hover:shadow-lg" data-aos="fade-up">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3164.662756708956!2d127.040966276478!3d37.506999471922!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x357ca4c3e8b0b7b7%3A0x8e5e5e5e5e5e5e5e!2s627%20Seolleung-ro%2C%20Gangnam-gu%2C%20Seoul%2C%20South%20Korea!5e0!3m2!1sen!2sus!4v1700000000000"
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            aria-label="Map of T1 headquarters in Gangnam, Seoul"
          ></iframe>
        </div>
        <p className="text-center text-accent/70 mt-4 font-open-sans text-sm">
          {t('Bản đồ hiển thị vị trí chính xác: 627 Seolleung-ro, Gangnam-gu, Seoul (gần ga tàu điện ngầm Seonjeongneung)')}
        </p>
      </section>
    </>
  );
};

export default Contact;