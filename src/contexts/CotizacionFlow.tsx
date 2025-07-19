
// src/contexts/CotizacionFlow.tsx
import React, {
    createContext,
    useReducer,
    useContext,
    ReactNode,
} from 'react'

import {
    DBCotizacion, DraftItem,
} from '@/services/apiServices'

/* ──────────────────────────────────────────────────────────
 * 2.  Shape del estado global del flujo
 * ──────────────────────────────────────────────────────────*/
export type CotizacionState = {
    /* Paso 1: tienda */
    sucursalId: string | null
    items: DraftItem[] // items de la cotización en edición
    /* Paso 2: cliente */
    clienteRut: string | null

    /* Paso 3: cotización */
    cotizacionId: number | null      // cotización elegida (o nueva)

    /* Paso 4: dirección de despacho (opcional) */
    direccionId: number | null

    /* Bandeja de edición / creación */
    isEditing: boolean               // true cuando el card está en modo edit / new
    draft: Partial<DBCotizacion> | null

    /* Modal de creación de cliente */
    isCreatingClient: boolean
    // Para las cotizaciones
    localQuotes : DBCotizacion[]        // <─  cotizaciones “tmp”
    isCreating  : boolean
    draftQuote  : Partial<DBCotizacion> | null
    showModal   : boolean
}

/* ──────────────────────────────────────────────────────────
 * 3.  Actions
 * ──────────────────────────────────────────────────────────*/
export type CotizacionAction =
    | { type: 'SET_STORE';            payload: string }
    | { type: 'RESET_AFTER_STORE' }

    | { type: 'SET_CLIENT';           payload: string }

    | { type: 'SET_ADDRESS';          payload: number }

    | { type: 'SET_QUOTE';            payload: number }   // seleccionar del select
    | { type: 'START_NEW_QUOTE' }                         // clic en "+"
    | { type: 'START_EDIT_QUOTE';     payload: DBCotizacion }
    | { type:'SAVE_DRAFT_OK';   payload: DBCotizacion }
    | { type: 'UPDATE_DRAFT';         payload: Partial<DBCotizacion> }
    | { type: 'CANCEL_EDIT_QUOTE' }
    | { type:'CANCEL_NEW_QUOTE' }
    | { type: 'SAVE_QUOTE_SUCCESS';   payload: number }   // backend devuelve id
    | { type:'OPEN_MODAL' }
    | { type:'CLOSE_MODAL' }
    | { type: 'OPEN_CREATE_CLIENT_MODAL' }
    | { type: 'CLOSE_CREATE_CLIENT_MODAL' }

/* ──────────────────────────────────────────────────────────
 * 4.  Estado inicial
 * ──────────────────────────────────────────────────────────*/
const initialState: CotizacionState = {
    sucursalId:        null,
    clienteRut:        null,
    cotizacionId:      null,
    direccionId:       null,
    items:             [], // items de la cotización en edición
    localQuotes:       [],
    isCreating:        false,
    isCreatingClient: false,
    draftQuote:        null,
    showModal:         false,
    // edición / creación de cotización
    isEditing:         false,
    draft:             null,

}

/* ──────────────────────────────────────────────────────────
 * 5.  Reducer
 * ──────────────────────────────────────────────────────────*/
function cotizacionReducer(
    state: CotizacionState,
    action: CotizacionAction,
): CotizacionState {
    switch (action.type) {
        /* ───────────── Paso 1 • Sucursal ───────────────────────── */
        case 'SET_STORE':
            return {
                ...state,
                sucursalId: action.payload,

                // reset de todo lo dependiente
                clienteRut:   null,
                cotizacionId: null,
                direccionId:  null,
                isEditing:    false,
                isCreating:   false,
                draftQuote:   null,
                localQuotes:  [],
            }

        case 'RESET_AFTER_STORE':
            return { ...initialState, sucursalId: state.sucursalId }

        /* ───────────── Paso 2 • Cliente ────────────────────────── */
        case 'SET_CLIENT':
            return {
                ...state,
                clienteRut: action.payload,

                // limpio cotización / dirección / ediciones
                cotizacionId: null,
                direccionId:  null,
                isEditing:    false,
                isCreating:   false,
                draftQuote:   null,
            }

        /* ───────────── Paso 3 • Dirección ─────────────────────── */
        case 'SET_ADDRESS':
            return { ...state, direccionId: action.payload }

        /* ───────────── Seleccionar cotización existente ───────── */
        case 'SET_QUOTE':
            return {
                ...state,
                cotizacionId: action.payload,
                isEditing:    false,
                isCreating:   false,
                draftQuote:   null,
            }

        /* ───────────── Crear nueva (solo local) ───────────────── */
        case 'START_NEW_QUOTE':
            return {
                ...state,
                cotizacionId: null,
                isCreating:   true,
                isEditing:    false,
                draftQuote:   {
                    descripcion:   '',
                    tipo_despacho:'retiro',
                    costo_envio:  0,
                }, // borrador inicial
            }

        case 'CANCEL_NEW_QUOTE':
            return {
                ...state,
                isCreating: false,
                draftQuote: null,
            }

        /* ───────────── Editar existente ───────────────────────── */
        case 'START_EDIT_QUOTE': {
            /* ── 1.  Normalizar items del payload ─────────────────────────── */
            const draftItems: DraftItem[] =
                action.payload.items?.map(i => ({
                    sku:        i.producto_id           ?? i.sku,                   // nunca vacío
                    nombre:     i.producto?.nombre      ?? i.producto2?.nombre
                        ?? i.nombre              ?? '',
                    sucursalId: i.sucursal_id,
                    sucursal:   i.sucursal?.nombre      ?? i.sucursal2?.nombre
                        ?? '',
                    cantidad:   i.cantidad,
                    precio:     i.producto?.precio      ?? i.producto2?.precio
                        ?? i.precio_unitario     ?? 0,
                    descuento:  i.descuento             ?? 0,
                })) ?? [];

            /* ── 2.  Devolver el nuevo estado ────────────────────────────────*/
            return {
                ...state,

                /* Selección / modo edición */
                cotizacionId: action.payload.id,
                isEditing:    true,

                /* Guarda la cotización completa como borrador bruto (por si la necesitas) */
                draft:        action.payload,

                /* Borrador “plano” de items para el formulario */
                items:        draftItems,

                /* Re-calcula totales y los fusiona */
                ...calcTotals(draftItems),
            };
        }


        /* ───────────── Borrador (crear / editar) ──────────────── */
        case 'UPDATE_DRAFT':
            return {
                ...state,
                draftQuote: { ...state.draftQuote, ...action.payload },
            }

        /* ───────────── Guardar borrador local ─────────────────── */
        case 'SAVE_DRAFT_OK':
            return {
                ...state,
                localQuotes: [action.payload, ...state.localQuotes],
                cotizacionId: action.payload.id,
                isCreating:   false,
                isEditing:    false,
                draftQuote:   null,
            }

        /* ───────────── Modal de detalle ───────────────────────── */
        case 'OPEN_MODAL':
            return { ...state, showModal: true }

        case 'CLOSE_MODAL':
            return { ...state, showModal: false }

        /* ───────────── Crear cliente (ya los tenías) ──────────── */
        case 'OPEN_CREATE_CLIENT_MODAL':
            return { ...state, isCreatingClient: true }

        case 'CLOSE_CREATE_CLIENT_MODAL':
            return { ...state, isCreatingClient: false }

        /* ───────────── Default ───────────────────────────────── */
        default:
            return state
    }
}

/* ──────────────────────────────────────────────────────────
 * 6.  Contexto y provider
 * ──────────────────────────────────────────────────────────*/
const CotizacionContext = createContext<{
    state: CotizacionState
    dispatch: React.Dispatch<CotizacionAction>
}>({
    state: initialState,
    dispatch: () => null,
})

export function CotizacionProvider ({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(cotizacionReducer, initialState)

    return (
        <CotizacionContext.Provider value={{ state, dispatch }}>
            {children}
        </CotizacionContext.Provider>
    )
}

/* ──────────────────────────────────────────────────────────
 * 7.  Hook de conveniencia
 * ──────────────────────────────────────────────────────────*/
export function useCotizacionFlow () {
    return useContext(CotizacionContext)
}

function calcTotals(items: DraftItem[]) {
    const subtotal = items.reduce(
        (s, it) => s + it.precio * it.cantidad,
        0,
    );
    const descuentoTotal = items.reduce(
        (s, it) => s + it.descuento * it.cantidad,
        0,
    );
    return {
        subtotal,
        descuentoTotal,
        total: subtotal - descuentoTotal,
    };
}

