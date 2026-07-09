// src/pages/Wishlist.tsx
import React, { useEffect, useState, useCallback, useRef } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import feather from 'feather-icons';
import './wishlist.css';

import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { useTranslation } from 'react-i18next';
import { autoTranslate } from '../../utils/autoTranslate';

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
  price: number;
  product_image: string;
  product_name: string;
  product_desc?: string;
}

const Wishlist: React.FC = () => {
  const { wishlist, removeFromWishlist, clearWishlist, updateWishlistItem } = useWishlist();
  const { addToCart } = useCart();
  const { success } = useToast();
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;

  const [selectedItem, setSelectedItem] = useState<any>(null);

  const [translatedWishlist, setTranslatedWishlist] = useState<any[]>([]);
  const [translatedVariantData, setTranslatedVariantData] = useState<VariantData | null>(null);
  const [translatedColors, setTranslatedColors] = useState<ColorOption[]>([]);
  const [translatedSizes, setTranslatedSizes] = useState<SizeOption[]>([]);
  const [translatedSelectedItem, setTranslatedSelectedItem] = useState<any>(null);

  const [colors, setColors] = useState<ColorOption[]>([]);
  const [loadingColors, setLoadingColors] = useState(false);
  const [selectedColorId, setSelectedColorId] = useState<string>('');

  const [sizes, setSizes] = useState<SizeOption[]>([]);
  const [loadingSizes, setLoadingSizes] = useState(false);
  const [selectedSizeId, setSelectedSizeId] = useState<string>('');

  const [variantData, setVariantData] = useState<VariantData | null>(null);
  const [loadingVariant, setLoadingVariant] = useState(false);

  useEffect(() => {
    const translateItems = async () => {
      if (currentLang !== 'en') {
        setTranslatedWishlist(wishlist);
        return;
      }
      const translated = await Promise.all(
        wishlist.map(async (item) => ({
          ...item,
          name: item.name ? await autoTranslate(item.name) : undefined,
          description: item.description ? await autoTranslate(item.description) : undefined,
          color: item.color ? await autoTranslate(item.color) : undefined,
          size: item.size ? await autoTranslate(item.size) : undefined,
        }))
      );
      setTranslatedWishlist(translated);
    };
    translateItems();
  }, [wishlist, currentLang]);

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


  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    AOS.init({ duration: 800, easing: 'ease-in-out', once: true });
    feather.replace();

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedItem(null);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  useEffect(() => {
    feather.replace();
  }, [selectedItem, wishlist]);

  const closeModal = useCallback(() => {
    setSelectedItem(null);
    setColors([]);
    setSizes([]);
    setVariantData(null);
    setSelectedColorId('');
    setSelectedSizeId('');
    setLoadingColors(false);
    setLoadingSizes(false);
    setLoadingVariant(false);

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!selectedItem) {
      closeModal();
      return;
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    const loadInitialData = async () => {
      if (selectedItem.cate_id === 'TCG-CAT-001') {
        await fetchColors(controller.signal);
        if (selectedItem.colorId) {
          setSelectedColorId(selectedItem.colorId);
          await fetchVariant('gear', selectedItem.id, selectedItem.colorId, controller.signal);
        }
      }

      if (selectedItem.cate_id === 'TCG-CAT-002') {
        await fetchSizes(controller.signal);
        if (selectedItem.sizeId) {
          setSelectedSizeId(selectedItem.sizeId);
          await fetchVariant('jersey', selectedItem.id, selectedItem.sizeId, controller.signal);
        }
      }
    };

    loadInitialData();

    return () => {
      controller.abort();
    };
  }, [selectedItem]);

  useEffect(() => {
    if (!selectedItem || !abortControllerRef.current) return;

    const controller = abortControllerRef.current;

    if (selectedItem.cate_id === 'TCG-CAT-001' && selectedColorId) {
      fetchVariant('gear', selectedItem.id, selectedColorId, controller.signal);
    }
    if (selectedItem.cate_id === 'TCG-CAT-002' && selectedSizeId) {
      fetchVariant('jersey', selectedItem.id, selectedSizeId, controller.signal);
    }
  }, [selectedColorId, selectedSizeId, selectedItem]);

  const fetchColors = async (signal?: AbortSignal) => {
    setLoadingColors(true);
    try {
      const res = await fetch('http://localhost:3000/api/user/colors', { signal });
      if (!res.ok) throw new Error('Failed to fetch colors');
      const json = await res.json();
      if (json.status === 'success' && Array.isArray(json.data)) {
        setColors(json.data);
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.error('Lỗi tải danh sách màu:', err);
      }
    } finally {
      if (!signal?.aborted) setLoadingColors(false);
    }
  };

  const fetchSizes = async (signal?: AbortSignal) => {
    setLoadingSizes(true);
    try {
      const res = await fetch('http://localhost:3000/api/user/sizes', { signal });
      if (!res.ok) throw new Error('Failed to fetch sizes');
      const json = await res.json();
      if (json.status === 'success' && Array.isArray(json.data)) {
        setSizes(json.data);
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.error('Lỗi tải danh sách size:', err);
      }
    } finally {
      if (!signal?.aborted) setLoadingSizes(false);
    }
  };

  const fetchVariant = async (
    type: 'gear' | 'jersey',
    productId: string,
    variantId: string,
    signal?: AbortSignal
  ) => {
    setLoadingVariant(true);
    setVariantData(null); // Reset ngay khi gọi API

    try {
      const res = await fetch(
        `http://localhost:3000/api/user/variants/products/${type}/${productId}/${variantId}`,
        { signal }
      );

      if (!res.ok) {
        setVariantData(null);
        return;
      }

      const json = await res.json();

      if (json.status !== 'success' || !json.data || !json.data.price || json.data.price <= 0) {
        setVariantData(null);
        return;
      }

      setVariantData(json.data);
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.error('Lỗi lấy thông tin variant:', err);
        setVariantData(null);
      }
    } finally {
      if (!signal?.aborted) setLoadingVariant(false);
    }
  };

  const confirmColor = () => {
    if (!selectedItem || !selectedColorId) return;
    const chosen = colors.find((c) => c.color_id === selectedColorId);
    if (!chosen) return;

    const updatedItem = {
      ...selectedItem,
      color: chosen.color_name,
      colorId: chosen.color_id,
      colorCode: chosen.color_code,
      price: variantData && variantData.price > 0 ? variantData.price : 0,
      image: variantData?.product_image || selectedItem.image,
      name: variantData?.product_name || selectedItem.name,
      description: variantData?.product_desc || selectedItem.description,
    };

    updateWishlistItem(selectedItem.id, updatedItem);
    success?.(t('Đã cập nhật màu sắc!'), t(chosen.color_name));
    closeModal();
  };

  const confirmSize = () => {
    if (!selectedItem || !selectedSizeId) return;
    const chosen = sizes.find((s) => s.size_id === selectedSizeId);
    if (!chosen) return;

    const updatedItem = {
      ...selectedItem,
      size: chosen.size_name,
      sizeId: chosen.size_id,
      price: variantData && variantData.price > 0 ? variantData.price : 0,
      image: variantData?.product_image || selectedItem.image,
      name: variantData?.product_name || selectedItem.name,
      description: variantData?.product_desc || selectedItem.description,
    };

    updateWishlistItem(selectedItem.id, updatedItem);
    success?.(t('Đã cập nhật kích cỡ!'), t(chosen.size_name));
    closeModal();
  };

  const handleAddToCart = (item: any, e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart({
      id: item.id,
      name: item.name || t('Sản phẩm'),
      price: item.price ?? 0,
      image: item.image || '/placeholder.jpg',
      cate_id: item.cate_id || '',
      color: item.color,
      colorId: item.colorId,
      colorCode: item.colorCode,
      size: item.size,
      sizeId: item.sizeId,
    });
    success?.(t('Đã thêm vào giỏ hàng!'), item.name ? t(item.name) : t('Sản phẩm'));
  };

  const handleRemove = (id: string, name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    removeFromWishlist(id);
    success?.(t('Đã xóa khỏi danh sách yêu thích'), name ? t(name) : t('Sản phẩm'));
  };

  const formatVND = (amount: number) =>
    new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(amount);

  const isEmpty = wishlist.length === 0;

  return (
    <main className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8" data-aos="fade-up">
        <h1 className="text-3xl md:text-4xl max-[499px]:text-2xl max-[374px]:text-xl font-bold font-orbitron text-accent">
          {t('DANH SÁCH YÊU THÍCH CỦA BẠN')}
        </h1>
        <div className="flex items-center gap-2 max-[499px]:text-sm">
          <span className="text-accent/70 font-open-sans">{wishlist.length} {t('mặt hàng')}</span>
          {wishlist.length > 0 && (
            <button
              onClick={() => {
                clearWishlist();
                success?.(t('Đã xóa toàn bộ danh sách yêu thích'), '');
              }}
              className="text-primary hover:text-primary/80 transition font-open-sans"
              aria-label={t('Xóa toàn bộ')}
            >
              <i data-feather="trash-2" className="h-5 w-5"></i>
            </button>
          )}
        </div>
      </div>

      <div
        id="wishlist-items"
        className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-[499px]:gap-4 ${isEmpty ? 'hidden' : ''}`}
      >
        {translatedWishlist.map((item, index) => {
          const isGear = item.cate_id === 'TCG-CAT-001';
          const isJersey = item.cate_id === 'TCG-CAT-002';
          const uniqueKey = `${item.id}-${item.colorId || ''}-${item.sizeId || ''}`;

          const hasValidPrice = item.price > 0;
          const needsVariant = (isGear && !item.colorId) || (isJersey && !item.sizeId);

          return (
            <div
              key={uniqueKey}
              className="product-card bg-secondary/50 rounded-lg overflow-hidden border border-primary/20 cursor-pointer hover:border-primary/60 hover:shadow-xl transition-all duration-300"
              data-aos="fade-up"
              data-aos-delay={index * 100}
              onClick={() => setSelectedItem(item)}
            >
              <div className="relative">
                <img
                  src={item.image || '/placeholder.jpg'}
                  alt={item.name ? item.name : t('Sản phẩm')}
                  className="w-full h-64 object-cover"
                  loading="lazy"
                  onError={(e) => (e.currentTarget.src = '/placeholder.jpg')}
                />
                <button
                  onClick={(e) => handleRemove(item.id, item.name ? item.name : t('Sản phẩm'), e)}
                  className="remove-wishlist absolute top-4 right-4 text-primary hover:text-red-500 bg-black/60 hover:bg-red-600/80 rounded-full p-2.5 transition-all backdrop-blur-sm z-10"
                  aria-label={t('Xóa khỏi yêu thích')}
                >
                  <i data-feather="x" className="h-5 w-5"></i>
                </button>
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2 font-open-sans text-accent line-clamp-2">
                  {item.name ? item.name : t('Sản phẩm')}
                </h3>

                {(isGear || isJersey) && (
                  <div className="flex flex-wrap gap-4 text-sm font-open-sans text-accent/80 mb-3">
                    {isGear && (
                      <div className="flex items-center gap-2">
                        <span className="text-accent/70">{t('Màu:')}</span>
                        {item.color && item.colorCode ? (
                          <div className="flex items-center gap-2">
                            <div
                              className="w-5 h-5 rounded-full border-2 border-white shadow-md ring-1 ring-gray-700"
                              style={{ backgroundColor: item.colorCode }}
                              title={t(item.color)}
                            />
                            <span className="font-medium">{t(item.color)}</span>
                          </div>
                        ) : (
                          <span className="italic text-accent/50">{t('Chưa chọn màu')}</span>
                        )}
                      </div>
                    )}
                    {isJersey && (
                      <div className="flex items-center gap-2">
                        <i data-feather="maximize-2" className="h-4 w-4 text-accent/60"></i>
                        <span>
                          {t('Size:')}{' '}
                          {item.size ? (
                            <strong>{item.size}</strong>
                          ) : (
                            <span className="italic text-accent/50">{t('Chưa chọn')}</span>
                          )}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between mt-4">
                  <span className="text-primary font-bold font-open-sans text-lg">
                    {hasValidPrice ? (
                      needsVariant ? (
                        `${t('Từ')} ${formatVND(item.price)}`
                      ) : (
                        formatVND(item.price)
                      )
                    ) : (
                      <span className="text-orange-500 font-bold">{t('Liên hệ')}</span>
                    )}
                  </span>

                  <div className="flex gap-2">
                    <button
                      onClick={(e) => handleAddToCart(item, e)}
                      className="add-to-cart bg-primary hover:bg-primary/90 text-white p-3 rounded-lg transition-all shadow-md hover:shadow-lg hover:scale-110"
                      aria-label={t('Thêm vào giỏ hàng')}
                    >
                      <i data-feather="shopping-cart" className="h-5 w-5"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div id="empty-wishlist" className={`text-center py-20 ${isEmpty ? '' : 'hidden'}`} data-aos="fade-up">
        <div className="flex flex-col items-center justify-center space-y-8">
          <div className="relative">
            <i data-feather="heart" className="h-28 w-28 md:h-32 md:w-32 text-primary/20 stroke-current"></i>
            <i
              data-feather="heart"
              className="absolute inset-0 h-28 w-28 md:h-32 md:w-32 text-primary stroke-current animate-pulse"
              style={{ strokeWidth: 1.5 }}
            ></i>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl max-[499px]:text-2xl max-[374px]:text-xl font-bold font-orbitron text-accent leading-tight">
            {t('DANH SÁCH YÊU THÍCH CỦA BẠN TRỐNG')}
          </h2>
          <p className="text-accent/70 text-lg max-[499px]:text-base max-w-md mx-auto font-open-sans px-4">
            {t('Bạn chưa thêm bất kỳ mặt hàng nào vào danh sách yêu thích. Hãy bắt đầu mua sắm ngay!')}
          </p>
          <a
            href="/shop"
            className="bg-primary hover:bg-primary/90 text-white px-10 py-4 max-[499px]:px-6 max-[499px]:py-3 max-[499px]:text-base rounded-lg font-bold text-lg transition-all duration-300 font-orbitron inline-block shadow-lg hover:shadow-primary/50 transform hover:-translate-y-1"
          >
            {t('BẮT ĐẦU MUA SẮM')}
          </a>
        </div>
      </div>

      {translatedSelectedItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={closeModal}
        >
          <div
            className="bg-secondary border-2 border-primary/40 rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl md:text-3xl max-[499px]:text-xl font-bold font-orbitron text-accent">
                {translatedVariantData?.product_name ? translatedVariantData.product_name : (translatedSelectedItem.name ? translatedSelectedItem.name : t('Sản phẩm'))}
              </h2>
              <button onClick={closeModal} className="text-accent/60 hover:text-red-500 transition p-2">
                <i data-feather="x" className="w-8 h-8"></i>
              </button>
            </div>

            <img
              src={translatedVariantData?.product_image || translatedSelectedItem.image || '/placeholder.jpg'}
              alt={translatedVariantData?.product_name ? translatedVariantData.product_name : (translatedSelectedItem.name ? translatedSelectedItem.name : t('Sản phẩm'))}
              className="w-full h-80 object-cover rounded-xl mb-6 border border-primary/20"
              onError={(e) => (e.currentTarget.src = '/placeholder.jpg')}
            />

            <div className="space-y-8 text-lg max-[499px]:text-base max-[499px]:space-y-4">
              <div>
                <span className="text-accent/70">{t('Giá:')}</span>{' '}
                {loadingVariant ? (
                  <span className="text-gray-400 font-bold text-2xl">{t('Đang tải giá...')}</span>
                ) : translatedVariantData && translatedVariantData.price > 0 ? (
                  <span className="text-primary font-bold text-3xl">
                    {formatVND(translatedVariantData.price)}
                  </span>
                ) : (
                  <span className="text-orange-500 font-bold text-3xl animate-pulse">
                    {t('Liên hệ để biết giá')}
                  </span>
                )}
              </div>

              {(translatedSelectedItem.cate_id === 'TCG-CAT-001' || translatedSelectedItem.cate_id === 'TCG-CAT-002') && (
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
                    <div className="flex justify-center py-8">
                      <i data-feather="loader" className="animate-spin w-10 h-10 text-primary"></i>
                    </div>
                  ) : colors.length > 0 ? (
                    <>
                      <div className="flex flex-wrap gap-5 justify-center">
                        {translatedColors.map((color) => (
                          <button
                            key={color.color_id}
                            onClick={() => setSelectedColorId(color.color_id)}
                            className={`relative w-14 h-14 rounded-full border-4 transition-all duration-300 hover:scale-110 ${
                              selectedColorId === color.color_id
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
                        className="w-full bg-primary hover:bg-primary/90 text-white font-bold text-lg py-4 rounded-xl transition shadow-lg hover:shadow-xl disabled:opacity-60"
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
                        {translatedSizes.map((size) => (
                          <button
                            key={size.size_id}
                            onClick={() => setSelectedSizeId(size.size_id)}
                            className={`relative w-16 h-16 rounded-full border-4 font-bold text-lg transition-all duration-300 hover:scale-110 flex items-center justify-center shadow-lg ${
                              selectedSizeId === size.size_id
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
                        className="w-full bg-primary hover:bg-primary/90 text-white font-bold text-lg py-4 rounded-xl transition shadow-lg hover:shadow-xl disabled:opacity-60"
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
              <button
                onClick={closeModal}
                className="bg-primary hover:bg-primary/90 text-white font-bold py-3 px-16 rounded-xl text-lg shadow-lg hover:shadow-xl transition"
              >
                {t('Đóng')}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Wishlist;