'use client'
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

/**
 * CustomerContext – Mantiene el cliente seleccionado en la sesión del vendedor.
 * Persistencia temporal en sessionStorage para no perder la selección al refrescar.
 */
export interface ClienteSeleccionado {
  id: string;
  nombre: string;
  rut: string;
  email: string;
  telefono: string;
  direccion: string;
}

interface CustomerContextValue {
  cliente: ClienteSeleccionado | null;
  setCliente: (c: ClienteSeleccionado) => void;
  clearCliente: () => void;
}

const CustomerContext = createContext<CustomerContextValue | null>(null);

export const CustomerProvider = ({ children }: { children: ReactNode }) => {
  const [cliente, setClienteState] = useState<ClienteSeleccionado | null>(null);

  // Cargar desde sessionStorage al iniciar
  useEffect(() => {
    const raw = sessionStorage.getItem('clienteSeleccionado');
    if (raw) setClienteState(JSON.parse(raw));
  }, []);

  // Persistir en sessionStorage cuando cambie
  useEffect(() => {
    if (cliente) sessionStorage.setItem('clienteSeleccionado', JSON.stringify(cliente));
    else sessionStorage.removeItem('clienteSeleccionado');
  }, [cliente]);

  const setCliente = (c: ClienteSeleccionado) => setClienteState(c);
  const clearCliente = () => setClienteState(null);

  return (
      <CustomerContext.Provider value={{ cliente, setCliente, clearCliente }}>
        {children}
      </CustomerContext.Provider>
  );
};

export const useCustomer = () => {
  const ctx = useContext(CustomerContext);
  if (!ctx) throw new Error('useCustomer must be used within <CustomerProvider>');
  return ctx;
};

// -----------------------------------------------
// Ejemplo de uso:
// const { setCliente, cliente, clearCliente } = useCustomer();
// setCliente({ id: 'cli‑123', nombre: 'Empresa X', rut: '12.345.678‑9', email: '', telefono: '', direccion: '' });
// -----------------------------------------------
