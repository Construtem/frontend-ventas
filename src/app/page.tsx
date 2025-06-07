/* LOGIN
  
  ADMIN: email: admin@admin.cl || contraseña: administrador
  VENDEDOR: email:vendedor@vendedor.cl || contraseña: vendedor
  
*/


"use client";

import logo from '@/styles/images/contrutem.png';
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from '../../lib/supabase/supabaseClient'; // Ajusta la ruta según tu estructura

export default function Login() {
  const [rol, setRol] = useState("vendedor");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const alternarRol = () => {
    setRol(rol === "vendedor" ? "administrador" : "vendedor");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Autenticar con Supabase
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log("User ID:", data.user?.id);

      if (authError) {
        throw authError;
      }

      // Obtener el rol real desde la base de datos
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('rol')
        .eq('id', data.user?.id)
        .single();

      if (profileError || !profileData) {
        throw new Error("No se pudo obtener el perfil del usuario");
      }

      // Guardar rol en localStorage y redirigir segun el rol
      localStorage.setItem("rol", profileData.rol);
      if (profileData.rol === "vendedor") {
        router.push("/navegacion/vendedor");
      } else {
        router.push("/navegacion/administrador");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2 style={titleStyle}>
          INICIAR SESIÓN
        </h2>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
          <Image src={logo} alt="Logo" width={200} height={120} style={{ objectFit: 'contain' }} />
        </div>

        {error && (
          <div style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form style={formStyle} onSubmit={handleSubmit}>
          <div>
            <label style={labelStyle}>Email</label>
            <input
              type="email"
              placeholder="..."
              style={inputStyle}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label style={labelStyle}>Contraseña</label>
            <input
              type="password"
              placeholder="..."
              style={inputStyle}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button 
            type="submit" 
            style={submitButtonStyle}
            disabled={loading}
          >
            {loading ? "Cargando..." : "Ingresar"}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <a href="#" style={linkStyle}>¿Olvidaste la contraseña?</a>
        </div>
      </div>
    </div>
  );
}

// Estilos en línea (se mantienen igual)
const containerStyle: React.CSSProperties = {
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#F7F7F7',
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
  fontFamily: 'Montserrat, sans-serif',
  color: '#222222',
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
  backgroundColor: '#FF7300',
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