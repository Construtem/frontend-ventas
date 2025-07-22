'use client'
import { useMemo, useCallback, useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useCotizacionFlow } from '@/contexts/CotizacionFlow'
import {
    adaptToCotizacionCheckout,
    clienteService,
    DBCotizacion,
    DBCliente,
    DireccionCliente,
    checkoutCotizacion,
    CotizacionCheckout,
} from '@/services/apiServices'
import { CotizacionView } from '@/components/cotizacion/CotizacionView'
import { CotizacionForm } from '@/components/cotizacion/CotizacionForm'
import LoaderCotizacion from "@/components/cotizacion/LoaderCotizacion";

type Draft = Partial<DBCotizacion> & {
    tipo_despacho?: 'a domicilio' | 'retiro tienda'
    direccionId?: number | null
}

export default function Cotizacion() {
    const { state, dispatch } = useCotizacionFlow()
    const {
        clienteRut,
        draftQuote,
        isCreating,
    } = state

    const [cotizacionCheckout, setCotizacionCheckout] = useState<CotizacionCheckout | null>(null)

    // 2) Lista de clientes para obtener datos de cliente al confirmar
    const { data: clientes = [] } = useQuery<DBCliente[]>({
        queryKey: ['clientes'],
        queryFn: () => clienteService.obtenerClientes(),
    })

    // 3) Direcciones del cliente (para mostrar en el select)
    const { data: direccion = [] } = useQuery<DireccionCliente[]>({
        queryKey: ['direcciones', clienteRut],
        queryFn: () => clienteService.obtenerDireccionDelCliente(clienteRut!),
        enabled: !!clienteRut,
    })

    // 5) Draft seguro para pasar al formulario (evita rerenders infinitos)
    const safeDraft = useMemo<Draft>(() => ({
        ...draftQuote,
        tipo_despacho:
            draftQuote?.tipo_despacho === 'a domicilio' || draftQuote?.tipo_despacho === 'retiro tienda'
                ? draftQuote.tipo_despacho
                : undefined,
        direccionId: draftQuote?.direccionId ?? undefined,
    }), [draftQuote])

    // 6) Manejadores
    const handleDraftChange = useCallback(
        (patch: Partial<Draft>) => dispatch({ type: 'UPDATE_DRAFT', payload: patch }),
        [dispatch]
    )

    const handleSaveDraft = () => {
        if (!draftQuote) return
        if (!clienteRut) {
            alert('Debes seleccionar un cliente')
            return
        }

        const clienteObj = clientes.find(c => c.rut === clienteRut)
        const dirObj = direccion.find(d => d.id === draftQuote.direccionId)

        const provisional: DBCotizacion = {
            ...draftQuote,
            id: Date.now() * -1,
            fecha_crea: new Date().toISOString(),
            estado: 'pendiente',
            estado_pago: 'pendiente',
            cliente: {
                rut: clienteRut,
                nombre: clienteObj?.nombre ?? '',
                telefono: clienteObj?.telefono ?? null,
                email: clienteObj?.email ?? null,
                razon_social: clienteObj?.razon_social ?? null,
            },
            usuario: {
                nombre: state.usuario?.nombre ?? '',
                email: state.usuario?.email ?? '',
                rol_id: state.usuario?.rol_id ?? 0,
            },
            direccionId: draftQuote.direccionId ?? null,
            direccion: dirObj
                ? {
                    direccion: dirObj.direccion,
                    comuna: dirObj.comuna,
                    ciudad: dirObj.ciudad,
                }
                : undefined,
            tipo_despacho: draftQuote.tipo_despacho ?? 'a domicilio',
            descripcion: draftQuote.descripcion ?? '',
            items: [],
            total_items: 0,
            total_precio: 0,
            subtotal_neto: 0,
            iva: 0,
            descuento_total: 0,
            total: 0,
        }

        dispatch({
            type: 'SAVE_DRAFT_OK',
            payload: adaptToCotizacionCheckout(provisional),
        })
    }

    const handleCancel = () => {
        dispatch(
            isCreating
                ? { type: 'CANCEL_NEW_QUOTE' }
                : { type: 'CANCEL_EDIT_QUOTE' }
        )
    }

    // 7) Cargar cotización extendida (checkout) desde API
    useEffect(() => {
        const id = state.cotizacionSeleccionada?.id;
        if (!id) return;

        // Es local (temporal)
        if (id < 0) {
            setCotizacionCheckout(state.cotizacionSeleccionada!);
            return;
        }
        // Es persistida → consulta desde backend
        async function cargar() {
            try {
                const res = await checkoutCotizacion(Number(id));
                setCotizacionCheckout(res);
            } catch (err) {
                console.error('Error al obtener cotización:', err);
            }
        }

        cargar();
    }, [state.cotizacionSeleccionada?.id]);


    // 8) Render
    return (
        <div className="px-[40px] sm:px-0 w-full">
            {isCreating ? (
                <CotizacionForm
                    draft={safeDraft}
                    onChange={handleDraftChange}
                    onSave={handleSaveDraft}
                    onCancel={handleCancel}
                />
            ) : state.cotizacionSeleccionada?.id && !cotizacionCheckout ? (
                <LoaderCotizacion />
            ) : cotizacionCheckout && (
                <CotizacionView
                    quote={cotizacionCheckout}
                    onSeeDetail={() =>
                        dispatch({
                            type: "ABRIR_MODAL_DETALLE",
                            payload: cotizacionCheckout
                        })
                    }
                />
            )}

        </div>
    )
}
