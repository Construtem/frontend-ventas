import { useState, useEffect } from 'react'
import { inventarioService, type ProductoConStock } from '@/services/apiService'

/*
interface UseProductosReturn {
  productos: ProductoConStock[]
  loading: boolean
  error: string | null
  recargar: () => Promise<void>
  buscarProductos: (termino: string) => ProductoConStock[]
}


export const useProductos = (): UseProductosReturn => {
  const [productos, setProductos] = useState<ProductoConStock[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

    const cargarProductos = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const baseUrl = process.env.NEXT_PUBLIC_API_INVENTARIO || 'http://localhost:8080';
            console.log('🔍 Base URL configurada:', baseUrl);
            console.log('🔍 URL completa del endpoint:', `${baseUrl}/api/productos`);
            
            // Log antes de hacer la petición
            console.log('📡 Iniciando petición a inventario...');
            
            const productos = await productoService.obtenerProductos();
            
            // Log después de recibir respuesta
            console.log('✅ Respuesta recibida exitosamente');
            console.log('📊 Cantidad de productos:', productos.length);
            console.log('📋 Primeros 3 productos:', productos.slice(0, 3));
            console.log('📋 Estructura del primer producto:', productos[0]);
            
            setProductos(productos);
        } catch (error) {
            console.error('❌ Error completo:', error);
            console.error('❌ Tipo de error:', typeof error);
            console.error('❌ Error message:', error instanceof Error ? error.message : 'Error desconocido');
            setError('Error al cargar productos del inventario');
        } finally {
            setLoading(false);
        }
    }, []);

  const buscarProductos = (termino: string): ProductoConStock[] => {
    if (!termino.trim()) return productos
    
    const terminoLower = termino.toLowerCase()
    return productos.filter((producto: ProductoConStock) =>
      producto.nombre.toLowerCase().includes(terminoLower) ||
      producto.sku.toLowerCase().includes(terminoLower) ||
      producto.descripcion.toLowerCase().includes(terminoLower) ||
      producto.proveedor?.marca.toLowerCase().includes(terminoLower)
    )
  }

  useEffect(() => {
    cargarProductos()
  }, [cargarProductos])

  return {
    productos,
    loading,
    error,
    recargar: cargarProductos,
    buscarProductos
  }
}
*/

// Hook para obtener un producto específico
export const useProductos = () => {
  const [productos, setProductos] = useState<ProductoConStock[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const cargarProductos = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await inventarioService.obtenerProductosConStockCompleto()
        setProductos(data)
      } catch (err) {
        setError('Error al cargar productos')
        console.error('Error:', err)
      } finally {
        setLoading(false)
      }
    }

    cargarProductos()
  }, [])

  const buscarProductos = (searchTerm: string): ProductoConStock[] => {
    if (!searchTerm.trim()) {
      return productos
    }

    return productos.filter(producto =>
      producto.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      producto.nombre.toLowerCase().includes(searchTerm.toLowerCase())
      // Removidas: descripción y marca del proveedor
    )
  }

  return { productos, loading, error, buscarProductos }
}
