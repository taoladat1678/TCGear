// src/context/WishlistContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Interface mở rộng để hỗ trợ color, size, cate_id,...
export interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image: string;
  description?: string;
  cate_id?: string;
  color?: string;
  colorId?: string;
  colorCode?: string;
  size?: string;
  sizeId?: string;
}

interface WishlistContextType {
  wishlist: WishlistItem[];
  addToWishlist: (product: WishlistItem) => void;
  removeFromWishlist: (id: string) => void;
  updateWishlistItem: (id: string, updatedData: Partial<WishlistItem>) => void;
  isInWishlist: (id: string) => boolean;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [wishlist, setWishlist] = useState<WishlistItem[]>(() => {
    try {
      const saved = localStorage.getItem('wishlistItems');
      if (saved) {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) ? parsed : [];
      }
    } catch (err) {
      console.error('Lỗi parse wishlist từ localStorage:', err);
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem('wishlistItems', JSON.stringify(wishlist));
    } catch (err) {
      console.error('Lỗi lưu wishlist vào localStorage:', err);
    }
  }, [wishlist]);

  const addToWishlist = (product: WishlistItem) => {
    setWishlist((prev) => {
      if (prev.some((item) => item.id === product.id)) {
        return prev;
      }
      return [...prev, product];
    });
  };

  const removeFromWishlist = (id: string) => {
    setWishlist((prev) => prev.filter((item) => item.id !== id));
  };

  const updateWishlistItem = (id: string, updatedData: Partial<WishlistItem>) => {
    setWishlist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updatedData } : item))
    );
  };

  const isInWishlist = (id: string) => {
    return wishlist.some((item) => item.id === id);
  };

  const clearWishlist = () => {
    setWishlist([]);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        updateWishlistItem,
        isInWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within WishlistProvider');
  }
  return context;
};