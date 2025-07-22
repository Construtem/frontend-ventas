import Button from "@/components/Button";
import {useEffect, useMemo, useState} from "react";
import {useCotizacionFlow} from "@/contexts/CotizacionFlow";
import {useQuery} from "@tanstack/react-query";
import {clienteService, DBCotizacion} from "@/services/apiServices";
import NumberIcon from "@/components/NumberIcon";

export default function CotizacionHeader(){

    /* ----- historial remoto ----- */
    const { state, dispatch } = useCotizacionFlow()
    const {
        clienteRut,
        cotizacionId,
    } = state
    const {
        data: historial = [],
        isLoading,
    } = useQuery<DBCotizacion[]>({
        queryKey: ['historial', clienteRut],
        queryFn: () => clienteService.obtenerHistorialCotizaciones(clienteRut!),
        enabled: !!clienteRut,
    })

    const allQuotes = useMemo(
        () => [...state.localQuotes, ...historial],
        [state.localQuotes, historial]
    );
    const [cotizacionesCliente, setCotizacionesCliente] = useState<DBCotizacion[]>([]);
    useEffect(() => {
        const fetchCotizacionesCliente = async () => {
            if (!state.clienteRut) return;

            try {
                const data = await clienteService.obtenerHistorialCotizaciones(state.clienteRut);
                setCotizacionesCliente(data);
            } catch (err) {
                console.error("Error al obtener cotizaciones del cliente", err);
            }
        };

        fetchCotizacionesCliente();
    }, [state.clienteRut]);

    /** seleccionar cotizacion existente */
    const handleCotizacionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const idSeleccionado = Number(e.target.value);
        const cotizacion = cotizacionesCliente.find(c => c.id === idSeleccionado);

        if (cotizacion) {
            dispatch({ type: 'SET_COTIZACION_ID', payload: idSeleccionado });
            dispatch({ type: 'SET_COTIZACION_SELECCIONADA', payload: cotizacion });
        } else {
             // o no hacer nada
        }
        dispatch({ type: "CANCEL_NEW_QUOTE" });
    }
    return (
        <div className={'flex flex-col justify-between items-baseline mb-6 lg:flex-row lg:gap-0 gap-[20px] items-center'}>
            <div className={'flex items-center gap-[20px]'}>
            <NumberIcon number={2}/>
        <h1 className="font-montserrat font-semibold text-[32px]">
            Detalle cotización
        </h1>
            </div>

        <div className="flex gap-[10px]">
            {allQuotes.length > 0 && (
                <select
                    value={state.cotizacionId ?? ''}
                    onChange={handleCotizacionChange}
                    className="border rounded px-2 py-1"
                >
                    <option value="">Selecciona una cotización</option>
                    {cotizacionesCliente.map(c => (
                        <option key={c.id} value={c.id}>
                            Cotización #{c.id} - {new Date(c.fecha_crea).toLocaleDateString()}
                        </option>
                    ))}
                </select>
            )}
            {
                !state.isCreating &&
                (<Button
                        label="+ Nueva"
                        className={`bg-[#F59243] hover:bg-[#d98543] text-white`}
                        onClick={() => {
                            dispatch({type: 'START_NEW_QUOTE'})
                        }}/>
                )
            }
        </div>
        </div>
    )
}