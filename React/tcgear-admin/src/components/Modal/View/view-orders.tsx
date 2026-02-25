// OrderViewModal.tsx
import React from 'react';

interface OrderViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderData?: {
    id: string;
    customer: string;
    date: string;
    products: string;
    total: string;
    status: string;
    paymentStatus: string;
  };
}

const OrderViewModal: React.FC<OrderViewModalProps> = ({ isOpen, onClose, orderData }) => {
  if (!isOpen) return null;

  return (
    <div className="modal" style={{ display: 'block' }}>
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <div className="p-6">
          <h2 className="text-xl font-bold text-accent font-orbitron mb-4">Chi Tiết Đơn Hàng</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><strong>ID Đơn Hàng:</strong> {orderData?.id}</div>
              <div><strong>Khách Hàng:</strong> {orderData?.customer}</div>
              <div><strong>Ngày Đặt:</strong> {orderData?.date}</div>
              <div><strong>Sản Phẩm:</strong> {orderData?.products}</div>
              <div><strong>Tổng Cộng:</strong> {orderData?.total}</div>
              <div><strong>Trạng Thái:</strong> <span className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary">{orderData?.status}</span></div>
              <div><strong>Trạng Thái Thanh Toán:</strong> <span className="px-2 py-1 text-xs rounded-full bg-green-500/20 text-green-500">{orderData?.paymentStatus}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderViewModal;