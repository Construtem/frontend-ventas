import { useState } from 'react';
import {checkoutCotizacion, DBCotizacion} from "@/services/apiServices";

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

const TablaCotizaciones = ({historial}:{historial: DBCotizacion[]} ) => {
    const [paginaActual, setPaginaActual] = useState(1);
    const [busqueda, setBusqueda] = useState('');
    const porPagina = 10;

    // Filtrar por nombre del cliente
    const historialFiltrado = historial.filter(c =>
        c.cliente.nombre.toLowerCase().includes(busqueda.toLowerCase())
    );

    const totalPaginas = Math.ceil(historialFiltrado.length / porPagina);

    const historialPaginado = historialFiltrado.slice(
        (paginaActual - 1) * porPagina,
        paginaActual * porPagina
    );

    async function handleObtenerInformacionCotizacion (id: number) {
        id=1
        console.log(id)
        /*

        try {
            const info = await checkoutCotizacion(id)
            console.log(info)
        } catch (e) {
            console.error(e)
            alert('No se pudo iniciar el pago')
        }
        * */
    }
    return (
        <div className="w-full">
            {/* Buscador */}
            <div className="mb-4 flex justify-between items-center flex-wrap gap-2 w-full bg-gray-300">
                <input
                    type="text"
                    placeholder="Buscar cliente..."
                    className="border px-3 py-2 rounded w-full sm:w-64"
                    value={busqueda}
                    onChange={(e) => {
                        setBusqueda(e.target.value);
                        setPaginaActual(1);
                    }}
                />
            </div>

            {/* Tabla */}
            <table className="w-full text-sm rounded-[10px] border-b-[2px] border-gray-200 shadow-[0_0_2px_rgba(0,0,0,0.25)]">
                <thead className="bg-gray-100">
                <tr className="text-left font-semibold text-gray-700 border-b border-gray-200">
                    <th className="text-center text-[16px] font-medium font-montserrat py-[10px] px-[10px]">ID</th>
                    <th className="text-center text-[16px] font-medium font-montserrat py-[10px]">Cliente</th>
                    <th className="text-center text-[16px] font-medium font-montserrat py-[10px]">Fecha</th>
                    <th className="text-center text-[16px] font-medium font-montserrat py-[10px]">Cantidad</th>
                    <th className="text-center text-[16px] font-medium font-montserrat py-[10px]">Total</th>
                    <th className="text-center text-[16px] font-medium font-montserrat py-[10px]">Estado</th>
                </tr>
                </thead>
                <tbody>
                {historialPaginado.length === 0 ? (
                    <tr>
                        <td colSpan={6} className="text-center py-4 text-gray-500">
                            No se encontraron resultados.
                        </td>
                    </tr>
                ) : (
                    historial && historialPaginado.map((c) => (
                        <tr
                            key={c.id}
                            className="transition-all duration-400 hover:scale-[1.005] ease-in-out hover:bg-gray-50 cursor-pointer"
                            onClick={()=>handleObtenerInformacionCotizacion(c.id)}
                        >
                            <td className="text-center text-[18px] font-montserrat border-b border-gray-200 p-[10px]">{c.id}</td>
                            <td className="text-center text-[18px] font-montserrat border-b border-gray-200 p-[10px]">{c.cliente.nombre}</td>
                            <td className="text-center text-[18px] font-montserrat border-b border-gray-200 p-[10px]">
                                {new Date(c.fecha_crea).toLocaleDateString('es-CL')}
                            </td>
                            <td className="text-center text-[18px] font-montserrat border-b border-gray-200 p-[10px]">{c.total_items}</td>
                            <td className="text-center text-[18px] font-montserrat border-b border-gray-200 p-[10px]">{c.total_precio.toLocaleString('es-CL')}</td>
                            <td
                                className={`text-center text-[18px] font-montserrat border-b border-gray-200 p-[10px] rounded-full border ${getEstadoColor(
                                    c.estado
                                )}`}
                            >
                                {c.estado}
                            </td>
                        </tr>
                    ))
                )}
                </tbody>
            </table>

            {/* Paginación */}
            {totalPaginas > 1 && (
                <div className="flex justify-center items-center gap-2 mt-4 flex-wrap">
                    <button
                        onClick={() => setPaginaActual((p) => Math.max(1, p - 1))}
                        disabled={paginaActual === 1}
                        className="px-3 py-1 bg-gray-200 text-gray-700 rounded disabled:opacity-50 cursor-pointer hover:bg-gray-300"
                    >
                        Anterior
                    </button>

                    {[...Array(totalPaginas)].map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setPaginaActual(i + 1)}
                            className={`px-3 py-1 rounded ${
                                paginaActual === i + 1
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-800 cursor-pointer hover:bg-gray-300'
                            }`}
                        >
                            {i + 1}
                        </button>
                    ))}

                    <button
                        onClick={() => setPaginaActual((p) => Math.min(totalPaginas, p + 1))}
                        disabled={paginaActual === totalPaginas}
                        className="px-3 py-1 bg-gray-200 text-gray-700 rounded disabled:opacity-50 cursor-pointer hover:bg-gray-300"
                    >
                        Siguiente
                    </button>
                </div>
            )}
        </div>
    );
};

export default TablaCotizaciones;
