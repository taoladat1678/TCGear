// add-user.tsx
import React, { useState, useEffect } from 'react';

interface AddUserProps {
  onClose: () => void;
}

const AddUser: React.FC<AddUserProps> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    user_id: '',
    user_fullname: '',
    user_username: '',
    user_password: '',
    user_email: '',
    user_phone_number: '',
    user_status: '',
    user_address: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Add form submitted:', formData);
    alert('Người dùng đã được thêm thành công!');
    onClose();
  };

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
            <h3 className="text-lg font-semibold text-accent font-orbitron">Thêm Người Dùng Mới</h3>
            <button onClick={onClose} className="modal-close">
              <i data-feather="x" />
            </button>
          </div>
          <div className="px-6 py-4">
            <form id="add-user-form" onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="user_id" className="block text-sm font-medium text-accent/70 mb-2 font-open-sans">
                    User ID <span className="text-primary">*</span>
                  </label>
                  <input
                    type="text"
                    id="user_id"
                    name="user_id"
                    required
                    value={formData.user_id}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-primary/20 rounded-md bg-secondary text-accent focus:outline-none focus:ring-2 focus:ring-primary font-open-sans"
                    placeholder="Nhập User ID"
                  />
                </div>
                <div>
                  <label htmlFor="user_fullname" className="block text-sm font-medium text-accent/70 mb-2 font-open-sans">
                    Họ và Tên <span className="text-primary">*</span>
                  </label>
                  <input
                    type="text"
                    id="user_fullname"
                    name="user_fullname"
                    required
                    value={formData.user_fullname}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-primary/20 rounded-md bg-secondary text-accent focus:outline-none focus:ring-2 focus:ring-primary font-open-sans"
                    placeholder="Nhập họ và tên"
                  />
                </div>
                <div>
                  <label htmlFor="user_username" className="block text-sm font-medium text-accent/70 mb-2 font-open-sans">
                    Tên Đăng Nhập <span className="text-primary">*</span>
                  </label>
                  <input
                    type="text"
                    id="user_username"
                    name="user_username"
                    required
                    value={formData.user_username}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-primary/20 rounded-md bg-secondary text-accent focus:outline-none focus:ring-2 focus:ring-primary font-open-sans"
                    placeholder="Nhập tên đăng nhập"
                  />
                </div>
                <div>
                  <label htmlFor="user_password" className="block text-sm font-medium text-accent/70 mb-2 font-open-sans">
                    Mật Khẩu <span className="text-primary">*</span>
                  </label>
                  <input
                    type="password"
                    id="user_password"
                    name="user_password"
                    required
                    value={formData.user_password}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-primary/20 rounded-md bg-secondary text-accent focus:outline-none focus:ring-2 focus:ring-primary font-open-sans"
                    placeholder="Nhập mật khẩu"
                  />
                </div>
                <div>
                  <label htmlFor="user_email" className="block text-sm font-medium text-accent/70 mb-2 font-open-sans">
                    Email <span className="text-primary">*</span>
                  </label>
                  <input
                    type="email"
                    id="user_email"
                    name="user_email"
                    required
                    value={formData.user_email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-primary/20 rounded-md bg-secondary text-accent focus:outline-none focus:ring-2 focus:ring-primary font-open-sans"
                    placeholder="Nhập email"
                  />
                </div>
                <div>
                  <label htmlFor="user_phone_number" className="block text-sm font-medium text-accent/70 mb-2 font-open-sans">
                    Số Điện Thoại <span className="text-primary">*</span>
                  </label>
                  <input
                    type="tel"
                    id="user_phone_number"
                    name="user_phone_number"
                    required
                    value={formData.user_phone_number}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-primary/20 rounded-md bg-secondary text-accent focus:outline-none focus:ring-2 focus:ring-primary font-open-sans"
                    placeholder="Nhập số điện thoại"
                  />
                </div>
                <div>
                  <label htmlFor="user_status" className="block text-sm font-medium text-accent/70 mb-2 font-open-sans">
                    Trạng Thái <span className="text-primary">*</span>
                  </label>
                  <select
                    id="user_status"
                    name="user_status"
                    required
                    value={formData.user_status}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-primary/20 rounded-md bg-secondary text-accent focus:outline-none focus:ring-2 focus:ring-primary font-open-sans"
                  >
                    <option value="">Chọn trạng thái</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="user_address" className="block text-sm font-medium text-accent/70 mb-2 font-open-sans">
                    Địa Chỉ
                  </label>
                  <textarea
                    id="user_address"
                    name="user_address"
                    rows={3}
                    value={formData.user_address}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-primary/20 rounded-md bg-secondary text-accent focus:outline-none focus:ring-2 focus:ring-primary font-open-sans"
                    placeholder="Nhập địa chỉ"
                  ></textarea>
                </div>
              </div>
            </form>
          </div>
          <div className="px-6 py-4 border-t border-primary/20 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-primary/20 rounded-md text-accent hover:bg-secondary/70 font-open-sans"
            >
              Hủy
            </button>
            <button
              type="submit"
              form="add-user-form"
              className="px-4 py-2 bg-primary text-accent rounded-md hover:bg-primary/90 font-open-sans"
            >
              Thêm Người Dùng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddUser;