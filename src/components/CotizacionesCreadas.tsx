import { useEffect, useState } from "react";
import { DBCotizacion, obtenerTodasLasCotizaciones } from "@/services/apiServices";
import TablaCotizaciones from "@/components/TablaCotizaciones";

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
            <TablaCotizaciones historial={historial} />




        </div>
    );
}