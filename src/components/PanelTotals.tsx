'use client'
import React, { useState } from 'react'
import Modal from '@/components/Modal/Modal' // Asegúrate de tener este componente
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
    cotizacionId?: number        // ← NUEVO (opcional)
    onGuardar?: () => void
    onPagar?:   () => void
}

const PanelTotals: React.FC<PanelTotalsProps> = ({
    quotation,
    onGuardar,
    onPagar,
    cotizacionId,
}) => {
    const BASE_URL_FACTURACION_FRONTEND = process.env.NEXT_PUBLIC_FRONT_FACTURACION || ' https://facturacion.tssw.cl'
    const { state } = useCotizacionFlow(); // <-- agrega esto para acceder al cliente seleccionado
    const tipoDespacho =
        state.draftQuote?.tipo_despacho ??
        state.cotizacionSeleccionada?.tipo_despacho;

    const descripcion =
        state.draftQuote?.descripcion ??
        state.cotizacionSeleccionada?.descripcion ??
        '';
    const [isSaving, setIsSaving] = useState(false)
    const [showCreatedModal, setShowCreatedModal] = useState(false)
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [showEmptyMsg, setShowEmptyMsg] = useState(false);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-CL', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount)
    }

    const cotizacionVacia =
    !quotation.totalProductosNeto &&
    !quotation.totalDespacho &&
    !quotation.totalDescuento &&
    !quotation.iva &&
    !quotation.totalCotizacion;

    const handleGuardar = async () => {
        setShowEmptyMsg(false);
        setErrorMsg(null);

        // Validación de cliente seleccionado
        if (!state.clienteRut) {
            setErrorMsg("Debes seleccionar un cliente antes de guardar la cotización.");
            return;
        }

        if (cotizacionVacia) {
            setShowEmptyMsg(true);
            return;
        }

        setIsSaving(true);
            try {
                // Aquí va el console.log
                console.log('Datos para crear cotización:', {
                    rut_cliente: state.clienteRut,
                    user_id: state.usuario,
                    tipo_despacho: tipoDespacho,
                    costo_envio: quotation.totalDespacho,
                    descripcion: descripcion,
                    total: quotation.totalCotizacion,
                });

                if (onGuardar) await onGuardar();
                setTimeout(() => {
                    setIsSaving(false);
                    setShowCreatedModal(true); // Solo aquí, si no hay error
                }, 1200);
            } catch {
                setIsSaving(false);
                setErrorMsg("Ocurrió un error al guardar la cotización. Por favor, verifica tu conexión o intenta nuevamente.");
                setShowCreatedModal(false); // Oculta el modal de éxito si hay error
            }
    };

    return (
        <div className="bg-white py-[20px] px-[40px] min-w-[280px] rounded-[10px]
                      shadow-[0_0_2px_rgba(0,0,0,0.25)] ">
            {/* Panel de totales */}
            <div className="space-y-3 mb-4">
                <div className="flex justify-between items-center">
                    <span className="text-sm">Subtotal</span>
                    <span className="text-sm font-bold">{formatCurrency(quotation.totalProductosNeto)}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-sm">Despacho</span>
                    <span className="text-sm font-bold">{formatCurrency(quotation.totalDespacho)}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-sm">Descuento</span>
                    <span className="text-sm font-bold">{formatCurrency(quotation.totalDescuento)}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-sm">Iva 19%</span>
                    <span className="text-sm font-bold">{formatCurrency(quotation.iva)}</span>
                </div>

                <hr className="my-3 border-gray-300" />

                <div className="flex justify-between items-center">
                    <span className="text-lg font-bold">Total</span>
                    <span className="text-lg font-bold">{formatCurrency(quotation.totalCotizacion)}</span>
                </div>
            </div>

            {/* Botones lado a lado */}
            <div className="flex gap-2">
                <div className="flex-1 flex flex-col">
                    <button
                        onClick={handleGuardar}
                        disabled={isSaving}
                        className={`text-white py-2 px-4 text-sm font-bold rounded cursor-pointer transition-colors
                            ${isSaving ? 'bg-blue-300 cursor-not-allowed' : 'hover:bg-blue-700'}
                        `}
                        style={{background: '#2563B6'}}
                    >
                        {isSaving ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" fill="none"/>
                                    <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v8z"/>
                                </svg>
                                Guardando...
                            </span>
                        ) : (
                            'Guardar'
                        )}
                    </button>
                </div>
                <a
                    unselectable="on"
                    href={cotizacionId ? `${BASE_URL_FACTURACION_FRONTEND}/checkout/${cotizacionId}` : undefined}
                    onClick={e => {
                        if (!cotizacionId) e.preventDefault();   // impide navegar sin ID
                    }}
                >
                    <button
                        disabled={!cotizacionId}                 // bloquea el click en el botón
                        className={`flex-1 text-white py-2 px-4 text-sm font-bold rounded
                        
      ${!cotizacionId
                            ? 'bg-gray-200 cursor-not-allowed'
                            : 'bg-[#F59243] hover:bg-orange-600 cursor-pointer'}`}
                        onClick={onPagar}
                    >
                        Pagar
                    </button>
                </a>
            </div>
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
                            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            onClick={() => setShowCreatedModal(false)}
                        >
                            Cerrar
                        </button>
                    </div>
                </Modal>
            )}
        </div>
    )
}

export default PanelTotals
