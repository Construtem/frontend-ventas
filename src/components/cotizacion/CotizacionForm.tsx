'use client'
import React, { ChangeEvent, useEffect, useCallback } from 'react'
import Button from '@/components/Button'
import { useQuery } from '@tanstack/react-query'
import { useCotizacionFlow } from '@/contexts/CotizacionFlow'
import {
    clienteService,
    DBCotizacion,
    DireccionCliente,
} from '@/services/apiServices'
import NumberIcon from '@/components/NumberIcon'
import CotizacionBlocked from '@/components/cotizacion/CotizacionBlocked'
import CotizacionHeader from '@/components/cotizacion/CotizacionHeader'

type Draft = Partial<DBCotizacion> & {
    tipo_despacho?: 'a domicilio' | 'retiro tienda'
    direccionId?: number | null
}

interface Props {
    draft: Draft
    onChange: (patch: Partial<Draft>) => void
    onSave: () => void
    onCancel: () => void
}

const DetalleLinea: React.FC<{
    label: string
    children: React.ReactNode
    className?: string
    classNameLabel?: string
}> = ({ label, children, className, classNameLabel }) => (
    <div className={`flex w-full ${className ?? ''}`}>
        <div className={`w-fit sm:min-w-[200px] ${classNameLabel ?? ''}`}>
            <span className="text-gray-600">{label}</span>
        </div>
        <div className="w-full">{children}</div>
    </div>
)

export const CotizacionForm: React.FC<Props> = ({
                                                    draft,
                                                    onChange,
                                                    onSave,
                                                    onCancel,
                                                }) => {
    const { state } = useCotizacionFlow()
    const { clienteRut } = state

    // Direcciones existentes
    const {
        data: direccion = [],
        isLoading: dirLoading,
        error: dirError,
    } = useQuery<DireccionCliente[]>({
        queryKey: ['direcciones', clienteRut],
        queryFn: () => clienteService.obtenerDireccionDelCliente(clienteRut!),
        enabled: !!clienteRut,
    })

    // Si no hay draft.direccionId, inicializo en el primero
    useEffect(() => {
        if (direccion.length > 0 && draft.direccionId == null) {
            onChange({ direccionId: direccion[0].id })
        }
    }, [direccion, draft.direccionId, onChange])

    // Handler genérico inputs
    const patch = useCallback(
        (field: keyof Draft) =>
            (
                e: ChangeEvent<
                    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
                >
            ) => {
                const val =
                    e.target.type === 'number'
                        ? Number(e.target.value)
                        : (e.target.value as any)
                onChange({ [field]: val })
            },
        [onChange]
    )

    const formateaDir = (d: DireccionCliente) =>
        `${d.direccion}, ${d.comuna}, ${d.ciudad}`

    return (
        <article
            className={`${
                state.clienteRut ? '' : 'h-full relative flex flex-col'
            } bg-white rounded-[10px] shadow px-8 py-6 space-y-4 shadow-[0_0_2px_rgba(0,0,0,0.25)] lg:min-h-[550px]`}
        >
            {!state.clienteRut ? (
                <>
                    <div className={`flex relative items-baseline`}>
                        <NumberIcon number={2} className={'absolute'} />
                    </div>
                    <CotizacionBlocked />
                </>
            ) : (
                <>
                    <CotizacionHeader />

                    <header className="flex justify-between">
                        <h2 className="text-2xl font-semibold text-sky-600">
                            {draft.id ? `Editar cotización #${draft.id}` : 'Nueva cotización'}
                        </h2>
                        {state.clienteRut && (
                            <span className="text-gray-500 ml-4">
                Cliente: {state.clienteRut}
              </span>
                        )}
                    </header>

                    <div className="space-y-4 w-full">
                        <DetalleLinea label="Descripción">
              <textarea
                  className="w-full border rounded px-3 py-1"
                  value={draft.descripcion ?? ''}
                  onChange={patch('descripcion')}
              />
                        </DetalleLinea>
                        <DetalleLinea label="Tipo de envío">
                            <select
                                className="border rounded px-2 py-1"
                                value={draft.tipo_despacho ?? 'a domicilio'}
                                onChange={(e) => {
                                    const t = e.target.value as Draft['tipo_despacho']
                                    onChange({
                                        tipo_despacho: t,
                                        // si retiro, limpio dirección
                                        direccionId: t === 'retiro tienda' ? null : draft.direccionId,
                                    })
                                }}
                            >
                                <option value="a domicilio">A domicilio</option>
                                <option value="retiro tienda">Retiro en tienda</option>
                            </select>
                        </DetalleLinea>

                        {draft.tipo_despacho !== 'retiro tienda' && (
                            <DetalleLinea
                                label="Dirección de despacho"
                                className="flex-wrap xl:flex-nowrap items-baseline"
                            >
                                <div className="flex flex-col gap-4 max-w-fit">
                                    {direccion.length > 0 && (
                                        <select
                                            disabled={dirLoading}
                                            className="border rounded px-2 py-1 max-w-fit"
                                            value={draft.direccionId ?? undefined}
                                            onChange={(e) =>
                                                onChange({ direccionId: Number(e.target.value) })
                                            }
                                        >
                                            {direccion.map((dir) => (
                                                <option key={dir.id} value={dir.id}>
                                                    {formateaDir(dir)}
                                                </option>
                                            ))}
                                        </select>
                                    )}
                                </div>
                            </DetalleLinea>
                        )}
                    </div>

                    <footer className="flex gap-4 pt-4">
                        <Button
                            label="Confirmar"
                            className="bg-sky-600 hover:bg-sky-700 text-white flex-1"
                            onClick={onSave}
                        />
                        <Button
                            label="Cancelar"
                            className="bg-gray-200 flex-1"
                            onClick={onCancel}
                        />
                    </footer>

                    {dirError && (
                        <p className="text-rose-600 text-sm">
                            {(dirError as Error).message}
                        </p>
                    )}
                </>
            )}
        </article>
    )
}

export default CotizacionForm
