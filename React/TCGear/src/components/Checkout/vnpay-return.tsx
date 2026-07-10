import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import Preloader from '../Preloader/preloader';
import { useTranslation } from 'react-i18next';

const VNPayReturn: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { success, error: toastError } = useToast();
  const [isProcessing, setIsProcessing] = useState(true);
  const hasProcessed = useRef(false);

  useEffect(() => {
    const processOrder = async () => {
      if (hasProcessed.current) return;
      hasProcessed.current = true;
      const searchParams = new URLSearchParams(location.search);
      const status = searchParams.get('status');

      if (status === 'success') {
        try {
          const payloadStr = localStorage.getItem('pending_order_payload');
          if (!payloadStr) {
            toastError?.(t("Không tìm thấy thông tin đơn hàng"));
            navigate('/');
            return;
          }

          const payload = JSON.parse(payloadStr);

          // Tạo đơn hàng trên backend
          const res = await fetch('http://localhost:3000/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          const data = await res.json();

          if (data.status === 'success') {
            success?.(t("Đặt hàng thành công!"), t("Cảm ơn bạn đã mua hàng tại TCGear."));
            localStorage.removeItem('pending_order_payload');
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
            toastError?.(data.message || t("Có lỗi xảy ra khi lưu đơn hàng"));
            window.location.href = '/checkout';
          }
        } catch (error) {
          console.error("Lỗi khi tạo đơn hàng sau thanh toán:", error);
          toastError?.(t("Lỗi kết nối khi lưu đơn hàng"));
          navigate('/checkout');
        } finally {
          setIsProcessing(false);
        }
      } else {
        toastError?.(t("Thanh toán thất bại hoặc đã bị hủy"));
        navigate('/checkout');
        setIsProcessing(false);
      }
    };

    processOrder();
  }, [location.search, navigate, success, toastError, t]);

  return (
    <>
      <Preloader visible={isProcessing} />
      <div className="flex flex-col items-center justify-center min-h-screen bg-primary">
        <h2 className="text-2xl font-bold text-white mb-4">{t("Đang xử lý kết quả thanh toán...")}</h2>
        <p className="text-white/80">{t("Vui lòng không đóng trình duyệt lúc này.")}</p>
      </div>
    </>
  );
};

export default VNPayReturn;
