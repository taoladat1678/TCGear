// components/MainContent.tsx
import React, { useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import './dashboard.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

interface MainContentProps {}

const MainContent: React.FC<MainContentProps> = () => {
  useEffect(() => {
    // Initialize Feather Icons
    if (typeof window !== 'undefined') {
      const feather = (window as any).feather;
      if (feather) {
        feather.replace();
      }
    }

    // Trigger animations after load
    const timer = setTimeout(() => {
      document.querySelectorAll('.animate-slideUpFromBottom').forEach((el) => {
        el.classList.remove('opacity-0');
      });
      document.querySelectorAll('.table-container tbody tr, .divide-y > div, .grid-cols-3 > div').forEach((el) => {
        el.classList.add('animate-in');
      });
      document.querySelectorAll('nav > a, .sidebar-item').forEach((el) => {
        el.classList.remove('opacity-0');
      });
    }, 200);

    return () => clearTimeout(timer);
  }, []);

  // Sales Chart Data
  const salesData = {
    labels: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
    datasets: [
      {
        label: 'Doanh số ($)',
        data: [3500, 4200, 3800, 5100, 4800, 3200, 2900],
        backgroundColor: '#e11d48',
        borderColor: '#e11d48',
        borderWidth: 1,
      },
    ],
  };

  const salesOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 1500, easing: 'easeOutQuart' as const },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { color: '#ffffff' },
        grid: { color: '#ffffff33' },
      },
      x: {
        ticks: { color: '#ffffff' },
        grid: { color: '#ffffff33' },
      },
    },
    plugins: {
      legend: {
        labels: { color: '#ffffff' },
      },
    },
  };

  // Categories Chart Data
  const categoriesData = {
    labels: ['Áo Đấu', 'Tai Nghe', 'Bàn Phím', 'Chuột', 'Phụ Kiện'],
    datasets: [
      {
        data: [35, 25, 15, 12, 13],
        backgroundColor: ['#e11d48', '#ffffff', '#ff6b6b', '#4b5563', '#9ca3af'],
        borderWidth: 1,
      },
    ],
  };

  const categoriesOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { animateRotate: true, duration: 2000, easing: 'easeOutBounce' as const },
    plugins: {
      legend: {
        labels: { color: '#ffffff' },
      },
    },
  };

  return (
    <>
      <main className="flex-1 overflow-y-auto p-4 max-w-7xl mx-auto md:p-6">
        {/* Dashboard Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 md:gap-8 md:mb-12">
          <div className="bg-secondary/50 rounded-lg shadow p-4 md:p-6 border border-primary/20 animate-slideUpFromBottom">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-primary/10 transition-transform duration-300 hover:scale-110">
                <i data-feather="dollar-sign" className="w-6 h-6 text-primary" />
              </div>
              <div className="ml-4">
                <p className="text-accent/70 font-open-sans">Tổng Doanh Số</p>
                <h3 className="text-xl md:text-2xl font-bold text-accent font-orbitron">$24,569</h3>
              </div>
            </div>
            <p className="text-sm text-accent/70 mt-2 font-open-sans">
              <i data-feather="trending-up" className="w-4 h-4 inline transition-transform duration-200 hover:scale-110" /> 12.5% so với tuần trước
            </p>
          </div>
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
              <i data-feather="trending-up" className="w-4 h-4 inline transition-transform duration-200 hover:scale-110" /> 8.2% so với tuần trước
            </p>
          </div>
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
              <i data-feather="trending-up" className="w-4 h-4 inline transition-transform duration-200 hover:scale-110" /> 5.7% so với tuần trước
            </p>
          </div>
          <div className="bg-secondary/50 rounded-lg shadow p-4 md:p-6 border border-primary/20 animate-slideUpFromBottom">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-primary/10 transition-transform duration-300 hover:scale-110">
                <i data-feather="package" className="w-6 h-6 text-primary" />
              </div>
              <div className="ml-4">
                <p className="text-accent/70 font-open-sans">Tổng Sản Phẩm</p>
                <h3 className="text-xl md:text-2xl font-bold text-accent font-orbitron">187</h3>
              </div>
            </div>
            <p className="text-sm text-accent/70 mt-2 font-open-sans">
              <i data-feather="trending-up" className="w-4 h-4 inline transition-transform duration-200 hover:scale-110" /> 3.1% so với tuần trước
            </p>
          </div>
        </div>

        {/* Charts and Recent Orders */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 md:gap-8 md:mb-12">
          {/* Sales Chart */}
          <div className="lg:col-span-2 bg-secondary/50 rounded-lg shadow p-4 md:p-6 border border-primary/20 animate-slideUpFromBottom">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
              <h3 className="text-lg font-semibold text-accent font-orbitron">Tổng Quan Doanh Số</h3>
              <div className="flex space-x-2 flex-wrap">
                <button className="px-3 py-1 bg-primary/10 text-primary rounded text-sm font-open-sans transition-all duration-200 hover:scale-105">
                  Tuần
                </button>
                <button className="px-3 py-1 text-accent/70 rounded text-sm font-open-sans hover:bg-primary/10 hover:text-primary transition-all duration-200 hover:scale-105">
                  Tháng
                </button>
                <button className="px-3 py-1 text-accent/70 rounded text-sm font-open-sans hover:bg-primary/10 hover:text-primary transition-all duration-200 hover:scale-105">
                  Năm
                </button>
              </div>
            </div>
            <div className="chart-container">
              <Bar data={salesData} options={salesOptions} />
            </div>
          </div>
          {/* Product Categories Chart */}
          <div className="bg-secondary/50 rounded-lg shadow p-4 md:p-6 border border-primary/20 animate-slideUpFromBottom">
            <h3 className="text-lg font-semibold text-accent font-orbitron mb-4">Danh Mục Sản Phẩm</h3>
            <div className="chart-container">
              <Pie data={categoriesData} options={categoriesOptions} />
            </div>
          </div>
        </div>

        {/* Recent Orders and Customer Registrations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 md:gap-8 md:mb-12">
          {/* Recent Orders */}
          <div className="bg-secondary/50 rounded-lg shadow overflow-hidden border border-primary/20 animate-slideUpFromBottom">
            <div className="px-4 py-4 md:px-6 border-b border-primary/20 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-accent font-orbitron">Đơn Hàng Gần Đây</h3>
              <button className="text-primary text-sm flex items-center font-open-sans hover:text-primary/80 transition-all duration-200 hover:scale-110">
                <i data-feather="download" className="w-4 h-4 mr-1" />
                Xuất
              </button>
            </div>
            <div className="overflow-x-auto table-container">
              <table className="min-w-full divide-y divide-primary/20">
                <thead className="bg-secondary/30">
                  <tr>
                    <th className="px-4 py-3 md:px-6 text-left text-xs font-medium text-accent/70 font-open-sans uppercase tracking-wider">
                      ID Đơn Hàng
                    </th>
                    <th className="px-4 py-3 md:px-6 text-left text-xs font-medium text-accent/70 font-open-sans uppercase tracking-wider">
                      Khách Hàng
                    </th>
                    <th className="px-4 py-3 md:px-6 text-left text-xs font-medium text-accent/70 font-open-sans uppercase tracking-wider">
                      Ngày
                    </th>
                    <th className="px-4 py-3 md:px-6 text-left text-xs font-medium text-accent/70 font-open-sans uppercase tracking-wider">
                      Trạng Thái
                    </th>
                    <th className="px-4 py-3 md:px-6 text-left text-xs font-medium text-accent/70 font-open-sans uppercase tracking-wider">
                      Tổng Cộng
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-primary/20">
                  <tr className="animate-in">
                    <td className="px-4 py-4 md:px-6 whitespace-nowrap text-sm text-accent font-open-sans">#ORD-001</td>
                    <td className="px-4 py-4 md:px-6 whitespace-nowrap text-sm text-accent font-open-sans">John Doe</td>
                    <td className="px-4 py-4 md:px-6 whitespace-nowrap text-sm text-accent font-open-sans">2023-10-15</td>
                    <td className="px-4 py-4 md:px-6 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary font-open-sans">Hoàn Thành</span>
                    </td>
                    <td className="px-4 py-4 md:px-6 whitespace-nowrap text-sm text-accent font-open-sans">$249.99</td>
                  </tr>
                  <tr className="animate-in">
                    <td className="px-4 py-4 md:px-6 whitespace-nowrap text-sm text-accent font-open-sans">#ORD-002</td>
                    <td className="px-4 py-4 md:px-6 whitespace-nowrap text-sm text-accent font-open-sans">Jane Smith</td>
                    <td className="px-4 py-4 md:px-6 whitespace-nowrap text-sm text-accent font-open-sans">2023-10-14</td>
                    <td className="px-4 py-4 md:px-6 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs rounded-full bg-yellow-500/20 text-yellow-500 font-open-sans">Đang Xử Lý</span>
                    </td>
                    <td className="px-4 py-4 md:px-6 whitespace-nowrap text-sm text-accent font-open-sans">$189.50</td>
                  </tr>
                  <tr className="animate-in">
                    <td className="px-4 py-4 md:px-6 whitespace-nowrap text-sm text-accent font-open-sans">#ORD-003</td>
                    <td className="px-4 py-4 md:px-6 whitespace-nowrap text-sm text-accent font-open-sans">Robert Johnson</td>
                    <td className="px-4 py-4 md:px-6 whitespace-nowrap text-sm text-accent font-open-sans">2023-10-14</td>
                    <td className="px-4 py-4 md:px-6 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs rounded-full bg-blue-500/20 text-blue-500 font-open-sans">Đã Giao</span>
                    </td>
                    <td className="px-4 py-4 md:px-6 whitespace-nowrap text-sm text-accent font-open-sans">$429.99</td>
                  </tr>
                  <tr className="animate-in">
                    <td className="px-4 py-4 md:px-6 whitespace-nowrap text-sm text-accent font-open-sans">#ORD-004</td>
                    <td className="px-4 py-4 md:px-6 whitespace-nowrap text-sm text-accent font-open-sans">Sarah Williams</td>
                    <td className="px-4 py-4 md:px-6 whitespace-nowrap text-sm text-accent font-open-sans">2023-10-13</td>
                    <td className="px-4 py-4 md:px-6 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary font-open-sans">Hoàn Thành</span>
                    </td>
                    <td className="px-4 py-4 md:px-6 whitespace-nowrap text-sm text-accent font-open-sans">$99.99</td>
                  </tr>
                  <tr className="animate-in">
                    <td className="px-4 py-4 md:px-6 whitespace-nowrap text-sm text-accent font-open-sans">#ORD-005</td>
                    <td className="px-4 py-4 md:px-6 whitespace-nowrap text-sm text-accent font-open-sans">Michael Brown</td>
                    <td className="px-4 py-4 md:px-6 whitespace-nowrap text-sm text-accent font-open-sans">2023-10-12</td>
                    <td className="px-4 py-4 md:px-6 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs rounded-full bg-red-500/20 text-red-500 font-open-sans">Đã Hủy</span>
                    </td>
                    <td className="px-4 py-4 md:px-6 whitespace-nowrap text-sm text-accent font-open-sans">$299.99</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          {/* Latest Customer Registrations */}
          <div className="bg-secondary/50 rounded-lg shadow overflow-hidden border border-primary/20 animate-slideUpFromBottom">
            <div className="px-4 py-4 md:px-6 border-b border-primary/20">
              <h3 className="text-lg font-semibold text-accent font-orbitron">Khách Hàng Mới Nhất</h3>
            </div>
            <div className="divide-y divide-primary/20">
              <div className="px-4 py-4 md:px-6 flex items-center animate-in">
                <img
                  className="h-10 w-10 rounded-full object-cover transition-transform duration-200 hover:scale-110"
                  src="http://static.photos/people/200x200/2"
                  alt="Khách hàng"
                />
                <div className="ml-4">
                  <h4 className="text-sm font-semibold text-accent font-open-sans">Emma Wilson</h4>
                  <p className="text-xs text-accent/70 font-open-sans">Đã tham gia 2 giờ trước</p>
                </div>
              </div>
              <div className="px-4 py-4 md:px-6 flex items-center animate-in">
                <img
                  className="h-10 w-10 rounded-full object-cover transition-transform duration-200 hover:scale-110"
                  src="http://static.photos/people/200x200/3"
                  alt="Khách hàng"
                />
                <div className="ml-4">
                  <h4 className="text-sm font-semibold text-accent font-open-sans">David Miller</h4>
                  <p className="text-xs text-accent/70 font-open-sans">Đã tham gia 5 giờ trước</p>
                </div>
              </div>
              <div className="px-4 py-4 md:px-6 flex items-center animate-in">
                <img
                  className="h-10 w-10 rounded-full object-cover transition-transform duration-200 hover:scale-110"
                  src="http://static.photos/people/200x200/4"
                  alt="Khách hàng"
                />
                <div className="ml-4">
                  <h4 className="text-sm font-semibold text-accent font-open-sans">Sophia Garcia</h4>
                  <p className="text-xs text-accent/70 font-open-sans">Đã tham gia 1 ngày trước</p>
                </div>
              </div>
              <div className="px-4 py-4 md:px-6 flex items-center animate-in">
                <img
                  className="h-10 w-10 rounded-full object-cover transition-transform duration-200 hover:scale-110"
                  src="http://static.photos/people/200x200/5"
                  alt="Khách hàng"
                />
                <div className="ml-4">
                  <h4 className="text-sm font-semibold text-accent font-open-sans">James Taylor</h4>
                  <p className="text-xs text-accent/70 font-open-sans">Đã tham gia 1 ngày trước</p>
                </div>
              </div>
              <div className="px-4 py-4 md:px-6 flex items-center animate-in">
                <img
                  className="h-10 w-10 rounded-full object-cover transition-transform duration-200 hover:scale-110"
                  src="http://static.photos/people/200x200/6"
                  alt="Khách hàng"
                />
                <div className="ml-4">
                  <h4 className="text-sm font-semibold text-accent font-open-sans">Olivia Martinez</h4>
                  <p className="text-xs text-accent/70 font-open-sans">Đã tham gia 2 ngày trước</p>
                </div>
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

      {/* Footer */}
      <footer className="bg-secondary border-t border-primary/20 p-4 md:p-6 transition-all duration-300 animate-slideUpFromBottom">
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

export default MainContent;