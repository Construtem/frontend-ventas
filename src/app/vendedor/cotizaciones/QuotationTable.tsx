import React from 'react';
import { useRouter } from 'next/navigation';

interface Cotizacion {
    id: number;
    fecha: string;
    cliente: string;
    rut: string;
    estado: 'Aprobada' | 'Pendiente' | 'Rechazada';
    total: string;
}

interface Props {
    cotizaciones: Cotizacion[];
    onRowClick?: (id: number) => void;
}

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

export const QuotationTable: React.FC<Props> = ({ cotizaciones, onRowClick }) => {
    const router = useRouter();

    if (cotizaciones.length === 0) {
        return (
            <div className="flex flex-col items-center py-16">
                <img src="/empty-state.svg" alt="Sin cotizaciones" className="w-40 mb-4 opacity-70" />
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
                        onClick={() => onRowClick ? onRowClick(c.id) : router.push(`/cotizaciones/${c.id}`)}
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