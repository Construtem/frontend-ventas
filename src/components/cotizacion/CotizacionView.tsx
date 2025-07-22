'use client'

import { useEffect, useState } from 'react'
import { DBCotizacion, Sucursal, sucursalService } from '@/services/apiServices'
import Button from '@/components/Button'
import CotizacionHeader from '@/components/cotizacion/CotizacionHeader'
import { useCotizacionFlow } from '@/contexts/CotizacionFlow'

const capital = (t: string) => t.charAt(0).toUpperCase() + t.slice(1)

function DetalleLinea({
                          label,
                          value,
                      }: {
    label: string
    value: React.ReactNode
}) {
    return (
        <div className="py-3 grid grid-cols-[140px_1fr] gap-4">
            <dt className="text-gray-600">{label}:</dt>
            <dd className="font-medium break-words">{value}</dd>
        </div>
    )
}

export function CotizacionView({
                                   quote,
                                   onSeeDetail,
                               }: {
    quote: DBCotizacion
    onSeeDetail: () => void
}) {
    const { state } = useCotizacionFlow()
    const [sucursales, setSucursales] = useState<Sucursal[]>([])

    useEffect(() => {
        async function cargarSucursales() {
            try {
                const data = await sucursalService.obtenerSucursales()
                setSucursales(data)
            } catch (e) {
                console.error('Error al cargar sucursales:', e)
            }
        }

        if (quote.tipo_despacho === 'retiro tienda') {
            cargarSucursales()
        }
    }, [quote.tipo_despacho])

    const normalizarTexto = (texto?: string) =>
        (texto ?? '').trim().toLowerCase()

    const direccionSucursal: Sucursal | null =
        quote.tipo_despacho === 'retiro tienda' &&
        quote.items.length > 0 &&
        quote.items[0].sucursal?.nombre
            ? (() => {
                const nombreSucursalItem = quote.items[0].sucursal?.nombre;
                console.log("Sucursal desde item:", nombreSucursalItem);
                console.log("Sucursales disponibles:", sucursales.map(s => s.nombre));

                return sucursales.find((s: Sucursal) =>
                    normalizarTexto(s.nombre) === normalizarTexto(nombreSucursalItem)
                ) ?? null;
            })()
            : null;


    console.log(sucursales)
    console.log('La id de  la tienda del pedido es: ', quote)

    return (
        <article className="bg-white rounded-[10px] shadow px-8 py-6 lg:h-[550px]">
            <CotizacionHeader />

            <header className="flex justify-between flex-wrap gap-4">
                <h2 className="text-2xl font-bold">Cotización #{quote.id}</h2>

                <span
                    className={`px-4 py-1 rounded text-sm font-bold ${
                        quote.estado_pago === 'pagado'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-yellow-50 text-yellow-700'
                    }`}
                >
                    {quote.estado_pago ? capital(quote.estado_pago) : 'Pendiente'}
                </span>
            </header>

            <dl className="divide-y divide-gray-200">
                <DetalleLinea
                    label={quote.cliente.nombre ? 'Nombre cliente' : 'Rut cliente'}
                    value={quote.cliente.nombre || state.clienteRut}
                />
                <DetalleLinea
                    label="Descripción"
                    value={quote.descripcion ?? '—'}
                />
                <DetalleLinea
                    label="Tipo de envío"
                    value={quote.tipo_despacho ? capital(quote.tipo_despacho) : ''}
                />
                <DetalleLinea
                    label="Costo envío"
                    value={
                        !quote.costo_envio || isNaN(Number(quote.costo_envio)) || Number(quote.costo_envio) === 0
                            ? 'En espera del cálculo de despacho'
                            : Number(quote.costo_envio)
                    }
                />
                {quote.tipo_despacho === 'retiro tienda' && direccionSucursal ? (
                    <DetalleLinea label="Dirección tienda" value={`${direccionSucursal.direccion}, ${direccionSucursal.comuna}, ${direccionSucursal.ciudad}`} />
                ) : (
                    quote.direccion && (
                        <DetalleLinea label="Dirección cliente" value={`${quote.direccion.direccion}, ${quote.direccion.comuna}, ${quote.direccion.ciudad}`} />
                    )
                )}
            </dl>

            <footer className="flex justify-end pt-4">
                {state.cotizacionId !== null && state.cotizacionId! > 0 && (
                    <Button
                        label="Ver detalle"
                        className="bg-sky-600 hover:bg-sky-700 text-white"
                        onClick={onSeeDetail}
                    />
                )}
            </footer>
        </article>
    )

}
