// src/context/ToastContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import Toast from '../components/Toast/Toast';

type ToastType = 'success' | 'wishlist-add' | 'wishlist-remove' | 'error';

interface ToastMessage {
  id: number;
  type: ToastType;
  title: string;
  detail: string;
}

interface ToastContextType {
  success: (title: string, detail?: string) => void;
  wishlistAdd: (title: string, detail?: string) => void;     // mới
  wishlistRemove: (title: string, detail?: string) => void; // mới
  error: (title: string, detail?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

let toastId = 0;

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: ToastType, title: string, detail: string = '') => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, type, title, detail }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const success = (title: string, detail = '') => addToast('success', title, detail);
  const wishlistAdd = (title: string, detail = '') => addToast('wishlist-add', title, detail);
  const wishlistRemove = (title: string, detail = '') => addToast('wishlist-remove', title, detail);
  const error = (title: string, detail = '') => addToast('error', title, detail);

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ success, wishlistAdd, wishlistRemove, error }}>
      {children}

      <div
        id="toast-container"
        className="fixed inset-0 pointer-events-none z-[9999] flex flex-col items-center justify-start pt-20 gap-4"
      >
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto animate-slide-down">
            <Toast
              type={toast.type}
              title={toast.title}
              detail={toast.detail}
              onClose={() => removeToast(toast.id)}
            />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
};