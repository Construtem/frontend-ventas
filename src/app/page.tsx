// pages/index.tsx
'use client'
import { NextPage } from 'next'
import React from 'react'

import QuotationTable from '../components/QuotationTable'
import HistorialCotizaciones from '../components/HistorialCotizaciones'

const Home: NextPage = () => {
    return (
        <div className="min-h-screen bg-gray-100">
            <div className="container mx-auto py-8 pt-[66px]">
                <QuotationTable quotationId="q1" />
                <div className="mt-10">
                  <h2 className="text-lg font-bold mb-2">Historial</h2>
                  <HistorialCotizaciones />
                </div>
            </div>
        </div>
    )
}

export default Home
