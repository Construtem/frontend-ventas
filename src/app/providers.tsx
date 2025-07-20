// src/app/providers.tsx
'use client'

import { ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { CotizacionProvider } from '@/contexts/CotizacionFlow'

const queryClient = new QueryClient()

export function AppProviders({ children }: { children: ReactNode }) {
    return (
        <QueryClientProvider client={queryClient}>
            <CotizacionProvider>
                {children}
            </CotizacionProvider>
        </QueryClientProvider>
    )
}
