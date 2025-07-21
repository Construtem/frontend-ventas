import { useEffect, useState } from "react";
import { DBCotizacion, obtenerTodasLasCotizaciones } from "@/services/apiServices";


/*
// histoCotizacionesMock.ts
export interface HistorialRow {
    id:        number
    nombre:    string
    fecha:     string        // dd-mm-yyyy
    cantidad:  number
    total:     number        // precio final
    estado:    'Pendiente' | 'Aprobada' | 'Rechazada'
    // extras opcionales:
    costoEnvio?: number
    tipoDespacho?: 'A domicilio' | 'Retiro tienda'
}

export const historialCotizaciones: HistorialRow[] = [
    {
        id: 100001,
        nombre: 'Cotizacion01',
        fecha:  '10-07-2025',
        cantidad: 12,
        total: 24990,
        estado: 'Pendiente',
        costoEnvio: 4000,
        tipoDespacho: 'A domicilio',
    },
    {
        id: 100002,
        nombre: 'Cotizacion02',
        fecha:  '15-07-2025',
        cantidad: 8,
        total: 19990,
        estado: 'Aprobada',
        costoEnvio: 0,
        tipoDespacho: 'Retiro tienda',
    },
    {
        id: 100003,
        nombre: 'Cotizacion03',
        fecha:  '18-07-2025',
        cantidad: 5,
        total: 12990,
        estado: 'Rechazada',
        costoEnvio: 3500,
        tipoDespacho: 'A domicilio',
    },
    {
        id: 100004,
        nombre: 'Cotizacion04',
        fecha:  '20-07-2025',
        cantidad: 20,
        total: 45980,
        estado: 'Pendiente',
        costoEnvio: 0,
        tipoDespacho: 'Retiro tienda',
    },
]

*/

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


export default function CotizacionesCreadas() {

    const [historial, setHistorial] = useState<DBCotizacion[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        obtenerTodasLasCotizaciones()
            .then(data => {
                setHistorial(data);
                setError(null);
            })
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="bg-white px-[40px] py-[40px] rounded-[10px] overflow-auto
                      shadow-[0_0_2px_rgba(0,0,0,0.25)] flex flex-col gap-[10px] items-center sm:items-start
                      w-full gap-[20px]">
            <h2 className={'font-semibold font-montserrat text-[24px]'}>Cotizaciones Creadas</h2>


            {loading && <div className="text-gray-500">Cargando...</div>}
            {error && (
                <div className="text-red-500">
                    {error.includes('500')
                        ? 'Error al cargar cotizaciones, favor de verificar su conexión a internet'
                        : error}
                </div>
            )}
            {!loading && !error && (
                <table className="w-full text-sm rounded-[10px] overflow-hidden border-b-[2px] border-gray-200 shadow-[0_0_2px_rgba(0,0,0,0.25)]">
                    <thead>
                    <tr className="text-left font-semibold text-gray-700 border-b border-gray-200 bg-gray-100">
                        <th className={'text-center text-[16px] font-medium font-montserrat py-[10px] px-[10px]'}>ID</th>
                        <th className={'text-center text-[16px] font-medium font-montserrat py-[10px]'}>Cliente</th>
                        <th className={'text-center text-[16px] font-medium font-montserrat py-[10px]'}>Fecha</th>
                        <th className={'text-center text-[16px] font-medium font-montserrat py-[10px]'}>Cantidad</th>
                        <th className={'text-center text-[16px] font-medium font-montserrat py-[10px]'}>Total</th>
                        <th className={'text-center text-[16px] font-medium font-montserrat py-[10px]'}>Estado</th>
                    </tr>
                    </thead>
                    <tbody>

                    {historial && historial.map(c => (
                        <tr key={c.id} className={'transition-all duration-400 hover:scale-[1.005] ease-in-out hover:bg-gray-50 cursor-pointer'}>
                            <td className={'text-center text-[18px] font-montserrat border-b-[1px] border-gray-200 p-[10px] '}>{c.id}</td>
                            <td className={'text-center text-[18px] font-montserrat border-b-[1px] border-gray-200 p-[10px] '}>{c.cliente.nombre}</td>
                            <td className={'text-center text-[18px] font-montserrat border-b-[1px] border-gray-200 p-[10px] '}>{new Date(c.fecha_crea).toLocaleDateString('es-CL')}</td>
                            <td className={'text-center text-[18px] font-montserrat border-b-[1px] border-gray-200 p-[10px] '}>{c.total_items}</td>
                            <td className={'text-center text-[18px] font-montserrat border-b-[1px] border-gray-200 p-[10px] '}>{c.total_precio.toLocaleString('es-CL')}</td>
                            <td className={`text-center text-[18px] font-montserrat border-b-[1px] border-gray-200 p-[10px] 
                                rounded-full border ${getEstadoColor(c.estado)}`}>
                                {c.estado}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}