// src/components/Toast/Toast.tsx
import React, { useEffect } from 'react';
import feather from 'feather-icons';
import './Toast.css';

type ToastType = 'success' | 'wishlist-add' | 'wishlist-remove' | 'error';

interface ToastProps {
  type: ToastType;
  title: string;
  detail: string;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ type, title, detail, onClose }) => {
  useEffect(() => {
    feather.replace();
  }, []);

  // Cấu hình chung: nền đỏ chủ đạo, chỉ thay icon + viền nhẹ cho từng loại
  const config = {
    success: {
      icon: 'check-circle',
      iconColor: 'text-green-400',
    },
    'wishlist-add': {
      icon: 'heart',
      iconColor: 'text-pink-400 fill-pink-400',
    },
    'wishlist-remove': {
      icon: 'heart-off',
      iconColor: 'text-orange-400',
    },
    error: {
      icon: 'alert-circle',
      iconColor: 'text-red-400',
    },
  };

  const { icon, iconColor } = config[type];

  return (
    <div
      className={`
        relative flex items-start gap-4 max-w-sm w-full p-5 rounded-xl
        border-2 border-red-600/60
        bg-gradient-to-br from-red-600/20 via-red-500/10 to-rose-600/20
        backdrop-blur-xl shadow-2xl shadow-red-900/50
        text-white overflow-hidden
        transition-all duration-300 hover:scale-[1.02] hover:shadow-red-800/60
      `}
    >
      {/* Glow viền đỏ (tùy chọn, cực đẹp) */}
      <div className="absolute inset-0 rounded-xl ring-2 ring-red-500/40 -z-10 animate-pulse"></div>

      {/* Icon */}
      <div className={`flex-shrink-0 ${iconColor}`}>
        <i data-feather={icon} className="h-9 w-9"></i>
      </div>

      {/* Nội dung */}
      <div className="flex-1 min-w-0">
        <h4 className="font-orbitron font-bold text-lg leading-tight tracking-wider">
          {title}
        </h4>
        {detail && (
          <p className="text-sm font-open-sans mt-1 opacity-90 break-words">
            {detail}
          </p>
        )}
      </div>

      {/* Nút đóng */}
      <button
        onClick={onClose}
        className="flex-shrink-0 opacity-70 hover:opacity-100 transition group"
        aria-label="Đóng thông báo"
      >
        <i data-feather="x" className="h-6 w-6 group-hover:scale-110 transition"></i>
      </button>
    </div>
  );
};

export default Toast;