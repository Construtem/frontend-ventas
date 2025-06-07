'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import logo from '@/styles/images/contrutem_png.png';
import cartIc from '@/styles/images/cart.png';
import notImage from '@/styles/images/notImage.png';
import { useCart } from '@/context/CartContext';
import { useLogin } from '@/context/LoginContext';

interface HeaderProps {
  onToggleSidebar?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const { usuario, logout } = useLogin();
  const { cart, total } = useCart();
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
      <header style={styles.header}>
        <div style={styles.left}>
          {onToggleSidebar && (
              <button onClick={onToggleSidebar}>
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
                  <path d="M6 21a3 3 0 0 1 -3 -3v-12a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v12a3 3 0 0 1 -3 3zm12 -16h-8v14h8a1 1 0 0 0 1 -1v-12a1 1 0 0 0 -1 -1"/>
                </svg>
              </button>
          )}
          <Image src={logo} alt="ConstrUTEM Logo" style={styles.logoImg} />
        </div>

        <div style={styles.right}>
          {usuario && (
              <span style={styles.userInfo}>
            <span style={styles.userIcon}>👤</span>
            <span style={styles.userText}>
              <span style={styles.userName}>{usuario.rol}</span>
              <span style={styles.userEmail}>{usuario.email}</span>
            </span>
          </span>
          )}

          {/* Carrito */}
          <div style={{ position: 'relative', marginRight: '1rem' }}>
            <Image
                src={cartIc}
                alt="Carrito"
                width={28}
                height={28}
                style={{ cursor: 'pointer' }}
                onClick={() => setOpen(!open)}
            />
            {itemCount > 0 && <span style={styles.badge}>{itemCount}</span>}

            {open && (
                <div ref={dropdownRef} style={styles.dropdown}>
                  <p style={styles.dropTitle}>Tus productos ({itemCount})</p>

                  <div style={styles.dropItemsWrapper}>
                    {cart.length === 0 ? (
                        <p style={{ color: '#666', fontSize: '0.85rem' }}>
                          El carrito está vacío.
                        </p>
                    ) : (
                        cart.map(item => (
                            <div key={item.sku} style={styles.dropItem}>
                              <Image
                                  src={notImage}
                                  alt={item.nombre}
                                  width={50}
                                  height={50}
                                  style={{ borderRadius: 8 }}
                              />
                              <p style={styles.itemName}>{item.nombre}</p>
                              <p style={styles.itemQty}>x{item.cantidad}</p>
                              <p style={styles.itemSubtotal}>
                                ${(item.precio * item.cantidad).toLocaleString()}
                              </p>
                            </div>
                        ))
                    )}
                  </div>

                  {cart.length > 0 && (
                      <>
                        <div style={styles.dropTotalRow}>
                          <span>Total:</span>
                          <span>${total.toLocaleString()}</span>
                        </div>
                        <button style={styles.btnToCart}>Ir al carrito</button>
                        <button style={styles.btnCheckout}>Continuar con el pago</button>
                      </>
                  )}
                </div>
            )}
          </div>

          {/* Logout */}
          <button onClick={logout} style={styles.logout} title="Cerrar sesión">
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
const styles: { [key: string]: React.CSSProperties } = {
  header: {
    width: '100%',
    height: '58px',
    background: '#2D2D2D',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 2rem',
    boxSizing: 'border-box',
    position: 'fixed',
    top: 0,
    left: 0,
    zIndex: 100,
    boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
  },
  left: {
    display: 'flex',
    alignItems: 'center',
    height: '100%',
  },
  logoImg: {
    height: 'auto',
    paddingLeft: '1rem',
    maxHeight: '80px',
    objectFit: 'contain',
    width: 'auto',
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.25rem 1rem',
  },
  userIcon: {
    background: 'white',
    color: '#1f2937',
    borderRadius: '50%',
    padding: '0.25rem',
    fontSize: '1.1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userText: {
    display: 'flex',
    flexDirection: 'column',
    lineHeight: '1.4',
    fontFamily: 'Montserrat, sans-serif',
    fontSize: '2.4rem',
    fontWeight: 'semibold' as any, // evitar error: no todos los valores son válidos para fontWeight
    color: '#FF7300',
  },
  userName: {
    fontSize: '1rem',
  },
  userEmail: {
    fontSize: '0.85rem',
  },
  logout: {
    fontSize: '1.5rem',
    cursor: 'pointer',
    userSelect: 'none',
  },

  // Carrito añadido
  badge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#e63946',
    color: '#fff',
    borderRadius: '50%',
    fontSize: '0.65rem',
    padding: '2px 6px',
    lineHeight: 1,
  },
  dropdown: {
    position: 'absolute',
    right: 0,
    marginTop: '0.5rem',
    width: 320,
    background: '#fff',
    border: '1px solid #ddd',
    borderRadius: 8,
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    zIndex: 1000,
    padding: '1rem',
  },
  dropTitle: {
    fontWeight: 600,
    marginBottom: '0.75rem',
    color: 'black',
  },
  dropItemsWrapper: {
    maxHeight: 220,
    overflowY: 'auto',
  },
  dropItem: {
    display: 'flex',
    justifyContent: 'space-between',
    columnGap: '0.5rem',
    alignItems: 'center',
    fontSize: '0.85rem',
    paddingBottom: '0.5rem',
    borderBottom: '1px solid #f0f0f0',
    marginBottom: '0.5rem',
  },
  itemName: {
    fontWeight: 500,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    color: 'black',
  },
  itemQty: {
    color: 'black',
  },
  itemSubtotal: {
    fontWeight: 600,
    textAlign: 'right',
    color: 'black',
  },
  dropTotalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontWeight: 600,
    margin: '0.75rem 0',
  },
  btnToCart: {
    width: '100%',
    padding: '0.6rem',
    background: '#fff',
    color: '#007bff',
    border: '1px solid #007bff',
    borderRadius: 6,
    cursor: 'pointer',
    marginBottom: '0.5rem',
  },
  btnCheckout: {
    width: '100%',
    padding: '0.6rem',
    background: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: 6,
    cursor: 'pointer',
  },
};

export default Header;