// view-blog.tsx
import React from 'react';
import feather from 'feather-icons';  // Thêm import Feather Icons

type ViewBlogPost = {
  id: string;
  title: string;
  author: string;
  date: string;
  views: number;
  status: 'published' | 'draft' | 'scheduled';
  content: string;
  thumbnail?: string;
};

interface ViewBlogProps {
  isOpen: boolean;
  post: ViewBlogPost;
  onClose: () => void;
}

const ViewBlog: React.FC<ViewBlogProps> = ({ isOpen, post, onClose }) => {
  // Thêm useEffect để khởi tạo Feather Icons khi modal mở
  React.useEffect(() => {
    if (isOpen) {
      // Replace tất cả feather icons khi modal mở
      feather.replace({
        'stroke-width': 2,
        width: 24,
        height: 24,
        color: '#ffffff'  // Màu trắng để match với .modal-close
      });
    }
    // Cleanup khi modal đóng (tùy chọn)
    return () => {
      // Có thể reset nếu cần, nhưng không bắt buộc
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleString('vi-VN');

  const getStatusText = (status: ViewBlogPost['status']) => {
    switch (status) {
      case 'published': return 'Đã xuất bản';
      case 'draft': return 'Bản nháp';
      case 'scheduled': return 'Đã lên lịch';
      default: return '';
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-secondary/90" onClick={onClose}></div>
        </div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div className="inline-block align-bottom bg-secondary rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full relative z-[10000]">
          <div className="px-6 py-4 border-b border-primary/20 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-accent font-orbitron">Chi Tiết Bài Viết</h3>
            <button onClick={onClose} className="modal-close">
              <i data-feather="x" aria-hidden="true"></i>
            </button>
          </div>
          <div className="px-6 py-4">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-accent/70 mb-2 font-open-sans">Tiêu Đề</label>
                  <input
                    type="text"
                    value={post.title}
                    readOnly
                    className="w-full px-3 py-2 border border-primary/20 rounded-md bg-secondary text-accent focus:outline-none focus:ring-2 focus:ring-primary font-open-sans"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-accent/70 mb-2 font-open-sans">Tác Giả</label>
                  <input
                    type="text"
                    value={post.author}
                    readOnly
                    className="w-full px-3 py-2 border border-primary/20 rounded-md bg-secondary text-accent focus:outline-none focus:ring-2 focus:ring-primary font-open-sans"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-accent/70 mb-2 font-open-sans">Ngày Xuất Bản</label>
                  <input
                    type="text"
                    value={formatDate(post.date)}
                    readOnly
                    className="w-full px-3 py-2 border border-primary/20 rounded-md bg-secondary text-accent focus:outline-none focus:ring-2 focus:ring-primary font-open-sans"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-accent/70 mb-2 font-open-sans">Trạng Thái</label>
                  <input
                    type="text"
                    value={getStatusText(post.status)}
                    readOnly
                    className="w-full px-3 py-2 border border-primary/20 rounded-md bg-secondary text-accent focus:outline-none focus:ring-2 focus:ring-primary font-open-sans"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-accent/70 mb-2 font-open-sans">Nội Dung</label>
                  <textarea
                    value={post.content}
                    rows={10}
                    readOnly
                    className="w-full px-3 py-2 border border-primary/20 rounded-md bg-secondary text-accent focus:outline-none focus:ring-2 focus:ring-primary font-open-sans"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-accent/70 mb-2 font-open-sans">Ảnh Thumbnail</label>
                  <input
                    type="url"
                    value={post.thumbnail || ''}
                    readOnly
                    className="w-full px-3 py-2 border border-primary/20 rounded-md bg-secondary text-accent focus:outline-none focus:ring-2 focus:ring-primary font-open-sans"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-accent/70 mb-2 font-open-sans">ID</label>
                  <input
                    type="text"
                    value={post.id}
                    readOnly
                    className="w-full px-3 py-2 border border-primary/20 rounded-md bg-secondary text-accent focus:outline-none focus:ring-2 focus:ring-primary font-open-sans"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-accent/70 mb-2 font-open-sans">Lượt Xem</label>
                  <input
                    type="number"
                    value={post.views}
                    readOnly
                    className="w-full px-3 py-2 border border-primary/20 rounded-md bg-secondary text-accent focus:outline-none focus:ring-2 focus:ring-primary font-open-sans"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="px-6 py-4 border-t border-primary/20 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-primary/20 rounded-md text-accent hover:bg-secondary/70 font-open-sans transition-all duration-200 hover:scale-105"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewBlog;