import React, { useEffect, useState, useCallback } from 'react';
import './checkout.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import feather from 'feather-icons';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import Preloader from '../Preloader/preloader';

const Checkout: React.FC = () => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;
  const navigate = useNavigate();
  const { success, error: toastError } = useToast();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const getInitialState = (key: string, defaultVal: any) => {
    try {
      const userStr = localStorage.getItem('user');
      const currentUser = userStr ? JSON.parse(userStr) : null;
      const currentUserId = currentUser ? currentUser.user_id : null;

      const saved = sessionStorage.getItem('checkoutState');
      let savedValue = undefined;

      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.savedUserId === currentUserId) {
          savedValue = parsed[key];
        } else {
          sessionStorage.removeItem('checkoutState');
        }
      }

      let userDefault = undefined;
      if (['firstName', 'email', 'phone'].includes(key) && currentUser) {
        if (key === 'firstName') userDefault = currentUser.fullname;
        if (key === 'email') userDefault = currentUser.email;
        if (key === 'phone') userDefault = currentUser.phone;
      }

      if (savedValue !== undefined && savedValue !== '') return savedValue;
      if (userDefault !== undefined && userDefault !== '') return userDefault;
      if (savedValue !== undefined) return savedValue;

    } catch (e) {
      console.error(e);
    }
    return defaultVal;
  };

  const [firstName, setFirstName] = useState(() => getInitialState('firstName', ''));
  const [email, setEmail] = useState(() => getInitialState('email', ''));
  const [phone, setPhone] = useState(() => getInitialState('phone', ''));
  const [address, setAddress] = useState(() => getInitialState('address', ''));
  const [city, setCity] = useState(() => getInitialState('city', ''));
  const [orderNotes, setOrderNotes] = useState(() => getInitialState('orderNotes', ''));
  const [shippingMethod, setShippingMethod] = useState(() => getInitialState('shippingMethod', 'Giao Hàng Tiêu Chuẩn'));
  const [paymentMethod, setPaymentMethod] = useState(() => getInitialState('paymentMethod', 'Thanh Toán Khi Nhận Hàng'));

  const [voucherCodeInput, setVoucherCodeInput] = useState(() => getInitialState('voucherCodeInput', ''));
  const [appliedVoucher, setAppliedVoucher] = useState<any>(() => getInitialState('appliedVoucher', null));
  const [voucherError, setVoucherError] = useState<string | null>(null);
  const [voucherSuccess, setVoucherSuccess] = useState<string | null>(null);

  const [freeshipCodeInput, setFreeshipCodeInput] = useState(() => getInitialState('freeshipCodeInput', ''));
  const [appliedFreeshipVoucher, setAppliedFreeshipVoucher] = useState<any>(() => getInitialState('appliedFreeshipVoucher', null));
  const [freeshipError, setFreeshipError] = useState<string | null>(null);
  const [freeshipSuccess, setFreeshipSuccess] = useState<string | null>(null);

  const translateText = useCallback(
    async (text: string, targetLang: string = currentLang): Promise<string> => {
      if (!text || targetLang === 'vi') return text;

      const cacheKey = `trans_checkout_${text.trim()}_${targetLang}`;
      const cached = localStorage.getItem(cacheKey);
      if (cached) return cached;

      try {
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=vi&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error('Translate failed');
        const data = await response.json();
        const translated = data[0]?.[0]?.[0] || text;
        localStorage.setItem(cacheKey, translated);
        return translated;
      } catch (err) {
        console.error('Lỗi dịch:', err);
        return text;
      }
    },
    [currentLang]
  );

  const [cartItems, setCartItems] = useState<any[]>([]);

  useEffect(() => {
    let itemsToProcess: any[] = [];
    try {
      const storedCheckout = localStorage.getItem('checkoutItems');
      const storedCart = localStorage.getItem('cartItems');
      const cartData = storedCheckout || storedCart;
      
      if (cartData) {
        const parsedCart = JSON.parse(cartData);
        if (Array.isArray(parsedCart) && parsedCart.length > 0) {
          itemsToProcess = parsedCart;
        }
      }
    } catch (e) {
      console.error("Lỗi khi đọc cartItems từ localStorage:", e);
    }

    if (itemsToProcess.length === 0) {
      itemsToProcess = [
        {
          id: 1,
          name: "Tai Nghe Chơi Game Pro",
          variantPrefix: null,
          variant: "Đen/Đỏ",
          price: 129.99,
          quantity: 1,
          image: "https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
        },
        {
          id: 2,
          name: "Áo Đấu Đội T1",
          variantPrefix: "Kích thước",
          variant: "L",
          price: 64.99,
          quantity: 2,
          image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
        }
      ];
    }

    const translateCartItems = async () => {
      if (currentLang === 'vi') {
        setCartItems(itemsToProcess.map(item => ({
          ...item,
          translatedName: item.name,
          translatedVariant: item.variant,
          translatedVariantPrefix: item.variantPrefix,
          translatedColor: item.color,
          translatedSize: item.size
        })));
        return;
      }

      const translatedItems = await Promise.all(itemsToProcess.map(async (item) => {
        return {
          ...item,
          translatedName: await translateText(item.name),
          translatedVariant: item.variant && item.variant !== 'L' ? await translateText(item.variant) : item.variant,
          translatedVariantPrefix: item.variantPrefix ? await translateText(item.variantPrefix) : null,
          translatedColor: item.color ? await translateText(item.color) : item.color,
          translatedSize: item.size
        };
      }));
      setCartItems(translatedItems);
    };

    translateCartItems();
  }, [currentLang, translateText]);

  const handleRemoveItem = (indexToRemove: number) => {
    const updatedCart = cartItems.filter((_, index) => index !== indexToRemove);
    setCartItems(updatedCart);
    localStorage.setItem('cartItems', JSON.stringify(updatedCart));
    window.dispatchEvent(new Event('storage'));
  };

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true
    });
    feather.replace();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    if (token && userStr) {
      setIsLoggedIn(true);

      try {
        const user = JSON.parse(userStr);
        const savedStateStr = sessionStorage.getItem('checkoutState');
        const savedState = savedStateStr ? JSON.parse(savedStateStr) : null;

        const hasValidSavedState = savedState && savedState.savedUserId === user.user_id;

        if (!hasValidSavedState || !savedState.address) {
          const fetchDefaultAddress = async () => {
            if (!user.user_id) return;
            try {
              const res = await fetch(`http://localhost:3000/api/user/addresses/default/${user.user_id}`);
              const data = await res.json();
              if (data.status === 'success' && data.data && data.data.address) {
                setAddress(data.data.address);
              }
            } catch (err) {
              console.error("Lỗi khi lấy địa chỉ mặc định:", err);
            }
          };
          fetchDefaultAddress();
        }
      } catch (error) {
        console.error("Lỗi khi đọc dữ liệu user từ localStorage:", error);
      }
    }
  }, []);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    const currentUser = userStr ? JSON.parse(userStr) : null;
    const currentUserId = currentUser ? currentUser.user_id : null;

    const state = {
      savedUserId: currentUserId,
      firstName,
      email,
      phone,
      address,
      city,
      orderNotes,
      shippingMethod,
      voucherCodeInput,
      appliedVoucher,
      freeshipCodeInput,
      appliedFreeshipVoucher,
      paymentMethod
    };
    sessionStorage.setItem('checkoutState', JSON.stringify(state));
  }, [
    firstName, email, phone, address, city, orderNotes,
    shippingMethod, voucherCodeInput, appliedVoucher,
    freeshipCodeInput, appliedFreeshipVoucher, paymentMethod
  ]);

  const formatPrice = (p: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', minimumFractionDigits: 0 }).format(p);
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  let baseShippingFee = 0;
  if (shippingMethod === 'Giao Hàng Nhanh') {
    baseShippingFee = 50000;
  } else if (shippingMethod === 'Giao Hàng Hỏa Tốc') {
    baseShippingFee = 100000;
  }

  const isFreeshipActive = !!appliedFreeshipVoucher && shippingMethod !== 'Giao Hàng Tiêu Chuẩn';
  const shippingFee = isFreeshipActive ? 0 : baseShippingFee;

  const calculateDiscount = () => {
    if (!appliedVoucher) return 0;

    const totalBeforeDiscount = subtotal + shippingFee;
    let discount = 0;

    if (appliedVoucher.voucher_type === 'Cố định') {
      discount = appliedVoucher.voucher_value;
    } else if (appliedVoucher.voucher_type === 'Phần trăm') {
      discount = totalBeforeDiscount * (appliedVoucher.voucher_value / 100);
      if (appliedVoucher.max_discount !== null && discount > appliedVoucher.max_discount) {
        discount = appliedVoucher.max_discount;
      }
    }

    return discount;
  };

  const discountAmount = calculateDiscount();
  const total = Math.max(subtotal + shippingFee - discountAmount, 0);

  const handleApplyVoucher = async (e: React.MouseEvent) => {
    e.preventDefault();
    setVoucherError(null);
    setVoucherSuccess(null);

    if (!voucherCodeInput.trim()) {
      setVoucherError(t('Vui lòng nhập mã voucher'));
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/user/vouchers');
      const result = await response.json();

      if (result.status === 'success' && Array.isArray(result.data)) {
        const voucher = result.data.find((v: any) => v.voucher_code === voucherCodeInput.trim());

        if (!voucher) {
          setVoucherError(t('Mã voucher không tồn tại'));
          return;
        }

        if (voucher.voucher_usage_time <= 0) {
          setVoucherError(t('Voucher đã hết lượt sử dụng'));
          return;
        }

        const now = new Date();
        const startDate = new Date(voucher.start_date);
        const endDate = new Date(voucher.end_date);

        if (now < startDate || now > endDate) {
          setVoucherError(t('Voucher không trong thời gian sử dụng'));
          return;
        }

        if (subtotal < voucher.min_order_value) {
          setVoucherError(`${t('Đơn hàng chưa đạt giá trị tối thiểu')} ${formatPrice(voucher.min_order_value)}`);
          return;
        }

        setAppliedVoucher(voucher);
        setVoucherSuccess(t('Áp dụng voucher thành công!'));
      } else {
        setVoucherError(t('Không thể lấy dữ liệu voucher'));
      }
    } catch (err) {
      console.error(err);
      setVoucherError(t('Lỗi kết nối khi kiểm tra voucher'));
    }
  };

  const handleRemoveVoucher = () => {
    setAppliedVoucher(null);
    setVoucherCodeInput('');
    setVoucherSuccess(null);
    setVoucherError(null);
  };

  const handleApplyFreeshipVoucher = async (e: React.MouseEvent) => {
    e.preventDefault();
    setFreeshipError(null);
    setFreeshipSuccess(null);

    if (!freeshipCodeInput.trim()) {
      setFreeshipError(t('Vui lòng nhập mã voucher'));
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/user/vouchers');
      const result = await response.json();

      if (result.status === 'success' && Array.isArray(result.data)) {
        const voucher = result.data.find((v: any) => v.voucher_code === freeshipCodeInput.trim());

        if (!voucher) {
          setFreeshipError(t('Mã voucher không tồn tại'));
          return;
        }

        if (voucher.voucher_usage_time <= 0) {
          setFreeshipError(t('Voucher đã hết lượt sử dụng'));
          return;
        }

        const now = new Date();
        const startDate = new Date(voucher.start_date);
        const endDate = new Date(voucher.end_date);

        if (now < startDate || now > endDate) {
          setFreeshipError(t('Voucher không trong thời gian sử dụng'));
          return;
        }

        if (subtotal < voucher.min_order_value) {
          setFreeshipError(`${t('Đơn hàng chưa đạt giá trị tối thiểu')} ${formatPrice(voucher.min_order_value)}`);
          return;
        }

        setAppliedFreeshipVoucher(voucher);
        setFreeshipSuccess(t('Đã áp dụng voucher miễn phí vận chuyển'));
      } else {
        setFreeshipError(t('Không thể lấy dữ liệu voucher'));
      }
    } catch (err) {
      console.error(err);
      setFreeshipError(t('Lỗi kết nối khi kiểm tra voucher'));
    }
  };

  const handleRemoveFreeshipVoucher = () => {
    setAppliedFreeshipVoucher(null);
    setFreeshipCodeInput('');
    setFreeshipSuccess(null);
    setFreeshipError(null);
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const userStr = localStorage.getItem('user');
    const currentUser = userStr ? JSON.parse(userStr) : null;
    const currentUserId = currentUser ? currentUser.user_id : null;

    if (!currentUserId) {
      toastError?.(t("Vui lòng đăng nhập để đặt hàng"));
      return;
    }

    if (cartItems.length === 0) {
      toastError?.(t("Giỏ hàng của bạn đang trống"));
      return;
    }

    setIsProcessing(true);

    try {
      const now = new Date();
      const localDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
      const localTime = now.toTimeString().split(' ')[0];

      const payload = {
        user_id: currentUserId,
        payment_method: paymentMethod,
        shipping_method: shippingMethod,
        note: orderNotes,
        total_amount: total,
        shipping_address: `${address}${city ? ', ' + city : ''}`,
        recipient_name: firstName,
        recipient_phone: phone,
        recipient_email: email,
        order_date: localDate,
        order_time: localTime,
        applied_vouchers: [
          appliedVoucher ? appliedVoucher.voucher_code : null,
          appliedFreeshipVoucher ? appliedFreeshipVoucher.voucher_code : null
        ].filter(Boolean),
        items: cartItems.map((item: any) => {
          const itemRatio = (item.price * item.quantity) / (subtotal || 1);
          const itemDiscount = itemRatio * discountAmount;
          const newPrice = item.price - (itemDiscount / item.quantity);
          return {
            variant_id: item.variant_id || item.sku || item.id,
            quantity: item.quantity,
            price: newPrice
          };
        })
      };

      if (paymentMethod === 'Thanh Toán VNPAY') {
        localStorage.setItem('pending_order_payload', JSON.stringify(payload));
        const res = await fetch('http://localhost:3000/api/payment/vnpay_create_url', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ total_amount: total })
        });
        const data = await res.json();
        if (data.status === 'success' && data.paymentUrl) {
          window.location.href = data.paymentUrl;
        } else {
          toastError?.(t("Lỗi tạo URL thanh toán VNPAY"));
          setIsProcessing(false);
        }
        return; // Dừng lại ở đây vì đã redirect
      }

      if (paymentMethod === 'Chuyển Khoản Ngân Hàng') {
        // Giả lập delay 3 giây
        await new Promise(resolve => setTimeout(resolve, 3000));
      }

      // Xử lý tạo đơn hàng (Cho COD hoặc sau khi giả lập Chuyển Khoản Ngân Hàng)
      const res = await fetch('http://localhost:3000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (data.status === 'success') {
        success?.(t("Đặt hàng thành công!"), t("Cảm ơn bạn đã mua hàng tại TCGear."));
        const storedCheckout = localStorage.getItem('checkoutItems');
        if (storedCheckout) {
          try {
            const checkoutItems = JSON.parse(storedCheckout);
            const storedCart = localStorage.getItem('cartItems');
            if (storedCart) {
              const cartList = JSON.parse(storedCart);
              const remaining = cartList.filter((cItem: any) => 
                !checkoutItems.some((chk: any) => 
                  chk.id === cItem.id && chk.colorId === cItem.colorId && chk.sizeId === cItem.sizeId
                )
              );
              localStorage.setItem('cartItems', JSON.stringify(remaining));
            }
          } catch(e){}
          localStorage.removeItem('checkoutItems');
        } else {
          localStorage.removeItem('cartItems');
        }
        sessionStorage.removeItem('checkoutState');
        window.location.href = '/order-success';
      } else {
        toastError?.(data.message || t("Có lỗi xảy ra khi đặt hàng"));
      }
    } catch (err) {
      console.error(err);
      toastError?.(t("Lỗi kết nối khi đặt hàng"));
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Preloader visible={isProcessing} />
      <main className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-accent">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form giao hàng */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl max-[499px]:text-xl max-[374px]:text-lg font-bold mb-6 font-orbitron" data-aos="fade-up">
            {t("Thông Tin Giao Hàng")}
          </h2>

          <form id="shipping-form" className="space-y-6" data-aos="fade-up" data-aos-delay="100" onSubmit={handleCheckoutSubmit}>
            <div>
              <label htmlFor="first-name" className="block text-sm font-medium mb-1 font-open-sans">
                {isLoggedIn ? t("Tên người nhận") : t("Tên")}
              </label>
              <input
                type="text"
                id="first-name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-4 py-3 rounded-md bg-secondary input-field font-open-sans"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1 font-open-sans">
                {t("Địa Chỉ Email")}
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-md bg-secondary input-field font-open-sans"
                required
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium mb-1 font-open-sans">
                {t("Số Điện Thoại")}
              </label>
              <input
                type="tel"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 rounded-md bg-secondary input-field font-open-sans"
                required
              />
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium mb-1 font-open-sans">
                {t("Địa Chỉ")}
              </label>
              <input
                type="text"
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-4 py-3 rounded-md bg-secondary input-field font-open-sans"
                required
              />
            </div>

            {!isLoggedIn && (
              <div>
                <label htmlFor="city" className="block text-sm font-medium mb-1 font-open-sans">
                  {t("Thành Phố")}
                </label>
                <input
                  type="text"
                  id="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-4 py-3 rounded-md bg-secondary input-field font-open-sans"
                  required
                />
              </div>
            )}

            <div>
              <label htmlFor="order-notes" className="block text-sm font-medium mb-1 font-open-sans">
                {t("Ghi chú đơn hàng (Tùy chọn)")}
              </label>
              <textarea
                id="order-notes"
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                placeholder={t("Ghi chú về đơn hàng, ví dụ: thời gian hay chỉ dẫn địa điểm giao hàng chi tiết hơn.")}
                className="w-full px-4 py-3 rounded-md bg-secondary input-field font-open-sans min-h-[100px] resize-y"
              />
            </div>

            <div className="pt-4">
              <h3 className="text-lg font-semibold mb-4 font-orbitron">{t("Phương Thức Giao Hàng")}</h3>
              <div className="space-y-3">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="shipping"
                    value="Giao Hàng Tiêu Chuẩn"
                    className="h-4 w-4 text-primary focus:ring-primary"
                    checked={shippingMethod === 'Giao Hàng Tiêu Chuẩn'}
                    onChange={(e) => setShippingMethod(e.target.value)}
                  />
                  <span className="flex-1 font-open-sans">
                    <span className="block">{t("Giao Hàng Tiêu Chuẩn")}</span>
                    <span className="block text-sm text-accent/70">{t("3-5 ngày làm việc - Miễn phí")}</span>
                  </span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="shipping"
                    value="Giao Hàng Nhanh"
                    className="h-4 w-4 text-primary focus:ring-primary"
                    checked={shippingMethod === 'Giao Hàng Nhanh'}
                    onChange={(e) => setShippingMethod(e.target.value)}
                  />
                  <span className="flex-1 font-open-sans">
                    <span className="block">{t("Giao Hàng Nhanh")}</span>
                    <span className="block text-sm text-accent/70">{t("1-2 ngày làm việc - 50.000 ₫")}</span>
                  </span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="shipping"
                    value="Giao Hàng Hỏa Tốc"
                    className="h-4 w-4 text-primary focus:ring-primary"
                    checked={shippingMethod === 'Giao Hàng Hỏa Tốc'}
                    onChange={(e) => setShippingMethod(e.target.value)}
                  />
                  <span className="flex-1 font-open-sans">
                    <span className="block">{t("Giao Hàng Hỏa Tốc")}</span>
                    <span className="block text-sm text-accent/70">{t("Trong ngày - 100.000 ₫")}</span>
                  </span>
                </label>
              </div>
            </div>

            {shippingMethod !== 'Giao Hàng Tiêu Chuẩn' && (
              <div className="pt-6 mt-4 border-t border-primary/10">
                <h3 className="text-md font-semibold mb-3 font-orbitron">{t(" Bạn có voucher Free Ship? Áp dụng ngay")}</h3>
                <div className="flex items-center space-x-3 relative">
                  <input
                    type="text"
                    value={freeshipCodeInput}
                    onChange={(e) => setFreeshipCodeInput(e.target.value)}
                    placeholder={t("Nhập mã voucher freeship")}
                    className="w-full px-4 py-3 max-[499px]:py-2 max-[499px]:px-3 rounded-md bg-secondary input-field font-open-sans"
                    disabled={!!appliedFreeshipVoucher}
                  />
                  {!appliedFreeshipVoucher ? (
                    <button
                      onClick={handleApplyFreeshipVoucher}
                      className="bg-primary hover:bg-primary/90 text-white px-4 py-3 max-[499px]:px-3 max-[499px]:py-2 max-[374px]:text-sm rounded-md font-semibold transition font-orbitron whitespace-nowrap"
                    >
                      {t("Áp dụng")}
                    </button>
                  ) : (
                    <button
                      onClick={handleRemoveFreeshipVoucher}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-3 max-[499px]:px-3 max-[499px]:py-2 max-[374px]:text-sm rounded-md font-semibold transition font-orbitron whitespace-nowrap"
                    >
                      {t("Hủy bỏ")}
                    </button>
                  )}
                </div>
                {freeshipError && <p className="text-red-500 text-sm mt-2 font-open-sans">{freeshipError}</p>}
                {freeshipSuccess && <p className="text-green-500 text-sm mt-2 font-open-sans flex items-center"><svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> {freeshipSuccess}</p>}
              </div>
            )}

            <div className="pt-4">
              <h3 className="text-lg font-semibold mb-4 font-orbitron">{t("Phương Thức Thanh Toán")}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-[499px]:gap-3">
                <div className={`payment-method p-4 rounded-md cursor-pointer ${paymentMethod === 'Thanh Toán Khi Nhận Hàng' ? 'selected border-primary' : 'border border-primary/20'}`} onClick={() => setPaymentMethod('Thanh Toán Khi Nhận Hàng')}>
                  <div className="flex items-center space-x-3">
                    <input type="radio" name="payment" value="Thanh Toán Khi Nhận Hàng" className="h-4 w-4 text-primary focus:ring-primary" checked={paymentMethod === 'Thanh Toán Khi Nhận Hàng'} onChange={(e) => setPaymentMethod(e.target.value)} />
                    <svg className="h-5 w-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="1" y="3" width="15" height="13"></rect>
                      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                      <circle cx="5.5" cy="18.5" r="2.5"></circle>
                      <circle cx="18.5" cy="18.5" r="2.5"></circle>
                    </svg>
                    <span className="font-open-sans">{t("Thanh Toán Khi Nhận Hàng")}</span>
                  </div>
                </div>
                <div className={`payment-method p-4 rounded-md cursor-pointer ${paymentMethod === 'Thanh Toán VNPAY' ? 'selected border-primary' : 'border border-primary/20'}`} onClick={() => setPaymentMethod('Thanh Toán VNPAY')}>
                  <div className="flex items-center space-x-3">
                    <input type="radio" name="payment" value="Thanh Toán VNPAY" className="h-4 w-4 text-primary focus:ring-primary" checked={paymentMethod === 'Thanh Toán VNPAY'} onChange={(e) => setPaymentMethod(e.target.value)} />
                    <svg className="h-5 w-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="7" height="7"></rect>
                      <rect x="14" y="3" width="7" height="7"></rect>
                      <rect x="14" y="14" width="7" height="7"></rect>
                      <rect x="3" y="14" width="7" height="7"></rect>
                      <line x1="9" y1="9" x2="9.01" y2="9"></line>
                      <line x1="14" y1="9" x2="14.01" y2="9"></line>
                      <line x1="14" y1="14" x2="14.01" y2="14"></line>
                      <line x1="9" y1="14" x2="9.01" y2="14"></line>
                    </svg>
                    <span className="font-open-sans">{t("Thanh Toán VNPAY")}</span>
                  </div>
                </div>
                <div className={`payment-method p-4 rounded-md cursor-pointer ${paymentMethod === 'Chuyển Khoản Ngân Hàng' ? 'selected border-primary' : 'border border-primary/20'}`} onClick={() => setPaymentMethod('Chuyển Khoản Ngân Hàng')}>
                  <div className="flex items-center space-x-3">
                    <input type="radio" name="payment" value="Chuyển Khoản Ngân Hàng" className="h-4 w-4 text-primary focus:ring-primary" checked={paymentMethod === 'Chuyển Khoản Ngân Hàng'} onChange={(e) => setPaymentMethod(e.target.value)} />
                    <svg className="h-5 w-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="12 2 2 7 22 7 12 2"></polygon>
                      <polyline points="2 17 22 17"></polyline>
                      <polyline points="2 22 22 22"></polyline>
                      <line x1="4" y1="17" x2="4" y2="7"></line>
                      <line x1="8" y1="17" x2="8" y2="7"></line>
                      <line x1="12" y1="17" x2="12" y2="7"></line>
                      <line x1="16" y1="17" x2="16" y2="7"></line>
                      <line x1="20" y1="17" x2="20" y2="7"></line>
                    </svg>
                    <span className="font-open-sans">{t("Chuyển Khoản Ngân Hàng")}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-6">
              <button type="submit" className="bg-primary hover:bg-primary/90 text-white px-8 py-3 max-[499px]:w-full max-[499px]:justify-center max-[499px]:py-2 max-[374px]:text-sm rounded-md font-semibold transition flex items-center font-orbitron">
                {isProcessing ? t("Đang xử lý...") : t("Mua Ngay")}
                <i data-feather="arrow-right" className="ml-2 h-5 w-5"></i>
              </button>
            </div>
          </form>
        </div>

        {/* Tóm tắt đơn hàng */}
        <div className="lg:col-span-1" data-aos="fade-up" data-aos-delay="200">
          <div className="bg-secondary/50 border border-primary/20 rounded-lg p-6 sticky top-6">
            <h2 className="text-xl max-[499px]:text-lg max-[374px]:text-base font-bold mb-6 font-orbitron">{t("Tóm Tắt Đơn Hàng")}</h2>

            <div className="space-y-4 mb-6">
              {cartItems.map((item, index) => (
                <div key={item.variant_id || item.id || index} className="cart-item flex items-start space-x-4 pb-4 border-b border-primary/10 relative group">
                  <img
                    src={item.image}
                    alt={item.translatedName}
                    className="w-16 h-16 object-cover rounded-md"
                    loading="lazy"
                  />
                  <div className="flex-1 pr-8">
                    <h3 className="font-medium font-open-sans">{item.translatedName}</h3>

                    {item.cate_id === "TCG-CAT-001" && item.color && (
                      <p className="text-sm text-accent/70 font-open-sans mt-[4px]">
                        {t("Màu")}: {item.translatedColor || item.color}
                      </p>
                    )}
                    {item.cate_id === "TCG-CAT-002" && item.size && (
                      <p className="text-sm text-accent/70 font-open-sans mt-[4px]">
                        {t("Size")}: {item.translatedSize || item.size}
                      </p>
                    )}

                    {!item.cate_id && item.translatedVariant && (
                      <p className="text-sm text-accent/70 font-open-sans mt-[4px]">
                        {item.translatedVariantPrefix ? `${item.translatedVariantPrefix}: ` : ''}{item.translatedVariant}
                      </p>
                    )}

                    <div className="flex justify-between items-end mt-1">
                      <div className="flex flex-col">
                        <span className="text-sm font-open-sans">{t("Giá")}: <span className="text-red-500 font-semibold">{formatPrice(item.price)}</span></span>
                        <span className="text-sm font-open-sans">{t("Số lượng")}: {item.quantity}</span>
                      </div>
                      <span className="text-red-500 font-bold font-open-sans">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleRemoveItem(index)}
                    className="absolute right-0 top-0 text-accent/50 hover:text-red-500 hover:bg-red-500/10 p-2 rounded-full transition-all"
                    title={t("Xóa sản phẩm")}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            <div className="voucher-section mb-6">
              <h3 className="text-lg font-semibold mb-4 font-orbitron">{t("Mã Voucher")}</h3>
              <div className="flex items-center space-x-3 relative">
                <input
                  type="text"
                  id="voucher-code"
                  value={voucherCodeInput}
                  onChange={(e) => setVoucherCodeInput(e.target.value)}
                  placeholder={t("Nhập mã voucher")}
                  className="w-full px-4 py-3 max-[499px]:py-2 max-[499px]:px-3 rounded-md bg-secondary input-field font-open-sans"
                  disabled={!!appliedVoucher}
                />
                {!appliedVoucher ? (
                  <button
                    id="apply-voucher"
                    onClick={handleApplyVoucher}
                    className="bg-primary hover:bg-primary/90 text-white px-4 py-3 max-[499px]:px-3 max-[499px]:py-2 max-[374px]:text-sm rounded-md font-semibold transition font-orbitron whitespace-nowrap"
                  >
                    {t("Áp dụng")}
                  </button>
                ) : (
                  <button
                    onClick={handleRemoveVoucher}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-3 max-[499px]:px-3 max-[499px]:py-2 max-[374px]:text-sm rounded-md font-semibold transition font-orbitron whitespace-nowrap"
                  >
                    {t("Hủy bỏ")}
                  </button>
                )}
              </div>
              {voucherError && <p className="text-red-500 text-sm mt-2 font-open-sans">{voucherError}</p>}
              {voucherSuccess && <p className="text-green-500 text-sm mt-2 font-open-sans">{voucherSuccess}</p>}

              <p className="text-center text-accent/70 my-4 font-open-sans">{t("hoặc")}</p>
              <div className="flex justify-center">
                <Link to="/vouchers" className="bg-secondary border border-primary/20 hover:bg-primary/90 hover:text-white px-6 py-3 max-[499px]:px-4 max-[499px]:py-2 max-[374px]:text-sm rounded-md font-semibold transition font-orbitron">
                  {t("Chọn voucher ở đây")}
                </Link>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between font-open-sans">
                <span>{t("Tổng phụ")}</span>
                <span id="subtotal" className="text-red-500 font-semibold">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between font-open-sans">
                <span>{t("Phí giao hàng")}</span>
                <span id="shipping-fee" className="text-red-500 font-semibold text-right">
                  {isFreeshipActive ? (
                    <>
                      <span className="line-through text-accent/50 mr-2 text-sm">{formatPrice(baseShippingFee)}</span>
                      {formatPrice(0)}
                    </>
                  ) : (
                    formatPrice(shippingFee)
                  )}
                </span>
              </div>
              {appliedVoucher && (
                <div className="flex justify-between font-open-sans text-green-500">
                  <span>{t("Giảm giá")}</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-lg pt-2 border-t border-primary/10 font-open-sans">
                <span>{t("Tổng cộng")}</span>
                <span id="total" className="text-red-500">{formatPrice(total)}</span>
              </div>
            </div>

            <div className="text-sm text-accent/70 font-open-sans">
              <p>
                {t("Cần trợ giúp?")} <a href="contact" className="text-primary hover:underline">{t("Liên hệ hỗ trợ của chúng tôi")}</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
    </>
  );
};

export default Checkout;