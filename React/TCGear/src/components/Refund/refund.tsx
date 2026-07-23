import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
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

const Refund: React.FC = () => {
  const { t } = useTranslation();
  const { error } = useToast();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const type = queryParams.get('type') || 'returned';

  const [activeTab, setActiveTab] = useState<'pending' | 'completed'>('pending');
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    feather.replace();
  }, [orders, activeTab]);

  useEffect(() => {
    fetchRefunds(activeTab);
  }, [activeTab, type]);

  const fetchRefunds = async (tab: 'pending' | 'completed') => {
    setIsLoading(true);
    try {
      const userStr = localStorage.getItem('user');
      const currentUser = userStr ? JSON.parse(userStr) : null;
      if (!currentUser || !currentUser.user_id) {
        setIsLoading(false);
        return;
      }

      const res = await fetch(`http://localhost:3000/api/refund/${tab}/${currentUser.user_id}?type=${type}`);
      const data = await res.json();

      if (data.status === 'success') {
        setOrders(data.data || []);
      } else {
        error?.('Lỗi', data.message || 'Không thể lấy dữ liệu hoàn trả');
      }
    } catch (err) {
      console.error('Error fetching refunds:', err);
      error?.('Lỗi', 'Lỗi kết nối máy chủ');
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('vi-VN');
  };

  return (
    <div className="bg-secondary text-accent min-h-screen font-open-sans">
      {/* Header Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-black">
        <div className="max-w-7xl mx-auto text-center" data-aos="fade-up">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 font-orbitron uppercase">
            {type === 'canceled' ? t("ĐƠN HÀNG ĐÃ HỦY") : t("QUẢN LÝ HOÀN TRẢ")}
          </h1>
          <p className="text-accent/70 max-w-2xl mx-auto">
            {t("Theo dõi trạng thái hoàn trả tiền cho các đơn hàng đã hủy hoặc hoàn trả.")}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Tabs */}
          <div className="flex justify-center gap-4 mb-10 border-b border-primary/20 pb-4" data-aos="fade-up">
            <button
              onClick={() => setActiveTab('pending')}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 flex items-center gap-2 ${activeTab === 'pending'
                ? 'bg-orange-500/20 text-orange-500 border border-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.3)]'
                : 'bg-transparent text-accent/60 hover:text-accent border border-transparent'
                }`}
            >
              <i data-feather="clock" className="w-5 h-5"></i>
              {t("Chưa Hoàn Trả")}
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 flex items-center gap-2 ${activeTab === 'completed'
                ? 'bg-green-500/20 text-green-500 border border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.3)]'
                : 'bg-transparent text-accent/60 hover:text-accent border border-transparent'
                }`}
            >
              <i data-feather="check-circle" className="w-5 h-5"></i>
              {t("Đã Hoàn Trả")}
            </button>
          </div>

          {/* Loading state */}
          {isLoading ? (
            <div key="loading" className="text-center py-16" data-aos="fade-in">
              <i data-feather="loader" className="w-10 h-10 animate-spin mx-auto text-primary mb-4"></i>
              <p className="text-accent/70 font-semibold">{t("Đang tải dữ liệu...")}</p>
            </div>
          ) : orders.length === 0 ? (
            <div key="empty" className="text-center py-16 bg-[#111111] rounded-2xl border border-primary/10 shadow-lg" data-aos="fade-in">
              <i data-feather="inbox" className="w-16 h-16 mx-auto text-primary/50 mb-4"></i>
              <h3 className="text-xl font-bold mb-2 font-orbitron">{t("Không có dữ liệu")}</h3>
              <p className="text-accent/60">{t("Không tìm thấy đơn hàng nào trong mục này.")}</p>
            </div>
          ) : (
            <div key="list" className="space-y-6">
              {orders.map((order, index) => (
                <div
                  key={order.order_id}
                  className="bg-[#111111] border border-primary/20 rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.5)] transition-transform hover:-translate-y-1 duration-300"
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 border-b border-primary/10 pb-4">
                    <div>
                      <h3 className="text-xl font-bold font-orbitron text-white">
                        {t("Đơn hàng")} #{order.order_id}
                      </h3>
                      <p className="text-sm text-accent/60 mt-1 flex items-center gap-2">
                        <i data-feather="calendar" className="w-4 h-4"></i>
                        {order.order_time} - {formatDate(order.order_date)}
                      </p>
                    </div>
                    <div>
                      {activeTab === 'pending' ? (
                        <span key="badge-pending" className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500 text-orange-500 font-semibold text-sm shadow-[0_0_10px_rgba(249,115,22,0.2)]">
                          <i data-feather="clock" className="w-4 h-4"></i>
                          {t("CHỜ HOÀN TRẢ")}
                        </span>
                      ) : (
                        <span key="badge-completed" className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-500/10 border border-green-500 text-green-500 font-semibold text-sm shadow-[0_0_10px_rgba(34,197,94,0.2)]">
                          <i data-feather="check-circle" className="w-4 h-4"></i>
                          {t("ĐÃ HOÀN TRẢ")}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="flex items-center gap-4 bg-black/40 p-4 rounded-xl border border-primary/5">
                      <div className="p-3 bg-primary/10 rounded-lg text-primary">
                        <i data-feather="dollar-sign" className="w-6 h-6"></i>
                      </div>
                      <div>
                        <p className="text-xs text-accent/60 uppercase tracking-wider mb-1">{t("Tổng tiền hoàn")}</p>
                        <p className="text-lg font-bold text-white">{formatCurrency(order.total_amount)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 bg-black/40 p-4 rounded-xl border border-primary/5">
                      <div className="p-3 bg-primary/10 rounded-lg text-primary">
                        <i data-feather="credit-card" className="w-6 h-6"></i>
                      </div>
                      <div>
                        <p className="text-xs text-accent/60 uppercase tracking-wider mb-1">{t("Phương thức")}</p>
                        <p className="text-base font-semibold text-white">{order.payment_method}</p>
                      </div>
                    </div>
                  </div>

                  <div className={`p-4 rounded-xl border flex items-start gap-3 ${activeTab === 'pending'
                    ? 'bg-orange-500/5 border-orange-500/20 text-orange-400'
                    : 'bg-green-500/5 border-green-500/20 text-green-400'
                    }`}>
                    <i data-feather="info" className="w-5 h-5 flex-shrink-0 mt-0.5"></i>
                    <p className="text-sm font-medium">
                      {activeTab === 'pending'
                        ? t("Bạn sẽ được hoàn trả lại tiền hàng trong vòng 24-48 giờ. Xin vui lòng chờ.")
                        : t("Cảm ơn bạn đã trải nghiệm dịch vụ của TCGEAR.")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Refund;
