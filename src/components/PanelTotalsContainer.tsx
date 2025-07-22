// src/components/PanelTotalsContainer.tsx
'use client'

import { useMemo, useState } from 'react'
import { useCotizacionFlow } from '@/contexts/CotizacionFlow'
import PanelTotals           from '@/components/PanelTotals'
import type { DraftProducto } from '@/services/apiServices'
import {
    crearCotizacion,
    crearItemCotizacion,
    calcularDespacho,
    actualizarDatosCotizacion,   // helper genérico PUT
} from '@/services/apiServices'

/** Lee la URL de facturación desde env o usa el host por defecto */
const BASE_FACTURACION =
    (process.env.NEXT_PUBLIC_FRONT_FACTURACION ?? 'https://facturacion.tssw.cl').trim()

export default function PanelTotalsContainer () {
    const { state } = useCotizacionFlow()
    const productos: DraftProducto[] = state.productos

    /* ——— costo de despacho en UI (parte en 0) ——— */
    const [despacho, setDespacho] = useState<number>(0);

    /* ——— totales (recalcula cuando cambian productos o despacho) ——— */
    const totals = useMemo(() => {
        /* 1 · Sub-total = precio base sin descuento */
        const subtotal = productos.reduce(
            (s, p) => s + p.precioUnit * p.cantidad,
            0,
        );

        /* 2 · Descuento acumulado (en pesos) */
        const descuento = productos.reduce(
            (s, p) => s + (p.precioUnit - p.netoUnit) * p.cantidad,
            0,
        );

        /* 3 · Despacho: si aún no existe usa 0 */
        const d = despacho ?? 0;

        /* 4 · Base imponible + IVA + Total */
        const base     = subtotal + d - descuento;          // (subtotal + despacho − descuento)
        const iva      = Math.round(base * 0.19);           // IVA 19 %
        const totalFin = base + iva;                        // (…)*1.19

        return {
            /** Etiquetas que ya consume tu <PanelTotals> */
            totalProductosNeto : subtotal,    // Sub-total (sin descuento)
            totalDespacho      : d,           // Despacho
            totalDescuento     : descuento,   // Descuento
            iva                : iva,         // IVA 19 %
            totalCotizacion    : totalFin,    // Total
        };
    }, [productos, despacho]);


    /* ——— flags y refs ——— */
    const [saving, setSaving]   = useState(false)
    const [lastId, setLastId]   = useState<number | null>(null)

    /* ——— guardar cotización + ítems + despacho ——— */
    const handleGuardar = async () => {
        if (saving) return
        try {
            setSaving(true)

            /* 1 · cabecera preliminar (sin despacho real) */
            const usuario = typeof window !== 'undefined'
                ? JSON.parse(localStorage.getItem('user') ?? '{}')
                : {}

            const cabecera = {
                rut_cliente  : state.clienteRut!,
                user_id      : usuario.email ?? '',
                tipo_despacho: state.cotizacionSeleccionada?.tipo_despacho
                    ?? state.draftQuote?.tipo_despacho
                    ?? 'a domicilio',
                costo_envio  : 0,                     // se actualizará luego
                descripcion  : state.cotizacionSeleccionada?.descripcion
                    ?? state.draftQuote?.descripcion
                    ?? '',
                total        : 0,                     // idem
            }

            const { id: newId } = await crearCotizacion(cabecera)

            /* 2 · ítems */
            await Promise.all(
                productos.map(p =>
                    crearItemCotizacion(newId, {
                        producto_id: p.sku,
                        sucursal_id: p.sucursalId,
                        cantidad   : p.cantidad,
                    }),
                ),
            )

            /* 3 · calcular despacho */
            const dirClienteId = state.cotizacionSeleccionada?.direccion_id        // <— ajusta si tu contexto usa otro nombre
            if (!dirClienteId) {
                alert('Debes seleccionar una dirección antes de calcular el despacho')
            } else {
                const previews = await calcularDespacho(newId, dirClienteId)
                const { valor_despacho } = previews[0] ?? {}

                if (valor_despacho !== undefined) {
                    /* 4 · actualizar BD con costo_envio + total */
                    setDespacho(valor_despacho)
                    console.log('El valor del despacho es: ', valor_despacho)
                    console.log('totals.totalCotizacion: ', totals.totalCotizacion)
                    console.log('El nuevo total es: ', (totals.totalCotizacion+valor_despacho)*1.19)
                    console.log('*****************************************************')
                    console.log(totals)
                    const newTotal = totals.totalCotizacion + valor_despacho  // total anterior + despacho
                    await actualizarDatosCotizacion(newId, {
                        costo_envio: valor_despacho,
                        total:       ((totals.totalProductosNeto+valor_despacho-totals.totalDescuento)*1.19)
                    })
            console.log(newTotal)

                    /* 5 · reflejar en UI */
                }
            }

            setLastId(newId)
        } catch (e) {
            console.error(e)
            alert('No se pudo crear la cotización. Revisa consola.')
        } finally {
            setSaving(false)
        }
    }

    /* ——— redirige a facturación ——— */
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
