'use client'

import { useState } from 'react'
import { ModalHeader, ModalBody, ModalFooter } from '@/components/Modal/ModalsParts'
import Button from '@/components/Button'
import Modal from '@/components/Modal/Modal'
import type { DBCliente as ClienteType, DBCotizacion } from '@/services/apiServices'
import { clienteService } from '@/services/apiServices'
import { useQuery } from '@tanstack/react-query'
import Loader from '@/components/Loader'

type Props = {
    isOpen: boolean
    onClose: () => void
    data: ClienteType
}

export default function ClienteDetalleModal({ isOpen, onClose, data }: Props) {
    // — Hook de React Query para historial
    const { data: historial = [], isLoading } = useQuery<DBCotizacion[]>({
        queryKey: ['historialCotizaciones', data.rut],
        queryFn: () => clienteService.obtenerHistorialCotizaciones(data.rut),
        enabled: isOpen && !!data.rut,
    })

    // — Estados para paginación
    const [paginaActual, setPaginaActual] = useState(1)
    const porPagina = 5
    const totalPaginas = Math.ceil(historial.length / porPagina)

    // — Cotizaciones a mostrar en la página actual
    const historialPaginado = historial.slice(
        (paginaActual - 1) * porPagina,
        paginaActual * porPagina
    )

    // — Early return si el modal está cerrado
    if (!isOpen) return null

    // — Desestructuro datos del cliente
    const { nombre, rut, email, telefono, razon_social } = data

    // — Helpers de formato
    const formatDate = (s: string) => new Date(s).toLocaleDateString('es-CL')
    const formatCurrency = (n: number) => `$${n.toLocaleString('es-CL')}`

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="w-[800px]">
            <ModalHeader title={`Cliente: ${nombre}`} onClose={onClose} />

            <ModalBody className="min-h-[455px]">
                {/* ===== Tabla datos del cliente ===== */}
                <div className="rounded-[10px] border border-gray-200 overflow-hidden mb-6">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-2 font-semibold">Nombre</th>
                            <th className="px-4 py-2 font-semibold">RUT</th>
                            <th className="px-4 py-2 font-semibold">Razón social</th>
                            <th className="px-4 py-2 font-semibold">Email</th>
                            <th className="px-4 py-2 font-semibold">Teléfono</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr className="bg-white">
                            <td className="px-4 py-2">{nombre}</td>
                            <td className="px-4 py-2">{rut}</td>
                            <td className="px-4 py-2">{razon_social}</td>
                            <td className="px-4 py-2">{email ?? '—'}</td>
                            <td className="px-4 py-2">{telefono ?? '—'}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>

                {/* ===== Historial de cotizaciones ===== */}
                <h2 className="text-lg font-semibold mb-2">Cotizaciones creadas</h2>

                {isLoading ? (
                    <Loader label={'Cotizaciones'}/>
                ) : historial.length === 0 ? (
                    <p>No hay cotizaciones.</p>
                ) : (
                    <div className={'flex flex-col h-full'}>
                        {/* Tabla paginada */}
                        <div className="rounded-[10px] border border-gray-200 overflow-hidden">
                            <table
                                className="w-full text-sm rounded-[10px] border-b-[2px] border-gray-200 shadow-[0_0_2px_rgba(0,0,0,0.25)]">
                                <thead className="bg-gray-100">
                                <tr className={'border-gray-200 border-b'}>
                                    <th className="text-center py-2 font-semibold">ID</th>
                                    <th className="text-center py-2 font-semibold">Fecha</th>
                                    <th className="text-center py-2 font-semibold">Total</th>
                                    <th className="text-center py-2 font-semibold">Estado pago</th>
                                </tr>
                                </thead>
                                <tbody>
                                {historialPaginado.map(cot => (
                                    <tr key={cot.id} className="bg-white">
                                        <td className="text-center py-2 font-montserrat border-b border-gray-200 ">{cot.id}</td>
                                        <td className="text-center py-2 font-montserrat border-b border-gray-200 ">{formatDate(cot.fecha_crea)}</td>
                                        <td className="text-center py-2 font-montserrat border-b border-gray-200 ">{formatCurrency(Number(cot.total_precio))}</td>
                                        <td className="text-center py-2 font-montserrat border-b border-gray-200 ">{cot.estado_pago?.charAt(0).toUpperCase() + cot.estado_pago?.slice(1)}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Controles de paginación */}
                        <div className="flex justify-center items-center gap-3 mt-4">
                            <button
                                onClick={() => setPaginaActual(p => Math.max(1, p - 1))}
                                disabled={paginaActual === 1}
                                className="px-3 py-1 bg-gray-200 text-gray-700 rounded disabled:opacity-50 hover:bg-gray-300 cursor-pointer"
                            >
                                Anterior
                            </button>

                            <span className="px-3 py-1">
                Página {paginaActual} de {totalPaginas}
              </span>

                            <button
                                onClick={() => setPaginaActual(p => Math.min(totalPaginas, p + 1))}
                                disabled={paginaActual === totalPaginas}
                                className="px-3 py-1 bg-gray-200 text-gray-700 rounded disabled:opacity-50 hover:bg-gray-300 cursor-pointer"
                            >
                                Siguiente
                            </button>
                        </div>
                    </div>
                )}
            </ModalBody>

            <ModalFooter>
                <Button
                    label="Cerrar"
                    className="bg-[#1b5be7] hover:bg-[#1e4fbb] text-white"
                    onClick={onClose}
                />
            </ModalFooter>
        </Modal>
    )
}
