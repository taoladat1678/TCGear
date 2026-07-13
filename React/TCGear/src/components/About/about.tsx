// FILE 1: src/pages/About.tsx - FULL CODE KHÔNG TÓM TẮT, KHÔNG THIẾU DÒNG NÀO

import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import AOS from 'aos';
import 'aos/dist/aos.css';
import feather from 'feather-icons';
import './about.css';

const About: React.FC = () => {
  const { t } = useTranslation();

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,
    });

    feather.replace({ width: '24', height: '24' });
    AOS.refresh();
  }, []);

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
    </>
  );
};

export default About;