'use client';

import React, { useState, useRef } from 'react';
import { QuotationTable } from './QuotationTable';
import { FaCheck, FaClock, FaTimes } from 'react-icons/fa';

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
/*  Componente de la paginación       */
/* ---------------------------------- */
interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}


const data: Cotizacion[] = [
    { id: 1, fecha: '10/05/2025', cliente: 'Cliente A', rut: "00000000-0", estado: 'Aprobada',  total: '26.500 $' },
    { id: 2, fecha: '05/05/2025', cliente: 'Cliente A', rut: "00000000-0", estado: 'Pendiente', total: '26.500 $' },
    { id: 3, fecha: '05/03/2025', cliente: 'Cliente B', rut: "00000000-0", estado: 'Rechazada', total: '26.500 $' },
    { id: 4, fecha: '05/05/2019', cliente: 'Cliente A', rut: "00000000-0", estado: 'Aprobada',  total: '10.500 $' },
    { id: 5, fecha: '07/05/2019', cliente: 'Cliente B', rut: "00000000-0", estado: 'Rechazada',  total: '2.500 $' },
    { id: 6, fecha: '05/05/2018', cliente: 'Cliente C', rut: "00000000-0", estado: 'Rechazada',  total: '200.500 $' },
    { id: 7, fecha: '05/07/2023', cliente: 'Cliente A', rut: "00000000-0", estado: 'Aprobada',  total: '9.800 $' },
    { id: 8, fecha: '05/05/2025', cliente: 'Cliente B', rut: "00000000-0", estado: 'Pendiente', total: '22.000 $' },
    { id: 9, fecha: '05/05/2025', cliente: 'Cliente B', rut: "00000000-0", estado: 'Pendiente', total: '22.000 $' },
    { id: 10, fecha: '05/05/2018', cliente: 'Cliente C', rut: "00000000-0", estado: 'Rechazada',  total: '200.500 $' },
    { id: 11, fecha: '05/05/2025', cliente: 'Cliente B', rut: "00000000-0", estado: 'Pendiente', total: '22.000 $' },
    { id: 12, fecha: '05/03/2025', cliente: 'Cliente B', rut: "00000000-0", estado: 'Rechazada', total: '26.500 $' },    
    { id: 13, fecha: '05/05/2025', cliente: 'Cliente B', rut: "00000000-0", estado: 'Pendiente', total: '22.000 $' },
    { id: 14, fecha: '05/05/2025', cliente: 'Cliente B', rut: "00000000-0", estado: 'Pendiente', total: '22.000 $' },
    { id: 15, fecha: '05/07/2023', cliente: 'Cliente A', rut: "00000000-0", estado: 'Aprobada',  total: '9.800 $' },
    { id: 16, fecha: '10/05/2025', cliente: 'Cliente A', rut: "00000000-0", estado: 'Aprobada',  total: '26.500 $' },
    { id: 17, fecha: '10/05/2025', cliente: 'Cliente A', rut: "00000000-0", estado: 'Aprobada',  total: '26.500 $' },
    { id: 18, fecha: '10/05/2025', cliente: 'Cliente A', rut: "00000000-0", estado: 'Aprobada',  total: '26.500 $' },
];

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

// Componente principal de la página
export default function HistorialCotizaciones() {

    const [filtroDia, setFiltroDia] = useState('');
    const [filtroMes, setFiltroMes] = useState('');
    const [filtroAno, setFiltroAno] = useState('');
    const [filtroEstado, setFiltroEstado] = useState<string>("");

    // Paginación
    const [page, setPage] = useState(1);
    const pageSize = 7;

    // Ref para el contenedor principal
    const mainRef = useRef<HTMLDivElement>(null);

    const cotizacionesFiltradas = data.filter((c) => {
        const [dia, mes, ano] = c.fecha.split('/');
        const coincideDia = !filtroDia || Number(filtroDia) === Number(dia);
        const coincideMes = !filtroMes || Number(filtroMes) === Number(mes);
        const coincideAno = !filtroAno || filtroAno === ano;
        const coincideEstado = !filtroEstado || c.estado === filtroEstado;
        return coincideDia && coincideMes && coincideAno && coincideEstado;
    });

    // Paginación de resultados
    const totalPages = Math.ceil(cotizacionesFiltradas.length / pageSize);
    const cotizacionesPaginadas = cotizacionesFiltradas.slice(
        (page - 1) * pageSize,
        page * pageSize
    );

    // Scroll al top al cambiar página
    const handlePageChange = (newPage: number) => {
        setPage(newPage);
        setTimeout(() => {
            mainRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 0);
    };

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

                {/* Tabla */}
                <div className="overflow-x-auto">
                    <QuotationTable cotizaciones={cotizacionesPaginadas} />

                    {/* Paginación */}
                    <Pagination page={page} totalPages={totalPages} onChange={handlePageChange} />


    


                </div>
                            
            </section>
        </main>
    );
}