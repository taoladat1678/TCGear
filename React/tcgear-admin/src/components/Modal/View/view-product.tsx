// ViewProductModal.tsx
import React, { useEffect } from 'react';
import feather from 'feather-icons';

interface ViewProductModalProps {
  open: boolean;
  onClose: () => void;
  product?: {
    id: string;
    name: string;
    price: string;
    category: string;
    subcategory: string;
    stock: string;
    status: string;
    description: string;
  };
}

const ViewProductModal: React.FC<ViewProductModalProps> = ({ open, onClose, product }) => {
  useEffect(() => {
    if (open) {
      feather.replace();
    }
  }, [open]);

  if (!open) return null;

  return (
    <div id="view-product-modal" className="fixed inset-0 z-[9999] overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-secondary/90"></div>
        </div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div className="inline-block align-bottom bg-secondary rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full relative">
          <div className="px-6 py-4 border-b border-primary/20 relative">
            <h3 className="text-lg font-semibold text-accent font-orbitron">Xem Sản Phẩm</h3>
            <button 
              id="close-view-modal"
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
                <label className="block text-sm font-medium text-accent/70 mb-2 font-open-sans">ID Sản Phẩm</label>
                <input
                  type="text"
                  id="view-id"
                  value={product?.id || ''}
                  className="w-full px-3 py-2 border border-primary/20 rounded-md bg-secondary text-accent focus:outline-none focus:ring-2 focus:ring-primary font-open-sans"
                  readOnly
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-accent/70 mb-2 font-open-sans">Tên Sản Phẩm</label>
                <input
                  type="text"
                  id="view-name"
                  value={product?.name || ''}
                  className="w-full px-3 py-2 border border-primary/20 rounded-md bg-secondary text-accent focus:outline-none focus:ring-2 focus:ring-primary font-open-sans"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-accent/70 mb-2 font-open-sans">Giá</label>
                <input
                  type="text"
                  id="view-price"
                  value={product?.price || ''}
                  className="w-full px-3 py-2 border border-primary/20 rounded-md bg-secondary text-accent focus:outline-none focus:ring-2 focus:ring-primary font-open-sans"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-accent/70 mb-2 font-open-sans">Danh Mục</label>
                <input
                  type="text"
                  id="view-category"
                  value={product?.category || ''}
                  className="w-full px-3 py-2 border border-primary/20 rounded-md bg-secondary text-accent focus:outline-none focus:ring-2 focus:ring-primary font-open-sans"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-accent/70 mb-2 font-open-sans">Danh Mục Phụ</label>
                <input
                  type="text"
                  id="view-subcategory"
                  value={product?.subcategory || ''}
                  className="w-full px-3 py-2 border border-primary/20 rounded-md bg-secondary text-accent focus:outline-none focus:ring-2 focus:ring-primary font-open-sans"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-accent/70 mb-2 font-open-sans">Tồn Kho</label>
                <input
                  type="number"
                  id="view-stock"
                  value={product?.stock || ''}
                  className="w-full px-3 py-2 border border-primary/20 rounded-md bg-secondary text-accent focus:outline-none focus:ring-2 focus:ring-primary font-open-sans"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-accent/70 mb-2 font-open-sans">Trạng Thái</label>
                <input
                  type="text"
                  id="view-status"
                  value={product?.status || ''}
                  className="w-full px-3 py-2 border border-primary/20 rounded-md bg-secondary text-accent focus:outline-none focus:ring-2 focus:ring-primary font-open-sans"
                  readOnly
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-accent/70 mb-2 font-open-sans">Mô Tả Sản Phẩm</label>
                <textarea
                  id="view-description"
                  rows={3}
                  value={product?.description || ''}
                  className="w-full px-3 py-2 border border-primary/20 rounded-md bg-secondary text-accent focus:outline-none focus:ring-2 focus:ring-primary font-open-sans"
                  readOnly
                ></textarea>
              </div>
            </div>
          </div>
          <div className="px-6 py-4 border-t border-primary/20 flex justify-end space-x-3">
            <button id="cancel-view-modal" onClick={onClose} type="button" className="px-4 py-2 border border-primary/20 rounded-md text-accent hover:bg-secondary/70 font-open-sans">
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProductModal;