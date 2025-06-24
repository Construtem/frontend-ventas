'use client';

import React, { useState, useEffect , useRef } from 'react';
import { useRouter } from 'next/navigation';
import { FaCheck, FaClock, FaTimes } from 'react-icons/fa';
import Image from 'next/image';

/* ---------------------------------- */
/*  Datos del cliente */
/* ---------------------------------- */
interface Cotizacion {
    id: number;
    fecha: string;
    cliente: string;
    rut: string;
    estado: 'Aprobada' | 'Pendiente' | 'Rechazada';
    total: string;
}

/* ---------------------------------- */
/*  Datos del backend */
/* ---------------------------------- */
interface CotizacionBackend {
  id: number;
  fecha: string;
  cliente?: { nombre?: string; rut?: string };
  estado: string;
  total?: number;
}

/* ---------------------------------- */
/*  Componente de la paginación       */
/* ---------------------------------- */
interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

interface Props {
    cotizaciones: Cotizacion[];
    onRowClick?: (id: number) => void;
}

/* ---------------------------------- */
/*  Chips reutilizables */
/* ---------------------------------- */
const Chip = ({
                  icon,
                  title,
                  subtitle,
              }: {
    icon: React.ReactNode;
    title: string;
    subtitle: string;
}) => (
    <div className="flex items-start gap-3 min-w-[200px] p-4 border rounded-lg border-gray-200">
        <div className="w-10 h-10 flex items-center justify-center rounded-md bg-gray-100">{icon}</div>
        <div className="leading-4">
            <span className="font-semibold">{title}</span>
            <p className="text-sm text-gray-500">{subtitle}</p>
        </div>
    </div>
);

/* ---------------------------------- */
/*  Badge según estado */
/* ---------------------------------- */
const EstadoBadge = ({ estado }: { estado: Cotizacion['estado'] }) => {
    const variant = {
        Aprobada:  'bg-green-100 text-green-700',
        Pendiente: 'bg-yellow-100 text-yellow-700',
        Rechazada: 'bg-red-100 text-red-700',
    }[estado];

    return (
        <span className={`px-3 py-1 rounded-md text-xs font-semibold ${variant}`}>
      {estado}
    </span>
    );
};

const Pagination: React.FC<PaginationProps> = ({ page, totalPages, onChange }) => {
  if (totalPages <= 1) return null;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center gap-2 justify-end mt-6">
      <button
        className="px-2 py-1 rounded hover:bg-gray-200 cursor-pointer"
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
      >
        ◀
      </button>
      {pages.map((p) => (
        <button
          key={p}
          className={`px-3 py-1 rounded cursor-pointer ${p === page ? "bg-blue-600 text-white" : "hover:bg-gray-200"}`}
          onClick={() => onChange(p)}
        >
          {p}
        </button>
      ))}
      <button
        className="px-2 py-1 rounded hover:bg-gray-200 cursor-pointer"
        disabled={page === totalPages}
        onClick={() => onChange(page + 1)}
      >
        ▶
      </button>
    </div>
  );
};

const QuotationTable: React.FC<Props> = ({ cotizaciones, onRowClick }) => {
  const router = useRouter();

  if (cotizaciones.length === 0) {
    return (
      <div className="flex flex-col items-center py-16">
        <Image 
          src="/empty-state.svg" 
          alt="Sin cotizaciones"
          width={160}
          height={160}
          className="w-40 mb-4 opacity-70"
        />
        <p className="text-gray-500 text-lg">No hay cotizaciones para mostrar.</p>
      </div>
    );
  }

  return (
    <table className="min-w-full text-sm">
      <thead>
        <tr className="bg-gray-100">
          <th className="px-6 py-3 text-left">Fecha</th>
          <th className="px-6 py-3 text-left">Cliente</th>
          <th className="px-6 py-3 text-left">RUT</th>
          <th className="px-6 py-3 text-left">Estado</th>
          <th className="px-6 py-3 text-left">Total</th>
        </tr>
      </thead>
      <tbody>
        {cotizaciones.map((c) => (
          <tr
            key={c.id}
            className="cursor-pointer transition hover:bg-blue-50"
            onClick={() => onRowClick ? onRowClick(c.id) : router.push(`/vendedor/cotizaciones/${c.id}`)}
          >
            <td className="px-6 py-4 border-b border-gray-200">{c.fecha}</td>
            <td className="px-6 py-4 border-b border-gray-200">{c.cliente}</td>
            <td className="px-6 py-4 border-b border-gray-200">{c.rut}</td>
            <td className="px-6 py-4 border-b border-gray-200">
              <EstadoBadge estado={c.estado} />
            </td>
            <td className="px-6 py-4 border-b border-gray-200">{c.total}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

// Componente principal de la página
export default function HistorialCotizaciones() {
    // Estado para cotizaciones y control de carga/error
    const [cotizaciones, setCotizaciones] = useState<Cotizacion[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Estados para filtros de fecha y estado
    const [filtroDia, setFiltroDia] = useState('');
    const [filtroMes, setFiltroMes] = useState('');
    const [filtroAno, setFiltroAno] = useState('');
    const [filtroEstado, setFiltroEstado] = useState<string>("");

    // Estado y configuración de paginación
    const [page, setPage] = useState(1);
    const pageSize = 7;

    // Ref para el contenedor principal
    const mainRef = useRef<HTMLDivElement>(null);

    // Filtrado de cotizaciones según los filtros activos
    const cotizacionesFiltradas = cotizaciones.filter((c) => {
        const [dia, mes, ano] = c.fecha.split('/');
        const coincideDia = !filtroDia || Number(filtroDia) === Number(dia);
        const coincideMes = !filtroMes || Number(filtroMes) === Number(mes);
        const coincideAno = !filtroAno || filtroAno === ano;
        const coincideEstado = !filtroEstado || c.estado === filtroEstado;
        return coincideDia && coincideMes && coincideAno && coincideEstado;
    });

    // Paginación de resultados filtrados
    const totalPages = Math.ceil(cotizacionesFiltradas.length / pageSize);
    const cotizacionesPaginadas = cotizacionesFiltradas.slice(
        (page - 1) * pageSize,
        page * pageSize
    );

    // Función para cambiar de página y hacer scroll al top
    const handlePageChange = (newPage: number) => {
        setPage(newPage);
        setTimeout(() => {
            mainRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 0);
    };

    // Carga de cotizaciones desde la API al montar el componente
    // Pruebas con https://github.com/Construtem/backend-ventas/tree/feature/cotizacion-union-front
    useEffect(() => {
      setLoading(true);
      fetch('http://localhost:8080/api/cotizaciones')
        .then(res => res.json())
        .then(data => {
          // Mapeo de datos del backend al formato esperado
          const cotizacionesBackend = Array.isArray(data) ? data : data.data;
          const cotizacionesMapeadas = cotizacionesBackend.map((c: CotizacionBackend) => ({
            id: c.id,
            fecha: c.fecha ? new Date(c.fecha).toLocaleDateString('es-CL') : '',
            cliente: c.cliente?.nombre || 'Sin nombre',
            rut: c.cliente?.rut || '12.345.678-5',
            estado: c.estado,
            total: c.total ? `${c.total.toLocaleString('es-CL')} $` : '',
          }));
          setCotizaciones(cotizacionesMapeadas);
          setLoading(false);
        })
        .catch(() => {
          setError('Error al cargar cotizaciones');
          setLoading(false);
        });
    }, []);

    if (loading) {
      return (
        <main ref={mainRef} className="ml-[180px] mt-[70px] p-8 bg-gray-50 min-h-screen">
          <section className="bg-white rounded-xl shadow-sm p-8 flex justify-center items-center min-h-[300px]">
            <span className="text-gray-500 text-lg">Cargando cotizaciones...</span>
          </section>
        </main>
      );
    }    

    if (error) {
      return (
        <main ref={mainRef} className="ml-[180px] mt-[70px] p-8 bg-gray-50 min-h-screen">
          <section className="bg-white rounded-xl shadow-sm p-8 flex justify-center items-center min-h-[300px]">
            <span className="text-red-500 text-lg">{error}</span>
          </section>
        </main>
      );
    }

    return (
        <main ref={mainRef} className="ml-[180px] mt-[70px] p-8 bg-gray-50 min-h-screen">
            <section className="bg-white rounded-xl shadow-sm p-8">
                {/* Título */}
                <h1 className="text-3xl font-bold mb-8">Historial de Cotizaciones</h1>

                {/* Filtros de fecha */}
                <div className="flex gap-4 mb-8">
                    <div>
                        <label className="block text-sm mb-1">Día</label>
                        <input
                            type="number"
                            min="1"
                            max="31"
                            className="border rounded px-2 py-1 w-32"
                            value={filtroDia}
                            onChange={e => setFiltroDia(e.target.value)}
                            placeholder="Día"
                        />
                    </div>
                    <div>
                        <label className="block text-sm mb-1">Mes</label>
                        <input
                            type="number"
                            min="1"
                            max="12"
                            className="border rounded px-2 py-1 w-32"
                            value={filtroMes}
                            onChange={e => setFiltroMes(e.target.value)}
                            placeholder="Mes"
                        />
                    </div>
                    <div>
                        <label className="block text-sm mb-1">Año</label>
                        <input
                            type="number"
                            min="2000"
                            max="2100"
                            className="border rounded px-2 py-1 w-32"
                            value={filtroAno}
                            onChange={e => setFiltroAno(e.target.value)}
                            placeholder="Año"
                        />
                    </div>
                </div>

                {/* Chips como botones de filtro por estado */}
                <div className="flex gap-6 mb-10">
                    {[
                        { estado: "Aprobada", icon: <FaCheck size={20} />, title: "Cotizaciones", subtitle: "Aprobadas" },
                        { estado: "Pendiente", icon: <FaClock size={20} />, title: "Cotizaciones", subtitle: "Pendientes" },
                        { estado: "Rechazada", icon: <FaTimes size={20} />, title: "Cotizaciones", subtitle: "Rechazadas" },
                    ].map(({ estado, icon, title, subtitle }) => (
                        <button
                            key={estado}
                            type="button"
                            onClick={() => {
                                setFiltroEstado(filtroEstado === estado ? "" : estado);
                                setPage(1);
                            }}
                            className={`
                                group
                                rounded-lg
                                transition
                                focus:outline-none
                                cursor-pointer
                                ${filtroEstado === estado ? "ring-2 ring-orange-500" : ""}
                                hover:scale-105 hover:shadow-lg
                            `}
                            style={{ padding: 0, background: "none", border: "none" }}
                            >
                            <span className="block">
                                <Chip
                                icon={icon}
                                title={title}
                                subtitle={subtitle}
                                />
                            </span>
                        </button>
                    ))}
                </div>

                {/* Tabla de cotizaciones */}
                <div className="overflow-x-auto">
                    <QuotationTable cotizaciones={cotizacionesPaginadas} />

                    {/* Paginación */}
                    <Pagination page={page} totalPages={totalPages} onChange={handlePageChange} />

                </div>
                            
            </section>
        </main>
    );
}