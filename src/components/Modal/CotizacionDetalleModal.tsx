// src/components/CotizacionDetalleModal.tsx
'use client'

import { useState } from 'react'
import { ModalHeader, ModalBody, ModalFooter } from '@/components/Modal/ModalsParts'
import Button from '@/components/Button'
import { DBCotizacion, CotizacionCheckout, eliminarCotizacion } from '@/services/apiServices'
import Modal from '@/components/Modal/Modal'

/** Modal de detalle de cotización */
type Props = {
    open: boolean
    onClose: () => void
    data: DBCotizacion | CotizacionCheckout
    onDelete?: (id: number) => void
}

export default function CotizacionDetalleModal({ open, onClose, data, onDelete }: Props) {
    if (!data) return null

    const [confirmingDelete, setConfirmingDelete] = useState(false)
    const [deleted, setDeleted] = useState(false)
    const [loading, setLoading] = useState(false)

    const {
        id,
        fecha_crea,
        estado,
        tipo_despacho,
        costo_envio,
        estado_pago,
        cliente,
        direccion,
        items,
    } = data

    const usuario = 'usuario' in data ? data.usuario : null
    const money = (v: number) => `$${v.toLocaleString('es-CL')}`

    async function handleDelete() {
        try {
            setLoading(true)
            await eliminarCotizacion(id)
            setDeleted(true)
            setTimeout(() => {
                setLoading(false)
                setConfirmingDelete(false)
                onClose()
                onDelete?.(id)
            }, 2000)
        } catch (e) {
            console.error('Error al eliminar cotización:', e)
            alert('Ocurrió un error al eliminar la cotización.')
            setLoading(false)
        }
    }

    return (
        <Modal isOpen={open} onClose={onClose}>
            <ModalHeader title={`Cotización #${id}`} onClose={onClose} />

            <ModalBody>
                {deleted ? (
                    <div className="text-center py-6 animate-fade-in">
                        <p className="text-lg font-semibold text-green-600">Cotización eliminada exitosamente ✅</p>
                    </div>
                ) : confirmingDelete ? (
                    <div className="text-center py-6 animate-fade-in">
                        <p className="text-lg font-semibold mb-4">¿Deseas eliminar esta cotización?</p>
                        <div className="flex justify-center gap-4">
                            <Button label="Cancelar" className="bg-gray-200" onClick={() => setConfirmingDelete(false)} />
                            <Button label="Sí, eliminar" className="bg-red-600 text-white" onClick={handleDelete} disabled={loading} />
                        </div>
                    </div>
                ) : (
                    <>
                        <section className="grid grid-cols-2 gap-4">
                            <div>
                                <p><span className="font-semibold">Estado:</span> {estado}</p>
                                <p><span className="font-semibold">Estado pago:</span> {estado_pago?.charAt(0).toUpperCase() + estado_pago.slice(1)}</p>
                                <p><span className="font-semibold">Fecha:</span> {new Date(fecha_crea).toLocaleDateString()}</p>
                                <p><span className="font-semibold">Tipo envío:</span> {tipo_despacho?.charAt(0).toUpperCase() + tipo_despacho.slice(1)}</p>
                                <p><span className="font-semibold">Costo envío:</span> {money(Number(costo_envio))}</p>
                                {direccion && (
                                    <p><span className="font-semibold">Dirección:</span> {`${direccion.direccion}, ${direccion.comuna}, ${direccion.ciudad}`}</p>
                                )}
                            </div>
                            <div>
                                <p className="font-semibold mb-1">Cliente</p>
                                <p>{cliente.nombre} ({cliente.rut})</p>
                                <p>{cliente.razon_social}</p>
                                <p>{cliente.email ?? '—'}</p>
                                <p>{cliente.telefono ?? '—'}</p>
                                {usuario && (
                                    <>
                                        <p className="font-semibold mt-3 mb-1">Vendedor</p>
                                        <p>{usuario.nombre}</p>
                                        <p>{usuario.email}</p>
                                    </>
                                )}
                            </div>
                        </section>

                        <h3 className="mt-6 font-semibold text-lg">Productos</h3>
                        <div className="overflow-x-auto mt-2">
                            <table className="min-w-full text-sm">
                                <thead>
                                <tr className="border-b border-white/20">
                                    <th className="py-2 text-left">SKU</th>
                                    <th className="py-2 text-left">Nombre</th>
                                    <th className="py-2 text-left">Sucursal</th>
                                    <th className="py-2 text-right">Cant.</th>
                                    <th className="py-2 text-right">P. unit</th>
                                    <th className="py-2 text-right">Descuento</th>
                                    <th className="py-2 text-right">Subtotal</th>
                                </tr>
                                </thead>
                                <tbody>
                                {items.map((it, idx) => (
                                    <tr key={idx} className="border-b border-white/10">
                                        <td className="py-1">{it.sku}</td>
                                        <td className="py-1">{it.nombre}</td>
                                        <td className="py-1">{it.sucursal}</td>
                                        <td className="py-1 text-right">{it.cantidad}</td>
                                        <td className="py-1 text-right">{it.precio_unitario}</td>
                                        <td className="py-1 text-right">{it.descuento}%</td>
                                        <td className="py-1 text-right">{it.subtotal}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-4">
                            <p><span className="font-semibold">Total productos:</span> {items.reduce((acc, it) => acc + it.cantidad, 0)}</p>
                            <p className="text-right"><span className="font-semibold">Subtotal:</span> {data.subtotal_neto}</p>
                            <p><span className="font-semibold">Descuento total:</span> {Math.round(Number(data.descuento_total))}</p>
                            <p className="text-right"><span className="font-semibold">IVA (19%):</span> {Math.round(Number(data.iva))}</p>
                            <p><span className="font-semibold">Costo envío:</span> {money(Number(costo_envio))}</p>
                            <p className="text-right font-semibold text-lg">Total: {Math.round(Number(data.total))}</p>
                        </div>
                    </>
                )}
            </ModalBody>

            {!deleted && !confirmingDelete && (
                <ModalFooter>
                    {data.estado === 'rechazada' && (
                        <Button label="Eliminar" className="bg-red-600 text-white" onClick={() => setConfirmingDelete(true)} />
                    )}
                    <Button label="Cerrar" className="bg-[#1b5be7] hover:bg-[#1e4fbb] text-white" onClick={onClose} />
                </ModalFooter>
            )}
        </Modal>
    )
}
