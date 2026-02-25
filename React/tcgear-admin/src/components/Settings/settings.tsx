// settings.tsx
import React from 'react';
import './settings.css'; // Import the corresponding CSS

const Settings: React.FC = () => {
  return (
    <>
      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 max-w-7xl md:p-6">
        {/* Page Header */}
        <div className="mb-8 animate-slideUpFromBottom">
          <h1 className="text-2xl md:text-3xl font-bold text-accent font-orbitron">
            Cài Đặt Hệ Thống
          </h1>
          <p className="text-accent/70 mt-2 font-open-sans">
            Quản lý cấu hình và tùy chỉnh hệ thống TCGear
          </p>
        </div>

        {/* Store Information Form */}
        <div className="bg-secondary/50 rounded-lg shadow p-6 border border-primary/20 mb-8 animate-slideUpFromBottom">
          <h3 className="text-lg font-semibold text-accent font-orbitron mb-6">
            Thông Tin Cửa Hàng
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-accent mb-2 font-open-sans">
                Tên Cửa Hàng
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 rounded-md border border-primary/20 bg-secondary text-accent focus:outline-none focus:ring-2 focus:ring-primary font-open-sans"
                defaultValue="TCGear Esports Shop"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-accent mb-2 font-open-sans">
                Email Liên Hệ
              </label>
              <input
                type="email"
                className="w-full px-4 py-2 rounded-md border border-primary/20 bg-secondary text-accent focus:outline-none focus:ring-2 focus:ring-primary font-open-sans"
                defaultValue="contact@tcgear.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-accent mb-2 font-open-sans">
                Số Điện Thoại
              </label>
              <input
                type="tel"
                className="w-full px-4 py-2 rounded-md border border-primary/20 bg-secondary text-accent focus:outline-none focus:ring-2 focus:ring-primary font-open-sans"
                defaultValue="+84 123 456 789"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-accent mb-2 font-open-sans">
                Địa Chỉ
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 rounded-md border border-primary/20 bg-secondary text-accent focus:outline-none focus:ring-2 focus:ring-primary font-open-sans"
                defaultValue="123 Gaming Street, Hanoi"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-accent mb-2 font-open-sans">
              Mô Tả Cửa Hàng
            </label>
            <textarea
              className="w-full px-4 py-2 rounded-md border border-primary/20 bg-secondary text-accent focus:outline-none focus:ring-2 focus:ring-primary font-open-sans"
              rows={4}
              defaultValue="TCGear - Cửa hàng thiết bị chơi game và áo đấu chuyên nghiệp hàng đầu Việt Nam. Chúng tôi cung cấp các sản phẩm chất lượng cao cho cộng đồng esports."
            />
          </div>

          <div className="flex justify-end">
            <button className="px-6 py-2 bg-primary text-accent rounded-md hover:bg-primary/90 transition font-open-sans transition-all duration-200 hover:scale-105">
              Lưu Thay Đổi
            </button>
          </div>
        </div>

        {/* System Preferences */}
        <div className="bg-secondary/50 rounded-lg shadow p-6 border border-primary/20 mb-8 animate-slideUpFromBottom">
          <h3 className="text-lg font-semibold text-accent font-orbitron mb-6">
            Tùy Chọn Hệ Thống
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-accent font-open-sans">
                  Bảo Trì Hệ Thống
                </h4>
                <p className="text-xs text-accent/70 font-open-sans">
                  Tạm ngừng cửa hàng để bảo trì
                </p>
              </div>
              <label className="switch">
                <input type="checkbox" />
                <span className="slider" />
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-accent font-open-sans">
                  Cho Phép Đăng Ký
                </h4>
                <p className="text-xs text-accent/70 font-open-sans">
                  Cho phép người dùng mới đăng ký
                </p>
              </div>
              <label className="switch">
                <input type="checkbox" defaultChecked />
                <span className="slider" />
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-accent font-open-sans">
                  Thông Báo Email
                </h4>
                <p className="text-xs text-accent/70 font-open-sans">
                  Gửi email thông báo đơn hàng
                </p>
              </div>
              <label className="switch">
                <input type="checkbox" defaultChecked />
                <span className="slider" />
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-accent font-open-sans">
                  Đánh Giá Sản Phẩm
                </h4>
                <p className="text-xs text-accent/70 font-open-sans">
                  Cho phép khách hàng đánh giá sản phẩm
                </p>
              </div>
              <label className="switch">
                <input type="checkbox" defaultChecked />
                <span className="slider" />
              </label>
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <button className="px-6 py-2 bg-primary text-accent rounded-md hover:bg-primary/90 transition font-open-sans transition-all duration-200 hover:scale-105">
              Lưu Tùy Chọn
            </button>
          </div>
        </div>

        {/* Interface Settings */}
        <div className="bg-secondary/50 rounded-lg shadow p-6 border border-primary/20 mb-8 animate-slideUpFromBottom">
          <h3 className="text-lg font-semibold text-accent font-orbitron mb-6">
            Giao Diện
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-accent mb-2 font-open-sans">
                Chủ Đề Màu Sắc
              </label>
              <select className="w-full px-4 py-2 rounded-md border border-primary/20 bg-secondary text-accent focus:outline-none focus:ring-2 focus:ring-primary font-open-sans">
                <option value="dark" selected>
                  Chủ Đề Tối
                </option>
                <option value="light">Chủ Đề Sáng</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-accent mb-2 font-open-sans">
                Logo Cửa Hàng
              </label>
              <input
                type="file"
                className="w-full px-4 py-2 rounded-md border border-primary/20 bg-secondary text-accent focus:outline-none focus:ring-2 focus:ring-primary font-open-sans"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-accent mb-2 font-open-sans">
              CSS Tùy Chỉnh
            </label>
            <textarea
              className="w-full px-4 py-2 rounded-md border border-primary/20 bg-secondary text-accent focus:outline-none focus:ring-2 focus:ring-primary font-open-sans"
              rows={6}
              placeholder="Thêm CSS tùy chỉnh cho giao diện..."
            />
          </div>

          <div className="flex justify-end">
            <button className="px-6 py-2 bg-primary text-accent rounded-md hover:bg-primary/90 transition font-open-sans transition-all duration-200 hover:scale-105">
              Cập Nhật Giao Diện
            </button>
          </div>
        </div>

        {/* Payment Settings */}
        <div className="bg-secondary/50 rounded-lg shadow p-6 border border-primary/20 mb-8 animate-slideUpFromBottom">
          <h3 className="text-lg font-semibold text-accent font-orbitron mb-6">
            Thanh Toán
          </h3>

          <div className="space-y-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-accent font-open-sans">
                  VNPay
                </h4>
                <p className="text-xs text-accent/70 font-open-sans">
                  Kích hoạt thanh toán VNPay
                </p>
              </div>
              <label className="switch">
                <input type="checkbox" defaultChecked />
                <span className="slider" />
              </label>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-accent font-open-sans">
                  Momo
                </h4>
                <p className="text-xs text-accent/70 font-open-sans">
                  Kích hoạt thanh toán Momo
                </p>
              </div>
              <label className="switch">
                <input type="checkbox" />
                <span className="slider" />
              </label>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-accent font-open-sans">
                  Thẻ Tín Dụng
                </h4>
                <p className="text-xs text-accent/70 font-open-sans">
                  Kích hoạt thanh toán thẻ
                </p>
              </div>
              <label className="switch">
                <input type="checkbox" defaultChecked />
                <span className="slider" />
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-accent mb-2 font-open-sans">
                Khóa API VNPay
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 rounded-md border border-primary/20 bg-secondary text-accent focus:outline-none focus:ring-2 focus:ring-primary font-open-sans"
                placeholder="Nhập khóa API"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-accent mb-2 font-open-sans">
                Khóa Bí Mật
              </label>
              <input
                type="password"
                className="w-full px-4 py-2 rounded-md border border-primary/20 bg-secondary text-accent focus:outline-none focus:ring-2 focus:ring-primary font-open-sans"
                placeholder="Nhập khóa bí mật"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button className="px-6 py-2 bg-primary text-accent rounded-md hover:bg-primary/90 transition font-open-sans transition-all duration-200 hover:scale-105">
              Cập Nhật Thanh Toán
            </button>
          </div>
        </div>

        {/* Shipping Settings */}
        <div className="bg-secondary/50 rounded-lg shadow p-6 border border-primary/20 mb-8 animate-slideUpFromBottom">
          <h3 className="text-lg font-semibold text-accent font-orbitron mb-6">
            Vận Chuyển
          </h3>

          <div className="space-y-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-accent font-open-sans">
                  Giao Hàng Tiêu Chuẩn
                </h4>
                <p className="text-xs text-accent/70 font-open-sans">
                  Phí 50.000 VND, 3-5 ngày
                </p>
              </div>
              <label className="switch">
                <input type="checkbox" defaultChecked />
                <span className="slider" />
              </label>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-accent font-open-sans">
                  Giao Hàng Nhanh
                </h4>
                <p className="text-xs text-accent/70 font-open-sans">
                  Phí 100.000 VND, 1-2 ngày
                </p>
              </div>
              <label className="switch">
                <input type="checkbox" />
                <span className="slider" />
              </label>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-accent mb-2 font-open-sans">
              API Ghép Hàng
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 rounded-md border border-primary/20 bg-secondary text-accent focus:outline-none focus:ring-2 focus:ring-primary font-open-sans"
              placeholder="Nhập API key cho dịch vụ vận chuyển"
            />
          </div>

          <div className="flex justify-end">
            <button className="px-6 py-2 bg-primary text-accent rounded-md hover:bg-primary/90 transition font-open-sans transition-all duration-200 hover:scale-105">
              Cập Nhật Vận Chuyển
            </button>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-secondary/50 rounded-lg shadow p-6 border border-primary/20 mb-8 animate-slideUpFromBottom">
          <h3 className="text-lg font-semibold text-accent font-orbitron mb-6">
            Bảo Mật
          </h3>

          <div className="space-y-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-accent font-open-sans">
                  Xác Thực Hai Yếu Tố (2FA)
                </h4>
                <p className="text-xs text-accent/70 font-open-sans">
                  Yêu cầu mã xác thực cho đăng nhập
                </p>
              </div>
              <label className="switch">
                <input type="checkbox" defaultChecked />
                <span className="slider" />
              </label>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-accent font-open-sans">
                  Khóa Tài Khoản Sau Lỗi
                </h4>
                <p className="text-xs text-accent/70 font-open-sans">
                  Khóa sau 5 lần đăng nhập sai
                </p>
              </div>
              <label className="switch">
                <input type="checkbox" />
                <span className="slider" />
              </label>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-accent font-open-sans">
                  SSL/HTTPS
                </h4>
                <p className="text-xs text-accent/70 font-open-sans">
                  Bắt buộc sử dụng HTTPS
                </p>
              </div>
              <label className="switch">
                <input type="checkbox" defaultChecked />
                <span className="slider" />
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-accent mb-2 font-open-sans">
                Độ Dài Mật Khẩu Tối Thiểu
              </label>
              <input
                type="number"
                className="w-full px-4 py-2 rounded-md border border-primary/20 bg-secondary text-accent focus:outline-none focus:ring-2 focus:ring-primary font-open-sans"
                defaultValue={8}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-accent mb-2 font-open-sans">
                Thời Gian Hết Hạn Mật Khẩu (ngày)
              </label>
              <input
                type="number"
                className="w-full px-4 py-2 rounded-md border border-primary/20 bg-secondary text-accent focus:outline-none focus:ring-2 focus:ring-primary font-open-sans"
                defaultValue={90}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button className="px-6 py-2 bg-primary text-accent rounded-md hover:bg-primary/90 transition font-open-sans transition-all duration-200 hover:scale-105">
              Cập Nhật Bảo Mật
            </button>
          </div>
        </div>

        {/* API Settings */}
        <div className="bg-secondary/50 rounded-lg shadow p-6 border border-primary/20 mb-8 animate-slideUpFromBottom">
          <h3 className="text-lg font-semibold text-accent font-orbitron mb-6">
            API
          </h3>

          <div className="space-y-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-accent font-open-sans">
                  API Khách Hàng
                </h4>
                <p className="text-xs text-accent/70 font-open-sans">
                  Kích hoạt tích hợp API bên thứ ba
                </p>
              </div>
              <label className="switch">
                <input type="checkbox" defaultChecked />
                <span className="slider" />
              </label>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-accent font-open-sans">
                  Giới Hạn Tỷ Lệ
                </h4>
                <p className="text-xs text-accent/70 font-open-sans">
                  100 yêu cầu/phút
                </p>
              </div>
              <label className="switch">
                <input type="checkbox" />
                <span className="slider" />
              </label>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-accent mb-2 font-open-sans">
              Khóa API Chính
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 rounded-md border border-primary/20 bg-secondary text-accent focus:outline-none focus:ring-2 focus:ring-primary font-open-sans"
              defaultValue="sk-abc123def456ghi789"
              readOnly
            />
            <button className="mt-2 px-3 py-1 bg-primary/50 text-accent rounded text-xs font-open-sans">
              Tạo Mới
            </button>
          </div>

          <div className="flex justify-end">
            <button className="px-6 py-2 bg-primary text-accent rounded-md hover:bg-primary/90 transition font-open-sans transition-all duration-200 hover:scale-105">
              Cập Nhật API
            </button>
          </div>
        </div>

        {/* Currency and Language Settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 animate-slideUpFromBottom">
          <div className="bg-secondary/50 rounded-lg shadow p-6 border border-primary/20">
            <h3 className="text-lg font-semibold text-accent font-orbitron mb-6">
              Tiền Tệ
            </h3>

            <div className="mb-6">
              <label className="block text-sm font-medium text-accent mb-2 font-open-sans">
                Đơn Vị Tiền Tệ
              </label>
              <select className="w-full px-4 py-2 rounded-md border border-primary/20 bg-secondary text-accent focus:outline-none focus:ring-2 focus:ring-primary font-open-sans">
                <option value="VND" selected>
                  VND - Vietnamese Dong
                </option>
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
              </select>
            </div>

            <div className="flex justify-end">
              <button className="px-6 py-2 bg-primary text-accent rounded-md hover:bg-primary/90 transition font-open-sans transition-all duration-200 hover:scale-105">
                Cập Nhật
              </button>
            </div>
          </div>

          <div className="bg-secondary/50 rounded-lg shadow p-6 border border-primary/20">
            <h3 className="text-lg font-semibold text-accent font-orbitron mb-6">
              Ngôn Ngữ
            </h3>

            <div className="mb-6">
              <label className="block text-sm font-medium text-accent mb-2 font-open-sans">
                Ngôn Ngữ Mặc Định
              </label>
              <select className="w-full px-4 py-2 rounded-md border border-primary/20 bg-secondary text-accent focus:outline-none focus:ring-2 focus:ring-primary font-open-sans">
                <option value="vi" selected>
                  Tiếng Việt
                </option>
                <option value="en">English</option>
              </select>
            </div>

            <div className="flex justify-end">
              <button className="px-6 py-2 bg-primary text-accent rounded-md hover:bg-primary/90 transition font-open-sans transition-all duration-200 hover:scale-105">
                Cập Nhật
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-secondary border-t border-primary/20 p-4 md:p-6 transition-all duration-300 animate-slideUpFromBottom">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-accent/50 font-open-sans">
            © 2025 TCGear. Tất cả quyền được bảo lưu.
          </p>
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

export default Settings;