import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import feather from 'feather-icons';
import { useCart } from '../../context/CartContext';
import { useTranslation } from 'react-i18next';
import { autoTranslate } from '../../utils/autoTranslate';
import './cart.css';

interface ColorOption {
  color_id: string;
  color_name: string;
  color_code: string;
}

interface SizeOption {
  size_id: string;
  size_name: string;
}

interface VariantData {
  variant_id: string; // Thêm trường này vào interface để bóc tách từ API
  price: number;
  product_image: string;
  product_name: string;
  product_desc?: string;
}

const Cart: React.FC = () => {
  const { t } = useTranslation();
  const { cartItems, updateQuantity, removeItem, clearCart, addToCart } = useCart();
  const navigate = useNavigate();
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const [showCheckoutWarning, setShowCheckoutWarning] = useState(false);
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');

  const [colors, setColors] = useState<ColorOption[]>([]);
  const [loadingColors, setLoadingColors] = useState(false);
  const [selectedColorId, setSelectedColorId] = useState<string>('');

  const [sizes, setSizes] = useState<SizeOption[]>([]);
  const [loadingSizes, setLoadingSizes] = useState(false);
  const [selectedSizeId, setSelectedSizeId] = useState<string>('');

  const [variantData, setVariantData] = useState<VariantData | null>(null);
  const [loadingVariant, setLoadingVariant] = useState(false);

  const { i18n } = useTranslation();
  const currentLang = i18n.language;

  const [translatedCartItems, setTranslatedCartItems] = useState<any[]>([]);
  const [translatedVariantData, setTranslatedVariantData] = useState<VariantData | null>(null);
  const [translatedColors, setTranslatedColors] = useState<ColorOption[]>([]);
  const [translatedSizes, setTranslatedSizes] = useState<SizeOption[]>([]);
  const [translatedSelectedItem, setTranslatedSelectedItem] = useState<any>(null);

  useEffect(() => {
    const translateItems = async () => {
      if (currentLang !== 'en') {
        setTranslatedCartItems(cartItems);
        return;
      }
      const translated = await Promise.all(
        cartItems.map(async (item) => ({
          ...item,
          name: item.name ? await autoTranslate(item.name) : undefined,
          description: item.description ? await autoTranslate(item.description) : undefined,
          color: item.color ? await autoTranslate(item.color) : undefined,
          size: item.size ? await autoTranslate(item.size) : undefined,
        }))
      );
      setTranslatedCartItems(translated);
    };
    translateItems();
  }, [cartItems, currentLang]);

  useEffect(() => {
    const translateVariant = async () => {
      if (!variantData) {
        setTranslatedVariantData(null);
        return;
      }
      if (currentLang !== 'en') {
        setTranslatedVariantData(variantData);
        return;
      }
      setTranslatedVariantData({
        ...variantData,
        product_name: await autoTranslate(variantData.product_name),
        product_desc: variantData.product_desc ? await autoTranslate(variantData.product_desc) : undefined,
      });
    };
    translateVariant();
  }, [variantData, currentLang]);

  useEffect(() => {
    const translateOptions = async () => {
      if (currentLang !== 'en') {
        setTranslatedColors(colors);
        setTranslatedSizes(sizes);
        return;
      }
      const tc = await Promise.all(
        colors.map(async c => ({ ...c, color_name: await autoTranslate(c.color_name) }))
      );
      setTranslatedColors(tc);
      const ts = await Promise.all(
        sizes.map(async s => ({ ...s, size_name: await autoTranslate(s.size_name) }))
      );
      setTranslatedSizes(ts);
    };
    translateOptions();
  }, [colors, sizes, currentLang]);

  useEffect(() => {
    const translateSelected = async () => {
      if (!selectedItem) {
        setTranslatedSelectedItem(null);
        return;
      }
      if (currentLang !== 'en') {
        setTranslatedSelectedItem(selectedItem);
        return;
      }
      setTranslatedSelectedItem({
        ...selectedItem,
        name: selectedItem.name ? await autoTranslate(selectedItem.name) : undefined,
        description: selectedItem.description ? await autoTranslate(selectedItem.description) : undefined,
        color: selectedItem.color ? await autoTranslate(selectedItem.color) : undefined,
        size: selectedItem.size ? await autoTranslate(selectedItem.size) : undefined,
      });
    };
    translateSelected();
  }, [selectedItem, currentLang]);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        const fetchDefaultAddress = async () => {
          if (!user.user_id) return;
          try {
            const res = await fetch(`http://localhost:3000/api/user/addresses/default/${user.user_id}`);
            const data = await res.json();
            if (data.status === 'success' && data.data) {
              if (data.data.address) {
                setAddress(data.data.address);
              }
            }
          } catch (err) {
            console.error("Lỗi khi lấy địa chỉ mặc định:", err);
          }
        };
        fetchDefaultAddress();
      } catch (error) {
        console.error("Lỗi khi đọc dữ liệu user từ localStorage:", error);
      }
    }
  }, []);

  useEffect(() => {
    AOS.init({ duration: 800, easing: 'ease-in-out', once: true });
    feather.replace();

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedItem(null);
        setShowCheckoutWarning(false);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  useEffect(() => {
    feather.replace();
  }, [selectedItem, showCheckoutWarning]);

  useEffect(() => {
    if (!selectedItem) {
      setColors([]);
      setSizes([]);
      setVariantData(null);
      setSelectedColorId('');
      setSelectedSizeId('');
      return;
    }

    if (selectedItem.cate_id === 'TCG-CAT-001') {
      fetchColors();
      if (selectedItem.colorId) {
        setSelectedColorId(selectedItem.colorId);
        fetchVariant('gear', selectedItem.id, selectedItem.colorId);
      }
    }

    if (selectedItem.cate_id === 'TCG-CAT-002') {
      fetchSizes();
      if (selectedItem.sizeId) {
        setSelectedSizeId(selectedItem.sizeId);
        fetchVariant('jersey', selectedItem.id, selectedItem.sizeId);
      }
    }
  }, [selectedItem]);

  useEffect(() => {
    if (!selectedItem) return;

    if (selectedItem.cate_id === 'TCG-CAT-001' && selectedColorId) {
      fetchVariant('gear', selectedItem.id, selectedColorId);
    }
    if (selectedItem.cate_id === 'TCG-CAT-002' && selectedSizeId) {
      fetchVariant('jersey', selectedItem.id, selectedSizeId);
    }
  }, [selectedColorId, selectedSizeId, selectedItem]);

  const fetchColors = async () => {
    setLoadingColors(true);
    try {
      const res = await fetch('http://localhost:3000/api/user/colors');
      if (!res.ok) throw new Error('Failed');
      const json = await res.json();
      if (json.status === 'success' && Array.isArray(json.data)) {
        setColors(json.data);
      }
    } catch (err) {
      console.error('Lỗi tải màu:', err);
    } finally {
      setLoadingColors(false);
    }
  };

  const fetchSizes = async () => {
    setLoadingSizes(true);
    try {
      const res = await fetch('http://localhost:3000/api/user/sizes');
      if (!res.ok) throw new Error('Failed');
      const json = await res.json();
      if (json.status === 'success' && Array.isArray(json.data)) {
        setSizes(json.data);
      }
    } catch (err) {
      console.error('Lỗi tải size:', err);
    } finally {
      setLoadingSizes(false);
    }
  };

  const fetchVariant = async (type: 'gear' | 'jersey', productId: string, variantId: string) => {
    setLoadingVariant(true);
    setVariantData(null);
    try {
      const res = await fetch(`http://localhost:3000/api/user/variants/products/${type}/${productId}/${variantId}`);
      const json = await res.json();
      if (json.status === 'success' && json.data) {
        setVariantData(json.data);
      }
    } catch (err) {
      console.error('Lỗi lấy variant:', err);
      setVariantData(null);
    } finally {
      setLoadingVariant(false);
    }
  };

  const confirmColor = () => {
    if (!selectedItem || !selectedColorId) return;
    const chosen = colors.find(c => c.color_id === selectedColorId);
    if (!chosen) return;

    // ĐÃ SỬA: Đồng bộ bổ sung variant_id vào giỏ hàng
    const newItem = variantData
      ? {
        ...selectedItem,
        variant_id: variantData.variant_id,
        color: chosen.color_name,
        colorId: chosen.color_id,
        price: variantData.price,
        image: variantData.product_image || selectedItem.image,
        name: variantData.product_name || selectedItem.name,
        description: variantData.product_desc || selectedItem.description,
        needsContact: false,
      }
      : {
        ...selectedItem,
        color: chosen.color_name,
        colorId: chosen.color_id,
        price: 0,
        needsContact: true,
      };

    const key = `${selectedItem.id}|${selectedItem.colorId || ''}|${selectedItem.sizeId || ''}`;
    removeItem(key);
    addToCart(newItem, selectedItem.quantity);
    setSelectedItem(null);
  };

  const confirmSize = () => {
    if (!selectedItem || !selectedSizeId) return;
    const chosen = sizes.find(s => s.size_id === selectedSizeId);
    if (!chosen) return;

    // ĐÃ SỬA: Đồng bộ bổ sung variant_id vào giỏ hàng
    const newItem = variantData
      ? {
        ...selectedItem,
        variant_id: variantData.variant_id,
        size: chosen.size_name,
        sizeId: chosen.size_id,
        price: variantData.price,
        image: variantData.product_image || selectedItem.image,
        name: variantData.product_name || selectedItem.name,
        description: variantData.product_desc || selectedItem.description,
        needsContact: false,
      }
      : {
        ...selectedItem,
        size: chosen.size_name,
        sizeId: chosen.size_id,
        price: 0,
        needsContact: true,
      };

    const key = `${selectedItem.id}|${selectedItem.colorId || ''}|${selectedItem.sizeId || ''}`;
    removeItem(key);
    addToCart(newItem, selectedItem.quantity);
    setSelectedItem(null);
  };

  const needsContactForPrice = (item: any) => {
    const isValidPrice =
      item.price != null &&
      typeof item.price === 'number' &&
      !isNaN(item.price) &&
      item.price > 0;

    return (
      (item.cate_id === 'TCG-CAT-001' || item.cate_id === 'TCG-CAT-002') &&
      (
        item.needsContact === true ||
        !isValidPrice ||
        (!item.colorId && item.cate_id === 'TCG-CAT-001') ||
        (!item.sizeId && item.cate_id === 'TCG-CAT-002')
      )
    );
  };

  const contactItems = cartItems.filter(needsContactForPrice);
  const translatedContactItems = translatedCartItems.filter(needsContactForPrice);

  const handleCheckout = () => {
    if (contactItems.length > 0) {
      setShowCheckoutWarning(true);
    } else {
      navigate('/checkout');
    }
  };

  const subtotal = cartItems.reduce((sum, item) => {
    if (needsContactForPrice(item)) return sum;
    return sum + item.price * item.quantity;
  }, 0);

  const total = subtotal;

  const formatVND = (amount: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', minimumFractionDigits: 0 }).format(amount);

  const recentlyViewedProducts = [
    { id: '1', name: 'Tai nghe chơi game chuyên nghiệp', price: 3290000, image: 'https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?ixlib=rb-4.0.3&auto=format&fit=crop&w=774&q=80' },
    { id: '2', name: 'Áo đấu đội T1 2025', price: 1590000, image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=774&q=80' },
    { id: '3', name: 'Bàn phím cơ RGB Fullsize', price: 2190000, image: 'https://images.unsplash.com/photo-1600064022973-17d9b65c9c73?ixlib=rb-4.0.3&auto=format&fit=crop&w=774&q=80' },
    { id: '4', name: 'Chuột gaming 16K DPI', price: 1490000, image: 'https://images.unsplash.com/photo-1593640408182-31b6ee5c6925?ixlib=rb-4.0.3&auto=format&fit=crop&w=774&q=80' },
  ];

  return (
    <>
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl max-[767px]:text-2xl max-[499px]:text-xl max-[374px]:text-lg font-bold mb-10 font-orbitron text-accent text-center" data-aos="fade-up">
          {t('GIỎ HÀNG CỦA BẠN')}
        </h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-20" data-aos="fade-up">
            <i data-feather="shopping-cart" className="h-20 w-20 text-primary mb-6 inline-block"></i>
            <h2 className="text-2xl max-[499px]:text-xl max-[374px]:text-lg font-bold mb-4 font-orbitron text-accent">{t('Giỏ hàng trống')}</h2>
            <Link to="/" className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-lg font-bold text-lg transition inline-block">
              {t('Tiếp tục mua sắm')}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
            <div className="lg:col-span-2 space-y-5">
              {translatedCartItems.map((item, index) => (
                <div
                  key={item.id + (item.colorId || '') + (item.sizeId || '')}
                  className="bg-secondary/50 rounded-xl border border-primary/20 p-5 max-[499px]:p-4 flex items-center gap-6 max-[499px]:gap-4 max-[499px]:flex-wrap hover:border-primary/50 hover:shadow-lg transition-all duration-300"
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  <img src={item.image || '/placeholder.jpg'} alt={item.name ? item.name : t('Sản phẩm')} className="w-24 h-24 max-[499px]:w-20 max-[499px]:h-20 max-[374px]:w-16 max-[374px]:h-16 object-cover rounded-lg border border-primary/10" loading="lazy" />

                  <div className="flex-1 min-w-0">
                    <div className="cursor-pointer" onClick={() => setSelectedItem(item)}>
                      <h3 className="font-bold text-lg max-[499px]:text-base max-[374px]:text-sm font-orbitron text-accent truncate hover:text-primary transition">{item.name ? item.name : t('Sản phẩm')}</h3>
                      {item.description && <p className="text-sm text-accent/70 mt-1 line-clamp-2">{item.description}</p>}

                      {item.cate_id === 'TCG-CAT-001' && (
                        <div className="mt-2 text-sm font-medium">
                          <span className="text-accent/80">{t('Màu:')} </span>
                          <span className={`font-semibold ${item.color ? 'text-primary' : 'text-orange-400'}`}>
                            {item.color ? item.color : t('Chưa chọn')}
                          </span>
                        </div>
                      )}

                      {item.cate_id === 'TCG-CAT-002' && (
                        <div className="mt-2 text-sm font-medium">
                          <span className="text-accent/80">{t('Size:')} </span>
                          <span className={`font-semibold ${item.size ? 'text-primary' : 'text-orange-400'}`}>
                            {item.size ? item.size : t('Chưa chọn')}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="text-center hidden sm:block">
                    {needsContactForPrice(item) ? (
                      <div className="text-orange-500 font-bold text-lg animate-pulse">{t('Liên hệ')}</div>
                    ) : (
                      <>
                        <div className="text-primary font-bold text-lg">{formatVND(item.price)}</div>
                        <div className="text-xs text-accent/60">{t('/ chiếc')}</div>
                      </>
                    )}
                  </div>

                  <div className="flex items-center border border-primary/30 rounded-lg bg-secondary/80">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-10 h-10 hover:bg-primary/20 transition text-lg">−</button>
                    <span className="w-14 text-center font-bold text-base">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-10 h-10 hover:bg-primary/20 transition text-lg">+</button>
                  </div>

                  <div className="text-right max-[499px]:ml-auto">
                    <div className="text-xl max-[499px]:text-lg max-[374px]:text-base font-bold whitespace-nowrap">
                      {needsContactForPrice(item) ? (
                        <span className="text-orange-500 animate-pulse">{t('Liên hệ')}</span>
                      ) : (
                        <span className="text-primary">{formatVND(item.price * item.quantity)}</span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      const key = `${item.id}|${item.colorId || ''}|${item.sizeId || ''}`;
                      removeItem(key);
                    }}
                    className="text-red-500 hover:text-red-600 hover:bg-red-500/10 p-2.5 rounded-full transition ml-2 relative z-10 shrink-0"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      <line x1="10" y1="11" x2="10" y2="17"></line>
                      <line x1="14" y1="11" x2="14" y2="17"></line>
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-secondary/70 border-2 border-primary/30 rounded-2xl p-6 lg:p-8 sticky top-24 shadow-2xl">
                <h2 className="text-2xl max-[499px]:text-xl max-[374px]:text-lg font-bold mb-7 font-orbitron text-accent">{t('TÓM TẮT ĐƠN HÀNG')}</h2>
                <div className="space-y-4 text-base">
                  <div className="flex justify-between">
                    <span className="text-accent/90">{t('Tổng tiền hàng')}</span>
                    <span className="font-semibold text-lg">{formatVND(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-accent/90">{t('Phí vận chuyển')}</span>
                    <span className="font-semibold text-lg italic text-accent/70">
                      {t('Chưa được tính')}
                    </span>
                  </div>
                </div>

                <div className="mt-7 pt-6 border-t-2 border-primary/40">
                  <div className="flex justify-between items-center gap-3 mb-8">
                    <span className="text-xl max-[499px]:text-lg font-bold text-accent whitespace-nowrap">{t('TỔNG CỘNG')}</span>
                    <span className="text-primary font-bold text-2xl max-[499px]:text-xl whitespace-nowrap">{formatVND(total)}</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className={`w-full font-orbitron font-bold text-lg py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] ${contactItems.length > 0
                    ? 'bg-orange-600 hover:bg-orange-700 text-white cursor-not-allowed'
                    : 'bg-primary hover:bg-primary/90 text-white'
                    }`}
                >
                  {contactItems.length > 0 ? `${t('CÓ')} ${contactItems.length} ${t('SẢN PHẨM CẦN LIÊN HỆ')}` : t('TIẾN HÀNH THANH TOÁN')}
                </button>

                <button onClick={clearCart} className="w-full mt-4 border-2 border-red-600 text-red-500 hover:bg-red-600 hover:text-white font-orbitron font-bold text-lg py-4 rounded-xl transition-all duration-300">
                  {t('XÓA TOÀN BỘ GIỎ HÀNG')}
                </button>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* MODAL CHI TIẾT SẢN PHẨM */}
      {translatedSelectedItem && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={() => setSelectedItem(null)}>
          <div className="bg-secondary border-2 border-primary/40 rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl md:text-3xl font-bold font-orbitron text-accent">
                {translatedVariantData?.product_name ? translatedVariantData.product_name : (translatedSelectedItem.name ? translatedSelectedItem.name : t('Sản phẩm'))}
              </h2>
              <button onClick={() => setSelectedItem(null)} className="text-accent/60 hover:text-red-500 transition p-2">
                <i data-feather="x" className="w-8 h-8"></i>
              </button>
            </div>

            <img
              src={translatedVariantData?.product_image || translatedSelectedItem.image || '/placeholder.jpg'}
              alt={translatedVariantData?.product_name ? translatedVariantData.product_name : (translatedSelectedItem.name ? translatedSelectedItem.name : t('Sản phẩm'))}
              className="w-full h-80 object-cover rounded-xl mb-6 border border-primary/20"
            />

            <div className="space-y-8 text-lg">
              <div>
                <span className="text-accent/70">{t('Giá:')}</span>{' '}
                {loadingVariant ? (
                  <span className="text-gray-400 font-bold text-2xl">{t('Đang tải giá...')}</span>
                ) : translatedVariantData && translatedVariantData.price != null && !isNaN(translatedVariantData.price) && translatedVariantData.price > 0 ? (
                  <span className="text-primary font-bold text-3xl">{formatVND(translatedVariantData.price)}</span>
                ) : (
                  <span className="text-orange-500 font-bold text-3xl animate-pulse">{t('Liên hệ để biết giá')}</span>
                )}
              </div>

              {(selectedItem.cate_id === 'TCG-CAT-001' || selectedItem.cate_id === 'TCG-CAT-002') && (
                <div className="bg-orange-500/15 border border-orange-500/50 text-orange-400 px-5 py-4 rounded-xl flex items-start gap-3">
                  <i data-feather="alert-triangle" className="w-6 h-6 flex-shrink-0 mt-0.5"></i>
                  <div className="text-sm md:text-base leading-relaxed">
                    <strong>{t('Lưu ý:')}</strong> {t('Giá có thể thay đổi tùy theo')}{' '}
                    {translatedSelectedItem.cate_id === 'TCG-CAT-001' ? t('màu sắc') : t('kích cỡ')}.
                  </div>
                </div>
              )}

              {translatedSelectedItem.cate_id === 'TCG-CAT-001' && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-accent flex items-center gap-3">
                      <i data-feather="palette" className="w-7 h-7"></i>
                      {translatedSelectedItem.color ? t('Thay đổi màu sắc') : t('Chọn màu sắc')}
                    </h3>
                  </div>

                  {loadingColors ? (
                    <div className="flex justify-center py8">
                      <i data-feather="loader" className="animate-spin w-10 h-10 text-primary"></i>
                    </div>
                  ) : colors.length > 0 ? (
                    <>
                      <div className="flex flex-wrap gap-5 justify-center">
                        {translatedColors.map(color => (
                          <button
                            key={color.color_id}
                            onClick={() => setSelectedColorId(color.color_id)}
                            className={`relative w-14 h-14 rounded-full border-4 transition-all duration-300 hover:scale-110 ${selectedColorId === color.color_id
                              ? 'border-primary ring-4 ring-primary/40 shadow-2xl scale-110'
                              : 'border-gray-400 hover:border-primary/60'
                              }`}
                            style={{ backgroundColor: color.color_code }}
                            title={color.color_name}
                          >
                            {selectedColorId === color.color_id && (
                              <div className="absolute inset-0 rounded-full border-4 border-white animate-pulse"></div>
                            )}
                          </button>
                        ))}
                      </div>

                      <button
                        onClick={confirmColor}
                        disabled={loadingVariant}
                        className="w-full bg-primary/90 hover:bg-primary text-white font-bold text-lg py-4 rounded-xl transition shadow-lg hover:shadow-xl disabled:opacity-60"
                      >
                        {translatedSelectedItem.color ? t('CẬP NHẬT MÀU & GIÁ') : t('XÁC NHẬN CHỌN MÀU')}
                      </button>
                    </>
                  ) : (
                    <p className="text-center text-orange-400 py-6">{t('Không tải được danh sách màu')}</p>
                  )}
                </div>
              )}

              {translatedSelectedItem.cate_id === 'TCG-CAT-002' && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-accent flex items-center gap-3">
                      <i data-feather="ruler" className="w-7 h-7"></i>
                      {translatedSelectedItem.size ? t('Thay đổi kích cỡ') : t('Chọn kích cỡ (Size)')}
                    </h3>
                  </div>

                  {loadingSizes ? (
                    <div className="flex justify-center py-8">
                      <i data-feather="loader" className="animate-spin w-10 h-10 text-primary"></i>
                    </div>
                  ) : sizes.length > 0 ? (
                    <>
                      <div className="flex flex-wrap gap-5 justify-center">
                        {translatedSizes.map(size => (
                          <button
                            key={size.size_id}
                            onClick={() => setSelectedSizeId(size.size_id)}
                            className={`relative w-16 h-16 rounded-full border-4 font-bold text-lg transition-all duration-300 hover:scale-110 flex items-center justify-center shadow-lg ${selectedSizeId === size.size_id
                              ? 'border-primary ring-4 ring-primary/40 bg-primary text-white shadow-2xl scale-110'
                              : 'border-gray-400 hover:border-primary/70 bg-secondary text-accent'
                              }`}
                          >
                            {size.size_name}
                            {selectedSizeId === size.size_id && (
                              <div className="absolute inset-0 rounded-full border-4 border-white animate-pulse"></div>
                            )}
                          </button>
                        ))}
                      </div>

                      <button
                        onClick={confirmSize}
                        disabled={loadingVariant}
                        className="w-full bg-primary/90 hover:bg-primary text-white font-bold text-lg py-4 rounded-xl transition shadow-lg hover:shadow-xl disabled:opacity-60"
                      >
                        {translatedSelectedItem.size ? t('CẬP NHẬT SIZE & GIÁ') : t('XÁC NHẬN CHỌN SIZE')}
                      </button>
                    </>
                  ) : (
                    <p className="text-center text-orange-400 py-6">{t('Không tải được danh sách size')}</p>
                  )}
                </div>
              )}

              {(translatedVariantData?.product_desc || translatedSelectedItem.description) && (
                <div>
                  <span className="text-accent/70 block mb-2">{t('Mô tả sản phẩm:')}</span>
                  <p className="text-accent/90 leading-relaxed whitespace-pre-wrap">
                    {translatedVariantData?.product_desc ? translatedVariantData.product_desc : (translatedSelectedItem.description ? translatedSelectedItem.description : '')}
                  </p>
                </div>
              )}
            </div>

            <div className="mt-12 text-center">
              <button onClick={() => setSelectedItem(null)} className="bg-primary hover:bg-primary/90 text-white font-bold py-3 px-16 rounded-xl text-lg shadow-lg hover:shadow-xl transition">
                {t('Đóng')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CẢNH BÁO */}
      {showCheckoutWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={() => setShowCheckoutWarning(false)}>
          <div className="bg-secondary border-2 border-orange-500 rounded-2xl p-8 max-w-2xl w-full mx-4 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="text-center">
              <i data-feather="alert-triangle" className="w-20 h-20 text-orange-500 mx-auto mb-4"></i>
              <h2 className="text-4xl font-bold font-orbitron text-orange-500 mb-6">
                {t('KHÔNG THỂ THANH TOÁN NGAY!')}
              </h2>
              <p className="text-xl text-accent/90 mb-6">
                {t('Giỏ hàng có')} <strong className="text-orange-400">{contactItems.length}</strong> {t('sản phẩm chưa có giá chính xác:')}
              </p>
              <div className="bg-orange-900/20 border border-orange-500/50 rounded-xl p-6 mb-8 max-h-96 overflow-y-auto text-left">
                {translatedContactItems.map((item, idx) => (
                  <div key={idx} className="mb-4 pb-4 border-b border-orange-500/30 last:border-0">
                    <p className="font-bold text-lg text-accent">{item.name ? item.name : t('Sản phẩm')}</p>
                    <p className="text-orange-400">
                      → {item.cate_id === 'TCG-CAT-001' ? `${t('Màu:')} ${item.color ? item.color : t('Chưa chọn')}` : `${t('Size:')} ${item.size ? item.size : t('Chưa chọn')}`}
                    </p>
                  </div>
                ))}
              </div>
              <p className="text-lg text-accent/80 mb-10">
                {t('Vui lòng')} <strong className="text-primary">{t('nhấn vào sản phẩm')}</strong> {t('để chọn lại màu/size có giá hoặc')} <strong>{t('liên hệ shop')}</strong> {t('trước khi thanh toán!')}
              </p>
              <button
                onClick={() => setShowCheckoutWarning(false)}
                className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 px-16 rounded-xl text-xl transition shadow-lg hover:shadow-xl"
              >
                {t('ĐÃ HIỂU - QUAY LẠI CHỈNH SỬA')}
              </button>
            </div>
          </div>
        </div>
      )}

      {cartItems.length > 0 && (
        <section className="py-16 bg-black mt-20">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl max-[767px]:text-2xl max-[499px]:text-xl max-[374px]:text-lg font-bold mb-10 text-center font-orbitron text-accent">
              {t('SẢN PHẨM BẠN ĐÃ XEM GẦN ĐÂY')}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-[499px]:gap-4 max-[374px]:grid-cols-1">
              {recentlyViewedProducts.map(p => (
                <div key={p.id} className="bg-secondary/50 rounded-lg overflow-hidden border border-primary/20 hover:border-primary transition hover:shadow-2xl group">
                  <img src={p.image} alt={p.name} className="w-full h-48 object-cover group-hover:scale-105 transition" />
                  <div className="p-4">
                    <h3 className="text-sm font-semibold line-clamp-2 mb-2">{p.name}</h3>
                    <div className="flex justify-between items-center">
                      <span className="text-primary font-bold text-lg">{formatVND(p.price)}</span>
                      <button
                        onClick={() => addToCart({
                          id: p.id, name: p.name, price: p.price, image: p.image,
                          cate_id: p.id === '2' ? 'TCG-CAT-002' : 'TCG-CAT-001',
                          size: p.id === '2' ? 'L' : undefined,
                          color: p.id !== '2' ? 'Đen' : undefined
                        })}
                        className="bg-primary p-3 rounded-full text-white hover:scale-110 transition shadow-lg"
                      >
                        <i data-feather="shopping-cart" className="h-5 h-5"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default Cart;