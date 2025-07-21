/* src/contexts/CotizacionFlow.tsx */
'use client'
import React, {
    createContext,
    useReducer,
    useContext,
    ReactNode,
} from 'react'

import {
    DBCotizacion, DBUsuario,
    DraftProducto,
} from '@/services/apiServices'

/* ──────────────────────────────────
 * 1.  STATE
 * ───────────────────────────────── */
export type CotizacionState = {
    /* Paso 1 – Sucursal */
    sucursalId: number | null
    usuario: Partial<DBUsuario> | null
    /* Tabla de productos elegidos */
    productos: DraftProducto[]

    /* Paso 2 – Cliente */
    clienteRut: string | null

    /* Paso 3 – Cotización: id seleccionado  */
    cotizacionId: number | null

    /* Paso 4 – Dirección */
    direccionId: number | null

    /* Bandeja de creación / edición */
    isEditing:  boolean
    isCreating: boolean
    draftQuote: Partial<DBCotizacion> | null
    localQuotes: DBCotizacion[]
    showModal:   boolean

    /* Modal cliente */
    isCreatingClient: boolean

    /* 💡 Cabecera actualmente seleccionada */
    cotizacionSeleccionada: Partial<DBCotizacion> | null
}

/* ──────────────────────────────────
 * 2.  ACTIONS
 * ───────────────────────────────── */
export type CotizacionAction =
    | { type:'SET_STORE';  payload:number }
    | { type:'RESET_AFTER_STORE' }

    | { type:'SET_CLIENT'; payload:string }
    | { type:'SET_ADDRESS'; payload:number }

    | { type:'SET_QUOTE'; payload:number; historial?:DBCotizacion[] }  // 👈 añadido `historial`
    | { type:'START_NEW_QUOTE' }
    | { type:'START_EDIT_QUOTE'; payload:DBCotizacion }
    | { type:'UPDATE_DRAFT';     payload:Partial<DBCotizacion> }
    | { type:'SAVE_DRAFT_OK';    payload:DBCotizacion }
    | { type:'CANCEL_EDIT_QUOTE' }
    | { type:'CANCEL_NEW_QUOTE' }
    | { type:'SAVE_QUOTE_SUCCESS'; payload:number }

    | { type:'OPEN_MODAL' }
    | { type:'CLOSE_MODAL' }
    | {type: 'ADD_USER_TO_CONTEXT'; payload:Partial<DBUsuario> }

    | { type:'OPEN_CREATE_CLIENT_MODAL' }
    | { type:'CLOSE_CREATE_CLIENT_MODAL' }

    /* tabla productos */
    | { type:'ADD_PRODUCT';    payload:DraftProducto }
    | { type:'UPDATE_PRODUCT'; payload:DraftProducto }
    | { type:'REMOVE_PRODUCT'; payload:string }

/* ──────────────────────────────────
 * 3.  INITIAL STATE
 * ───────────────────────────────── */
const initialState: CotizacionState = {
    sucursalId:           null,
    usuario: null,
    productos:            [],
    clienteRut:           null,
    cotizacionId:         null,
    direccionId:          null,

    isEditing:            false,
    isCreating:           true,
    draftQuote:           null,
    localQuotes:          [],
    showModal:            false,

    isCreatingClient:     false,
    cotizacionSeleccionada:null,
}

/* ──────────────────────────────────
 * 4.  REDUCER
 * ───────────────────────────────── */
function cotizacionReducer (
    state: CotizacionState,
    action: CotizacionAction,
): CotizacionState {
    switch (action.type) {
        /* Paso 1 – Sucursal */
        case 'SET_STORE':
            return { ...initialState, sucursalId: action.payload }

        case 'RESET_AFTER_STORE':
            return { ...initialState, sucursalId: state.sucursalId }

        /* Paso 2 – Cliente */
        case 'SET_CLIENT':
            return {
                ...state,
                clienteRut: action.payload,
                cotizacionId: null,
                cotizacionSeleccionada: null,
            }

        /* Paso 3 – Dirección */
        case 'SET_ADDRESS':
            return { ...state, direccionId: action.payload }

        /* Crear borrador */
        case 'START_NEW_QUOTE':
            return {
                ...state,
                isCreating:true,
                draftQuote:{
                    descripcion:   '',
                    tipo_despacho:'a domicilio',
                    costo_envio:   0,
                },
            }

        case 'CANCEL_NEW_QUOTE':
            return { ...state, isCreating:false, draftQuote:null }

        /* Guardar borrador local */
        case 'SAVE_DRAFT_OK':
            return {
                ...state,
                localQuotes:[action.payload, ...state.localQuotes],
                cotizacionId: action.payload.id,
                cotizacionSeleccionada: action.payload,
                isCreating:false,
                draftQuote:null,
                usuario:{}
            }

        /* Tabla de productos */case 'ADD_PRODUCT': {
            const existing = state.productos.find(p =>
                p.sku === action.payload.sku &&
                p.sucursalId === action.payload.sucursalId &&
                p.origen === action.payload.origen
            );

            if (existing) {
                const nuevosProductos = state.productos.map(p => {
                    if (
                        p.sku === action.payload.sku &&
                        p.sucursalId === action.payload.sucursalId &&
                        p.origen === action.payload.origen
                    ) {
                        const nuevaCantidad = p.cantidad + action.payload.cantidad;
                        return {
                            ...p,
                            cantidad: nuevaCantidad,
                            total: p.netoUnit * nuevaCantidad
                        };
                    }
                    return p;
                });

                return {
                    ...state,
                    productos: nuevosProductos
                };
            }
            // Si no existe, agregarlo como nuevo
            return {
                ...state,
                productos: [...state.productos, action.payload]
            };


        }

        case 'UPDATE_DRAFT': {
            const merged = { ...state.draftQuote, ...action.payload }
            return { ...state, draftQuote: merged, cotizacionSeleccionada: merged }
        }

        case 'UPDATE_PRODUCT':
            return {
                ...state,
                productos: state.productos.map(p =>
                    p.sku === action.payload.sku ? action.payload : p),
            }

        case 'REMOVE_PRODUCT':
            return { ...state, productos: state.productos.filter(p => p.sku !== action.payload) }

        /* Seleccionar cabecera existente */
        case 'SET_QUOTE': {
            const id = action.payload
            if (!id) {
                return { ...state, cotizacionId:null, cotizacionSeleccionada:null }
            }
            const fuente = [...state.localQuotes, ...(action.historial ?? [])]
            const seleccionada = fuente.find(c => c.id === id) ?? null
            return { ...state, cotizacionId:id, cotizacionSeleccionada:seleccionada }
        }
        case "ADD_USER_TO_CONTEXT":{
            return {
                ...state,
                usuario: action.payload,
            }
        }

        /* Otros casos (modales, edición)… */
        case 'OPEN_MODAL':               return { ...state, showModal:true  }
        case 'CLOSE_MODAL':              return { ...state, showModal:false }
        case 'OPEN_CREATE_CLIENT_MODAL': return { ...state, isCreatingClient:true }
        case 'CLOSE_CREATE_CLIENT_MODAL':return { ...state, isCreatingClient:false }

        /* Default */
        default: return state
    }
}

/* ──────────────────────────────────
 * 5.  CONTEXT & PROVIDER
 * ───────────────────────────────── */
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

/* ──────────────────────────────────
 * 6.  HOOK
 * ───────────────────────────────── */
export function useCotizacionFlow () {
    return useContext(CotizacionContext)
}

/* ──────────────────────────────────
 * 7.  Helpers (por si los necesitas)
 * ───────────────────────────────── */
export function calcTotals (productos: DraftProducto[]) {
    const subtotal       = productos.reduce((s, i) => s + i.precioUnit * i.cantidad, 0)
    const descuentoTotal = productos.reduce((s, i) => s + i.descuento   * i.cantidad, 0)
    return {
        subtotal,
        descuentoTotal,
        total: subtotal - descuentoTotal,
    }
}