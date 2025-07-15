'use client'
import React, { useState } from 'react'
import { useProductos } from '@/hooks/useProductos'

interface ProductTableProps {
    quotationId?: string
    sucursalesIds: number[] // Array de IDs de sucursales
}

interface Product {
    sku: string
    nombre: string
    descripcion: string
    precio: number
    stockDisponible: number
    peso: number
    proveedor?: {
        marca: string
    }
    descuento?: number
    stockPorSucursal?: Array<{
        sucursalId: number;
        sucursalNombre: string;
        cantidad: number;
        descuento: number;
    }>
}

interface ProductoEnCotizacion {
    sku: string
    nombre: string
    descripcion: string
    precio: number
    cantidad: number
    descuento: number
    stockDisponible: number
    peso: number
    proveedor?: {
        marca: string
    }
}

const ProductTable: React.FC<ProductTableProps> = ({ quotationId, sucursalesIds }) => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [productosEnCotizacion, setProductosEnCotizacion] = useState<ProductoEnCotizacion[]>([])
    const [cantidadesModal, setCantidadesModal] = useState<{[sku: string]: number}>({})
    
    // Usar el hook personalizado para manejar productos (ya incluye stock)
    const { loading, error, buscarProductos } = useProductos()
    
    // Filtrar productos con stock de las sucursales seleccionadas
    const productosConStock: Product[] = buscarProductos(searchTerm)
        .map(producto => {
            // Filtrar stock solo de las sucursales seleccionadas
            const stockSucursalesSeleccionadas = producto.stockPorSucursal?.filter(stock => 
                sucursalesIds.includes(stock.sucursalId)
            ) || []
            
            // Calcular stock total de las sucursales seleccionadas
            const stockTotalDisponible = stockSucursalesSeleccionadas.reduce((total, stock) => total + stock.cantidad, 0)
            
            // Obtener el descuento promedio (o del primer stock disponible)
            const descuento = stockSucursalesSeleccionadas[0]?.descuento || 0

            return {
                sku: producto.sku,
                nombre: producto.nombre,
                descripcion: producto.descripcion,
                precio: producto.precio,
                stockDisponible: stockTotalDisponible,
                peso: producto.peso,
                proveedor: producto.proveedor,
                descuento,
                stockPorSucursal: stockSucursalesSeleccionadas
            }
        })
        .sort((a, b) => a.sku.localeCompare(b.sku)) // Ordenar por SKU de menor a mayor


    // Usar directamente los productos de la cotización para la tabla principal
    const tableData = productosEnCotizacion

    const formatCurrency = (amount: number): string => {
        return new Intl.NumberFormat('es-CL', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount)
    }

    const agregarProductoACotizacion = (producto: Product, cantidad: number = 1): void => {
        const productoExistente = productosEnCotizacion.find(p => p.sku === producto.sku)
        
        if (productoExistente) {
            // Si ya existe, actualizar cantidad
            setProductosEnCotizacion(prev => 
                prev.map(p => 
                    p.sku === producto.sku 
                        ? { ...p, cantidad: p.cantidad + cantidad }
                        : p
                )
            )
        } else {
            // Si no existe, agregar nuevo producto
            const nuevoProducto: ProductoEnCotizacion = {
                sku: producto.sku,
                nombre: producto.nombre,
                descripcion: producto.descripcion,
                precio: producto.precio,
                cantidad: cantidad,
                descuento: producto.descuento || 0,
                stockDisponible: producto.stockDisponible,
                peso: producto.peso,
                proveedor: producto.proveedor
            }
            setProductosEnCotizacion(prev => [...prev, nuevoProducto])

            // Log con quotationId
            console.log(`Producto agregado a cotización ${quotationId}:`, producto.sku, 'Cantidad:', cantidad)
        }
    }

    const openModal = (): void => setIsModalOpen(true)
    const closeModal = (): void => setIsModalOpen(false)

    return (
        <>
            <div className="bg-white border border-gray-300 p-4 max-w-5xl mx-auto rounded-lg shadow-md">
                {/* Mostrar errores */}
                {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                        <strong>Error productos:</strong> {error}
                    </div>
                )}

                {/* Header */}
                <div className="mb-9">
                    <div className="flex items-center gap-2 mb-2">
                        <h2 className="text-xl font-bold text-black">
                            Productos
                        </h2>
                    </div>
                    <div>
                        <button
                            className="flex items-center justify-center cursor-pointer"
                            style={{fontWeight: 'bold', fontSize: '18px', color: '#084AB9'}}
                            title="Agregar producto"
                            onClick={openModal}
                        >
                            + Agregar Producto
                        </button>
                    </div>
                </div>

                {/* Tabla de productos */}
                <div className="mb-4">
                    <div className="overflow-x-auto max-h-72" style={{overflowY:'auto'}}>
                        <table className="w-full text-xs border-collapse">
                            <thead>
                                <tr className="" style={{background:'#F4F5F9'}}>
                                    <th className="border border-gray-300 px-3 py-2 text-left">SKU</th>
                                    <th className="border border-gray-300 px-3 py-2 text-left">Nombre</th>
                                    <th className="border border-gray-300 px-3 py-2 text-left">Descripción</th>
                                    <th className="border border-gray-300 px-3 py-2 text-left">Precio</th>
                                    <th className="border border-gray-300 px-3 py-2 text-left">Descuento</th>
                                    <th className="border border-gray-300 px-3 py-2 text-left">Cantidad</th>                            
                                    <th className="border border-gray-300 px-3 py-2 text-left">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tableData.map((row, index) => {
                                    const descuentoDelStock = row.descuento || 0
                                    const precioConDescuento = row.precio - descuentoDelStock
                                    const total = precioConDescuento * row.cantidad
                                    
                                    return (
                                        <tr key={`${row.sku}-${index}`} className="">
                                            <td className="border border-gray-300 px-3 py-2">{row.sku}</td>
                                            <td className="border border-gray-300 px-3 py-2">{row.nombre}</td>
                                            <td className="border border-gray-300 px-3 py-2">{row.descripcion}</td>
                                            <td className="border border-gray-300 px-3 py-2">${formatCurrency(row.precio)}</td>
                                            <td className="border border-gray-300 px-3 py-2">
                                                {descuentoDelStock > 0 ? (
                                                    <span className="text-green-600 font-semibold">
                                                        -${formatCurrency(descuentoDelStock)}
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-400">Sin descuento</span>
                                                )}
                                            </td>
                                            <td className="border border-gray-300 px-3 py-2">{row.cantidad}</td>
                                            <td className="border border-gray-300 px-3 py-2 font-semibold">
                                                ${formatCurrency(total)}
                                            </td>
                                        </tr>
                                    )
                                })}
                                {tableData.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="border border-gray-300 px-3 py-2 text-center text-gray-500">
                                            No hay productos agregados a la cotización
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Botón Confirmar Productos */}
                <div className="flex justify-end mt-4">
                    <button 
                        className="text-white py-2 px-2 text-sm font-bold rounded cursor-pointer hover:bg-blue-700 transition-colors"
                        style={{background:'#2563B6'}}
                        onClick={() => {
                            console.log(`Productos confirmados para cotización ${quotationId}:`, productosEnCotizacion)
                        }}
                    >
                       Confirmar Productos
                    </button>
                </div>
            </div>

            {/* Modal para agregar productos */}
            {isModalOpen && (
                <div 
                    className="fixed inset-0 flex items-center justify-center"
                    style={{
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        zIndex: 9999
                    }}
                >
                    <div className="rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto" style={{background: '#0B1631'}}>
                        {/* Header del modal */}
                        <div className="flex justify-between items-center mb-4 gap-4">
                            <h2 className="text-xl font-bold text-white">Productos</h2>
                            <div className="relative w-full">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Buscar"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="bg-white w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        {/* Tabla de productos en el modal */}
                        <div className="overflow-x-auto">
                            {loading ? (
                                <div className="text-center py-8 text-white">
                                    <div className="flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mr-3"></div>
                                        Cargando productos...
                                    </div>
                                </div>
                            ) : (
                                <table className="w-full text-sm border-collapse">
                                    <thead>
                                        <tr style={{background:'#F4F5F9', color: 'black'}}>
                                            <th className="border border-gray-300 px-3 py-2 text-left">SKU</th>
                                            <th className="border border-gray-300 px-3 py-2 text-left">Nombre</th>
                                            <th className="border border-gray-300 px-3 py-2 text-left">Descripción</th>
                                            <th className="border border-gray-300 px-3 py-2 text-left">Precio</th>
                                            <th className="border border-gray-300 px-3 py-2 text-left">Stock</th>
                                            <th className="border border-gray-300 px-3 py-2 text-left">Costo</th>
                                            <th className="border border-gray-300 px-3 py-2 text-left">Cantidad</th>
                                            <th className="border border-gray-300 px-3 py-2 text-left">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {productosConStock.map((product) => {
                                            const cantidad = cantidadesModal[product.sku] || 1
                                            return (
                                                <tr key={product.sku} className="bg-white">
                                                    <td className="border border-gray-300 px-3 py-2 font-mono text-sm">{product.sku}</td>
                                                    <td className="border border-gray-300 px-3 py-2">{product.nombre}</td>
                                                    <td className="border border-gray-300 px-3 py-2">{product.descripcion}</td>
                                                    <td className="border border-gray-300 px-3 py-2">${formatCurrency(product.precio)}</td>
                                                    <td className="border border-gray-300 px-3 py-2">
                                                        <span className={
                                                            product.stockDisponible <= 0 
                                                                ? 'text-red-600 font-bold' 
                                                                : product.stockDisponible <= 10 
                                                                    ? 'text-orange-600 font-semibold' 
                                                                    : 'text-green-600 font-semibold'
                                                        }>
                                                            {product.stockDisponible}
                                                        </span>
                                                    </td>
                                                    <td className="border border-gray-300 px-3 py-2">${formatCurrency(product.precio * 0.8)}</td>
                                                    <td className="border border-gray-300 px-3 py-2">
                                                        <div className="flex items-center gap-2">
                                                            <button 
                                                                onClick={() => {
                                                                    const newCantidad = Math.max(1, cantidad - 1)
                                                                    setCantidadesModal(prev => ({...prev, [product.sku]: newCantidad}))
                                                                }}
                                                                className="bg-gray-200 hover:bg-gray-300 text-gray-700 w-8 h-8 rounded text-sm font-bold cursor-pointer"
                                                            >
                                                                -
                                                            </button>
                                                            <span className="w-8 text-center">{cantidad}</span>
                                                            <button 
                                                                onClick={() => {
                                                                    const newCantidad = Math.min(product.stockDisponible, cantidad + 1)
                                                                    setCantidadesModal(prev => ({...prev, [product.sku]: newCantidad}))
                                                                }}
                                                                className="bg-gray-200 hover:bg-gray-300 text-gray-700 w-8 h-8 rounded text-sm font-bold cursor-pointer"
                                                                disabled={cantidad >= product.stockDisponible}
                                                            >
                                                                +
                                                            </button>
                                                        </div>
                                                    </td>
                                                    <td className="border border-gray-300 px-3 py-2">
                                                        <div className="flex gap-2">
                                                            <button 
                                                                className={`px-3 py-1 rounded text-sm font-semibold cursor-pointer ${
                                                                    product.stockDisponible <= 0
                                                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                                        : 'bg-green-500 text-white hover:bg-green-600'
                                                                }`}
                                                                onClick={() => {
                                                                    if (product.stockDisponible > 0) {
                                                                        agregarProductoACotizacion(product, cantidad)
                                                                        console.log('Producto agregado:', product.sku, 'Cantidad:', cantidad)
                                                                    }
                                                                }}
                                                                disabled={product.stockDisponible <= 0}
                                                                title={product.stockDisponible <= 0 ? 'Sin stock disponible' : 'Agregar a cotización'}
                                                            >
                                                                Agregar
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                        {productosConStock.length === 0 && !loading && (
                                            <tr>
                                                <td colSpan={8} className="border border-gray-300 px-3 py-2 text-center text-gray-500">
                                                    {searchTerm ? 'No se encontraron productos que coincidan con la búsqueda' : 'No hay productos disponibles'}
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            )}
                        </div>

                        {/* Botones del modal */}
                        <div className="flex justify-end mt-6 space-x-3">
                            <button 
                                onClick={closeModal}
                                className="px-6 py-3 border-2 border-blue-400 text-blue-400 bg-transparent rounded-lg hover:bg-blue-50 transition-colors font-semibold cursor-pointer"
                            >
                                Cancelar
                            </button>
                            <button 
                                onClick={() => {
                                    console.log(`Guardando productos para cotización ${quotationId}:`, productosEnCotizacion)
                                    closeModal()
                                }}
                                className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-semibold cursor-pointer"
                            >
                                Guardar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default ProductTable