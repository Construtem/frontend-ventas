'use client'
import React, { useState } from 'react'
import { ProductoModal } from '@/components/Modal/ProductoModal'
import Button from '@/components/Button'
import { useCotizacionFlow } from '@/contexts/CotizacionFlow'
import NumberIcon from '@/components/NumberIcon'
import { TiDelete } from 'react-icons/ti'
import type { DraftProducto } from '@/services/apiServices'

const ProductTable: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const { state, dispatch } = useCotizacionFlow()

    const cotizacion = state.cotizacionSeleccionada
    const cotizacionYaGuardada = !!cotizacion && !!cotizacion.id && cotizacion.id > 0 && !!cotizacion.total
    const cotizacionNoEstaGuardada = !cotizacionYaGuardada

    // Prepara el arreglo de productos en ambos casos
    const productos: DraftProducto[] = cotizacionYaGuardada && cotizacion.items?.length
        ? cotizacion.items.map((item, index) => {
            const descuento = item.descuento ?? 0
            const precioUnit = item.precio_unitario
            const netoUnit = precioUnit - (precioUnit * descuento / 100)
            const total = netoUnit * item.cantidad

            return {
                sku: item.sku,
                nombre: item.nombre,
                precioUnit,
                descuento,
                cantidad: item.cantidad,
                origen: item.sucursal,
                sucursalId: index,
                netoUnit,
                total
            }
        })
        : state.productos

    // Decide si mostramos la columna Eliminar
    const showEliminarColumn = cotizacionNoEstaGuardada && productos.length > 0

    const formatCurrency = (amount: number): string =>
        amount.toLocaleString('es-CL', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        })
    const cotizacionEsDraftConfirmada =
        !!cotizacion &&
        Number(cotizacion.id) < 0 &&
        cotizacion.estado === 'pendiente' &&
        cotizacion.total === 0;

    return (
        <>
            <div className="bg-white p-4 rounded-[10px] w-full shadow-[0_0_2px_rgba(0,0,0,0.25)]">
                {/* Header */}
                <div
                    className="mb-9 flex flex-col gap-[20px] sm:items-baseline items-center"
                    data-tour="add-product-button"
                >
                    <div className="flex items-center gap-2">
                        <NumberIcon number={3} />
                        <h2 className="text-xl font-semibold text-black font-montserrat text-[24px]">
                            Productos
                        </h2>
                    </div>

                    {cotizacionEsDraftConfirmada && (
                        <Button
                            label="Agregar Producto"
                            className="bg-[#084AB9] hover:bg-[#0A4CC1] text-white font-montserrat text-[18px] px-4 py-2 rounded"
                            onClick={() => setIsModalOpen(true)}
                        />
                    )}
                </div>

                {/* Tabla de productos */}
                <div className="mb-4">
                    <div className="overflow-x-auto max-h-72">
                        <div className="rounded-[10px] shadow-[0_0_2px_rgba(0,0,0,0.25)] border-b-[2px] border-gray-200">
                            <table className="w-full text-sm rounded-[10px] shadow-[0_0_2px_rgba(0,0,0,0.25)] border-b-[2px] border-gray-200 overflow-hidden">
                                <thead>
                                <tr className="text-left font-semibold text-gray-700 border-b border-gray-200 bg-gray-100">
                                    <th className="border border-gray-300 px-3 py-2 text-center">SKU</th>
                                    <th className="border border-gray-300 px-3 py-2 text-left">Nombre</th>
                                    <th className="border border-gray-300 px-3 py-2 text-center">Precio</th>
                                    <th className="border border-gray-300 px-3 py-2 text-center">Descuento</th>
                                    <th className="border border-gray-300 px-3 py-2 text-center">Cantidad</th>
                                    <th className="border border-gray-300 px-3 py-2 text-center">Sucursal</th>
                                    <th className="border border-gray-300 px-3 py-2 text-center">Total</th>
                                    {showEliminarColumn && (
                                        <th className="border border-gray-300 px-3 py-2 text-center">Eliminar</th>
                                    )}
                                </tr>
                                </thead>
                                <tbody>
                                {productos.map((row, index) => (
                                    <tr key={`${row.sku}-${index}`}>
                                        <td className="text-center text-[18px] font-montserrat border border-gray-200 p-[10px]">
                                            {row.sku}
                                        </td>
                                        <td className="text-left text-[18px] font-montserrat border border-gray-200 p-[10px]">
                                            {row.nombre}
                                        </td>
                                        <td className="text-center text-[18px] font-montserrat border border-gray-200 p-[10px]">
                                            ${formatCurrency(row.precioUnit)}
                                        </td>
                                        <td className="text-center text-[18px] font-montserrat border border-gray-200 p-[10px]">
                                            {row.descuento > 0 ? (
                                                <span className="text-green-600 font-semibold">-{row.descuento}%</span>
                                            ) : (
                                                <span className="text-gray-400">Sin descuento</span>
                                            )}
                                        </td>
                                        <td className="text-center text-[18px] font-montserrat border border-gray-200 p-[10px]">
                                            {row.cantidad}
                                        </td>
                                        <td className="text-center text-[18px] font-montserrat border border-gray-200 p-[10px]">
                                            {row.origen}
                                        </td>
                                        <td className="text-center text-[18px] font-montserrat border border-gray-200 p-[10px]">
                                            ${formatCurrency(row.total)}
                                        </td>
                                        {showEliminarColumn && (
                                            <td className="text-center text-[18px] font-montserrat border border-gray-200 p-[10px]">
                                                <button
                                                    className="text-red-600 hover:text-red-800 cursor-pointer focus:outline-none px-[5px] py-[5px]"
                                                    onClick={() =>
                                                        dispatch({ type: 'REMOVE_PRODUCT', payload: row })
                                                    }
                                                >
                                                    <TiDelete size={25} />
                                                </button>
                                            </td>
                                        )}
                                    </tr>
                                ))}

                                {productos.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={7 + (showEliminarColumn ? 1 : 0)}
                                            className="border border-gray-300 px-3 py-2 text-center text-gray-500"
                                        >
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

            {/* Modal de producto */}
            <ProductoModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </>
    )
}

export default ProductTable
