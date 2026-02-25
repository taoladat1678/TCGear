// EditProductModal.tsx
import React, { useState, useEffect } from 'react';
import feather from 'feather-icons';

interface EditProductModalProps {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  product?: any;
}

const EditProductModal: React.FC<EditProductModalProps> = ({ open, onClose, onSave, product }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    subcategory: '',
    size: '',
    price: '',
    stock: '',
    sku: '',
    status: 'Đang Bán',
    description: '',
  });

  useEffect(() => {
    if (open) {
      feather.replace();
    }
  }, [open]);

  useEffect(() => {
    if (open && product) {
      setFormData({
        name: product.name || '',
        category: product.category || '',
        subcategory: product.subcategory || '',
        size: product.size || '',
        price: product.price || '',
        stock: product.stock || '',
        sku: product.sku || '',
        status: product.status === 'Hoạt Động' ? 'Đang Bán' : product.status || 'Đang Bán',
        description: product.description || '',
      });
    } else if (open) {
      setFormData({
        name: '',
        category: '',
        subcategory: '',
        size: '',
        price: '',
        stock: '',
        sku: '',
        status: 'Đang Bán',
        description: '',
      });
    }
  }, [open, product]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (!open) return null;

  return (
    <div id="edit-product-modal" className="fixed inset-0 z-[9999] overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-secondary/90"></div>
        </div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div className="inline-block align-bottom bg-secondary rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full relative">
          <div className="px-6 py-4 border-b border-primary/20 relative">
            <h3 className="text-lg font-semibold text-accent font-orbitron">Chỉnh Sửa Sản Phẩm</h3>
            <button 
              id="close-edit-modal" 
              onClick={onClose} 
              className="absolute top-4 right-4 text-accent hover:text-primary transition-colors p-1 rounded-full hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label="Đóng modal"
            >
              <i data-feather="x" className="w-5 h-5"></i>
            </button>
          </div>
          <div className="px-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-accent/70 mb-2 font-open-sans">Tên Sản Phẩm</label>
                <input
                  type="text"
                  id="edit-name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-primary/20 rounded-md bg-secondary text-accent focus:outline-none focus:ring-2 focus:ring-primary font-open-sans"
                  placeholder="Nhập tên sản phẩm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-accent/70 mb-2 font-open-sans">Danh Mục</label>
                <select 
                  id="edit-category" 
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-primary/20 rounded-md bg-secondary text-accent focus:outline-none focus:ring-2 focus:ring-primary font-open-sans"
                >
                  <option value="">Chọn danh mục</option>
                  <option value="Áo Đấu">Áo Đấu</option>
                  <option value="Tai Nghe">Tai Nghe</option>
                  <option value="Bàn Phím">Bàn Phím</option>
                  <option value="Chuột">Chuột</option>
                  <option value="Phụ Kiện">Phụ Kiện</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-accent/70 mb-2 font-open-sans">Danh Mục Phụ</label>
                <select 
                  id="edit-subcategory" 
                  name="subcategory"
                  value={formData.subcategory}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-primary/20 rounded-md bg-secondary text-accent focus:outline-none focus:ring-2 focus:ring-primary font-open-sans"
                >
                  <option value="">Chọn danh mục phụ</option>
                  <option value="Áo Thi Đấu Chính Thức">Áo Thi Đấu Chính Thức</option>
                  <option value="Áo Fan Edition">Áo Fan Edition</option>
                  <option value="Tai Nghe Không Dây">Tai Nghe Không Dây</option>
                  <option value="Tai Nghe Có Dây">Tai Nghe Có Dây</option>
                  <option value="Bàn Phím Cơ Tenkeyless">Bàn Phím Cơ Tenkeyless</option>
                  <option value="Bàn Phím Full-Size">Bàn Phím Full-Size</option>
                  <option value="Chuột Không Dây">Chuột Không Dây</option>
                  <option value="Chuột Có Dây">Chuột Có Dây</option>
                  <option value="Bàn Di Chuột Kích Thước Lớn">Bàn Di Chuột Kích Thước Lớn</option>
                  <option value="Phụ Kiện Khác">Phụ Kiện Khác</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-accent/70 mb-2 font-open-sans">Kích Thước</label>
                <select 
                  id="edit-size" 
                  name="size"
                  value={formData.size}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-primary/20 rounded-md bg-secondary text-accent focus:outline-none focus:ring-2 focus:ring-primary font-open-sans"
                >
                  <option value="">Chọn kích thước</option>
                  <option value="S">S</option>
                  <option value="M">M</option>
                  <option value="L">L</option>
                  <option value="XL">XL</option>
                  <option value="XXL">XXL</option>
                  <option value="One Size">One Size</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-accent/70 mb-2 font-open-sans">Giá</label>
                <input
                  type="text"
                  id="edit-price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-primary/20 rounded-md bg-secondary text-accent focus:outline-none focus:ring-2 focus:ring-primary font-open-sans"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-accent/70 mb-2 font-open-sans">Số Lượng</label>
                <input
                  type="number"
                  id="edit-stock"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-primary/20 rounded-md bg-secondary text-accent focus:outline-none focus:ring-2 focus:ring-primary font-open-sans"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-accent/70 mb-2 font-open-sans">SKU</label>
                <input
                  type="text"
                  id="edit-sku"
                  name="sku"
                  value={formData.sku}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-primary/20 rounded-md bg-secondary text-accent focus:outline-none focus:ring-2 focus:ring-primary font-open-sans"
                  placeholder="Mã SKU"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-accent/70 mb-2 font-open-sans">Trạng Thái</label>
                <select 
                  id="edit-status" 
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-primary/20 rounded-md bg-secondary text-accent focus:outline-none focus:ring-2 focus:ring-primary font-open-sans"
                >
                  <option value="Đang Bán">Đang Bán</option>
                  <option value="Bản Nháp">Bản Nháp</option>
                  <option value="Lưu Trữ">Lưu Trữ</option>
                  <option value="Hết Hàng">Hết Hàng</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-accent/70 mb-2 font-open-sans">Mô Tả</label>
                <textarea
                  id="edit-description"
                  name="description"
                  rows={3}
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-primary/20 rounded-md bg-secondary text-accent focus:outline-none focus:ring-2 focus:ring-primary font-open-sans"
                  placeholder="Mô tả sản phẩm"
                ></textarea>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-accent/70 mb-2 font-open-sans">Hình Ảnh</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-primary/20 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <div className="flex text-sm text-accent/70 font-open-sans">
                      <label htmlFor="edit-file-upload" className="relative cursor-pointer bg-secondary rounded-md font-medium text-primary hover:text-primary/80 focus-within:outline-none">
                        <span>Tải lên tệp mới (tùy chọn)</span>
                        <input id="edit-file-upload" name="file-upload" type="file" className="sr-only" />
                      </label>
                      <p className="pl-1">hoặc kéo thả</p>
                    </div>
                    <p className="text-xs text-accent/70 font-open-sans">
                      PNG, JPG, GIF tối đa 10MB
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="px-6 py-4 border-t border-primary/20 flex justify-end space-x-3">
            <button id="cancel-edit-modal" onClick={onClose} type="button" className="px-4 py-2 border border-primary/20 rounded-md text-accent hover:bg-secondary/70 font-open-sans">
              Hủy
            </button>
            <button id="save-edit-product" onClick={onSave} type="button" className="px-4 py-2 bg-primary text-accent rounded-md hover:bg-primary/90 font-open-sans">
              Cập Nhật Sản Phẩm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProductModal;