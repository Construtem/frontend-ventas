'use client'
import React from 'react'
import { useQuotationHistory } from '../hooks/useQuotationHistory'

interface QuotationHistoryTableProps {
    quotationId: string
}

const QuotationHistoryTable: React.FC<QuotationHistoryTableProps> = ({ quotationId }) => {
    const { history, loading, error, refetch } = useQuotationHistory({ 
        quotationId, 
        useMockData: true // Cambiar a false cuando la API esté lista
    })

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('es-CL', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        })
    }

    const getStatusColor = (action: string) => {
        switch (action) {
            case 'Creada':
                return 'bg-green-100 text-green-800'
            case 'Cambio de estado':
                return 'bg-blue-100 text-blue-800'
            case 'Modificación de detalle':
                return 'bg-orange-100 text-orange-800'
            default:
                return 'bg-gray-100 text-gray-800'
        }
    }

    const getStatus = (action: string) => {
        switch (action) {
            case 'Creada':
                return 'Pendiente'
            case 'Cambio de estado':
                return 'Aprobada'
            case 'Modificación de detalle':
                return 'Pendiente'
            default:
                return 'Sin estado'
        }
    }

    return (
        <div className="bg-white border border-gray-300 p-4 max-w-7xl mx-auto mt-6">
            {/* Header */}
            <div className="mb-4">
                <h2 className="text-lg font-bold text-black">Historial</h2>
            </div>

            {/* Content */}
            <div className="max-h-96 overflow-y-auto">
                {loading ? (
                    <div className="text-center py-8 text-gray-500">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                        <p>Cargando historial...</p>
                    </div>
                ) : error ? (
                    <div className="text-center py-8 text-red-500">
                        <div className="text-4xl mb-4">⚠️</div>
                        <p className="mb-4">Error al cargar el historial: {error}</p>
                        <button
                            onClick={refetch}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Reintentar
                        </button>
                    </div>
                ) : history.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        <div className="text-4xl mb-4">📋</div>
                        <p>No hay historial disponible para esta cotización</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full border border-gray-400 text-xs">
                            <thead>
                                <tr style={{background:'#fff'}}>
                                    <th className="border border-gray-400 px-2 py-2 text-left">N° interno</th>
                                    <th className="border border-gray-400 px-2 py-2 text-left">Fecha</th>
                                    <th className="border border-gray-400 px-2 py-2 text-left">Nombre</th>
                                    <th className="border border-gray-400 px-2 py-2 text-left">Evento</th>
                                    <th className="border border-gray-400 px-2 py-2 text-left">Cantidad/Producto</th>
                                    <th className="border border-gray-400 px-2 py-2 text-left">Total</th>
                                    <th className="border border-gray-400 px-2 py-2 text-left">Estado</th>
                                    <th className="border border-gray-400 px-2 py-2 text-center">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {history.map((item) => (
                                    <tr key={item.id} style={{background: '#fff2e8'}}>
                                        <td className="border border-gray-300 px-2 py-2">{item.id}</td>
                                        <td className="border border-gray-300 px-2 py-2">
                                            {formatDate(item.fecha)}
                                        </td>
                                        <td className="border border-gray-300 px-2 py-2">
                                            {item.usuario?.nombre || 'Sistema'}
                                        </td>
                                        <td className="border border-gray-300 px-2 py-2">
                                            <div className="flex flex-col">
                                                <span className="font-medium">{item.accion}</span>
                                                {item.detalles && (
                                                    <span className="text-gray-600 text-xs">{item.detalles}</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="border border-gray-300 px-2 py-2">
                                            {item.accion === 'Modificación de detalle' ? '2x' : '-'}
                                        </td>
                                        <td className="border border-gray-300 px-2 py-2">
                                            {item.accion === 'Modificación de detalle' ? '120.000' : '-'}
                                        </td>
                                        <td className="border border-gray-300 px-2 py-2">
                                            <span className={`px-2 py-1 rounded text-xs ${getStatusColor(item.accion)}`}>
                                                {getStatus(item.accion)}
                                            </span>
                                        </td>
                                        <td className="border border-gray-300 px-2 py-2 text-center">
                                            <div className="flex items-center justify-center gap-1">
                                                <button
                                                    className="w-5 h-5 bg-blue-100 border border-blue-300 flex items-center justify-center text-blue-600 hover:bg-blue-200"
                                                    title="Ver detalles"
                                                >
                                                    🔍
                                                </button>
                                                <button
                                                    className="w-5 h-5 bg-red-100 border border-red-300 flex items-center justify-center text-red-600 hover:bg-red-200"
                                                    title="Eliminar"
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}

export default QuotationHistoryTable
