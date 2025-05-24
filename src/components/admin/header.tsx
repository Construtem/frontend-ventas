"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "@/styles/images/contrutem_png.png"; // Usa alias @ si está configurado en tsconfig.json
import exit from "@/styles/images/exit.png";
import { usePathname } from "next/navigation";

const Header = () => {
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
          <Image
          src={exit}
          alt="Cerrar sesión"
          style={styles.logout as React.CSSProperties}
          width={32}
          height={32}
          />
        </Link>
      </div>
    </header>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  header: {
    width: '100%',
    height: '58px',
    background: 'linear-gradient(90deg, #003366 0%, #00A859 60%, #00A859 100%)',
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
};

export default Header;