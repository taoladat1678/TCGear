// view-user.tsx
import React, { useEffect } from 'react';

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
  username?: string;
}

interface ViewUserProps {
  user: User;
  onClose: () => void;
}

const ViewUser: React.FC<ViewUserProps> = ({ user, onClose }) => {
  useEffect(() => {
    if (typeof window !== 'undefined' && window.feather) {
      window.feather.replace();
    }
  }, []);

  return (
    <div className="fixed inset-0 z-[1000] overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-secondary/90" onClick={onClose}></div>
        </div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div className="inline-block align-bottom bg-secondary rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full relative z-[1001]">
          <div className="px-6 py-4 border-b border-primary/20 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-accent font-orbitron">Chi Tiết Người Dùng</h3>
            <button onClick={onClose} className="modal-close">
              <i data-feather="x" />
            </button>
          </div>
          <div className="px-6 py-4">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-accent/70 mb-2 font-open-sans">User ID</label>
                  <input
                    type="text"
                    id="view-user_id"
                    readOnly
                    value={user.id}
                    className="w-full px-3 py-2 border border-primary/20 rounded-md bg-secondary text-accent font-open-sans"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-accent/70 mb-2 font-open-sans">Họ và Tên</label>
                  <input
                    type="text"
                    id="view-user_fullname"
                    readOnly
                    value={user.name}
                    className="w-full px-3 py-2 border border-primary/20 rounded-md bg-secondary text-accent font-open-sans"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-accent/70 mb-2 font-open-sans">Tên Đăng Nhập</label>
                  <input
                    type="text"
                    id="view-user_username"
                    readOnly
                    value={user.username || user.id}
                    className="w-full px-3 py-2 border border-primary/20 rounded-md bg-secondary text-accent font-open-sans"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-accent/70 mb-2 font-open-sans">Email</label>
                  <input
                    type="email"
                    id="view-user_email"
                    readOnly
                    value={user.email}
                    className="w-full px-3 py-2 border border-primary/20 rounded-md bg-secondary text-accent font-open-sans"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-accent/70 mb-2 font-open-sans">Số Điện Thoại</label>
                  <input
                    type="tel"
                    id="view-user_phone_number"
                    readOnly
                    value={user.phone || ''}
                    className="w-full px-3 py-2 border border-primary/20 rounded-md bg-secondary text-accent font-open-sans"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-accent/70 mb-2 font-open-sans">Vai Trò</label>
                  <input
                    type="text"
                    id="view-user_role"
                    readOnly
                    value={user.role || ''}
                    className="w-full px-3 py-2 border border-primary/20 rounded-md bg-secondary text-accent font-open-sans"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-accent/70 mb-2 font-open-sans">Ngày Đăng Ký</label>
                  <input
                    type="date"
                    id="view-user_register"
                    readOnly
                    value={user.register || ''}
                    className="w-full px-3 py-2 border border-primary/20 rounded-md bg-secondary text-accent font-open-sans"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-accent/70 mb-2 font-open-sans">Số Đơn Hàng</label>
                  <input
                    type="number"
                    id="view-user_orders"
                    readOnly
                    value={user.orders || ''}
                    className="w-full px-3 py-2 border border-primary/20 rounded-md bg-secondary text-accent font-open-sans"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-accent/70 mb-2 font-open-sans">Địa Chỉ</label>
                  <textarea
                    id="view-user_address"
                    rows={3}
                    readOnly
                    value={user.address || ''}
                    className="w-full px-3 py-2 border border-primary/20 rounded-md bg-secondary text-accent font-open-sans"
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-accent/70 mb-2 font-open-sans">Tổng Chi Tiêu</label>
                  <input
                    type="text"
                    id="view-user_total"
                    readOnly
                    value={user.total || ''}
                    className="w-full px-3 py-2 border border-primary/20 rounded-md bg-secondary text-accent font-open-sans"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-accent/70 mb-2 font-open-sans">Trạng Thái</label>
                  <input
                    type="text"
                    id="view-user_status"
                    readOnly
                    value={user.status}
                    className="w-full px-3 py-2 border border-primary/20 rounded-md bg-secondary text-accent font-open-sans"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="px-6 py-4 border-t border-primary/20 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-primary/20 rounded-md text-accent hover:bg-secondary/70 font-open-sans"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewUser;