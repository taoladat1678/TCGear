// components/Footer.tsx (phiên bản đầy đủ đã cập nhật)

import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import feather from 'feather-icons';

const Footer: React.FC = () => {
  const { t } = useTranslation();

  useEffect(() => {
    feather.replace();
  }, []);

  return (
    <footer className="bg-secondary border-t border-primary/20 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Company Info */}
        <div>
          <div className="flex items-center mb-4">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/T1_esports_logo.svg/1200px-T1_esports_logo.svg.png"
              className="h-8 w-auto"
              alt="TCGear Logo"
            />
            <span className="ml-2 text-lg font-bold text-primary font-orbitron">TCGEAR</span>
          </div>
          <p className="text-accent/70 mb-4 font-open-sans">
            {t('Thiết bị chơi game và áo đấu cao cấp dành cho game thủ chuyên nghiệp và đội esports.')}
          </p>
          <div className="flex space-x-4">
            <a href="https://facebook.com/tcgear" className="text-accent/70 hover:text-primary transition" aria-label="Facebook">
              <i data-feather="facebook" className="h-6 w-6"></i>
            </a>
            <a href="https://twitter.com/tcgear" className="text-accent/70 hover:text-primary transition" aria-label="Twitter">
              <i data-feather="twitter" className="h-6 w-6"></i>
            </a>
            <a href="https://instagram.com/tcgear" className="text-accent/70 hover:text-primary transition" aria-label="Instagram">
              <i data-feather="instagram" className="h-6 w-6"></i>
            </a>
            <a href="https://youtube.com/tcgear" className="text-accent/70 hover:text-primary transition" aria-label="YouTube">
              <i data-feather="youtube" className="h-6 w-6"></i>
            </a>
          </div>
        </div>

        {/* Shop Links */}
        <div>
          <h3 className="font-semibold text-lg mb-4 font-orbitron">{t('Cửa hàng')}</h3>
          <ul className="space-y-2">
            <li>
              <a href="/jerseys" className="text-accent/70 hover:text-primary transition font-open-sans">
                {t('Áo đấu')}
              </a>
            </li>
            <li>
              <a href="/shop?category=headsets" className="text-accent/70 hover:text-primary transition font-open-sans">
                {t('Tai nghe')}
              </a>
            </li>
            <li>
              <a href="/shop?category=keyboards" className="text-accent/70 hover:text-primary transition font-open-sans">
                {t('Bàn phím')}
              </a>
            </li>
            <li>
              <a href="/shop?category=mice" className="text-accent/70 hover:text-primary transition font-open-sans">
                {t('Chuột')}
              </a>
            </li>
            <li>
              <a href="/shop?category=accessories" className="text-accent/70 hover:text-primary transition font-open-sans">
                {t('Phụ kiện')}
              </a>
            </li>
          </ul>
        </div>

        {/* Company Links */}
        <div>
          <h3 className="font-semibold text-lg mb-4 font-orbitron">{t('Công ty')}</h3>
          <ul className="space-y-2">
            <li>
              <a href="/about" className="text-accent/70 hover:text-primary transition font-open-sans">
                {t('Về chúng tôi')}
              </a>
            </li>
            <li>
              <a href="/contact" className="text-accent/70 hover:text-primary transition font-open-sans">
                {t('Liên hệ')}
              </a>
            </li>
            <li>
              <a href="/shipping" className="text-accent/70 hover:text-primary transition font-open-sans">
                {t('Vận chuyển')}
              </a>
            </li>
            <li>
              <a href="/returns" className="text-accent/70 hover:text-primary transition font-open-sans">
                {t('Đổi trả')}
              </a>
            </li>
            <li>
              <a href="/faq" className="text-accent/70 hover:text-primary transition font-open-sans">
                {t('Câu hỏi thường gặp')}
              </a>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="font-semibold text-lg mb-4 font-orbitron">{t('Liên hệ')}</h3>
          <ul className="space-y-4">
            <li className="flex items-start">
              <i data-feather="map-pin" className="mr-2 h-5 w-5 text-primary mt-0.5"></i>
              <span className="text-accent/70 font-open-sans">
                {t('627 Seolleung-ro, Gangnam-gu, Seoul, Hàn Quốc (Gần ga Seonjeongneung)')}
              </span>
            </li>
            <li className="flex items-start">
              <i data-feather="mail" className="mr-2 h-5 w-5 text-primary mt-0.5"></i>
              <span className="text-accent/70 font-open-sans">support@tcgear.com</span>
            </li>
            <li className="flex items-start">
              <i data-feather="phone" className="mr-2 h-5 w-5 text-primary mt-0.5"></i>
              <span className="text-accent/70 font-open-sans">+82 2-6009-2503</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="max-w-7xl mx-auto border-t border-primary/20 mt-8 pt-8 text-center text-accent/50 text-sm">
        <p className="font-open-sans">
          © 2025 <span className="font-orbitron">TCGear</span>. {t('Mọi quyền được bảo lưu.')}
        </p>
      </div>
    </footer>
  );
};

export default Footer;