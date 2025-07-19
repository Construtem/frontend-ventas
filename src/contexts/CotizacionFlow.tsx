// src/contexts/CotizacionFlow.tsx
'use client'
import React, {
    createContext,
    useReducer,
    useContext,
    ReactNode,
} from 'react'

import {
    DBCotizacion,
    DraftItem,
    DraftProducto,       // ← nuevo tipo
} from '@/services/apiServices'

/* ──────────────────────────────────────────────
 * 1.  STATE
 * ──────────────────────────────────────────── */
export type CotizacionState = {
    /* Paso 1 – Sucursal elegida                   */
    sucursalId: number | null                    // ← era string | null

    /* Productos seleccionados (tabla de productos)*/
    productos: DraftProducto[]                   // ← nuevo

    /* Paso 2 – Cliente                            */
    clienteRut: string | null

    /* Paso 3 – Cotización (existing / draft)      */
    cotizacionId: number | null
    items:       DraftItem[]                     // items del formulario de cotización

    /* Paso 4 – Dirección                          */
    direccionId: number | null

    /* Bandeja de edición / creación de cotización */
    isEditing:   boolean
    isCreating:  boolean
    draftQuote:  Partial<DBCotizacion> | null
    localQuotes: DBCotizacion[]
    showModal:   boolean

    /* Modal crear cliente                         */
    isCreatingClient: boolean
}

/* ──────────────────────────────────────────────
 * 2.  ACTIONS
 * ──────────────────────────────────────────── */
export type CotizacionAction =
    | { type:'SET_STORE';                 payload:number }           // número de sucursal
    | { type:'RESET_AFTER_STORE' }

    | { type:'SET_CLIENT';                payload:string }

    | { type:'SET_ADDRESS';               payload:number }

    | { type:'SET_QUOTE';                 payload:number }
    | { type:'START_NEW_QUOTE' }
    | { type:'START_EDIT_QUOTE';          payload:DBCotizacion }
    | { type:'UPDATE_DRAFT';              payload:Partial<DBCotizacion> }
    | { type:'SAVE_DRAFT_OK';             payload:DBCotizacion }
    | { type:'CANCEL_EDIT_QUOTE' }
    | { type:'CANCEL_NEW_QUOTE' }
    | { type:'SAVE_QUOTE_SUCCESS';        payload:number }

    | { type:'OPEN_MODAL' }
    | { type:'CLOSE_MODAL' }

    | { type:'OPEN_CREATE_CLIENT_MODAL' }
    | { type:'CLOSE_CREATE_CLIENT_MODAL' }

    /* Tabla de productos (nuevo flujo) */
    | { type:'ADD_PRODUCT';               payload:DraftProducto }
    | { type:'UPDATE_PRODUCT';            payload:DraftProducto }
    | { type:'REMOVE_PRODUCT';            payload:string }           // sku

/* ──────────────────────────────────────────────
 * 3.  INITIAL STATE
 * ──────────────────────────────────────────── */
const initialState: CotizacionState = {
    sucursalId:       null,
    productos:        [],

    clienteRut:       null,
    cotizacionId:     null,
    direccionId:      null,

    items:            [],

    isEditing:        false,
    isCreating:       false,
    draftQuote:       null,
    localQuotes:      [],
    showModal:        false,

    isCreatingClient: false,
}

/* ──────────────────────────────────────────────
 * 4.  REDUCER
 * ──────────────────────────────────────────── */
function cotizacionReducer (
    state: CotizacionState,
    action: CotizacionAction,
): CotizacionState {
    switch (action.type) {
        /* ─── Paso 1 :  Sucursal ─────────────────── */
        case 'SET_STORE':
            return {
                ...initialState,                // limpia todo
                sucursalId: action.payload,
            }

        case 'RESET_AFTER_STORE':
            return { ...initialState, sucursalId: state.sucursalId }

        /* ─── Paso 2 :  Cliente ──────────────────── */
        case 'SET_CLIENT':
            return {
                ...state,
                clienteRut:   action.payload,
                cotizacionId: null,
                direccionId:  null,
                isEditing:    false,
                isCreating:   false,
                draftQuote:   null,
            }

        /* ─── Paso 3 :  Dirección ────────────────── */
        case 'SET_ADDRESS':
            return { ...state, direccionId: action.payload }

        /* ─── Seleccionar / crear / editar quote ─── */
        case 'SET_QUOTE':
            return { ...state, cotizacionId: action.payload, isEditing:false, isCreating:false }

        case 'START_NEW_QUOTE':
            return {
                ...state,
                isCreating:true,
                draftQuote:{
                    descripcion:'',
                    tipo_despacho:'retiro',
                    costo_envio:0,
                },
            }

        case 'CANCEL_NEW_QUOTE':
            return { ...state, isCreating:false, draftQuote:null }

        case 'START_EDIT_QUOTE': {
            const draftItems: DraftItem[] = action.payload.items?.map(i => ({
                sku:        i.producto_id ?? i.sku,
                nombre:     i.producto?.nombre ?? i.producto2?.nombre ?? i.nombre ?? '',
                sucursalId: i.sucursal_id,
                sucursal:   i.sucursal?.nombre ?? i.sucursal2?.nombre ?? '',
                cantidad:   i.cantidad,
                precio:     i.producto?.precio ?? i.producto2?.precio ?? i.precio_unitario ?? 0,
                descuento:  i.descuento ?? 0,
            })) ?? []

            return {
                ...state,
                cotizacionId: action.payload.id,
                isEditing:    true,
                draftQuote:   action.payload,
                items:        draftItems,
                ...calcTotals(draftItems),
            }
        }

        case 'UPDATE_DRAFT':
            return { ...state, draftQuote:{...state.draftQuote, ...action.payload} }

        case 'SAVE_DRAFT_OK':
            return {
                ...state,
                localQuotes:[action.payload, ...state.localQuotes],
                cotizacionId: action.payload.id,
                isCreating:false,
                isEditing:false,
                draftQuote:null,
            }

        case 'CANCEL_EDIT_QUOTE':
            return { ...state, isEditing:false, draftQuote:null }

        /* ─── Modal detalle ──────────────────────── */
        case 'OPEN_MODAL':  return { ...state, showModal:true  }
        case 'CLOSE_MODAL': return { ...state, showModal:false }

        /* ─── Modal crear cliente ─────────────────── */
        case 'OPEN_CREATE_CLIENT_MODAL':  return { ...state, isCreatingClient:true }
        case 'CLOSE_CREATE_CLIENT_MODAL': return { ...state, isCreatingClient:false }

        /* ─── Tabla de productos (nuevo) ─────────── */
        case 'ADD_PRODUCT': {
            /* si ya existe ese SKU lo sustituimos */
            const ya = state.productos.find(p => p.sku === action.payload.sku)
            const productos = ya
                ? state.productos.map(p => p.sku === ya.sku ? action.payload : p)
                : [...state.productos, action.payload]

            return { ...state, productos }
        }

        case 'UPDATE_PRODUCT':
            return {
                ...state,
                productos: state.productos.map(p =>
                    p.sku === action.payload.sku ? action.payload : p),
            }

        case 'REMOVE_PRODUCT':
            return {
                ...state,
                productos: state.productos.filter(p => p.sku !== action.payload),
            }

        /* ─── Default ────────────────────────────── */
        default:
            return state
    }
}

/* ──────────────────────────────────────────────
 * 5.  CONTEXT & PROVIDER
 * ──────────────────────────────────────────── */
const CotizacionContext = createContext<{
    state: CotizacionState
    dispatch: React.Dispatch<CotizacionAction>
}>({
    state: initialState,
    dispatch: () => undefined,
})

export function CotizacionProvider ({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(cotizacionReducer, initialState)
    return (
        <CotizacionContext.Provider value={{ state, dispatch }}>
            {children}
        </CotizacionContext.Provider>
    )
}

/* ──────────────────────────────────────────────
 * 6.  HOOK
 * ──────────────────────────────────────────── */
export function useCotizacionFlow () {
    return useContext(CotizacionContext)
}

/* ──────────────────────────────────────────────
 * 7.  Helpers
 * ──────────────────────────────────────────── */
function calcTotals (items: DraftItem[]) {
    const subtotal        = items.reduce((s, i) => s + i.precio * i.cantidad, 0)
    const descuentoTotal  = items.reduce((s, i) => s + i.descuento * i.cantidad, 0)
    return {
        subtotal,
        descuentoTotal,
        total: subtotal - descuentoTotal,
    }
}
