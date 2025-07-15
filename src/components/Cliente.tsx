'use client'

import { FaSearch } from 'react-icons/fa'
import { useEffect, useState } from 'react'

export default function Cliente() {
    const apiVentasUrl =
        process.env.NEXT_PUBLIC_API_VENTAS || 'https://api-ventas.tssw.cl'

    // Control de modal de historial
    const [mostrarModalHis, setMostrarModalHis] = useState(false)
    // Lista y búsqueda
    const [cotizaciones, setCotizaciones] = useState<Cotizacion[]>([])
    const [busqueda, setBusqueda] = useState('')

    // Aquí pones el rut del cliente que ya seleccionaste antes
    const rutClienteSeleccionado = '12.345.678-9'

    interface Cotizacion {
        id: number
        fecha_crea: string
        estado: 'aprobada' | 'rechazada' | 'pendiente' | string
        costo_envio: number
        user_id: string
        nombre: string
        tipo_despacho: string
        descripcion: null
        cliente: {
            nombre: string
            telefono: string
            email: string
            rut: string
            razon_social: string
        }
        items: null
        total_items: number
        total_precio: number
    }

    // Al abrir el modal de historial, traigo las cotizaciones de ese cliente
    useEffect(() => {
        if (mostrarModalHis) {
            fetch(
                `${apiVentasUrl}/api/cotizaciones?rut_cliente=${encodeURIComponent(
                    rutClienteSeleccionado
                )}`
            )
                .then((res) => {
                    if (!res.ok) throw new Error(`HTTP ${res.status}`)
                    return res.json()
                })
                .then((data: Cotizacion[]) => {
                    setCotizaciones(data)
                })
                .catch((error) => console.error('Error fetching historial:', error))
        }
    }, [mostrarModalHis, rutClienteSeleccionado, apiVentasUrl])

    // Filtrado local (en el modal)
    const cotizacionesFiltradas = cotizaciones.filter((coti) => {
        const term = busqueda.toLowerCase()
        return (
            coti.cliente.nombre.toLowerCase().includes(term) ||
            coti.cliente.rut.toLowerCase().includes(term)
        )
    })

    return (
        <div className="bg-white border border-gray-300 p-4 mx-auto rounded-lg w-[500px] ml-30 mb-4">
            {/* ====== SECCIÓN QUE MANTUVISTE ====== */}
            <h2 className="text-2xl font-bold mb-2">Seleccionar cliente</h2>

            <div className="flex items-center mb-4">
                <div className="relative flex-1">
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#949494]" />
                    <input
                        type="text"
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        placeholder="Buscar"
                        className="w-full pl-10 pr-3 py-1 border rounded-sm border-[#DFDFDF]"
                    />
                </div>
                <button
                    className="ml-2 w-7 h-7 flex items-center justify-center text-white bg-[#4CAF50] rounded-full hover:bg-[#3E8F41]"
                    onClick={() => {/* tu lógica para añadir cliente */}}
                >
                    +
                </button>
            </div>

            <div className="mb-2 font-bold">Nombre Cliente</div>
            <div className="mb-4 text-base">
                Rut {rutClienteSeleccionado} Tipo cliente Correo@gmail.com
            </div>

            <div className="flex gap-2">
                <button
                    className="px-3 py-1 bg-[#F59243] text-white rounded hover:bg-[#E6893F]"
                    onClick={() => setMostrarModalHis(true)}
                >
                    Ver historial
                </button>
                <button
                    disabled
                    className="px-3 py-1 bg-[#2563B6] text-white rounded opacity-50 cursor-not-allowed"
                >
                    Ver detalle
                </button>
            </div>
            {/* ===================================== */}

            {/* ====== MODAL HISTORIAL ====== */}
            {mostrarModalHis && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
                    <div className="bg-[#0B1631] p-8 rounded-lg w-[900px] max-h-[80vh] overflow-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl text-white font-semibold">Cotizaciones</h2>
                            <button
                                className="text-white text-xl"
                                onClick={() => setMostrarModalHis(false)}
                            >
                                ✕
                            </button>
                        </div>

                        {/* Buscador dentro del modal */}
                        <div className="relative mb-4">
                            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#949494]" />
                            <input
                                type="text"
                                value={busqueda}
                                onChange={(e) => setBusqueda(e.target.value)}
                                placeholder="Buscar..."
                                className="w-full pl-10 pr-3 py-1 border rounded-sm bg-white border-[#DFDFDF]"
                            />
                        </div>

                        {/* Tabla de historial */}
                        <table className="w-full text-left border border-gray-300 rounded-md bg-white">
                            <thead>
                            <tr className="text-center bg-gray-100">
                                <th className="p-2">ID</th>
                                <th className="p-2">Cliente</th>
                                <th className="p-2">Fecha</th>
                                <th className="p-2">Cantidad</th>
                                <th className="p-2">Total</th>
                                <th className="p-2">Estado</th>
                                <th className="p-2">Acción</th>
                            </tr>
                            </thead>
                            <tbody>
                            {cotizacionesFiltradas.map((coti) => (
                                <tr key={coti.id} className="text-center bg-white">
                                    <td className="p-2">{coti.id}</td>
                                    <td className="p-2">{coti.cliente.nombre}</td>
                                    <td className="p-2">{coti.fecha_crea}</td>
                                    <td className="p-2">{coti.total_items}</td>
                                    <td className="p-2">${coti.total_precio}</td>
                                    <td className="p-2">{coti.estado}</td>
                                    <td className="p-2">
                                        {/* Aquí podrías poner otro botón, o dejar vacío */}
                                    </td>
                                </tr>
                            ))}
                            {cotizacionesFiltradas.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="p-4 text-center">
                                        No hay cotizaciones para este cliente.
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>

                        <div className="flex justify-end mt-4">
                            <button
                                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                                onClick={() => setMostrarModalHis(false)}
                            >
                                Salir
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* ============================== */}
        </div>
    )
}
