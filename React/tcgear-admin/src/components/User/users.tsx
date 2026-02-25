// users.tsx
import React, { useState, useEffect } from 'react';
import AddUser from '../Modal/Add/add-user';
import EditUser from '../Modal/Edit/edit-user';
import ViewUser from '../Modal/View/view-user';

import './users.css';

interface User {
  id: string;
  name: string;
  email: string;
  status: string;
  phone?: string;
  address?: string;
  register?: string;
  orders?: string;
  total?: string;
  role?: string;
}

const Users: React.FC = () => {
  const [users] = useState<User[]>([
    {
      id: '#CUS-001',
      name: 'Emma Wilson',
      email: 'emma.wilson@email.com',
      status: 'Active',
      phone: '+84 123 456 789',
      address: '123 Đường ABC, Quận 1, TP.HCM',
      register: '2023-09-15',
      orders: '8',
      total: '$1,249.50',
      role: 'Regular',
    },
    {
      id: '#CUS-002',
      name: 'David Miller',
      email: 'david.miller@email.com',
      status: 'Active',
      phone: '+84 987 654 321',
      address: '456 Đường XYZ, Quận 3, TP.HCM',
      register: '2023-10-02',
      orders: '3',
      total: '$589.99',
      role: 'Regular',
    },
    {
      id: '#CUS-003',
      name: 'Sophia Garcia',
      email: 'sophia.garcia@email.com',
      status: 'VIP',
      phone: '+84 456 789 123',
      address: '789 Đường DEF, Quận 7, TP.HCM',
      register: '2023-08-20',
      orders: '12',
      total: '$2,499.00',
      role: 'VIP',
    },
    {
      id: '#CUS-004',
      name: 'James Taylor',
      email: 'james.taylor@email.com',
      status: 'Mới',
      phone: '+84 321 654 987',
      address: '321 Đường GHI, Quận 10, TP.HCM',
      register: '2023-11-05',
      orders: '1',
      total: '$149.99',
      role: 'Regular',
    },
    {
      id: '#CUS-005',
      name: 'Olivia Martinez',
      email: 'olivia.martinez@email.com',
      status: 'Inactive',
      phone: '+84 789 123 456',
      address: '654 Đường JKL, Quận 2, TP.HCM',
      register: '2023-07-12',
      orders: '0',
      total: '$0.00',
      role: 'Regular',
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const openAddModal = () => setShowAddModal(true);
  const closeAddModal = () => setShowAddModal(false);

  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };
  const closeEditModal = () => {
    setShowEditModal(false);
    setSelectedUser(null);
  };

  const openViewModal = (user: User) => {
    setSelectedUser(user);
    setShowViewModal(true);
  };
  const closeViewModal = () => {
    setShowViewModal(false);
    setSelectedUser(null);
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-500/20 text-green-500';
      case 'vip':
        return 'bg-purple-500/20 text-purple-500';
      case 'mới':
        return 'bg-yellow-500/20 text-yellow-500';
      case 'inactive':
        return 'bg-gray-500/20 text-gray-500';
      default:
        return 'bg-gray-500/20 text-gray-500';
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && window.feather) {
      window.feather.replace();
    }
  }, []);

  return (
    <>
      <main className="flex-1 overflow-y-auto p-4 max-w-7xl md:p-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 md:mb-8 animate-slideUpFromBottom">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-accent font-orbitron">Quản Lý Khách Hàng</h1>
            <p className="text-accent/70 font-open-sans mt-1">Quản lý thông tin và hoạt động của tất cả khách hàng</p>
          </div>
          <div className="flex space-x-2 mt-4 sm:mt-0">
            <button
              onClick={openAddModal}
              className="px-4 py-2 bg-primary text-accent rounded-md font-open-sans hover:bg-primary/90 transition flex items-center"
            >
              <i data-feather="plus" className="w-4 h-4 mr-2" />
              Thêm Người Dùng
            </button>
            <button className="px-4 py-2 border border-primary/20 text-accent rounded-md font-open-sans hover:bg-primary/10 transition flex items-center">
              <i data-feather="download" className="w-4 h-4 mr-2" />
              Xuất CSV
            </button>
          </div>
        </div>

        {/* Customer Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 md:gap-8 md:mb-12">
          <div className="bg-secondary/50 rounded-lg shadow p-4 md:p-6 border border-primary/20 animate-slideUpFromBottom">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-primary/10 transition-transform duration-300 hover:scale-110">
                <i data-feather="users" className="w-6 h-6 text-primary" />
              </div>
              <div className="ml-4">
                <p className="text-accent/70 font-open-sans">Tổng Khách Hàng</p>
                <h3 className="text-xl md:text-2xl font-bold text-accent font-orbitron">5,372</h3>
              </div>
            </div>
            <p className="text-sm text-accent/70 mt-2 font-open-sans">
              <i data-feather="trending-up" className="w-4 h-4 inline transition-transform duration-200 hover:scale-110" />
              5.7% so với tuần trước
            </p>
          </div>
          <div className="bg-secondary/50 rounded-lg shadow p-4 md:p-6 border border-primary/20 animate-slideUpFromBottom">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-500/20 transition-transform duration-300 hover:scale-110">
                <i data-feather="user-plus" className="w-6 h-6 text-green-500" />
              </div>
              <div className="ml-4">
                <p className="text-accent/70 font-open-sans">Khách Hàng Mới</p>
                <h3 className="text-xl md:text-2xl font-bold text-accent font-orbitron">128</h3>
              </div>
            </div>
            <p className="text-sm text-accent/70 mt-2 font-open-sans">
              <i data-feather="trending-up" className="w-4 h-4 inline transition-transform duration-200 hover:scale-110" />
              15.2% so với tuần trước
            </p>
          </div>
          <div className="bg-secondary/50 rounded-lg shadow p-4 md:p-6 border border-primary/20 animate-slideUpFromBottom">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-500/20 transition-transform duration-300 hover:scale-110">
                <i data-feather="activity" className="w-6 h-6 text-blue-500" />
              </div>
              <div className="ml-4">
                <p className="text-accent/70 font-open-sans">Khách Hàng Active</p>
                <h3 className="text-xl md:text-2xl font-bold text-accent font-orbitron">3,845</h3>
              </div>
            </div>
            <p className="text-sm text-accent/70 mt-2 font-open-sans">
              <i data-feather="trending-up" className="w-4 h-4 inline transition-transform duration-200 hover:scale-110" />
              4.1% so với tuần trước
            </p>
          </div>
          <div className="bg-secondary/50 rounded-lg shadow p-4 md:p-6 border border-primary/20 animate-slideUpFromBottom">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-500/20 transition-transform duration-300 hover:scale-110">
                <i data-feather="trending-up" className="w-6 h-6 text-purple-500" />
              </div>
              <div className="ml-4">
                <p className="text-accent/70 font-open-sans">Tỷ Lệ Giữ Chân</p>
                <h3 className="text-xl md:text-2xl font-bold text-accent font-orbitron">87%</h3>
              </div>
            </div>
            <p className="text-sm text-accent/70 mt-2 font-open-sans">
              <i data-feather="trending-up" className="w-4 h-4 inline transition-transform duration-200 hover:scale-110" />
              2.3% so với tuần trước
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
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="new">Mới</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-accent/70 font-open-sans mb-2">Ngày Đăng Ký</label>
              <input type="date" className="w-full px-3 py-2 border border-primary/20 bg-secondary text-accent rounded-md focus:outline-none focus:ring-2 focus:ring-primary font-open-sans" />
            </div>
            <div>
              <label className="block text-sm text-accent/70 font-open-sans mb-2">Số Đơn Hàng</label>
              <select className="w-full px-3 py-2 border border-primary/20 bg-secondary text-accent rounded-md focus:outline-none focus:ring-2 focus:ring-primary font-open-sans">
                <option value="">Tất cả</option>
                <option value="1">1+</option>
                <option value="3">3+</option>
                <option value="5">5+</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-accent/70 font-open-sans mb-2">Loại Khách Hàng</label>
              <select className="w-full px-3 py-2 border border-primary/20 bg-secondary text-accent rounded-md focus:outline-none focus:ring-2 focus:ring-primary font-open-sans">
                <option value="">Tất cả</option>
                <option value="regular">Thường</option>
                <option value="vip">VIP</option>
                <option value="premium">Premium</option>
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

        {/* Customers Table */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 md:gap-8 md:mb-12">
          <div className="lg:col-span-2 bg-secondary/50 rounded-lg shadow overflow-hidden border border-primary/20 animate-slideUpFromBottom">
            <div className="px-4 py-4 md:px-6 border-b border-primary/20 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-accent font-orbitron">Danh Sách Khách Hàng</h3>
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
                    <th className="px-4 py-3 md:px-6 text-left text-xs font-medium text-accent/70 font-open-sans uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-4 py-3 md:px-6 text-left text-xs font-medium text-accent/70 font-open-sans uppercase tracking-wider">
                      Ảnh
                    </th>
                    <th className="px-4 py-3 md:px-6 text-left text-xs font-medium text-accent/70 font-open-sans uppercase tracking-wider">
                      Họ Tên
                    </th>
                    <th className="px-4 py-3 md:px-6 text-left text-xs font-medium text-accent/70 font-open-sans uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-4 py-3 md:px-6 text-left text-xs font-medium text-accent/70 font-open-sans uppercase tracking-wider">
                      Trạng Thái
                    </th>
                    <th className="px-4 py-3 md:px-6 text-left text-xs font-medium text-accent/70 font-open-sans uppercase tracking-wider">
                      Hành Động
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-primary/20">
                  {users.map((user, index) => (
                    <tr
                      key={user.id}
                      className="animate-in"
                      data-phone={user.phone}
                      data-address={user.address}
                      data-register={user.register}
                      data-orders={user.orders}
                      data-total={user.total}
                      data-role={user.role}
                      data-status={user.status.toLowerCase()}
                    >
                      <td className="px-4 py-4 md:px-6 whitespace-nowrap text-sm text-accent font-open-sans">
                        {user.id}
                      </td>
                      <td className="px-4 py-4 md:px-6 whitespace-nowrap">
                        <img
                          className="h-10 w-10 rounded-full object-cover"
                          src={`http://static.photos/people/200x200/${index + 2}`}
                          alt={user.name}
                        />
                      </td>
                      <td className="px-4 py-4 md:px-6 whitespace-nowrap text-sm font-semibold text-accent font-open-sans">
                        {user.name}
                      </td>
                      <td className="px-4 py-4 md:px-6 whitespace-nowrap text-sm text-accent font-open-sans">
                        {user.email}
                      </td>
                      <td className="px-4 py-4 md:px-6 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadgeClass(user.status)} font-open-sans`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 md:px-6 whitespace-nowrap text-sm text-accent font-open-sans">
                        <div className="flex space-x-2">
                          <button onClick={() => openViewModal(user)} className="view-user-btn text-primary hover:text-primary/80">
                            <i data-feather="eye" className="w-4 h-4" />
                          </button>
                          <button onClick={() => openEditModal(user)} className="edit-user-btn text-blue-500 hover:text-blue-400">
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
                <button className="px-3 py-1 border border-primary/20 text-accent rounded-md font-open-sans hover:bg-primary/10 disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                  <i data-feather="chevron-left" className="w-4 h-4" />
                </button>
                <button className="px-3 py-1 bg-primary text-accent rounded-md font-open-sans">1</button>
                <button className="px-3 py-1 border border-primary/20 text-accent rounded-md font-open-sans hover:bg-primary/10">2</button>
                <button className="px-3 py-1 border border-primary/20 text-accent rounded-md font-open-sans hover:bg-primary/10">3</button>
                <button className="px-3 py-1 border border-primary/20 text-accent rounded-md font-open-sans hover:bg-primary/10">
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

      {/* Modals */}
      {showAddModal && <AddUser onClose={closeAddModal} />}
      {showEditModal && selectedUser && <EditUser user={selectedUser} onClose={closeEditModal} />}
      {showViewModal && selectedUser && <ViewUser user={selectedUser} onClose={closeViewModal} />}
    </>
  );
};

export default Users;