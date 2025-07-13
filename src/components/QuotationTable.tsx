'use client'
import React, { useState, useEffect } from 'react'
import { quotations, quotationItems, products, Product, QuotationItem } from '@/mocks/mocksDatos'

interface QuotationTableProps {
    quotationId?: string
}

interface TableDataItem extends QuotationItem, Product {}

const QuotationTable: React.FC<QuotationTableProps> = ({ quotationId = 'q1' }) => {
    const [data, setData] = useState<TableDataItem[]>([])
    const [loading, setLoading] = useState(false)
    
    // Obtener la cotización específica
    const quotation = quotations.find(q => q.id === quotationId)
    const items = quotationItems.filter(item => item.quotationId === quotationId)

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                // Crear datos de la tabla combinando items con productos
                const tableData = items.map((item: QuotationItem) => {
                    const product = products.find(p => p.sku === item.sku)
                    return {
                        ...item,
                        ...product
                    } as TableDataItem
                })
                setData(tableData)
            } catch {
                console.error('Error loading data')
            } finally {
                setLoading(false)
            }
        }
        
        fetchData()
    }, [quotationId, items])

    const handleSave = async (item: TableDataItem) => {
        try {
            // Simular guardado
            await new Promise(resolve => setTimeout(resolve, 1000))
            console.log('Saved item:', item)
        } catch {
            console.error('Error saving')
        }
    }

    if (!quotation) {
        return <div>Cotización no encontrada</div>
    }

    if (loading) {
        return <div>Cargando...</div>
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-CL', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount)
    }

    return (
        <div className="bg-white border border-gray-300 p-4 max-w-5xl mx-auto rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-black mb-4">Cotización {quotation.nombre}</h2>
            
            <div className="overflow-x-auto">
                <table className="w-full text-xs border-collapse">
                    <thead>
                        <tr style={{background:'#F4F5F9'}}>
                            <th className="border border-gray-300 px-3 py-2 text-left">SKU</th>
                            <th className="border border-gray-300 px-3 py-2 text-left">Nombre</th>
                            <th className="border border-gray-300 px-3 py-2 text-left">Cantidad</th>
                            <th className="border border-gray-300 px-3 py-2 text-left">Precio</th>
                            <th className="border border-gray-300 px-3 py-2 text-left">Total</th>
                            <th className="border border-gray-300 px-3 py-2 text-left">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row: TableDataItem) => (
                            <tr key={row.id}>
                                <td className="border border-gray-300 px-3 py-2">{row.sku}</td>
                                <td className="border border-gray-300 px-3 py-2">{row.nombre || ''}</td>
                                <td className="border border-gray-300 px-3 py-2">{row.cantidad}</td>
                                <td className="border border-gray-300 px-3 py-2">{formatCurrency(row.precio || 0)}</td>
                                <td className="border border-gray-300 px-3 py-2">{formatCurrency(row.mejorPrecio)}</td>
                                <td className="border border-gray-300 px-3 py-2">
                                    <button 
                                        onClick={() => handleSave(row)}
                                        className="bg-blue-500 text-white px-2 py-1 rounded text-xs"
                                    >
                                        Guardar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default QuotationTable