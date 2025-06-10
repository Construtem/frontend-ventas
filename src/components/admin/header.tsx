'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import logo from '@/styles/images/contrutem.png';
import {FaShoppingCart} from "react-icons/fa";
import { useCart } from '@/context/CartContext';
import { useLogin } from '@/context/LoginContext';
import productoImg from '@/styles/images/producto.png';

import Link from "next/link";

interface HeaderProps {
  onToggleSidebar?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const { usuario, logout } = useLogin();
  const { cart, total, clearCart } = useCart();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const itemCount = cart.reduce((acc, item) => acc + item.cantidad, 0);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!dropdownRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
      <header className="fixed top-0 left-0 w-full h-[58px] bg-[#2D2D2D] text-white flex items-center justify-between px-8 shadow-md z-50">
        <div className="flex items-center h-full">
          {onToggleSidebar && (
              <button onClick={onToggleSidebar} className={'cursor-pointer'}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={24}
                    height={24}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#FF7300"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                  <path d="M6 21a3 3 0 0 1 -3 -3v-12a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v12a3 3 0 0 1 -3 3zm12 -16h-8v14h8a1 1 0 0 0 1 -1v-12a1 1 0 0 0 -1 -1" />
                </svg>
              </button>
          )}
          <div className="flex items-center w-[140px] ml-4">
          <Image src={logo} alt="ConstrUTEM Logo" className="max-h-20 pl-4 object-contain" />
          </div>
        </div>

        <div className="flex items-center gap-6 relative">
          {usuario && (
              <span className="flex items-center gap-3 px-4">
            <span className="bg-white text-gray-800 rounded-full p-1 text-base flex items-center justify-center">👤</span>
            <span className="flex flex-col leading-tight font-montserrat text-orange-500 text-xl font-semibold">
              <span className="text-base">{usuario.rol}</span>
              <span className="text-sm text-orange-300">{usuario.email}</span>
            </span>
          </span>
          )}

          {/* Carrito */}
          <div className="relative mr-4">
            <div className="relative mr-4">
              <FaShoppingCart
                  size={24}
                  className="text-white cursor-pointer hover:text-orange-400 transition"
                  onClick={() => setOpen(!open)}
              />
              {itemCount > 0 && (
                  <span
                      className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] px-1.5 py-0.5 rounded-full">
      {itemCount}
    </span>
              )}
            </div>

            {open && (
                <div
                    ref={dropdownRef}
                    className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50"
                >
                  <p className="font-semibold text-black mb-3">
                    Tus productos ({itemCount})
                  </p>
                  <div className="max-h-56 overflow-y-auto">
                    {cart.length === 0 ? (
                        <p className="text-sm text-gray-600">El carrito está vacío.</p>
                    ) : (
                        cart.map((item) => (
                            <div
                                key={item.sku}
                                className="flex justify-between items-center text-sm border-b border-gray-100 pb-2 mb-2 gap-2"
                            >
                              <Image
                                  src={productoImg}
                                  alt={item.nombre}
                                  width={50}
                                  height={50}
                                  className="rounded-md"
                              />
                              <p className="font-medium truncate flex-1 text-black">{item.nombre}</p>
                              <p className="text-black">x{item.cantidad}</p>
                              <p className="font-semibold text-right text-black">
                                ${(item.precio * item.cantidad).toLocaleString()}
                              </p>
                            </div>
                        ))
                    )}
                  </div>

                  {cart.length > 0 && (
                      <>
                        <div className="flex justify-between font-semibold mt-3 mb-2 text-black">
                          <span>Total:</span>
                          <span>${total.toLocaleString()}</span>
                        </div>
                        <Link
                            href="/vendedor/carrito"
                            className="block text-center w-full py-2 bg-white text-blue-600 border border-blue-600 rounded-md mb-2 hover:bg-blue-50"
                        >
                          Ir al carrito
                        </Link>
                        <Link href={"/"} className="block text-center w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cusor-pointer">
                          Continuar con el pago
                        </Link>
                        <button
                             className="w-full mb-2 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 mt-2 cursor-pointer"
                             onClick={() => clearCart()}>
                              Vaciar carrito
                            </button>
                      </>
                  )}
                </div>
            )}
          </div>

          {/* Logout */}
          <button onClick={logout} title="Cerrar sesión" className="text-orange-500 hover:text-orange-600">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width={32}
                height={32}
                viewBox="0 0 24 24"
                fill="none"
                stroke="#FF7300"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
            >
              <path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" />
              <path d="M9 12h12l-3 -3" />
              <path d="M18 15l3 -3" />
            </svg>
          </button>
        </div>
      </header>
  );
};

export default Header;
