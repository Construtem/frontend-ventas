'use client';

import { FaCheck, FaClock, FaTimes } from 'react-icons/fa';

/* ---------------------------------- */
/*  Dummy data */
/* ---------------------------------- */
interface Cotizacion {
    id: number;
    fecha: string;
    cliente: string;
    estado: 'Aprobada' | 'Pendiente' | 'Rechazada';
    total: string;
}

const data: Cotizacion[] = [
    { id: 1, fecha: '05/05/2025', cliente: 'Cliente A', estado: 'Aprobada',  total: '26.500 $' },
    { id: 2, fecha: '05/05/2025', cliente: 'Cliente A', estado: 'Pendiente', total: '26.500 $' },
    { id: 3, fecha: '05/05/2025', cliente: 'Cliente A', estado: 'Rechazada', total: '26.500 $' },
    { id: 4, fecha: '05/05/2025', cliente: 'Cliente A', estado: 'Aprobada',  total: '26.500 $' },
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

/* ---------------------------------- */
/*  Page component */
/* ---------------------------------- */
export default function HistorialCotizaciones() {
    return (
        <main className="ml-[180px] mt-[70px] p-8 bg-gray-50 min-h-screen">
            <section className="bg-white rounded-xl shadow-sm p-8">
                {/* título */}
                <h1 className="text-3xl font-bold mb-8">Historial de Cotizaciones</h1>

                {/* chips */}
                <div className="flex gap-6 mb-10">
                    <Chip icon={<FaCheck  size={20} />} title="Cotizaciones" subtitle="aprobadas" />
                    <Chip icon={<FaClock size={20} />} title="Cotizaciones" subtitle="Pendientes" />
                    <Chip icon={<FaTimes size={20} />} title="Cotizaciones" subtitle="Rechazadas" />
                </div>

                {/* tabla */}
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead>
                        <tr className="bg-gray-100 text-gray-900 font-semibold">
                            <th className="px-6 py-3 text-left">Fecha</th>
                            <th className="px-6 py-3 text-left">Cliente</th>
                            <th className="px-6 py-3 text-left">Estado</th>
                            <th className="px-6 py-3 text-left">Total</th>
                        </tr>
                        </thead>

                        <tbody>
                        {data.map((c) => (
                            <tr key={c.id} className="border-b last:border-b-0">
                                <td className="px-6 py-4 border-b border-b-[1px] border-b-[#EDEFEE]">{c.fecha}</td>
                                <td className="px-6 py-4 border-b border-b-[1px] border-b-[#EDEFEE]">{c.cliente}</td>
                                <td className="px-6 py-4 border-b border-b-[1px] border-b-[#EDEFEE]">
                                    <EstadoBadge estado={c.estado} />
                                </td>
                                <td className="px-6 py-4 border-b border-b-[1px] border-b-[#EDEFEE]">{c.total}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </main>
    );
}
