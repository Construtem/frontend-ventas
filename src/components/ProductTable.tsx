'use client'
import React from 'react'
import { quotations, quotationItems, products } from '@/mocks/mocksDatos'

interface ProductTableProps {
    quotationId?: string
}

const ProductTable: React.FC<ProductTableProps> = ({ quotationId = 'q1' }) => {
    // Obtener la cotización específica para los datos de totales
    const quotation = quotations.find(q => q.id === quotationId)
    const items = quotationItems.filter(item => item.quotationId === quotationId)

    if (!quotation) {
        return <div>Productos no encontrados</div>
    }

    // Crear datos de la tabla combinando items con productos
    const tableData = items.map(item => {
        const product = products.find(p => p.sku === item.sku)
        return {
            ...item,
            ...product
        }
    })

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-CL', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount)
    }

    return (
        <div className="bg-white border border-gray-300 p-4 max-w-5xl mx-auto rounded-lg shadow-md">
            {/* Header */}
            <div className="mb-9">
                <div className="flex items-center gap-2 mb-2">
                    <h2 className="text-xl font-bold text-black">Productos</h2>
                </div>
                <div>
                    <button
                        className="flex items-center justify-center cursor-pointer"
                        style={{fontWeight: 'bold', fontSize: '18px', color: '#084AB9'}}
                        title="Agregar producto"
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
                            {tableData.map((row) => (
                                <tr key={row.id} className="">
                                    <td className="border border-gray-300 px-3 py-2">{row.sku}</td>
                                    <td className="border border-gray-300 px-3 py-2">{row.nombre || ''}</td>
                                    <td className="border border-gray-300 px-3 py-2">{row.descripcion || ''}</td>
                                    <td className="border border-gray-300 px-3 py-2">{formatCurrency(row.precio || 0)}</td>
                                    <td className="border border-gray-300 px-3 py-2">{row.descuento > 0 ? `${((row.descuento / row.calculado) * 100).toFixed(1)}%` : '0%'}</td>
                                    <td className="border border-gray-300 px-3 py-2">{row.cantidad}</td>
                                    <td className="border border-gray-300 px-3 py-2">{formatCurrency(row.mejorPrecio)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Botón Confirmar Productos */}
            <div className="flex justify-end mt-4">
                <button 
                    className="text-white py-2 px-2 text-sm font-bold rounded cursor-pointer hover:bg-blue-700 transition-colors"
                    style={{background:'#2563B6'}}
                    onClick={() => console.log('Productos confirmados')}
                >
                   Confirmar Productos
                </button>
            </div>

        </div>
    )
}

export default ProductTable