// orders.tsx
import React, { useState, useEffect } from 'react';
import './orders.css';
import  AOS  from 'aos'; // Assuming AOS is installed and imported
import 'aos/dist/aos.css'; // Import AOS CSS if not global
// import anime from 'animejs/lib/anime.es.js'; // Fixed import for animejs if needed; currently unused, so commented out

AOS.init({
  duration: 800,
  easing: 'ease-in-out',
  once: true,
});

const Orders: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());
  const [orders] = useState([
    {
      id: 'TCG-2025-001',
      date: '15 tháng 10 năm 2025',
      status: 'delivered',
      statusText: 'Đã giao',
      products: [
        {
          name: 'Tai nghe chơi game chuyên nghiệp',
          quantity: 1,
          price: '$129.99',
          sku: 'PGH-001',
          image: 'https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
        },
        {
          name: 'Áo đấu T1',
          quantity: 2,
          price: '$64.99 mỗi cái',
          sku: 'TTJ-002',
          image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
        },
      ],
      shippingAddress: {
        name: 'John Doe',
        street: '123 Đường Chơi Game',
        city: 'Thành phố Esports, EC 12345',
        country: 'Hoa Kỳ',
        phone: '+1 (555) 123-4567',
        email: 'john.doe@example.com',
      },
      paymentMethod: 'Thẻ tín dụng kết thúc bằng 4242',
      paymentDate: '15 tháng 10 năm 2025',
      trackingSteps: [
        { step: 'Đã đặt hàng', date: '15 tháng 10, 2025', completed: true },
        { step: 'Đang xử lý', date: '15 tháng 10, 2025', completed: true },
        { step: 'Đã vận chuyển', date: '16 tháng 10, 2025', completed: true },
        { step: 'Đã giao', date: '18 tháng 10, 2025', completed: true },
      ],
    },
    {
      id: 'TCG-2025-002',
      date: '20 tháng 10 năm 2025',
      status: 'pending',
      statusText: 'Chờ xác nhận',
      products: [
        {
          name: 'Bàn phím cơ gaming',
          quantity: 1,
          price: '$89.99',
          sku: 'MKB-003',
          image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
        },
      ],
      shippingAddress: {
        name: 'John Doe',
        street: '123 Đường Chơi Game',
        city: 'Thành phố Esports, EC 12345',
        country: 'Hoa Kỳ',
        phone: '+1 (555) 123-4567',
        email: 'john.doe@example.com',
      },
      paymentMethod: 'Thẻ tín dụng kết thúc bằng 4242',
      paymentDate: '20 tháng 10 năm 2025',
      trackingSteps: [
        { step: 'Đã đặt hàng', date: '20 tháng 10, 2025', completed: true },
        { step: 'Đang xử lý', date: '', completed: false },
        { step: 'Đã vận chuyển', date: '', completed: false },
        { step: 'Đã giao', date: '', completed: false },
      ],
    },
    {
      id: 'TCG-2025-003',
      date: '18 tháng 10 năm 2025',
      status: 'processing',
      statusText: 'Đang xử lý',
      products: [
        {
          name: 'Chuột gaming không dây',
          quantity: 1,
          price: '$59.99',
          sku: 'WGM-004',
          image: 'https://images.unsplash.com/photo-1587829741301-dc798b83defb?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
        },
        {
          name: 'Áo đấu Faker',
          quantity: 1,
          price: '$79.99',
          sku: 'FFJ-005',
          image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
        },
      ],
      shippingAddress: {
        name: 'John Doe',
        street: '456 Đại lộ Esports',
        city: 'Thành phố Gaming, GC 67890',
        country: 'Hoa Kỳ',
        phone: '+1 (555) 987-6543',
        email: 'john.doe@example.com',
      },
      paymentMethod: 'PayPal',
      paymentDate: '18 tháng 10 năm 2025',
      trackingSteps: [
        { step: 'Đã đặt hàng', date: '18 tháng 10, 2025', completed: true },
        { step: 'Đang xử lý', date: '19 tháng 10, 2025', completed: true },
        { step: 'Đã vận chuyển', date: '', completed: false },
        { step: 'Đã giao', date: '', completed: false },
      ],
    },
    {
      id: 'TCG-2025-004',
      date: '22 tháng 10 năm 2025',
      status: 'shipped',
      statusText: 'Đang vận chuyển',
      products: [
        {
          name: 'Ghế gaming ergonomics',
          quantity: 1,
          price: '$199.99',
          sku: 'ERG-006',
          image: 'https://images.unsplash.com/photo-1588880331177-57b1d1c9a1a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
        },
      ],
      shippingAddress: {
        name: 'John Doe',
        street: '123 Đường Chơi Game',
        city: 'Thành phố Esports, EC 12345',
        country: 'Hoa Kỳ',
        phone: '+1 (555) 123-4567',
        email: 'john.doe@example.com',
      },
      paymentMethod: 'Thẻ tín dụng kết thúc bằng 4242',
      paymentDate: '22 tháng 10 năm 2025',
      trackingSteps: [
        { step: 'Đã đặt hàng', date: '22 tháng 10, 2025', completed: true },
        { step: 'Đang xử lý', date: '22 tháng 10, 2025', completed: true },
        { step: 'Đã vận chuyển', date: '23 tháng 10, 2025', completed: true },
        { step: 'Đã giao', date: '', completed: false },
      ],
    },
    {
      id: 'TCG-2025-005',
      date: '10 tháng 10 năm 2025',
      status: 'cancelled',
      statusText: 'Đã hủy',
      products: [
        {
          name: 'Bàn gaming LED',
          quantity: 1,
          price: '$299.99',
          sku: 'LED-007',
          image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
        },
      ],
      shippingAddress: {
        name: 'John Doe',
        street: '123 Đường Chơi Game',
        city: 'Thành phố Esports, EC 12345',
        country: 'Hoa Kỳ',
        phone: '+1 (555) 123-4567',
        email: 'john.doe@example.com',
      },
      paymentMethod: 'Thẻ tín dụng kết thúc bằng 4242',
      paymentDate: '10 tháng 10 năm 2025',
      trackingSteps: [
        { step: 'Đã đặt hàng', date: '10 tháng 10, 2025', completed: true },
        { step: 'Đang xử lý', date: '', completed: false },
        { step: 'Đã vận chuyển', date: '', completed: false },
        { step: 'Đã giao', date: '', completed: false },
      ],
    },
  ]);

  useEffect(() => {
    // Initialize Feather Icons if needed
    // feather.replace(); // Assuming feather-icons is set up
  }, []);

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

  const filteredOrders = orders.filter((order) =>
    activeFilter === 'all' ? true : order.status === activeFilter
  );

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'status-delivered';
      case 'processing':
        return 'status-processing';
      case 'shipped':
        return 'status-shipped';
      case 'cancelled':
        return 'status-cancelled';
      case 'pending':
        return 'status-processing'; // Reuse processing style for pending
      default:
        return '';
    }
  };

  const getButtonText = (orderId: string) => {
    return expandedOrders.has(orderId) ? 'Ẩn chi tiết' : 'Xem chi tiết';
  };

  return (
    <div className="bg-secondary text-accent">
      {/* Orders Header */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-black">
        <div className="max-w-7xl mx-auto text-center" data-aos="fade-up">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 font-orbitron">
            ĐƠN HÀNG CỦA TÔI
          </h1>
          <p className="text-accent/70 max-w-2xl mx-auto font-open-sans">
            Theo dõi các giao dịch mua và xem lịch sử đơn hàng
          </p>
        </div>
      </section>

      {/* Orders Content */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Filter Options */}
          <div className="mb-8 flex flex-wrap gap-4" data-aos="fade-up">
            <button
              className={`filter-btn ${activeFilter === 'all' ? 'active' : ''} px-4 py-2 rounded-md border border-primary/20 font-open-sans`}
              data-filter="all"
              onClick={() => setActiveFilter('all')}
            >
              Tất cả đơn hàng
            </button>
            <button
              className={`filter-btn ${activeFilter === 'pending' ? 'active' : ''} px-4 py-2 rounded-md border border-primary/20 font-open-sans`}
              data-filter="pending"
              onClick={() => setActiveFilter('pending')}
            >
              Chờ xác nhận
            </button>
            <button
              className={`filter-btn ${activeFilter === 'processing' ? 'active' : ''} px-4 py-2 rounded-md border border-primary/20 font-open-sans`}
              data-filter="processing"
              onClick={() => setActiveFilter('processing')}
            >
              Đang xử lý
            </button>
            <button
              className={`filter-btn ${activeFilter === 'shipped' ? 'active' : ''} px-4 py-2 rounded-md border border-primary/20 font-open-sans`}
              data-filter="shipped"
              onClick={() => setActiveFilter('shipped')}
            >
              Đang vận chuyển
            </button>
            <button
              className={`filter-btn ${activeFilter === 'delivered' ? 'active' : ''} px-4 py-2 rounded-md border border-primary/20 font-open-sans`}
              data-filter="delivered"
              onClick={() => setActiveFilter('delivered')}
            >
              Đã giao hàng
            </button>
          </div>

          {/* Orders List */}
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="order-card bg-secondary/50 rounded-lg p-6"
                data-status={order.status}
                data-aos="fade-up"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-lg font-orbitron">
                      Đơn hàng #{order.id}
                    </h3>
                    <p className="text-accent/70 text-sm font-open-sans">
                      Đặt hàng ngày {order.date}
                    </p>
                  </div>
                  <div className="mt-2 md:mt-0">
                    <span className={`status-badge ${getStatusClass(order.status)}`}>
                      {order.statusText}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div className="flex space-x-3 mt-3 md:mt-0">
                    <button
                      className="view-details-btn bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded text-sm transition font-open-sans"
                      onClick={() => toggleOrderDetails(order.id)}
                    >
                      {getButtonText(order.id)}
                    </button>
                    <button className="bg-transparent border border-primary text-primary hover:bg-primary hover:text-white px-4 py-2 rounded text-sm transition font-open-sans">
                      Mua lại
                    </button>
                  </div>
                </div>

                {/* Order Details (Hidden by default) */}
                {expandedOrders.has(order.id) && (
                  <div className="order-details mt-4">
                    <div className="border-t border-primary/20 pt-4">
                      <h4 className="font-semibold mb-3 font-orbitron">Chi tiết đơn hàng</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h5 className="font-medium mb-2 font-open-sans">
                            Địa chỉ giao hàng
                          </h5>
                          <p className="text-accent/70 font-open-sans">{order.shippingAddress.name}</p>
                          <p className="text-accent/70 font-open-sans">
                            {order.shippingAddress.street}
                          </p>
                          <p className="text-accent/70 font-open-sans">
                            {order.shippingAddress.city}
                          </p>
                          <p className="text-accent/70 font-open-sans">{order.shippingAddress.country}</p>
                          <p className="text-accent/70 font-open-sans mt-2">
                            Điện thoại: {order.shippingAddress.phone}
                          </p>
                          <p className="text-accent/70 font-open-sans">
                            Email: {order.shippingAddress.email}
                          </p>
                        </div>
                        <div>
                          <h5 className="font-medium mb-2 font-open-sans">
                            Phương thức thanh toán
                          </h5>
                          <p className="text-accent/70 font-open-sans">
                            {order.paymentMethod}
                          </p>
                          <p className="text-accent/70 font-open-sans">
                            Thanh toán ngày {order.paymentDate}
                          </p>
                        </div>
                        <div className="md:col-span-2">
                          <h5 className="font-medium mb-2 font-open-sans">
                            Thông tin sản phẩm
                          </h5>
                          <div className="product-grid">
                            {order.products.map((product, index) => (
                              <div key={index} className="flex items-center space-x-3">
                                <img
                                  src={product.image}
                                  alt={product.name}
                                  className="w-12 h-12 object-cover rounded"
                                />
                                <div>
                                  <p className="font-medium font-open-sans">
                                    {product.name}
                                  </p>
                                  <p className="text-accent/70 text-sm font-open-sans">
                                    Số lượng: {product.quantity}
                                  </p>
                                  <p className="text-accent/70 text-sm font-open-sans">
                                    Giá: {product.price}
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
                            Theo dõi vận chuyển
                          </h5>
                          <div className="tracking-progress mb-4">
                            <div
                              className="tracking-progress-bar"
                              style={{ width: `${(order.trackingSteps.filter(s => s.completed).length / order.trackingSteps.length) * 100}%` }}
                            ></div>
                          </div>
                          <div className="flex justify-between text-sm font-open-sans">
                            {order.trackingSteps.map((step, index) => (
                              <div key={index} className={`tracking-step ${step.completed ? 'completed' : ''}`}>
                                <p>{step.step}</p>
                                <p className="text-accent/70 text-xs">{step.date || 'Chưa hoàn thành'}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredOrders.length === 0 && (
            <div className="empty-orders text-center py-16" data-aos="fade-up">
              <i data-feather="package" className="h-16 w-16 text-primary mx-auto mb-4"></i>
              <h3 className="text-xl font-semibold mb-2 font-orbitron">
                Không tìm thấy đơn hàng
              </h3>
              <p className="text-accent/70 mb-6 font-open-sans">
                Bạn chưa đặt đơn hàng nào.
              </p>
              <a
                href="shop.html"
                className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-md font-semibold transition font-open-sans"
              >
                Bắt đầu mua sắm
              </a>
            </div>
          )}

          {/* Pagination */}
          {orders.length > 0 && (
            <div className="mt-12 flex justify-center" data-aos="fade-up">
              <nav className="flex items-center space-x-2">
                <button className="p-2 text-accent/70 hover:text-primary transition" aria-label="Trang trước">
                  <i data-feather="chevron-left" className="h-5 w-5"></i>
                </button>
                <button className="w-8 h-8 rounded bg-primary text-white font-medium font-open-sans">
                  1
                </button>
                <button className="w-8 h-8 rounded text-accent/70 hover:text-primary transition font-open-sans">
                  2
                </button>
                <button className="w-8 h-8 rounded text-accent/70 hover:text-primary transition font-open-sans">
                  3
                </button>
                <span className="px-2 text-accent/70 font-open-sans">...</span>
                <button className="p-2 text-accent/70 hover:text-primary transition" aria-label="Trang tiếp theo">
                  <i data-feather="chevron-right" className="h-5 w-5"></i>
                </button>
              </nav>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Orders;