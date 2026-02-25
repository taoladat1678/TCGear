// OrderEditModal.tsx
import React, { useState } from 'react';

interface OrderEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (status: string, paymentStatus: string) => void;
  currentOrderId?: string;
  initialStatus?: string;
  initialPaymentStatus?: string;
}

const OrderEditModal: React.FC<OrderEditModalProps> = ({
  isOpen,
  onClose,
  onSave,
  currentOrderId,
  initialStatus = 'completed',
  initialPaymentStatus = 'paid'
}) => {
  const [status, setStatus] = useState(initialStatus);
  const [paymentStatus, setPaymentStatus] = useState(initialPaymentStatus);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(status, paymentStatus);
    onClose();
  };

  return (
    <div className="modal" style={{ display: 'block' }}>
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <div className="p-6">
          <h2 className="text-xl font-bold text-accent font-orbitron mb-4">Chỉnh Sửa Đơn Hàng</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-accent/70 font-open-sans mb-2">Trạng Thái Đơn Hàng</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 border border-primary/20 bg-secondary text-accent rounded-md focus:outline-none focus:ring-2 focus:ring-primary font-open-sans"
              >
                <option value="pending">Chờ Xử Lý</option>
                <option value="processing">Đang Xử Lý</option>
                <option value="shipped">Đã Giao</option>
                <option value="completed">Hoàn Thành</option>
                <option value="cancelled">Đã Hủy</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-accent/70 font-open-sans mb-2">Trạng Thái Thanh Toán</label>
              <select
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value)}
                className="w-full px-3 py-2 border border-primary/20 bg-secondary text-accent rounded-md focus:outline-none focus:ring-2 focus:ring-primary font-open-sans"
              >
                <option value="pending">Chờ Thanh Toán</option>
                <option value="paid">Đã Thanh Toán</option>
                <option value="unpaid">Chưa Thanh Toán</option>
              </select>
            </div>
            <div className="flex justify-end space-x-2">
              <button onClick={onClose} className="px-4 py-2 border border-primary/20 text-accent rounded-md font-open-sans hover:bg-primary/10">
                Hủy
              </button>
              <button onClick={handleSave} className="px-4 py-2 bg-primary text-accent rounded-md font-open-sans hover:bg-primary/90">
                Lưu Thay Đổi
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderEditModal;