'use client'
import React, { useState } from 'react'
import { useProductos } from '@/hooks/useProductos'
import { useSucursales } from '@/hooks/useSucursales'

interface ProductTableProps {
    quotationId?: string
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
    sucursalId: number
}

const ProductTable: React.FC<ProductTableProps> = ({ quotationId }) => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [productosEnCotizacion, setProductosEnCotizacion] = useState<ProductoEnCotizacion[]>([])
    const [cantidadesModal, setCantidadesModal] = useState<{[sku: string]: number}>({})
    const [sucursalSeleccionada, setSucursalSeleccionada] = useState<number | null>(null)
    
    // Cargar sucursales
    const { sucursales, loading: loadingSucursales, error: errorSucursales } = useSucursales()
    
    // Usar el hook personalizado para manejar productos
    const { loading, error, buscarProductosPorSucursal } = useProductos()
    
    // Filtrar productos solo de la sucursal seleccionada
    const productosConStock: Product[] = sucursalSeleccionada 
        ? buscarProductosPorSucursal(searchTerm, sucursalSeleccionada)
            .map(producto => {
                // Filtrar stock solo de la sucursal seleccionada
                const stockSucursalSeleccionada = producto.stockPorSucursal?.find(stock => 
                    stock.sucursalId === sucursalSeleccionada
                )
                
                return {
                    sku: producto.sku,
                    nombre: producto.nombre,
                    descripcion: producto.descripcion,
                    precio: producto.precio,
                    stockDisponible: stockSucursalSeleccionada?.cantidad || 0,
                    peso: producto.peso,
                    proveedor: producto.proveedor,
                    descuento: stockSucursalSeleccionada?.descuento || 0,
                    stockPorSucursal: stockSucursalSeleccionada ? [stockSucursalSeleccionada] : []
                }
            })
            .sort((a, b) => a.sku.localeCompare(b.sku))
        : []

    // Función para abrir el modal
    const openModal = () => {
        setIsModalOpen(true)
    }

    // Función para cerrar el modal
    const closeModal = () => {
        setIsModalOpen(false)
        setSearchTerm('')
        setSucursalSeleccionada(null)
        setCantidadesModal({})
    }

    // Función para formatear moneda
    const formatCurrency = (amount: number): string => {
        return amount.toLocaleString('es-CL', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        })
    }

    const agregarProductoACotizacion = (producto: Product, cantidad: number = 1): void => {
        if (!sucursalSeleccionada) {
            console.error('No hay sucursal seleccionada')
            return
        }

        const productoExistente = productosEnCotizacion.find(p => 
            p.sku === producto.sku && p.sucursalId === sucursalSeleccionada
        )
        
        if (productoExistente) {
            // Si ya existe, actualizar cantidad
            setProductosEnCotizacion(prev => 
                prev.map(p => 
                    p.sku === producto.sku && p.sucursalId === sucursalSeleccionada
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
                proveedor: producto.proveedor,
                sucursalId: sucursalSeleccionada
            }
            setProductosEnCotizacion(prev => [...prev, nuevoProducto])
        }

        console.log(`Producto agregado a cotización ${quotationId} desde sucursal ${sucursalSeleccionada}:`, producto.sku, 'Cantidad:', cantidad)
    }

    // Convertir productosEnCotizacion a formato de tabla
    const tableData = productosEnCotizacion

    return (
        <>
            <div className="bg-white border border-gray-300 p-4 max-w-5xl mx-auto rounded-lg shadow-md">
                {/* Mostrar errores */}
                {(error || errorSucursales) && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                        <strong>Error:</strong> {error || errorSucursales}
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
                                    <th className="border border-gray-300 px-3 py-2 text-left">Sucursal</th>                            
                                    <th className="border border-gray-300 px-3 py-2 text-left">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tableData.map((row, index) => {
                                    const descuentoDelStock = row.descuento || 0
                                    const precioConDescuento = row.precio - descuentoDelStock
                                    const total = precioConDescuento * row.cantidad
                                    const sucursal = sucursales.find(s => s.id === row.sucursalId)
                                    
                                    return (
                                        <tr key={`${row.sku}-${row.sucursalId}-${index}`} className="">
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
                                            <td className="border border-gray-300 px-3 py-2">{sucursal?.nombre || 'N/A'}</td>
                                            <td className="border border-gray-300 px-3 py-2 font-semibold">
                                                ${formatCurrency(total)}
                                            </td>
                                        </tr>
                                    )
                                })}
                                {tableData.length === 0 && (
                                    <tr>
                                        <td colSpan={8} className="border border-gray-300 px-3 py-2 text-center text-gray-500">
                                            No hay productos agregados a la cotización
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
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
                    <div className="rounded-lg p-6 w-[1200px] h-[700px] mx-4 flex flex-col" style={{background: '#0B1631'}}>
                        {/* Header del modal */}
                        <div className="flex justify-between items-center mb-4 gap-4 flex-shrink-0">
                            <h2 className="text-xl font-bold text-white">Productos</h2>
                            
                            {/* Selector de sucursal */}
                            <div className="flex items-center gap-4">
                                <select
                                    value={sucursalSeleccionada || ''}
                                    onChange={(e) => setSucursalSeleccionada(e.target.value ? Number(e.target.value) : null)}
                                    className="bg-white px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    disabled={loadingSucursales}
                                >
                                    <option value="">Seleccionar sucursal</option>
                                    {sucursales.map(sucursal => (
                                        <option key={sucursal.id} value={sucursal.id}>
                                            {sucursal.nombre}
                                        </option>
                                    ))}
                                </select>
                                
                                <div className="relative flex-1">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Buscar productos..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="bg-white w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        disabled={!sucursalSeleccionada}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Contenido principal del modal - con flex-1 para ocupar el espacio restante */}
                        <div className="flex-1 flex flex-col min-h-0">
                            {/* Mensaje si no hay sucursal seleccionada */}
                            {!sucursalSeleccionada && (
                                <div className="flex-1 flex items-center justify-center text-white">
                                    <p className="text-lg">Selecciona una sucursal para ver los productos disponibles</p>
                                </div>
                            )}

                            {/* Tabla de productos en el modal */}
                            {sucursalSeleccionada && (
                                <div className="flex-1 flex flex-col min-h-0">
                                    {loading ? (
                                        <div className="flex-1 flex items-center justify-center text-white">
                                            <div className="flex items-center justify-center">
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mr-3"></div>
                                                Cargando productos...
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex-1 overflow-auto border border-gray-300 rounded">
                                            <table className="w-full text-sm border-collapse">
                                                <thead className="sticky top-0 z-10">
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
                                                                {searchTerm ? 'No se encontraron productos que coincidan con la búsqueda' : 'No hay productos disponibles en esta sucursal'}
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Botones del modal */}
                        <div className="flex justify-end mt-6 space-x-3 flex-shrink-0">
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