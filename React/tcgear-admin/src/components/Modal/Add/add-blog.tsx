// add-blog.tsx
import React from 'react';
import feather from 'feather-icons';  // Thêm import Feather Icons

type AddBlogFormData = {
  title: string;
  author: string;
  date: string;
  status: 'published' | 'draft' | 'scheduled';
  content: string;
  thumbnail?: string;
};

interface AddBlogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (post: AddBlogFormData) => void;
}

const AddBlog: React.FC<AddBlogProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = React.useState<AddBlogFormData>({
    title: '',
    author: '',
    date: '',
    status: '' as AddBlogFormData['status'],
    content: '',
    thumbnail: ''
  });

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.author || !formData.date || !formData.status || !formData.content) {
      alert('Vui lòng điền đầy đủ thông tin!');
      return;
    }
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-secondary/90" onClick={onClose}></div>
        </div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div className="inline-block align-bottom bg-secondary rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full relative z-[10000]">
          <div className="px-6 py-4 border-b border-primary/20 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-accent font-orbitron">Thêm Bài Viết Mới</h3>
            <button onClick={onClose} className="modal-close">
              <i data-feather="x" aria-hidden="true"></i>
            </button>
          </div>
          <div className="px-6 py-4">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-accent/70 mb-2 font-open-sans">Tiêu Đề <span className="text-primary">*</span></label>
                  <input
                    type="text"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-primary/20 rounded-md bg-secondary text-accent focus:outline-none focus:ring-2 focus:ring-primary font-open-sans"
                    placeholder="Nhập tiêu đề bài viết"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-accent/70 mb-2 font-open-sans">Tác Giả <span className="text-primary">*</span></label>
                  <input
                    type="text"
                    name="author"
                    required
                    value={formData.author}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-primary/20 rounded-md bg-secondary text-accent focus:outline-none focus:ring-2 focus:ring-primary font-open-sans"
                    placeholder="Nhập tên tác giả"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-accent/70 mb-2 font-open-sans">Ngày Xuất Bản <span className="text-primary">*</span></label>
                  <input
                    type="datetime-local"
                    name="date"
                    required
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-primary/20 rounded-md bg-secondary text-accent focus:outline-none focus:ring-2 focus:ring-primary font-open-sans"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-accent/70 mb-2 font-open-sans">Trạng Thái <span className="text-primary">*</span></label>
                  <select
                    name="status"
                    required
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-primary/20 rounded-md bg-secondary text-accent focus:outline-none focus:ring-2 focus:ring-primary font-open-sans"
                  >
                    <option value="">Chọn trạng thái</option>
                    <option value="published">Đã xuất bản</option>
                    <option value="draft">Bản nháp</option>
                    <option value="scheduled">Đã lên lịch</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-accent/70 mb-2 font-open-sans">Nội Dung <span className="text-primary">*</span></label>
                  <textarea
                    name="content"
                    required
                    rows={10}
                    value={formData.content}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-primary/20 rounded-md bg-secondary text-accent focus:outline-none focus:ring-2 focus:ring-primary font-open-sans"
                    placeholder="Nhập nội dung bài viết"
                  ></textarea>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-accent/70 mb-2 font-open-sans">Ảnh Thumbnail (Tùy chọn)</label>
                  <input
                    type="url"
                    name="thumbnail"
                    value={formData.thumbnail}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-primary/20 rounded-md bg-secondary text-accent focus:outline-none focus:ring-2 focus:ring-primary font-open-sans"
                    placeholder="URL ảnh thumbnail"
                  />
                </div>
              </div>
            </form>
          </div>
          <div className="px-6 py-4 border-t border-primary/20 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-primary/20 rounded-md text-accent hover:bg-secondary/70 font-open-sans transition-all duration-200 hover:scale-105"
            >
              Hủy
            </button>
            <button
              type="button"
              className="px-4 py-2 bg-primary text-accent rounded-md hover:bg-primary/90 font-open-sans transition-all duration-200 hover:scale-105"
              onClick={handleSubmit}
            >
              Thêm Bài Viết
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddBlog;