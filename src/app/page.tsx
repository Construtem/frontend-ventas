// pages/index.tsx
'use client'
import { NextPage } from 'next'
import React from 'react'
import QuotationTable from '@/components/QuotationTable'
import Cliente from '@/components/tresprimeras';

const Home: NextPage = () => {
    return (
        <div className="min-h-screen bg-gray-100">
            <div className="container mx-auto py-8 pt-[66px]">
        <Cliente />
                <QuotationTable quotationId="q1" />
            </div>
        </div>
    )
}

export default Home
