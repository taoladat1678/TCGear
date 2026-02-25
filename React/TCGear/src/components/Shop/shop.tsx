import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './shop.css';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useToast } from '../../context/ToastContext';
import { useTranslation } from 'react-i18next';
import { useSearch } from '../../context/SearchContext';

AOS.init({ duration: 800, once: true });

const autoTranslate = async (text: string): Promise<string> => {
  if (!text || text.trim() === '') return text;
  const cacheKey = `trans_shop_${text}`;
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

interface Product {
  product_id: string;
  product_name: string;
  product_description?: string;
  product_image: string;
  product_price: number;
  product_rating: number;
  product_buying: number;
  create_at: string;
  update_at: string;
  cate_id: string;
}

interface Category {
  cate_id: string;
  cate_name: string;
}

interface SubCategory {
  sc_id: string;
  sc_name: string;
  sc_image: string;
  cate_id: string;
}

interface Brand {
  brand_id: string;
  brand_name: string;
  brand_image: string;
}

const Shop: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { success, wishlistAdd, wishlistRemove } = useToast();
  const { searchResults, searchQuery, clearSearch } = useSearch();

  const [products, setProducts] = useState<Product[]>([]);
  const [filteredAndSortedProducts, setFilteredAndSortedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<Record<string, SubCategory[]>>({});
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  const [brands, setBrands] = useState<Brand[]>([]);
  const [loadingBrands, setLoadingBrands] = useState(true);

  const [selectedBrandId, setSelectedBrandId] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState<string | null>(null);

  const [minPriceDisplay, setMinPriceDisplay] = useState<string>('');
  const [maxPriceDisplay, setMaxPriceDisplay] = useState<string>('');

  const [selectedRating, setSelectedRating] = useState<string | null>(null);

  const [sortOption, setSortOption] = useState<string>('featured');

  const productsPerPage = 3;
  const PAGE_STORAGE_KEY = 'shop_current_page';
  const productsGridRef = useRef<HTMLDivElement>(null);

  const [currentPage, setCurrentPage] = useState(() => {
    const saved = localStorage.getItem(PAGE_STORAGE_KEY);
    const page = saved ? parseInt(saved, 10) : 1;
    return isNaN(page) || page < 1 ? 1 : page;
  });

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const openFilter = () => setIsFilterOpen(true);
  const closeFilter = () => setIsFilterOpen(false);

  useEffect(() => {
    localStorage.setItem(PAGE_STORAGE_KEY, currentPage.toString());
  }, [currentPage]);

  const sortProducts = (productsToSort: Product[]): Product[] => {
    const sorted = [...productsToSort];
    switch (sortOption) {
      case 'price-low':
        return sorted.sort((a, b) => a.product_price - b.product_price);
      case 'price-high':
        return sorted.sort((a, b) => b.product_price - a.product_price);
      case 'name':
        return sorted.sort((a, b) => a.product_name.localeCompare(b.product_name));
      case 'newest':
        return sorted.sort((a, b) => new Date(b.update_at || b.create_at).getTime() - new Date(a.update_at || a.create_at).getTime());
      case 'bestselling':
        return sorted.sort((a, b) => (b.product_buying || 0) - (a.product_buying || 0));
      case 'featured':
      default:
        return sorted.sort((a, b) => {
          const getScore = (p: Product) => {
            const isHot = p.product_buying > 150 ? 1000 : 0;
            const isNewProduct = new Date(p.update_at || p.create_at).getTime() > Date.now() - 30 * 24 * 60 * 60 * 1000 ? 500 : 0;
            return isHot + isNewProduct + (p.product_buying || 0) + p.product_rating * 10;
          };
          return getScore(b) - getScore(a);
        });
    }
  };

  useEffect(() => {
    setFilteredAndSortedProducts(sortProducts(products));
    setCurrentPage(1);
  }, [products, sortOption]);

  const totalPages = Math.ceil(filteredAndSortedProducts.length / productsPerPage) || 1;
  const currentProducts = filteredAndSortedProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );
  const startItem = (currentPage - 1) * productsPerPage + 1;
  const endItem = Math.min(currentPage * productsPerPage, filteredAndSortedProducts.length);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    setCurrentPage(page);
    productsGridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleRatingChange = (value: string) => {
    setSelectedRating(prev => (prev === value ? null : value));
  };

  const fetchProducts = async (applyPrice: boolean = false) => {
    setLoading(true);
    try {
      let minPrice = 0;
      let maxPrice = 999999999;

      if (applyPrice) {
        const minRaw = minPriceDisplay.replace(/\D/g, '');
        const maxRaw = maxPriceDisplay.replace(/\D/g, '');
        minPrice = minRaw === '' ? 0 : parseInt(minRaw, 10);
        maxPrice = maxRaw === '' ? 999999999 : parseInt(maxRaw, 10);
        if (minPrice > maxPrice) [minPrice, maxPrice] = [maxPrice, minPrice];
      }

      let url = 'http://localhost:3000/api/user/products';
      let needClientPriceFilter = false;

      if (selectedRating) {
        let ratingType: string = '';
        if (selectedRating === '5') ratingType = '5';
        else if (selectedRating === '4-5') ratingType = '4plus';
        else if (selectedRating === '3-4') ratingType = '3plus';
        else if (selectedRating === '1-2') ratingType = '1-2';

        url = `http://localhost:3000/api/user/products/rating/${ratingType}`;
        needClientPriceFilter = applyPrice;
      } else if (selectedBrandId) {
        url = `http://localhost:3000/api/user/products/brands/${selectedBrandId}`;
        needClientPriceFilter = applyPrice;
      } else if (selectedSubCategoryId && selectedCategoryId) {
        url = applyPrice
          ? `http://localhost:3000/api/user/pbc/${selectedCategoryId}/${selectedSubCategoryId}/price/${minPrice}/${maxPrice}`
          : `http://localhost:3000/api/user/pbc/${selectedCategoryId}/${selectedSubCategoryId}`;
      } else if (selectedCategoryId) {
        url = applyPrice
          ? `http://localhost:3000/api/user/products/categories/${selectedCategoryId}/price/${minPrice}/${maxPrice}`
          : `http://localhost:3000/api/user/products/categories/${selectedCategoryId}`;
      } else if (applyPrice) {
        url = `http://localhost:3000/api/user/products/price-range/${minPrice}/${maxPrice}`;
      }

      const res = await fetch(url, { cache: 'no-cache' });
      const json = await res.json();

      if (json.status === 'success') {
        let data = json.data || [];

        if (needClientPriceFilter) {
          data = data.filter((p: Product) => p.product_price >= minPrice && p.product_price <= maxPrice);
        }

        if (i18n.language === 'en') {
          data = await Promise.all(
            data.map(async (p: any) => ({
              ...p,
              product_name: await autoTranslate(p.product_name),
            }))
          );
        }

        setProducts(data);
        setCurrentPage(1);
      } else {
        setProducts([]);
      }
    } catch (err) {
      console.error('Fetch products error:', err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(false);
  }, [selectedCategoryId, selectedSubCategoryId, selectedBrandId, selectedRating, i18n.language]);

  const handleApplyPrice = () => {
    fetchProducts(true);
  };

  const handleCategoryChange = (cateId: string) => {
    if (selectedCategoryId === cateId && !selectedSubCategoryId) {
      setSelectedCategoryId(null);
      setSelectedSubCategoryId(null);
    } else {
      setSelectedCategoryId(cateId);
      setSelectedSubCategoryId(null);
    }
    setMinPriceDisplay('');
    setMaxPriceDisplay('');
  };

  const handleSubCategoryChange = (subCateId: string, cateId: string) => {
    if (selectedSubCategoryId === subCateId) {
      setSelectedSubCategoryId(null);
    } else {
      setSelectedSubCategoryId(subCateId);
      setSelectedCategoryId(cateId);
    }
    setMinPriceDisplay('');
    setMaxPriceDisplay('');
  };

  const handleBrandChange = (brandId: string | null) => {
    setSelectedBrandId(brandId);
    setMinPriceDisplay('');
    setMaxPriceDisplay('');
  };

  const clearAllFilters = () => {
    setSelectedCategoryId(null);
    setSelectedSubCategoryId(null);
    setSelectedBrandId(null);
    setSelectedRating(null);
    setMinPriceDisplay('');
    setMaxPriceDisplay('');
    setSortOption('featured');
    setCurrentPage(1);
    fetchProducts(false);
  };

  const hasActiveFilter =
    selectedCategoryId ||
    selectedSubCategoryId ||
    selectedBrandId ||
    selectedRating ||
    minPriceDisplay ||
    maxPriceDisplay ||
    sortOption !== 'featured';

  useEffect(() => {
    const fetchCategoriesData = async () => {
      setLoadingCategories(true);
      try {
        const catRes = await fetch('http://localhost:3000/api/user/categories');
        const catJson = await catRes.json();
        if (catJson.status !== 'success') return;

        let cats: Category[] = catJson.data;
        if (i18n.language === 'en') {
          cats = await Promise.all(cats.map(async (c: Category) => ({
            ...c,
            cate_name: await autoTranslate(c.cate_name),
          })));
        }
        setCategories(cats);

        const subPromises = cats.map(cat =>
          fetch(`http://localhost:3000/api/user/sub-categories/${cat.cate_id}`)
            .then(r => r.json())
            .then(json => ({ cate_id: cat.cate_id, data: json.status === 'success' ? json.data : [] }))
            .catch(() => ({ cate_id: cat.cate_id, data: [] }))
        );

        const subResults = await Promise.all(subPromises);
        const subMap: Record<string, SubCategory[]> = {};

        for (const result of subResults) {
          let subs = result.data;
          if (i18n.language === 'en') {
            subs = await Promise.all(subs.map(async (s: SubCategory) => ({
              ...s,
              sc_name: await autoTranslate(s.sc_name),
            })));
          }
          subMap[result.cate_id] = subs;
        }

        setSubCategories(subMap);
        setExpandedCategories(new Set(cats.map(c => c.cate_id)));
      } catch (err) {
        console.error('Error loading categories:', err);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategoriesData();
  }, [i18n.language]);

  useEffect(() => {
    const fetchBrands = async () => {
      setLoadingBrands(true);
      try {
        const res = await fetch('http://localhost:3000/api/user/brands');
        const json = await res.json();
        if (json.status === 'success') {
          let list = json.data;
          if (i18n.language === 'en') {
            list = await Promise.all(list.map(async (b: Brand) => ({
              ...b,
              brand_name: await autoTranslate(b.brand_name),
            })));
          }
          setBrands(list);
        }
      } catch (err) {
        console.error('Error loading brands:', err);
      } finally {
        setLoadingBrands(false);
      }
    };
    fetchBrands();
  }, [i18n.language]);

  const toggleCategory = (cateId: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      newSet.has(cateId) ? newSet.delete(cateId) : newSet.add(cateId);
      return newSet;
    });
  };

  useEffect(() => {
    import('feather-icons').then((feather) => feather.replace());
  }, [currentProducts, searchResults]);

  const formatPrice = (price: number) => {
    const locale = i18n.language === 'vi' ? 'vi-VN' : 'en-US';
    const currency = i18n.language === 'vi' ? 'VND' : 'USD';
    const value = i18n.language === 'vi' ? price : price / 24000;
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
    }).format(value);
  };

  const getImage = (path?: string) => path?.startsWith('http') ? path : `/public/${path || ''}`;
  const isNew = (date: string) => new Date(date).getTime() > Date.now() - 30 * 24 * 60 * 60 * 1000;

  const SearchResultsInShop: React.FC = () => {
    const maxBuying = React.useMemo(() => {
      return searchResults.length > 0
        ? Math.max(...searchResults.map(p => p.product_buying || 0))
        : 0;
    }, [searchResults]);

    if (!searchQuery || searchResults.length === 0) return null;

    return (
      <>
        <div className="text-center mb-12" data-aos="fade-up">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-orbitron">
            {t("Kết quả tìm kiếm cho")}: "<span className="text-primary">{searchQuery}</span>"
          </h2>
          <p className="text-accent/70 max-w-2xl mx-auto font-open-sans">
            {searchResults.length} {t("sản phẩm được tìm thấy")}
            <button onClick={clearSearch} className="ml-4 text-primary hover:underline font-medium">
              [{t("Xóa")}]
            </button>
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
          {searchResults.map((product, index) => {
            const isBestSeller = (product.product_buying || 0) >= maxBuying && maxBuying > 0;
            const inWishlist = isInWishlist(product.product_id);

            return (
              <Link
                key={product.product_id}
                to={`/product-detail/${product.product_id}`}
                className="product-card bg-secondary/50 rounded-lg overflow-hidden border border-primary/20 flex flex-col block hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                data-aos="fade-up"
                data-aos-delay={(index % 9) * 100}
              >
                <div className="h-64 bg-gray-800 relative overflow-hidden">
                  <img
                    src={getImage(product.product_image)}
                    alt={product.product_name}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    loading="lazy"
                  />
                  {isBestSeller && (
                    <span className="absolute top-4 left-4 bg-primary text-white text-xs px-2 py-1 rounded font-open-sans font-bold transition-opacity duration-300 hover:opacity-90">
                      {t("BÁN CHẠY NHẤT")}
                    </span>
                  )}
                </div>

                <div className="p-4 flex-1 flex flex-col">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <StarRating rating={product.product_rating || 0} />
                      <span className="text-sm text-red-500 font-semibold">
                        ({(product.product_rating || 0).toFixed(1)})
                      </span>
                    </div>
                    <h3 className="font-semibold text-lg mb-2 font-open-sans line-clamp-2">
                      {product.product_name}
                    </h3>
                  </div>

                  <div className="mt-auto flex items-center justify-between">
                    <span className="text-primary font-bold font-open-sans whitespace-nowrap">
                      {t("Từ")} {formatPrice(product.product_price)}
                    </span>

                    <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart({
                            id: product.product_id,
                            name: product.product_name,
                            price: product.product_price,
                            image: getImage(product.product_image),
                            cate_id: product.cate_id,
                          });
                          success?.(t("Thêm vào giỏ hàng thành công!"), `${product.product_name} ${t("đã được thêm vào giỏ hàng.")}`);
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
                          e.stopPropagation();
                          const item = {
                            id: product.product_id,
                            name: product.product_name,
                            price: product.product_price,
                            image: getImage(product.product_image),
                            cate_id: product.cate_id
                          };
                          if (inWishlist) {
                            removeFromWishlist(product.product_id);
                            wishlistRemove?.(t("Đã xóa khỏi danh sách yêu thích"), product.product_name);
                          } else {
                            addToWishlist(item);
                            wishlistAdd?.(t("Đã thêm vào danh sách yêu thích"), product.product_name);
                          }
                        }}
                        className={`px-3 py-1 rounded text-sm transition-all duration-300 font-orbitron flex items-center justify-center ${
                          inWishlist ? 'bg-red-600/20 text-red-600' : 'bg-accent/10 hover:bg-red-600/20 text-primary hover:text-red-600'
                        }`}
                      >
                        <i data-feather="heart" className={`h-4 w-4 transition-all duration-300 ${inWishlist ? 'fill-red-600 text-red-600 animate-heartbeat' : ''}`} />
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <button
            onClick={clearSearch}
            className="border-2 border-primary text-primary hover:bg-primary hover:text-white px-8 py-3 rounded-md font-semibold transition font-orbitron"
          >
            {t("Tiếp tục mua sắm")}
          </button>
        </div>
      </>
    );
  };

  return (
    <>
      <section className="relative h-[80vh] flex items-center justify-center bg-secondary text-accent">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80"
            srcSet="https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80 800w, https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80 1770w"
            sizes="(max-width: 800px) 800px, 1770px"
            alt="Gaming setup background"
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
        <div className="absolute inset-0 hero-gradient"></div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto" data-aos="fade-up">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 font-orbitron">{t("CỬA HÀNG")}</h1>
          <p className="text-xl mb-8 font-open-sans">
            {t("Thiết bị chơi game cao cấp và áo đấu esports")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/jerseys"
              className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-md font-semibold transition font-orbitron"
            >
              {t("Mua Áo Đấu")}
            </Link>
            <Link
              to="/shop"
              className="bg-transparent border-2 border-accent hover:bg-accent hover:text-secondary text-accent px-8 py-3 rounded-md font-semibold transition font-orbitron"
            >
              {t("Khám Phá Thiết Bị")}
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-secondary text-accent">
        <div className="flex flex-col md:flex-row gap-8">
          <aside
            className={`filter-sidebar md:w-1/4 ${isFilterOpen ? 'open' : ''}`}
            data-aos={window.innerWidth >= 768 ? 'fade-right' : undefined}
          >
            <div className="md:hidden flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold font-orbitron">{t("Bộ Lọc")}</h2>
              <button onClick={closeFilter} id="close-filters" className="text-primary">
                <i data-feather="x" className="h-6 w-6"></i>
              </button>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-4 font-orbitron">{t("Danh Mục")}</h3>
              {loadingCategories ? (
                <p className="text-sm text-accent/60 py-4">{t("Đang tải danh mục...")}</p>
              ) : (
                <div className="space-y-3">
                  <label className="flex items-center gap-2 cursor-pointer font-open-sans">
                    <input
                      type="checkbox"
                      className="filter-checkbox main-category-filter"
                      checked={!selectedCategoryId && !selectedSubCategoryId}
                      onChange={() => {
                        setSelectedCategoryId(null);
                        setSelectedSubCategoryId(null);
                        setMinPriceDisplay('');
                        setMaxPriceDisplay('');
                      }}
                    />
                    <span>{t("Tất Cả Sản Phẩm")}</span>
                  </label>

                  {categories.map((category) => {
                    const subs = subCategories[category.cate_id] || [];
                    const isExpanded = expandedCategories.has(category.cate_id);
                    const hasActiveSub = subs.some(sub => sub.sc_id === selectedSubCategoryId);

                    return (
                      <div key={category.cate_id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="flex items-center gap-2 cursor-pointer font-open-sans">
                            <input
                              type="checkbox"
                              className="filter-checkbox main-category-filter"
                              checked={selectedCategoryId === category.cate_id || hasActiveSub}
                              onChange={() => handleCategoryChange(category.cate_id)}
                            />
                            <span>{category.cate_name}</span>
                          </label>
                          {subs.length > 0 && (
                            <button
                              onClick={() => toggleCategory(category.cate_id)}
                              className="text-primary text-sm hover:opacity-70 transition"
                            >
                              <i
                                data-feather={isExpanded ? "chevron-down" : "chevron-right"}
                                className="h-4 w-4"
                              ></i>
                            </button>
                          )}
                        </div>

                        {isExpanded && subs.length > 0 && (
                          <div className="sub-category space-y-2 pl-6 border-l-2 border-primary/20 mt-2">
                            {subs.map((sub) => (
                              <label
                                key={sub.sc_id}
                                className="flex items-center gap-2 cursor-pointer font-open-sans hover:text-primary transition"
                              >
                                <input
                                  type="checkbox"
                                  className="filter-checkbox sub-category-filter"
                                  checked={selectedSubCategoryId === sub.sc_id}
                                  onChange={() => handleSubCategoryChange(sub.sc_id, category.cate_id)}
                                />
                                <span className={selectedSubCategoryId === sub.sc_id ? 'text-primary font-medium' : ''}>
                                  {sub.sc_name}
                                </span>
                              </label>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-4 font-orbitron">{t("Khoảng Giá")}</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-accent/70 mb-1 font-open-sans">
                      {t("Từ (VND)")}
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="0"
                      className="w-full px-4 py-2.5 bg-secondary border border-primary/30 rounded-md text-accent focus:outline-none focus:ring-2 focus:ring-primary font-open-sans text-right placeholder:text-accent/40"
                      value={minPriceDisplay}
                      onChange={(e) => {
                        const raw = e.target.value.replace(/\D/g, '');
                        setMinPriceDisplay(raw === '' ? '' : Number(raw).toLocaleString('vi-VN'));
                      }}
                      onBlur={() => {
                        if (!minPriceDisplay.trim()) {
                          setMinPriceDisplay('');
                        }
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-accent/70 mb-1 font-open-sans">
                      {t("Đến (VND)")}
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="999.999.999"
                      className="w-full px-4 py-2.5 bg-secondary border border-primary/30 rounded-md text-accent focus:outline-none focus:ring-2 focus:ring-primary font-open-sans text-right placeholder:text-accent/40"
                      value={maxPriceDisplay}
                      onChange={(e) => {
                        let raw = e.target.value.replace(/\D/g, '');
                        if (raw && parseInt(raw, 10) > 999999999) raw = '999999999';
                        setMaxPriceDisplay(raw === '' ? '' : Number(raw).toLocaleString('vi-VN'));
                      }}
                    />
                  </div>
                </div>

                <button
                  onClick={handleApplyPrice}
                  className="w-full bg-primary hover:bg-primary/90 text-white py-3 rounded-md font-semibold transition font-orbitron flex items-center justify-center gap-2 shadow-lg"
                >
                  <i data-feather="check-circle" className="h-5 w-5"></i>
                  {t("Áp dụng khoảng giá")}
                </button>

                <p className="text-xs text-accent/50 text-center">
                  {t("Lưu ý: Giá tối đa là 999.999.999 VND")}
                </p>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-4 font-orbitron">{t("Thương Hiệu")}</h3>
              {loadingBrands ? (
                <p className="text-sm text-accent/60 py-4">{t("Đang tải thương hiệu...")}</p>
              ) : (
                <div className="space-y-2">
                  {brands.map((brand) => (
                    <label key={brand.brand_id} className="flex items-center gap-2 cursor-pointer font-open-sans">
                      <input
                        type="radio"
                        name="brand_filter"
                        className="filter-checkbox brand-filter"
                        checked={selectedBrandId === brand.brand_id}
                        onChange={() => handleBrandChange(brand.brand_id)}
                      />
                      <span>{brand.brand_name}</span>
                    </label>
                  ))}
                  <label className="flex items-center gap-2 cursor-pointer font-open-sans">
                    <input
                      type="radio"
                      name="brand_filter"
                      className="filter-checkbox"
                      checked={selectedBrandId === null}
                      onChange={() => handleBrandChange(null)}
                    />
                    <span>{t("Tất cả thương hiệu")}</span>
                  </label>
                </div>
              )}
            </div>

            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-4 font-orbitron">{t("Đánh Giá Sao")}</h3>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer font-open-sans">
                  <input
                    type="radio"
                    name="rating_filter"
                    className="filter-checkbox rating-filter"
                    checked={selectedRating === '5'}
                    onChange={() => handleRatingChange('5')}
                  />
                  <div className="flex items-center gap-2">
                    <StarRating rating={5} />
                    <span>{t("5 sao")}</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer font-open-sans">
                  <input
                    type="radio"
                    name="rating_filter"
                    className="filter-checkbox rating-filter"
                    checked={selectedRating === '4-5'}
                    onChange={() => handleRatingChange('4-5')}
                  />
                  <div className="flex items-center gap-2">
                    <StarRating rating={4.5} />
                    <span>{t("4-5 sao")}</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer font-open-sans">
                  <input
                    type="radio"
                    name="rating_filter"
                    className="filter-checkbox rating-filter"
                    checked={selectedRating === '3-4'}
                    onChange={() => handleRatingChange('3-4')}
                  />
                  <div className="flex items-center gap-2">
                    <StarRating rating={3.5} />
                    <span>{t("3-4 sao")}</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer font-open-sans">
                  <input
                    type="radio"
                    name="rating_filter"
                    className="filter-checkbox rating-filter"
                    checked={selectedRating === '1-2'}
                    onChange={() => handleRatingChange('1-2')}
                  />
                  <div className="flex items-center gap-2">
                    <StarRating rating={1.5} />
                    <span>{t("1-2 sao")}</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer font-open-sans">
                  <input
                    type="radio"
                    name="rating_filter"
                    className="filter-checkbox rating-filter"
                    checked={selectedRating === null}
                    onChange={() => setSelectedRating(null)}
                  />
                  <span>{t("Tất cả đánh giá")}</span>
                </label>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-4 font-orbitron">{t("Sắp Xếp")}</h3>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="w-full bg-secondary border border-primary/20 rounded-md px-3 py-2 text-accent focus:outline-none focus:ring-2 focus:ring-primary font-open-sans"
              >
                <option value="featured">{t("Nổi Bật")}</option>
                <option value="price-low">{t("Giá: Thấp đến Cao")}</option>
                <option value="price-high">{t("Giá: Cao đến Thấp")}</option>
                <option value="name">{t("Tên A-Z")}</option>
                <option value="newest">{t("Mới Nhất")}</option>
                <option value="bestselling">{t("Bán Chạy Nhất")}</option>
              </select>
            </div>

            <button className="w-full bg-primary hover:bg-primary/90 text-white py-2 rounded-md font-semibold transition font-orbitron apply-filters">
              {t("Áp Dụng Bộ Lọc")}
            </button>

            {hasActiveFilter && (
              <button
                onClick={clearAllFilters}
                className="w-full mt-4 bg-transparent border-2 border-red-500 hover:bg-red-500 hover:text-white text-red-500 py-2 rounded-md font-semibold transition font-orbitron flex items-center justify-center gap-2"
              >
                <i data-feather="x-circle" className="h-5 w-5"></i>
                {t("Xóa Bộ Lọc")}
              </button>
            )}
          </aside>

          <div className="md:w-3/4" data-aos="fade-up">
            {searchQuery && searchResults.length > 0 ? (
              <div className="w-full">
                <SearchResultsInShop />
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-6">
                  <p className="text-accent/70 font-open-sans" id="product-count">
                    {loading
                      ? t("Đang tải...")
                      : t("Hiển thị {{start}}-{{end}} trong tổng {{total}} sản phẩm", {
                          start: startItem,
                          end: endItem,
                          total: filteredAndSortedProducts.length,
                        })}
                  </p>
                  <button 
                    onClick={openFilter}
                    className="mobile-filter-btn bg-primary text-white px-4 py-2 rounded-md font-semibold transition flex items-center gap-2 font-orbitron"
                  >
                    <i data-feather="filter" className="h-4 w-4"></i>
                    {t("Bộ Lọc")}
                  </button>
                </div>

                <div
                  ref={productsGridRef}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10"
                  id="products-grid"
                >
                  {loading ? (
                    Array(3).fill(0).map((_, i) => (
                      <div key={i} className="product-card bg-secondary/50 rounded-lg overflow-hidden border border-primary/20 animate-pulse">
                        <div className="h-64 bg-gray-800"></div>
                        <div className="p-4">
                          <div className="h-4 bg-gray-600 rounded w-3/4 mb-3"></div>
                          <div className="h-6 bg-gray-600 rounded w-1/2"></div>
                        </div>
                      </div>
                    ))
                  ) : filteredAndSortedProducts.length === 0 ? (
                    <div className="col-span-full text-center py-24">
                      <i data-feather="package" className="h-24 w-24 text-accent/30 mx-auto mb-6"></i>
                      <p className="text-3xl font-bold text-accent/80 font-orbitron mb-4">
                        {t("Không tìm thấy sản phẩm nào")}
                      </p>
                      <p className="text-xl text-accent/70 mb-6 max-w-md mx-auto">
                        {t("Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm")}
                      </p>
                    </div>
                  ) : (
                    currentProducts.map((product, index) => {
                      const inWishlist = isInWishlist(product.product_id);
                      return (
                        <Link
                          key={product.product_id}
                          to={`/product-detail/${product.product_id}`}
                          className="product-card bg-secondary/50 rounded-lg overflow-hidden border border-primary/20 flex flex-col block hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                          data-aos="fade-up"
                          data-aos-delay={index * 100}
                        >
                          <div className="h-64 bg-gray-800 relative overflow-hidden">
                            <img
                              src={getImage(product.product_image)}
                              alt={product.product_name}
                              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                              loading="lazy"
                            />
                            {isNew(product.update_at || product.create_at) && (
                              <span className="absolute top-4 left-4 bg-green-600 text-white text-xs px-2 py-1 rounded font-open-sans font-bold transition-opacity duration-300 hover:opacity-90">
                                {t("MỚI")}
                              </span>
                            )}
                            {product.product_buying > 150 && (
                              <span className="absolute top-4 right-4 bg-red-600 text-white text-xs px-2 py-1 rounded font-open-sans font-bold transition-opacity duration-300 hover:opacity-90">
                                {t("HOT")}
                              </span>
                            )}
                          </div>

                          <div className="p-4">
                            <div className="flex items-center mb-2">
                              <StarRating rating={product.product_rating} />
                              <span className="text-sm text-red-500 font-semibold ml-2">
                                ({product.product_rating.toFixed(1)})
                              </span>
                            </div>

                            <h3 className="font-semibold text-lg mb-2 font-open-sans line-clamp-2">
                              {product.product_name}
                            </h3>

                            <div className="flex items-start justify-between mt-4">
                              <div className="leading-tight">
                                <span className="text-primary font-bold font-open-sans block -mt-4">
                                  {t("Từ")}<br className="hidden sm:inline" />{formatPrice(product.product_price)}
                                </span>
                              </div>

                              <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    addToCart({
                                      id: product.product_id,
                                      name: product.product_name,
                                      price: product.product_price,
                                      image: getImage(product.product_image),
                                      cate_id: product.cate_id,
                                    });
                                    success?.(t("Thêm vào giỏ hàng thành công!"), `${product.product_name} ${t("đã được thêm vào giỏ hàng của bạn.")}`);
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
                                    e.stopPropagation();
                                    const item = {
                                      id: product.product_id,
                                      name: product.product_name,
                                      price: product.product_price,
                                      image: getImage(product.product_image),
                                      cate_id: product.cate_id
                                    };
                                    if (inWishlist) {
                                      removeFromWishlist(product.product_id);
                                      wishlistRemove?.(t("Đã xóa khỏi danh sách yêu thích"), product.product_name);
                                    } else {
                                      addToWishlist(item);
                                      wishlistAdd?.(t("Đã thêm vào danh sách yêu thích"), product.product_name);
                                    }
                                  }}
                                  className={`px-3 py-1 rounded text-sm transition-all duration-300 font-orbitron flex items-center justify-center ${inWishlist ? 'bg-red-600/20 text-red-600' : 'bg-accent/10 hover:bg-red-600/20 text-primary hover:text-red-600'}`}
                                >
                                  <i data-feather="heart" className={`h-4 w-4 transition-all duration-300 ${inWishlist ? 'fill-red-600 text-red-600 animate-heartbeat' : ''}`} />
                                </button>
                              </div>
                            </div>
                          </div>
                        </Link>
                      );
                    })
                  )}
                </div>

                {totalPages > 1 && !loading && filteredAndSortedProducts.length > 0 && (
                  <div className="pagination mt-12 flex justify-center items-center gap-3 flex-wrap">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-6 py-3 rounded border border-primary/30 disabled:opacity-50 hover:bg-primary hover:text-white transition font-open-sans flex items-center gap-2"
                    >
                      <i data-feather="chevron-left" className="h-5 w-5"></i>
                      Prev
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(num => (
                      <button
                        key={num}
                        onClick={() => handlePageChange(num)}
                        className={`px-5 py-3 rounded font-open-sans transition ${currentPage === num
                          ? 'bg-primary text-white shadow-lg scale-110'
                          : 'border border-primary/30 hover:bg-primary hover:text-white'
                        }`}
                      >
                        {num}
                      </button>
                    ))}

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-6 py-3 rounded border border-primary/30 disabled:opacity-50 hover:bg-primary hover:text-white transition font-open-sans flex items-center gap-2"
                    >
                      Next
                      <i data-feather="chevron-right" className="h-5 w-5"></i>
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      <div 
        className={`overlay ${isFilterOpen ? 'open' : ''}`} 
        id="filter-overlay"
        onClick={closeFilter}
      ></div>
    </>
  );
};

export default Shop;