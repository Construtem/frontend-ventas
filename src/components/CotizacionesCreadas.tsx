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
    const [DetalleCotizacion, setDetalleCotizacion] = useState(false);
    const [cotizacionSeleccionada, setCotizacionSeleccionada] = useState<DBCotizacion | null>(null);


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

                {/* Detalle de cotización modal */}
                {DetalleCotizacion && cotizacionSeleccionada && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg shadow-lg max-w-md w-full max-h-[80vh]">

                            {/* Header del modal */}
                            <div className="bg-[#091127] w-[calc(100%)] rounded-t-lg justify-center">
                            <div className=" px-5 py-4 flex justify-between items-center-mx-6 ">
                                <h2 className="text-white text-3xl font-bold">Detalle Cotización</h2>
                                <button
                                onClick={() => setDetalleCotizacion(false)}
                                className="text-white text-xl font-bold hover:text-gray-300 cursor-pointer"
                                >
                                &times;
                                </button>
                            </div>
                            </div>

                            <div className="p-6 max-h-[70vh] overflow-y-auto">
                            <p className="border-b border-black mt-3 mb-3"><strong>ID:</strong> {cotizacionSeleccionada.id}</p>
                            <p className="border-b border-black mt-4 mb-3"><strong>Cliente:</strong> {cotizacionSeleccionada.cliente.nombre}</p>
                            <p className="border-b border-black mt-4 mb-3"><strong>Fecha:</strong> {new Date(cotizacionSeleccionada.fecha_crea).toLocaleDateString('es-CL')}</p>
                            <p className="border-b border-black mt-4 mb-3"><strong>Cantidad de Productos:</strong> {cotizacionSeleccionada.total_items}</p>
                            <p className="border-b border-black mt-4 mb-3"><strong>Total:</strong> {cotizacionSeleccionada.total_precio.toLocaleString('es-CL')}</p>
                            <p className="border-b border-black mt-4 mb-3"><strong>Estado:</strong> {cotizacionSeleccionada.estado}</p>
                            <p className="border-b border-black mt-4 mb-3"><strong>Costo Envio:</strong> {cotizacionSeleccionada.costo_envio}</p>
                            <p className="border-b border-black mt-4 mb-3"><strong>Tipo de despacho:</strong> {cotizacionSeleccionada.tipo_despacho}</p>
                            <p className="border-b border-black mt-4 mb-3"><strong>Productos:</strong></p>
                            <ul className="list-disc pl-5">
                                {(cotizacionSeleccionada.items?.length ?? 0) === 0 ? (
                                    <li className="mt-2 text-gray-00">No hay productos en esta cotización.</li>
                                ) : (
                                cotizacionSeleccionada.items.map((producto, index) => (
                                    <li key={index} className="mt-2">
                                        <strong>{producto.cantidad}</strong>: {producto.nombre} ({producto.sku})
                                    </li>
                                )) 
                                )}
                            </ul>

                            <div className="flex mb-4 mx-6 justify-end">
                            <button
                                className="mt-4 bg-[#E5E7EB] text-black font-bold px-4 py-2 rounded hover:bg-[#B0B2B5] shadow-md cursor-pointer"
                                onClick={() => setDetalleCotizacion(false)}
                            >
                                Cerrar
                            </button>
                            </div>
    
                            </div>
                        </div>
                    </div>
                )}

            
            
            <h2 className={'font-semibold font-montserrat text-[24px]'}>Cotizaciones Creadas</h2>


            {loading && <div className="text-gray-500">Cargando...</div>}
            {error && <div className="text-red-500">{error}</div>}
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
                        <tr key={c.id} className={"transition-all duration-400 hover:scale-[1.005] ease-in-out hover:bg-gray-50 cursor-pointer"}
                            onClick={() => {
                                setDetalleCotizacion(true);
                                setCotizacionSeleccionada(c);
                            }}
                        >
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
    )
}
