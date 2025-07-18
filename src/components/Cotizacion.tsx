'use client'
import React, { useMemo, useState } from 'react'
import { useQuery }                 from '@tanstack/react-query'
import Button                       from '@/components/Button'
import { useCotizacionFlow }        from '@/contexts/CotizacionFlow'
import {
    clienteService,
    DBCotizacion,
}                                    from '@/services/apiServices'
import CotizacionDetalleModal        from '@/components/Modal/CotizacionDetalleModal'

export default function CotizacionCard () {
    /* 1️⃣  Acceso al flujo global */
    const { state, dispatch } = useCotizacionFlow()
    const rutCliente           = state.clienteRut
    const cotizacionId         = state.cotizacionId
    const isEditing            = state.isEditing /* por si luego activas modo edición */

    /* 2️⃣  Consulta del historial */
    const {
        data: historial = [],
        isLoading,
        isError,
        error,
    } = useQuery<DBCotizacion[]>({
        queryKey: ['historial', rutCliente],
        queryFn:   () => clienteService.obtenerHistorialCotizaciones(rutCliente!),
        enabled:   !!rutCliente,
    })

    /* 3️⃣  Obtener cotización actual según id del flujo */
    const cotizacionActual = useMemo(
        () => historial.find(c => c.id === cotizacionId) ?? null,
        [historial, cotizacionId]
    )

    /* 4️⃣  Estado para abrir/cerrar modal */
    const [showDetail, setShowDetail] = useState(false)

    /* Helper moneda */
    const money = (v:number) => `$${v.toLocaleString('es-CL')}`

    /* 5️⃣  UI */
    return (
        <>
            <div className="max-w-[600px] px-6 sm:px-0 w-full">
                {/* ─────────────── Encabezado ─────────────── */}
                <header className="flex flex-wrap items-baseline justify-center sm:justify-between gap-4 py-4 w-full">
                    <h1 className="font-montserrat font-semibold text-2xl">
                        Detalle cotización
                    </h1>

                    {/* Selector + botón “Nueva” */}
                    <div className="flex gap-[10px]">
                        {/* Mostrar select solo si hay historial */}
                        {historial.length > 0 && (
                            <select
                                disabled={isLoading}
                                className="border rounded px-2 py-1 min-w-[240px]"
                                value={cotizacionId ?? ''}
                                onChange={e =>
                                    dispatch({ type: 'SET_QUOTE', payload: Number(e.target.value) })
                                }
                            >
                                <option value="">Seleccionar cotización</option>
                                {historial.map(c => (
                                    <option key={c.id} value={c.id}>
                                        #{c.id} — {new Date(c.fecha_crea).toLocaleDateString()}
                                    </option>
                                ))}
                            </select>
                        )}

                        <Button
                            label="+ Nueva"
                            className="bg-green-600 hover:bg-green-700 text-white"
                            onClick={() => dispatch({ type: 'START_NEW_QUOTE' })}
                        />
                    </div>
                </header>

                {/* ─────────────── Estados intermedios ─────────────── */}
                {isLoading && <p className="text-center text-gray-500 py-10">Cargando…</p>}

                {isError && (
                    <p className="text-center text-rose-600 py-10">
                        {(error as Error).message}
                    </p>
                )}

                {!isLoading && rutCliente && !historial.length && (
                    <p className="text-center text-gray-500 py-10">
                        Este cliente aún no tiene cotizaciones.
                    </p>
                )}

                {/* ─────────────── Card detalle (lectura) ─────────────── */}
                {!isEditing && cotizacionActual && (
                    <article className="bg-white rounded shadow px-8 py-6 space-y-4">
                        <header className="flex justify-between flex-wrap gap-4">
                            <h2 className="text-2xl font-semibold text-sky-600">
                                Cotización #{cotizacionActual.id}
                            </h2>

                            <span
                                className={`px-4 py-1 rounded text-sm font-bold ${
                                    cotizacionActual.estado_pago === 'pagado'
                                        ? 'bg-emerald-50 text-emerald-700'
                                        : 'bg-yellow-50 text-yellow-700'
                                }`}
                            >
                {cotizacionActual.estado_pago
                    ? cotizacionActual.estado_pago[0].toUpperCase() +
                    cotizacionActual.estado_pago.slice(1)
                    : 'Pendiente'}
              </span>
                        </header>

                        {/* Tabla de atributos */}
                        <dl className="divide-y divide-gray-200">
                            <DetalleLinea label="Descripción" value={cotizacionActual.descripcion ?? '—'} />

                            <DetalleLinea
                                label="Tipo de envío"
                                value={
                                    cotizacionActual.tipo_despacho.toLowerCase() === 'a domicilio'
                                        ? 'A domicilio'
                                        : 'Retiro en tienda'
                                }
                            />

                            <DetalleLinea
                                label="Costo de envío"
                                value={money(cotizacionActual.costo_envio)}
                            />

                            {/* Ejemplo si incluyes dirección simple en la API */}
                            {'direccion existe'=='direccion existe' && (
                                <DetalleLinea label="Dirección" value={'direccion demo 123, comuna'} />
                            )}
                        </dl>

                        <footer className="flex justify-end pt-4">
                            <Button
                                label="Ver detalle"
                                className="bg-sky-600 hover:bg-sky-700 text-white"
                                onClick={() => setShowDetail(true)}
                            />
                        </footer>
                    </article>
                )}

                {/* ─────────────── Modo edición / creación — placeholder ─────────────── */}
                {isEditing && (
                    <p className="text-center text-gray-500 py-10">
                        Formulario de cotización (en construcción)…{/* reemplázalo cuando corresponda */}
                    </p>
                )}
            </div>

            {/* ─────────────── Modal detalle ─────────────── */}
            {cotizacionActual && (
                <CotizacionDetalleModal
                    open={showDetail}
                    onClose={() => setShowDetail(false)}
                    data={cotizacionActual}
                />
            )}
        </>
    )
}

/* Sub-componente para línea de detalle */
function DetalleLinea ({
                           label,
                           value,
                       }: {
    label: string
    value: React.ReactNode
}) {
    return (
        <div className="py-3 grid grid-cols-[140px_1fr] gap-4">
            <dt className="text-gray-600">{label}:</dt>
            <dd className="font-medium">{value}</dd>
        </div>
    )
}
