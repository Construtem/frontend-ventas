'use client'
import Link from 'next/link'
import { Quotation } from '@/mock/mockQuotations'
import { FaArrowUp, FaArrowDown } from 'react-icons/fa'

interface Props {
  data: Quotation[]
  sortBy: 'fecha' | 'total'
  sortDir: 'asc' | 'desc'
  onSort: (c: 'fecha' | 'total') => void
  onRowClick: (id: string) => void
}

const EstadoBadge = ({ estado }: { estado: Quotation['estado'] }) => {
  const classes = {
    Aprobada: 'bg-green-100 text-green-700',
    Pendiente: 'bg-yellow-100 text-yellow-700',
    Rechazada: 'bg-red-100 text-red-700',
  }[estado]
  return <span className={`px-3 py-1 rounded-md text-xs font-semibold ${classes}`}>{estado}</span>
}

export default function QuotationTable({ data, sortBy, sortDir, onSort, onRowClick }: Props) {
  const icon = (c: 'fecha' | 'total') => {
    if (sortBy !== c) return null
    return sortDir === 'asc' ? <FaArrowUp className="inline ml-1"/> : <FaArrowDown className="inline ml-1"/>
  }

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center py-10 text-gray-500">
        <img src="/file.svg" alt="Sin datos" className="w-32 h-32 mb-4" />
        <p>No hay cotizaciones</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="bg-gray-100 text-gray-900 font-semibold">
            <th
              className="px-6 py-3 text-left cursor-pointer select-none"
              onClick={() => onSort('fecha')}
              aria-sort={sortBy === 'fecha' ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none'}
            >
              Fecha {icon('fecha')}
            </th>
            <th className="px-6 py-3 text-left">Cliente</th>
            <th className="px-6 py-3 text-left">RUT</th>
            <th className="px-6 py-3 text-left">Estado</th>
            <th
              className="px-6 py-3 text-left cursor-pointer select-none"
              onClick={() => onSort('total')}
              aria-sort={sortBy === 'total' ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none'}
            >
              Total {icon('total')}
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map(c => (
            <tr
              key={c.id}
              onClick={() => onRowClick(c.id)}
              className="border-b last:border-b-0 hover:bg-gray-50 cursor-pointer"
            >
              <td className="px-6 py-4">{c.fecha}</td>
              <td className="px-6 py-4">{c.cliente}</td>
              <td className="px-6 py-4">{c.rut}</td>
              <td className="px-6 py-4">
                <EstadoBadge estado={c.estado} />
              </td>
              <td className="px-6 py-4">${c.total.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
