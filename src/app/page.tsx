// pages/index.tsx
'use client'
import { NextPage } from 'next'
import React from 'react'
import QuotationTable from '../components/QuotationTable'

const Home: NextPage = () => {
    return (
        <div className="min-h-screen bg-gray-100">
            <div className="container mx-auto py-8 pt-[66px]">
                <QuotationTable quotationId="q1" />
            </div>
        </div>
    )
}

export default Home
