import React from 'react';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import feather from 'feather-icons';
import './home.css';

import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { useWishlist } from '../../context/WishlistContext';
import { useTranslation } from 'react-i18next';
import { useSearch } from '../../context/SearchContext';

AOS.init({ duration: 800, easing: 'ease-in-out', once: true });

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

const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
  const fullCount = Math.floor(rating);
  const decimal = rating - fullCount;
  const partialPercent = Math.round(decimal * 100);
  const stars: React.ReactNode[] = [];

  for (let i = 0; i < 5; i++) {
    if (i < fullCount) {
      stars.push(<i key={i} data-feather="star" className="h-4 w-4 text-red-500 fill-current"></i>);
    } else if (i === fullCount && decimal > 0) {
      stars.push(
        <div key={i} className="relative h-4 w-4">
          <i data-feather="star" className="h-4 w-4 text-gray-300 absolute inset-0"></i>
          <div className="absolute inset-0 overflow-hidden" style={{ width: `${partialPercent}%` }}>
            <i data-feather="star" className="h-4 w-4 text-red-500 fill-current absolute inset-0"></i>
          </div>
        </div>
      );
    } else {
      stars.push(<i key={i} data-feather="star" className="h-4 w-4 text-gray-300"></i>);
    }
  }
  return <div className="flex items-center gap-0.5">{stars}</div>;
};

const Hero: React.FC = () => {
  const { t } = useTranslation();
  return (
    <section className="relative h-[80vh] flex items-center justify-center">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80"
          srcSet="https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80 800w, https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80 1770w"
          sizes="(max-width: 800px) 800px, 1770px"
          alt="Hình nền thiết lập chơi game"
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="absolute inset-0 hero-gradient"></div>

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto" data-aos="fade-up">
        <h1 className="text-4xl md:text-6xl max-[767px]:text-3xl max-[499px]:text-2xl font-bold mb-6 font-orbitron">
          {t("NÂNG TẦM TRÒ CHƠI CỦA BẠN")}
        </h1>
        <p className="text-xl max-[499px]:text-lg max-[374px]:text-base mb-8 font-open-sans">
          {t("Áo đấu cao cấp và thiết bị chơi game dành cho game thủ chuyên nghiệp và đội esports")}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/jerseys" className="bg-primary hover:bg-primary/90 text-white px-8 py-3 max-[499px]:px-6 max-[499px]:py-2 max-[374px]:text-sm rounded-md font-semibold transition font-orbitron">
            {t("Mua Áo Đấu")}
          </Link>
          <Link to="/shop" className="bg-transparent border-2 border-accent hover:bg-accent hover:text-secondary text-accent px-8 py-3 max-[499px]:px-6 max-[499px]:py-2 max-[374px]:text-sm rounded-md font-semibold transition font-orbitron">
            {t("Khám Phá Thiết Bị")}
          </Link>
        </div>
      </div>
    </section>
  );
};

const SearchResultsSection: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { searchResults, searchQuery, clearSearch } = useSearch();
  const { addToCart } = useCart();
  const { success, wishlistAdd, wishlistRemove } = useToast();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  React.useLayoutEffect(() => {
    feather.replace();
  }, [searchResults]);

  const maxBuying = React.useMemo(() => {
    return searchResults.length > 0
      ? Math.max(...searchResults.map(p => p.product_buying || 0))
      : 0;
  }, [searchResults]);

  if (!searchQuery || searchResults.length === 0) return null;

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12" data-aos="fade-up">
        <h2 className="text-3xl md:text-4xl max-[767px]:text-2xl max-[499px]:text-xl max-[374px]:text-lg font-bold mb-4 font-orbitron">
          {t("Kết quả tìm kiếm cho")}: "<span className="text-primary">{searchQuery}</span>"
        </h2>
        <p className="text-accent/70 max-w-2xl mx-auto font-open-sans max-[499px]:text-sm">
          {searchResults.length} {t("sản phẩm được tìm thấy")}
          <button onClick={clearSearch} className="ml-4 text-primary hover:underline font-medium">
            [{t("Xóa")}]
          </button>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-[499px]:gap-6 max-[374px]:gap-4">
        {searchResults.map((product, index) => {
          const isBestSeller = (product.product_buying || 0) === maxBuying && maxBuying > 0;
          const inWishlist = isInWishlist(product.product_id);

          return (
            <Link
              key={product.product_id}
              to={`/product-detail/${product.product_id}`}
              className="product-card bg-secondary/50 rounded-lg overflow-hidden border border-primary/20 flex flex-col block hover:shadow-xl transition-shadow"
              data-aos="fade-up"
              data-aos-delay={(index + 1) * 100}
            >
              {/* Ảnh + Badge */}
              <div className="h-64 bg-gray-800 relative flex-shrink-0">
                <img
                  src={`/public/${product.product_image}`}
                  alt={product.product_name}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  loading="lazy"
                />
                {isBestSeller && (
                  <span className="absolute top-4 left-4 bg-primary text-white text-xs px-2 py-1 rounded font-open-sans">
                    {t("BÁN CHẠY NHẤT")}
                  </span>
                )}
              </div>

              {/* Nội dung */}
              <div className="p-4 flex-1 flex flex-col">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <StarRating rating={product.product_rating || 0} />
                    <span className="text-sm text-red-500 font-semibold">
                      ({product.product_rating || '0'})
                    </span>
                  </div>
                  <h3 className="font-semibold text-lg mb-2 font-open-sans line-clamp-2">
                    {product.product_name}
                  </h3>
                </div>

                <div className="mt-auto flex items-center justify-between">
                  <span className="text-primary font-bold font-open-sans whitespace-nowrap">
                    {t("Từ")}{' '}
                    {new Intl.NumberFormat(i18n.language === 'vi' ? 'vi-VN' : 'en-US', {
                      style: 'currency',
                      currency: i18n.language === 'vi' ? 'VND' : 'USD',
                      minimumFractionDigits: 0
                    }).format(
                      i18n.language === 'vi'
                        ? product.product_price
                        : product.product_price / 24000
                    )}
                  </span>

                  <div className="flex gap-2" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        addToCart({
                          id: product.product_id,
                          name: product.product_name,
                          price: product.product_price,
                          image: `/public/${product.product_image}`,
                          cate_id: product.cate_id,
                        });
                        success?.('Thêm vào giỏ thành công!', `${product.product_name} đã được thêm vào giỏ hàng.`);
                      }}
                      className="bg-primary hover:bg-primary/90 text-white px-3 py-1 rounded text-sm transition font-orbitron"
                    >
                      <i data-feather="shopping-cart" className="h-4 w-4"></i>
                    </button>

                    <Link
                      to={`/product-detail/${product.product_id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="bg-accent/10 hover:bg-accent/20 text-primary px-3 py-1 rounded text-sm transition font-orbitron"
                    >
                      <i data-feather="eye" className="h-4 w-4"></i>
                    </Link>

                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const item = {
                          id: product.product_id,
                          name: product.product_name,
                          price: product.product_price,
                          image: `/public/${product.product_image}`,
                          description: product.product_description || undefined,
                          cate_id: product.cate_id || undefined,
                        };
                        if (inWishlist) {
                          removeFromWishlist(product.product_id);
                          wishlistRemove?.('Đã xóa khỏi yêu thích', product.product_name);
                        } else {
                          addToWishlist(item);
                          wishlistAdd?.('Đã thêm vào yêu thích', product.product_name);
                        }
                      }}
                      className={`px-3 py-1 rounded text-sm transition-all duration-300 font-orbitron flex items-center justify-center ${inWishlist
                        ? 'bg-red-600/20 text-red-600'
                        : 'bg-accent/10 hover:bg-red-600/20 text-primary hover:text-red-600'
                        }`}
                    >
                      <i
                        data-feather="heart"
                        className={`h-4 w-4 transition-all duration-300 ${inWishlist ? 'fill-red-600 text-red-600 animate-heartbeat' : ''
                          }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="text-center mt-12">
        <Link
          to="/shop"
          onClick={clearSearch}
          className="border-2 border-primary text-primary hover:bg-primary hover:text-white px-8 py-3 rounded-md font-semibold transition font-orbitron"
        >
          {t("Xem tất cả sản phẩm tại Cửa hàng")}
        </Link>
      </div>
    </section>
  );
};

const GearSection: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { addToCart } = useCart();
  const { success, wishlistAdd, wishlistRemove } = useToast();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const [products, setProducts] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchAndTranslate = async () => {
      setLoading(true);
      const res = await fetch('http://localhost:3000/api/user/products/categories/TCG-CAT-001', { cache: 'no-cache' });
      const json = await res.json();

      if (json.status === 'success') {
        let processed = json.data;

        if (i18n.language === 'en') {
          processed = await Promise.all(
            json.data.map(async (p: any) => ({
              ...p,
              product_name: await autoTranslate(p.product_name),
              product_description: p.product_description ? await autoTranslate(p.product_description) : '',
            }))
          );
        }

        setProducts(processed);
      }
      setLoading(false);
    };

    fetchAndTranslate();
  }, [i18n.language]);

  React.useLayoutEffect(() => {
    feather.replace();
  });

  const maxBuying = React.useMemo(
    () => (products.length > 0 ? Math.max(...products.map((p) => p.product_buying)) : 0),
    [products]
  );

  if (loading) return <div className="text-center py-16">{t("Đang tải thiết bị...")}</div>;

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12" data-aos="fade-up">
        <h2 className="text-3xl md:text-4xl max-[767px]:text-2xl max-[499px]:text-xl max-[374px]:text-lg font-bold mb-4 font-orbitron">{t("THIẾT BỊ CHƠI GAME")}</h2>
        <p className="text-accent/70 max-w-2xl mx-auto font-open-sans max-[499px]:text-sm">
          {t("Khám phá các phụ kiện chơi game hàng đầu để đạt hiệu suất tối ưu")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-[499px]:gap-6 max-[374px]:gap-4">
        {products.map((product, index) => {
          const isBestSeller = product.product_buying === maxBuying;
          const inWishlist = isInWishlist(product.product_id);

          return (
            <Link
              key={product.product_id}
              to={`/product-detail/${product.product_id}`}
              className="product-card bg-secondary/50 rounded-lg overflow-hidden border border-primary/20 flex flex-col block hover:shadow-xl transition-shadow"
              data-aos="fade-up"
              data-aos-delay={(index + 1) * 100}
            >
              <div className="h-64 bg-gray-800 relative flex-shrink-0">
                <img
                  src={`/public/${product.product_image}`}
                  alt={product.product_name}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  loading="lazy"
                />
                {isBestSeller && (
                  <span className="absolute top-4 left-4 bg-primary text-white text-xs px-2 py-1 rounded font-open-sans">
                    {t("BÁN CHẠY NHẤT")}
                  </span>
                )}
              </div>

              <div className="p-4 flex-1 flex flex-col">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <StarRating rating={product.product_rating} />
                    <span className="text-sm text-red-500 font-semibold">({product.product_rating})</span>
                  </div>
                  <h3 className="font-semibold text-lg mb-2 font-open-sans">{product.product_name}</h3>
                </div>

                <div className="flex items-center justify-between mt-auto">
                  <span className="text-primary font-bold font-open-sans whitespace-nowrap">
                    {t("Từ")} {new Intl.NumberFormat(i18n.language === 'vi' ? 'vi-VN' : 'en-US', {
                      style: 'currency',
                      currency: i18n.language === 'vi' ? 'VND' : 'USD',
                      minimumFractionDigits: 0
                    }).format(i18n.language === 'vi' ? product.product_price : product.product_price / 24000)}
                  </span>

                  <div className="flex gap-2" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        addToCart({
                          id: product.product_id,
                          name: product.product_name,
                          price: product.product_price,
                          image: `/public/${product.product_image}`,
                          cate_id: product.cate_id,
                        });
                        success?.('Thêm vào giỏ hàng thành công!', `${product.product_name} đã được thêm vào giỏ hàng của bạn.`);
                      }}
                      className="bg-primary hover:bg-primary/90 text-white px-3 py-1 rounded text-sm transition font-orbitron"
                    >
                      <i data-feather="shopping-cart" className="h-4 w-4"></i>
                    </button>

                    <Link
                      to={`/product-detail/${product.product_id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="bg-accent/10 hover:bg-accent/20 text-primary px-3 py-1 rounded text-sm transition font-orbitron"
                    >
                      <i data-feather="eye" className="h-4 w-4"></i>
                    </Link>

                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const wishlistItem = {
                          id: product.product_id,
                          name: product.product_name,
                          price: product.product_price,
                          image: `/public/${product.product_image}`,
                          description: product.product_description || undefined,
                          cate_id: product.cate_id || undefined,
                        };

                        if (inWishlist) {
                          removeFromWishlist(product.product_id);
                          wishlistRemove?.('Đã xóa khỏi danh sách yêu thích', product.product_name);
                        } else {
                          addToWishlist(wishlistItem);
                          wishlistAdd?.('Đã thêm vào danh sách yêu thích', product.product_name);
                        }
                      }}
                      className={`px-3 py-1 rounded text-sm transition-all duration-300 font-orbitron flex items-center justify-center ${inWishlist
                        ? 'bg-red-600/20 text-red-600'
                        : 'bg-accent/10 hover:bg-red-600/20 text-primary hover:text-red-600'
                        }`}
                    >
                      <i
                        data-feather="heart"
                        className={`h-4 w-4 transition-all duration-300 ${inWishlist
                          ? 'fill-red-600 text-red-600 animate-heartbeat'
                          : 'text-primary hover:fill-red-600 hover:text-red-600'
                          }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="text-center mt-12">
        <Link to="/shop" className="border-2 border-primary text-primary hover:bg-primary hover:text-white px-8 py-3 rounded-md font-semibold transition font-orbitron">
          {t("Khám phá THIẾT BỊ")}
        </Link>
      </div>
    </section>
  );
};

const JerseysSection: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { addToCart } = useCart();
  const { success, wishlistAdd, wishlistRemove } = useToast();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const [products, setProducts] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchAndTranslate = async () => {
      setLoading(true);
      const res = await fetch('http://localhost:3000/api/user/products/categories/TCG-CAT-002', { cache: 'no-cache' });
      const json = await res.json();

      if (json.status === 'success') {
        let processed = json.data;

        if (i18n.language === 'en') {
          processed = await Promise.all(
            json.data.map(async (p: any) => ({
              ...p,
              product_name: await autoTranslate(p.product_name),
              product_description: p.product_description ? await autoTranslate(p.product_description) : '',
            }))
          );
        }

        setProducts(processed);
      }
      setLoading(false);
    };

    fetchAndTranslate();
  }, [i18n.language]);

  React.useLayoutEffect(() => {
    feather.replace();
  });

  const maxBuying = React.useMemo(
    () => (products.length > 0 ? Math.max(...products.map((p) => p.product_buying)) : 0),
    [products]
  );

  if (loading) return <div className="text-center py-16">{t("Đang tải áo đấu...")}</div>;

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12" data-aos="fade-up">
        <h2 className="text-3xl md:text-4xl max-[767px]:text-2xl max-[499px]:text-xl max-[374px]:text-lg font-bold mb-4 font-orbitron">{t("ÁO ĐẤU ESPORTS")}</h2>
        <p className="text-accent/70 max-w-2xl mx-auto font-open-sans max-[499px]:text-sm">
          {t("Khám phá áo đấu esports cao cấp để thể hiện tinh thần Đội tuyển")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-[499px]:gap-6 max-[374px]:gap-4">
        {products.map((product, index) => {
          const isBestSeller = product.product_buying === maxBuying;
          const inWishlist = isInWishlist(product.product_id);

          return (
            <Link
              key={product.product_id}
              to={`/product-detail/${product.product_id}`}
              className="product-card bg-secondary/50 rounded-lg overflow-hidden border border-primary/20 flex flex-col block hover:shadow-xl transition-shadow"
              data-aos="fade-up"
              data-aos-delay={(index + 1) * 100}
            >
              <div className="h-64 bg-gray-800 relative flex-shrink-0">
                <img
                  src={`/public/${product.product_image}`}
                  alt={product.product_name}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  loading="lazy"
                />
                {isBestSeller && (
                  <span className="absolute top-4 left-4 bg-primary text-white text-xs px-2 py-1 rounded font-open-sans">
                    {t("BÁN CHẠY NHẤT")}
                  </span>
                )}
              </div>

              <div className="p-4 flex-1 flex flex-col">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <StarRating rating={product.product_rating} />
                    <span className="text-sm text-red-500 font-semibold">({product.product_rating})</span>
                  </div>
                  <h3 className="font-semibold text-lg mb-2 font-open-sans">{product.product_name}</h3>
                </div>

                <div className="flex items-center justify-between mt-auto">
                  <span className="text-primary font-bold font-open-sans whitespace-nowrap">
                    {t("Từ")} {new Intl.NumberFormat(i18n.language === 'vi' ? 'vi-VN' : 'en-US', {
                      style: 'currency',
                      currency: i18n.language === 'vi' ? 'VND' : 'USD',
                      minimumFractionDigits: 0
                    }).format(
                      i18n.language === 'vi'
                        ? product.product_price
                        : product.product_price / 24000
                    )}
                  </span>

                  <div className="flex gap-2" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        addToCart({
                          id: product.product_id,
                          name: product.product_name,
                          price: product.product_price,
                          image: `/public/${product.product_image}`,
                          cate_id: product.cate_id,
                        });
                        success?.('Thêm vào giỏ hàng thành công!', `${product.product_name} đã được thêm vào giỏ hàng của bạn.`);
                      }}
                      className="bg-primary hover:bg-primary/90 text-white px-3 py-1 rounded text-sm transition font-orbitron"
                    >
                      <i data-feather="shopping-cart" className="h-4 w-4"></i>
                    </button>

                    <Link
                      to={`/product-detail/${product.product_id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="bg-accent/10 hover:bg-accent/20 text-primary px-3 py-1 rounded text-sm transition font-orbitron"
                    >
                      <i data-feather="eye" className="h-4 w-4"></i>
                    </Link>

                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const wishlistItem = {
                          id: product.product_id,
                          name: product.product_name,
                          price: product.product_price,
                          image: `/public/${product.product_image}`,
                          description: product.product_description || undefined,
                          cate_id: product.cate_id || undefined,
                        };

                        if (inWishlist) {
                          removeFromWishlist(product.product_id);
                          wishlistRemove?.('Đã xóa khỏi danh sách yêu thích', product.product_name);
                        } else {
                          addToWishlist(wishlistItem);
                          wishlistAdd?.('Đã thêm vào danh sách yêu thích', product.product_name);
                        }
                      }}
                      className={`px-3 py-1 rounded text-sm transition-all duration-300 font-orbitron flex items-center justify-center ${inWishlist
                        ? 'bg-red-600/20 text-red-600'
                        : 'bg-accent/10 hover:bg-red-600/20 text-primary hover:text-red-600'
                        }`}
                    >
                      <i
                        data-feather="heart"
                        className={`h-4 w-4 transition-all duration-300 ${inWishlist
                          ? 'fill-red-600 text-red-600 animate-heartbeat'
                          : 'text-primary hover:fill-red-600 hover:text-red-600'
                          }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="text-center mt-12">
        <Link to="/shop" className="border-2 border-primary text-primary hover:bg-primary hover:text-white px-8 py-3 rounded-md font-semibold transition font-orbitron">
          {t("Khám phá ÁO ĐẤU")}
        </Link>
      </div>
    </section>
  );
};

const PartnersSection: React.FC = () => {
  const { t } = useTranslation();
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const slides = [
    [
      { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/T1_esports_logo.svg/3840px-T1_esports_logo.svg.png", alt: "Logo T1" },
      { src: "https://i0.wp.com/apeks.gg/wp-content/uploads/2025/02/Samsung_white_Nett-logo.png?fit=800%2C256&ssl=1", alt: "Logo Samsung Odyssey" },
      { src: "https://www.thefpsreview.com/wp-content/uploads/2020/10/Secret-Lab-Logo_white.png", alt: "Logo SecretLab" },
    ],
    [
      { src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSzFLosX5arLETcvYzEdWTbzyoR2wqAbuCrjKfdhONLgumj0CkW1sJA7nI&s=10", alt: "Logo Razer" },
      { src: "https://pbs.twimg.com/media/Eq2BnfMUcAIx05W.png", alt: "Logo LCK" },
      { src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSmzGgBZge__5uE6LYwIcdoFR-Zk3NmnLKjcbN521m95ucuQ7B9KoRVdpLF&s=10", alt: "Logo LPL" },
    ],
  ];

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12" data-aos="fade-up">
        <h2 className="text-3xl md:text-4xl max-[767px]:text-2xl max-[499px]:text-xl max-[374px]:text-lg font-bold mb-4 font-orbitron">{t("ĐỐI TÁC CỦA CHÚNG TÔI")}</h2>
        <p className="text-accent/70 max-w-2xl mx-auto font-open-sans max-[499px]:text-sm">
          {t("Tự hào hợp tác với các thương hiệu và tổ chức hàng đầu trong lĩnh vực esports")}
        </p>
      </div>

      <div className="partner-slider relative overflow-hidden" data-aos="fade-up">
        <div className="partner-slides flex transition-transform duration-700 ease-in-out" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
          {slides.map((group, i) => (
            <div key={i} className="partner-slide flex justify-center items-center gap-8 min-w-full">
              {group.map((partner, index) => (
                <div key={index} className="flex justify-center items-center w-1/3">
                  <img src={partner.src} alt={partner.alt} loading="lazy" className="h-24 object-contain" />
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="slider-dots flex justify-center gap-2 mt-6">
          {slides.map((_, index) => (
            <div key={index} className={`slider-dot w-3 h-3 rounded-full cursor-pointer transition ${index === currentSlide ? "bg-primary" : "bg-gray-400"}`} onClick={() => setCurrentSlide(index)} />
          ))}
        </div>
      </div>
    </section>
  );
};

const ReviewsSection: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [reviews, setReviews] = React.useState<any[]>([]);

  React.useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/ratings/gamers");
        const json = await res.json();
        if (json.status === "success") {
          let processed = json.data;
          // Áp dụng dịch tự động nếu đổi sang tiếng Anh
          if (i18n.language === 'en') {
            processed = await Promise.all(
              json.data.map(async (r: any) => ({
                ...r,
                comment: await autoTranslate(r.comment)
              }))
            );
          }
          setReviews(processed);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchReviews();
  }, [i18n.language]); // Gọi lại khi đổi ngôn ngữ để autoTranslate chạy

  React.useLayoutEffect(() => {
    feather.replace();
  }, [reviews]);

  if (reviews.length === 0) return null;

  return (
    <section className="py-16 bg-black px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12" data-aos="fade-up">
          <h2 className="text-3xl md:text-4xl max-[767px]:text-2xl max-[499px]:text-xl max-[374px]:text-lg font-bold mb-4 font-orbitron">
            {t("ĐÁNH GIÁ TỪ GAME THỦ")}
          </h2>
          <p className="text-accent/70 max-w-2xl mx-auto font-open-sans max-[499px]:text-sm">
            {t("Lắng nghe ý kiến từ các game thủ esports hàng đầu về")} <span className="font-orbitron">TCGear</span>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-[499px]:gap-6 max-[374px]:gap-4">
          {reviews.slice(0, 3).map((review, index) => (
            <div
              key={review.rating_id}
              className="bg-secondary/50 rounded-lg overflow-hidden border border-primary/20"
              data-aos={index === 0 ? "fade-right" : index === 1 ? "fade-up" : "fade-left"}
            >
              <div className="h-24 bg-gray-800 flex items-center justify-center">
                <img
                  src={review.avatar || 'img/fanT1.jpg'}
                  alt={review.name}
                  className="w-24 h-24 rounded-full object-cover mx-auto"
                  loading="lazy"
                />
              </div>
              <div className="p-4 text-center">
                <h3 className="font-semibold text-lg mb-2 font-open-sans">{review.name}</h3>
                <div className="flex justify-center gap-1 mb-2">
                  {[...Array(review.rating || 5)].map((_, i) => (
                    <i key={i} data-feather="star" className="h-5 w-5 text-red-500 fill-current"></i>
                  ))}
                </div>
                <p className="text-accent/70 font-open-sans">"{review.comment}"</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Home: React.FC = () => {
  const { searchResults } = useSearch();

  React.useLayoutEffect(() => {
    feather.replace();
  }, []);

  return (
    <div className="bg-secondary text-accent">
      <Hero />

      <SearchResultsSection />

      {searchResults.length === 0 && (
        <>
          <GearSection />
          <JerseysSection />
          <PartnersSection />
          <ReviewsSection />
        </>
      )}
    </div>
  );
};

export default Home;