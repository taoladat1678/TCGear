import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import feather from 'feather-icons';
import { useCart } from '../../context/CartContext';
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
  price: number;
  product_image: string;
  product_name: string;
  product_desc?: string;
}

const Cart: React.FC = () => {
  const { cartItems, updateQuantity, removeItem, clearCart, addToCart } = useCart();
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const [showCheckoutWarning, setShowCheckoutWarning] = useState(false);

  const [colors, setColors] = useState<ColorOption[]>([]);
  const [loadingColors, setLoadingColors] = useState(false);
  const [selectedColorId, setSelectedColorId] = useState<string>('');

  const [sizes, setSizes] = useState<SizeOption[]>([]);
  const [loadingSizes, setLoadingSizes] = useState(false);
  const [selectedSizeId, setSelectedSizeId] = useState<string>('');

  const [variantData, setVariantData] = useState<VariantData | null>(null);
  const [loadingVariant, setLoadingVariant] = useState(false);

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

    const newItem = variantData
      ? {
          ...selectedItem,
          color: chosen.color_name,
          colorId: chosen.color_id,
          price: variantData.price,
          image: variantData.product_image,
          name: variantData.product_name,
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

    const newItem = variantData
      ? {
          ...selectedItem,
          size: chosen.size_name,
          sizeId: chosen.size_id,
          price: variantData.price,
          image: variantData.product_image,
          name: variantData.product_name,
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

  // ĐÃ CHỈNH SỬA TẠI ĐÂY – Bắt cả NaN, null, undefined, âm
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
        !isValidPrice ||                                      // NaN, null, undefined, <= 0 → cần liên hệ
        (!item.colorId && item.cate_id === 'TCG-CAT-001') ||
        (!item.sizeId && item.cate_id === 'TCG-CAT-002')
      )
    );
  };

  const contactItems = cartItems.filter(needsContactForPrice);

  const handleCheckout = () => {
    if (contactItems.length > 0) {
      setShowCheckoutWarning(true);
    } else {
      alert('Đang chuyển đến trang thanh toán...');
    }
  };

  const subtotal = cartItems.reduce((sum, item) => {
    if (needsContactForPrice(item)) return sum;
    return sum + item.price * item.quantity;
  }, 0);
  const shipping = subtotal >= 500000 ? 0 : 30000;
  const total = subtotal + shipping;

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
        <h1 className="text-3xl md:text-4xl font-bold mb-10 font-orbitron text-accent text-center" data-aos="fade-up">
          GIỎ HÀNG CỦA BẠN
        </h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-20" data-aos="fade-up">
            <i data-feather="shopping-cart" className="h-20 w-20 text-primary mb-6 inline-block"></i>
            <h2 className="text-2xl font-bold mb-4 font-orbitron text-accent">Giỏ hàng trống</h2>
            <Link to="/" className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-lg font-bold text-lg transition inline-block">
              Tiếp tục mua sắm
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
            <div className="lg:col-span-2 space-y-5">
              {cartItems.map((item, index) => (
                <div
                  key={item.id + (item.colorId || '') + (item.sizeId || '')}
                  className="bg-secondary/50 rounded-xl border border-primary/20 p-5 flex items-center gap-6 hover:border-primary/50 hover:shadow-lg transition-all duration-300"
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  <img src={item.image || '/placeholder.jpg'} alt={item.name} className="w-24 h-24 object-cover rounded-lg border border-primary/10" loading="lazy" />

                  <div className="flex-1 min-w-0">
                    <div className="cursor-pointer" onClick={() => setSelectedItem(item)}>
                      <h3 className="font-bold text-lg font-orbitron text-accent truncate hover:text-primary transition">{item.name}</h3>
                      {item.description && <p className="text-sm text-accent/70 mt-1 line-clamp-2">{item.description}</p>}

                      {item.cate_id === 'TCG-CAT-001' && (
                        <div className="mt-2 text-sm font-medium">
                          <span className="text-accent/80">Màu: </span>
                          <span className={`font-semibold ${item.color ? 'text-primary' : 'text-orange-400'}`}>
                            {item.color || 'Chưa chọn'}
                          </span>
                        </div>
                      )}

                      {item.cate_id === 'TCG-CAT-002' && (
                        <div className="mt-2 text-sm font-medium">
                          <span className="text-accent/80">Size: </span>
                          <span className={`font-semibold ${item.size ? 'text-primary' : 'text-orange-400'}`}>
                            {item.size || 'Chưa chọn'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="text-center hidden sm:block">
                    {needsContactForPrice(item) ? (
                      <div className="text-orange-500 font-bold text-lg animate-pulse">Liên hệ</div>
                    ) : (
                      <>
                        <div className="text-primary font-bold text-lg">{formatVND(item.price)}</div>
                        <div className="text-xs text-accent/60">/ chiếc</div>
                      </>
                    )}
                  </div>

                  <div className="flex items-center border border-primary/30 rounded-lg bg-secondary/80">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-10 h-10 hover:bg-primary/20 transition text-lg">−</button>
                    <span className="w-14 text-center font-bold text-base">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-10 h-10 hover:bg-primary/20 transition text-lg">+</button>
                  </div>

                  <div className="text-right">
                    <div className="text-xl font-bold whitespace-nowrap">
                      {needsContactForPrice(item) ? (
                        <span className="text-orange-500 animate-pulse">Liên hệ</span>
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
                    className="text-red-500 hover:text-red-600 hover:bg-red-500/10 p-2.5 rounded-full transition ml-2"
                  >
                    <i data-feather="trash-2" className="w-5 h-5"></i>
                  </button>
                </div>
              ))}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-secondary/70 border-2 border-primary/30 rounded-2xl p-6 lg:p-8 sticky top-24 shadow-2xl">
                <h2 className="text-2xl font-bold mb-7 font-orbitron text-accent">TÓM TẮT ĐƠN HÀNG</h2>
                <div className="space-y-4 text-base">
                  <div className="flex justify-between">
                    <span className="text-accent/90">Tổng tiền hàng</span>
                    <span className="font-semibold text-lg">{formatVND(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-accent/90">Phí vận chuyển</span>
                    <span className={`font-semibold text-lg ${subtotal >= 500000 ? 'text-green-400' : ''}`}>
                      {subtotal >= 500000 ? 'Miễn phí' : formatVND(shipping)}
                    </span>
                  </div>
                  {subtotal >= 500000 && (
                    <div className="bg-green-500/20 text-green-400 px-4 py-3 rounded-lg text-center font-bold text-sm flex items-center justify-center gap-2 mt-4">
                      <i data-feather="gift" className="h-5 w-5"></i>
                      ĐÃ ĐƯỢC MIỄN PHÍ SHIP!
                    </div>
                  )}
                </div>

                <div className="mt-7 pt-6 border-t-2 border-primary/40">
                  <div className="flex justify-between items-center gap-3 mb-8">
                    <span className="text-xl font-bold text-accent whitespace-nowrap">TỔNG CỘNG</span>
                    <span className="text-primary font-bold text-2xl whitespace-nowrap">{formatVND(total)}</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className={`w-full font-orbitron font-bold text-lg py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] ${
                    contactItems.length > 0
                      ? 'bg-orange-600 hover:bg-orange-700 text-white cursor-not-allowed'
                      : 'bg-primary hover:bg-primary/90 text-white'
                  }`}
                >
                  {contactItems.length > 0 ? `CÓ ${contactItems.length} SẢN PHẨM CẦN LIÊN HỆ` : 'TIẾN HÀNH THANH TOÁN'}
                </button>

                <button onClick={clearCart} className="w-full mt-4 border-2 border-red-600 text-red-500 hover:bg-red-600 hover:text-white font-orbitron font-bold text-lg py-4 rounded-xl transition-all duration-300">
                  XÓA TOÀN BỘ GIỎ HÀNG
                </button>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* MODAL CHI TIẾT SẢN PHẨM */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={() => setSelectedItem(null)}>
          <div className="bg-secondary border-2 border-primary/40 rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl md:text-3xl font-bold font-orbitron text-accent">
                {variantData?.product_name || selectedItem.name}
              </h2>
              <button onClick={() => setSelectedItem(null)} className="text-accent/60 hover:text-red-500 transition p-2">
                <i data-feather="x" className="w-8 h-8"></i>
              </button>
            </div>

            <img
              src={variantData?.product_image || selectedItem.image || '/placeholder.jpg'}
              alt={variantData?.product_name || selectedItem.name}
              className="w-full h-80 object-cover rounded-xl mb-6 border border-primary/20"
            />

            <div className="space-y-8 text-lg">
              <div>
                <span className="text-accent/70">Giá:</span>{' '}
                {loadingVariant ? (
                  <span className="text-gray-400 font-bold text-2xl">Đang tải giá...</span>
                ) : variantData && variantData.price != null && !isNaN(variantData.price) && variantData.price > 0 ? (
                  <span className="text-primary font-bold text-3xl">{formatVND(variantData.price)}</span>
                ) : (
                  <span className="text-orange-500 font-bold text-3xl animate-pulse">Liên hệ để biết giá</span>
                )}
              </div>

              {(selectedItem.cate_id === 'TCG-CAT-001' || selectedItem.cate_id === 'TCG-CAT-002') && (
                <div className="bg-orange-500/15 border border-orange-500/50 text-orange-400 px-5 py-4 rounded-xl flex items-start gap-3">
                  <i data-feather="alert-triangle" className="w-6 h-6 flex-shrink-0 mt-0.5"></i>
                  <div className="text-sm md:text-base leading-relaxed">
                    <strong>Lưu ý:</strong> Giá có thể thay đổi tùy theo{' '}
                    {selectedItem.cate_id === 'TCG-CAT-001' ? 'màu sắc' : 'kích cỡ'}.
                  </div>
                </div>
              )}

              {selectedItem.cate_id === 'TCG-CAT-001' && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-accent flex items-center gap-3">
                      <i data-feather="palette" className="w-7 h-7"></i>
                      {selectedItem.color ? 'Thay đổi màu sắc' : 'Chọn màu sắc'}
                    </h3>
                  </div>

                  {loadingColors ? (
                    <div className="flex justify-center py8">
                      <i data-feather="loader" className="animate-spin w-10 h-10 text-primary"></i>
                    </div>
                  ) : colors.length > 0 ? (
                    <>
                      <div className="flex flex-wrap gap-5 justify-center">
                        {colors.map(color => (
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
                        {selectedItem.color ? 'CẬP NHẬT MÀU & GIÁ' : 'XÁC NHẬN CHỌN MÀU'}
                      </button>
                    </>
                  ) : (
                    <p className="text-center text-orange-400 py-6">Không tải được danh sách màu</p>
                  )}
                </div>
              )}

              {selectedItem.cate_id === 'TCG-CAT-002' && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-accent flex items-center gap-3">
                      <i data-feather="ruler" className="w-7 h-7"></i>
                      {selectedItem.size ? 'Thay đổi kích cỡ' : 'Chọn kích cỡ (Size)'}
                    </h3>
                  </div>

                  {loadingSizes ? (
                    <div className="flex justify-center py-8">
                      <i data-feather="loader" className="animate-spin w-10 h-10 text-primary"></i>
                    </div>
                  ) : sizes.length > 0 ? (
                    <>
                      <div className="flex flex-wrap gap-5 justify-center">
                        {sizes.map(size => (
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
                        {selectedItem.size ? 'CẬP NHẬT SIZE & GIÁ' : 'XÁC NHẬN CHỌN SIZE'}
                      </button>
                    </>
                  ) : (
                    <p className="text-center text-orange-400 py-6">Không tải được danh sách size</p>
                  )}
                </div>
              )}

              {(variantData?.product_desc || selectedItem.description) && (
                <div>
                  <span className="text-accent/70 block mb-2">Mô tả sản phẩm:</span>
                  <p className="text-accent/90 leading-relaxed whitespace-pre-wrap">
                    {variantData?.product_desc || selectedItem.description}
                  </p>
                </div>
              )}
            </div>

            <div className="mt-12 text-center">
              <button onClick={() => setSelectedItem(null)} className="bg-primary hover:bg-primary/90 text-white font-bold py-3 px-16 rounded-xl text-lg shadow-lg hover:shadow-xl transition">
                Đóng
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
                KHÔNG THỂ THANH TOÁN NGAY!
              </h2>
              <p className="text-xl text-accent/90 mb-6">
                Giỏ hàng có <strong className="text-orange-400">{contactItems.length}</strong> sản phẩm chưa có giá chính xác:
              </p>
              <div className="bg-orange-900/20 border border-orange-500/50 rounded-xl p-6 mb-8 max-h-96 overflow-y-auto text-left">
                {contactItems.map((item, idx) => (
                  <div key={idx} className="mb-4 pb-4 border-b border-orange-500/30 last:border-0">
                    <p className="font-bold text-lg text-accent">{item.name}</p>
                    <p className="text-orange-400">
                      → {item.cate_id === 'TCG-CAT-001' ? `Màu: ${item.color || 'Chưa chọn'}` : `Size: ${item.size || 'Chưa chọn'}`}
                    </p>
                  </div>
                ))}
              </div>
              <p className="text-lg text-accent/80 mb-10">
                Vui lòng <strong className="text-primary">nhấn vào sản phẩm</strong> để chọn lại màu/size có giá hoặc <strong>liên hệ shop</strong> trước khi thanh toán!
              </p>
              <button
                onClick={() => setShowCheckoutWarning(false)}
                className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 px-16 rounded-xl text-xl transition shadow-lg hover:shadow-xl"
              >
                ĐÃ HIỂU - QUAY LẠI CHỈNH SỬA
              </button>
            </div>
          </div>
        </div>
      )}

      {cartItems.length > 0 && (
        <section className="py-16 bg-black mt-20">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold mb-10 text-center font-orbitron text-accent">
              SẢN PHẨM BẠN ĐÃ XEM GẦN ĐÂY
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
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