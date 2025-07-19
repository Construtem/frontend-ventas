// src/components/PanelTotalsContainer.tsx
'use client'
import { useMemo }          from 'react'
import { useCotizacionFlow } from '@/contexts/CotizacionFlow'
import PanelTotals           from '@/components/PanelTotals'

export default function PanelTotalsContainer () {
    const { state } = useCotizacionFlow()
    const productos = state.productos     // ← DraftProducto[]

    /* ─── calcula totales cada vez que cambian los productos ─── */
    const totals = useMemo(() => {
        const bruto      = productos.reduce((s, p) => s + p.precioUnit * p.cantidad, 0)
        const neto       = productos.reduce((s, p) => s + p.netoUnit   * p.cantidad, 0)
        const descuento  = bruto - neto
        const iva19      = Math.round(neto * 1.19)         // total con IVA
        const despacho   = 3990                            // ← valor fijo (placeholder)

        return {
            totalProductosNeto : neto,
            totalDespacho      : despacho,
            totalDescuento     : descuento,
            totalProductosIVA  : iva19,
            totalCotizacion    : iva19 + despacho,
        }
    }, [productos])

    /* Opcional: handlers de Guardar / Pagar */
    const handleGuardar = () => {
        console.log('El contenido en el contexto es el siguiente:..........')
        console.log(JSON.stringify(state, null, 2))
    }
    const handlePagar = () => {
        console.log('Ir a flujo de pago…')
    }

    return (
        <PanelTotals
            quotation={totals}
            onGuardar={handleGuardar}
            onPagar={handlePagar}
        />
    )
}
