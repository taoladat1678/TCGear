// edit-cate.tsx
import React, { useEffect } from 'react';

interface Category {
  code: string;
  name: string;
  image: string;
  productsCount: number;
  status: 'active' | 'inactive';
  description: string;
}

interface EditCateProps {
  category: Category;
  onClose: () => void;
  onSave: (updated: Partial<Category>) => void;
}

const EditCate: React.FC<EditCateProps> = ({ category, onClose, onSave }) => {
  const [code, setCode] = React.useState(category.code);
  const [name, setName] = React.useState(category.name);
  const [parent, setParent] = React.useState(''); // Assuming no parent for main categories
  const [file, setFile] = React.useState<File | null>(null);
  const [isSub] = React.useState(false); // Set based on category type

  useEffect(() => {
    // Initialize Feather icons in modal
    if (typeof window !== 'undefined' && (window as any).feather) {
      (window as any).feather.replace();
    }
  }, []);

  const parents = ['Áo Đấu Esports', 'Tai Nghe Gaming', 'Bàn Phím Cơ']; // Example parents

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSave = () => {
    const updated = { code: code.trim(), name: name.trim() };
    if (isSub && !parent) {
      alert('Vui lòng chọn danh mục cha!');
      return;
    }
    if (isSub) updated['parent'] = parent;
    if (file) updated['image'] = file;
    onSave(updated);
  };

  return (
    <div className="modal show" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="text-lg font-semibold text-accent font-orbitron">Sửa Danh Mục</h3>
          <span className="close" onClick={onClose}>&times;</span>
        </div>
        <div className="modal-body">
          {category.image && (
            <div id="current-image-container">
              <label className="block text-sm font-medium text-accent/70 mb-2 font-open-sans">Hình ảnh hiện tại</label>
              <img src={category.image} className="w-full h-32 object-cover rounded mb-4" alt="Hình ảnh hiện tại" />
            </div>
          )}
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
            {isSub && (
              <div id="parent-row" className="md:col-span-2">
                <label className="block text-sm font-medium text-accent/70 mb-2 font-open-sans">Danh Mục Cha</label>
                <select
                  value={parent}
                  onChange={(e) => setParent(e.target.value)}
                  className="w-full px-3 py-2 border border-primary/20 rounded-md bg-secondary text-accent focus:outline-none focus:ring-2 focus:ring-primary font-open-sans"
                >
                  <option value="">Chọn danh mục cha</option>
                  {parents.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-accent/70 mb-2 font-open-sans">Hình Ảnh Mới (tùy chọn)</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-primary/20 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <div className="flex text-sm text-accent/70 font-open-sans">
                    <label htmlFor="edit-file-upload" className="relative cursor-pointer bg-secondary rounded-md font-medium text-primary hover:text-primary/80 focus-within:outline-none">
                      <span>Tải lên tệp</span>
                      <input
                        id="edit-file-upload"
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
            Lưu Thay Đổi
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditCate;