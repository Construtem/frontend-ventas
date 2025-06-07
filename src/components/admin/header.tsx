"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "@/styles/images/contrutem_png.png"; // Usa alias @ si está configurado en tsconfig.json
//import exit from "@/styles/images/exit.png";
import { usePathname } from "next/navigation";

interface HeaderProps {
  onToggleSidebar?: () => void;
}

const Header: React.FC<HeaderProps> = ({onToggleSidebar}) => {
  const pathname = usePathname();

  // Obtener el rol desde la URL
  const getRoleFromPath = () => {
  if (pathname.includes("/vendedor")) return "Vendedor";
  if (pathname.includes("/admin")) return "Administrador";
  return "Invitado";
  };

  const roleName = getRoleFromPath();

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
              className="icon icon-tabler icons-tabler-filled icon-tabler-layout-sidebar">
                <path d="M6 21a3 3 0 0 1 -3 -3v-12a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v12a3 3 0 0 1 -3 3zm12 -16h-8v14h8a1 1 0 0 0 1 -1v-12a1 1 0 0 0 -1 -1"/>
            </svg>
          </button>
        )}
        <Image src={logo} alt="ConstrUTEM Logo" style={styles.logoImg as React.CSSProperties} />
      </div>
      <div style={styles.right}>
        <span style={styles.userInfo}>
          <span style={styles.userIcon}>👤</span>
          <span style={styles.userText}>
            <span style={styles.userName}>{roleName}</span>
            <span style={styles.userEmail}>correo@example.com</span>
          </span>
        </span>
        <Link href="/">
        <button style={styles.logout as React.CSSProperties}>
            <svg  
              xmlns="http://www.w3.org/2000/svg"  
              alt="Cerrar sesión"
              width={32}  
              height={32}  
              viewBox="0 0 24 24"  
              fill="none"  
              stroke="#FF7300"  
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"  
              className="icon icon-tabler icons-tabler-outline icon-tabler-logout">
                <path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" />
                <path d="M9 12h12l-3 -3" />
                <path d="M18 15l3 -3" />
            </svg>
          </button>
        </Link>
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
    fontWeight: 'semibold',
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
};

export default Header;