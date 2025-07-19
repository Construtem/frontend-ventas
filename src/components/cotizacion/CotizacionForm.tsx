'use client'
import {ChangeEvent, useEffect, useState} from 'react'
import Button              from '@/components/Button'
import {clienteService, DBCotizacion, DireccionCliente} from '@/services/apiServices'
import {useCotizacionFlow} from "@/contexts/CotizacionFlow";
import {useAddressCheck} from "@/hooks/useAddressCheck";
import {useMutation} from "@tanstack/react-query";

type Draft = Partial<DBCotizacion>
interface Props {
    draft: Draft
    onChange: (patch: Draft) => void
    onSave:   () => void
    onCancel: () => void
}

const DetalleLinea = ({
                          label,
                          children, className, classNameLabel
                      }: {
    label: string
    children: React.ReactNode
    className?: string
    classNameLabel?: string
}) => (
    <div className={`flex w-full ${className}`}>
        <div className={`w-fit  sm:min-w-[200px] ${classNameLabel} `}>
        <span className="text-gray-600">{label}</span>
        </div>
        <div className={'w-full'}>{children}</div>
    </div>
)

export function CotizacionForm ({
                                    draft,
                                    onChange,
                                    onSave,
                                    onCancel,
                                }: Props) {
    const { check } = useAddressCheck()
    const { state } = useCotizacionFlow();
    const [direccion, setDireccion] = useState<DireccionCliente[]>([]);
    const [err, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!state.clienteRut) return;

        async function cargarDireccion() {
            try {
                const data = await clienteService.obtenerDireccionDelCliente(state.clienteRut);
                setDireccion(data);
            } catch (err: unknown) {
                console.error("Error al obtener dirección del cliente:", err);
                setError("No se pudo cargar la dirección del cliente");
            }
                console.log(err);
        }

        cargarDireccion();
    }, [state.clienteRut]);

/*
* */
    /* handlers pequeños para mantener el código limpio */
    const handle = (field: keyof Draft) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
        onChange({ [field]: e.target.type === 'number' ? Number(e.target.value) : e.target.value })
    const [mostrarInputsNewDireccion, setMostrarInputsNewDireccion] = useState(false);
    const [nuevaDireccion, setNuevaDireccion] = useState('');
    const [nuevaComuna, setNuevaComuna] = useState('');
    const [nuevaCiudad] = useState('Santiago');
    const [esValida, setEsValida] = useState(false);


    async function handleValidarDireccion() {
        const res = await check(nuevaDireccion, nuevaComuna, nuevaCiudad)

        if (!res.ok) {
            console.log('error')
            setEsValida(false)
            return
        }
        console.log('Dirección OK', res.formatted, res.placeId)
        setEsValida(true)

    }
    const {
        mutate:  guardarDireccion,
    } = useMutation({
        mutationFn: clienteService.crearDireccion,
        onSuccess:  (data) => {
            console.log('Dirección creada →', data)
            // aquí podrías despachar al contexto o mostrar toast
        },
    })
    function handleGuardarDireccion() {
        if(!state.clienteRut) return;
        guardarDireccion({
            rut_cliente: state.clienteRut,
            direccion:   nuevaDireccion,
            comuna:      nuevaComuna,
            ciudad:      nuevaCiudad,
        });
    }

    return (
        <article className="bg-white rounded-[10px] shadow px-8 py-6 space-y-4 lg:min-h-[550px]
                      shadow-[0_0_2px_rgba(0,0,0,0.25)] ">
            <header className="flex justify-between">
                <h2 className="text-2xl font-semibold text-sky-600">
                    {draft.id ? `Editar cotización #${draft.id}` : 'Nueva cotización'}
                </h2>
            </header>

            <div className="space-y-4  w-full">
                <DetalleLinea label="Descripción">
          <textarea
              className="w-full border rounded px-3 py-1"
              value={draft.descripcion ?? ''}
              onChange={handle('descripcion')}
          />
                </DetalleLinea>

                <DetalleLinea label="Tipo de envío">
                    <select
                        className="border rounded px-2 py-1"
                        value={draft.tipo_despacho ?? 'a domicilio'}
                        onChange={handle('tipo_despacho')}
                    >
                        <option value="a domicilio">A domicilio</option>
                        <option value="retiro tienda">Retiro en tienda</option>
                    </select>
                </DetalleLinea>

                <DetalleLinea label="Dirección de despacho" className={'flex-wrap xl:flex-nowrap flex items-baseline'}>
                    <div className={'flex gap-[5px] flex-wrap gap-4 flex-col max-w-fit'}>
                        {/* Select de direcciones */}
                        {direccion.length > 0 && (
                            <select
                                className="border rounded px-2 py-1 max-w-fit"
                                defaultValue={direccion[0].id}  /* opcional: selección inicial */
                            >
                                {direccion.map(dir => (
                                    <option key={dir.id} value={dir.id}>
                                        {`${dir.direccion}, ${dir.comuna}, ${dir.ciudad}`}
                                    </option>
                                ))}
                            </select>
                        )}
                        {mostrarInputsNewDireccion && (
                            <div className="mt-4 flex flex-col gap-2">
                                <DetalleLinea label={'Dirección:'}>
                                <input
                                    type="text"
                                    placeholder="Dirección"
                                    value={nuevaDireccion}
                                    onChange={(e) => setNuevaDireccion(e.target.value)}
                                    className="border rounded px-2 py-1"
                                />
                                </DetalleLinea>
                                <DetalleLinea label={'Comuna:'}>
                                <input
                                    type="text"
                                    placeholder="Comuna"
                                    value={nuevaComuna}
                                    onChange={(e) => setNuevaComuna(e.target.value)}
                                    className="border rounded px-2 py-1"
                                />
                                </DetalleLinea>
                            </div>
                        )}
                        {mostrarInputsNewDireccion?(
                            <div className={'flex justify-end'}>
                                <Button onClick={()=> {
                                    handleValidarDireccion()
                                    console.log('es validoo? ', esValida)
                                }
                                } label={'Validar dirección'} className="ml-2 bg-blue-600 text-white w-fit" />
                                <Button onClick={handleGuardarDireccion} label={'Guardar dirección'} className={`ml-2 text-white w-fit ${esValida?'bg-blue-600': 'bg-gray-300'}`}  disabled={esValida?false:true} />
                            </div>
                        ):(

                            <div className={'flex justify-center'}>
                    <Button onClick={()=>setMostrarInputsNewDireccion(true)} label={'+ Nueva dirección'} className="ml-2 bg-blue-600 text-white w-fit" />
                            </div>
                        )
                        }
                    </div>
                </DetalleLinea>
            </div>

            <footer className="flex justify-end gap-3 pt-4">
                <Button label="Cancelar" className="bg-gray-300" onClick={onCancel} />
                <Button label="Guardar"  className="bg-green-600 text-white" onClick={onSave} />
            </footer>
        </article>
    )
}
