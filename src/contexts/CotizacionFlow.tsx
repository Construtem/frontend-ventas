
// src/contexts/CotizacionFlow.tsx
import React, {
    createContext,
    useReducer,
    useContext,
    ReactNode,
} from 'react'

import {
    DBCotizacion,
} from '@/services/apiServices'
/*─────────────────────────────────────────────*
 * 1.  Tipos auxiliares (productos en borrador)
 *─────────────────────────────────────────────*/

export interface DraftItem {
    sku:        string          // siempre presente
    nombre:     string          // ← obligatorio
    sucursalId: number
    sucursal:   string
    cantidad:   number
    precio:     number
    descuento:  number          // siempre presente (0 si no aplica)
}

/*─────────────────────────────────────────────*
 * 2.  Estado global del flujo
 *─────────────────────────────────────────────*/

export type CotizacionState = {
    /* Pasos previos */
    sucursalId:   string | null
    clienteRut:   string | null
    direccionId:  number | null

    /* Modo interfaz */
    isCreatingClient: boolean
    isEditing:        boolean
    showModal:        boolean

    /* Cotización seleccionada o en edición */
    cotizacionId: number | null          // Id de cotización elegida (si existe)
    draft:        Partial<DBCotizacion> | null

    /* Carrito / productos escogidos */
    items: DraftItem[]

    /* Totales calculados al vuelo */
    subtotal:          number
    iva:               number            // 19 % CL
    descuentoTotal:    number
    total:             number
}

/*─────────────────────────────────────────────*
 * 3.  Acciones
 *─────────────────────────────────────────────*/

export type CotizacionAction =
/* Pasos previos */
    | { type: 'SET_STORE';            payload: string }
    | { type: 'RESET_AFTER_STORE' }
    | { type: 'SET_CLIENT';           payload: string }
    | { type: 'SET_ADDRESS';          payload: number }

    /* Cotizaciones existentes / borradores */
    | { type: 'SET_QUOTE';            payload: number }          // seleccionar
    | { type: 'START_NEW_QUOTE' }                                // crear
    | { type: 'START_EDIT_QUOTE';     payload: DBCotizacion }    // editar
    | { type: 'UPDATE_DRAFT';         payload: Partial<DBCotizacion> }
    | { type: 'CANCEL_EDIT_QUOTE' }
    | { type: 'SAVE_DRAFT_OK';        payload: DBCotizacion }

    /* Productos */
    | { type: 'ADD_ITEM';             payload: DraftItem }
    | { type: 'UPDATE_ITEM';          payload: DraftItem }       // misma SKU+Sucursal
    | { type: 'REMOVE_ITEM';          payload: { sku: string; sucursalId: number } }
    | { type: 'CLEAR_ITEMS' }

    /* Modal detalle */
    | { type: 'OPEN_MODAL' } | { type: 'CLOSE_MODAL' }

    /* Clientes (modal) */
    | { type: 'OPEN_CREATE_CLIENT_MODAL' }
    | { type: 'CLOSE_CREATE_CLIENT_MODAL' }

/*─────────────────────────────────────────────*
 * 4.  Estado inicial
 *─────────────────────────────────────────────*/

export const initialState: CotizacionState = {
    sucursalId:        null,
    clienteRut:        null,
    direccionId:       null,

    isCreatingClient:  false,
    isEditing:         false,
    showModal:         false,

    cotizacionId:      null,
    draft:             null,

    items:             [],
    subtotal:          0,
    iva:               0,
    descuentoTotal:    0,
    total:             0,
}

/* Helper para totales */
const calcTotals = (items: DraftItem[]) => {
    const subtotal = items.reduce(
        (acc, it) => acc + it.precio * it.cantidad * (1 - (it.descuento ?? 0) / 100),
        0,
    )
    const iva            = subtotal * 0.19
    const descuentoTotal = items.reduce(
        (acc, it) => acc + it.precio * it.cantidad * ((it.descuento ?? 0) / 100),
        0,
    )
    return { subtotal, iva, descuentoTotal, total: subtotal + iva }
}

/*─────────────────────────────────────────────*
 * 5.  Reducer
 *─────────────────────────────────────────────*/

function cotizacionReducer (
    state: CotizacionState,
    action: CotizacionAction,
): CotizacionState {
    switch (action.type) {
        /*── Tienda ───────────────────────────────*/
        case 'SET_STORE':
            return {
                ...initialState,
                sucursalId: action.payload, // preserva tienda
            }

        case 'RESET_AFTER_STORE':
            return { ...initialState, sucursalId: state.sucursalId }

        /*── Cliente ──────────────────────────────*/
        case 'SET_CLIENT':
            return { ...state, clienteRut: action.payload }

        /*── Dirección ────────────────────────────*/
        case 'SET_ADDRESS':
            return { ...state, direccionId: action.payload }

        /*── Modal detalle ────────────────────────*/
        case 'OPEN_MODAL':
            return { ...state, showModal: true }
        case 'CLOSE_MODAL':
            return { ...state, showModal: false }

        /*── Flujo de cotización ──────────────────*/
        case 'SET_QUOTE':
            return { ...state, cotizacionId: action.payload, isEditing: false, draft: null }

        case 'START_NEW_QUOTE':
            return { ...state, isEditing: true, draft: {}, cotizacionId: null, items: [], ...calcTotals([]) }

        case 'START_EDIT_QUOTE': {
            // Normaliza cada item recibido → DraftItem
            const draftItems: DraftItem[] = action.payload.items?.map(i => ({
                sku:        i.producto_id ?? i.sku,
                nombre:     i.producto?.nombre      // ← intenta todas las variantes
                    ?? i.producto2?.nombre
                    ?? i.nombre
                    ?? '',              // nunca undefined
                sucursalId: i.sucursal_id,
                sucursal:   i.sucursal?.nombre
                    ?? i.sucursal2?.nombre
                    ?? '',
                cantidad:   i.cantidad,
                precio:     i.producto?.precio
                    ?? i.producto2?.precio
                    ?? i.precio_unitario
                    ?? 0,
                descuento:  i.descuento ?? 0,
            })) ?? []

            return {
                ...state,
                cotizacionId: action.payload.id,
                isEditing:    true,
                draft:        action.payload, // conservar todo por si lo usas
                items:        draftItems,
                ...calcTotals(draftItems),    // ahora el helper recibe DraftItem[]
            }
        }


        case 'UPDATE_DRAFT':
            return { ...state, draft: { ...state.draft, ...action.payload } }

        case 'CANCEL_EDIT_QUOTE':
            return { ...state, isEditing: false, draft: null, items: [] }

        case 'SAVE_DRAFT_OK':
            return {
                ...state,
                isEditing:    false,
                draft:        null,
                cotizacionId: action.payload.id,
            }

        /*── Productos / carrito ──────────────────*/
        case 'ADD_ITEM': {
            const exists = state.items.find(
                i => i.sku === action.payload.sku && i.sucursalId === action.payload.sucursalId,
            )
            const newItems = exists
                ? state.items.map(i =>
                    i.sku === action.payload.sku && i.sucursalId === action.payload.sucursalId
                        ? { ...i, cantidad: i.cantidad + action.payload.cantidad }
                        : i,
                )
                : [...state.items, action.payload]

            return { ...state, items: newItems, ...calcTotals(newItems) }
        }

        case 'UPDATE_ITEM': {
            const newItems = state.items.map(i =>
                i.sku === action.payload.sku && i.sucursalId === action.payload.sucursalId
                    ? action.payload
                    : i,
            )
            return { ...state, items: newItems, ...calcTotals(newItems) }
        }

        case 'REMOVE_ITEM': {
            const newItems = state.items.filter(
                i => !(i.sku === action.payload.sku && i.sucursalId === action.payload.sucursalId),
            )
            return { ...state, items: newItems, ...calcTotals(newItems) }
        }

        case 'CLEAR_ITEMS':
            return { ...state, items: [], ...calcTotals([]) }

        /*── Cliente modal ────────────────────────*/
        case 'OPEN_CREATE_CLIENT_MODAL':
            return { ...state, isCreatingClient: true }
        case 'CLOSE_CREATE_CLIENT_MODAL':
            return { ...state, isCreatingClient: false }

        /*── Default ──────────────────────────────*/
        default:
            return state
    }
}

/*─────────────────────────────────────────────*
 * 6.  Context  +  Provider
 *─────────────────────────────────────────────*/

const CotizacionContext = createContext<{
    state:    CotizacionState
    dispatch: React.Dispatch<CotizacionAction>
}>({
    state:    initialState,
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

export function useCotizacionFlow () {
    return useContext(CotizacionContext)
}
