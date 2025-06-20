'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FaCheck, FaClock, FaTimes } from 'react-icons/fa'
import QuotationTable from '@/components/QuotationTable'
import Pagination from '@/components/Pagination'
import { useCotizaciones, Estado } from '@/hooks/useCotizaciones'

const filtros: { label: string; value: Estado; icon: JSX.Element }[] = [
  { label: 'Aprobadas', value: 'Aprobada', icon: <FaCheck size={20} /> },
  { label: 'Pendientes', value: 'Pendiente', icon: <FaClock size={20} /> },
  { label: 'Rechazadas', value: 'Rechazada', icon: <FaTimes size={20} /> },
]

export default function HistorialCotizaciones() {
  const [estado, setEstado] = useState<Estado>('Todas')
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState<'fecha' | 'total'>('fecha')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')
  const [page, setPage] = useState(1)

  const router = useRouter()
  const { data, totalPages } = useCotizaciones({ estado, search, sortBy, sortDir, page })

  const changeSort = (col: 'fecha' | 'total') => {
    if (sortBy === col) {
      setSortDir(prev => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortBy(col)
      setSortDir('asc')
    }
  }

  return (
    <main className="ml-[180px] mt-[70px] p-8 bg-gray-50 min-h-screen">
      <section className="bg-white rounded-xl shadow-sm p-8">
        <h1 className="text-3xl font-bold mb-8">Historial de Cotizaciones</h1>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="flex gap-2">
            {filtros.map(f => (
              <button
                key={f.value}
                onClick={() => { setEstado(f.value); setPage(1); }}
                className={`flex items-center gap-2 px-3 py-2 rounded-md border text-sm ${estado === f.value ? 'bg-orange-500 text-white' : 'bg-white text-gray-700'} focus:outline-none focus:ring-2 focus:ring-orange-500`}
                aria-pressed={estado === f.value}
              >
                {f.icon}
                {f.label}
              </button>
            ))}
          </div>
          <input
            type="text"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Buscar cliente/RUT"
            className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full md:w-60 focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <QuotationTable
          data={data}
          sortBy={sortBy}
          sortDir={sortDir}
          onSort={changeSort}
          onRowClick={id => router.push(`/vendedor/cotizaciones/${id}`)}
        />

        <div className="mt-4 flex justify-end">
          <Pagination page={page} totalPages={totalPages} onChange={p => setPage(p)} />
        </div>
      </section>
    </main>
  )
}
