'use client'
import { ChangeEvent, useCallback, useEffect, useState } from 'react'
import Button from '@/components/Button'
import {
    clienteService,
    DBCotizacion,
    DireccionCliente,
} from '@/services/apiServices'
import { useCotizacionFlow } from '@/contexts/CotizacionFlow'
import { useAddressCheck } from '@/hooks/useAddressCheck'
import { useMutation, useQuery } from '@tanstack/react-query'



/* ---------- pequeño sub-componente para alinear filas ---------- */
const DetalleLinea = ({
                          label,
                          children,
                          className,
                          classNameLabel,
                      }: {
    label: string
    children: React.ReactNode
    className?: string
    classNameLabel?: string
}) => (
    <div className={`flex w-full ${className ?? ''}`}>
        <div
            className={`w-fit sm:min-w-[200px] ${classNameLabel ?? ''}`}
        >
            <span className="text-gray-600">{label}</span>
        </div>
        <div className="w-full">{children}</div>
    </div>
)

/* ---------- tipos internos ---------- */
type Draft = Partial<DBCotizacion> & {
    tipo_despacho?: 'a domicilio' | 'retiro tienda'
    direccion_id?: number | null
}
interface Props {
    draft: Draft
    onChange: (patch: Partial<Draft>) => void
    onSave: () => void
    onCancel: () => void
}

/* ===================================================================== */
export const CotizacionForm: React.FC<Props> = ({
                                                    draft,
                                                    onChange,
                                                    onSave,
                                                    onCancel,
                                                }) => {
    const { state } = useCotizacionFlow()

    /* ───────── Direcciones existentes del cliente ───────── */
    const {
        data: direccion = [],
        isLoading: dirLoading,
        error: dirError,
        refetch: refetchDir,
    } = useQuery<DireccionCliente[]>({
        queryKey: ['direcciones', state.clienteRut],
        queryFn: () =>
            clienteService.obtenerDireccionDelCliente(state.clienteRut!),
        enabled: !!state.clienteRut,
    })

    /* si nunca se ha elegido una dirección, fijamos la primera */
    useEffect(() => {
        if (direccion.length && !draft.direccion_id) {
            onChange({ direccion_id: direccion[0].id })
        }
    }, [direccion, draft.direccion_id, onChange])

    /* ───────── Lógica de “nueva dirección” ───────── */
    const { check } = useAddressCheck()
    const [mostrarNuevaDir, setMostrarNuevaDir] = useState(false)
    const [nuevaDireccion, setNuevaDireccion] = useState('')
    const [nuevaComuna, setNuevaComuna] = useState('')
    const nuevaCiudad = 'Santiago'
    const [esValida, setEsValida] = useState(false)

    const validarDireccion = useCallback(async () => {
        const res = await check(nuevaDireccion, nuevaComuna, nuevaCiudad)
        setEsValida(res.ok)
    }, [check, nuevaDireccion, nuevaComuna, nuevaCiudad])

    const { mutate: guardarDireccion, isPending: guardandoDir } = useMutation({
        mutationFn: clienteService.crearDireccion,
        onSuccess: () => {
            setMostrarNuevaDir(false)
            setNuevaDireccion('')
            setNuevaComuna('')
            setEsValida(false)
            refetchDir()
        },
    })
    const handleGuardarDireccion = () => {
        if (!state.clienteRut || !esValida) return
        guardarDireccion({
            rut_cliente: state.clienteRut,
            direccion: nuevaDireccion,
            comuna: nuevaComuna,
            ciudad: nuevaCiudad,
        })
    }

    /* ───────── handler genérico para inputs controlados ───────── */
    const patch =
        (field: keyof Draft) =>
            (
                e: ChangeEvent<
                    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
                >,
            ) => {
                const value =
                    e.target.type === 'number'
                        ? Number(e.target.value)
                        : (e.target.value as unknown)
                onChange({ [field]: value } as Partial<Draft>)
            }

    /* ───────── util de formato ───────── */
    const formateaDir = (d: DireccionCliente) =>
        `${d.direccion}, ${d.comuna}, ${d.ciudad}`

    /* ───────── Render ───────── */
    return (
        <article className="bg-white rounded-[10px] shadow px-8 py-6 space-y-4 shadow-[0_0_2px_rgba(0,0,0,0.25)] lg:min-h-[550px]">
            {/* --- Título --- */}
            <header className="flex justify-between">
                <h2 className="text-2xl font-semibold text-sky-600">
                    {draft.id ? `Editar cotización #${draft.id}` : 'Nueva cotización'}
                </h2>
            </header>

            <div className="space-y-4 w-full">
                {/* --- Descripción --- */}
                <DetalleLinea label="Descripción">
          <textarea
              className="w-full border rounded px-3 py-1"
              value={draft.descripcion ?? ''}
              onChange={patch('descripcion')}
          />
                </DetalleLinea>

                {/* --- Tipo de envío --- */}
                <DetalleLinea label="Tipo de envío">
                    <select
                        className="border rounded px-2 py-1"
                        value={draft.tipo_despacho ?? 'a domicilio'}
                        onChange={(e) => {
                            const tipo = e.target.value as Draft['tipo_despacho']
                            onChange({
                                tipo_despacho: tipo,
                                direccion_id:
                                    tipo === 'retiro tienda' ? null : draft.direccion_id,
                            })
                        }}
                    >
                        <option value="a domicilio">A domicilio</option>
                        <option value="retiro tienda">Retiro en tienda</option>
                    </select>
                </DetalleLinea>

                {/* --- Dirección (si corresponde) --- */}
                {draft.tipo_despacho !== 'retiro tienda' && (
                    <DetalleLinea
                        label="Dirección de despacho"
                        className="flex-wrap xl:flex-nowrap items-baseline"
                    >
                        <div className="flex flex-col gap-4 max-w-fit">
                            {/* selector existente */}
                            {direccion.length > 0 && (
                                <select
                                    disabled={dirLoading}
                                    className="border rounded px-2 py-1 max-w-fit"
                                    value={draft.direccion_id ?? undefined}
                                    onChange={(e) =>
                                        onChange({ direccion_id: Number(e.target.value) })
                                    }
                                >
                                    {direccion.map((dir) => (
                                        <option key={dir.id} value={dir.id}>
                                            {formateaDir(dir)}
                                        </option>
                                    ))}
                                </select>
                            )}

                            {/* botón nueva dir */}
                            <Button
                                label={
                                    mostrarNuevaDir
                                        ? 'Cancelar nueva dirección'
                                        : '+ Nueva dirección'
                                }
                                className="w-fit bg-gray-200"
                                onClick={() => setMostrarNuevaDir((v) => !v)}
                            />

                            {/* formulario nueva dir */}
                            {mostrarNuevaDir && (
                                <div className="flex flex-col gap-2">
                                    <DetalleLinea label="Dirección:">
                                        <input
                                            type="text"
                                            className="border rounded px-2 py-1"
                                            placeholder="Dirección"
                                            value={nuevaDireccion}
                                            onChange={(e) => setNuevaDireccion(e.target.value)}
                                        />
                                    </DetalleLinea>

                                    <DetalleLinea label="Comuna:">
                                        <input
                                            type="text"
                                            className="border rounded px-2 py-1"
                                            placeholder="Comuna"
                                            value={nuevaComuna}
                                            onChange={(e) => setNuevaComuna(e.target.value)}
                                        />
                                    </DetalleLinea>

                                    <div className="flex gap-2 justify-end">
                                        <Button
                                            onClick={validarDireccion}
                                            label="Validar dirección"
                                            className="bg-blue-600 text-white w-fit"
                                        />
                                        <Button
                                            onClick={handleGuardarDireccion}
                                            label="Guardar dirección"
                                            disabled={!esValida || guardandoDir}
                                            className={`w-fit text-white ${
                                                esValida ? 'bg-blue-600' : 'bg-gray-300'
                                            }`}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </DetalleLinea>
                )}
            </div>

            {/* --- Footer --- */}
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

            {/* error direcciones */}
            {dirError && (
                <p className="text-rose-600 text-sm">{(dirError as Error).message}</p>
            )}
        </article>
    )
}