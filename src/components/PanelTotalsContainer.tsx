// src/components/PanelTotalsContainer.tsx
'use client'

import { useMemo, useState } from 'react'
import { useCotizacionFlow } from '@/contexts/CotizacionFlow'
import PanelTotals from '@/components/PanelTotals'
import type { DraftProducto } from '@/services/apiServices'
import {
    crearCotizacion,
    crearItemCotizacion,
    calcularDespacho,
    actualizarDatosCotizacion,
} from '@/services/apiServices'
import Modal from '@/components/Modal/Modal'
import PanelTotalsNoProducts from "@/components/PanelTotals/PanelTotalsNoProducts";

const BASE_FACTURACION =
    (process.env.NEXT_PUBLIC_FRONT_FACTURACION ?? 'https://facturacion.tssw.cl').trim()

export default function PanelTotalsContainer() {
    const { state } = useCotizacionFlow()
    const productos: DraftProducto[] = state.productos

    const [despacho, setDespacho] = useState<number>(0)
    const [showSavingModal, setShowSavingModal] = useState(false)

    const totals = useMemo(() => {
        const subtotal = productos.reduce(
            (s, p) => s + p.precioUnit * p.cantidad,
            0,
        )
        const descuento = productos.reduce(
            (s, p) => s + (p.precioUnit - p.netoUnit) * p.cantidad,
            0,
        )
        const d = despacho ?? 0
        const base = subtotal + d - descuento
        const iva = Math.round(base * 0.19)
        const totalFin = base + iva

        return {
            totalProductosNeto: subtotal,
            totalDespacho: d,
            totalDescuento: descuento,
            iva: iva,
            totalCotizacion: totalFin,
        }
    }, [productos, despacho])

    const [saving, setSaving] = useState(false)
    const [lastId, setLastId] = useState<number | null>(null)

    const handleGuardar = async () => {
        if (saving) return
        try {
            setSaving(true)
            setShowSavingModal(true)

            const usuario = typeof window !== 'undefined'
                ? JSON.parse(localStorage.getItem('user') ?? '{}')
                : {}

            const tipoDespacho = state.cotizacionSeleccionada?.tipo_despacho
                ?? state.draftQuote?.tipo_despacho
                ?? 'Retiro en tienda'

            const cabecera = {
                rut_cliente: state.clienteRut!,
                user_id: usuario.email ?? '',
                tipo_despacho: tipoDespacho,
                costo_envio: 0,
                descripcion: state.draftQuote?.descripcion,
                total: 0,
            }

            if (!state.cotizacionSeleccionada?.direccionId) {
                console.log('No se pudo crear la cotización porque no hay direccionId')
                setShowSavingModal(false)
                return
            }

            const { id: newId } = await crearCotizacion(cabecera)

            await Promise.all(
                productos.map(p =>
                    crearItemCotizacion(newId, {
                        producto_id: p.sku,
                        sucursal_id: p.sucursalId,
                        cantidad: p.cantidad,
                    })
                )
            )

            if (tipoDespacho !== 'retiro tienda') {
                const dirClienteId = state.cotizacionSeleccionada?.direccionId
                const previews = await calcularDespacho(newId, dirClienteId)
                const { valor_despacho } = previews[0] ?? {}

                if (valor_despacho !== undefined) {
                    setDespacho(valor_despacho)
                    const newTotal = totals.totalProductosNeto + valor_despacho - totals.totalDescuento
                    const iva = Math.round(newTotal * 0.19)
                    await actualizarDatosCotizacion(newId, {
                        costo_envio: valor_despacho,
                        total: newTotal + iva,
                    })
                }
            } else {
                const newTotal = totals.totalProductosNeto - totals.totalDescuento
                const iva = Math.round(newTotal * 0.19)
                await actualizarDatosCotizacion(newId, {
                    costo_envio: 0,
                    total: newTotal + iva,
                })
            }

            setLastId(newId)
        } catch (e) {
            console.error(e)
            alert('No se pudo crear la cotización. Revisa consola.')
        } finally {
            setSaving(false)
            setShowSavingModal(false)
        }
    }

    const handlePagar = () => {
        if (!lastId) {
            alert('Debes confirmar la cotización antes de pagar')
            return
        }
        setShowSavingModal(true)
        setTimeout(() => {
            window.location.href = `${BASE_FACTURACION.replace(/\/$/, '')}/${lastId}`
        }, 1000)
    }



    const isNuevaCotizacion = !lastId && !!state.cotizacionSeleccionada
    const tieneProductos = productos.length > 0
    return (
            <div className="bg-white py-[20px] px-[40px] min-w-[280px] rounded-[10px]
                      shadow-[0_0_2px_rgba(0,0,0,0.25)] ">
                {isNuevaCotizacion && tieneProductos ? (

                <PanelTotals
                    quotation={totals}
                    cotizacionId={lastId ?? undefined}
                    onGuardar={handleGuardar}
                    onPagar={handlePagar}
                />
                ):(<PanelTotalsNoProducts/>)}
                {showSavingModal && (
                    <Modal isOpen={true} onClose={() => {
                    }}>
                        <div className="p-6 w-80 text-center flex flex-col items-center justify-center">
                            <svg
                                className="animate-spin h-8 w-8 text-blue-600 mb-4"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                />
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
                                />
                            </svg>
                            <p className="text-gray-700 text-base font-medium">Guardando cotización y preparando
                                redirección...</p>
                        </div>
                    </Modal>
                )}
            </div>
            )
            }
