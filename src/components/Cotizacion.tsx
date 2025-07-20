'use client'
import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import Button from '@/components/Button'
import { useCotizacionFlow } from '@/contexts/CotizacionFlow'
import { clienteService, DBCotizacion } from '@/services/apiServices'
import { CotizacionView } from '@/components/cotizacion/CotizacionView'
import { CotizacionForm } from '@/components/cotizacion/CotizacionForm'
import CotizacionDetalleModal from '@/components/Modal/CotizacionDetalleModal'

export default function Cotizacion() {
    /* ----- contexto global ----- */
    const { state, dispatch } = useCotizacionFlow()
    const {
        clienteRut,
        cotizacionId,
        draftQuote,
        direccionId,
        isEditing,
        isCreating,
        showModal,
    } = state

    /* ----- historial remoto ----- */
    const {
        data: historial = [],
        isLoading,
        isError,
        error,
    } = useQuery<DBCotizacion[]>({
        queryKey: ['historial', clienteRut],
        queryFn: () => clienteService.obtenerHistorialCotizaciones(clienteRut!),
        enabled: !!clienteRut,
    })

    /* ----- combinar locales + remotas ----- */
    const allQuotes = [...state.localQuotes, ...historial]

    const cotizacionActual = useMemo(
        () => allQuotes.find((c) => c.id === cotizacionId) ?? null,
        [allQuotes, cotizacionId],
    )

    /* ----- callbacks ----- */
    const handleDraftChange = (patch: Partial<DBCotizacion>) =>
        dispatch({ type: 'UPDATE_DRAFT', payload: patch })

    /** seleccionar cabecera existente */
    const handleSelectQuote = (val: string) => {
        const id = Number(val) || 0
        dispatch({ type: 'SET_QUOTE', payload: id })
    }

    /** guardar cabecera local sin items */
    const handleSaveDraft = () => {
        if (!draftQuote) return
        const provisional: DBCotizacion = {
            ...draftQuote,
            id: Date.now() * -1,
            fecha_crea: new Date().toISOString(),
            estado: 'pendiente',
            estado_pago: 'pendiente',
            direccionId: direccionId ?? null,
            cliente: {} as any,
            usuario: {} as any,
            items: [],
            total_items: 0,
            total_precio: 0,
        }
        dispatch({ type: 'SAVE_DRAFT_OK', payload: provisional })
    }

    const handleCancel = () =>
        dispatch(
            isCreating
                ? { type: 'CANCEL_NEW_QUOTE' }
                : { type: 'CANCEL_EDIT_QUOTE' },
        )

    /* ----- render ----- */
    return (
        <>
            <div className="px-[40px] sm:px-0 w-full">
                {/* cabecera */}
                <header className="flex flex-wrap items-baseline justify-center sm:justify-between gap-4 py-4 w-full">
                    <h1 className="font-montserrat font-semibold text-[32px]">
                        Detalle cotización
                    </h1>

                    <div className="flex gap-[10px]">
                        {allQuotes.length > 0 && (
                            <select
                                disabled={isLoading}
                                className="border rounded px-2 py-1 min-w-[240px]"
                                value={cotizacionId ?? ''}
                                onChange={(e) => handleSelectQuote(e.target.value)}
                            >
                                <option value="">Seleccionar cotización</option>
                                {allQuotes.map((q) => (
                                    <option key={q.id} value={q.id}>
                                        #{q.id} — {new Date(q.fecha_crea).toLocaleDateString()}
                                    </option>
                                ))}
                            </select>
                        )}

                        <Button
                            label="+ Nueva"
                            className="bg-[#F59243] hover:bg-[#d98543] text-white"
                            onClick={() => dispatch({ type: 'START_NEW_QUOTE' })}
                        />
                    </div>
                </header>

                {/* mensajes / loaders */}
                {isLoading && (
                    <p className="text-center text-gray-500 py-10">Cargando…</p>
                )}
                {isError && (
                    <p className="text-center text-rose-600 py-10">
                        {(error as Error).message}
                    </p>
                )}

                {/* vista “readonly” */}
                {!isCreating && !isEditing && cotizacionActual && (
                    <CotizacionView
                        quote={cotizacionActual}
                        onSeeDetail={() => dispatch({ type: 'OPEN_MODAL' })}
                    />
                )}

                {!isLoading && clienteRut && allQuotes.length === 0 && (
                    <p className="text-center text-gray-500">
                        No hay cotizaciones disponibles. Crea una nueva.
                    </p>
                )}

                {/* formulario edición / alta */}
                {(isCreating || isEditing) && draftQuote && (
                    <CotizacionForm
                        draft={draftQuote}
                        onChange={handleDraftChange}
                        onSave={handleSaveDraft}
                        onCancel={handleCancel}
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
