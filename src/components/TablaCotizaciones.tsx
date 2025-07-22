'use client'
import React, { useState, useMemo } from 'react';
import {
    DBCotizacion,
    CotizacionCheckout,
    checkoutCotizacion
} from "@/services/apiServices";
import CotizacionDetalleModal from "@/components/Modal/CotizacionDetalleModal";
import {useCotizacionFlow} from "@/contexts/CotizacionFlow";
import Loader from "@/components/Loader";
function getEstadoColor(estado: string) {
    switch (estado) {
        case "aprobada":
            return "bg-green-100 text-green-700";
        case "pendiente":
            return "bg-yellow-100 text-yellow-700";
        case "rechazada":
            return "bg-red-100 text-red-700";
        default:
            return "bg-gray-100 text-gray-700";
    }
}

const TablaCotizaciones = ({ historial }: { historial: CotizacionCheckout[] }) => {
    const [paginaActual, setPaginaActual] = useState(1);
    const [busqueda, setBusqueda] = useState('');
    const [sortColumn, setSortColumn] = useState<'id'|'cliente'|'fecha'|'total'>('id');
    const [sortDir, setSortDir] = useState<'asc'|'desc'>('asc');
    const [cotizacionSeleccionadaDetails, setCotizacionSeleccionadaDetails] = useState<DBCotizacion | CotizacionCheckout | null>(null);
    const porPagina = 10;
    const { state, dispatch } = useCotizacionFlow();
    const historialFiltrado = historial.filter(c => {
        const textoBusqueda = busqueda.toLowerCase();
        return (
            c.cliente.nombre.toLowerCase().includes(textoBusqueda) ||
            c.id.toString().includes(textoBusqueda)
        );
    });

    const handleSort = (col: 'id'|'cliente'|'fecha'|'total') => {
        if (sortColumn === col) {
            setSortDir(dir => dir === 'asc' ? 'desc' : 'asc');
        } else {
            setSortColumn(col);
            setSortDir('asc');
        }
        setPaginaActual(1);
    };

    const historialOrdenado = useMemo(() => {
        return [...historialFiltrado].sort((a, b) => {
            let aVal: string|number = 0, bVal: string|number = 0;
            switch (sortColumn) {
                case 'id': aVal = a.id; bVal = b.id; break;
                case 'cliente': aVal = a.cliente.nombre.toLowerCase(); bVal = b.cliente.nombre.toLowerCase(); break;
                case 'fecha': aVal = new Date(a.fecha_crea).getTime(); bVal = new Date(b.fecha_crea).getTime(); break;
                case 'total': aVal = a.total ?? 0; bVal = b.total ?? 0; break;
            }
            if (aVal < bVal) return sortDir === 'asc' ? -1 : 1;
            if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
            return 0;
        });
    }, [historialFiltrado, sortColumn, sortDir]);

    const totalPaginas = Math.ceil(historialFiltrado.length / porPagina);
    const historialPaginado = historialOrdenado.slice(
        (paginaActual - 1) * porPagina,
        paginaActual * porPagina
    );

    async function handleObtenerInformacionCotizacion(id: number) {
        try {
            const info = await checkoutCotizacion(id);
            setCotizacionSeleccionadaDetails(info);
            dispatch({ type: 'OPEN_MODAL' });
        } catch (e) {
            console.error(e);
        }
    }

    function handleCloseModal() {
        dispatch({ type: 'CLOSE_MODAL' });
        setCotizacionSeleccionadaDetails(null);
    }

    return (
        <div className="w-full flex flex-col gap-[20px]">
            {/* Buscador */}
            <div className="relative flex items-center rounded-[10px]
                        px-4 py-2 w-full border-[#E2E2E2] shadow-sm">
                {/* Icono lupa */}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1116.65
                 6.65a7.5 7.5 0 010 10.6z"
                    />
                </svg>
                <input
                    type="text"
                    placeholder="Busqueda por Nombre o ID"
                    className="px-3 py-2 rounded w-full focus:outline-none"
                    value={busqueda}
                    onChange={(e) => {
                        setBusqueda(e.target.value);
                        setPaginaActual(1);
                    }}
                />
            </div>

            {historialPaginado.length > 0 ? (
            <table
                className="w-full text-sm rounded-[10px] border-b-[2px] border-gray-200 shadow-[0_0_2px_rgba(0,0,0,0.25)]">
                <thead className="bg-gray-100">
                <tr className="text-left font-semibold text-gray-700 border-b border-gray-200">
                    <th className="text-center py-2 px-4">
                        <button onClick={() => handleSort('id')} className="w-full flex items-center justify-center gap-1 focus:outline-none">
                            <span>ID</span>
                            <span className="inline-block w-3 text-center">{sortColumn==='id' ? (sortDir==='asc' ? '▲' : '▼') : '\u00A0'}</span>
                        </button>
                    </th>
                    <th className="text-center py-2 px-4">
                        <button onClick={() => handleSort('cliente')} className="w-full flex items-center justify-center gap-1 focus:outline-none">
                            <span>Cliente</span>
                            <span className="inline-block w-3 text-center">{sortColumn==='cliente' ? (sortDir==='asc' ? '▲' : '▼') : '\u00A0'}</span>
                        </button>
                    </th>
                    <th className="text-center py-2 px-4">
                        <button onClick={() => handleSort('fecha')} className="w-full flex items-center justify-center gap-1 focus:outline-none">
                            <span>Fecha</span>
                            <span className="inline-block w-3 text-center">{sortColumn==='fecha' ? (sortDir==='asc' ? '▲' : '▼') : '\u00A0'}</span>
                        </button>
                    </th>
                     <th className="text-center py-2">Cantidad</th>
                    <th className="text-center py-2 px-4">
                        <button onClick={() => handleSort('total')} className="w-full flex items-center justify-center gap-1 focus:outline-none">
                            <span>Total</span>
                            <span className="inline-block w-3 text-center">{sortColumn==='total' ? (sortDir==='asc' ? '▲' : '▼') : '\u00A0'}</span>
                        </button>
                    </th>
                    <th className="text-center py-2">Estado</th>
                 </tr>
                </thead>
                <tbody>
                {historialPaginado.map((c) => (
                        <tr
                            key={c.id}
                            className="transition-all duration-400 hover:scale-[1.005] ease-in-out hover:bg-gray-50 cursor-pointer"
                            onClick={() => handleObtenerInformacionCotizacion(c.id)}
                        >
                            <td className="text-center text-[18px] font-montserrat border-b border-gray-200 p-[10px]">{c.id}</td>
                            <td className="text-center text-[18px] font-montserrat border-b border-gray-200 p-[10px]">{c.cliente.nombre}</td>
                            <td className="text-center text-[18px] font-montserrat border-b border-gray-200 p-[10px]">
                                {new Date(c.fecha_crea).toLocaleDateString('es-CL')}
                            </td>
                            <td className="text-center text-[18px] font-montserrat border-b border-gray-200 p-[10px]">{c.items.length}</td>
                            <td className="text-center text-[18px] font-montserrat border-b border-gray-200 p-[10px]">{Math.round(c.total)}</td>
                            <td
                                className={`text-center text-[18px] font-montserrat border-b border-gray-200 p-[10px] border ${getEstadoColor(
                                    c.estado
                                )}`}
                            >
                                {c.estado}
                            </td>
                        </tr>))}

                </tbody>
            </table>):(
                <Loader label={'Cotizaciones'}/>
            )}

            {/* Paginación */}
            {totalPaginas > 0 && (
                <div className="flex justify-center items-center gap-2 mt-4 flex-wrap font-montserrat">
                    <button
                        onClick={() => setPaginaActual((p) => Math.max(1, p - 1))}
                        disabled={paginaActual === 1}
                        className="px-4 py-2 bg-gray-200 text-gray-400 rounded disabled:opacity-50 cursor-pointer hover:bg-gray-300"
                    >
                        Anterior
                    </button>

                    <div className="px-4 py-2 bg-gray-600 text-white rounded">
                        {paginaActual} de {totalPaginas} página(s)
                    </div>

                    <button
                        onClick={() => setPaginaActual((p) => Math.min(totalPaginas, p + 1))}
                        disabled={paginaActual === totalPaginas}
                        className="px-4 py-2 bg-gray-200 text-gray-400 rounded disabled:opacity-50 cursor-pointer hover:bg-gray-300"
                    >
                        Siguiente
                    </button>
                </div>
            )}


            {/* Modal de detalle */}
            {cotizacionSeleccionadaDetails && (
                <CotizacionDetalleModal
                    open={state.showModal}
                    onClose={handleCloseModal}
                    data={cotizacionSeleccionadaDetails}
                />
            )}
        </div>
    );
};

export default TablaCotizaciones;
