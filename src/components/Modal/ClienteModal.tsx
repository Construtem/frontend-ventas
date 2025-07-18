'use client'
import { useState } from 'react'
import Modal from '@/components/Modal/Modal'
import {ModalBody, ModalFooter, ModalHeader} from '@/components/Modal/ModalsParts'
interface ClienteModalProps {
    isOpen: boolean
    onClose: () => void
    /* aquí podrías pasar un onSave, los datos existentes, etc. */
}

export function ClienteModal({ isOpen, onClose }: ClienteModalProps) {
    const [FormCliente, setFormCliente] = useState({ nombre: '', tipo: 'Persona', telefono: '', email: '' })
    const [Direcciones, setFormDirecciones] = useState([{ id: 1, direccion: '', comuna: '', ciudad: '',  }])

    const handleSave = () => {
        // validar + llamar al servicio para guardar
        onClose()
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalHeader title="Cliente" onClose={onClose} />
                <ModalBody>
                    <div className="flex gap-[50px]">
                        <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-[5px]">
                            <label className={"text-white font-medium text-[20px]"}>Nombre</label>
                            <input
                                value={FormCliente.nombre}
                                onChange={e => setFormCliente(f => ({...f, nombre: e.target.value}))}
                                className="w-full border rounded px-2 py-[10px] bg-[#19233c] text-white focus:outline-none border-none "
                            />
                        </div>
                        <div className="flex flex-col gap-[5px]">
                            <label className={"text-white font-medium text-[20px]"}>Tipo de cliente</label>
                            <select
                                value={FormCliente.tipo}
                                onChange={e => setFormCliente(f => ({...f, tipo: e.target.value}))}
                                className="w-full border rounded px-2 py-[10px] bg-[#19233c] text-white focus:outline-none border-none "
                            >
                                <option>Persona</option>
                                <option>Empresa</option>
                            </select>
                        </div>
                        <div className="flex flex-col gap-[5px]">
                            <label className={"text-white font-medium text-[20px]"}>Teléfono</label>
                            <input
                                value={FormCliente.telefono}
                                onChange={e => setFormCliente(f => ({...f, nombre: e.target.value}))}
                                className="w-full border rounded px-2 py-[10px] bg-[#19233c] text-white focus:outline-none border-none "
                            />
                        </div>
                        <div className="flex flex-col gap-[5px]">
                            <label className={"text-white font-medium text-[20px]"}>Email</label>
                            <input
                                value={FormCliente.email}
                                onChange={e => setFormCliente(f => ({...f, nombre: e.target.value}))}
                                className="w-full border rounded px-2 py-[10px] bg-[#19233c] text-white focus:outline-none border-none "
                            />
                        </div>
                        </div>
                        <div className="flex flex-col gap-[5px]">
                            <h2 className={'text-white font-medium text-[24px]'}>Direcciones</h2>
                            <div className={'flex flex-col gap-[40px]'}>
                            <select className={'text-[24px] bg-gray-800 px-[20px] py-[10px] w-full text-white'}>
                                <option>Direccion 1</option>
                                <option>Direccion 2</option>
                                <option>Direccion 3</option>
                            </select>
                            <div className={'flow flow-col bg-white p-[20px] rounded-[10px]'}>
                            <div className="flex flex-col gap-[5px]">
                                <label className={"font-medium text-[24px]"}>Dirección</label>
                                <input
                                    value={Direcciones[0].direccion}
                                    onChange={e => setFormDirecciones(d => [{...d[0], direccion: e.target.value}])}
                                    className="w-full border rounded px-2 py-[10px] border border-[#E2E2E2] focus:outline-none  "
                                />
                            </div>
                            <div className="flex flex-col gap-[5px]">
                                <label className={"font-medium text-[24px]"}>Comuna</label>
                                <input
                                    value={Direcciones[0].comuna}
                                    onChange={e => setFormDirecciones(d => [{...d[0], comuna: e.target.value}])}
                                    className="w-full border rounded px-2 py-[10px] border border-[#E2E2E2] focus:outline-none  "
                                />
                            </div>
                            <div className="flex flex-col gap-[5px]">
                                <label className={"font-medium text-[24px]"}>Ciudad</label>
                                <input
                                    value={Direcciones[0].ciudad}
                                    onChange={e => setFormDirecciones(d => [{...d[0], ciudad: e.target.value}])}
                                    className="w-full border rounded px-2 py-[10px] border border-[#E2E2E2] focus:outline-none  "
                                />
                            </div>
                            </div>
                            </div>
                        </div>
                    </div>
                </ModalBody>

                <ModalFooter>
                    <button onClick={onClose} className="px-4 py-2 border rounded bg-[#18223b] font-medium font-montserrat cursor-pointer text-white">Cancelar</button>
                    <button onClick={handleSave} className="px-4 py-2 text-white rounded bg-[#1b5be7] font-medium font-montserrat cursor-pointer">Guardar</button>
                </ModalFooter>
        </Modal>
    )
}