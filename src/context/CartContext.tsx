'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { useCustomer } from './ClienteContext';

/* ---------- Tipos ---------- */

export interface Product {
  sku: string;
  nombre: string;
  precio: number;
  cantidad: number;      // cantidad que habrá en el carrito
  imagen?: string;
  descuento:number;
}

interface CartContextType {
  cart: Product[];
  addToCart: (product: Product, cantidad?: number) => void; // 👈 nuevo
  updateQuantity: (sku: string, cantidad: number) => void;
  removeFromCart: (sku: string) => void;
  clearCart: () => void;
  total: number;
}

/* ---------- Contexto ---------- */

const CartContext = createContext<CartContextType | undefined>(undefined);

const BASE_KEY = 'construtem-cart';

/* ---------- Provider ---------- */

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<Product[]>([]);
  const { cliente } = useCustomer();

  const storageKey = `${BASE_KEY}-${cliente?.id ?? 'guest'}`;

  /* Cargar carrito almacenado (solo en cliente) */
  useEffect(() => {
    if (typeof window === 'undefined') return; // evita SSR
    const stored = localStorage.getItem(storageKey);
    setCart(stored ? JSON.parse(stored) : []);
  }, [storageKey]);

  /* Guardar automáticamente cada vez que cambia */
  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(storageKey, JSON.stringify(cart));
  }, [cart, storageKey]);

  /* ---------- Acciones ---------- */

  /** Añade un producto (o suma cantidad si ya existe) */
  const addToCart = (product: Product, cantidad: number = 1) => {
    setCart(prev => {
      const idx = prev.findIndex(p => p.sku === product.sku);

      if (idx >= 0) {
        /* Ya estaba en el carrito → aumentar cantidad */
        const updated = [...prev];
        updated[idx] = {
          ...updated[idx],
          cantidad: updated[idx].cantidad + cantidad,
        };
        return updated;
      }

      /* Nuevo producto en el carrito */
      return [...prev, { ...product, cantidad }];
    });
  };

  /** Elimina por SKU */
  const removeFromCart = (sku: string) =>
      setCart(prev => prev.filter(p => p.sku !== sku));

  /** Vacía el carrito */
  const clearCart = () => {
    setCart([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(storageKey);
    }
  };

  /** Cambia la cantidad exacta; si es <1 lo quita */
  const updateQuantity = (sku: string, cantidad: number) =>
      setCart(prev =>
          cantidad < 1
              ? prev.filter(p => p.sku !== sku)
              : prev.map(p =>
                  p.sku === sku ? { ...p, cantidad } : p
              )
      );

  /* ---------- Total ---------- */
  const total = cart.reduce(
      (sum, item) => sum + item.precio * item.cantidad,
      0
  );

  return (
      <CartContext.Provider
          value={{
            cart,
            addToCart,
            updateQuantity,
            removeFromCart,
            clearCart,
            total,
          }}
      >
        {children}
      </CartContext.Provider>
  );
};

/* ---------- Hook ---------- */

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx)
    throw new Error('useCart debe usarse dentro de un <CartProvider>');
  return ctx;
};
