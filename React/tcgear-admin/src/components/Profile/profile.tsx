// profile.tsx
import React, { useEffect } from 'react';
import feather from 'feather-icons'; // Import Feather Icons
import './profile.css'; // Import the separated CSS

interface ProfileProps {
  // Add props if needed, e.g., user data
}

const Profile: React.FC<ProfileProps> = () => {
  useEffect(() => {
    // Replace all <i data-feather> with SVG icons after component mounts
    feather.replace({
      'width': 20,
      'height': 20,
      'color': '#your-primary-color' // Optional: Customize color, e.g., '#3b82f6' for blue
    });
  }, []); // Run once after initial render

  return (
    <>
      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 max-w-7xl md:p-6">
        {/* Profile Overview */}
        <div className="bg-secondary/50 rounded-lg shadow p-6 md:p-8 border border-primary/20 mb-8">
          <h2 className="text-2xl font-bold text-accent font-orbitron mb-6">Hồ Sơ Của Bạn</h2>
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="flex flex-col items-center md:items-start">
              <img
                id="profile-avatar"
                className="profile-avatar w-32 h-32 rounded-full object-cover mb-4 transition-transform duration-200 hover:scale-105 border-4 border-primary/20"
                src="http://static.photos/people/200x200/1"
                alt="Ảnh đại diện"
              />
              <label htmlFor="avatar-upload" className="cursor-pointer bg-primary/10 hover:bg-primary/20 px-4 py-2 rounded-md text-primary font-open-sans transition-all duration-200 hover:scale-105">
                <i data-feather="camera" className="w-4 h-4 inline mr-2" />
                Thay Đổi Ảnh
              </label>
              <input type="file" id="avatar-upload" accept="image/*" className="hidden" />
            </div>
            <div className="flex-1">
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-accent font-open-sans">Nguyễn Văn A</h3>
                <p className="text-accent/70 font-open-sans">Quản Trị Viên Chính</p>
                <p className="text-sm text-accent/50 font-open-sans">Đã tham gia từ 2023</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Personal Information Section */}
          <div className="bg-secondary/50 rounded-lg shadow p-6 border border-primary/20">
            <h3 className="text-lg font-semibold text-accent font-orbitron mb-4">Thông Tin Cá Nhân</h3>
            <form className="space-y-4">
              <div>
                <label htmlFor="full-name" className="block text-sm font-medium text-accent/70 font-open-sans mb-2">
                  Họ Và Tên
                </label>
                <input
                  type="text"
                  id="full-name"
                  defaultValue="Nguyễn Văn A"
                  className="w-full px-3 py-2 bg-secondary/30 border border-primary/30 rounded-md text-accent focus:outline-none focus:border-primary font-open-sans"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-accent/70 font-open-sans mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  defaultValue="admin@tcgear.com"
                  className="w-full px-3 py-2 bg-secondary/30 border border-primary/30 rounded-md text-accent focus:outline-none focus:border-primary font-open-sans"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-accent/70 font-open-sans mb-2">
                  Số Điện Thoại
                </label>
                <input
                  type="tel"
                  id="phone"
                  defaultValue="+84 123 456 789"
                  className="w-full px-3 py-2 bg-secondary/30 border border-primary/30 rounded-md text-accent focus:outline-none focus:border-primary font-open-sans"
                />
              </div>
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-accent/70 font-open-sans mb-2">
                  Địa Chỉ
                </label>
                <textarea
                  id="address"
                  rows={3}
                  defaultValue="123 Đường ABC, Quận 1, TP. Hồ Chí Minh"
                  className="w-full px-3 py-2 bg-secondary/30 border border-primary/30 rounded-md text-accent focus:outline-none focus:border-primary font-open-sans"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-primary text-accent py-2 rounded-md font-semibold font-open-sans transition-all duration-200 hover:bg-primary/80 hover:scale-105"
              >
                Cập Nhật Thông Tin
              </button>
            </form>
          </div>

          {/* Change Password Section */}
          <div className="bg-secondary/50 rounded-lg shadow p-6 border border-primary/20">
            <h3 className="text-lg font-semibold text-accent font-orbitron mb-4">Đổi Mật Khẩu</h3>
            <form className="space-y-4">
              <div>
                <label htmlFor="current-password" className="block text-sm font-medium text-accent/70 font-open-sans mb-2">
                  Mật Khẩu Hiện Tại
                </label>
                <input
                  type="password"
                  id="current-password"
                  className="w-full px-3 py-2 bg-secondary/30 border border-primary/30 rounded-md text-accent focus:outline-none focus:border-primary font-open-sans"
                />
              </div>
              <div>
                <label htmlFor="new-password" className="block text-sm font-medium text-accent/70 font-open-sans mb-2">
                  Mật Khẩu Mới
                </label>
                <input
                  type="password"
                  id="new-password"
                  className="w-full px-3 py-2 bg-secondary/30 border border-primary/30 rounded-md text-accent focus:outline-none focus:border-primary font-open-sans"
                />
              </div>
              <div>
                <label htmlFor="confirm-password" className="block text-sm font-medium text-accent/70 font-open-sans mb-2">
                  Xác Nhận Mật Khẩu Mới
                </label>
                <input
                  type="password"
                  id="confirm-password"
                  className="w-full px-3 py-2 bg-secondary/30 border border-primary/30 rounded-md text-accent focus:outline-none focus:border-primary font-open-sans"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-primary text-accent py-2 rounded-md font-semibold font-open-sans transition-all duration-200 hover:bg-primary/80 hover:scale-105"
              >
                Đổi Mật Khẩu
              </button>
            </form>
          </div>
        </div>

        {/* Activity Log Section */}
            <div className="bg-secondary/50 rounded-lg shadow overflow-hidden border border-primary/20">
            <div className="flex items-center justify-between px-4 py-4 md:px-6 border-b border-primary/20">
                <h3 className="text-lg font-semibold text-accent font-orbitron">Nhật Ký Hoạt Động Gần Đây</h3>
                <button className="text-xs text-primary/70 hover:text-primary font-open-sans">Xem tất cả</button>
            </div>
            <ul className="divide-y divide-primary/20">
                <li className="px-4 py-4 md:px-6 flex items-center hover:bg-secondary/30 transition-colors">
                <i data-feather="check-circle" className="w-5 h-5 text-primary mr-3 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-accent font-open-sans truncate">Đăng nhập thành công</h4>
                    <p className="text-xs text-accent/70 font-open-sans">2025-10-29 10:30 AM</p>
                </div>
                <i data-feather="chevron-right" className="w-4 h-4 text-primary/50 ml-2" />
                </li>
                <li className="px-4 py-4 md:px-6 flex items-center hover:bg-secondary/30 transition-colors">
                <i data-feather="edit-3" className="w-5 h-5 text-primary mr-3 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-accent font-open-sans truncate">Cập nhật hồ sơ</h4>
                    <p className="text-xs text-accent/70 font-open-sans">2025-10-28 03:15 PM</p>
                </div>
                <i data-feather="chevron-right" className="w-4 h-4 text-primary/50 ml-2" />
                </li>
                <li className="px-4 py-4 md:px-6 flex items-center hover:bg-secondary/30 transition-colors">
                <i data-feather="settings" className="w-5 h-5 text-primary mr-3 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-accent font-open-sans truncate">Thay đổi cài đặt</h4>
                    <p className="text-xs text-accent/70 font-open-sans">2025-10-27 09:45 AM</p>
                </div>
                <i data-feather="chevron-right" className="w-4 h-4 text-primary/50 ml-2" />
                </li>
            </ul>
            </div>
      </main>

      {/* Footer */}
      <footer className="bg-secondary border-t border-primary/20 p-4 md:p-6 transition-all duration-300">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-accent/50 font-open-sans">© 2025 TCGear. Tất cả quyền được bảo lưu.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a
              href="https://facebook.com/tcgear"
              className="text-accent/70 hover:text-primary font-open-sans transition-transform duration-200 hover:scale-110"
            >
              <i data-feather="facebook" className="w-5 h-5" />
            </a>
            <a
              href="https://twitter.com/tcgear"
              className="text-accent/70 hover:text-primary font-open-sans transition-transform duration-200 hover:scale-110"
            >
              <i data-feather="twitter" className="w-5 h-5" />
            </a>
            <a
              href="https://instagram.com/tcgear"
              className="text-accent/70 hover:text-primary font-open-sans transition-transform duration-200 hover:scale-110"
            >
              <i data-feather="instagram" className="w-5 h-5" />
            </a>
            <a
              href="https://youtube.com/tcgear"
              className="text-accent/70 hover:text-primary font-open-sans transition-transform duration-200 hover:scale-110"
            >
              <i data-feather="youtube" className="w-5 h-5" />
            </a>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Profile;