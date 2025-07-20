import axios from 'axios';

// Configuración base de Axios
const API_BASE_URL = process.env.NEXT_PUBLIC_API_VENTAS || 'https://api-ventas.tssw.cl';
const API_INVENTORY_URL = process.env.NEXT_PUBLIC_API_INVENTARIO || 'https://api-inventario.tssw.cl';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 15 segundos
});

const Inventarioapi = axios.create({
  baseURL: API_INVENTORY_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 15 segundos
});

// Interceptor para manejo de errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

Inventarioapi.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Inventario API Error:', error);
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

// Tipos para productos del inventario
export interface Producto {
  descuento_sucursal: number;
    stock_sucursal: number;
  sku: string;
  nombre: string;
  descripcion: string;
  proveedor_id: number;
  peso: number;
  largo: number;
  ancho: number;
  alto: number;
  precio: number;
  proveedor?: {
    id: number;
    marca: string;
    email: string;
    telefono: string;
    direccion: string;
  };
}

export interface Sucursal {
  id: number
  nombre: string
  telefono: string
  direccion: string
  comuna: string
  ciudad: string
  tipo_id: number
  tipo: {
    id: number
    nombre: string
  }
}

export interface StockSucursal {
  sku: string;
  sucursal_id: number;
  cantidad: number;
  descuento: number;
  producto: {
    sku: string;
    nombre: string;
    descripcion: string;
    proveedor_id: number;
    peso: number;
    largo: number;
    ancho: number;
    alto: number;
    precio: number;
    proveedor: {
      id: number;
      marca: string;
      email: string;
      telefono: string;
      direccion: string;
    };
  };
  sucursal: {
    id: number;
    nombre: string;
    telefono: string;
    direccion: string;
    comuna: string;
    ciudad: string;
    tipo_id: number;
    tipo: {
      id: number;
      nombre: string;
    };
  };
}

// Alias para compatibilidad con el hook
export type StockSucursalCompleto = StockSucursal;

// Actualizar la interfaz ProductoConStock para incluir la nueva información
export interface ProductoConStock extends Producto {
  stock?: StockSucursal[];
  stockDisponible?: number;
  stockPorSucursal?: Array<{
    sucursalId: number;
    sucursalNombre: string;
    cantidad: number;
    descuento: number;
  }>;
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
    const response = await api.get<Cliente[]>('/api/clientes');
    return response.data;
  },

  // Crear nuevo cliente
  crearCliente: async (cliente: Omit<Cliente, 'id'>): Promise<{ id: number }> => {
    const response = await api.post<{ id: number }>('/api/clientes', cliente);
    return response.data;
  },

  // Actualizar cliente
  actualizarCliente: async (id: number, cliente: Partial<Cliente>): Promise<Cliente> => {
    const response = await api.patch<Cliente>(`/api/clientes/${id}`, cliente);
    return response.data;
  },

  // Eliminar cliente
  eliminarCliente: async (id: number): Promise<{ mensaje: string }> => {
    const response = await api.delete<{ mensaje: string }>(`/api/clientes/${id}`);
    return response.data;
  },
};

// Servicios de Cotización
export const cotizacionService = {
  // Obtener cotizaciones simplificadas
  obtenerCotizacionesSimplificadas: async (): Promise<CotizacionSimplificada[]> => {
    const response = await api.get<CotizacionSimplificada[]>('/api/cotizaciones');
    return response.data;
  },

  // Crear nueva cotización
  crearCotizacion: async (cotizacion: Omit<Cotizacion, 'id'>): Promise<Cotizacion> => {
    const response = await api.post<Cotizacion>('/api/cotizaciones', cotizacion);
    return response.data;
  },

  // Obtener cotización por ID (simplificada)
  obtenerCotizacionSimplificada: async (id: number): Promise<CotizacionSimplificada> => {
    const response = await api.get<CotizacionSimplificada>(`/api/cotizaciones/${id}`);
    return response.data;
  },

  // Editar cotización
  editarCotizacion: async (id: number, cotizacion: Partial<Cotizacion>): Promise<Cotizacion> => {
    const response = await api.put<Cotizacion>(`/api/cotizaciones/${id}`, cotizacion);
    return response.data;
  },

  // Obtener cotizaciones completas
  obtenerCotizacionesCompletas: async (): Promise<Cotizacion[]> => {
    const response = await api.get<Cotizacion[]>('/api/cotizaciones/completas');
    return response.data;
  },

  // Obtener cotización completa por ID
  obtenerCotizacionCompleta: async (id: number): Promise<Cotizacion> => {
    const response = await api.get<Cotizacion>(`/api/cotizaciones/completa/${id}`);
    return response.data;
  },
};

// Servicios de Productos (Backend Inventario)
export const productoService = {
  // Obtener todos los productos
  obtenerProductos: async (): Promise<Producto[]> => {
    const response = await Inventarioapi.get<Producto[]>('/api/productos');
    return response.data;
  },

  // Obtener producto por SKU
  obtenerProductoPorSKU: async (sku: string): Promise<Producto> => {
    const response = await Inventarioapi.get<Producto>(`/api/productos/${sku}`);
    return response.data;
  },

  // Obtener stock de sucursal
  obtenerStockSucursal: async (): Promise<StockSucursal[]> => {
    const response = await Inventarioapi.get<StockSucursal[]>('/api/stock-sucursal');
    return response.data;
  },

  // Obtener productos con stock
  obtenerProductosConStock: async (sucursalId?: number): Promise<ProductoConStock[]> => {
    try {
      const [productos, stocks] = await Promise.all([
        productoService.obtenerProductos(),
        productoService.obtenerStockSucursal()
      ]);

      return productos.map(producto => {
        const stockProducto = stocks.filter(stock => stock.sku === producto.sku);
        const stockDisponible = sucursalId 
          ? stockProducto.find(s => s.sucursal_id === sucursalId)?.cantidad || 0
          : stockProducto.reduce((total, s) => total + s.cantidad, 0);

        return {
          ...producto,
          stock: stockProducto,
          stockDisponible
        };
      });
    } catch (error) {
      console.error('Error al obtener productos con stock:', error);
      throw error;
    }
  }
};

// Servicios de Sucursales
export const sucursalService = {
  obtenerSucursales: async (): Promise<Sucursal[]> => {
    try {
      const response = await Inventarioapi.get<Sucursal[]>('/api/sucursales')
      return response.data
    } catch (error) {
      console.error('Error al obtener sucursales:', error)
      throw error
    }
  }
}

// Servicios de Stock sucursales
export const stockService = {
  // Obtener stock de un producto específico en una sucursal
  obtenerStockProductoEnSucursal: async (sucursalId: number, productoId: string): Promise<StockSucursalCompleto | null> => {
    try {
      const response = await Inventarioapi.get<StockSucursalCompleto>(`/api/stock-sucursal/${sucursalId}/${productoId}`);
      return response.data;
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { status?: number } };
        if (axiosError.response?.status === 404) {
          // No hay stock para este producto en esta sucursal
          return null;
        }
      }
      throw error;
    }
  },

  // Obtener stock de múltiples productos en una sucursal
  obtenerStockProductosEnSucursal: async (sucursalId: number, productos: string[]): Promise<StockSucursalCompleto[]> => {
    try {
      const stockPromises = productos.map(productoId => 
        stockService.obtenerStockProductoEnSucursal(sucursalId, productoId)
      );
      
      const stockResults = await Promise.allSettled(stockPromises);
      
      return stockResults
        .filter((result): result is PromiseFulfilledResult<StockSucursalCompleto> => 
          result.status === 'fulfilled' && result.value !== null
        )
        .map(result => result.value);
    } catch (error) {
      console.error('Error al obtener stock de productos:', error);
      throw error;
    }
  },

  // Obtener stock completo por sucursal (método legacy - ahora usa el nuevo endpoint)
  obtenerStockPorSucursal: async (): Promise<StockSucursalCompleto[]> => {
    // Este método ahora está deprecado, usar obtenerStockProductosEnSucursal
    throw new Error('Método deprecado. Usar obtenerStockProductosEnSucursal con la lista de productos.');
  },

  // Obtener todos los stocks de todas las sucursales
  obtenerTodoElStock: async (): Promise<StockSucursalCompleto[]> => {
    const response = await Inventarioapi.get<StockSucursalCompleto[]>('/api/stock-sucursal');
    return response.data;
  }
};

// Nuevo servicio combinado para obtener productos con stock de todas las sucursales
export const inventarioService = {
  // Obtener productos con stock combinado de todas las sucursales
  obtenerProductosConStockCompleto: async (): Promise<ProductoConStock[]> => {
    try {
      // Hacer ambas peticiones en paralelo
      const [productos, stocksCompletos] = await Promise.all([
        Inventarioapi.get<Producto[]>('/api/productos'),
        Inventarioapi.get<StockSucursal[]>('/api/stock-sucursal')
      ]);

      // Combinar los datos
      return productos.data.map(producto => {
        // Buscar todos los stocks que coincidan con este SKU
        const stocksDelProducto = stocksCompletos.data.filter(stock => stock.sku === producto.sku);
        
        // Calcular stock total sumando todas las sucursales
        const stockTotalDisponible = stocksDelProducto.reduce((total, stock) => total + stock.cantidad, 0);

        return {
          ...producto,
          stock: stocksDelProducto, // Array con el stock de cada sucursal
          stockDisponible: stockTotalDisponible, // Total sumado
          // Info adicional por sucursal
          stockPorSucursal: stocksDelProducto.map(stock => ({
            sucursalId: stock.sucursal_id,
            sucursalNombre: stock.sucursal.nombre,
            cantidad: stock.cantidad,
            descuento: stock.descuento
          }))
        };
      });
    } catch (error) {
      console.error('Error al obtener productos con stock completo:', error);
      throw error;
    }
  },

  // Obtener productos con stock filtrado por sucursales específicas
  obtenerProductosConStockPorSucursales: async (sucursalesIds: number[]): Promise<ProductoConStock[]> => {
    try {
      // Hacer ambas peticiones en paralelo
      const [productos, stocksCompletos] = await Promise.all([
        Inventarioapi.get<Producto[]>('/api/productos'),
        Inventarioapi.get<StockSucursal[]>('/api/stock-sucursal')
      ]);

      // Combinar los datos solo para las sucursales seleccionadas
      return productos.data.map(producto => {
        // Buscar stocks que coincidan con este SKU y estén en las sucursales seleccionadas
        const stocksDelProducto = stocksCompletos.data.filter(stock => 
          stock.sku === producto.sku && sucursalesIds.includes(stock.sucursal_id)
        );
        
        // Calcular stock total de las sucursales seleccionadas
        const stockTotalDisponible = stocksDelProducto.reduce((total, stock) => total + stock.cantidad, 0);

        return {
          ...producto,
          stock: stocksDelProducto,
          stockDisponible: stockTotalDisponible,
          stockPorSucursal: stocksDelProducto.map(stock => ({
            sucursalId: stock.sucursal_id,
            sucursalNombre: stock.sucursal.nombre,
            cantidad: stock.cantidad,
            descuento: stock.descuento
          }))
        };
      });
    } catch (error) {
      console.error('Error al obtener productos con stock por sucursales:', error);
      throw error;
    }
  },

  // Obtener stock de un producto específico en todas las sucursales
  obtenerStockProductoPorSKU: async (sku: string): Promise<StockSucursal[]> => {
    try {
      const response = await Inventarioapi.get<StockSucursal[]>('/api/stock-sucursal');
      return response.data.filter(stock => stock.sku === sku);
    } catch (error) {
      console.error(`Error al obtener stock del producto ${sku}:`, error);
      throw error;
    }
  }
};

export default api;
