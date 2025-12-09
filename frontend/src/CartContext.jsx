import { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  const addToCart = (menuItem) => {
    setItems((prev) => {
      const existing = prev.find((it) => it._id === menuItem._id);
      if (existing) {
        return prev.map((it) =>
          it._id === menuItem._id ? { ...it, quantity: it.quantity + 1 } : it
        );
      }
      return [...prev, { ...menuItem, quantity: 1 }];
    });
  };

  const clearCart = () => setItems([]);

  return (
    <CartContext.Provider value={{ items, addToCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
