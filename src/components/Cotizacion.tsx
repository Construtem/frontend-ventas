'use client'
import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useCotizacionFlow } from '@/contexts/CotizacionFlow'
import { clienteService, DBCotizacion } from '@/services/apiServices'
import { CotizacionView } from '@/components/cotizacion/CotizacionView'
import { CotizacionForm } from '@/components/cotizacion/CotizacionForm'
import CotizacionDetalleModal from '@/components/Modal/CotizacionDetalleModal'

type Draft = Partial<DBCotizacion> & {
    tipo_despacho?: 'a domicilio' | 'retiro tienda'
    direccion_id?: number | null
}

export default function Cotizacion() {
    /* ----- contexto global ----- */
    const { state, dispatch } = useCotizacionFlow()
    const {
        clienteRut,
        cotizacionId,
        draftQuote,
        direccionId,
        isCreating,
        showModal,
    } = state

    /* ----- historial remoto ----- */
    const {
        data: historial = [],
    } = useQuery<DBCotizacion[]>({
        queryKey: ['historial', clienteRut],
        queryFn: () => clienteService.obtenerHistorialCotizaciones(clienteRut!),
        enabled: !!clienteRut,
    })

    /* ----- combinar locales + remotas ----- */
    const allQuotes = useMemo(
        () => [...state.localQuotes, ...historial],
        [state.localQuotes, historial]
    );

    const cotizacionActual = useMemo(
        () => allQuotes.find((c) => c.id === cotizacionId) ?? null,
        [allQuotes, cotizacionId],
    )

    /* ----- callbacks ----- */
    const handleDraftChange = (patch: Partial<DBCotizacion>) => {
        dispatch({ type: 'UPDATE_DRAFT', payload: patch });
    }

    /** guardar cabecera local sin items, se ejecuta al dar clic a confirmar */
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

    const safeDraft: Draft = {
        ...draftQuote,
        tipo_despacho:
            draftQuote?.tipo_despacho === 'a domicilio' || draftQuote?.tipo_despacho === 'retiro tienda'
                ? draftQuote?.tipo_despacho
                : undefined,
    };

    /* ----- render ----- */
    /**/
    return (
        <>
            <div className="px-[40px] sm:px-0 w-full">
                {/* vista “readonly” */}
                {state.cotizacionId && cotizacionActual && !state.isCreating &&(
                    <CotizacionView
                        quote={cotizacionActual}
                        onSeeDetail={() => dispatch({ type: 'OPEN_MODAL' })}
                    />
                )}

                {/* formulario edición / alta */}
                {isCreating && (
                    <CotizacionForm
                        draft={safeDraft}
                        onChange={handleDraftChange}
                        onSave={handleSaveDraft}
                        onCancel={handleCancel}
                    />
                )
                }
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