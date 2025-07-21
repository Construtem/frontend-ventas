'use client'
import { useState } from 'react'
import Modal         from '@/components/Modal/Modal';
import {
    ModalBody,
    ModalFooter,
    ModalHeader,
}                     from '@/components/Modal/ModalsParts';
import { clienteService } from '@/services/apiServices'

/* ─────────── Helpers de validación / formato ──────────────────────────────*/
/** Limpia todo lo que no sea dígito o k/K */
const cleanRut = (v: string) => v.replace(/[^0-9kK]/g, '').toUpperCase()

/** Calcula dígito verificador (módulo 11) */
function dv(rutSinDv: string) {
    let sum = 0, mul = 2
    for (let i = rutSinDv.length - 1; i >= 0; i--) {
        sum += +rutSinDv[i] * mul
        mul = mul === 7 ? 2 : mul + 1
    }
    const res = 11 - (sum % 11)
    return res === 11 ? '0' : res === 10 ? 'K' : String(res)
}

/** Valida el RUT (retorna {ok, clean}) */
function validateRut(input: string) {
    const cleaned = cleanRut(input)
    if (cleaned.length < 2) return { ok: false, clean: cleaned }

    const cuerpo = cleaned.slice(0, -1)
    const verif = cleaned.slice(-1)
    const ok = dv(cuerpo) === verif
    return { ok, clean: cleaned }
}

/** Formatea 12.345.678-K */
function formatRut(cleaned: string) {
    const cuerpo = cleaned.slice(0, -1)
    const verif = cleaned.slice(-1)
    return cuerpo
        .replace(/\B(?=(\d{3})+(?!\d))/g, '.')   // puntos cada 3
        .concat('-', verif)
}

const rutDash = (cleaned: string) =>
    cleaned.slice(0, -1).concat('-', cleaned.slice(-1))

/* ─────────── Modal ─────────────────────────────────────────────────────── */
interface ClienteModalProps {
    isOpen: boolean
    onClose: () => void
}

export function ClienteModal({ isOpen, onClose }: ClienteModalProps) {
    const [form, setForm] = useState({
        nombre: '',
        tipo: 'Persona',           // «Persona» | «Empresa»
        rut: '',
        telefono: '',
        email: '',
        razon_social: '',
    })
    const [errores, setErrores] = useState<Record<string, string>>({})
    const [saving, setSaving] = useState(false)

    /* Handlers de onChange con sanitización ------------------------------- */
    const onChangeNombre = (v: string) =>
        setForm(f => ({
            ...f,
            nombre: v.replace(/[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s]/g, ''), // solo letras y espacios
        }))

    const onChangeTelefono = (v: string) =>
        setForm(f => ({ ...f, telefono: v.replace(/\D+/g, '') })) // solo dígitos

    const onChangeRut = (v: string) => {
        const clean = cleanRut(v)
        if (clean.length > 9) return
        setForm(f => ({ ...f, rut: formatRut(clean) }))
    }

    /* Validación completa antes de guardar -------------------------------- */
    function validarFormulario() {
        const errs: Record<string, string> = {}

        // nombre
        if (!form.nombre.trim()) errs.nombre = 'Nombre obligatorio'

        // tipo
        const tipoId = form.tipo === 'Persona' ? 1 : 2

        // teléfono (opcional, pero si existe debe ser ≥ 8 dígitos)
        if (form.telefono && form.telefono.length < 8)
            errs.telefono = 'Teléfono demasiado corto'

        // e-mail (opcional, pero formato)
        if (form.email) {
            const email = form.email;
            const [local = '', domain = ''] = email.split('@');
            if (
                email.length > 320 ||
                local.length > 64 ||
                domain.length > 255 ||
                !/^([A-Za-z0-9]+(?:[.-][A-Za-z0-9]+)*)@([A-Za-z0-9]+(?:-[A-Za-z0-9]+)*(\.[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*)+)$/.test(email)
            ) {
                if (email.length > 320) errs.email = 'Email demasiado largo (máx. 320)';
                else if (local.length > 64) errs.email = 'La parte antes de @ es demasiado larga (máx. 64)';
                else if (domain.length > 255) errs.email = 'La parte después de @ es demasiado larga (máx. 255)';
                else errs.email = 'Email inválido';
            }
        }

        // RUT
        const { ok: rutOk, clean } = validateRut(form.rut)
        if (!rutOk) errs.rut = 'RUT inválido'

        setErrores(errs)
        return { esValido: Object.keys(errs).length === 0, cleanRut: clean, tipoId }
    }

    /* Guardar -------------------------------------------------------------- */
    async function handleSave() {
        const { esValido, cleanRut, tipoId } = validarFormulario()
        if (!esValido) return

        setSaving(true)
        try {
            await clienteService.crearCliente({
                rut:           rutDash(cleanRut),   // almacenamos con puntos y guion
                nombre:        form.nombre.trim(),
                telefono:      form.telefono || '',
                email:         form.email || undefined,
                razon_social:  form.razon_social || undefined,
                tipo_id:       tipoId as 1 | 2,
            })
            onClose()              // éxito → cierra modal
        } catch (err: unknown) {
            // Refinar:
            const message =
                err instanceof Error
                    ? err.message            // Error normal
                    : typeof err === 'string'
                        ? err                  // por si lanzas strings
                        : 'Error inesperado'

            alert(message)
        } finally {
            setSaving(false)
        }
    }

    /* Render – SE MANTIENE el markup y clases ============================= */
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="w-[500px] min-h-[500px] max-h-[700px] flex flex-col justify-between">
                <ModalHeader title="Cliente" onClose={onClose} />

                <ModalBody>
                    <div className="flex gap-[50px] px-[40px]">
                        <div className="flex flex-col gap-4">
                            {/* Nombre --------------------------------------------------- */}
                            <div className="flex flex-col w-[300px] gap-[5px]">
                                <label className="font-montserrat font-medium text-[20px]">Nombre</label>
                                <input
                                    value={form.nombre}
                                    onChange={e => onChangeNombre(e.target.value)}
                                    className="w-full rounded px-2 py-[10px] focus:outline-none border-black border-[1px] "
                                />
                                {errores.nombre && <p className="text-red-600 text-sm">{errores.nombre}</p>}
                            </div>

                            {/* Tipo cliente -------------------------------------------- */}
                            <div className="flex flex-col w-[300px] gap-[5px]">
                                <label className="font-montserrat font-medium text-[20px]">Tipo de cliente</label>
                                <select
                                    value={form.tipo}
                                    onChange={e => setForm(f => ({ ...f, tipo: e.target.value }))}
                                    className="w-full rounded px-2 py-[10px] focus:outline-none border-black border-[1px] "
                                >
                                    <option>Persona</option>
                                    <option>Empresa</option>
                                </select>
                            </div>

                            {/* RUT ------------------------------------------------------ */}
                            <div className="flex flex-col w-[300px] gap-[5px]">
                                <label className="font-montserrat font-medium text-[20px]">Rut</label>
                                <input
                                    value={form.rut}
                                    onChange={e => onChangeRut(e.target.value)}
                                    className="w-full rounded px-2 py-[10px] focus:outline-none border-black border-[1px] "
                                />
                                {errores.rut && <p className="text-red-600 text-sm">{errores.rut}</p>}
                            </div>

                            {/* Teléfono ------------------------------------------------ */}
                            <div className="flex flex-col w-[300px] gap-[5px]">
                                <label className="font-montserrat font-medium text-[20px]">Teléfono</label>
                                <input
                                    value={form.telefono}
                                    onChange={e => onChangeTelefono(e.target.value.slice(0, 15))}
                                    maxLength={15}
                                    className="w-full rounded px-2 py-[10px] focus:outline-none border-black border-[1px] "
                                />
                                {errores.telefono && <p className="text-red-600 text-sm">{errores.telefono}</p>}
                            </div>

                            {/* Email ---------------------------------------------------- */}
                            <div className="flex flex-col w-[300px] gap-[5px]">
                                <label className="font-montserrat font-medium text-[20px]">Email</label>
                                <input
                                    type="email"
                                    value={form.email}
                                    onChange={e => setForm(f => ({ ...f, email: e.target.value.slice(0, 320) }))}
                                    maxLength={320}
                                    className="w-full rounded px-2 py-[10px] focus:outline-none border-black border-[1px] "
                                />
                                {errores.email && <p className="text-red-600 text-sm">{errores.email}</p>}
                            </div>
                        </div>
                    </div>
                </ModalBody>

                <ModalFooter>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border rounded font-medium font-montserrat cursor-pointer hover:bg-gray-100"
                    >
                        Cancelar
                    </button>

                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-4 py-2 text-white rounded bg-[#1b5be7] hover:bg-[#1e4fbb] font-medium font-montserrat cursor-pointer disabled:opacity-60"
                    >
                        {saving ? 'Guardando…' : 'Guardar'}
                    </button>
                </ModalFooter>
            </div>
        </Modal>
    )
}
