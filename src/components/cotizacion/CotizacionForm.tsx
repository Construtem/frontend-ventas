'use client'
import React, { ChangeEvent, useEffect, useCallback, useState, useRef } from 'react'
import Button from '@/components/Button'
import { useCotizacionFlow } from '@/contexts/CotizacionFlow'
import {
    DBCotizacion,
    clienteService,
} from '@/services/apiServices'
import NumberIcon from '@/components/NumberIcon'
import CotizacionBlocked from '@/components/cotizacion/CotizacionBlocked'
import CotizacionHeader from '@/components/cotizacion/CotizacionHeader'
import { Autocomplete, useJsApiLoader } from '@react-google-maps/api'

type Draft = Partial<DBCotizacion> & {
    tipo_despacho?: 'a domicilio' | 'retiro tienda'
    direccion?: string
    comuna?: string
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
                        : e.target.value
                onChange({ [field]: val })
            },
        [onChange]
    )

    // Google Maps Autocomplete
    const [direccionValida, setDireccionValida] = useState(true)
    const autocompleteRef = useRef<google.maps.places.Autocomplete|null>(null)
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
        libraries: ['places'],
    })

    // Estado para mostrar el input de nueva dirección
    const [agregandoDireccion, setAgregandoDireccion] = useState(false)
    const [nuevaDireccion, setNuevaDireccion] = useState('')
    const [nuevaDireccionValida, setNuevaDireccionValida] = useState(true)
    const [loadingDireccion, setLoadingDireccion] = useState(false)

    const [direccionesCliente, setDireccionesCliente] = useState<any[]>([])
    const [direccionIdSeleccionada, setDireccionIdSeleccionada] = useState<number | null>(null)

    // Obtener direcciones del cliente al montar o cambiar el rut
    useEffect(() => {
        async function fetchDirecciones() {
            if (state.clienteRut) {
                const dirs = await clienteService.obtenerDireccionDelCliente(state.clienteRut)
                setDireccionesCliente(dirs)
                // Si hay direcciones, seleccionar la primera por defecto
                if (dirs.length > 0) {
                    setDireccionIdSeleccionada(dirs[0].id)
                    onChange({ direccionId: dirs[0].id })
                }
            } else {
                setDireccionesCliente([])
                setDireccionIdSeleccionada(null)
            }
        }
        fetchDirecciones()
    }, [state.clienteRut])

    // Handler para agregar nueva dirección
    const handleAgregarDireccion = async () => {
        if (!nuevaDireccionValida || !nuevaDireccion) return
        setLoadingDireccion(true)
        try {
            if (!state.clienteRut) throw new Error('No hay cliente seleccionado')
            const nueva = await clienteService.crearDireccion({
                rut_cliente: state.clienteRut,
                direccion: nuevaDireccion,
                comuna: draft.comuna || '',
                ciudad: 'Santiago',
            })
            // Refrescar direcciones y seleccionar la nueva
            const dirs = await clienteService.obtenerDireccionDelCliente(state.clienteRut)
            setDireccionesCliente(dirs)
            setDireccionIdSeleccionada(nueva.id)
            onChange({ direccionId: nueva.id })
        } catch (e) {
            // Manejo de error (puedes mostrar un mensaje)
    console.log(e)
        }
        setLoadingDireccion(false)
        setAgregandoDireccion(false)
        setNuevaDireccion('')
    }

    // Al seleccionar una dirección guardada, actualizar el contexto
    const handleSeleccionDireccion = (id: number) => {
        setDireccionIdSeleccionada(id)
        onChange({ direccionId: id })
    }

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
                                        // si retiro, limpiar dirección y comuna
                                        direccion: t === 'retiro tienda' ? '' : draft.direccion,
                                        comuna: t === 'retiro tienda' ? '' : draft.comuna,
                                    })
                                }}
                            >
                                <option value="a domicilio">A domicilio</option>
                                <option value="retiro tienda">Retiro en tienda</option>
                            </select>
                        </DetalleLinea>

                        {draft.tipo_despacho !== 'retiro tienda' && (
                            <>
                                <DetalleLinea label="Dirección guardada">
                                    <div className={'flex gap-[20px] flex-wrap items-end'}>

                                    <select
                                        className="border rounded px-2 py-1 w-[60%] h-fit"
                                        value={direccionIdSeleccionada ?? ''}
                                        onChange={e => handleSeleccionDireccion(Number(e.target.value))}
                                    >
                                        <option value="">Selecciona una dirección...</option>
                                        {direccionesCliente.map((dir: any) => (
                                            <option key={dir.id} value={dir.id}>{dir.direccion} - {dir.comuna}</option>
                                        ))}
                                    </select>
                                    <Button
                                        label="Agregar nueva dirección"
                                        className="bg-green-500 text-white text-[16px] font-montserrat "
                                        onClick={() => setAgregandoDireccion(true)}
                                    />
                                    </div>
                                </DetalleLinea>

                                {agregandoDireccion && (
                                    <DetalleLinea label="Nueva dirección">
                                        <div className={'flex gap-[20px] flex-wrap items-end'}>

                                            {isLoaded ? (
                                                <Autocomplete
                                                    className="text-sm font-montserrat w-[60%] h-full "
                                                    onLoad={ac => (autocompleteRef.current = ac)}
                                                    onPlaceChanged={() => {
                                                        if (autocompleteRef.current) {
                                                            const place = autocompleteRef.current.getPlace()
                                                            if (place && place.formatted_address) {
                                                                const direccion = place.formatted_address
                                                                const esSantiago = direccion.toLowerCase().includes('santiago') && direccion.toLowerCase().includes('chile')
                                                                if (esSantiago) {
                                                                    setNuevaDireccion(direccion)
                                                                    setNuevaDireccionValida(true)
                                                                } else {
                                                                    setNuevaDireccionValida(false)
                                                                }
                                                            } else {
                                                                setNuevaDireccionValida(false)
                                                            }
                                                        }
                                                    }}
                                                >
                                                    <input
                                                        type="text"
                                                        className={`border rounded px-2 py-1 w-full h-fit ${nuevaDireccionValida ? '' : 'border-red-500'}`}
                                                        value={nuevaDireccion}
                                                        onChange={e => setNuevaDireccion(e.target.value)}
                                                        placeholder="Busca y selecciona una dirección válida de Santiago, Chile"
                                                    />
                                                </Autocomplete>
                                            ) : (
                                                <input
                                                    type="text"
                                                    className="border rounded px-2 py-1 w-full"
                                                    value={nuevaDireccion}
                                                    onChange={e => setNuevaDireccion(e.target.value)}
                                                    placeholder="Cargando Autocomplete..."
                                                />
                                            )}
                                            <Button
                                                label={loadingDireccion ? 'Guardando...' : 'Guardar dirección'}
                                                className="ml-2 bg-blue-500 text-white"
                                                onClick={handleAgregarDireccion}
                                                disabled={!nuevaDireccionValida || !nuevaDireccion || loadingDireccion}
                                            />
                                            {!nuevaDireccionValida && (
                                                <span className="text-red-500 text-sm">Solo se permiten direcciones de Santiago, Chile seleccionadas de la lista.</span>
                                            )}
                                        </div>
                                    </DetalleLinea>
                                )}
                            </>
                        )}
                    </div>

                    <footer className="flex gap-4 pt-4">
                        <Button
                            label="Confirmar"
                            className="bg-sky-600 hover:bg-sky-700 text-white flex-1"
                            onClick={onSave}
                            disabled={!direccionValida}
                        />
                        <Button
                            label="Cancelar"
                            className="bg-gray-200 flex-1"
                            onClick={onCancel}
                        />
                    </footer>
                </>
            )}
        </article>
    )
}

export default CotizacionForm