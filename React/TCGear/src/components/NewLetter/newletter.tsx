import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './newletter.css';

const autoTranslate = async (text: string): Promise<string> => {
  if (!text || text.trim() === '') return text;
  const cacheKey = `trans_${text}`;
  const cached = localStorage.getItem(cacheKey);
  if (cached) return cached;

  try {
    const res = await fetch(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=vi&tl=en&dt=t&q=${encodeURIComponent(text)}`
    );
    const data = await res.json();
    const translated = data[0][0][0];
    localStorage.setItem(cacheKey, translated);
    return translated;
  } catch (err) {
    return text;
  }
};

const Newsletter: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [translatedTexts, setTranslatedTexts] = useState({
    title: 'THAM GIA CỘNG ĐỒNG TCGEAR',
    description: 'Đăng ký nhận bản tin để nhận ưu đãi độc quyền, thông tin sản phẩm mới và tin tức esports',
    placeholder: 'Địa chỉ email của bạn',
    buttonText: 'Đăng ký',
    ariaLabel: 'Đăng ký nhận bản tin'
  });

  useEffect(() => {
    const updateTranslations = async () => {
      if (i18n.language === 'en') {
        const translations = await Promise.all([
          autoTranslate('THAM GIA CỘNG ĐỒNG TCGEAR'),
          autoTranslate('Đăng ký nhận bản tin để nhận ưu đãi độc quyền, thông tin sản phẩm mới và tin tức esports'),
          autoTranslate('Địa chỉ email của bạn'),
          autoTranslate('Đăng ký'),
          autoTranslate('Đăng ký nhận bản tin')
        ]);

        setTranslatedTexts({
          title: translations[0],
          description: translations[1],
          placeholder: translations[2],
          buttonText: translations[3],
          ariaLabel: translations[4]
        });
      } else {
        // Khi ngôn ngữ là tiếng Việt, sử dụng văn bản gốc
        setTranslatedTexts({
          title: 'THAM GIA CỘNG ĐỒNG TCGEAR',
          description: 'Đăng ký nhận bản tin để nhận ưu đãi độc quyền, thông tin sản phẩm mới và tin tức esports',
          placeholder: 'Địa chỉ email của bạn',
          buttonText: 'Đăng ký',
          ariaLabel: 'Đăng ký nhận bản tin'
        });
      }
    };

    updateTranslations();
  }, [i18n.language]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Xử lý gửi form newsletter ở đây
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-primary text-white">
      <div className="max-w-4xl mx-auto text-center" data-aos="fade-up">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 font-orbitron">
          {translatedTexts.title}
        </h2>
        <p className="mb-8 max-w-2xl mx-auto font-open-sans">
          {translatedTexts.description}
        </p>

        <form className="newsletter-form flex flex-col sm:flex-row gap-4 max-w-md mx-auto" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder={translatedTexts.placeholder}
            className="flex-1 px-4 py-3 rounded-md text-secondary focus:outline-none focus:ring-2 focus:ring-accent font-open-sans"
            aria-label={translatedTexts.ariaLabel}
            required
          />
          <button
            type="submit"
            className="bg-secondary text-accent hover:bg-black px-6 py-3 rounded-md font-semibold transition font-orbitron"
          >
            {translatedTexts.buttonText}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Newsletter;