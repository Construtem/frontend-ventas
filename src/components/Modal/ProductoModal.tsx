'use client'
import { useState } from 'react';
import Modal from '@/components/Modal/Modal';
import { ModalBody, ModalFooter, ModalHeader } from '@/components/Modal/ModalsParts';
import { useSucursales } from '@/hooks/useSucursales';
import { useProductos } from '@/hooks/useProductos';
import Button from '@/components/Button';

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

interface ProductoModalProps {
    isOpen: boolean;
    onClose: () => void;
    productosEnCotizacion: ProductoEnCotizacion[];
    onAgregarProductos: (productos: { producto: Product, cantidad: number, sucursalId: number }[]) => void;
    onEliminarProducto: (sku: string, sucursalId: number) => void;
}

export function ProductoModal({ 
    isOpen, 
    onClose, 
    productosEnCotizacion, 
    onAgregarProductos,
    onEliminarProducto 
}: ProductoModalProps) {
    const [searchTerm, setSearchTerm] = useState('')
    const [cantidadesModal, setCantidadesModal] = useState<{[sku: string]: number}>({})
    const [sucursalSeleccionada, setSucursalSeleccionada] = useState<number | null>(null)
    const [errorSeleccion, setErrorSeleccion] = useState<string>('')
    
    // Cargar sucursales
    const { sucursales, loading: loadingSucursales } = useSucursales()
    
    // Usar el hook personalizado para manejar productos
    const { loading, buscarProductosPorSucursal } = useProductos()

    // Filtrar productos solo de la sucursal seleccionada
    const productosConStock: Product[] = sucursalSeleccionada 
        ? buscarProductosPorSucursal(searchTerm, sucursalSeleccionada)
            .map(producto => {
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

    // Función para formatear moneda
    const formatCurrency = (amount: number): string => {
        return amount.toLocaleString('es-CL', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        })
    }

    // Función para cerrar el modal y limpiar estado
    const handleClose = () => {
        setSearchTerm('')
        setSucursalSeleccionada(null)
        setCantidadesModal({})
        setErrorSeleccion('')
        onClose()
    }

    // Función para guardar productos seleccionados
    const handleGuardar = () => {
        const productosSeleccionados = Object.entries(cantidadesModal).filter(([, cantidad]) => cantidad > 0)
        
        if (productosSeleccionados.length === 0) {
            setErrorSeleccion('*No se ha elegido producto alguno')
            return
        }
        
        setErrorSeleccion('')
        
        const productosParaAgregar = productosSeleccionados.map(([sku, cantidad]) => {
            const producto = productosConStock.find(p => p.sku === sku)
            return {
                producto: producto!,
                cantidad,
                sucursalId: sucursalSeleccionada!
            }
        }).filter(item => item.producto)

        onAgregarProductos(productosParaAgregar)
        handleClose()
    }

    return (
        <Modal isOpen={isOpen} onClose={handleClose}>
            <ModalHeader title="Productos" onClose={handleClose} />
            
            <ModalBody>
                <div className="flex flex-col" style={{ width: '900px', height: '400px' }}>
                    {/* Controles superiores */}
                    <div className="flex items-center gap-4 mb-4 flex-shrink-0">
                        {/* Selector de sucursal */}
                        <select
                            value={sucursalSeleccionada || ''}
                            onChange={(e) => setSucursalSeleccionada(e.target.value ? Number(e.target.value) : null)}
                            className="bg-white px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                            disabled={loadingSucursales}
                        >
                            <option value="">Seleccionar sucursal</option>
                            {sucursales.map(sucursal => (
                                <option key={sucursal.id} value={sucursal.id}>
                                    {sucursal.nombre}
                                </option>
                            ))}
                        </select>
                        
                        {/* Buscador */}
                        <div className="relative flex-1">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                placeholder="Buscar por SKU o Nombre..."
                                value={searchTerm}
                                onChange={(e) => {
                                    const nosSpecialChars = e.target.value.replace(/[^a-zA-Z0-9\s]/g, '')
                                    setSearchTerm(nosSpecialChars)
                                }}
                                className="bg-white text-black w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                disabled={!sucursalSeleccionada}
                            />
                        </div>
                    </div>

                    {/* Contenido principal */}
                    <div className="flex-1 flex flex-col min-h-0">
                        {/* Mensaje si no hay sucursal seleccionada */}
                        {!sucursalSeleccionada && (
                            <div className="flex-1 flex items-center justify-center text-white">
                                <p className="text-lg">Selecciona una sucursal para ver los productos disponibles</p>
                            </div>
                        )}

                        {/* Tabla de productos */}
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
                                                    const cantidad = cantidadesModal[product.sku] || 0
                                                    
                                                    const productoEnCotizacion = productosEnCotizacion.find(p => 
                                                        p.sku === product.sku && p.sucursalId === sucursalSeleccionada
                                                    )
                                                    const cantidadEnCotizacion = productoEnCotizacion?.cantidad || 0
                                                    const yaEstaEnCotizacion = productoEnCotizacion !== undefined
                                                    
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
                                                            <td className="border border-gray-300 px-3 py-2">${formatCurrency(product.precio * cantidad)}</td>
                                                            <td className="border border-gray-300 px-3 py-2">
                                                                <div className="flex items-center gap-2">

                                                                    <Button
                                                                        onClick={() => {
                                                                            const newCantidad = Math.max(0, cantidad - 1)
                                                                            setCantidadesModal(prev => ({...prev, [product.sku]: newCantidad}))
                                                                            if (errorSeleccion) setErrorSeleccion('')
                                                                        }}
                                                                        className={"bg-gray-200 hover:bg-gray-300 text-gray-700 w-8 h-8 rounded text-sm font-bold cursor-pointer"}
                                                                        label="-"
                                                                    />

                                                                    <input
                                                                        type="number"
                                                                        value={cantidad === 0 ? '' : cantidad.toString()}
                                                                        onChange={(e) => {
                                                                            const inputValue = e.target.value
                                                                            if (errorSeleccion) setErrorSeleccion('')
                                                                            
                                                                            if (inputValue === '') {
                                                                                setCantidadesModal(prev => ({...prev, [product.sku]: 0}))
                                                                                return
                                                                            }
                                                                            
                                                                            const numericValue = parseInt(inputValue, 10)
                                                                            if (isNaN(numericValue) || numericValue < 0) {
                                                                                setCantidadesModal(prev => ({...prev, [product.sku]: 0}))
                                                                                return
                                                                            }
                                                                            
                                                                            const stockRestante = product.stockDisponible - cantidadEnCotizacion
                                                                            const newCantidad = Math.min(numericValue, stockRestante)
                                                                            setCantidadesModal(prev => ({...prev, [product.sku]: newCantidad}))
                                                                        }}
                                                                        min="0"
                                                                        max={product.stockDisponible - cantidadEnCotizacion}
                                                                        className="w-12 h-8 text-center border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                                        style={{
                                                                            appearance: 'textfield',
                                                                            MozAppearance: 'textfield'
                                                                        }}
                                                                        onWheel={(e) => e.currentTarget.blur()}
                                                                    />
                                                                    
                                                                    <Button
                                                                        onClick={() => {
                                                                            const stockRestante = product.stockDisponible - cantidadEnCotizacion
                                                                            if (cantidad >= stockRestante) {
                                                                                return
                                                                            }                        
                                                                            const newCantidad = Math.min(stockRestante, cantidad + 1)
                                                                            setCantidadesModal(prev => ({...prev, [product.sku]: newCantidad}))
                                                                            if (errorSeleccion) setErrorSeleccion('')
                                                                        }}
                                                                        className={"bg-gray-200 hover:bg-gray-300 text-gray-700 w-8 h-8 rounded text-sm font-bold cursor-pointer"}
                                                                        label="+"
                                                                    />
                                                                </div>
                                                                
                                                                {yaEstaEnCotizacion && (
                                                                    <div className="text-xs text-blue-600 mt-1">
                                                                        Ya en cotización: {cantidadEnCotizacion}
                                                                    </div>
                                                                )}
                                                            </td>
                                                            <td className="border border-gray-300 px-3 py-2">
                                                                <div className="flex justify-center">
                                                                    {yaEstaEnCotizacion && (
                                                                        <button 
                                                                            className="w-8 h-8 bg-red-500 text-white rounded text-sm font-bold cursor-pointer hover:bg-red-600 flex items-center justify-center"
                                                                            onClick={() => onEliminarProducto(product.sku, sucursalSeleccionada!)}
                                                                            title="Eliminar de cotización"
                                                                        >
                                                                            ✕
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                )}

                                {/* Mensaje de error */}
                                {errorSeleccion && (
                                    <div className="mt-2 text-red-500 text-sm">
                                        {errorSeleccion}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </ModalBody>

            <ModalFooter>

                <Button onClick={handleClose}
                    className={"px-6 py-3 border-2 border-gray-400 text-white bg-transparent rounded-lg hover:bg-[#15295C] transition-colors font-semibold cursor-pointer"}
                    label="Cancelar"
                />

                <Button onClick={handleGuardar}
                    className={"px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-semibold cursor-pointer"}
                    label="Guardar"
                />

            </ModalFooter>
        </Modal>
    );
}