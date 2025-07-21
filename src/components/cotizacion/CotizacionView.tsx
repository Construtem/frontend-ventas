'use client'
import { DBCotizacion } from '@/services/apiServices'
import Button            from '@/components/Button'
import CotizacionHeader from "@/components/cotizacion/CotizacionHeader";
import {useCotizacionFlow} from "@/contexts/CotizacionFlow";

/* helpers */
const money = (v: number) => `$${v.toLocaleString('es-CL')}`
const capital = (t: string) => t.charAt(0).toUpperCase() + t.slice(1)

/* línea reutilizable */
function DetalleLinea ({
                           label,
                           value,
                       }: {
    label: string
    value: React.ReactNode
}) {
    return (
        <div className="py-3 grid grid-cols-[140px_1fr] gap-4">
            <dt className="text-gray-600">{label}:</dt>
            <dd className="font-medium break-words">{value}</dd>
        </div>
    )
}

/* card */
export function CotizacionView ({
                                    quote,
                                    onSeeDetail,
                                }: {
    quote: DBCotizacion
    onSeeDetail: () => void
}) {
    const {state} =useCotizacionFlow();
    console.log(quote)
    return (
        <article className="bg-white rounded-[10px] shadow px-8 py-6 lg:h-[550px]">
<CotizacionHeader/>
            {/* encabezado */}
            <header className="flex justify-between flex-wrap gap-4">
                <h2 className="text-2xl font-bold">
                    Cotización #{quote.id}
                </h2>

                <span
                    className={`px-4 py-1 rounded text-sm font-bold ${
                        quote.estado_pago === 'pagado'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-yellow-50 text-yellow-700'
                    }`}
                >
          {quote.estado_pago ? capital(quote.estado_pago) : 'Pendiente'}
        </span>
            </header>

            {/* tabla atributos */}
            <dl className="divide-y divide-gray-200">
                <DetalleLinea label={quote.cliente.nombre?'Nombre cliente: ': 'Rut cliente'} value={quote.cliente.nombre?quote.cliente.nombre:state.clienteRut}/>
                <DetalleLinea label="Descripción"    value={quote.descripcion ?? '—'} />
                <DetalleLinea
                    label="Tipo de envío"
                    value={
                        quote.tipo_despacho
                            ? quote.tipo_despacho.charAt(0).toUpperCase() + quote.tipo_despacho.slice(1)
                            : ''}/>
                <DetalleLinea label="Costo envío"    value={
                    !quote.costo_envio || isNaN(Number(quote.costo_envio)) || Number(quote.costo_envio) === 0
                        ? 'En espera del cálculo de despacho'
                        : Number(quote.costo_envio)
                } />
                {
                    /*
                    *
                {'quote.direccion' && (
                    <DetalleLinea label="Dirección" value={quote.direccion} />
                )}
                    * */
                }
            </dl>

            {/* actions */}
            <footer className="flex justify-end pt-4">
                {state.cotizacionId!==null && state.cotizacionId!>0 &&  (
                    <Button
                        label="Ver detalle"
                        className="bg-sky-600 hover:bg-sky-700 text-white"
                        onClick={onSeeDetail}
                    />
                )}
            </footer>
        </article>
    )
}
