'use client';
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import logo from "@/styles/images/contrutem_png.png"; // Usa alias @ si está configurado en tsconfig.json
import exit   from '@/styles/images/exit.png';   // tu icono logout
import cartIc from '@/styles/images/cart.png';   // icono carrito
import notImage from '@/styles/images/notImage.png';

const Header = () => {
  const { cart, total } = useCart();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // cerrar al clicar fuera
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!dropdownRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
      <header style={styles.header}>
        {/* --- IZQUIERDA --- */}
        <div style={styles.left}>
          <Image src={logo} alt="ConstrUTEM Logo" style={styles.logoImg as React.CSSProperties} />
        </div>

        {/* --- DERECHA --- */}
        <div style={styles.right}>
          {/* info usuario */}
          <span style={styles.userInfo}>
          <span style={styles.userIcon}>👤</span>
          <span style={styles.userText}>
            <span style={styles.userName}>Usuario</span>
            <span style={styles.userEmail}>correo@example.com</span>
          </span>
        </span>

          {/* ICONO CARRITO */}
          <div style={{ position: 'relative', marginRight: '1rem' }}>
            <Image
                src={cartIc}
                alt="Carrito"
                width={28}
                height={28}
                style={{ cursor: 'pointer' }}
                onClick={() => setOpen(!open)}
            />
            {/* badge */}
            {cart.length > 0 && (
                <span style={styles.badge}>
  {cart.reduce((acc, item) => acc + item.cantidad, 0)}</span>
            )}

            {/* dropdown */}
            {open && (
                <div ref={dropdownRef} style={styles.dropdown}>
                  <p style={styles.dropTitle}>
                    Tus productos ({cart.reduce((acc, item) => acc + item.cantidad, 0)})
                  </p>

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
                                    style={{ borderRadius: 8 }}/>
                              <p style={styles.itemName}>{item.nombre}</p>
                              <p style={styles.itemQty}>x{item.cantidad}</p>
                              <p style={styles.itemSubtotal}>
                                ${(item.precio * item.cantidad).toLocaleString()}
                              </p>
                            </div>
                        ))
                    )}
                  </div>

                  {/* total + CTA */}
                  {cart.length > 0 && (
                      <>
                        <div style={styles.dropTotalRow}>
                          <span>Total:</span>
                          <span>
                      ${total.toLocaleString()}
                    </span>
                        </div>

                        <button style={styles.btnToCart}>
                          Ir al carrito
                        </button>
                        <button style={styles.btnCheckout}>
                          Continuar con el pago
                        </button>
                      </>
                  )}
                </div>
            )}
          </div>

          {/* logout */}
          <Image
              src={exit}
              alt="Cerrar sesión"
              style={styles.logout}
              width={32}
              height={32}
          />
        </div>
      </header>
  );
};



const styles: { [key: string]: React.CSSProperties } = {
  header: {
    width: '100%',
    height: '58px',
    background: '#2D2D2D',
    color: 'white',
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
    lineHeight: '1.2',
  },
  userName: {
    fontSize: '1rem',
    color: 'white',
  },
  userEmail: {
    fontSize: '0.85rem',
    color: '#a5b4fc',
  },
  logout: {
    fontSize: '1.5rem',
    cursor: 'pointer',
    userSelect: 'none',
  },

  badge: {
    position: 'absolute' as const,
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
    position: 'absolute' as const,
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
    overflowY: 'auto' as const,
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
  itemName: { fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color:'black' },
  itemSubtotal: { fontWeight: 600, textAlign: 'right', color:'black' },
itemQty: {
    color: 'black',
},

  dropTotalRow: {
    display: 'flex', justifyContent: 'space-between',
    fontWeight: 600, margin: '0.75rem 0',
  },
  btnToCart: {
    width: '100%', padding: '0.6rem',
    background: '#fff', color: '#007bff',
    border: '1px solid #007bff',
    borderRadius: 6, cursor: 'pointer',
    marginBottom: '0.5rem',
  },
  btnCheckout: {
    width: '100%', padding: '0.6rem',
    background: '#007bff', color: '#fff',
    border: 'none', borderRadius: 6, cursor: 'pointer',
  },
};

export default Header;