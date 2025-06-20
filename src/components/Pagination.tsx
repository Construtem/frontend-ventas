'use client'
interface Props {
  page: number
  totalPages: number
  onChange: (p: number) => void
}

export default function Pagination({ page, totalPages, onChange }: Props) {
  if (totalPages <= 1) return null
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
  return (
    <nav className="flex items-center gap-2" aria-label="Pagination">
      <button
        onClick={() => onChange(Math.max(page - 1, 1))}
        disabled={page === 1}
        className="px-2 py-1 rounded hover:bg-gray-100 disabled:text-gray-300"
      >
        ◀
      </button>
      {pages.map(p => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={`px-2 py-1 rounded hover:bg-gray-100 ${p === page ? 'bg-gray-200 font-semibold' : ''}`}
          aria-current={p === page ? 'page' : undefined}
        >
          {p}
        </button>
      ))}
      <button
        onClick={() => onChange(Math.min(page + 1, totalPages))}
        disabled={page === totalPages}
        className="px-2 py-1 rounded hover:bg-gray-100 disabled:text-gray-300"
      >
        ▶
      </button>
    </nav>
  )
}
