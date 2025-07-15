// components/Cotizacion.tsx
'use client'

import { useState, useEffect } from 'react'
import { cotizacionService } from '@/services/apiService'
import type { CotizacionSimplificada } from '@/services/apiService'

export default function Cotizacion({ id }: { id: number }) {
    const [cot, setCot] = useState<CotizacionSimplificada | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        cotizacionService
            .obtenerCotizacionSimplificada(id)    // llamamos al service
            .then((data) => setCot(data))
            .catch((err) => {
                console.error(err)
                setError(err.message)
            })
            .finally(() => setLoading(false))
    }, [])

    if (loading) {
        return <div className="p-4">Cargando cotización…</div>
    }
    if (error) {
        return <div className="p-4 text-red-600">Error: {error}</div>
    }
    if (!cot) {
        return <div className="p-4">No se encontró la cotización.</div>
    }

    // TS ya sabe que `cot` no es null y es CotizacionSimplificada
    const {
        fecha_crea,
        estado,
        costo_envio,
        tipo_despacho,
        descripcion,
        cliente,
    } = cot

    return (
        <div className="mb-4 ml-7 bg-white border border-gray-300 rounded-lg w-[770px]">
            <div className="p-8">
                {/* Encabezado */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg text-[#5B83C5] font-bold">
                        Cotización #{id}
                    </h2>
                    <button
                        className={`px-3 py-1 font-bold rounded ${
                            estado === 'Aprobada'
                                ? 'bg-green-100 text-green-800'
                                : estado === 'Rechazada'
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-yellow-100 text-yellow-800'
                        }`}
                    >
                        {estado}
                    </button>
                </div>

                {/* Datos generales */}
                <table className="w-full text-left border-collapse">
                    <tbody>
                    <tr>
                        <th className="border-t border-[#D1D5DC] p-2">Fecha creación</th>
                        <td className="border-t border-[#D1D5DC] p-2">{fecha_crea}</td>
                    </tr>
                    <tr>
                        <th className="border-t border-[#D1D5DC] p-2">Cliente</th>
                        <td className="border-t border-[#D1D5DC] p-2">{cliente.nombre}</td>
                    </tr>
                    <tr>
                        <th className="border-t border-[#D1D5DC] p-2">Email</th>
                        <td className="border-t border-[#D1D5DC] p-2">{cliente.email}</td>
                    </tr>
                    <tr>
                        <th className="border-t border-[#D1D5DC] p-2">Teléfono</th>
                        <td className="border-t border-[#D1D5DC] p-2">{cliente.telefono}</td>
                    </tr>
                    <tr>
                        <th className="border-t border-[#D1D5DC] p-2">Descripción</th>
                        <td className="border-t border-[#D1D5DC] p-2">
                            {descripcion || '—'}
                        </td>
                    </tr>
                    <tr>
                        <th className="border-t border-[#D1D5DC] p-2">Tipo envío</th>
                        <td className="border-t border-[#D1D5DC] p-2">{tipo_despacho}</td>
                    </tr>
                    <tr>
                        <th className="border-t border-[#D1D5DC] p-2">Costo envío</th>
                        <td className="border-t border-[#D1D5DC] p-2">${costo_envio}</td>
                    </tr>
                    </tbody>
                </table>

                {/* Botón editar */}
                <div className="mt-7 flex justify-end">
                    <button
                        className="px-3 py-1 font-bold text-white rounded bg-[#2563B6] hover:bg-[#1F5399]"
                        onClick={() => {
                            /* navegar a editar… */
                        }}
                    >
                        Editar información
                    </button>
                </div>
            </div>
        </div>
    )
}
