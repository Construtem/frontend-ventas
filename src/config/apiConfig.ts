// config/apiConfig.ts

export const API_CONFIG = {
  // URL base de la API
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api',
  
  // Flag para usar datos mock (cambiar a false cuando la API esté lista)
  USE_MOCK_DATA: process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true' || true,
  
  // Timeout para las peticiones API (en milisegundos)
  TIMEOUT: 10000,
  
  // Headers por defecto
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
  },
}

// Endpoints específicos de la API
export const API_ENDPOINTS = {
  QUOTATIONS: '/cotizaciones',
  QUOTATION_HISTORY: (id: string) => `/cotizaciones/${id}/historial`,
  QUOTATION_STATE: (id: string) => `/cotizaciones/${id}/estado`,
  QUOTATION_DETAILS: (id: string) => `/cotizaciones/${id}/detalles`,
  USERS: '/users',
  CLIENTS: '/clients',
}

export default API_CONFIG
