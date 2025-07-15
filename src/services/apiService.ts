import axios from 'axios';

// Configuración base de Axios
const API_BASE_URL = process.env.NEXT_PUBLIC_API_VENTAS || 'https://api-ventas.tssw.cl';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 segundos
});

// Interceptor para manejo de errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// Tipos para el frontend basados en el backend
export interface Cliente {
  id: number;
  nombre: string;
  telefono?: string;
  email?: string;
  razon_social?: string;
  rut: string;
  tipo_id: number;
  tipo_cliente?: {
    id: number;
    nombre: string;
  };
  direcciones?: DirCliente[];
}

export interface DirCliente {
  id: number;
  cliente_id: number;
  nombre: string;
  direccion: string;
  comuna: string;
  ciudad: string;
  created_at?: string;
  updated_at?: string;
}

export interface Cotizacion {
  id: number;
  rut_cliente: string;
  sec_externa: string;
  nombre: string;
  descripcion?: string;
  tipo_despacho: 'Retiro en tienda' | 'Despacho a domicilio';
  direccion_despacho_id?: number;
  fecha?: string;
  estado: 'Pendiente' | 'Aprobada' | 'Rechazada';
  total_productos_neto?: number;
  total_productos_iva?: number;
  total_despacho?: number;
  total_descuento?: number;
  total_cotizacion?: number;
  comuna_despacho?: string;
  ciudad_despacho?: string;
}

export interface CotizacionSimplificada {
    id: number;
    sec_externa: string;
    fecha_crea: string;
    estado: string;
    costo_envio: number;
    user_id: string;
    nombre: string;
    tipo_despacho: string;
    cliente: {
        nombre: string;
        telefono: string;
        email: string;
        rut: string;
        razon_social: string;
    };
    items: Array<{
        sku: string;
        nombre: string;
        cantidad: number;
    }>;
    total_items: number;
    total_precio: number;
}

// Servicios de Cliente
export const clienteService = {
  // Obtener todos los clientes
  obtenerClientes: async (): Promise<Cliente[]> => {
    const response = await api.get('/clientes');
    return response.data;
  },

  // Crear nuevo cliente
  crearCliente: async (cliente: Omit<Cliente, 'id'>): Promise<{ id: number }> => {
    const response = await api.post('/clientes', cliente);
    return response.data;
  },

  // Actualizar cliente
  actualizarCliente: async (id: number, cliente: Partial<Cliente>): Promise<Cliente> => {
    const response = await api.patch(`/clientes/${id}`, cliente);
    return response.data;
  },

  // Eliminar cliente
  eliminarCliente: async (id: number): Promise<{ mensaje: string }> => {
    const response = await api.delete(`/clientes/${id}`);
    return response.data;
  },
};

// Servicios de Cotización
export const cotizacionService = {
  // Obtener cotizaciones simplificadas
  obtenerCotizacionesSimplificadas: async (): Promise<CotizacionSimplificada[]> => {
    const response = await api.get('/api/cotizaciones');
    return response.data;
  },

  // Crear nueva cotización
  crearCotizacion: async (cotizacion: Omit<Cotizacion, 'id'>): Promise<Cotizacion> => {
    const response = await api.post('/api/cotizaciones', cotizacion);
    return response.data;
  },

  // Obtener cotización por ID (simplificada)
  obtenerCotizacionSimplificada: async (id: number): Promise<CotizacionSimplificada> => {
    const response = await api.get(`/api/cotizaciones/${id}`);
    return response.data;
  },

  // Editar cotización
  editarCotizacion: async (id: number, cotizacion: Partial<Cotizacion>): Promise<Cotizacion> => {
    const response = await api.put(`/api/cotizaciones/${id}`, cotizacion);
    return response.data;
  },

  // Obtener cotizaciones completas
  obtenerCotizacionesCompletas: async (): Promise<Cotizacion[]> => {
    const response = await api.get('/api/cotizaciones/completas');
    return response.data;
  },

  // Obtener cotización completa por ID
  obtenerCotizacionCompleta: async (id: number): Promise<Cotizacion> => {
    const response = await api.get(`/api/cotizaciones/completa/${id}`);
    return response.data;
  },
};

export default api;
