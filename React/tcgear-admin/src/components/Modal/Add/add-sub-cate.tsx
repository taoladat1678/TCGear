// add-sub-cate.tsx
import React, { useState, useRef, useEffect } from 'react';
import feather from 'feather-icons';

interface AddSubCateProps {
  onClose: () => void;
  onSuccess: (newSubCate: { code: string; name: string; parent: string; image?: string }) => void;
}

export const AddSubCate: React.FC<AddSubCateProps> = ({ onClose, onSuccess }) => {
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [parent, setParent] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const parentOptions = ['Áo Đấu Esports', 'Tai Nghe Gaming', 'Bàn Phím Cơ'];

  useEffect(() => {
    // Initialize Feather icons
    feather.replace();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !name.trim() || !parent) {
      alert('Vui lòng nhập đầy đủ thông tin!');
      return;
    }
    // Simulate success - in real app, handle API call
    const newSubCate = { code: code.trim(), name: name.trim(), parent, image: file ? URL.createObjectURL(file) : '' };
    onSuccess(newSubCate);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <div className="modal show" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="text-lg font-semibold text-accent font-orbitron">Thêm Danh Mục Phụ Mới</h3>
          <span className="close" onClick={onClose}>
            <i data-feather="x" className="w-7 h-7"></i>
          </span>
        </div>
        <form onSubmit={handleSubmit} className="modal-body">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-accent/70 mb-2 font-open-sans">Mã Danh Mục Phụ</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full px-3 py-2 border border-primary/20 rounded-md bg-secondary text-accent focus:outline-none focus:ring-2 focus:ring-primary font-open-sans"
                placeholder="Nhập mã danh mục phụ"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-accent/70 mb-2 font-open-sans">Tên Danh Mục Phụ</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-primary/20 rounded-md bg-secondary text-accent focus:outline-none focus:ring-2 focus:ring-primary font-open-sans"
                placeholder="Nhập tên danh mục phụ"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-accent/70 mb-2 font-open-sans">Danh Mục Cha</label>
              <select
                value={parent}
                onChange={(e) => setParent(e.target.value)}
                className="w-full px-3 py-2 border border-primary/20 rounded-md bg-secondary text-accent focus:outline-none focus:ring-2 focus:ring-primary font-open-sans"
                required
              >
                <option value="">Chọn danh mục cha</option>
                {parentOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-accent/70 mb-2 font-open-sans">Hình Ảnh</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-primary/20 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <div className="flex text-sm text-accent/70 font-open-sans">
                    <label
                      htmlFor="add-sub-file-upload"
                      className="relative cursor-pointer bg-secondary rounded-md font-medium text-primary hover:text-primary/80 focus-within:outline-none"
                    >
                      <span>Tải lên tệp</span>
                      <input
                        id="add-sub-file-upload"
                        ref={fileInputRef}
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                    </label>
                    <p className="pl-1">hoặc kéo thả</p>
                  </div>
                  <p className="text-xs text-accent/70 font-open-sans">PNG, JPG, GIF tối đa 10MB</p>
                </div>
              </div>
              {file && <p className="text-xs text-accent/70 font-open-sans mt-2">Đã chọn: {file.name}</p>}
            </div>
          </div>
        </form>
        <div className="modal-footer">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-primary/20 rounded-md text-accent hover:bg-secondary/70 font-open-sans transition-all duration-200 hover:scale-105 flex items-center"
          >
            <i data-feather="x" className="w-4 h-4 mr-2"></i>
            Hủy
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-accent rounded-md hover:bg-primary/90 font-open-sans transition-all duration-200 hover:scale-105 flex items-center ml-2"
          >
            <i data-feather="save" className="w-4 h-4 mr-2"></i>
            Lưu Danh Mục Phụ
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddSubCate;