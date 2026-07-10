import React, { createContext, useContext, useState, useEffect } from 'react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number | string;
  description?: string;
  cate_id: string;
  color?: string;
  colorId?: string;
  size?: string;
  sizeId?: string;
  needsContact?: boolean;
}

interface AddToCartProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  cate_id: string;
  color?: string;
  colorId?: string;
  size?: string;
  sizeId?: string;
  description?: string;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: AddToCartProduct, quantity?: number) => void;
  updateQuantity: (key: string, quantity: number | string) => void;
  removeItem: (key: string) => void;
  clearCart: () => void;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const loadCartFromStorage = (): CartItem[] => {
  try {
    const saved = localStorage.getItem('cartItems');
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('Lỗi parse cart:', error);
    localStorage.removeItem('cartItems');
    return [];
  }
};

const getItemKey = (item: CartItem): string => {
  return `${item.id}|${item.colorId || ''}|${item.sizeId || ''}`;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(loadCartFromStorage);

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product: AddToCartProduct, quantity: number = 1) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex((item) => {
        return (
          item.id === product.id &&
          item.colorId === (product.colorId || undefined) &&
          item.sizeId === (product.sizeId || undefined)
        );
      });

      if (existingIndex !== -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        };
        return updated;
      }

      return [
        ...prev,
        {
          ...product,
          quantity,
          description: product.description || `Sản phẩm ${product.name.toLowerCase()}`,
          color: product.color || undefined,
          colorId: product.colorId || undefined,
          size: product.size || undefined,
          sizeId: product.sizeId || undefined,
          needsContact: false,
        },
      ];
    });
  };

  const updateQuantity = (key: string, quantity: number | string) => {
    const qty = Number(quantity);
    if (quantity !== '' && qty < 1) {
      setCartItems((prev) => prev.filter((item) => getItemKey(item) !== key));
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        getItemKey(item) === key ? { ...item, quantity } : item
      )
    );
  };

  const removeItem = (key: string) => {
    setCartItems((prev) => prev.filter((item) => getItemKey(item) !== key));
  };

  const clearCart = () => setCartItems([]);

  const cartCount = cartItems.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};