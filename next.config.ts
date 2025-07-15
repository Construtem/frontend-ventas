import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    // Configuraciones experimentales si es necesario
  },
  // Configurar el puerto por defecto
  serverRuntimeConfig: {
    port: 3001
  },
  publicRuntimeConfig: {
    port: 3001
  }
};

export default nextConfig;
