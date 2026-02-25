// comments.tsx
import React, { useEffect, useState } from 'react';
import feather from 'feather-icons';
import ViewComment from '../Modal/View/view-comment'; // Import the ViewComment modal component
import './comments.css';

interface Comment {
  id: string;
  userName: string;
  userImg: string;
  content: string;
  time: string;
  status: 'pending' | 'approved' | 'spam';
  postTitle: string;
  product: string;
}

const commentsData: Comment[] = [
  {
    id: 'COM-001',
    userName: 'Nguyễn Văn A',
    userImg: 'http://static.photos/people/200x200/7',
    content: 'Sản phẩm tuyệt vời, rất mượt mà và bền bỉ...',
    time: '2 giờ trước',
    status: 'pending',
    postTitle: 'Review Chuột Gaming XYZ',
    product: 'Chuột Gaming XYZ',
  },
  {
    id: 'COM-002',
    userName: 'Trần Thị B',
    userImg: 'http://static.photos/people/200x200/8',
    content: 'Bài viết rất chi tiết, giúp tôi tiết kiệm...',
    time: '5 giờ trước',
    status: 'approved',
    postTitle: 'Hướng Dẫn Xây Dựng PC Gaming',
    product: 'Bộ PC Gaming',
  },
  {
    id: 'COM-003',
    userName: 'Lê Văn C',
    userImg: 'http://static.photos/people/200x200/9',
    content: 'Danh sách hay, nhưng thiếu bàn phím TCGear...',
    time: '1 ngày trước',
    status: 'approved',
    postTitle: 'Top 10 Bàn Phím Cơ 2025',
    product: 'Bàn Phím Cơ TCGear Pro',
  },
  {
    id: 'COM-004',
    userName: 'Phạm Thị D',
    userImg: 'http://static.photos/people/200x200/10',
    content: 'Cập nhật nhanh chóng, theo dõi TCGear...',
    time: '2 ngày trước',
    status: 'approved',
    postTitle: 'Tin Tức Esports Tháng 10',
    product: 'Sự Kiện Esports',
  },
  {
    id: 'COM-005',
    userName: 'Hoàng Văn E',
    userImg: 'http://static.photos/people/200x200/11',
    content: 'Click here to win free prizes! [link spam]',
    time: '3 ngày trước',
    status: 'spam',
    postTitle: 'Hướng Dẫn Chơi Game Online',
    product: 'Game Online',
  },
];

const Comments: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null);

  useEffect(() => {
    // Initialize Feather icons
    if (typeof window !== 'undefined') {
      feather.replace();
    }
  }, []);

  const getStatusBadge = (status: Comment['status']) => {
    const statusMap = {
      pending: { class: 'bg-primary text-accent', label: 'Chờ Phê Duyệt' },
      approved: { class: 'bg-accent/20 text-accent/70', label: 'Đã Phê Duyệt' },
      spam: { class: 'bg-accent/20 text-accent/70', label: 'Spam' },
    };
    const { class: badgeClass, label } = statusMap[status];
    return <span className={`${badgeClass} text-xs font-semibold px-2 py-1 rounded-full font-open-sans`}>{label}</span>;
  };

  const openModal = (comment: Comment) => {
    setSelectedComment(comment);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedComment(null);
  };

  const handleApprove = () => {
    alert('Bình luận đã được phê duyệt!'); // Placeholder for actual approve logic
    closeModal();
  };

  const handleReject = () => {
    alert('Bình luận đã bị từ chối!'); // Placeholder for actual reject logic
    closeModal();
  };

  const handleDelete = () => {
    if (confirm('Bạn có chắc chắn muốn xóa bình luận này?')) {
      alert('Bình luận đã bị xóa!'); // Placeholder for actual delete logic
      closeModal();
    }
  };

  return (
    <main className="flex-1 overflow-y-auto p-4 max-w-7xl md:p-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 md:mb-8 animate-slideUpFromBottom">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-accent font-orbitron">Quản Lý Bình Luận</h1>
          <p className="text-accent/70 font-open-sans mt-1">Xem và quản lý bình luận từ người dùng</p>
        </div>
        <div className="flex space-x-2 mt-4 sm:mt-0">
          <button className="border border-primary text-primary hover:bg-primary/10 font-semibold py-2 px-4 rounded flex items-center font-open-sans transition-all duration-200 hover:scale-105">
            <i data-feather="filter" className="w-5 h-5 mr-2" />
            Lọc
          </button>
        </div>
      </div>

      {/* Comments Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 md:gap-8 md:mb-12 animate-slideUpFromBottom">
        <div className="bg-secondary/50 rounded-lg shadow p-4 md:p-6 border border-primary/20">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-primary/10 transition-transform duration-300 hover:scale-110">
              <i data-feather="inbox" className="w-6 h-6 text-primary" />
            </div>
            <div className="ml-4">
              <p className="text-accent/70 font-open-sans">Tổng Bình Luận</p>
              <h3 className="text-xl md:text-2xl font-bold text-accent font-orbitron">1247</h3>
            </div>
          </div>
        </div>
        <div className="bg-secondary/50 rounded-lg shadow p-4 md:p-6 border border-primary/20">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-primary/10 transition-transform duration-300 hover:scale-110">
              <i data-feather="message-circle" className="w-6 h-6 text-primary" />
            </div>
            <div className="ml-4">
              <p className="text-accent/70 font-open-sans">Chờ Phê Duyệt</p>
              <h3 className="text-xl md:text-2xl font-bold text-accent font-orbitron">23</h3>
            </div>
          </div>
        </div>
        <div className="bg-secondary/50 rounded-lg shadow p-4 md:p-6 border border-primary/20">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-primary/10 transition-transform duration-300 hover:scale-110">
              <i data-feather="check-circle" className="w-6 h-6 text-primary" />
            </div>
            <div className="ml-4">
              <p className="text-accent/70 font-open-sans">Đã Phê Duyệt</p>
              <h3 className="text-xl md:text-2xl font-bold text-accent font-orbitron">1189</h3>
            </div>
          </div>
        </div>
        <div className="bg-secondary/50 rounded-lg shadow p-4 md:p-6 border border-primary/20">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-primary/10 transition-transform duration-300 hover:scale-110">
              <i data-feather="clock" className="w-6 h-6 text-primary" />
            </div>
            <div className="ml-4">
              <p className="text-accent/70 font-open-sans">Spam</p>
              <h3 className="text-xl md:text-2xl font-bold text-accent font-orbitron">35</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Comments List */}
      <div className="bg-secondary/50 rounded-lg shadow overflow-hidden border border-primary/20 animate-slideUpFromBottom">
        <div className="px-4 py-4 md:px-6 border-b border-primary/20 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-accent font-orbitron">Danh Sách Bình Luận</h3>
          <div className="flex items-center space-x-2">
            <select className="bg-secondary border border-primary/20 text-accent rounded px-3 py-1 text-sm font-open-sans">
              <option>Tất cả trạng thái</option>
              <option>Chờ phê duyệt</option>
              <option>Đã phê duyệt</option>
              <option>Spam</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto table-container">
          <table className="min-w-full divide-y divide-primary/20">
            <thead className="bg-secondary/30">
              <tr>
                <th className="px-4 py-3 md:px-6 text-left text-xs font-medium text-accent/70 font-open-sans uppercase tracking-wider">ID</th>
                <th className="px-4 py-3 md:px-6 text-left text-xs font-medium text-accent/70 font-open-sans uppercase tracking-wider">Tên Người Dùng</th>
                <th className="px-4 py-3 md:px-6 text-left text-xs font-medium text-accent/70 font-open-sans uppercase tracking-wider">Nội Dung Bình Luận</th>
                <th className="px-4 py-3 md:px-6 text-left text-xs font-medium text-accent/70 font-open-sans uppercase tracking-wider">Thời Gian</th>
                <th className="px-4 py-3 md:px-6 text-left text-xs font-medium text-accent/70 font-open-sans uppercase tracking-wider">Trạng Thái</th>
                <th className="px-4 py-3 md:px-6 text-left text-xs font-medium text-accent/70 font-open-sans uppercase tracking-wider">Hành Động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary/20">
              {commentsData.map((comment, index) => (
                <tr key={comment.id} className={`animate-in ${comment.status === 'pending' ? 'comment-pending' : ''} comment-item`}>
                  <td className="px-4 py-4 md:px-6 whitespace-nowrap text-sm font-medium text-accent font-open-sans">{comment.id}</td>
                  <td className="px-4 py-4 md:px-6 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img className="h-10 w-10 rounded-full object-cover" src={comment.userImg} alt="" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-accent font-open-sans">{comment.userName}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 md:px-6 whitespace-nowrap text-sm text-accent/80 font-open-sans">{comment.content}</td>
                  <td className="px-4 py-4 md:px-6 whitespace-nowrap text-sm text-accent/70 font-open-sans">{comment.time}</td>
                  <td className="px-4 py-4 md:px-6 whitespace-nowrap">{getStatusBadge(comment.status)}</td>
                  <td className="px-4 py-4 md:px-6 whitespace-nowrap text-sm font-semibold">
                    <button
                      className="text-primary hover:text-primary/80 mr-2 text-xs font-open-sans flex items-center transition-all duration-200 hover:scale-110"
                      onClick={() => openModal(comment)}
                    >
                      <i data-feather="eye" className="w-4 h-4 mr-1" />
                      Xem
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
              <i data-feather="chevron-left" className="w-4 h-4" />
            </button>
            <button className="px-3 py-1 bg-primary text-accent rounded-md font-open-sans transition-all duration-200 hover:scale-105">1</button>
            <button className="px-3 py-1 border border-primary/20 text-accent rounded-md font-open-sans hover:bg-primary/10 transition-all duration-200 hover:scale-105">2</button>
            <button className="px-3 py-1 border border-primary/20 text-accent rounded-md font-open-sans hover:bg-primary/10 transition-all duration-200 hover:scale-105">3</button>
            <button className="px-3 py-1 border border-primary/20 text-accent rounded-md font-open-sans hover:bg-primary/10 transition-all duration-200 hover:scale-105">
              <i data-feather="chevron-right" className="w-4 h-4" />
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

      {/* Modal */}
      {showModal && selectedComment && (
        <ViewComment
          comment={selectedComment}
          onClose={closeModal}
          onApprove={handleApprove}
          onReject={handleReject}
          onDelete={handleDelete}
        />
      )}
    </main>
  );
};

export default Comments;