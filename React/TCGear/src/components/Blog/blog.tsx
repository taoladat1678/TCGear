import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import feather from 'feather-icons';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './blog.css';
import { useTranslation } from 'react-i18next';

// HÀM DỊCH ĐẶT TRỰC TIẾP TRONG FILE
const translateText = async (text: string): Promise<string> => {
  if (!text.trim()) return text;

  // Delay 400ms để tránh bị Google block
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
interface Blog {
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
  translated_cate_name?: string;
}

interface BlogCategory {
  blog_cate_id: string;
  blog_cate_name: string;
  total_blogs: number;

  translated_cate_name?: string;
}

interface ApiResponseBlogs {
  status: string;
  data: Blog[];
}

interface ApiResponseCategories {
  status: string;
  data: BlogCategory[];
}

const Blog: React.FC = () => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;

  const [allBlogs, setAllBlogs] = useState<Blog[]>([]);
  const [displayedBlogs, setDisplayedBlogs] = useState<Blog[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<BlogCategory | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 2;

  // DỊCH BLOG (TITLE + CONTENT + CATEGORY NAME)
  const translateBlogs = async (blogs: Blog[]): Promise<Blog[]> => {
    if (currentLang !== 'en') return blogs;

    return await Promise.all(
      blogs.map(async (blog) => {
        const [translated_title, translated_cate_name, translated_short] = await Promise.all([
          translateText(blog.blog_title),
          translateText(blog.blog_cate_name),
          translateText(blog.blog_content.slice(0, 500)),
        ]);

        return {
          ...blog,
          translated_title,
          translated_cate_name,
          translated_content: translated_short + (blog.blog_content.length > 500 ? '...' : ''),
        };
      })
    );
  };

  // DỊCH DANH SÁCH DANH MỤC
  const translateCategories = async (cats: BlogCategory[]): Promise<BlogCategory[]> => {
    if (currentLang !== 'en') return cats;

    return await Promise.all(
      cats.map(async (cat) => ({
        ...cat,
        translated_cate_name: await translateText(cat.blog_cate_name),
      }))
    );
  };

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-out',
      once: true,
      mirror: false,
      offset: 120,
      delay: 0,
    });

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [blogsResponse, categoriesResponse] = await Promise.all([
          fetch('http://localhost:3000/api/user/blogs'),
          fetch('http://localhost:3000/api/user/blog-categories'),
        ]);

        if (!blogsResponse.ok) throw new Error(t('Không thể tải danh sách blog') || 'Không thể tải danh sách blog');
        if (!categoriesResponse.ok) throw new Error(t('Không thể tải danh mục blog') || 'Không thể tải danh mục blog');

        const blogsResult: ApiResponseBlogs = await blogsResponse.json();
        const categoriesResult: ApiResponseCategories = await categoriesResponse.json();

        if (blogsResult.status === 'success' && categoriesResult.status === 'success') {
          const sortedBlogs = [...blogsResult.data].sort(
            (a, b) => new Date(b.create_at).getTime() - new Date(a.create_at).getTime()
          );

          const [processedBlogs, processedCategories] = await Promise.all([
            translateBlogs(sortedBlogs),
            translateCategories(categoriesResult.data),
          ]);

          setAllBlogs(processedBlogs);
          setCategories(processedCategories);

          const cateIdFromUrl = searchParams.get('cate');
          if (cateIdFromUrl) {
            const category = processedCategories.find(c => c.blog_cate_id === cateIdFromUrl);
            if (category) {
              setSelectedCategory(category);
              const res = await fetch(`http://localhost:3000/api/user/blogs/blog-cate/${cateIdFromUrl}`);
              if (!res.ok) throw new Error('Không thể tải bài viết theo danh mục');
              const result: ApiResponseBlogs = await res.json();
              if (result.status === 'success') {
                const sorted = [...result.data].sort(
                  (a, b) => new Date(b.create_at).getTime() - new Date(a.create_at).getTime()
                );
                const translatedFiltered = await translateBlogs(sorted);
                setDisplayedBlogs(translatedFiltered);
                return;
              }
            } else {
              setDisplayedBlogs(processedBlogs);
            }
          } else {
            setDisplayedBlogs(processedBlogs);
          }
        } else {
          throw new Error('API trả về trạng thái không thành công');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchParams, currentLang]);

  useEffect(() => {
    if (!loading) AOS.refresh();
  }, [loading]);

  useEffect(() => {
    feather.replace();
  }, [displayedBlogs]);

  // Re-dịch khi đổi ngôn ngữ
  useEffect(() => {
    const retranslate = async () => {
      if (allBlogs.length > 0) {
        const newAll = await translateBlogs(allBlogs);
        setAllBlogs(newAll);
        const newDisplayed = await translateBlogs(displayedBlogs);
        setDisplayedBlogs(newDisplayed);
      }
      if (categories.length > 0) {
        const newCats = await translateCategories(categories);
        setCategories(newCats);
      }
    };

    if (currentLang === 'en') {
      retranslate();
    }
  }, [currentLang]);

  const handleCategoryClick = async (category: BlogCategory) => {
    if (selectedCategory?.blog_cate_id === category.blog_cate_id) {
      setSelectedCategory(null);
      setDisplayedBlogs(await translateBlogs(allBlogs));
      setCurrentPage(1);
      searchParams.delete('cate');
      setSearchParams(searchParams);
      return;
    }

    setSelectedCategory(category);
    setCurrentPage(1);

    searchParams.set('cate', category.blog_cate_id);
    setSearchParams(searchParams);

    try {
      const res = await fetch(`http://localhost:3000/api/user/blogs/blog-cate/${category.blog_cate_id}`);
      if (!res.ok) throw new Error('Không thể tải bài viết theo danh mục');

      const result: ApiResponseBlogs = await res.json();
      if (result.status === 'success') {
        const sorted = [...result.data].sort(
          (a, b) => new Date(b.create_at).getTime() - new Date(a.create_at).getTime()
        );
        const translated = await translateBlogs(sorted);
        setDisplayedBlogs(translated);
      }
    } catch (err) {
      console.error(err);
      setError('Không thể tải bài viết theo danh mục');
    }
  };

  const clearFilter = async () => {
    setSelectedCategory(null);
    setDisplayedBlogs(await translateBlogs(allBlogs));
    setCurrentPage(1);
    searchParams.delete('cate');
    setSearchParams(searchParams);
  };

  const featuredBlog = displayedBlogs[0];
  const regularBlogs = displayedBlogs.slice(1);

  const totalPages = Math.ceil(regularBlogs.length / blogsPerPage);
  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = regularBlogs.slice(indexOfFirstBlog, indexOfLastBlog);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString(currentLang === 'en' ? 'en-US' : 'vi-VN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const getBlogTitle = (blog: Blog) => currentLang === 'en' ? (blog.translated_title || blog.blog_title) : blog.blog_title;
  const getBlogContent = (blog: Blog) => currentLang === 'en' ? (blog.translated_content || blog.blog_content) : blog.blog_content;
  const getCateName = (item: Blog | BlogCategory) => currentLang === 'en' ? (item.translated_cate_name || item.blog_cate_name) : item.blog_cate_name;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary text-accent">
        <div className="text-2xl font-orbitron">{t('ĐANG TẢI BLOG...')}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary text-accent">
        <div className="text-2xl font-orbitron text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-secondary text-accent">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80"
            srcSet="https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80 800w,
                    https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80 1770w"
            sizes="(max-width: 800px) 800px, 1770px"
            alt="Bối cảnh thiết lập chơi game"
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
        <div className="absolute inset-0 hero-gradient"></div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto" data-aos="fade-up">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 font-orbitron">
            {t('BLOG TCGEAR')}
          </h1>
          <p className="text-lg md:text-xl mb-8 font-open-sans">
            {t('Tin tức esports mới nhất, đánh giá thiết bị và thông tin chi tiết về game cạnh tranh')}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left - Main Content */}
          <div className="lg:col-span-3">
            {/* Featured Blog */}
            {featuredBlog && (
              <>
                <h2 className="text-3xl md:text-4xl font-bold mb-8 font-orbitron">
                  {selectedCategory
                    ? `${t('Bài viết mới nhất thuộc danh mục')} ${getCateName(selectedCategory)}`
                    : t('Bài viết mới nhất')}
                </h2>
                <Link
                  to={`/blog-detail/${featuredBlog.blog_id}`}
                  className="blog-card rounded-lg overflow-hidden block hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  data-aos="fade-up"
                >
                  <div className="h-[500px] md:h-[600px] overflow-hidden">
                    <img
                      src={featuredBlog.blog_img.startsWith('http') ? featuredBlog.blog_img : `/${featuredBlog.blog_img}`}
                      alt={getBlogTitle(featuredBlog)}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <span className="text-primary text-sm font-semibold font-open-sans">
                        {getCateName(featuredBlog).toUpperCase()}
                      </span>
                      <span className="text-accent/50 text-sm font-open-sans">
                        {formatDate(featuredBlog.create_at)}
                      </span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold mb-4 font-orbitron">
                      {getBlogTitle(featuredBlog)}
                    </h2>
                    <p className="text-accent/70 mb-6 text-sm md:text-base font-open-sans line-clamp-3">
                      {getBlogContent(featuredBlog)}
                    </p>
                    <span className="inline-flex items-center text-primary hover:text-primary/80 transition font-semibold font-open-sans">
                      {t('Đọc Thêm')}
                      <i data-feather="arrow-right" className="ml-2 h-4 w-4"></i>
                    </span>
                  </div>
                </Link>
              </>
            )}

            {/* Regular Blogs */}
            {regularBlogs.length > 0 && (
              <>
                <h2 className="text-3xl md:text-4xl font-bold mt-16 mb-8 font-orbitron">
                  {selectedCategory
                    ? `${t('Các bài viết thuộc danh mục')} ${getCateName(selectedCategory)}`
                    : t('Tất cả bài viết')}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {currentBlogs.map((blog, index) => (
                    <Link
                      key={blog.blog_id}
                      to={`/blog-detail/${blog.blog_id}`}
                      className="blog-card rounded-lg overflow-hidden block hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                      data-aos="fade-up"
                      data-aos-delay={`${index * 100}`}
                    >
                      <div className="h-64 md:h-72 overflow-hidden">
                        <img
                          src={blog.blog_img.startsWith('http') ? blog.blog_img : `/${blog.blog_img}`}
                          alt={getBlogTitle(blog)}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                          loading="lazy"
                        />
                      </div>
                      <div className="p-6">
                        <div className="flex items-center gap-4 mb-4">
                          <span className="text-primary text-sm font-semibold font-open-sans">
                            {getCateName(blog).toUpperCase()}
                          </span>
                          <span className="text-accent/50 text-sm font-open-sans">
                            {formatDate(blog.create_at)}
                          </span>
                        </div>
                        <h3 className="text-xl md:text-2xl font-bold mb-3 font-orbitron">
                          {getBlogTitle(blog)}
                        </h3>
                        <p className="text-accent/70 mb-4 text-sm md:text-base font-open-sans line-clamp-3">
                          {getBlogContent(blog)}
                        </p>
                        <span className="inline-flex items-center text-primary hover:text-primary/80 transition font-semibold font-open-sans">
                          {t('Đọc Thêm')}
                          <i data-feather="arrow-right" className="ml-2 h-4 w-4"></i>
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="pagination mt-12 flex justify-center items-center gap-3" data-aos="fade-up">
                    <div
                      className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}
                      onClick={() => currentPage > 1 && paginate(currentPage - 1)}
                    >
                      <i data-feather="chevron-left" className="h-4 w-4"></i>
                    </div>

                    {Array.from({ length: totalPages }, (_, i) => (
                      <div
                        key={i + 1}
                        className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}
                        onClick={() => paginate(i + 1)}
                      >
                        {i + 1}
                      </div>
                    ))}

                    <div
                      className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}
                      onClick={() => currentPage < totalPages && paginate(currentPage + 1)}
                    >
                      <i data-feather="chevron-right" className="h-4 w-4"></i>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 sidebar-section">
            <div className="bg-secondary/50 rounded-lg border border-primary/20 p-6 mb-8" data-aos="fade-left">
              <h3 className="font-bold text-lg md:text-xl mb-4 font-orbitron">{t('DANH MỤC')}</h3>
              <ul className="space-y-3">
                {categories.map((category) => (
                  <li key={category.blog_cate_id}>
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handleCategoryClick(category);
                      }}
                      className={`text-accent/70 hover:text-primary transition sidebar-link flex justify-between text-sm md:text-base font-open-sans ${
                        selectedCategory?.blog_cate_id === category.blog_cate_id ? 'text-primary font-semibold' : ''
                      }`}
                    >
                      <span>{getCateName(category)}</span>
                      <span className="text-primary">{category.total_blogs}</span>
                    </a>
                  </li>
                ))}
              </ul>

              <button
                onClick={clearFilter}
                className="mt-6 w-full px-5 py-3 bg-red-600/30 hover:bg-red-600/50 text-red-300 hover:text-red-200 rounded-md transition text-sm font-semibold flex items-center justify-center gap-2"
              >
                <i data-feather="x" className="h-5 w-5"></i>
                {t('Xóa bộ lọc danh mục')}
              </button>
            </div>

            <div className="bg-secondary/50 rounded-lg border border-primary/20 p-6 mb-8" data-aos="fade-left" data-aos-delay="100">
              <h3 className="font-bold text-lg md:text-xl mb-4 font-orbitron">{t('BÀI VIẾT GẦN ĐÂY')}</h3>
              <ul className="space-y-4">
                {displayedBlogs.slice(0, 3).map((blog) => (
                  <li key={blog.blog_id}>
                    <Link to={`/blog-detail/${blog.blog_id}`} className="flex gap-3 group">
                      <div className="w-12 h-12 flex-shrink-0">
                        <img
                          src={blog.blog_img.startsWith('http') ? blog.blog_img : `/${blog.blog_img}`}
                          alt={getBlogTitle(blog)}
                          className="w-full h-full object-cover rounded-md"
                        />
                      </div>
                      <div>
                        <h4 className="font-semibold group-hover:text-primary transition text-sm md:text-base font-open-sans line-clamp-2">
                          {getBlogTitle(blog)}
                        </h4>
                        <p className="text-accent/50 text-xs md:text-sm font-open-sans">
                          {formatDate(blog.create_at)}
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blog;