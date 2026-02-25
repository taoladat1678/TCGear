// Orders.tsx
import React, { useState, useEffect } from 'react';
import './orders.css';
import OrderViewModal from '../Modal/View/view-orders';
import OrderEditModal from '../Modal/Edit/edit-orders';

interface Order {
  id: string;
  customer: string;
  date: string;
  products: string;
  total: string;
  status: string;
  paymentStatus: string;
}

interface OrdersProps {
  // Add props if needed, e.g., orders data, onFilterChange, etc.
}

const Orders: React.FC<OrdersProps> = () => {
  const [orders] = useState<Order[]>([
    {
      id: '#ORD-001',
      customer: 'John Doe',
      date: '2023-10-15',
      products: 'Áo T1, Tai Nghe Gaming',
      total: '$249.99',
      status: 'Hoàn Thành',
      paymentStatus: 'Đã Thanh Toán'
    },
    {
      id: '#ORD-002',
      customer: 'Jane Smith',
      date: '2023-10-14',
      products: 'Bàn Phím Cơ, Chuột Gaming',
      total: '$189.50',
      status: 'Đang Xử Lý',
      paymentStatus: 'Chờ Thanh Toán'
    },
    {
      id: '#ORD-003',
      customer: 'Robert Johnson',
      date: '2023-10-14',
      products: 'Full Set Gaming Gear',
      total: '$429.99',
      status: 'Đã Giao',
      paymentStatus: 'Đã Thanh Toán'
    },
    {
      id: '#ORD-004',
      customer: 'Sarah Williams',
      date: '2023-10-13',
      products: 'Áo Đấu Limited',
      total: '$99.99',
      status: 'Hoàn Thành',
      paymentStatus: 'Đã Thanh Toán'
    },
    {
      id: '#ORD-005',
      customer: 'Michael Brown',
      date: '2023-10-12',
      products: 'Gaming Chair Pro',
      total: '$299.99',
      status: 'Đã Hủy',
      paymentStatus: 'Chưa Thanh Toán'
    }
  ]);

  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);

  useEffect(() => {
    // Replace feather icons after component mounts
    if (typeof window !== 'undefined') {
      // Assuming feather-icons script is loaded via CDN in index.html
      // @ts-ignore
      if (window.feather) {
        // @ts-ignore
        window.feather.replace();
      }
    }
  }, []);

  const openViewModal = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (order) {
      setCurrentOrder(order);
      setViewModalOpen(true);
    }
  };

  const openEditModal = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (order) {
      setCurrentOrder(order);
      setEditModalOpen(true);
    }
  };

  const handleEditSave = (newStatus: string, newPaymentStatus: string) => {
    if (currentOrder) {
      // Update the order in state (in real app, update via API)
      setOrders(prev => prev.map(o => 
        o.id === currentOrder.id 
          ? { ...o, status: newStatus, paymentStatus: newPaymentStatus }
          : o
      ));
      // Optionally update currentOrder
      setCurrentOrder(prev => prev ? { ...prev, status: newStatus, paymentStatus: newPaymentStatus } : null);
    }
    setEditModalOpen(false);
  };

  const closeViewModal = () => setViewModalOpen(false);
  const closeEditModal = () => setEditModalOpen(false);

  // Status to class mapping for spans
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Hoàn Thành': return 'bg-primary/10 text-primary';
      case 'Đang Xử Lý': return 'bg-yellow-500/20 text-yellow-500';
      case 'Đã Giao': return 'bg-blue-500/20 text-blue-500';
      case 'Đã Hủy': return 'bg-red-500/20 text-red-500';
      default: return 'bg-primary/10 text-primary';
    }
  };

  const getPaymentStatusClass = (paymentStatus: string) => {
    switch (paymentStatus) {
      case 'Đã Thanh Toán': return 'bg-green-500/20 text-green-500';
      case 'Chờ Thanh Toán': return 'bg-orange-500/20 text-orange-500';
      case 'Chưa Thanh Toán': return 'bg-red-500/20 text-red-500';
      default: return 'bg-green-500/20 text-green-500';
    }
  };

  return (
    <>
      <main className="flex-1 overflow-y-auto p-4 max-w-7xl mx-auto md:p-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 md:mb-8 animate-slideUpFromBottom">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-accent font-orbitron">Quản Lý Đơn Hàng</h1>
            <p className="text-accent/70 font-open-sans mt-1">Theo dõi và quản lý tất cả đơn hàng của cửa hàng</p>
          </div>
          <div className="flex space-x-2 mt-4 sm:mt-0">
            <button className="px-4 py-2 border border-primary/20 text-accent rounded-md font-open-sans hover:bg-primary/10 transition flex items-center">
              <i data-feather="download" className="w-4 h-4 mr-2" />
              Xuất Excel
            </button>
          </div>
        </div>

        {/* Filters and Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 md:gap-8 md:mb-12">
          <div className="bg-secondary/50 rounded-lg shadow p-4 md:p-6 border border-primary/20 animate-slideUpFromBottom">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-primary/10 transition-transform duration-300 hover:scale-110">
                <i data-feather="shopping-cart" className="w-6 h-6 text-primary" />
              </div>
              <div className="ml-4">
                <p className="text-accent/70 font-open-sans">Tổng Đơn Hàng</p>
                <h3 className="text-xl md:text-2xl font-bold text-accent font-orbitron">1,248</h3>
              </div>
            </div>
            <p className="text-sm text-accent/70 mt-2 font-open-sans">
              <i data-feather="trending-up" className="w-4 h-4 inline transition-transform duration-200 hover:scale-110" />
              8.2% so với tuần trước
            </p>
          </div>
          <div className="bg-secondary/50 rounded-lg shadow p-4 md:p-6 border border-primary/20 animate-slideUpFromBottom">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-500/20 transition-transform duration-300 hover:scale-110">
                <i data-feather="clock" className="w-6 h-6 text-yellow-500" />
              </div>
              <div className="ml-4">
                <p className="text-accent/70 font-open-sans">Đang Chờ Xử Lý</p>
                <h3 className="text-xl md:text-2xl font-bold text-accent font-orbitron">42</h3>
              </div>
            </div>
            <p className="text-sm text-accent/70 mt-2 font-open-sans">
              <i data-feather="trending-up" className="w-4 h-4 inline transition-transform duration-200 hover:scale-110" />
              12.5% so với tuần trước
            </p>
          </div>
          <div className="bg-secondary/50 rounded-lg shadow p-4 md:p-6 border border-primary/20 animate-slideUpFromBottom">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-500/20 transition-transform duration-300 hover:scale-110">
                <i data-feather="check-circle" className="w-6 h-6 text-green-500" />
              </div>
              <div className="ml-4">
                <p className="text-accent/70 font-open-sans">Đã Hoàn Thành</p>
                <h3 className="text-xl md:text-2xl font-bold text-accent font-orbitron">985</h3>
              </div>
            </div>
            <p className="text-sm text-accent/70 mt-2 font-open-sans">
              <i data-feather="trending-up" className="w-4 h-4 inline transition-transform duration-200 hover:scale-110" />
              5.7% so với tuần trước
            </p>
          </div>
          <div className="bg-secondary/50 rounded-lg shadow p-4 md:p-6 border border-primary/20 animate-slideUpFromBottom">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-red-500/20 transition-transform duration-300 hover:scale-110">
                <i data-feather="x-circle" className="w-6 h-6 text-red-500" />
              </div>
              <div className="ml-4">
                <p className="text-accent/70 font-open-sans">Đã Hủy</p>
                <h3 className="text-xl md:text-2xl font-bold text-accent font-orbitron">32</h3>
              </div>
            </div>
            <p className="text-sm text-accent/70 mt-2 font-open-sans">
              <i data-feather="trending-up" className="w-4 h-4 inline transition-transform duration-200 hover:scale-110" />
              3.1% so với tuần trước
            </p>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="bg-secondary/50 rounded-lg shadow p-4 md:p-6 border border-primary/20 mb-8 md:mb-12 animate-slideUpFromBottom">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm text-accent/70 font-open-sans mb-2">Trạng Thái</label>
              <select className="w-full px-3 py-2 border border-primary/20 bg-secondary text-accent rounded-md focus:outline-none focus:ring-2 focus:ring-primary font-open-sans">
                <option value="">Tất cả</option>
                <option value="pending">Chờ Xử Lý</option>
                <option value="processing">Đang Xử Lý</option>
                <option value="shipped">Đã Giao</option>
                <option value="completed">Hoàn Thành</option>
                <option value="cancelled">Đã Hủy</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-accent/70 font-open-sans mb-2">Ngày Bắt Đầu</label>
              <input type="date" className="w-full px-3 py-2 border border-primary/20 bg-secondary text-accent rounded-md focus:outline-none focus:ring-2 focus:ring-primary font-open-sans" />
            </div>
            <div>
              <label className="block text-sm text-accent/70 font-open-sans mb-2">Ngày Kết Thúc</label>
              <input type="date" className="w-full px-3 py-2 border border-primary/20 bg-secondary text-accent rounded-md focus:outline-none focus:ring-2 focus:ring-primary font-open-sans" />
            </div>
            <div>
              <label className="block text-sm text-accent/70 font-open-sans mb-2">Khách Hàng</label>
              <select className="w-full px-3 py-2 border border-primary/20 bg-secondary text-accent rounded-md focus:outline-none focus:ring-2 focus:ring-primary font-open-sans">
                <option value="">Tất cả</option>
                <option value="1">John Doe</option>
                <option value="2">Jane Smith</option>
                <option value="3">Robert Johnson</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <button className="px-4 py-2 bg-primary text-accent rounded-md font-open-sans hover:bg-primary/90 transition mr-2">
              Áp Dụng Bộ Lọc
            </button>
            <button className="px-4 py-2 border border-primary/20 text-accent rounded-md font-open-sans hover:bg-primary/10 transition">
              Đặt Lại
            </button>
          </div>
        </div>

        {/* Orders Table */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 md:gap-8 md:mb-12">
          <div className="lg:col-span-2 bg-secondary/50 rounded-lg shadow overflow-hidden border border-primary/20 animate-slideUpFromBottom">
            <div className="px-4 py-4 md:px-6 border-b border-primary/20 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-accent font-orbitron">Danh Sách Đơn Hàng</h3>
              <div className="flex items-center space-x-2">
                <button className="text-primary text-sm flex items-center font-open-sans hover:text-primary/80 transition-all duration-200 hover:scale-110">
                  <i data-feather="refresh-cw" className="w-4 h-4 mr-1" />
                  Làm Mới
                </button>
                <button className="text-primary text-sm flex items-center font-open-sans hover:text-primary/80 transition-all duration-200 hover:scale-110">
                  <i data-feather="download" className="w-4 h-4 mr-1" />
                  Xuất
                </button>
              </div>
            </div>
            <div className="overflow-x-auto table-container">
              <table className="min-w-full divide-y divide-primary/20">
                <thead className="bg-secondary/30">
                  <tr>
                    <th className="px-4 py-3 md:px-6 text-left text-xs font-medium text-accent/70 font-open-sans uppercase tracking-wider">ID Đơn Hàng</th>
                    <th className="px-4 py-3 md:px-6 text-left text-xs font-medium text-accent/70 font-open-sans uppercase tracking-wider">Khách Hàng</th>
                    <th className="px-4 py-3 md:px-6 text-left text-xs font-medium text-accent/70 font-open-sans uppercase tracking-wider">Ngày Đặt</th>
                    <th className="px-4 py-3 md:px-6 text-left text-xs font-medium text-accent/70 font-open-sans uppercase tracking-wider">Sản Phẩm</th>
                    <th className="px-4 py-3 md:px-6 text-left text-xs font-medium text-accent/70 font-open-sans uppercase tracking-wider">Tổng Cộng</th>
                    <th className="px-4 py-3 md:px-6 text-left text-xs font-medium text-accent/70 font-open-sans uppercase tracking-wider">Trạng Thái</th>
                    <th className="px-4 py-3 md:px-6 text-left text-xs font-medium text-accent/70 font-open-sans uppercase tracking-wider">Trạng Thái Thanh Toán</th>
                    <th className="px-4 py-3 md:px-6 text-left text-xs font-medium text-accent/70 font-open-sans uppercase tracking-wider">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-primary/20">
                  {orders.map((order) => (
                    <tr key={order.id} className="animate-in">
                      <td className="px-4 py-4 md:px-6 whitespace-nowrap text-sm text-accent font-open-sans">{order.id}</td>
                      <td className="px-4 py-4 md:px-6 whitespace-nowrap text-sm text-accent font-open-sans">{order.customer}</td>
                      <td className="px-4 py-4 md:px-6 whitespace-nowrap text-sm text-accent font-open-sans">{order.date}</td>
                      <td className="px-4 py-4 md:px-6 whitespace-nowrap text-sm text-accent font-open-sans">{order.products}</td>
                      <td className="px-4 py-4 md:px-6 whitespace-nowrap text-sm text-accent font-open-sans">{order.total}</td>
                      <td className="px-4 py-4 md:px-6 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusClass(order.status)} font-open-sans`}>{order.status}</span>
                      </td>
                      <td className="px-4 py-4 md:px-6 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${getPaymentStatusClass(order.paymentStatus)} font-open-sans`}>{order.paymentStatus}</span>
                      </td>
                      <td className="px-4 py-4 md:px-6 whitespace-nowrap text-sm text-accent font-open-sans">
                        <div className="flex space-x-2">
                          <button onClick={() => openViewModal(order.id)} className="text-primary hover:text-primary/80">
                            <i data-feather="eye" className="w-4 h-4" />
                          </button>
                          <button onClick={() => openEditModal(order.id)} className="text-blue-500 hover:text-blue-400">
                            <i data-feather="edit" className="w-4 h-4" />
                          </button>
                          <button className="text-red-500 hover:text-red-400">
                            <i data-feather="trash" className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-4 md:px-6 border-t border-primary/20 flex justify-end items-center">
              <div className="flex space-x-2">
                <button className="px-3 py-1 border border-primary/20 text-accent rounded-md font-open-sans hover:bg-primary/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200" disabled>
                  <i data-feather="chevron-left" className="w-4 h-4" />
                </button>
                <button className="px-3 py-1 bg-primary text-accent rounded-md font-open-sans transition-all duration-200">1</button>
                <button className="px-3 py-1 border border-primary/20 text-accent rounded-md font-open-sans hover:bg-primary/10 transition-all duration-200">2</button>
                <button className="px-3 py-1 border border-primary/20 text-accent rounded-md font-open-sans hover:bg-primary/10 transition-all duration-200">3</button>
                <button className="px-3 py-1 border border-primary/20 text-accent rounded-md font-open-sans hover:bg-primary/10 transition-all duration-200">
                  <i data-feather="chevron-right" className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-secondary/50 rounded-lg shadow p-4 md:p-6 border border-primary/20 animate-slideUpFromBottom">
          <h3 className="text-lg font-semibold text-accent font-orbitron mb-4">Trạng Thái Hệ Thống</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-primary/10 p-4 rounded-lg animate-in">
              <div className="flex items-center">
                <i data-feather="server" className="w-6 h-6 text-primary transition-transform duration-200 hover:scale-110" />
                <span className="ml-2 text-sm font-semibold text-accent font-open-sans">Máy Chủ</span>
              </div>
              <p className="text-xs text-accent/70 mt-2 font-open-sans">Tất cả hệ thống hoạt động bình thường</p>
            </div>
            <div className="bg-primary/10 p-4 rounded-lg animate-in">
              <div className="flex items-center">
                <i data-feather="database" className="w-6 h-6 text-primary transition-transform duration-200 hover:scale-110" />
                <span className="ml-2 text-sm font-semibold text-accent font-open-sans">Cơ Sở Dữ Liệu</span>
              </div>
              <p className="text-xs text-accent/70 mt-2 font-open-sans">Thời gian phản hồi: 42ms</p>
            </div>
            <div className="bg-primary/10 p-4 rounded-lg animate-in">
              <div className="flex items-center">
                <i data-feather="hard-drive" className="w-6 h-6 text-primary transition-transform duration-200 hover:scale-110" />
                <span className="ml-2 text-sm font-semibold text-accent font-open-sans">Lưu Trữ</span>
              </div>
              <p className="text-xs text-accent/70 mt-2 font-open-sans">78% đã sử dụng - 12.4GB trống</p>
            </div>
          </div>
        </div>
      </main>

      {currentOrder && (
        <>
          <OrderViewModal
            isOpen={viewModalOpen}
            onClose={closeViewModal}
            orderData={currentOrder}
          />
          <OrderEditModal
            isOpen={editModalOpen}
            onClose={closeEditModal}
            onSave={handleEditSave}
            currentOrderId={currentOrder.id}
            initialStatus={currentOrder.status.toLowerCase().replace(/\s+/g, '-')}
            initialPaymentStatus={currentOrder.paymentStatus.toLowerCase().replace(/\s+/g, '-')}
          />
        </>
      )}
    </>
  );
};

export default Orders;