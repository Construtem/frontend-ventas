import Button from "@/components/Button";
import {useMemo} from "react";
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

    /** seleccionar cabecera existente */
    const handleSelectQuote = (val: string) => {
        const id = Number(val);
        if (id > 0) {
            dispatch({ type: 'SET_QUOTE', payload: id });
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
                    disabled={isLoading}
                    className="border rounded px-2 py-1 min-w-[240px]"
                    value={cotizacionId ?? ''}
                    onChange={(e) => handleSelectQuote(e.target.value)}
                >
                    <option value="">Seleccionar cotización</option>
                    {allQuotes.map((q) => (
                        <option key={q.id} value={q.id}>
                            #{q.id} — {new Date(q.fecha_crea).toLocaleDateString()}
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