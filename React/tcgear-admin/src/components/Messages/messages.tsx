// messages.tsx
import React, { useState, useEffect } from 'react';
import './messages.css';
import ViewMessages from '../Modal/View/view-message';
// Assuming feather-icons script is loaded globally, or import dynamically if needed

interface MessageData {
  id: string;
  name: string;
  email: string;
  phone: string;
  time: string;
  content: string;
  imgSrc: string;
  status: string;
}

const messagesData: MessageData[] = [
  {
    id: 'MSG-001',
    name: 'Nguyễn Văn A',
    email: 'nguyenvana@email.com',
    phone: '+84 912 345 678',
    time: '2 giờ trước',
    content: 'Xin chào, tôi muốn hỏi về thời gian giao hàng cho đơn hàng #ORD-012...',
    imgSrc: 'http://static.photos/people/200x200/7',
    status: 'Mới',
  },
  {
    id: 'MSG-002',
    name: 'Trần Thị B',
    email: 'tranthib@email.com',
    phone: '+84 912 345 678',
    time: '5 giờ trước',
    content: 'Cảm ơn về sự hỗ trợ tuyệt vời! Sản phẩm rất đẹp và chất lượng...',
    imgSrc: 'http://static.photos/people/200x200/8',
    status: 'Đã Đọc',
  },
  {
    id: 'MSG-003',
    name: 'Lê Văn C',
    email: 'levanc@email.com',
    phone: '+84 912 345 678',
    time: '1 ngày trước',
    content: 'Tôi muốn đổi size áo đấu từ M sang L, làm ơn hướng dẫn thủ tục...',
    imgSrc: 'http://static.photos/people/200x200/9',
    status: 'Đã Đọc',
  },
  {
    id: 'MSG-004',
    name: 'Phạm Thị D',
    email: 'phamthid@email.com',
    phone: '+84 912 345 678',
    time: '2 ngày trước',
    content: 'Khi nào có hàng mới về bàn phím cơ TCGear Pro Series?...',
    imgSrc: 'http://static.photos/people/200x200/10',
    status: 'Đã Đọc',
  },
  {
    id: 'MSG-005',
    name: 'Hoàng Văn E',
    email: 'hoangvane@email.com',
    phone: '+84 912 345 678',
    time: '3 ngày trước',
    content: 'Tôi đặt hàng 3 ngày rồi mà chưa thấy xác nhận, làm ơn kiểm tra giúp...',
    imgSrc: 'http://static.photos/people/200x200/11',
    status: 'Đã Đọc',
  },
];

const Messages: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentMessage, setCurrentMessage] = useState<MessageData | null>(null);

  useEffect(() => {
    // Initialize Feather Icons
    if (typeof window !== 'undefined' && (window as any).feather) {
      (window as any).feather.replace();
    }
  }, []);

  const handleViewMessage = (message: MessageData) => {
    setCurrentMessage(message);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentMessage(null);
  };

  const handleSendReply = (reply: string) => {
    if (reply.trim()) {
      // Placeholder for send logic
      alert('Phản hồi đã được gửi!');
      handleCloseModal();
    } else {
      alert('Vui lòng nhập nội dung phản hồi.');
    }
  };

  return (
    <main className="flex-1 overflow-y-auto p-4 max-w-7xl md:p-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 md:mb-8 animate-slideUpFromBottom">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-accent font-orbitron">Quản Lý Tin Nhắn</h1>
          <p className="text-accent/70 font-open-sans mt-1">Xem và trả lời tin nhắn từ khách hàng</p>
        </div>
        <div className="flex space-x-2 mt-4 sm:mt-0">
          <button className="border border-primary text-primary hover:bg-primary/10 font-semibold py-2 px-4 rounded flex items-center font-open-sans transition-all duration-200 hover:scale-105">
            <i data-feather="filter" className="w-5 h-5 mr-2"></i> Lọc
          </button>
        </div>
      </div>

      {/* Messages Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 md:gap-8 md:mb-12 animate-slideUpFromBottom">
        <div className="bg-secondary/50 rounded-lg shadow p-4 md:p-6 border border-primary/20">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-primary/10 transition-transform duration-300 hover:scale-110">
              <i data-feather="inbox" className="w-6 h-6 text-primary"></i>
            </div>
            <div className="ml-4">
              <p className="text-accent/70 font-open-sans">Tổng Tin Nhắn</p>
              <h3 className="text-xl md:text-2xl font-bold text-accent font-orbitron">247</h3>
            </div>
          </div>
        </div>
        <div className="bg-secondary/50 rounded-lg shadow p-4 md:p-6 border border-primary/20">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-primary/10 transition-transform duration-300 hover:scale-110">
              <i data-feather="message-circle" className="w-6 h-6 text-primary"></i>
            </div>
            <div className="ml-4">
              <p className="text-accent/70 font-open-sans">Chưa Đọc</p>
              <h3 className="text-xl md:text-2xl font-bold text-accent font-orbitron">12</h3>
            </div>
          </div>
        </div>
        <div className="bg-secondary/50 rounded-lg shadow p-4 md:p-6 border border-primary/20">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-primary/10 transition-transform duration-300 hover:scale-110">
              <i data-feather="check-circle" className="w-6 h-6 text-primary"></i>
            </div>
            <div className="ml-4">
              <p className="text-accent/70 font-open-sans">Đã Trả Lời</p>
              <h3 className="text-xl md:text-2xl font-bold text-accent font-orbitron">189</h3>
            </div>
          </div>
        </div>
        <div className="bg-secondary/50 rounded-lg shadow p-4 md:p-6 border border-primary/20">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-primary/10 transition-transform duration-300 hover:scale-110">
              <i data-feather="clock" className="w-6 h-6 text-primary"></i>
            </div>
            <div className="ml-4">
              <p className="text-accent/70 font-open-sans">Đang Chờ</p>
              <h3 className="text-xl md:text-2xl font-bold text-accent font-orbitron">46</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Messages List */}
      <div className="bg-secondary/50 rounded-lg shadow overflow-hidden border border-primary/20 animate-slideUpFromBottom">
        <div className="px-4 py-4 md:px-6 border-b border-primary/20 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-accent font-orbitron">Danh Sách Tin Nhắn</h3>
          <div className="flex items-center space-x-2">
            <select className="bg-secondary border border-primary/20 text-accent rounded px-3 py-1 text-sm font-open-sans">
              <option>Tất cả trạng thái</option>
              <option>Chưa đọc</option>
              <option>Đã trả lời</option>
              <option>Đang chờ</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto table-container">
          <table className="min-w-full divide-y divide-primary/20">
            <thead className="bg-secondary/30">
              <tr>
                <th className="px-4 py-3 md:px-6 text-left text-xs font-medium text-accent/70 font-open-sans uppercase tracking-wider">ID</th>
                <th className="px-4 py-3 md:px-6 text-left text-xs font-medium text-accent/70 font-open-sans uppercase tracking-wider">Tên Người Dùng</th>
                <th className="px-4 py-3 md:px-6 text-left text-xs font-medium text-accent/70 font-open-sans uppercase tracking-wider">Email</th>
                <th className="px-4 py-3 md:px-6 text-left text-xs font-medium text-accent/70 font-open-sans uppercase tracking-wider">Thời Gian</th>
                <th className="px-4 py-3 md:px-6 text-left text-xs font-medium text-accent/70 font-open-sans uppercase tracking-wider">Trạng Thái</th>
                <th className="px-4 py-3 md:px-6 text-left text-xs font-medium text-accent/70 font-open-sans uppercase tracking-wider">Hành Động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary/20">
              {messagesData.map((message, index) => (
                <tr key={message.id} className={`animate-in message-item ${message.status === 'Mới' ? 'message-unread' : ''}`}>
                  <td className="px-4 py-4 md:px-6 whitespace-nowrap text-sm font-medium text-accent font-open-sans">{message.id}</td>
                  <td className="px-4 py-4 md:px-6 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img className="h-10 w-10 rounded-full object-cover" src={message.imgSrc} alt="" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-accent font-open-sans">{message.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 md:px-6 whitespace-nowrap text-sm text-accent/80 font-open-sans">{message.email}</td>
                  <td className="px-4 py-4 md:px-6 whitespace-nowrap text-sm text-accent/70 font-open-sans">{message.time}</td>
                  <td className="px-4 py-4 md:px-6 whitespace-nowrap">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full font-open-sans ${message.status === 'Mới' ? 'bg-primary text-accent' : 'bg-accent/20 text-accent/70'}`}>
                      {message.status === 'Mới' ? 'Mới' : 'Đã Đọc'}
                    </span>
                  </td>
                  <td className="px-4 py-4 md:px-6 whitespace-nowrap text-sm font-semibold">
                    <button
                      className="text-primary hover:text-primary/80 mr-2 text-xs font-open-sans flex items-center transition-all duration-200 hover:scale-110"
                      onClick={() => handleViewMessage(message)}
                    >
                      <i data-feather="eye" className="w-4 h-4 mr-1"></i> Xem
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-4 md:px-6 border-t border-primary/20 flex justify-end items-center">
          <div className="flex space-x-2">
            <button className="px-3 py-1 border border-primary/20 text-accent rounded-md font-open-sans hover:bg-primary/10 transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed" disabled>
              <i data-feather="chevron-left" className="w-4 h-4"></i>
            </button>
            <button className="px-3 py-1 bg-primary text-accent rounded-md font-open-sans transition-all duration-200 hover:scale-105">1</button>
            <button className="px-3 py-1 border border-primary/20 text-accent rounded-md font-open-sans hover:bg-primary/10 transition-all duration-200 hover:scale-105">2</button>
            <button className="px-3 py-1 border border-primary/20 text-accent rounded-md font-open-sans hover:bg-primary/10 transition-all duration-200 hover:scale-105">3</button>
            <button className="px-3 py-1 border border-primary/20 text-accent rounded-md font-open-sans hover:bg-primary/10 transition-all duration-200 hover:scale-105">
              <i data-feather="chevron-right" className="w-4 h-4"></i>
            </button>
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="bg-secondary/50 rounded-lg shadow p-4 md:p-6 border border-primary/20 animate-slideUpFromBottom">
        <h3 className="text-lg font-semibold text-accent font-orbitron mb-4">Trạng Thái Hệ Thống</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-primary/10 p-4 rounded-lg animate-in">
            <div className="flex items-center">
              <i data-feather="server" className="w-6 h-6 text-primary transition-transform duration-200 hover:scale-110"></i>
              <span className="ml-2 text-sm font-semibold text-accent font-open-sans">Máy Chủ</span>
            </div>
            <p className="text-xs text-accent/70 mt-2 font-open-sans">Tất cả hệ thống hoạt động bình thường</p>
          </div>
          <div className="bg-primary/10 p-4 rounded-lg animate-in">
            <div className="flex items-center">
              <i data-feather="database" className="w-6 h-6 text-primary transition-transform duration-200 hover:scale-110"></i>
              <span className="ml-2 text-sm font-semibold text-accent font-open-sans">Cơ Sở Dữ Liệu</span>
            </div>
            <p className="text-xs text-accent/70 mt-2 font-open-sans">Thời gian phản hồi: 42ms</p>
          </div>
          <div className="bg-primary/10 p-4 rounded-lg animate-in">
            <div className="flex items-center">
              <i data-feather="hard-drive" className="w-6 h-6 text-primary transition-transform duration-200 hover:scale-110"></i>
              <span className="ml-2 text-sm font-semibold text-accent font-open-sans">Lưu Trữ</span>
            </div>
            <p className="text-xs text-accent/70 mt-2 font-open-sans">78% đã sử dụng - 12.4GB trống</p>
          </div>
        </div>
      </div>

      {currentMessage && (
        <ViewMessages
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          messageData={currentMessage}
          onSendReply={handleSendReply}
        />
      )}
    </main>
  );
};

export default Messages;