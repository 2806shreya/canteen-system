// src/CartContext.jsx

import React, { createContext, useContext, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  const addToCart = (item) => {
    setItems((prev) => {
      const existing = prev.find((p) => p._id === item._id);
      if (existing) {
        return prev.map((p) =>
          p._id === item._id
            ? { ...p, quantity: (p.quantity || 1) + 1 }
            : p
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setItems((prev) => prev.filter((p) => p._id !== id));
  };

  const clearCart = () => setItems([]);

  const value = { items, addToCart, removeFromCart, clearCart };

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
