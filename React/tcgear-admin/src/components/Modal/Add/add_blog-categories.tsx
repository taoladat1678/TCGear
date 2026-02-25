// add_blog-categories.tsx
import React, { useState, useEffect } from 'react';
import feather from 'feather-icons';
// import './blog-categories.css';

interface AddBlogCategoryProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { code: string; name: string; file?: File }) => void;
}

const AddBlogCategory: React.FC<AddBlogCategoryProps> = ({ isOpen, onClose, onSave }) => {
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (isOpen) {
      // Reset form
      setCode('');
      setName('');
      setFile(null);
    }
    feather.replace();
  }, [isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !name.trim()) {
      alert('Vui lòng nhập đầy đủ mã và tên danh mục!');
      return;
    }
    onSave({ code: code.trim(), name: name.trim(), file });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-[50] flex items-center justify-center p-4">
      <div className="bg-secondary rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto relative">
        <div className="flex justify-between items-center p-6 border-b border-primary/20">
          <h3 className="text-lg font-semibold text-accent font-orbitron">Thêm Danh Mục Blog Mới</h3>
          <button
            type="button"
            className="text-accent/70 hover:text-accent text-2xl leading-none"
            onClick={onClose}
          >
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-accent/70 mb-2 font-open-sans">Mã Danh Mục</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full px-3 py-2 border border-primary/20 rounded-md bg-secondary text-accent focus:outline-none focus:ring-2 focus:ring-primary font-open-sans"
                placeholder="Nhập mã danh mục"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-accent/70 mb-2 font-open-sans">Tên Danh Mục</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-primary/20 rounded-md bg-secondary text-accent focus:outline-none focus:ring-2 focus:ring-primary font-open-sans"
                placeholder="Nhập tên danh mục"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-accent/70 mb-2 font-open-sans">Hình Ảnh</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-primary/20 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <div className="flex text-sm text-accent/70 font-open-sans">
                    <label htmlFor="add-blog-category-file-upload" className="relative cursor-pointer bg-secondary rounded-md font-medium text-primary hover:text-primary/80 focus-within:outline-none">
                      <span>Tải lên tệp</span>
                      <input
                        id="add-blog-category-file-upload"
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
            </div>
          </div>
        </form>
        <div className="flex justify-end space-x-2 p-6 border-t border-primary/20 bg-secondary/50 rounded-b-lg">
          <button
            type="button"
            className="px-4 py-2 border border-primary/20 rounded-md text-accent hover:bg-primary/10 font-open-sans transition-all duration-200"
            onClick={onClose}
          >
            Hủy
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-accent rounded-md hover:bg-primary/90 font-open-sans transition-all duration-200"
          >
            Lưu Danh Mục
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddBlogCategory;