// add-cate.tsx
import React, { useEffect } from 'react';

interface AddCateProps {
  onClose: () => void;
  onSave: (newCategory: { code: string; name: string; image?: File }) => void;
}

const AddCate: React.FC<AddCateProps> = ({ onClose, onSave }) => {
  const [code, setCode] = React.useState('');
  const [name, setName] = React.useState('');
  const [file, setFile] = React.useState<File | null>(null);

  useEffect(() => {
    // Initialize Feather icons in modal
    if (typeof window !== 'undefined' && (window as any).feather) {
      (window as any).feather.replace();
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSave = () => {
    if (!code.trim() || !name.trim()) {
      alert('Vui lòng nhập đầy đủ mã và tên danh mục!');
      return;
    }
    onSave({ code: code.trim(), name: name.trim(), image: file || undefined });
  };

  return (
    <div className="modal show" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="text-lg font-semibold text-accent font-orbitron">Thêm Danh Mục Mới</h3>
          <span className="close" onClick={onClose}>&times;</span>
        </div>
        <div className="modal-body">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-accent/70 mb-2 font-open-sans">Mã Danh Mục</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full px-3 py-2 border border-primary/20 rounded-md bg-secondary text-accent focus:outline-none focus:ring-2 focus:ring-primary font-open-sans"
                placeholder="Nhập mã danh mục"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-accent/70 mb-2 font-open-sans">Tên Danh Mục</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-primary/20 rounded-md bg-secondary text-accent focus:outline-none focus:ring-2 focus:ring-primary font-open-sans"
                placeholder="Nhập tên danh mục"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-accent/70 mb-2 font-open-sans">Hình Ảnh</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-primary/20 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <div className="flex text-sm text-accent/70 font-open-sans">
                    <label htmlFor="add-category-file-upload" className="relative cursor-pointer bg-secondary rounded-md font-medium text-primary hover:text-primary/80 focus-within:outline-none">
                      <span>Tải lên tệp</span>
                      <input
                        id="add-category-file-upload"
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
        </div>
        <div className="modal-footer">
          <button onClick={onClose} type="button" className="px-4 py-2 border border-primary/20 rounded-md text-accent hover:bg-secondary/70 font-open-sans">
            Hủy
          </button>
          <button onClick={handleSave} type="button" className="px-4 py-2 bg-primary text-accent rounded-md hover:bg-primary/90 font-open-sans">
            Lưu Danh Mục
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCate;