'use client'
import React, { useState, useEffect } from 'react'
import Modal from '@/components/Modal/Modal'
import { ModalHeader } from '@/components/Modal/ModalsParts'
import { useCotizacionFlow } from '@/contexts/CotizacionFlow'

interface PanelTotalsProps {
    quotation: {
        totalProductosNeto: number
        totalDespacho:     number
        totalDescuento:    number
        iva: number
        totalCotizacion:   number
    }
    cotizacionId?: number
    onGuardar?: () => void
    onPagar?:   () => void
}

const PanelTotals: React.FC<PanelTotalsProps> = ({
    quotation,
    onGuardar,
    onPagar,
    cotizacionId,
}) => {
    const { state } = useCotizacionFlow()
    const [isSaving, setIsSaving] = useState(false)
    const [showCreatedModal, setShowCreatedModal] = useState(false)
    const [errorMsg, setErrorMsg] = useState<string | null>(null)
    const [showEmptyMsg, setShowEmptyMsg] = useState(false)

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('es-CL', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount)

    const productosVacios = state.productos.length === 0
    const isPaid = state.cotizacionSeleccionada?.estado_pago === 'approved' || state.cotizacionSeleccionada?.estado_pago === 'pagado'
    // Control de estado guardado local para cambiar botón tras guardar
    const [saved, setSaved] = useState(cotizacionId !== undefined && cotizacionId > 0)
    useEffect(() => {
        if (cotizacionId !== undefined && cotizacionId > 0) {
            setSaved(true)
        }
    }, [cotizacionId])
    const isNueva = !saved

    // Usar siempre los totales recibidos por prop
    const datosCotizacion = quotation

    const handleGuardar = async () => {
        setShowEmptyMsg(false)
        setErrorMsg(null)
        // Validación de cliente seleccionado
        if (!state.clienteRut) {
            setErrorMsg("Debes seleccionar un cliente antes de guardar la cotización.");
            return;
        }
        if (productosVacios) {
            setShowEmptyMsg(true);
            return;
        }
        setIsSaving(true);
        try {
            if (onGuardar) {
                await onGuardar()
                setSaved(true)
            }
            setShowCreatedModal(true)
        } catch {
            setErrorMsg("Ocurrió un error al guardar la cotización. Por favor, verifica tu conexión o intenta nuevamente.");
        } finally {
            setIsSaving(false);
        }
    };

    // Autocerrar modal de éxito para que aparezca botón Pagar
    useEffect(() => {
        if (showCreatedModal) {
            const timer = setTimeout(() => setShowCreatedModal(false), 1500)
            return () => clearTimeout(timer)
        }
    }, [showCreatedModal])

    return (
        <>
            {/* Panel de totales */}
            <div className="space-y-3 mb-4">
                <div className="flex justify-between items-center">
                    <span className="text-sm">Subtotal</span>
                    <span className="font-semibold">{formatCurrency(datosCotizacion.totalProductosNeto)}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-sm">Despacho</span>
                    <span className="font-semibold">{formatCurrency(datosCotizacion.totalDespacho)}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-sm">Descuento</span>
                    <span className="font-semibold">{formatCurrency(datosCotizacion.totalDescuento)}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-sm">IVA</span>
                    <span className="font-semibold">{formatCurrency(datosCotizacion.iva)}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-sm">Total</span>
                    <span className="font-bold text-lg">{formatCurrency(datosCotizacion.totalCotizacion)}</span>
                </div>
            </div>

            {/* Botón de acción único: Guardar o Pagar */}
            {!isPaid && (
                <div className="flex gap-2">
                    <div className="flex-1">
                        <button
                            className={`w-full py-2 rounded-lg text-white cursor-pointer ${isNueva ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'}`}
                            onClick={isNueva ? handleGuardar : onPagar}
                            disabled={isNueva ? (isSaving || productosVacios) : false}
                        >
                            {isNueva ? (isSaving ? 'Guardando...' : 'Guardar') : 'Pagar'}
                        </button>
                    </div>
                </div>
            )}
            <div className="h-10 flex items-center justify-center">
                {showEmptyMsg && (
                    <span className="text-red-500 text-sm text-center">
                        Debes agregar productos antes de guardar la cotización.
                    </span>
                )}
                {errorMsg && (
                    <span className="text-red-500 text-sm text-center">
                        {errorMsg}
                    </span>
                )}
            </div>

            {/* Modal de cotización creada */}
            {showCreatedModal && (
                <Modal isOpen={showCreatedModal} onClose={() => setShowCreatedModal(false)}>
                    <ModalHeader title="Cotización creada" onClose={() => setShowCreatedModal(false)} />
                    <div className="p-6 text-center">
                        <svg className="mx-auto mb-4 h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <p className="text-lg font-semibold mb-2">¡Cotización creada exitosamente!</p>
                        <button
                            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer"
                            onClick={() => setShowCreatedModal(false)}
                        >
                            Cerrar
                        </button>
                    </div>
                </Modal>
            )}
        </>
    )
}

export default PanelTotals
