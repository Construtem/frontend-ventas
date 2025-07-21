'use client'
import { ModalHeader, ModalBody, ModalFooter } from '@/components/Modal/ModalsParts'
import Button from '@/components/Button'
import { DBCotizacion, CotizacionCheckout } from '@/services/apiServices'
import Modal from '@/components/Modal/Modal'

type Props = {
    open: boolean
    onClose: () => void
    data: DBCotizacion | CotizacionCheckout
}

export default function CotizacionDetalleModal({ open, onClose, data }: Props) {
    if (!data) return null

    const isCheckout = !('producto' in (data.items?.[0] || {})) // detecta CotizacionCheckout

    const {
        id,
        fecha_crea,
        estado,
        tipo_despacho,
        costo_envio,
        descripcion,
        estado_pago,
        cliente,
        direccion,
        items,
    } = data

    const usuario = 'usuario' in data ? data.usuario : null
    const total_items = 'total_items' in data ? data.total_items : items?.reduce((sum, i) => sum + i.cantidad, 0) || 0
    const total_precio = 'total_precio' in data ? data.total_precio : items?.reduce((sum, i) => sum + Number(i.subtotal), 0) || 0

    const money = (v: number) => `$${v.toLocaleString('es-CL')}`

    return (
        <Modal isOpen={open} onClose={onClose}>
            <ModalHeader title={`Cotización #${id}`} onClose={onClose} />

            <ModalBody>
                {/* Cabecera */}
                <section className="grid grid-cols-2 gap-4">
                    <div>
                        <p><span className="font-semibold">Estado:</span> {estado}</p>
                        <p><span className="font-semibold">Estado pago:</span> {estado_pago?.charAt(0).toUpperCase() + estado_pago?.slice(1)}</p>
                        <p><span className="font-semibold">Fecha:</span> {new Date(fecha_crea).toLocaleDateString()}</p>
                        <p><span className="font-semibold">Tipo envío:</span> {tipo_despacho ? tipo_despacho.charAt(0).toUpperCase() + tipo_despacho.slice(1) : ''}</p>
                        <p><span className="font-semibold">Costo envío:</span> {money(Number(costo_envio))}</p>
                        {direccion && (
                            <p><span className="font-semibold">Dirección:</span> {`${direccion.direccion}, ${direccion.comuna}, ${direccion.ciudad}`}</p>
                        )}
                    </div>

                    <div>
                        <p className="font-semibold mb-1">Cliente</p>
                        <p>{cliente.nombre} ({cliente.rut})</p>
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

                {/* Descripción */}
                {descripcion && (
                    <p className="mt-4"><span className="font-semibold">Descripción:&nbsp;</span>{descripcion}</p>
                )}

                {/* Tabla de ítems */}
                <h3 className="mt-6 font-semibold text-lg">Productos</h3>
                <div className="overflow-x-auto mt-2">
                    <table className="min-w-full text-sm">
                        <thead>
                        <tr className="border-b border-white/20">
                            <th className="py-2 text-left">SKU</th>
                            <th className="py-2 text-left">Nombre</th>
                            <th className="py-2 text-right">Cant.</th>
                            <th className="py-2 text-right">P. unit</th>
                            <th className="py-2 text-right">Subtotal</th>
                        </tr>
                        </thead>
                        <tbody>
                        {isCheckout
                            ? items?.map((it, idx) => (
                                <tr key={idx} className="border-b border-white/10">
                                    <td className="py-1">{it.sku}</td>
                                    <td className="py-1">{it.nombre}</td>
                                    <td className="py-1 text-right">{it.cantidad}</td>
                                    <td className="py-1 text-right">{money(Number(it.precio_unitario))}</td>
                                    <td className="py-1 text-right">{money(Number(it.subtotal))}</td>
                                </tr>
                            ))
                            : items?.map((it) => (
                                <tr key={it.sku} className="border-b border-white/10">
                                    <td className="py-1">{it.sku}</td>
                                    <td className="py-1">{it.nombre}</td>
                                    <td className="py-1 text-right">{it.cantidad}</td>
                                    <td className="py-1 text-right">{money(Number(it.precio_unitario))}</td>
                                    <td className="py-1 text-right">{money(it.cantidad * Number(it.precio_unitario))}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Totales */}
                <div className="mt-4 grid grid-cols-2 gap-4">
                    <p><span className="font-semibold">Total ítems:</span> {total_items}</p>
                    <p className="text-right"><span className="font-semibold">Subtotal:</span> {money(total_precio)}</p>
                    <p><span className="font-semibold">Costo envío:</span> {money(Number(costo_envio))}</p>
                    <p className="text-right font-semibold text-lg">Total: {money(total_precio + Number(costo_envio))}</p>
                </div>
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
