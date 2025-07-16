'use client'
// src/contexts/CotizacionFlow.tsx
import React, {
    createContext,
    useReducer,
    useContext,
    ReactNode
} from 'react';

//
// 1) Define el shape de tu estado
//
export type CotizacionState = {
    // Paso 1: Tienda seleccionada
    sucursalId:   string | null;

    // Paso 2: Cliente seleccionado
    clienteRut:    string | null;

    // Paso 3: Dirección de despacho
    direccionId:  number | null;

    // Modal para crear cliente
    isCreatingClient: boolean;

    // (Más adelante) Borrador de cotización
    // products: Array<{ sku: string; cantidad: number; precio: number }>;
    // shippingCost: number | null;
    // totals: { subtotal: number; iva: number; total: number } | null;
};

//
// 2) Define tus actions
//
export type CotizacionAction =
    | { type: 'SET_STORE';           payload: string }
    | { type: 'SET_CLIENT';          payload: string }
    | { type: 'RESET_AFTER_STORE' }
    | { type: 'SET_ADDRESS';         payload: number }
    | { type: 'OPEN_CREATE_CLIENT_MODAL' }
    | { type: 'CLOSE_CREATE_CLIENT_MODAL' }
// → más adelante: ADD_PRODUCT, REMOVE_PRODUCT, SET_SHIPPING_COST, CALC_TOTALS, etc.

//
// 3) Estado inicial
//
const initialState: CotizacionState = {
    sucursalId:       null,
    clienteRut:        null,
    direccionId:      null,
    isCreatingClient: false,
};

//
// 4) Reducer
//
function cotizacionReducer(
    state: CotizacionState,
    action: CotizacionAction
): CotizacionState {
    switch (action.type) {
        case 'SET_STORE':
            return {
                ...state,
                sucursalId: action.payload,
                // Si cambias de tienda, resetea los pasos posteriores:
                clienteRut:        null,
                direccionId:      null,
                // products:         [],
                // shippingCost:     null,
                // totals:           null,
            };

        case 'RESET_AFTER_STORE':
            return {
                ...state,
                clienteRut:    null,
                direccionId:  null,
                // products:     [],
                // shippingCost: null,
                // totals:       null,
            };

        case 'SET_CLIENT':
            return {
                ...state,
                clienteRut: action.payload,
                // cuando elijo cliente, limpia las direcciones si quieres forzar a re-seleccionar:
                direccionId: null,
            };

        case 'SET_ADDRESS':
            return {
                ...state,
                direccionId: action.payload,
            };

        case 'OPEN_CREATE_CLIENT_MODAL':
            return {
                ...state,
                isCreatingClient: true,
            };

        case 'CLOSE_CREATE_CLIENT_MODAL':
            return {
                ...state,
                isCreatingClient: false,
            };

        default:
            return state;
    }
}

//
// 5) Crea el contexto
//
const CotizacionContext = createContext<{
    state:    CotizacionState;
    dispatch: React.Dispatch<CotizacionAction>;
}>({
    state:    initialState,
    dispatch: () => null
});

//
// 6) Provider
//
export function CotizacionProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(cotizacionReducer, initialState);
    return (
        <CotizacionContext.Provider value={{ state, dispatch }}>
            {children}
        </CotizacionContext.Provider>
    );
}

//
// 7) Hook de conveniencia
//
export function useCotizacionFlow() {
    return useContext(CotizacionContext);
}
