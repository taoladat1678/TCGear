import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import feather from 'feather-icons';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './blog-detail.css';
import { useTranslation } from 'react-i18next';

// HÀM DỊCH ĐẶT TRỰC TIẾP TRONG FILE - KHÔNG CẦN FILE RIÊNG
const translateText = async (text: string): Promise<string> => {
  if (!text.trim()) return text;

  // Delay 400ms để tránh bị Google block spam
  await new Promise(resolve => setTimeout(resolve, 400));

  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=vi&tl=en&dt=t&q=${encodeURIComponent(text)}`;
    const response = await fetch(url);

    if (!response.ok) {
      console.warn('Google Translate HTTP error:', response.status);
      return text;
    }

    const data = await response.json();

    if (data && data[0] && Array.isArray(data[0])) {
      return data[0].map((item: any[]) => item[0] || '').join('');
    }

    return text;
  } catch (error) {
    console.error('Lỗi dịch Google Translate:', error);
    return text;
  }
};

// INTERFACE - THÊM TRƯỜNG DỊCH CHO CATEGORY NAME
interface BlogDetailData {
  blog_id: string;
  blog_title: string;
  blog_cate_id: string;
  create_at: string;
  update_at: string;
  blog_content: string;
  user_id: string;
  blog_img: string;
  blog_cate_name: string;

  translated_title?: string;
  translated_content?: string;
  translated_cate_name?: string; // THÊM DỊCH DANH MỤC
}

interface RelatedBlog {
  blog_id: string;
  blog_title: string;
  blog_img: string;
  create_at: string;
  blog_cate_name: string;

  translated_title?: string;
  translated_cate_name?: string; // THÊM DỊCH DANH MỤC CHO BÀI LIÊN QUAN
}

interface ApiResponseBlogDetail {
  status: string;
  data: BlogDetailData;
}

const BlogDetail: React.FC = () => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;
  const { id } = useParams<{ id: string }>();

  const [blog, setBlog] = useState<BlogDetailData | null>(null);
  const [relatedBlogs, setRelatedBlogs] = useState<RelatedBlog[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingRelated, setLoadingRelated] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // DỊCH BLOG CHI TIẾT (TITLE + CONTENT + CATEGORY NAME)
  const translateBlog = async (blogData: BlogDetailData): Promise<BlogDetailData> => {
    if (currentLang !== 'en') return blogData;

    const [translated_title, translated_cate_name] = await Promise.all([
      translateText(blogData.blog_title),
      translateText(blogData.blog_cate_name),
    ]);

    // Dịch nội dung theo đoạn
    const paragraphs = blogData.blog_content.split(/\n\s*\n/);
    const translatedParas: string[] = [];

    for (const para of paragraphs) {
      const trimmed = para.trim();
      if (trimmed) {
        const translated = await translateText(trimmed);
        translatedParas.push(translated);
      } else {
        translatedParas.push('');
      }
    }

    return {
      ...blogData,
      translated_title,
      translated_cate_name,
      translated_content: translatedParas.join('\n\n'),
    };
  };

  // DỊCH BÀI VIẾT LIÊN QUAN (TITLE + CATEGORY NAME)
  const translateRelated = async (blogs: RelatedBlog[]): Promise<RelatedBlog[]> => {
    if (currentLang !== 'en') return blogs;

    return await Promise.all(
      blogs.map(async (item) => {
        const [translated_title, translated_cate_name] = await Promise.all([
          translateText(item.blog_title),
          translateText(item.blog_cate_name),
        ]);

        return {
          ...item,
          translated_title,
          translated_cate_name,
        };
      })
    );
  };

  useEffect(() => {
    const fetchBlogDetail = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`http://localhost:3000/api/user/blogs/${id}`);
        if (!response.ok) throw new Error('Không thể tải chi tiết bài viết');

        const result: ApiResponseBlogDetail = await response.json();

        if (result.status === 'success' && result.data) {
          const translated = await translateBlog(result.data);
          setBlog(translated);
        } else {
          throw new Error('API trả về trạng thái không thành công');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi tải bài viết');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogDetail();
  }, [id, currentLang]);

  useEffect(() => {
    if (!blog) return;

    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,
      offset: 100,
    });
    AOS.refresh();

    const fetchRelatedBlogs = async () => {
      try {
        setLoadingRelated(true);

        const response = await fetch(`http://localhost:3000/api/user/blogs/blog-cate/${blog.blog_cate_id}`);
        if (!response.ok) throw new Error('Không thể tải bài viết liên quan');

        const result = await response.json();

        if (result.status === 'success' && Array.isArray(result.data)) {
          const filtered = result.data
            .filter((item: any) => item.blog_id !== blog.blog_id)
            .slice(0, 4);

          const translated = await translateRelated(filtered);
          setRelatedBlogs(translated);
        } else {
          setRelatedBlogs([]);
        }
      } catch (err) {
        console.error('Lỗi tải bài liên quan:', err);
        setRelatedBlogs([]);
      } finally {
        setLoadingRelated(false);
      }
    };

    fetchRelatedBlogs();
  }, [blog, currentLang]);

  // Re-dịch khi đổi ngôn ngữ
  useEffect(() => {
    const retranslate = async () => {
      if (blog && currentLang === 'en') {
        const updated = await translateBlog(blog);
        setBlog(updated);
      }
      if (relatedBlogs.length > 0 && currentLang === 'en') {
        const updated = await translateRelated(relatedBlogs);
        setRelatedBlogs(updated);
      }
    };

    retranslate();
  }, [currentLang]);

  useEffect(() => {
    feather.replace();
  }, [blog, relatedBlogs]);

  const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString(currentLang === 'en' ? 'en-US' : 'vi-VN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const renderContent = (content: string) => {
    return content.split('\n').map((paragraph, index) => {
      const trimmed = paragraph.trim();
      if (trimmed === '') {
        return <div key={index} className="mb-6" />;
      }
      return (
        <p key={index} className="mb-6 text-accent/90 leading-relaxed">
          {paragraph}
        </p>
      );
    });
  };

  // HÀM LẤY TITLE ĐÃ DỊCH
  const getTitle = (item: { translated_title?: string; blog_title: string }) =>
    currentLang === 'en' ? (item.translated_title || item.blog_title) : item.blog_title;

  // HÀM LẤY CATEGORY NAME ĐÃ DỊCH
  const getCateName = (item: { translated_cate_name?: string; blog_cate_name: string }) =>
    currentLang === 'en' ? (item.translated_cate_name || item.blog_cate_name) : item.blog_cate_name;

  // HÀM LẤY CONTENT ĐÃ DỊCH
  const getContent = () => {
    if (!blog) return '';
    return currentLang === 'en' ? (blog.translated_content || blog.blog_content) : blog.blog_content;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary text-accent">
        <div className="text-2xl font-orbitron">{t('ĐANG TẢI BÀI VIẾT...')}</div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary text-accent">
        <div className="text-2xl font-orbitron text-red-500">
          {error || t('Không tìm thấy bài viết')}
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center">
        <div className="absolute inset-0">
          <img
            src={blog.blog_img.startsWith('http') ? blog.blog_img : `/${blog.blog_img}`}
            srcSet={`${blog.blog_img.startsWith('http') ? blog.blog_img : `/${blog.blog_img}`} 800w,
                    ${blog.blog_img.startsWith('http') ? blog.blog_img : `/${blog.blog_img}`} 1770w`}
            sizes="(max-width: 800px) 800px, 1770px"
            alt={getTitle(blog)}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
        <div className="absolute inset-0 hero-gradient"></div>

        <div className="relative z-10 text-accent text-center px-4 max-w-4xl mx-auto" data-aos="fade-up">
          <span className="text-primary text-sm md:text-base font-semibold font-open-sans uppercase tracking-wider">
            {getCateName(blog)}
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 font-orbitron">
            {getTitle(blog)}
          </h1>
          <p className="text-lg md:text-xl font-open-sans">
            {formatDate(blog.create_at)}
          </p>
        </div>
      </section>

      {/* Main Content + Sidebar */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-secondary text-accent">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Nội dung chính */}
          <div className="lg:col-span-2 order-2 lg:order-1">
            <div className="blog-card rounded-lg overflow-hidden" data-aos="fade-up" data-aos-delay="100">
              <div className="p-6 md:p-10">
                <article className="prose prose-invert max-w-none font-open-sans leading-relaxed text-lg">
                  {renderContent(getContent())}
                </article>
              </div>

              <div className="p-6 border-t border-primary/20">
                <Link
                  to="/blog"
                  className="inline-flex items-center text-primary hover:text-primary/80 transition font-semibold font-open-sans"
                >
                  <i data-feather="arrow-left" className="mr-2 h-4 w-4"></i>
                  {t('Quay lại Blog')}
                </Link>
              </div>
            </div>
          </div>

          {/* Sidebar - Bài viết liên quan */}
          <aside className="lg:col-span-1 order-1 lg:order-2">
            <div className="sticky top-24" data-aos="fade-left" data-aos-delay="200">
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-primary/10">
                <h2 className="text-2xl font-bold font-orbitron text-primary mb-6 flex items-center">
                  <i data-feather="book-open" className="mr-3 h-6 w-6"></i>
                  {t('Bài viết liên quan')}
                </h2>

                {loadingRelated ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-32 bg-gray-800/50 rounded-lg animate-pulse"></div>
                    ))}
                  </div>
                ) : relatedBlogs.length === 0 ? (
                  <p className="text-accent/60 text-center py-8">
                    {t('Chưa có bài viết liên quan')}
                  </p>
                ) : (
                  <div className="space-y-6">
                    {relatedBlogs.map((post, index) => (
                      <Link
                        key={post.blog_id}
                        to={`/blog-detail/${post.blog_id}`}
                        className="group block transition-all duration-300 hover:transform hover:-translate-y-1"
                        data-aos="fade-up"
                        data-aos-delay={100 + index * 100}
                      >
                        <article className="flex gap-4">
                          <div className="flex-shrink-0">
                            <img
                              src={post.blog_img.startsWith('http') ? post.blog_img : `/${post.blog_img}`}
                              alt={getTitle(post)}
                              className="w-24 h-24 object-cover rounded-lg border border-primary/20 group-hover:border-primary transition"
                              loading="lazy"
                            />
                          </div>

                          <div className="flex-1">
                            <span className="text-xs text-primary/80 font-semibold uppercase tracking-wider">
                              {getCateName(post) || 'News'}
                            </span>
                            <h3 className="mt-1 text-lg font-semibold font-open-sans text-accent line-clamp-2 group-hover:text-primary transition">
                              {getTitle(post)}
                            </h3>
                            <time className="text-sm text-accent/60 mt-2 block">
                              {formatDate(post.create_at)}
                            </time>
                          </div>
                        </article>
                      </Link>
                    ))}
                  </div>
                )}

                <div className="mt-8 pt-6 border-t border-primary/20">
                  <Link
                    to="/blog"
                    className="text-primary hover:text-primary/80 font-medium text-sm flex items-center justify-center transition"
                  >
                    {t('Xem tất cả bài viết')}
                    <i data-feather="arrow-right" className="ml-2 h-4 w-4"></i>
                  </Link>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
};

export default BlogDetail;