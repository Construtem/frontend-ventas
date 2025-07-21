'use client'
import React, { useState } from 'react'
import { useSucursales } from '@/hooks/useSucursales'
import {ProductoModal}  from '@/components/Modal/ProductoModal'
import Button from "@/components/Button";
import {useCotizacionFlow} from "@/contexts/CotizacionFlow";
import NumberIcon from "@/components/NumberIcon";
import { TiDelete } from "react-icons/ti";

interface ProductTableProps {
    quotationId?: string
}

const ProductTable: React.FC<ProductTableProps> = () => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    // Cargar sucursales
    const { sucursales } = useSucursales()
    const { dispatch} = useCotizacionFlow()
    // Función para formatear moneda
    const formatCurrency = (amount: number): string => {
        return amount.toLocaleString('es-CL', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        })
    }
    const { state } = useCotizacionFlow()
    const productosEnCotizacion = state.productos       // ← vienen del contexto

    return (
        <>
            <div className="bg-white  p-4 rounded-[10px] w-full
                      shadow-[0_0_2px_rgba(0,0,0,0.25)] ">

                {/* Header */}
                <div className="mb-9 flex flex-col gap-[20px] sm:items-baseline items-center ">
                    <div className="flex items-center gap-2">
                        <NumberIcon number={3}/>
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
                            <tr className="text-left font-semibold text-gray-700 border-b border-gray-200 bg-gray-100"
                                style={{background: '#F4F5F9'}}>
                                <th className="border border-gray-300 px-3 py-2 text-center">SKU</th>
                                <th className="border border-gray-300 px-3 py-2 text-left">Nombre</th>
                                <th className="border border-gray-300 px-3 py-2 text-center">Precio</th>
                                <th className="border border-gray-300 px-3 py-2 text-center">Descuento</th>
                                <th className="border border-gray-300 px-3 py-2 text-center">Cantidad</th>
                                <th className="border border-gray-300 px-3 py-2 text-center">Sucursal</th>
                                <th className="border border-gray-300 px-3 py-2 text-center">Total</th>
                                <th className="border border-gray-300 px-3 py-2 text-center">Eliminar</th>
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
                                            <td className={'text-center text-[18px] font-montserrat border-b-[1px] border-x-[1px] border-gray-200 p-[10px] '}>
                                                <button
                                                    className="text-red-600 hover:text-red-800 cursor-pointer focus:outline-none px-[5px] py-[5px]"
                                                    onClick={() => dispatch({
                                                        type: 'REMOVE_PRODUCT',
                                                        payload: {
                                                            sku: row.sku,
                                                            sucursalId: row.sucursalId,
                                                            origen: row.origen,
                                                            nombre: row.nombre,
                                                            cantidad: row.cantidad,
                                                            precioUnit: row.precioUnit,
                                                            descuento: row.descuento,
                                                            netoUnit: row.netoUnit,
                                                            total: row.total,
                                                        }
                                                    })}
                                                >
                                                    <TiDelete size={25} />
                                                </button>
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