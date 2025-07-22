/* src/contexts/CotizacionFlow.tsx */
'use client'
import React, {
    createContext,
    useReducer,
    useContext,
    ReactNode,
} from 'react'

import {
    adaptToDBCotizacion,
    CotizacionCheckout,
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
    modal:{
        tipo:"detalle"|null
        data: DBCotizacion | CotizacionCheckout | null
    }

    /* 💡 Cabecera actualmente seleccionada */
    cotizacionSeleccionada: Partial<CotizacionCheckout> | null
}

/* ──────────────────────────────────
 * 2.  ACTIONS
 * ───────────────────────────────── */
export type CotizacionAction =
    | { type:'SET_STORE';  payload:number }
    | { type:'RESET_AFTER_STORE' }
|{ type: 'NUEVA_COTIZACION' }


| { type:'SET_CLIENT'; payload:string }
    | { type:'SET_ADDRESS'; payload:number }

    | { type:'SET_QUOTE'; payload:number; historial?:DBCotizacion[] }  // 👈 añadido `historial`
    | { type:'NEW_COTIZACION'; payload:null } // para limpiar la selección
    | { type:'START_NEW_QUOTE' }
    | { type:'START_EDIT_QUOTE'; payload:DBCotizacion }
    | { type:'UPDATE_DRAFT';     payload:Partial<DBCotizacion> }
    | { type:'SAVE_DRAFT_OK';    payload:CotizacionCheckout }
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
    | { type: 'REMOVE_PRODUCT'; payload: DraftProducto}
    | { type: "SET_COTIZACION_ID"; payload: number }
    | { type: "SET_COTIZACION_SELECCIONADA"; payload: CotizacionCheckout }
    | { type: "LIMPIAR_COTIZACION" } // opcional para limpiar ambos
    // puedes añadir más acciones según lo que necesites:
    | { type: "ABRIR_MODAL_DETALLE"; payload: DBCotizacion | CotizacionCheckout }
    | { type: "CERRAR_MODAL" }
    | { type: "SET_LOCAL_QUOTES"; payload: DBCotizacion[] };

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
    modal: {
        tipo: null,
        data: null,
    },
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
        case 'SAVE_DRAFT_OK': {
            const checkout = action.payload            // CotizacionCheckout
            const dbc      = adaptToDBCotizacion(checkout) // ← usa tu helper inverso

            return {
                ...state,
                localQuotes: [dbc, ...state.localQuotes], // ① ahora es DBCotizacion
                cotizacionId: dbc.id,
                cotizacionSeleccionada: checkout,         // ok, la vista de detalle
                isCreating: false,                        // ② deja de editar
                draftQuote: null,
            }
        }

        case 'UPDATE_DRAFT':
            return { ...state, draftQuote: { ...state.draftQuote, ...action.payload } }




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

        case 'UPDATE_PRODUCT':
            return {
                ...state,
                productos: state.productos.map(p =>
                    p.sku === action.payload.sku ? action.payload : p),
            }

        case 'REMOVE_PRODUCT':
            return {
                ...state,
                productos: state.productos.filter(p =>
                    !(
                        p.sku === action.payload.sku &&
                        p.origen === action.payload.origen &&
                        p.sucursalId === action.payload.sucursalId &&
                        p.cantidad === action.payload.cantidad &&
                        p.precioUnit === action.payload.precioUnit &&
                        p.descuento === action.payload.descuento &&
                        p.netoUnit === action.payload.netoUnit &&
                        p.total === action.payload.total &&
                        p.nombre === action.payload.nombre
                    )
                )
            };


        case "ADD_USER_TO_CONTEXT":{
            return {
                ...state,
                usuario: action.payload,
            }
        }
        case "SET_COTIZACION_ID":
            return { ...state, cotizacionId: action.payload };

        case "SET_COTIZACION_SELECCIONADA":
            return { ...state, cotizacionSeleccionada: action.payload };

        case "SET_LOCAL_QUOTES":
            return { ...state, localQuotes: action.payload };
        case 'NUEVA_COTIZACION':
            return {
                ...state,
                isCreating: true,
                cotizacionSeleccionada: null,
                draftQuote: {},
            };

        case "LIMPIAR_COTIZACION":
            return { ...state, cotizacionId: null, cotizacionSeleccionada: null };
        /* Otros casos (modales, edición)… */
        case 'OPEN_MODAL':               return { ...state, showModal:true  }
        case 'CLOSE_MODAL':              return { ...state, showModal:false }
        case 'OPEN_CREATE_CLIENT_MODAL': return { ...state, isCreatingClient:true }
        case 'CLOSE_CREATE_CLIENT_MODAL':return { ...state, isCreatingClient:false }
        case "ABRIR_MODAL_DETALLE":
            return { ...state, modal: { tipo: "detalle", data: action.payload } };

        case "CERRAR_MODAL":
            return { ...state, modal: { tipo: null, data: null } };

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