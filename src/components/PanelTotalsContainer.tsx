// src/components/PanelTotalsContainer.tsx
'use client'
import { useMemo, useState } from 'react'
import { useCotizacionFlow } from '@/contexts/CotizacionFlow'
import PanelTotals           from '@/components/PanelTotals'
import type { DraftProducto } from '@/services/apiServices'
import {
    crearCotizacion,
    crearItemCotizacion,
} from '@/services/apiServices'

/** lee una variable de entorno o usa el host por defecto */
const BASE_FACTURACION =
    (process.env.NEXT_PUBLIC_FRONT_FACTURACION ??
        'https://facturacion.tssw.cl').trim()

export default function PanelTotalsContainer () {
    const { state /* , dispatch */ } = useCotizacionFlow()
    const productos: DraftProducto[] = state.productos

    /* ────────── totales — se recalculan con productos ────────── */
    const totals = useMemo(() => {
        const bruto      = productos.reduce((s, p) => s + p.precioUnit * p.cantidad, 0)
        const neto       = productos.reduce((s, p) => s + p.netoUnit   * p.cantidad, 0)
        const descuento  = bruto - neto
        const iva19      = Math.round(neto * 0.19)
        const despacho   = 0                                           // por ahora 0
        const totalFinal = neto + iva19 + despacho

        return {
            totalProductosNeto : neto,
            totalDespacho      : despacho,
            totalDescuento     : descuento,
            totalProductosIVA  : neto + iva19,
            totalCotizacion    : totalFinal,
            iva                : iva19,
        }
    }, [productos])

    /* ────────── guardar / pagar ────────── */
    const [saving,  setSaving ] = useState(false)
    const [lastId,  setLastId ] = useState<number | null>(null)

    /** Guarda cabecera + ítems */
    const handleGuardar = async () => {
        if (saving) return
        try {
            setSaving(true)

            /* usuario desde localStorage */
            let usuario: { email?: string } = {}
            if (typeof window !== 'undefined') {
                usuario = JSON.parse(localStorage.getItem('user') ?? '{}')
            }

            /* cabecera */
            const cabecera = {
                rut_cliente  : state.clienteRut!,
                user_id      : usuario.email ?? '',
                tipo_despacho: state.cotizacionSeleccionada?.tipo_despacho
                    ?? state.draftQuote?.tipo_despacho
                    ?? 'a domicilio',
                costo_envio  : totals.totalDespacho,
                descripcion  : state.cotizacionSeleccionada?.descripcion
                    ?? state.draftQuote?.descripcion
                    ?? '',
            }

            /* 1️⃣  Crear cabecera */
            const { id: newId } = await crearCotizacion(cabecera)

            /* 2️⃣  Crear líneas */
            await Promise.all(
                productos.map(p =>
                    crearItemCotizacion(newId, {
                        producto_id: p.sku,
                        sucursal_id: p.sucursalId,
                        cantidad   : p.cantidad,
                    }),
                ),
            )

            setLastId(newId)
            alert(`Cotización #${newId} creada correctamente`)
            // aquí podrías despachar acción para refrescar estado global

        } catch (e) {
            console.error(e)
            alert('No se pudo crear la cotización. Revisa consola.')
        } finally {
            setSaving(false)
        }
    }

    /** Redirige a facturación */
    const handlePagar = () => {
        if (!lastId) {
            alert('Debes confirmar la cotización antes de pagar')
            return
        }
        window.location.href = `${BASE_FACTURACION.replace(/\/$/, '')}/${lastId}`
    }

    return (
        <PanelTotals
            quotation={totals}
            cotizacionId={lastId ?? undefined}
            onGuardar={handleGuardar}
            onPagar={handlePagar}
        />
    )
}
