"use client";

import logo from '@/styles/images/contrutem.png';
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [rol, setRol] = useState("vendedor");
  const router = useRouter();

  const alternarRol = () => {
    setRol(rol === "vendedor" ? "administrador" : "vendedor");
  };

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();

  // Guardar rol en localStorage
  localStorage.setItem("rol", rol);

  if (rol === "vendedor") {
    router.push("/navegacion/vendedor");
  } else {
    router.push("/navegacion/administrador");
  }
};

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        {/* Alternar rol */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '8px' }}>
          <button
            onClick={alternarRol}
            style={{ fontSize: '0.775rem', color: '#2563eb', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            Cambiar a {rol === "vendedor" ? "Administrador" : "Vendedor"}
          </button>
        </div>

        <h2 style={titleStyle}>
          INICIAR SESIÓN ({rol.toUpperCase()})
        </h2>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
          <Image src={logo} alt="Logo" width={200} height={120} style={{ objectFit: 'contain' }} />
        </div>

        <form style={formStyle} onSubmit={handleSubmit}>
          <div>
            <label style={labelStyle}>Email</label>
            <input
              type="email"
              placeholder="..."
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Contraseña</label>
            <input
              type="password"
              placeholder="..."
              style={inputStyle}
            />
          </div>

          <button type="submit" style={submitButtonStyle}>
            Ingresar
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <a href="#" style={linkStyle}>¿Olvidaste la contraseña?</a>
        </div>
      </div>
    </div>
  );
}

// Estilos en línea
const containerStyle: React.CSSProperties = {
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#f3f4f6',
  padding: '1rem',
};

const cardStyle: React.CSSProperties = {
  backgroundColor: 'white',
  borderRadius: '10px',
  padding: '2rem',
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  width: '100%',
  maxWidth: '380px',
};

const titleStyle: React.CSSProperties = {
  textAlign: 'center',
  fontSize: '1.5rem',
  fontWeight: 700,
  color: '#111827',
  marginBottom: '1.5rem',
};

const formStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
};

const labelStyle: React.CSSProperties = {
  fontSize: '0.875rem',
  fontWeight: 500,
  color: '#111827',
  marginBottom: '0.25rem',
  display: 'block',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.5rem 0.75rem',
  borderRadius: '8px',
  border: '1px solid #d1d5db',
  outline: 'none',
  fontSize: '1rem',
};

const submitButtonStyle: React.CSSProperties = {
  width: '100%',
  backgroundColor: '#4f46e5',
  color: 'white',
  padding: '0.5rem',
  borderRadius: '8px',
  fontWeight: 600,
  border: 'none',
  cursor: 'pointer',
  transition: 'background 0.3s ease',
};

const linkStyle: React.CSSProperties = {
  fontSize: '0.875rem',
  color: '#2563eb',
  textDecoration: 'underline',
};