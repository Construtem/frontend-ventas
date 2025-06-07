'use client'
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export interface Product {
  sku: string;
  nombre: string;
  precio: number;
  cantidad: number;
  imagen?: string;
}

interface CartContextType {
  cart: Product[];
  addToCart: (product: Product) => void;
  updateQuantity: (sku: string, quantity: number) => void;
  removeFromCart: (sku: string) => void;
  clearCart: () => void;
  total: number;

}

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = 'construtem-cart';

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<Product[]>([]);

  // Cargar desde localStorage al iniciar
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setCart(JSON.parse(stored));
    }
  }, []);

  // Guardar en localStorage al cambiar
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const exists = prev.find(p => p.sku === product.sku);
      return exists
          ? prev.map(p =>
              p.sku === product.sku ? { ...p, cantidad: p.cantidad + product.cantidad } : p
          )
          : [...prev, product];
    });
  };

  const removeFromCart = (sku: string) => {
    setCart(prev => prev.filter(p => p.sku !== sku));
  };

  const clearCart = () => {
    setCart([]);
  };

  const updateQuantity = (sku: string, quantity: number) => {
    setCart(prev =>
        quantity < 1
            ? prev.filter(p => p.sku !== sku)
            : prev.map(p => (p.sku === sku ? { ...p, cantidad: quantity } : p))
    );
  };

  const total = cart.reduce((sum, item) => sum + item.precio * item.cantidad, 0);

  return (
      <CartContext.Provider value={{ cart, addToCart, updateQuantity, clearCart, removeFromCart, total }}>
        {children}
      </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart debe usarse dentro de <CartProvider>');
  return context;
};
