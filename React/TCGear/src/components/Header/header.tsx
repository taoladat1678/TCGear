import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import * as feather from 'feather-icons';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useSearch } from '../../context/SearchContext';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import './header.css';

const Header: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { setSearchData, clearSearch } = useSearch();

  const { cartCount } = useCart();
  const { wishlist } = useWishlist();
  const wishlistCount = wishlist.length;

  const { user, logout } = useAuth();

  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);
  const languageRef = useRef<HTMLDivElement>(null);

  // ======================= AVATAR HELPER - TẮT FALLBACK fant1.jpg =======================
  const getAvatarUrl = (image?: string | null): string | null => {
    if (!image || image.trim() === '') return null;
    if (image.startsWith('http')) return image; // Google/FB avatar
    const clean = image.startsWith('img/') ? image : `img/${image}`;
    return `/${clean}`;
  };

  // ======================= FORMAT FULLNAME (XUỐNG DÒNG NẾU >=4 TỪ) =======================
  const formatFullname = (fullname?: string | null): React.ReactNode => {
    if (!fullname) return '';

    const words = fullname.trim().split(/\s+/).filter(w => w.length > 0);

    if (words.length < 4) {
      return fullname.trim();
    }

    const line1 = words.slice(0, 2).join(' ');
    const line2 = words.slice(2).join(' ');

    return (
      <>
        {line1}
        <br />
        {line2}
      </>
    );
  };

  const debounceSearch = useCallback(
    (query: string) => {
      const trimmed = query.trim();
      if (!trimmed) {
        setSearchResults([]);
        setShowResults(false);
        clearSearch();
        return;
      }

      setLoading(true);
      const timer = setTimeout(async () => {
        try {
          const res = await fetch(
            `http://localhost:3000/api/user/products/search/${encodeURIComponent(trimmed)}`
          );
          const json = await res.json();
          if (json.status === 'success') {
            const results = json.data;
            setSearchResults(results.slice(0, 6));
            setSearchData(results, trimmed);
          } else {
            setSearchResults([]);
            setSearchData([], trimmed);
          }
        } catch (err) {
          console.error('Search error:', err);
          setSearchResults([]);
          setSearchData([], trimmed);
        } finally {
          setLoading(false);
        }
      }, 400);

      return () => clearTimeout(timer);
    },
    [setSearchData, clearSearch]
  );

  useEffect(() => {
    debounceSearch(searchQuery);
  }, [searchQuery, debounceSearch]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setShowResults(false);
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) setAccountOpen(false);
      if (languageRef.current && !languageRef.current.contains(e.target as Node)) setLanguageOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    feather.replace();
  }, [searchResults, user]);

  const toggleAccount = () => {
    setLanguageOpen(false);
    setAccountOpen(prev => !prev);
  };

  const toggleLanguage = () => {
    setAccountOpen(false);
    setLanguageOpen(prev => !prev);
  };

  const toggleMobile = () => {
    setMobileOpen(!mobileOpen);
    if (!mobileOpen) {
      setAccountOpen(false);
      setLanguageOpen(false);
    }
  };

  const isActive = (path: string) => location.pathname === path;

  const handleProductClick = (id: string) => {
    setShowResults(false);
    setSearchQuery('');
    clearSearch();
    navigate(`/product-detail/${id}`);
  };

  const handleSearchInputChange = (value: string) => {
    setSearchQuery(value);
    if (value.trim() === '') {
      setShowResults(false);
      clearSearch();
    } else {
      setShowResults(true);
    }
  };

  const handleLogout = () => {
    logout();
    setAccountOpen(false);
    navigate('/');
  };

  const accountDropdownContent = (
    <div className="account-dropdown-content">
      {user && (
        <div className="px-4 py-3 border-b border-primary/20 text-center">
          <p className="text-sm text-accent/70 font-open-sans">Xin chào,</p>
          <p className="text-base font-bold text-primary font-open-sans max-w-48 leading-tight text-center">
            {formatFullname(user.fullname)}
          </p>
        </div>
      )}

      <Link to="/profile" className="font-open-sans" onClick={() => setAccountOpen(false)}>
        <i data-feather="user" className="h-5 w-5"></i> {t("Hồ sơ")}
      </Link>

      <Link to="/orders" className="font-open-sans" onClick={() => setAccountOpen(false)}>
        <i data-feather="shopping-bag" className="h-5 w-5"></i> {t("Đơn hàng")}
        <span className="counter" id="orders-counter">0</span>
      </Link>

      <Link to="/vouchers" className="font-open-sans" onClick={() => setAccountOpen(false)}>
        <i data-feather="gift" className="h-5 w-5"></i> {t("Voucher")}
      </Link>

      {user?.isAdmin && (
        <Link to="/admin" className="font-open-sans" onClick={() => setAccountOpen(false)}>
          <i data-feather="shield" className="h-5 w-5"></i> Vào trang quản trị
        </Link>
      )}

      {user ? (
        <button
          onClick={handleLogout}
          className="w-full text-left flex items-center gap-3 px-4 py-2 hover:bg-primary/10 font-open-sans text-red-400"
        >
          <i data-feather="log-out" className="h-5 w-5"></i> {t("Đăng xuất")}
        </button>
      ) : (
        <>
          <Link to="/login" className="font-open-sans" onClick={() => setAccountOpen(false)}>
            <i data-feather="log-in" className="h-5 w-5"></i> {t("Đăng nhập")}
          </Link>
          <Link to="/register" className="font-open-sans" onClick={() => setAccountOpen(false)}>
            <i data-feather="user-plus" className="h-5 w-5"></i> {t("Đăng ký")}
          </Link>
        </>
      )}
    </div>
  );

  return (
    <nav className="bg-secondary border-b border-primary/20 sticky top-0 z-50" aria-label="Thanh điều hướng chính">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-8">
          <Link to="/" className="flex items-center shop-logo hover:opacity-85 transition-opacity duration-200">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/T1_esports_logo.svg/1200px-T1_esports_logo.svg.png"
              className="h-10 w-auto"
              alt="Logo TCGear"
            />
            <span className="ml-2 text-xl font-bold text-primary font-orbitron">TCGEAR</span>
          </Link>

          <div className="flex items-center gap-1">
            <div className="nav-container flex items-center gap-1">
              <div className="nav-links">
                <Link to="/" className={`transition font-open-sans ${isActive('/') ? 'text-primary' : 'text-accent hover:text-primary'}`}>{t("Trang chủ")}</Link>
                <Link to="/shop" className={`transition font-open-sans ${isActive('/shop') ? 'text-primary' : 'text-accent hover:text-primary'}`}>{t("Cửa hàng")}</Link>
                <Link to="/teams" className={`transition font-open-sans ${isActive('/teams') ? 'text-primary' : 'text-accent hover:text-primary'}`}>{t("Đội tuyển")}</Link>
                <Link to="/blog" className={`transition font-open-sans ${isActive('/blog') ? 'text-primary' : 'text-accent hover:text-primary'}`}>{t("Blog")}</Link>
                <Link to="/contact" className={`transition font-open-sans ${isActive('/contact') ? 'text-primary' : 'text-accent hover:text-primary'}`}>{t("Liên hệ")}</Link>
                <Link to="/about" className={`transition font-open-sans ${isActive('/about') ? 'text-primary' : 'text-accent hover:text-primary'}`}>{t("Giới thiệu")}</Link>
              </div>
            </div>

            <div className="actions-container flex items-center gap-1 justify-end">
              <div ref={searchRef} className="search-bar items-center bg-secondary border border-primary/20 rounded-md overflow-hidden relative">
                <input
                  type="text"
                  id="search-input"
                  value={searchQuery}
                  onChange={(e) => handleSearchInputChange(e.target.value)}
                  onFocus={() => searchQuery.trim() && setShowResults(true)}
                  placeholder={t("Tìm kiếm...")}
                  className="bg-transparent px-3 py-1 text-accent focus:outline-none w-40 lg:w-56 font-open-sans"
                />
                <button className="p-2 text-accent hover:text-primary transition font-orbitron">
                  {loading ? <i data-feather="loader" className="h-4 w-4 animate-spin"></i> : <i data-feather="search" className="h-4 w-4"></i>}
                </button>

                {showResults && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-secondary border border-primary/30 rounded-md shadow-xl z-50 max-h-96 overflow-y-auto">
                    {loading ? (
                      <div className="p-4 text-center text-sm text-accent/70">Đang tìm...</div>
                    ) : searchResults.length > 0 ? (
                      searchResults.map((item) => (
                        <div
                          key={item.product_id}
                          onClick={() => handleProductClick(item.product_id)}
                          className="flex items-center gap-3 p-3 hover:bg-primary/10 cursor-pointer border-b border-primary/10 last:border-b-0"
                        >
                          <img src={`/public/${item.product_image}`} alt={item.product_name} className="w-12 h-12 object-cover rounded" />
                          <div>
                            <div className="text-sm font-medium text-accent line-clamp-1">{item.product_name}</div>
                            <div className="text-xs text-primary font-bold">
                              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.product_price)}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-sm text-accent/60">Không tìm thấy sản phẩm</div>
                    )}
                  </div>
                )}
              </div>

              <Link to="/cart" className={`cart-icon p-2 text-accent hover:text-primary transition font-orbitron relative ${isActive('/cart') ? 'text-primary' : ''}`}>
                <i data-feather="shopping-cart"></i>
                <span className="counter" id="cart-counter">{cartCount}</span>
              </Link>

              <Link to="/wishlist" className={`wishlist-icon p-2 text-accent hover:text-primary transition font-orbitron relative ${isActive('/wishlist') ? 'text-primary' : ''}`}>
                <i data-feather="heart"></i>
                <span className="counter" id="wishlist-counter">{wishlistCount}</span>
              </Link>

              <div ref={accountRef} className={`account-dropdown ${accountOpen ? 'open' : ''}`}>
                <button
                  id="account-toggle"
                  onClick={toggleAccount}
                  className="dropdown-toggle p-2 text-accent hover:text-primary transition font-orbitron flex items-center gap-1"
                >
                  {user ? (
                    <div className="relative h-8 w-8 rounded-full border-2 border-primary/30 flex items-center justify-center bg-gray-800 overflow-hidden">
                      {getAvatarUrl(user.image) ? (
                        <img
                          src={getAvatarUrl(user.image)!}
                          alt={user.fullname}
                          className="absolute inset-0 h-full w-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      ) : null}
                      {!getAvatarUrl(user.image) && (
                        <i data-feather="user" className="h-5 w-5 text-primary" />
                      )}
                    </div>
                  ) : (
                    <i data-feather="user" className="h-6 w-6"></i>
                  )}
                  <i data-feather="chevron-down" className="h-4 w-4"></i>
                </button>
                {accountDropdownContent}
              </div>

              <div ref={languageRef} className={`language-dropdown ${languageOpen ? 'open' : ''}`}>
                <button
                  id="language-toggle"
                  onClick={toggleLanguage}
                  className="dropdown-toggle p-2 text-accent hover:text-primary transition font-orbitron"
                >
                  <i data-feather="globe"></i>
                  <i data-feather="chevron-down" className="h-4 w-4"></i>
                </button>
                <div className="language-dropdown-content">
                  <a href="#" onClick={(e) => { e.preventDefault(); i18n.changeLanguage('en'); setLanguageOpen(false); }} className="font-open-sans">
                    <i data-feather="flag" className="h-5 w-5"></i> English
                  </a>
                  <a href="#" onClick={(e) => { e.preventDefault(); i18n.changeLanguage('vi'); setLanguageOpen(false); }} className="font-open-sans">
                    <i data-feather="flag" className="h-5 w-5"></i> Tiếng Việt
                  </a>
                </div>
              </div>

              <button
                id="mobile-menu-toggle"
                onClick={toggleMobile}
                className="p-2 text-accent font-orbitron"
              >
                <i data-feather="menu"></i>
              </button>
            </div>
          </div>
        </div>

        {/* MOBILE MENU */}
        <div id="mobile-menu" className={`mobile-menu ${mobileOpen ? '' : 'hidden'} bg-secondary border-t border-primary/20`}>
          <div className="flex flex-col space-y-4 py-4 px-4">
            {/* search mobile */}
            <div ref={searchRef} className="flex items-center bg-secondary border border-primary/20 rounded-md overflow-hidden relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchInputChange(e.target.value)}
                onFocus={() => searchQuery.trim() && setShowResults(true)}
                placeholder={t("Tìm kiếm...")}
                className="bg-transparent px-3 py-1 text-accent focus:outline-none w-full font-open-sans"
              />
              <button className="p-2 text-accent hover:text-primary transition font-orbitron">
                {loading ? <i data-feather="loader" className="h-4 w-4 animate-spin"></i> : <i data-feather="search" className="h-4 w-4"></i>}
              </button>

              {showResults && (
                <div className="absolute top-full left-4 right-4 mt-2 bg-secondary border border-primary/30 rounded-md shadow-xl z-50 max-h-80 overflow-y-auto">
                  {searchResults.length > 0 ? (
                    searchResults.map((item) => (
                      <div
                        key={item.product_id}
                        onClick={() => handleProductClick(item.product_id)}
                        className="flex items-center gap-3 p-3 hover:bg-primary/10 cursor-pointer border-b border-primary/10 last:border-b-0"
                      >
                        <img src={`/public/${item.product_image}`} alt="" className="w-12 h-12 object-cover rounded" />
                        <div>
                          <div className="text-sm font-medium text-accent line-clamp-1">{item.product_name}</div>
                          <div className="text-xs text-primary font-bold">
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.product_price)}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : !loading && searchQuery ? (
                    <div className="p-4 text-center text-sm text-accent/60">Không tìm thấy</div>
                  ) : null}
                </div>
              )}
            </div>

            {/* links mobile */}
            <Link to="/" className={`text-accent hover:text-primary transition font-open-sans ${isActive('/') ? 'text-primary' : ''}`}>{t("Trang chủ")}</Link>
            <Link to="/shop" className={`text-accent hover:text-primary transition font-open-sans ${isActive('/shop') ? 'text-primary' : ''}`}>{t("Cửa hàng")}</Link>
            <Link to="/teams" className={`text-accent hover:text-primary transition font-open-sans ${isActive('/teams') ? 'text-primary' : ''}`}>{t("Đội tuyển")}</Link>
            <Link to="/blog" className={`text-accent hover:text-primary transition font-open-sans ${isActive('/blog') ? 'text-primary' : ''}`}>{t("Blog")}</Link>
            <Link to="/contact" className={`text-accent hover:text-primary transition font-open-sans ${isActive('/contact') ? 'text-primary' : ''}`}>{t("Liên hệ")}</Link>
            <Link to="/about" className={`text-accent hover:text-primary transition font-open-sans ${isActive('/about') ? 'text-primary' : ''}`}>{t("Giới thiệu")}</Link>

            <Link to="/cart" className={`mobile-cart text-accent hover:text-primary transition font-open-sans flex items-center gap-2 relative ${isActive('/cart') ? 'text-primary' : ''}`}>
              <i data-feather="shopping-cart" className="h-5 w-5"></i> {t("Giỏ hàng")}
              <span className="counter" id="mobile-cart-counter">{cartCount}</span>
            </Link>

            <Link to="/wishlist" className={`mobile-wishlist text-accent hover:text-primary transition font-open-sans flex items-center gap-2 relative ${isActive('/wishlist') ? 'text-primary' : ''}`}>
              <i data-feather="heart" className="h-5 w-5"></i> {t("Danh sách yêu thích")}
              <span className="counter" id="mobile-wishlist-counter">{wishlistCount}</span>
            </Link>

            <div className={`account-dropdown ${accountOpen ? 'open' : ''} relative`}>
              <button
                onClick={toggleAccount}
                className="text-accent hover:text-primary transition font-open-sans flex items-center gap-2 w-full text-left"
              >
                {user ? (
                  <div className="relative h-9 w-9 rounded-full border-2 border-primary/30 flex items-center justify-center bg-gray-800 overflow-hidden">
                    {getAvatarUrl(user.image) ? (
                      <img
                        src={getAvatarUrl(user.image)!}
                        alt={user.fullname || 'User'}
                        className="absolute inset-0 h-full w-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    ) : null}
                    {!getAvatarUrl(user.image) && (
                      <i data-feather="user" className="h-6 w-6 text-primary" />
                    )}
                  </div>
                ) : (
                  <i data-feather="user" className="h-6 w-6"></i>
                )}
                {t("Tài khoản")}
                <i data-feather="chevron-down" className="h-5 w-5 ml-auto"></i>
              </button>
              {accountDropdownContent}
            </div>

            <div className={`language-dropdown ${languageOpen ? 'open' : ''} relative`}>
              <button onClick={toggleLanguage} className="text-accent hover:text-primary transition font-open-sans flex items-center gap-2 w-full text-left relative">
                <i data-feather="globe" className="h-5 w-5"></i>
                {t("Ngôn ngữ")}
                <i data-feather="chevron-down" className="h-5 w-5 ml-auto"></i>
              </button>
              <div className="language-dropdown-content w-full">
                <a href="#" onClick={(e) => { e.preventDefault(); i18n.changeLanguage('en'); setLanguageOpen(false); }} className="font-open-sans">
                  <i data-feather="flag" className="h-5 w-5"></i> English
                </a>
                <a href="#" onClick={(e) => { e.preventDefault(); i18n.changeLanguage('vi'); setLanguageOpen(false); }} className="font-open-sans">
                  <i data-feather="flag" className="h-5 w-5"></i> Tiếng Việt
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;