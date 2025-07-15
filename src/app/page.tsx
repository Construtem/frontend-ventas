// pages/index.tsx
'use client'
import { NextPage } from 'next'
import React, { useState } from 'react'
import ProductTable from '@/components/ProductTable'
import Vendedor from '@/components/Vendedor';
import Cliente from '@/components/Cliente';
import Cotizacion from '@/components/Cotizacion';
import HistorialCotizaciones from '@/components/HistorialCotizaciones'
import PanelTotals from '@/components/PanelTotals'
import { quotations } from '@/mocks/mocksDatos'
import { Cliente as ClienteType } from '@/services/apiService';

const Home: NextPage = () => {
    const [clienteSeleccionado, setClienteSeleccionado] = useState<ClienteType | null>(null);
    
    // Obtener la cotización para el panel de totales
    const quotation = quotations.find(q => q.id === 'q1')

    if (!quotation) {
        return <div>Error: Cotización no encontrada</div>
    }

    const handleClienteSeleccionado = (cliente: ClienteType) => {
        console.log('Página principal: Cliente seleccionado:', cliente);
        setClienteSeleccionado(cliente);
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="container mx-auto py-8 pt-[66px]">
                <div className='ml-30 flex'>
                        <div className='text-2xl font-bold text-black flex gap-2 mb-2'>
                            Bienvenido 
                        </div><div className='ml-100 text-2xl font-bold text-black flex gap-2 mb-2'>
                            Detalles cotización
                            </div>
                            </div>
                
                {/* Debug info */}
                {clienteSeleccionado && (
                    <div className="ml-30 text-sm text-gray-600 mb-2">
                        Cliente seleccionado: {clienteSeleccionado.nombre} ({clienteSeleccionado.rut})
                    </div>
                )}
                
                        <div className='flex'>
                        <div>
                            <Vendedor />
                            <Cliente onClienteSeleccionado={handleClienteSeleccionado} />
                        </div>
                        <div>
                            <Cotizacion clienteSeleccionado={clienteSeleccionado} />
                        </div>
                    </div>
                <div className="flex gap-4 mb-8 max-w-7xl mx-auto">
                    <div className="flex-1">
                        <ProductTable quotationId="q1" />
                    </div>
                    <div className="w-[280px]">
                        <div className="bg-white flex justify-center border border-gray-300 p-4 shadow-md rounded-lg">
                            <PanelTotals 
                                quotation={quotation}
                                onGuardar={() => console.log('Guardar cotización')}
                                onPagar={() => console.log('Proceder a pagar')}
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-10">
                    <h2 className="text-lg font-bold mb-2">Historial</h2>
                    <HistorialCotizaciones />
                </div>
            </div>
        </div>
    )
}

export default Home
