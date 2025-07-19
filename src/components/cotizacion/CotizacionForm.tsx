'use client'
import { ChangeEvent }     from 'react'
import Button              from '@/components/Button'
import { DBCotizacion }    from '@/services/apiServices'

type Draft = Partial<DBCotizacion>
interface Props {
    draft: Draft
    onChange: (patch: Draft) => void
    onSave:   () => void
    onCancel: () => void
}

const DetalleLinea = ({
                          label,
                          children,
                      }: {
    label: string
    children: React.ReactNode
}) => (
    <div className="py-3 grid grid-cols-[140px_1fr] gap-4">
        <dt className="text-gray-600">{label}:</dt>
        <dd>{children}</dd>
    </div>
)

export function CotizacionForm ({
                                    draft,
                                    onChange,
                                    onSave,
                                    onCancel,
                                }: Props) {
    // obtén el rut del cliente seleccionado del contexto y hace un fetch a obtenerDireccionDelCliente



    /* handlers pequeños para mantener el código limpio */
    const handle = (field: keyof Draft) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
        onChange({ [field]: e.target.type === 'number' ? Number(e.target.value) : e.target.value })

    return (
        <article className="bg-white rounded shadow px-8 py-6 space-y-4">
            <header className="flex justify-between">
                <h2 className="text-2xl font-semibold text-sky-600">
                    {draft.id ? `Editar cotización #${draft.id}` : 'Nueva cotización'}
                </h2>
            </header>

            <div className="space-y-4">
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

                <DetalleLinea label="Dirección de despacho">
                    <select className="border rounded px-2 py-1">
                        {/* Aquí se deberían listar las direcciones del cliente */}
                        <option value="direccion1">Dirección 1</option>
                        <option value="direccion2">Dirección 2</option>
                    </select>
                    <Button onClick={()=>{console.log('se hizo click')}} label={'+ Nueva dirección'} className="ml-2 bg-blue-600 text-white" />
                </DetalleLinea>
            </div>

            <footer className="flex justify-end gap-3 pt-4">
                <Button label="Cancelar" className="bg-gray-300" onClick={onCancel} />
                <Button label="Guardar"  className="bg-green-600 text-white" onClick={onSave} />
            </footer>
        </article>
    )
}
