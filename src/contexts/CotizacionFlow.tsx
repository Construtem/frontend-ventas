
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

/* ──────────────────────────────────────────────────────────
 * 2.  Shape del estado global del flujo
 * ──────────────────────────────────────────────────────────*/
export type CotizacionState = {
    /* Paso 1: tienda */
    sucursalId: string | null

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
    | { type: 'UPDATE_DRAFT';         payload: Partial<DBCotizacion> }
    | { type: 'CANCEL_EDIT_QUOTE' }
    | { type: 'SAVE_QUOTE_SUCCESS';   payload: number }   // backend devuelve id

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

    isEditing:         false,
    draft:             null,

    isCreatingClient:  false,
}

/* ──────────────────────────────────────────────────────────
 * 5.  Reducer
 * ──────────────────────────────────────────────────────────*/
function cotizacionReducer (
    state: CotizacionState,
    action: CotizacionAction
): CotizacionState {
    switch (action.type) {

        /* ─── Tienda ───────────────────────────────────────*/
        case 'SET_STORE':
            return {
                ...state,
                sucursalId: action.payload,

                // resetea todo lo que depende de la tienda
                clienteRut:   null,
                cotizacionId: null,
                direccionId:  null,
                isEditing:    false,
                draft:        null,
            }

        case 'RESET_AFTER_STORE':
            // útil si cambias sucursal desde otra parte
            return { ...initialState, sucursalId: state.sucursalId }

        /* ─── Cliente ──────────────────────────────────────*/
        case 'SET_CLIENT':
            return {
                ...state,
                clienteRut: action.payload,

                // limpio selección de cotización / dirección
                cotizacionId: null,
                direccionId:  null,
                isEditing:    false,
                draft:        null,
            }

        /* ─── Dirección ────────────────────────────────────*/
        case 'SET_ADDRESS':
            return { ...state, direccionId: action.payload }

        /* ─── Selección de cotización existente ────────────*/
        case 'SET_QUOTE':
            return {
                ...state,
                cotizacionId: action.payload,
                isEditing:    false,
                draft:        null,
            }

        /* ─── Crear nueva ──────────────────────────────────*/
        case 'START_NEW_QUOTE':
            return {
                ...state,
                cotizacionId: null,
                isEditing:    true,
                draft:        {},     // borrador vacío
            }

        /* ─── Editar existente ─────────────────────────────*/
        case 'START_EDIT_QUOTE':
            return {
                ...state,
                cotizacionId: action.payload.id,
                isEditing:    true,
            }

        /* ─── Actualizar campos del borrador ───────────────*/
        case 'UPDATE_DRAFT':
            return {
                ...state,
                draft: { ...state.draft, ...action.payload },
            }

        /* ─── Cancelar edición / creación ──────────────────*/
        case 'CANCEL_EDIT_QUOTE':
            return {
                ...state,
                isEditing: false,
                draft:     null,
            }

        /* ─── Guardado exitoso ─────────────────────────────*/
        case 'SAVE_QUOTE_SUCCESS':
            return {
                ...state,
                cotizacionId: action.payload,
                isEditing:    false,
                draft:        null,
            }

        /* ─── Modal crear cliente ──────────────────────────*/
        case 'OPEN_CREATE_CLIENT_MODAL':
            return { ...state, isCreatingClient: true }

        case 'CLOSE_CREATE_CLIENT_MODAL':
            return { ...state, isCreatingClient: false }

        /* ─── Default ──────────────────────────────────────*/
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
