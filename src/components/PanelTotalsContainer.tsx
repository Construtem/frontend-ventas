// src/components/PanelTotalsContainer.tsx
'use client'
import { useMemo }                from 'react'
import { useCotizacionFlow }      from '@/contexts/CotizacionFlow'
import PanelTotals                from '@/components/PanelTotals'
import type { DraftProducto }     from '@/services/apiServices'

export default function PanelTotalsContainer () {
    const { state /* , dispatch */ } = useCotizacionFlow()

    /* ———————————————————————————————————————————
     * 1.  Productos y totales
     * ——————————————————————————————————————————— */
    const productos: DraftProducto[] = state.productos

    const totals = useMemo(() => {
        const bruto       = productos.reduce((s, p) => s + p.precioUnit * p.cantidad, 0)
        const neto        = productos.reduce((s, p) => s + p.netoUnit   * p.cantidad, 0)
        const descuento   = bruto - neto
        const iva19       = Math.round(neto * 0.19)
        const despacho    = 3990                                   // placeholder
        const totalFinal  = neto + iva19 + despacho

        return {
            totalProductosNeto : neto,
            totalDespacho      : despacho,
            totalDescuento     : descuento,
            totalProductosIVA  : neto + iva19,
            totalCotizacion    : totalFinal,
            iva                : iva19
        }
    }, [productos])

    /* ———————————————————————————————————————————
     * 2.  Handler "Guardar"
     *     → arma la cotización final *ordenada*
     * ——————————————————————————————————————————— */
    const handleGuardar = () => {
        /* usuario log-in guardado en localStorage (fallback) */
        let usuario: { nombre?: string; email?: string } = {}
        if (typeof window !== 'undefined') {
            try {
                usuario = JSON.parse(localStorage.getItem('user') ?? '{}')
            } catch { /* ignore */ }
        }

        /* cabecera mínima */
        const cabecera = {
            sucursal_id   : state.sucursalId,
            cliente_rut   : state.clienteRut,
            tipo_despacho : state.cotizacionSeleccionada?.tipo_despacho ?? state.draftQuote?.tipo_despacho ?? 'a domicilio',
            descripcion   : state.cotizacionSeleccionada?.descripcion   ?? state.draftQuote?.descripcion   ?? '',
            direccion_id  : state.cotizacionSeleccionada?.direccionId  ?? state.direccionId ?? null,
            user_id       : usuario.email ?? '',
            costo_envio   : totals.totalDespacho,
            estado        : 'pendiente'
        }

        /* líneas normalizadas */
        const items = productos.map(p => ({
            sku         : p.sku,
            producto_id : p.sku,
            sucursal_id : p.sucursalId,
            cantidad    : p.cantidad,
            precio_unit : p.precioUnit,
            descuento   : p.descuento
        }))

        /* objeto final listo para POST /cotizaciones */
        const cotizacionFinal = {
            ...cabecera,
            totales : {
                subtotal_neto   : totals.totalProductosNeto,
                descuento       : totals.totalDescuento,
                iva             : totals.iva,
                despacho        : totals.totalDespacho,
                total_cotizacion: totals.totalCotizacion
            },
            items,
            usuario
        }

        // TODO: aquí podrías despachar una acción para
        //       guardar este objeto en tu contexto o
        //       llamar al endpoint:
        //
        // dispatch({ type: 'CONFIRMAR_COTIZACION', payload: cotizacionFinal })
        // ó await api.crearCotizacion(cotizacionFinal)

        console.log('⎯⎯ Cotización lista para enviar ⎯⎯')
        console.log(JSON.stringify(cotizacionFinal, null, 2))
    }

    const handlePagar = () => {
        console.log('→ Ir a flujo de pago (a implementar)…')
    }

    return (
        <PanelTotals
            quotation={totals}
            onGuardar={handleGuardar}
            onPagar={handlePagar}
        />
    )
}
