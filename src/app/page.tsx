// src/app/page.tsx
"use client";

import logo from '@/styles/images/contrutem.png';
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

//Esto sirve a modo de prueba, para alternar entre el login del administrador y de vendedor y que te redireccione a la respectiva pestaña.
export default function Login() {
  const [rol, setRol] = useState("vendedor");
  const router = useRouter();

  const alternarRol = () => {
    setRol(rol == "vendedor" ? "administrador" : "vendedor");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (rol === "vendedor") {
      router.push("/navegacion/vendedor");
    } else {
      router.push("/navegacion/administrador");
    }
  };
  
  return (
    <div className= "ml-[180px] mt-[70px] p-8 min-h-[calc(100vh-70px)] bg-gray-100">
      <div style={cardStyle}>
        {/* Botón de alternar */}
        <div className="flex justify-end">
          <button
            onClick={alternarRol}
            className="text-sm text-blue-600 hover:underline"
          >
            Cambiar a {rol === "vendedor" ? "Administrador" : "Vendedor"}
          </button>
        </div>

        {/* Título */}
        <h2 className="text-center text-2xl font-bold text-gray-900">
          INICIAR SESIÓN ({rol.toUpperCase()})
        </h2>

        {/* Imagen */}
        <div className="flex justify-center">
          <Image
            src={logo}
            alt="Logo"
            width={120}
            height={120}
            className="object-contain"
          />
        </div>

        {/* Formulario */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="text-sm font-medium text-gray-900">Email</label>
            <input
              type="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="..."
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-900">Contraseña</label>
            <input
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="..."
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-md font-semibold hover:bg-indigo-700 transition"
          >
            Ingresar
          </button>
        </form>

        {/* Enlace para recuperar contraseña */}
        <div className="text-center">
          <a href="#" className="text-sm text-blue-600 hover:underline">
            ¿Olvidaste la contraseña?
          </a>
        </div>
      </div>
    </div>
  );
}

const cardStyle: React.CSSProperties = {
  backgroundColor: "white",
  borderRadius: "12px",
  padding: "2rem",
  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
};




/* src/app/page.tsx

import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-4xl font-bold mb-10">Bienvenido al sistema</h1>
      <div className="space-y-4">
        <Link href="/navegacion/vendedor">
          <button className="px-6 py-3 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition">
            Ingresar como Vendedor
          </button>
        </Link>
        <Link href="/navegacion/administrador">
          <button className="px-6 py-3 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition">
            Ingresar como Administrador
          </button>
        </Link>
      </div>
    </main>
  );
}
*/