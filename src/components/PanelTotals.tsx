'use client'
import React from 'react'

interface PanelTotalsProps {
    quotation: {
        totalProductosNeto: number
        totalDespacho:     number
        totalDescuento:    number
        totalProductosIVA: number
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

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-CL', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount)
    }

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
                    <span className="text-sm font-bold">{formatCurrency(quotation.totalProductosIVA - quotation.totalProductosNeto)}</span>
                </div>

                <hr className="my-3 border-gray-300" />

                <div className="flex justify-between items-center">
                    <span className="text-lg font-bold">Total</span>
                    <span className="text-lg font-bold">{formatCurrency(quotation.totalCotizacion)}</span>
                </div>
            </div>

            {/* Botones lado a lado */}
            <div className="flex gap-2">
                <button
                    onClick={onGuardar}
                    className="flex-1 text-white py-2 px-4 text-sm font-bold rounded cursor-pointer transition-colors hover:bg-blue-700"
                    style={{background: '#2563B6'}}
                >
                    Guardar
                </button>
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
        </div>
    )
}

export default PanelTotals
