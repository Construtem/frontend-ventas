/*
import { useState, useEffect } from 'react'
import { inventarioService, type ProductoConStock } from '@/services/apiService'

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

  const buscarProductosPorSucursal = (searchTerm: string, sucursalId: number) => {
    if (!searchTerm.trim()) {
      return productos.filter(producto => 
        producto.stockPorSucursal?.some(stock => 
          stock.sucursalId === sucursalId && stock.cantidad > 0
        )
      )
    }

    const term = searchTerm.toLowerCase()
    return productos.filter(producto => {
      const matchesSearch = 
        producto.sku.toLowerCase().includes(term) ||
        producto.nombre.toLowerCase().includes(term) ||
        producto.descripcion.toLowerCase().includes(term) ||
        (producto.proveedor?.marca && producto.proveedor.marca.toLowerCase().includes(term))
      
      const hasStockInSucursal = producto.stockPorSucursal?.some(stock => 
        stock.sucursalId === sucursalId && stock.cantidad > 0
      )
      
      return matchesSearch && hasStockInSucursal
    })
  }

  return { 
    productos, 
    loading, 
    error, 
    buscarProductos,
    buscarProductosPorSucursal // Nueva función exportada
  }
}
*/