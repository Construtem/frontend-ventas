'use client'
import React, { useState } from 'react'
import { useSucursales } from '@/hooks/useSucursales'
import {ProductoModal}  from '@/components/Modal/ProductoModal'
import Button from "@/components/Button";
import {useCotizacionFlow} from "@/contexts/CotizacionFlow";

interface ProductTableProps {
    quotationId?: string
}

/*

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

 */

const ProductTable: React.FC<ProductTableProps> = () => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    // Cargar sucursales
    const { sucursales, error: errorSucursales } = useSucursales()

    // Función para formatear moneda
    const formatCurrency = (amount: number): string => {
        return amount.toLocaleString('es-CL', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        })
    }
    const { state } = useCotizacionFlow()
    const productosEnCotizacion = state.productos       // ← vienen del contexto

    // Función para agregar múltiples productos desde el modal
    /*
    const handleAgregarProductos = (productos: { producto: Product, cantidad: number, sucursalId: number }[]) => {
        productos.forEach(({ producto, cantidad, sucursalId }) => {
            const productoExistente = productosEnCotizacion.find(p =>
                p.sku === producto.sku && p.sucursalId === sucursalId
            )

            if (productoExistente) {
                const nuevaCantidadTotal = productoExistente.cantidad + cantidad

                if (nuevaCantidadTotal > producto.stockDisponible) {
                    alert(`No puedes agregar más productos. Stock disponible: ${producto.stockDisponible}, ya tienes: ${productoExistente.cantidad}`)
                    return
                }

                setProductosEnCotizacion(prev =>
                    prev.map(p =>
                        p.sku === producto.sku && p.sucursalId === sucursalId
                            ? { ...p, cantidad: nuevaCantidadTotal }
                            : p
                    )
                )
            } else {
                if (cantidad > producto.stockDisponible) {
                    alert(`No puedes agregar ${cantidad} productos. Stock disponible: ${producto.stockDisponible}`)
                    return
                }

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
                    sucursalId: sucursalId
                }
                setProductosEnCotizacion(prev => [...prev, nuevoProducto])
            }
        })
    }*/
    // Función para eliminar producto de la cotización
    // const handleEliminarProducto = (sku: string, sucursalId: number): void => {
    //     setProductosEnCotizacion(prev =>
    //         prev.filter(p => !(p.sku === sku && p.sucursalId === sucursalId))
    //     )
    // }

    return (
        <>
            <div className="bg-white  p-4 rounded-[10px] w-full
                      shadow-[0_0_2px_rgba(0,0,0,0.25)] ">

                {/* Header */}
                <div className="mb-9 flex flex-col gap-[20px] sm:items-baseline items-center ">
                    <div className="flex items-center gap-2">
                        <h2 className="text-xl font-semibold text-black font-montserrat text-[24px]">
                            Productos
                        </h2>
                    </div>
                    <div>
                        <Button
                            label="Agregar Producto"
                            className="bg-[#084AB9] hover:bg-[#0A4CC1] text-white font-montserrat text-[18px] px-4 py-2 rounded"
                            onClick={() => setIsModalOpen(true)}
                        />
                    </div>
                </div>

                {/* Tabla de productos */}
                <div className="mb-4">
                    <div className="overflow-x-auto max-h-72">
                        <div className="rounded-[10px]  shadow-[0_0_2px_rgba(0,0,0,0.25)] border-b-[2px] border-gray-200">
                        <table className="w-full text-sm rounded-[10px]  shadow-[0_0_2px_rgba(0,0,0,0.25)] border-b-[2px] border-gray-200 overflow-hidden">
                            <thead>
                                <tr className="text-left font-semibold text-gray-700 border-b border-gray-200 bg-gray-100" style={{background:'#F4F5F9'}}>
                                    <th className="border border-gray-300 px-3 py-2 text-center">SKU</th>
                                    <th className="border border-gray-300 px-3 py-2 text-left">Nombre</th>
                                    <th className="border border-gray-300 px-3 py-2 text-center">Precio</th>
                                    <th className="border border-gray-300 px-3 py-2 text-center">Descuento</th>
                                    <th className="border border-gray-300 px-3 py-2 text-center">Cantidad</th>
                                    <th className="border border-gray-300 px-3 py-2 text-center">Sucursal</th>
                                    <th className="border border-gray-300 px-3 py-2 text-center">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {productosEnCotizacion.map((row, index) => {
                                    const descuentoDelStock = row.descuento || 0
                                    const precioConDescuento = row.precioUnit - (descuentoDelStock / 100 * row.precioUnit)
                                    const total = precioConDescuento * row.cantidad
                                    const sucursalNombre = sucursales.find(s => s.id === row.sucursalId)?.nombre || row.origen
                                    
                                    return (
                                        <tr key={`${row.sku}-${row.sucursalId}-${index}`} className="">
                                             <td className={'text-center text-[18px] font-montserrat border-[1px] border-gray-200 p-[10px] '}>{row.sku}</td>
                                             <td className={'text-left text-[18px] font-montserrat border-[1px] border-gray-200 p-[10px] '}>{row.nombre}</td>
                                             <td className={'text-center text-[18px] font-montserrat border-[1px] border-gray-200 p-[10px] '}>${formatCurrency(row.precioUnit)}</td>
                                             <td className={'text-center text-[18px] font-montserrat border-[1px] border-gray-200 p-[10px] '}>
                                                {descuentoDelStock > 0 ? (
                                                    <span className="text-green-600 font-semibold">
                                                        -{formatCurrency(descuentoDelStock)}%
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-400">Sin descuento</span>
                                                )}
                                            </td>
                                             <td className={'text-center text-[18px] font-montserrat border-b-[1px] border-x-[1px] border-gray-200 p-[10px] '}>{row.cantidad}</td>
                                             <td className={'text-center text-[18px] font-montserrat border-b-[1px] border-x-[1px] border-gray-200 p-[10px] '}>{sucursalNombre}</td>
                                            <td className="border border-gray-300 px-3 py-2 font-semibold text-center">
                                                ${formatCurrency(total)}
                                            </td>
                                        </tr>
                                    )
                                })}
                                {productosEnCotizacion.length === 0 && (
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
            </div>

            {/* Modal usando la nueva estructura */}
            <ProductoModal
                isOpen={isModalOpen}
                onClose={() => {
                    console.log('los productos son ', state.sucursalId)
                    setIsModalOpen(false)
                }}
            />
        </>
    )
}

export default ProductTable