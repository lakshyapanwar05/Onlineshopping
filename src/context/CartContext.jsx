import { createContext, useContext, useState, useCallback } from 'react';
import { cartAPI, ordersAPI } from '../services/api';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const addToCart = useCallback((product, selectedSize, selectedColor, quantity = 1) => {
    setItems(prev => {
      const key = `${product.id}-${selectedSize}-${selectedColor}`;
      const existing = prev.find(i => i.key === key);
      if (existing) {
        return prev.map(i => i.key === key ? { ...i, quantity: i.quantity + quantity } : i);
      }
      return [...prev, { ...product, key, selectedSize, selectedColor, quantity }];
    });
    setIsOpen(true);
  }, []);

  const removeFromCart = useCallback((key) => {
    setItems(prev => prev.filter(i => i.key !== key));
  }, []);

  const updateQuantity = useCallback((key, delta) => {
    setItems(prev =>
      prev.map(i => i.key === key
        ? { ...i, quantity: Math.max(1, i.quantity + delta) }
        : i
      )
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const checkout = useCallback(async (paymentMethod = 'Credit Card') => {
    try {
      if (items.length === 0) throw new Error("Cart is empty");

      // Sync local cart to backend cart table
      for (const item of items) {
        // Handle differences in id naming if any
        const productId = item.id || item.product_id;
        try {
          await cartAPI.add(productId, item.quantity);
        } catch (e) {
          // If it fails (e.g. duplicate or out of stock), handle gracefully or throw
          console.warn('Failed to add item to remote cart:', e);
        }
      }

      // Place the order via the backend transaction
      const res = await ordersAPI.place(paymentMethod);

      // Clear local cart
      setItems([]);
      setIsOpen(false);
      return res; // { success: true, ... }
    } catch (err) {
      console.error('Checkout error:', err);
      if (err.status === 401 || err.message.includes('token')) {
        throw new Error('Please log in to checkout.');
      }
      throw new Error(err.message || 'Checkout failed.');
    }
  }, [items]);

  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const cartTotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{
      items, isOpen, setIsOpen,
      addToCart, removeFromCart, updateQuantity, clearCart, checkout,
      cartCount, cartTotal,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
