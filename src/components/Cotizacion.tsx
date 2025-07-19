'use client'
import { useMemo, useState } from 'react'
import { useQuery }          from '@tanstack/react-query'
import Button                from '@/components/Button'
import { useCotizacionFlow } from '@/contexts/CotizacionFlow'
import {
    clienteService,
    DBCotizacion,
}                            from '@/services/apiServices'

import { CotizacionView }    from '@/components/cotizacion/CotizacionView'
import { CotizacionForm }    from '@/components/cotizacion/CotizacionForm'
import CotizacionDetalleModal from '@/components/Modal/CotizacionDetalleModal'

export default function Cotizacion () {
    /* contexto */
    const { state, dispatch }      = useCotizacionFlow()
    const { clienteRut, cotizacionId, draftQuote,
        isEditing, isCreating, showModal } = state

    /* fetch historial */
    const { data: historial = [], isLoading, isError, error } =
        useQuery<DBCotizacion[]>({
            queryKey: ['historial', clienteRut],
            queryFn:   () => clienteService.obtenerHistorialCotizaciones(clienteRut!),
            enabled:   !!clienteRut,
        })

    /* unimos cotizaciones de BDD + las locales todavía no guardadas */
    const allQuotes = [...state.localQuotes, ...historial]

    const cotizacionActual = useMemo(
        () => allQuotes.find(c => c.id === cotizacionId) ?? null,
        [allQuotes, cotizacionId],
    )

    /* helpers */
    const handleDraftChange = (patch: Partial<DBCotizacion>) =>
        dispatch({ type: 'UPDATE_DRAFT', payload: patch })

    const handleSaveDraft = () => {
        if (!draftQuote) return
        // simulamos “id” local negativo; cuando la guardes en back
        // obtendrás un id real y actualizarás de nuevo el contexto.
        const provisional = {
            ...draftQuote,
            id: Date.now() * -1,
            estado:       'pendiente',
            estado_pago:  'pendiente',
            fecha_crea:   new Date().toISOString(),
        } as DBCotizacion

        dispatch({ type: 'SAVE_DRAFT_OK', payload: provisional })
    }

    const cancel = () =>
        dispatch(isCreating ? { type: 'CANCEL_NEW_QUOTE' }
            : { type: 'CANCEL_EDIT_QUOTE' })

    /* ─────────── Render ─────────── */
    return (
        <>
            <div className="px-6 sm:px-0 w-[60%]
            ">
                {/* encabezado */}
                <header className="flex flex-wrap items-baseline justify-center sm:justify-between gap-4 py-4 w-full">
                    <h1 className="font-montserrat font-semibold text-2xl">
                        Detalle cotización
                    </h1>

                    <div className="flex gap-[10px]">
                        {allQuotes.length > 0 && (
                            <select
                                disabled={isLoading}
                                className="border rounded px-2 py-1 min-w-[240px]"
                                value={cotizacionId ?? ''}
                                onChange={e =>
                                    dispatch({ type: 'SET_QUOTE', payload: Number(e.target.value) })
                                }
                            >
                                <option value="">Seleccionar cotización</option>
                                {allQuotes.map(q => (
                                    <option key={q.id} value={q.id}>
                                        #{q.id} — {new Date(q.fecha_crea).toLocaleDateString()}
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

                {/* loaders / mensajes */}
                {isLoading && <p className="text-center text-gray-500 py-10">Cargando…</p>}
                {isError && (
                    <p className="text-center text-rose-600 py-10">{(error as Error).message}</p>
                )}
                {!isLoading && clienteRut && allQuotes.length === 0 && (
                    <p className="text-center text-gray-500 py-10">
                        Este cliente aún no tiene cotizaciones.
                    </p>
                )}

                {/* modos */}
                {(!isCreating && !isEditing && cotizacionActual) && (
                    <CotizacionView
                        quote={cotizacionActual}
                        onSeeDetail={() => dispatch({ type: 'OPEN_MODAL' })}
                    />
                )}

                {(isCreating || isEditing) && draftQuote && (
                    <CotizacionForm
                        draft={draftQuote}
                        onChange={handleDraftChange}
                        onSave={handleSaveDraft}
                        onCancel={cancel}
                    />
                )}
            </div>

            {/* modal detalle */}
            {cotizacionActual && (
                <CotizacionDetalleModal
                    open={showModal}
                    onClose={() => dispatch({ type: 'CLOSE_MODAL' })}
                    data={cotizacionActual}
                />
            )}
        </>
    )
}
