import { useState, useCallback } from 'react'
import { stockService, StockSucursal } from '@/services/apiService'

interface UseStockSucursalReturn {
  stock: StockSucursal[]
  loading: boolean
  error: string | null
  obtenerStockProducto: (sku: string) => StockSucursal | undefined
  obtenerDescuentoProducto: (sku: string) => number
  obtenerCantidadDisponible: (sku: string) => number
  cargarStockParaProductos: (productos: string[]) => Promise<void>
  recargarStock: () => Promise<void>
}

export const useStockSucursal = (sucursalId: number): UseStockSucursalReturn => {
  const [stock, setStock] = useState<StockSucursal[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [productosConsultados, setProductosConsultados] = useState<string[]>([])

  const cargarStockParaProductos = useCallback(async (productos: string[]) => {
    if (!sucursalId || productos.length === 0) return
    
    // Filtrar solo productos que no hemos consultado antes
    const productosNuevos = productos.filter(p => !productosConsultados.includes(p))
    if (productosNuevos.length === 0) return

    setLoading(true)
    setError(null)
    
    try {
      console.log('Cargando stock para sucursal:', sucursalId, 'productos:', productosNuevos.length)
      
      const stockData = await stockService.obtenerStockProductosEnSucursal(sucursalId, productosNuevos)

      console.log('Stock cargado:', stockData.length, 'de', productosNuevos.length, 'productos consultados')

      // Actualizar stock existente con nuevos datos
      setStock(prevStock => {
        const stockActualizado = [...prevStock]
        
        // Agregar o actualizar stock de productos
        stockData.forEach(nuevoStock => {
          const indiceExistente = stockActualizado.findIndex(s => s.sku === nuevoStock.sku)
          if (indiceExistente >= 0) {
            stockActualizado[indiceExistente] = nuevoStock
          } else {
            stockActualizado.push(nuevoStock)
          }
        })
        
        return stockActualizado
      })
      
      // Marcar productos como consultados
      setProductosConsultados(prev => [...prev, ...productosNuevos])
      
    } catch (err) {
      const mensaje = err instanceof Error ? err.message : 'Error al cargar stock'
      setError(mensaje)
      console.error('Error al cargar stock:', err)
    } finally {
      setLoading(false)
    }
  }, [sucursalId, productosConsultados])

  const recargarStock = useCallback(async () => {
    // Limpiar cache y recargar todos los productos consultados
    setStock([])
    const productosParaRecargar = [...productosConsultados]
    setProductosConsultados([])
    
    if (productosParaRecargar.length > 0) {
      await cargarStockParaProductos(productosParaRecargar)
    }
  }, [productosConsultados, cargarStockParaProductos])

  const obtenerStockProducto = useCallback((sku: string): StockSucursal | undefined => {
    return stock.find((s: StockSucursal) => s.sku === sku)
  }, [stock])

  const obtenerDescuentoProducto = useCallback((sku: string): number => {
    const stockProducto = obtenerStockProducto(sku)
    return stockProducto?.descuento || 0
  }, [obtenerStockProducto])

  const obtenerCantidadDisponible = useCallback((sku: string): number => {
    const stockProducto = obtenerStockProducto(sku)
    return stockProducto?.cantidad || 0
  }, [obtenerStockProducto])

  return {
    stock,
    loading,
    error,
    obtenerStockProducto,
    obtenerDescuentoProducto,
    obtenerCantidadDisponible,
    cargarStockParaProductos,
    recargarStock
  }
}