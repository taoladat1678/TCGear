// orders.tsx
import React, { useState, useEffect, useCallback } from 'react';
import './orders.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import feather from 'feather-icons';
import { useTranslation } from 'react-i18next';
import { useToast } from '../../context/ToastContext';

AOS.init({
  duration: 800,
  easing: 'ease-in-out',
  once: true,
});

const Orders: React.FC = () => {
  const { t } = useTranslation();
  const { success, error } = useToast();
  const [activeFilter, setActiveFilter] = useState('all');
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  // States quản lý Popup Hoàn Trả
  const [returnModalOrder, setReturnModalOrder] = useState<any>(null);
  const [returnQuantities, setReturnQuantities] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter]);

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    try {
      const userStr = localStorage.getItem('user');
      const currentUser = userStr ? JSON.parse(userStr) : null;
      if (!currentUser || !currentUser.user_id) {
        setIsLoading(false);
        return;
      }

      const res = await fetch(`http://localhost:3000/api/orders/user/${currentUser.user_id}`);
      const data = await res.json();

      if (data.status === 'success') {
        const formattedOrders = data.data.map((o: any) => {
          const date = new Date(o.order_date).toLocaleDateString('vi-VN');
          const statusMap: any = {
            'Chờ xử lý': 'processing',
            'Đang xử lý': 'processing',
            'Đã giao': 'delivered',
            'Đang vận chuyển': 'shipped',
            'Đang giao': 'shipped',
            'Hủy': 'cancelled',
            'Chờ xác nhận': 'pending',
            'Hoàn thành': 'completed',
            'Hoàn trả': 'returned'
          };

          const originalStatusText = o.order_status || 'Chờ xác nhận';
          let mapStatusText = originalStatusText;
          let internalStatus = statusMap[mapStatusText] || 'processing';
          const isReceivedVal = o.is_received || 'Chưa nhận hàng';

          if (internalStatus === 'delivered' && isReceivedVal === 'Đã nhận hàng') {
            internalStatus = 'completed';
            mapStatusText = 'Hoàn thành';
          }

          const isProcessing = ['Chờ xử lý', 'Đang xử lý', 'Đang vận chuyển', 'Đang giao', 'Đã giao', 'Hoàn thành', 'Hoàn trả'].includes(originalStatusText);
          const isShipped = ['Đang vận chuyển', 'Đang giao', 'Đã giao', 'Hoàn thành', 'Hoàn trả'].includes(originalStatusText);
          const isDelivered = ['Đã giao', 'Hoàn thành', 'Hoàn trả'].includes(originalStatusText);

          const trackingSteps = [
            { step: 'Chờ xác nhận', date: date, completed: true },
            { step: 'Chờ xử lý', date: isProcessing ? date : '', completed: isProcessing },
            { step: 'Đang vận chuyển', date: isShipped ? date : '', completed: isShipped },
            { step: 'Đã giao', date: isDelivered ? date : '', completed: isDelivered },
          ];

          const validProducts = (o.products || []).filter((p: any) => p.quantity > 0);
          const groupedProducts: Record<string, any> = {};
          validProducts.forEach((p: any) => {
            const groupKey = p.name; // Gom nhóm theo tên sản phẩm
            if (groupedProducts[groupKey]) {
              groupedProducts[groupKey].quantity += p.quantity;
              groupedProducts[groupKey].price += p.price; // price here is actually total_amount from DB
              
              if (!groupedProducts[groupKey].skus) {
                groupedProducts[groupKey].skus = [groupedProducts[groupKey].sku];
              }
              if (!groupedProducts[groupKey].skus.includes(p.sku)) {
                groupedProducts[groupKey].skus.push(p.sku);
              }
              // Lưu trữ danh sách các item gốc để phục vụ việc hoàn trả
              if (!groupedProducts[groupKey].originalItems) {
                groupedProducts[groupKey].originalItems = [{...groupedProducts[groupKey]}];
                // Xóa originalItems khỏi bản sao đầu tiên để tránh đệ quy vòng
                delete groupedProducts[groupKey].originalItems[0].originalItems;
              }
              groupedProducts[groupKey].originalItems.push({ ...p });
            } else {
              groupedProducts[groupKey] = { ...p, skus: [p.sku], originalItems: [{ ...p }] };
            }
          });

          return {
            id: o.order_id,
            date: date,
            timeString: o.order_time,
            status: internalStatus,
            statusText: mapStatusText,
            products: Object.values(groupedProducts).map((p: any) => ({
              ...p,
              name: p.name,
              image: p.image,
              sku: p.skus ? p.skus.join(', ') : p.sku,
              priceString: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', minimumFractionDigits: 0 }).format(p.price)
            })),
            shippingAddress: {
              name: o.recipient_name,
              street: o.shipping_address,
              city: '',
              country: 'Việt Nam',
              phone: o.recipient_phone,
              email: o.recipient_email,
            },
            paymentMethod: o.payment_method || 'Thanh Toán Khi Nhận Hàng',
            paymentDate: date,
            trackingSteps: trackingSteps,
            isReceived: isReceivedVal
          };
        });

        // Lọc bỏ những order trống (đã bị hoàn trả hết sản phẩm nhưng đôi khi API vẫn nhả ra mảng rỗng)
        setOrders(formattedOrders.filter((o: any) => o.products.length > 0));
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    feather.replace();
  }, [orders, expandedOrders, activeFilter, currentPage, returnModalOrder]);

  const toggleOrderDetails = (orderId: string) => {
    setExpandedOrders((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  };

  const handleConfirmReceived = async (orderId: string) => {
    try {
      const res = await fetch(`http://localhost:3000/api/orders/${orderId}/receive`, {
        method: 'PUT'
      });
      const data = await res.json();
      if (data.status === 'success') {
        success?.("Thành công", "Đã xác nhận nhận hàng");
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, isReceived: 'Đã nhận hàng', status: 'completed', statusText: 'Hoàn thành' } : o));
        
        // Gọi API sync-eco để cập nhật ECO_TOTAL và ECO_ORDER_TOTAL
        try {
          const userStr = localStorage.getItem('user');
          const currentUser = userStr ? JSON.parse(userStr) : null;
          if (currentUser && currentUser.user_id) {
            await fetch(`http://localhost:3000/api/user/${currentUser.user_id}/sync-eco`, { method: 'POST' });
          }
        } catch (e) {
          console.error("Lỗi khi gọi sync-eco", e);
        }
      } else {
        error?.("Lỗi", data.message || "Không thể xác nhận");
      }
    } catch (err) {
      console.error(err);
      error?.("Lỗi", "Lỗi kết nối máy chủ");
    }
  };

  // --- LOGIC POPUP HOÀN TRẢ ---
  const openReturnModal = (order: any) => {
    setReturnModalOrder(order);
    const initialQuantities: any = {};
    order.products.forEach((p: any) => {
      initialQuantities[p.sku] = 0; // Mặc định số lượng hoàn trả ban đầu là 0
    });
    setReturnQuantities(initialQuantities);
  };

  const closeReturnModal = () => {
    setReturnModalOrder(null);
    setReturnQuantities({});
  };

  const handleQuantityChange = (sku: string, value: number, max: number) => {
    if (value < 0) value = 0;
    if (value > max) value = max;
    setReturnQuantities(prev => ({ ...prev, [sku]: value }));
  };

  const submitReturn = async () => {
    const itemsToReturn: any[] = [];
    
    // Phân bổ số lượng hoàn trả vào các SKU thực tế của sản phẩm
    Object.entries(returnQuantities).forEach(([name, returnQty]) => {
      let remainingQtyToReturn = returnQty as number;
      if (remainingQtyToReturn <= 0) return;

      // Tìm sản phẩm đã gom nhóm
      const groupedProduct = returnModalOrder.products.find((p: any) => p.name === name);
      
      if (groupedProduct && groupedProduct.originalItems) {
        for (const p of groupedProduct.originalItems) {
          if (remainingQtyToReturn <= 0) break;
          const qtyToTake = Math.min(p.quantity, remainingQtyToReturn);
          
          itemsToReturn.push({ variant_id: p.sku, return_quantity: qtyToTake });
          remainingQtyToReturn -= qtyToTake;
        }
      } else if (groupedProduct) {
        // Fallback nếu không có originalItems
        itemsToReturn.push({ variant_id: groupedProduct.sku, return_quantity: remainingQtyToReturn });
      }
    });

    if (itemsToReturn.length === 0) {
      error?.("Lỗi", "Vui lòng chọn ít nhất 1 sản phẩm để hoàn trả");
      return;
    }

    try {
      const res = await fetch(`http://localhost:3000/api/orders/${returnModalOrder.id}/return`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ returnItems: itemsToReturn })
      });
      const data = await res.json();
      if (data.status === 'success') {
        success?.("Thành công", "Đã xử lý yêu cầu hoàn trả thành công.");
        closeReturnModal();
        fetchOrders(); // Refresh lại danh sách để lấy số tiền/số lượng mới nhất
      } else {
        error?.("Lỗi", data.message || "Không thể hoàn trả");
      }
    } catch (err) {
      console.error(err);
      error?.("Lỗi", "Lỗi kết nối máy chủ");
    }
  };

  const counts = {
    all: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    completed: orders.filter(o => o.status === 'completed').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
    returned: orders.filter(o => o.status === 'returned').length,
  };

  const filteredOrders = orders.filter((order) =>
    activeFilter === 'all' ? true : order.status === activeFilter
  );

  const ITEMS_PER_PAGE = 3;
  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
  const currentOrders = filteredOrders.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'completed':
      case 'delivered':
        return 'status-delivered';
      case 'processing':
        return 'status-processing';
      case 'shipped':
        return 'status-shipped';
      case 'cancelled':
      case 'returned':
        return 'status-cancelled';
      case 'pending':
        return 'status-processing';
      default:
        return '';
    }
  };

  const getButtonText = (orderId: string) => {
    return expandedOrders.has(orderId) ? t('Ẩn chi tiết') : t('Xem chi tiết');
  };

  return (
    <div className="bg-secondary text-accent min-h-screen">
      {/* Orders Header */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-black">
        <div className="max-w-7xl mx-auto text-center" data-aos="fade-up">
          <h1 className="text-3xl md:text-4xl max-[767px]:text-2xl max-[499px]:text-xl max-[374px]:text-lg font-bold mb-4 font-orbitron">
            {t("ĐƠN HÀNG CỦA TÔI")}
          </h1>
          <p className="text-accent/70 max-w-2xl mx-auto font-open-sans">
            {t("Theo dõi các giao dịch mua và xem lịch sử đơn hàng")}
          </p>
        </div>
      </section>

      {/* Orders Content */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Filter Options */}
          <div className="mb-8 flex flex-wrap gap-4 max-[499px]:gap-2" data-aos="fade-up">
            <button
              className={`filter-btn ${activeFilter === 'all' ? 'active' : ''} px-4 py-2 max-[499px]:px-3 max-[499px]:py-1.5 max-[499px]:text-sm rounded-md border border-primary/20 font-open-sans flex items-center gap-2`}
              onClick={() => setActiveFilter('all')}
            >
              <i data-feather="list" className="w-4 h-4"></i>
              {t("Tất cả đơn hàng")}
              {counts.all > 0 && <span className="bg-primary text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center">{counts.all}</span>}
            </button>
            <button
              className={`filter-btn ${activeFilter === 'pending' ? 'active' : ''} px-4 py-2 max-[499px]:px-3 max-[499px]:py-1.5 max-[499px]:text-sm rounded-md border border-primary/20 font-open-sans flex items-center gap-2`}
              onClick={() => setActiveFilter('pending')}
            >
              <i data-feather="clock" className="w-4 h-4"></i>
              {t("Chờ xác nhận")}
              {counts.pending > 0 && <span className="bg-primary text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center">{counts.pending}</span>}
            </button>
            <button
              className={`filter-btn ${activeFilter === 'processing' ? 'active' : ''} px-4 py-2 max-[499px]:px-3 max-[499px]:py-1.5 max-[499px]:text-sm rounded-md border border-primary/20 font-open-sans flex items-center gap-2`}
              onClick={() => setActiveFilter('processing')}
            >
              <i data-feather="settings" className="w-4 h-4"></i>
              {t("Đang xử lý")}
              {counts.processing > 0 && <span className="bg-primary text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center">{counts.processing}</span>}
            </button>
            <button
              className={`filter-btn ${activeFilter === 'shipped' ? 'active' : ''} px-4 py-2 max-[499px]:px-3 max-[499px]:py-1.5 max-[499px]:text-sm rounded-md border border-primary/20 font-open-sans flex items-center gap-2`}
              onClick={() => setActiveFilter('shipped')}
            >
              <i data-feather="truck" className="w-4 h-4"></i>
              {t("Đang vận chuyển")}
              {counts.shipped > 0 && <span className="bg-primary text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center">{counts.shipped}</span>}
            </button>
            <button
              className={`filter-btn ${activeFilter === 'delivered' ? 'active' : ''} px-4 py-2 max-[499px]:px-3 max-[499px]:py-1.5 max-[499px]:text-sm rounded-md border border-primary/20 font-open-sans flex items-center gap-2`}
              onClick={() => setActiveFilter('delivered')}
            >
              <i data-feather="map-pin" className="w-4 h-4"></i>
              {t("Đã giao hàng")}
              {counts.delivered > 0 && <span className="bg-primary text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center">{counts.delivered}</span>}
            </button>
            <button
              className={`filter-btn ${activeFilter === 'completed' ? 'active' : ''} px-4 py-2 max-[499px]:px-3 max-[499px]:py-1.5 max-[499px]:text-sm rounded-md border border-primary/20 font-open-sans flex items-center gap-2`}
              onClick={() => setActiveFilter('completed')}
            >
              <i data-feather="check-circle" className="w-4 h-4"></i>
              {t("Hoàn thành")}
              {counts.completed > 0 && <span className="bg-primary text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center">{counts.completed}</span>}
            </button>
            {counts.cancelled > 0 && (
              <button
                className={`filter-btn ${activeFilter === 'cancelled' ? 'active' : ''} px-4 py-2 max-[499px]:px-3 max-[499px]:py-1.5 max-[499px]:text-sm rounded-md border border-primary/20 font-open-sans flex items-center gap-2`}
                onClick={() => setActiveFilter('cancelled')}
              >
                <i data-feather="x-circle" className="w-4 h-4"></i>
                {t("Đã hủy")}
                <span className="bg-primary text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center">{counts.cancelled}</span>
              </button>
            )}
            {counts.returned > 0 && (
              <button
                className={`filter-btn ${activeFilter === 'returned' ? 'active' : ''} px-4 py-2 max-[499px]:px-3 max-[499px]:py-1.5 max-[499px]:text-sm rounded-md border border-primary/20 font-open-sans flex items-center gap-2`}
                onClick={() => setActiveFilter('returned')}
              >
                <i data-feather="corner-down-left" className="w-4 h-4"></i>
                {t("Hoàn trả")}
                <span className="bg-primary text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center">{counts.returned}</span>
              </button>
            )}
          </div>

          {/* Orders List */}
          <div className="space-y-6">
            {!isLoading && currentOrders.map((order) => (
              <div
                key={order.id}
                className="order-card bg-secondary/50 rounded-lg p-6"
                data-status={order.status}
                data-aos="fade-up"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-lg max-[499px]:text-base font-orbitron">
                      {t("Đơn hàng")} #{order.id}
                    </h3>
                    <p className="text-accent/70 text-sm font-open-sans">
                      {t("Đặt hàng lúc")} {order.timeString} - {order.date}
                    </p>
                  </div>
                  <div className="mt-2 md:mt-0">
                    <span className={`status-badge ${getStatusClass(order.status)}`}>
                      {t(order.statusText)}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div className="flex space-x-3 mt-3 md:mt-0">
                    <button
                      className="view-details-btn bg-primary hover:bg-primary/90 text-white px-4 py-2 max-[499px]:px-3 max-[499px]:py-1.5 max-[499px]:text-xs rounded text-sm transition font-open-sans"
                      onClick={() => toggleOrderDetails(order.id)}
                    >
                      {getButtonText(order.id)}
                    </button>
                  </div>
                </div>

                {/* Order Details (Hidden by default) */}
                {expandedOrders.has(order.id) && (
                  <div className="order-details open mt-4">
                    <div className="border-t border-primary/20 pt-4">
                      <h4 className="font-semibold mb-3 font-orbitron">{t("Chi tiết đơn hàng")}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h5 className="font-medium mb-2 font-open-sans">
                            {t("Địa chỉ giao hàng")}
                          </h5>
                          <p className="text-accent/70 font-open-sans">{order.shippingAddress.name}</p>
                          <p className="text-accent/70 font-open-sans">
                            {t(order.shippingAddress.street)}
                          </p>
                          <p className="text-accent/70 font-open-sans">
                            {t(order.shippingAddress.city)}
                          </p>
                          <p className="text-accent/70 font-open-sans">{t(order.shippingAddress.country)}</p>
                          <p className="text-accent/70 font-open-sans mt-2">
                            {t("Điện thoại")}: {order.shippingAddress.phone}
                          </p>
                          <p className="text-accent/70 font-open-sans">
                            Email: {order.shippingAddress.email}
                          </p>
                        </div>
                        <div>
                          <h5 className="font-medium mb-2 font-open-sans">
                            {t("Phương thức thanh toán")}
                          </h5>
                          <p className="text-accent/70 font-open-sans">
                            {t(order.paymentMethod)}
                          </p>
                          <p className="text-accent/70 font-open-sans">
                            {t("Thanh toán ngày")} {order.paymentDate}
                          </p>
                        </div>
                        <div className="md:col-span-2">
                          <h5 className="font-medium mb-2 font-open-sans">
                            {t("Thông tin sản phẩm")}
                          </h5>
                          <div className="space-y-4">
                            {order.products.map((product: any, index: number) => (
                              <div key={index} className="flex gap-4 items-center p-3 hover:bg-black/20 rounded-lg transition-colors border border-primary/5">
                                <img
                                  src={product.image}
                                  alt={t(product.name)}
                                  className="w-12 h-12 object-cover rounded"
                                />
                                <div>
                                  <p className="font-medium font-open-sans">
                                    {t(product.name)}
                                  </p>
                                  <p className="text-accent/70 text-sm font-open-sans">
                                    {t("Số lượng")}: {product.quantity} | {t("Đơn giá")}: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', minimumFractionDigits: 0 }).format(product.price / product.quantity)} | {t("Tổng giá trị")}: {product.priceString}
                                  </p>
                                  <p className="text-accent/70 text-sm font-open-sans">
                                    SKU: {product.sku}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="md:col-span-2">
                          <h5 className="font-medium mb-2 font-open-sans">
                            {t("Theo dõi vận chuyển")}
                          </h5>
                          <div className="tracking-progress mb-4">
                            <div className="tracking-progress-bar"
                              style={{ width: `${order.trackingSteps.filter((s: any) => s.completed).length === 0 ? 0 : ((order.trackingSteps.filter((s: any) => s.completed).length - 1) / (order.trackingSteps.length - 1)) * 100}%` }}
                            ></div>
                          </div>
                          <div className="tracking-step-container flex justify-between text-sm font-open-sans">
                            {order.trackingSteps.map((step: any, index: number) => (
                              <div key={index} className={`tracking-step ${step.completed ? 'completed' : ''}`}>
                                <p>{t(step.step)}</p>
                                <p className="text-accent/70 text-xs">{step.completed ? step.date : t('Chưa hoàn thành')}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                        {(order.statusText === 'Đã giao' || order.statusText === 'Hoàn thành') && (
                          <div className="md:col-span-2 flex justify-end mt-4 border-t border-primary/20 pt-4 gap-4">
                            {order.statusText === 'Hoàn thành' && (
                              <button
                                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded text-sm transition font-open-sans"
                                onClick={() => openReturnModal(order)}
                              >
                                {t("Hoàn trả sản phẩm")}
                              </button>
                            )}
                            {order.isReceived === 'Đã nhận hàng' ? (
                              <button className="bg-gray-600 text-white px-6 py-2 rounded text-sm transition font-open-sans cursor-not-allowed" disabled>
                                {t("Đã nhận hàng")}
                              </button>
                            ) : (
                              <button
                                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded text-sm transition font-open-sans"
                                onClick={() => handleConfirmReceived(order.id)}
                              >
                                {t("Đã nhận được hàng")}
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Empty State / Loading State */}
          {isLoading ? (
            <div className="text-center py-16" data-aos="fade-up">
              <h3 className="text-xl font-semibold mb-2 font-orbitron text-primary">
                {t("Đang tải dữ liệu...")}
              </h3>
            </div>
          ) : filteredOrders.length === 0 && (
            <div className="empty-orders text-center py-16" data-aos="fade-up">
              <i data-feather="package" className="h-16 w-16 text-primary mx-auto mb-4"></i>
              <h3 className="text-xl font-semibold mb-2 font-orbitron">
                {t("Không tìm thấy đơn hàng")}
              </h3>
              <p className="text-accent/70 mb-6 font-open-sans">
                {t("Bạn chưa đặt đơn hàng nào hoặc không có đơn hàng nào phù hợp.")}
              </p>
              <a
                href="/shop"
                className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-md font-semibold transition font-open-sans"
              >
                {t("Bắt đầu mua sắm")}
              </a>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-12 flex justify-center" data-aos="fade-up">
              <nav className="flex items-center space-x-2">
                <button
                  className="p-2 text-accent/70 hover:text-primary transition disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label={t("Trang trước")}
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  <i data-feather="chevron-left" className="h-5 w-5"></i>
                </button>

                {Array.from({ length: totalPages }).map((_, idx) => {
                  const page = idx + 1;
                  return (
                    <button
                      key={page}
                      className={`w-8 h-8 rounded font-open-sans transition ${currentPage === page ? 'bg-primary text-white font-medium' : 'text-accent/70 hover:text-primary'}`}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </button>
                  );
                })}

                <button
                  className="p-2 text-accent/70 hover:text-primary transition disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label={t("Trang tiếp theo")}
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  <i data-feather="chevron-right" className="h-5 w-5"></i>
                </button>
              </nav>
            </div>
          )}
        </div>
      </section>

      {/* --- MODAL HOÀN TRẢ SẢN PHẨM --- */}
      {returnModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#111111] border border-primary/40 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6">
            <div className="flex justify-between items-center mb-6 border-b border-primary/20 pb-4">
              <h2 className="text-2xl font-bold font-orbitron text-red-500">
                {t("Hoàn Trả Đơn Hàng")} #{returnModalOrder.id}
              </h2>
              <button onClick={closeReturnModal} className="text-accent/60 hover:text-red-500 transition">
                <i data-feather="x" className="w-6 h-6"></i>
              </button>
            </div>

            <p className="text-accent/80 font-open-sans mb-6 text-sm">
              * Vui lòng chọn số lượng sản phẩm bạn muốn hoàn trả. Số tiền tương ứng sẽ được trừ đi từ tổng tích lũy.
            </p>

            <div className="space-y-4 mb-8">
              {returnModalOrder.products.map((p: any) => {
                const unitPrice = p.price / p.quantity;
                const unitPriceString = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', minimumFractionDigits: 0 }).format(unitPrice);
                return (
                <div key={p.name} className="flex items-center gap-4 bg-secondary/50 p-4 rounded-lg border border-primary/10">
                  <input
                    type="checkbox"
                    checked={(returnQuantities[p.name] || 0) > 0}
                    onChange={(e) => {
                      if (e.target.checked) {
                        handleQuantityChange(p.name, p.quantity, p.quantity);
                      } else {
                        handleQuantityChange(p.name, 0, p.quantity);
                      }
                    }}
                    className="w-5 h-5 cursor-pointer accent-red-500 shrink-0"
                  />
                  <img src={p.image} alt={p.name} className="w-16 h-16 object-cover rounded-md" />
                  <div className="flex-1">
                    <h3 className="font-semibold font-open-sans line-clamp-1">{p.name}</h3>
                    <p className="text-sm text-accent/60">Đã mua: {p.quantity} x {unitPriceString}</p>
                  </div>

                  {/* Cụm tăng giảm số lượng */}
                  <div className="flex items-center border border-primary/30 rounded-lg bg-black/50">
                    <button
                      onClick={() => handleQuantityChange(p.name, (returnQuantities[p.name] || 0) - 1, p.quantity)}
                      className="w-10 h-10 hover:bg-primary/20 transition text-lg flex items-center justify-center"
                    >−</button>
                    <span className="w-12 text-center font-bold font-open-sans text-primary">
                      {returnQuantities[p.name] || 0}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(p.name, (returnQuantities[p.name] || 0) + 1, p.quantity)}
                      className="w-10 h-10 hover:bg-primary/20 transition text-lg flex items-center justify-center"
                    >+</button>
                  </div>
                </div>
              )})}
            </div>

            {(() => {
              const totalRefund = returnModalOrder.products.reduce((sum: number, p: any) => {
                const unitPrice = p.price / p.quantity;
                return sum + (returnQuantities[p.name] || 0) * unitPrice;
              }, 0);
              return totalRefund > 0 ? (
                <div className="mb-6 text-right">
                  <span className="text-accent/80 font-semibold">{t("BẠN SẼ ĐƯỢC HOÀN TRẢ:")} </span>
                  <span className="text-2xl font-bold text-red-500 ml-2">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', minimumFractionDigits: 0 }).format(totalRefund)}
                  </span>
                </div>
              ) : null;
            })()}

            <div className="flex gap-4 justify-end">
              <button
                onClick={closeReturnModal}
                className="px-6 py-2.5 rounded font-open-sans bg-gray-600 hover:bg-gray-700 text-white transition"
              >
                Hủy bỏ
              </button>
              <button
                onClick={submitReturn}
                className="px-6 py-2.5 rounded font-open-sans bg-red-600 hover:bg-red-700 text-white transition font-semibold shadow-[0_0_15px_rgba(220,38,38,0.5)]"
              >
                Xác nhận Hoàn Trả
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;