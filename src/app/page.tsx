'use client'
import { NextPage } from 'next'
import React from 'react'
import ProductTable from '@/components/ProductTable'
import Cliente from '@/components/Cliente';
import Cotizacion from '@/components/Cotizacion';
//import HistorialCotizaciones from '@/components/HistorialCotizaciones'
//import PanelTotals from '@/components/PanelTotals'
import { quotations } from '@/mocks/mocksDatos'
import CotizacionesCreadas from "@/components/CotizacionesCreadas";
//import PanelTotals from "@/components/PanelTotals";
import PanelTotalsContainer from "@/components/PanelTotalsContainer";
import FTUTour from "@/components/FTUTour";
import TourRestartButton from "@/components/TourRestartButton";



const Home: NextPage = () => {
    // Ya no necesitamos cargar sucursales aquí porque ProductTable las carga internamente
    
    // Obtener la cotización para el panel de totales
    const quotation = quotations.find(q => q.id === 'q1')

    const handleRestartTour = () => {
        // Recargar la página para reiniciar el tour
        window.location.reload()
    }

    if (!quotation) {
        return <div>Error: Cotización no encontrada</div>
    }

    return (
        <div className="min-h-screen bg-gray-100 px-20px lg:px-0">
            <div className="container mx-auto py-8 pt-[66px] flex flex-col gap-[20px]">
                <div className='flex justify-center gap-[40px] flex-col lg:flex-row w-full'>
                        <div className={"flex flex-col gap-4 px-[40px] sm:px-[0px] "}>
                            {
                                /*
                            <Bienvenida/>
                                * */
                            }
                            <Cliente/>
                        </div>
                    <Cotizacion/>
                    </div>
                <div className="flex flex-col gap-[20px] px-[40px] sm:px-0">
                    <div className="flex w-full lg:flex-row flex-col gap-[20px]">
                        <ProductTable />
                        <PanelTotalsContainer/>
                    </div>
                        <CotizacionesCreadas/>
                </div>
                {/*

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
                */}
            </div>
            
            {/* Tour de ayuda paso a paso */}
            <FTUTour autoStart={true} />
            
            {/* Botón para reiniciar tour */}
            <TourRestartButton onRestart={handleRestartTour} />
        </div>
    )
}

export default Home