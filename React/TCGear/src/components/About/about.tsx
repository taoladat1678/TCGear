import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import AOS from 'aos';
import 'aos/dist/aos.css';
import feather from 'feather-icons';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import { autoTranslate } from '../../utils/autoTranslate';
import './about.css';

const About: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [siteRatings, setSiteRatings] = useState<any[]>([]);
  const [originalRatings, setOriginalRatings] = useState<any[]>([]);

  useEffect(() => {
    // Fetch site ratings
    const fetchRatings = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/ratings/customers');
        const data = await res.json();
        if (data.status === 'success') {
          const normalized = data.data.map((r: any) => ({
            id: r.rating_id,
            rating: r.rating,
            content: r.comment,
            created_at: r.create_at,
            user_name: r.name,
            user_image: r.avatar,
          }));
          setOriginalRatings(normalized);
        }
      } catch (err) {
        console.error('Error fetching site ratings:', err);
      }
    };
    fetchRatings();

    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,
    });

    feather.replace({ width: '24', height: '24' });
    AOS.refresh();
  }, []);

  useEffect(() => {
    const translateRatings = async () => {
      if (originalRatings.length === 0) return;
      
      const targetLang = i18n.language || 'vi';
      const translated = await Promise.all(
        originalRatings.map(async (rating) => {
          if (!rating.content) return rating;
          const translatedContent = await autoTranslate(rating.content, targetLang);
          return { ...rating, content: translatedContent };
        })
      );
      setSiteRatings(translated);
    };

    translateRatings();
  }, [i18n.language, originalRatings]);

  return (
    <>
      {/* About Hero Section */}
      <section className="about-hero relative h-[80vh] flex items-center justify-center">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80"
            srcSet="https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80 800w,
                    https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80 1770w"
            sizes="(max-width: 800px) 800px, 1770px"
            alt={t('about.hero_alt')}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
        <div className="absolute inset-0 hero-gradient"></div>

        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto" data-aos="fade-up">
          <h1 className="text-4xl md:text-7xl max-[767px]:text-5xl max-[499px]:text-3xl max-[374px]:text-2xl font-bold mb-6 font-orbitron text-accent">
            {t('about.title')}
          </h1>
          <p className="text-lg md:text-xl max-[499px]:text-base max-[374px]:text-sm font-open-sans text-accent">
            {t('about.subtitle')}
          </p>
        </div>
      </section>

      {/* About Content */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Timeline */}
        <div data-aos="fade-up">
          <h2 className="text-3xl md:text-4xl max-[767px]:text-3xl max-[499px]:text-2xl max-[374px]:text-xl font-bold mb-8 font-orbitron text-accent text-center">
            {t('about.journey_title')}
          </h2>

          <div className="timeline">
            <div className="timeline-item left" data-aos="fade-right" data-aos-delay="100">
              <div className="timeline-content">
                <h3 className="text-xl max-[499px]:text-lg max-[374px]:text-base font-bold font-orbitron text-accent">2004</h3>
                <h4 className="text-lg max-[499px]:text-base max-[374px]:text-sm font-semibold font-open-sans text-accent">
                  {t('about.timeline.2004.title')}
                </h4>
                <p className="text-accent/70 font-open-sans max-[499px]:text-sm max-[374px]:text-xs">
                  {t('about.timeline.2004.desc')}
                </p>
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQESE27Vr8OHWi8ZOw2U9OBejBXgMFwamewGg&s"
                  alt={t('about.timeline.2004.img_alt')}
                  className="w-full h-64 max-[499px]:h-48 max-[374px]:h-40 object-cover rounded-md mt-4"
                  loading="lazy"
                />
              </div>
            </div>

            <div className="timeline-item right" data-aos="fade-left" data-aos-delay="200">
              <div className="timeline-content">
                <h3 className="text-xl max-[499px]:text-lg max-[374px]:text-base font-bold font-orbitron text-accent">2013</h3>
                <h4 className="text-lg max-[499px]:text-base max-[374px]:text-sm font-semibold font-open-sans text-accent">
                  {t('about.timeline.2013.title')}
                </h4>
                <p className="text-accent/70 font-open-sans max-[499px]:text-sm max-[374px]:text-xs">
                  {t('about.timeline.2013.desc')}
                </p>
                <img
                  src="https://genk.mediacdn.vn/k:2016/photo-2-1466949495383/nhungnhavodichlienminhhuyenthoaingayaybaygiophan3skt2013.png"
                  alt={t('about.timeline.2013.img_alt')}
                  className="w-full h-64 max-[499px]:h-48 max-[374px]:h-40 object-cover rounded-md mt-4"
                  loading="lazy"
                />
              </div>
            </div>

            <div className="timeline-item left" data-aos="fade-right" data-aos-delay="300">
              <div className="timeline-content">
                <h3 className="text-xl max-[499px]:text-lg max-[374px]:text-base font-bold font-orbitron text-accent">2019</h3>
                <h4 className="text-lg max-[499px]:text-base max-[374px]:text-sm font-semibold font-open-sans text-accent">
                  {t('about.timeline.2019.title')}
                </h4>
                <p className="text-accent/70 font-open-sans max-[499px]:text-sm max-[374px]:text-xs">
                  {t('about.timeline.2019.desc')}
                </p>
                <img
                  src="https://images.squarespace-cdn.com/content/v1/62d09f54a49d6f1c78455cce/1741685071804-FO5FEAU4AINDPSNXB69H/T1.png"
                  alt={t('about.timeline.2019.img_alt')}
                  className="w-full h-64 max-[499px]:h-48 max-[374px]:h-40 object-cover rounded-md mt-4"
                  loading="lazy"
                />
              </div>
            </div>

            <div className="timeline-item right" data-aos="fade-left" data-aos-delay="400">
              <div className="timeline-content">
                <h3 className="text-xl max-[499px]:text-lg max-[374px]:text-base font-bold font-orbitron text-accent">2021</h3>
                <h4 className="text-lg max-[499px]:text-base max-[374px]:text-sm font-semibold font-open-sans text-accent">
                  {t('about.timeline.2021.title')}
                </h4>
                <p className="text-accent/70 font-open-sans max-[499px]:text-sm max-[374px]:text-xs">
                  {t('about.timeline.2021.desc')}
                </p>
                <img
                  src="/public/img/tcgear.jpg"
                  alt={t('about.timeline.2021.img_alt')}
                  className="w-full h-64 max-[499px]:h-48 max-[374px]:h-40 object-cover rounded-md mt-4"
                  loading="lazy"
                />
              </div>
            </div>

            <div className="timeline-item left" data-aos="fade-right" data-aos-delay="500">
              <div className="timeline-content">
                <h3 className="text-xl max-[499px]:text-lg max-[374px]:text-base font-bold font-orbitron text-accent">2025</h3>
                <h4 className="text-lg max-[499px]:text-base max-[374px]:text-sm font-semibold font-open-sans text-accent">
                  {t('about.timeline.2025.title')}
                </h4>
                <p className="text-accent/70 font-open-sans max-[499px]:text-sm max-[374px]:text-xs">
                  {t('about.timeline.2025.desc')}
                </p>
                <img
                  src="https://tintuc-divineshop.cdn.vccloud.vn/wp-content/uploads/2025/11/gumayusi-ad-1-1762701345120-17627013454861428013844.jpg"
                  alt={t('about.timeline.2025.img_alt')}
                  className="w-full h-64 max-[499px]:h-48 max-[374px]:h-40 object-cover rounded-md mt-4"
                  loading="lazy"
                />
              </div>
            </div>
          </div>

          <div className="text-center">
            <a
              href="/shop"
              className="border-2 border-primary text-primary hover:bg-primary hover:text-white px-8 py-3 max-[499px]:px-6 max-[499px]:py-2 max-[499px]:text-sm max-[374px]:px-4 max-[374px]:py-1.5 max-[374px]:text-xs rounded-md font-semibold transition font-orbitron mt-8 inline-block"
            >
              {t('about.shop_button')}
            </a>
          </div>
        </div>

        {/* Our Mission */}
        <div className="mt-12" data-aos="fade-up">
          <h2 className="text-3xl md:text-4xl max-[767px]:text-3xl max-[499px]:text-2xl max-[374px]:text-xl font-bold mb-8 font-orbitron text-accent text-center">
            {t('about.mission_title')}
          </h2>
          <p className="text-accent/70 mb-4 font-open-sans text-center max-w-4xl mx-auto max-[499px]:text-sm max-[374px]:text-xs">
            {t('about.mission.paragraph1')}
          </p>
          <p className="text-accent/70 mb-4 font-open-sans text-center max-w-4xl mx-auto max-[499px]:text-sm max-[374px]:text-xs">
            {t('about.mission.paragraph2')}
          </p>
          <div className="text-center">
            <a
              href="/contact"
              className="border-2 border-primary text-primary hover:bg-primary hover:text-white px-8 py-3 max-[499px]:px-6 max-[499px]:py-2 max-[499px]:text-sm max-[374px]:px-4 max-[374px]:py-1.5 max-[374px]:text-xs rounded-md font-semibold transition font-orbitron inline-block"
            >
              {t('about.contact_button')}
            </a>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="team-section py-16 bg-black px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12" data-aos="fade-up">
            <h2 className="text-3xl md:text-4xl max-[767px]:text-3xl max-[499px]:text-2xl max-[374px]:text-xl font-bold mb-4 font-orbitron text-accent">
              {t('about.leadership_title')}
            </h2>
            <p className="text-accent/70 max-w-2xl mx-auto font-open-sans max-[499px]:text-sm max-[374px]:text-xs">
              {t('about.leadership_desc')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-[499px]:gap-4 max-[374px]:gap-3" data-aos="fade-up">
            <div className="bg-secondary/50 rounded-lg p-6 border border-primary/20 text-center">
              <img
                src="https://kenh14cdn.com/203336854389633024/2024/11/22/7728046057143390129cf65c7240f7c05042aa289ce590409d-1732255100546-17322551020201794984094-1732258267301-1732258268732678785285.png"
                alt="Joe Marsh"
                className="w-32 h-32 max-[499px]:w-24 max-[499px]:h-24 max-[374px]:w-20 max-[374px]:h-20 rounded-full mx-auto mb-4 object-cover"
                loading="lazy"
              />
              <h3 className="font-semibold text-lg max-[499px]:text-base max-[374px]:text-sm font-orbitron text-accent">Joe Marsh</h3>
              <p className="text-accent/70 font-open-sans max-[499px]:text-sm max-[374px]:text-xs">{t('about.leadership.ceo')}</p>
              <p className="text-accent/70 mt-2 font-open-sans max-[499px]:text-sm max-[374px]:text-xs">
                {t('about.leadership.joe_desc')}
              </p>
            </div>

            <div className="bg-secondary/50 rounded-lg p-6 border border-primary/20 text-center">
              <img
                src="https://gamelade.vn/wp-content/uploads/2025/07/b5b51eb8e533d46d5fb8c0e9a3eeb638dba5563b-3840x2180-1-scaled.webp"
                alt="Faker"
                className="w-32 h-32 max-[499px]:w-24 max-[499px]:h-24 max-[374px]:w-20 max-[374px]:h-20 rounded-full mx-auto mb-4 object-cover"
                loading="lazy"
              />
              <h3 className="font-semibold text-lg max-[499px]:text-base max-[374px]:text-sm font-orbitron text-accent">
                Lee "Faker" Sang-hyeok
              </h3>
              <p className="text-accent/70 font-open-sans max-[499px]:text-sm max-[374px]:text-xs">{t('about.leadership.faker_role')}</p>
              <p className="text-accent/70 mt-2 font-open-sans max-[499px]:text-sm max-[374px]:text-xs">
                {t('about.leadership.faker_desc')}
              </p>
            </div>

            <div className="bg-secondary/50 rounded-lg p-6 border border-primary/20 text-center">
              <img
                src="https://media.licdn.com/dms/image/v2/D5603AQFZhC_HwB7I3A/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1691266943917?e=2147483647&v=beta&t=oxEIdMXuWh538HbRahqFcEV4TgYZz7QY96UP6T4W0V0"
                alt="Josh Ahn"
                className="w-32 h-32 max-[499px]:w-24 max-[499px]:h-24 max-[374px]:w-20 max-[374px]:h-20 rounded-full mx-auto mb-4 object-cover"
                loading="lazy"
              />
              <h3 className="font-semibold text-lg max-[499px]:text-base max-[374px]:text-sm font-orbitron text-accent">Josh Ahn</h3>
              <p className="text-accent/70 font-open-sans max-[499px]:text-sm max-[374px]:text-xs">{t('about.leadership.coo')}</p>
              <p className="text-accent/70 mt-2 font-open-sans max-[499px]:text-sm max-[374px]:text-xs">
                {t('about.leadership.josh_desc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
        <div className="text-center mb-12" data-aos="fade-up">
          <h2 className="text-3xl md:text-4xl max-[767px]:text-3xl max-[499px]:text-2xl max-[374px]:text-xl font-bold mb-4 font-orbitron text-accent">
            ĐÁNH GIÁ TỪ KHÁCH HÀNG
          </h2>
          <p className="text-accent/70 max-w-2xl mx-auto font-open-sans">
            Những trải nghiệm mua sắm thực tế từ cộng đồng TCGear
          </p>
        </div>

        {siteRatings.length > 0 ? (
          <div data-aos="fade-up">
            <Swiper
              modules={[Autoplay, Pagination]}
              spaceBetween={24}
              slidesPerView={1}
              loop={true}
              autoplay={{
                delay: 4000,
                disableOnInteraction: false,
              }}
              pagination={{
                clickable: true,
                dynamicBullets: true,
              }}
              breakpoints={{
                768: {
                  slidesPerView: 2,
                },
                1024: {
                  slidesPerView: 3,
                },
              }}
              className="pb-12"
            >
              {siteRatings.map((rating) => (
                <SwiperSlide key={rating.id} className="h-auto">
                  <div className="bg-secondary/50 rounded-lg p-6 border border-primary/20 shadow-lg flex flex-col items-center text-center h-full">

                    {/* Avatar & Info */}
                    <div className="flex flex-col items-center mb-4">
                      {/* ĐÃ CHỈNH SỬA ĐƯỜNG DẪN ẢNH VÀ SỰ KIỆN LỖI Ở ĐÂY */}
                      <img
                        src={rating.user_image ? rating.user_image : '/img/fanT1.jpg'}
                        alt={rating.user_name}
                        className="w-16 h-16 rounded-full object-cover border-2 border-primary/40 mb-3"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.onerror = null; // Tránh lặp vô hạn nếu ảnh mặc định cũng lỗi
                          target.src = '/img/fanT1.jpg'; // Load từ thư mục public/img/
                        }}
                      />
                      <h4 className="font-semibold text-accent font-orbitron">{rating.user_name}</h4>
                      <p className="text-xs text-accent/50 font-open-sans mt-1">
                        {new Date(rating.created_at).toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                    </div>

                    {/* Stars using explicit SVGs to ensure standard compatibility in Swiper */}
                    <div className="flex justify-center gap-1 mb-4">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={star}
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill={star <= rating.rating ? '#ef4444' : 'none'}
                          stroke={star <= rating.rating ? '#ef4444' : '#6b7280'}
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="transition-colors duration-200"
                        >
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                      ))}
                    </div>

                    {/* Comment */}
                    <div className="flex-1 w-full">
                      <p className="text-accent/80 font-open-sans not-italic text-sm line-clamp-4 leading-relaxed text-center">
                        {rating.content}
                      </p>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        ) : (
          <div className="text-center text-accent/50 not-italic font-open-sans" data-aos="fade-up">
            Chưa có đánh giá nào.
          </div>
        )}
      </section>
    </>
  );
};

export default About;