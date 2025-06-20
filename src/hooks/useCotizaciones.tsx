'use client'
import { useMemo } from 'react'
import { QUOTATIONS, Quotation } from '@/mock/mockQuotations'

export type Estado = 'Aprobada' | 'Pendiente' | 'Rechazada' | 'Todas'

interface Options {
  page?: number
  limit?: number
  search?: string
  estado?: Estado
  sortBy?: 'fecha' | 'total'
  sortDir?: 'asc' | 'desc'
}

export function useCotizaciones(options: Options) {
  const {
    page = 1,
    limit = 10,
    search = '',
    estado = 'Todas',
    sortBy = 'fecha',
    sortDir = 'asc',
  } = options

  const filtered = useMemo(() => {
    let data = QUOTATIONS
    if (estado !== 'Todas') data = data.filter(q => q.estado === estado)
    if (search.trim()) {
      const term = search.toLowerCase()
      data = data.filter(
        q =>
          q.cliente.toLowerCase().includes(term) ||
          q.rut.toLowerCase().includes(term)
      )
    }
    const sorted = [...data].sort((a, b) => {
      if (sortBy === 'fecha') {
        return sortDir === 'asc'
          ? a.fecha.localeCompare(b.fecha)
          : b.fecha.localeCompare(a.fecha)
      }
      return sortDir === 'asc' ? a.total - b.total : b.total - a.total
    })
    return sorted
  }, [search, estado, sortBy, sortDir])

  const totalPages = Math.ceil(filtered.length / limit)
  const pageData = filtered.slice((page - 1) * limit, page * limit)

  return { data: pageData, totalPages }
}
