// pages/index.tsx
'use client'
import { NextPage } from 'next'
import React from 'react'
import Cliente from '@/components/tresprimeras';

 

const Home: NextPage = () => {
    return (
        <div className="space-y-6 p-6 my-[58px]"> 
            <Cliente />                
        </div>
            )
            
}

export default Home
