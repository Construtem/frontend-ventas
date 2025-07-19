'use client'
import Modal from '@/components/Modal/Modal';
import { ModalBody, ModalFooter, ModalHeader } from '@/components/Modal/ModalsParts';
import Button from '@/components/Button';
import {useCotizacionFlow} from "@/contexts/CotizacionFlow";
import {obtenerProductosInventario, ProductoInventario} from "@/services/apiServices";
import {useEffect, useState} from "react";
import {toDraft} from "@/app/productMapper";

interface ProductoModalProps {
    isOpen: boolean;
    onClose: () => void;
}
interface Bodega {
    sucursal_id: number;
    nombre: string;
    tipo_id: number;
    stock: number;
    descuento: number;
}

interface Producto {
    sku: string;
    nombre: string;
    descripcion: string;
    precio: number;
    stock_sucursal: number;
    descuento_sucursal: number;
    bodegas: Bodega[] | null;
    total_stock_bodegas: number;
}

export function ProductoModal({ 
    isOpen, 
    onClose,
}: ProductoModalProps) {

    const { state }   = useCotizacionFlow()
    const { sucursalId } = state
    const [productos, setProductos] = useState<Producto[]>([]);
    const [origenSeleccionado, setOrigenSeleccionado] = useState<Record<string, string>>({});


    /* ── fetch ───────────────────────────────────────── */
    async function fetchInv () {
        if (!sucursalId) return
        try {
            const respuesta = await obtenerProductosInventario(sucursalId, 1, 100)
            setProductos((respuesta.productos))
        }
        catch (error) {
            console.error('Error al obtener el inventario:', error)
        }}
        useEffect(() => { fetchInv() }, [sucursalId])

    // Función para cerrar el modal y limpiar estado
    const handleClose = () => {
        onClose()
    }

    function obtenerDatosPorOrigen(producto: Producto, origen: string) {
        if (origen === 'Sucursal') {
            return {
                stock: producto.stock_sucursal,
                descuento: producto.descuento_sucursal,
            };
        }

        const bodega = producto.bodegas?.find((b) => b.nombre === origen);
        return {
            stock: bodega?.stock ?? 0,
            descuento: bodega?.descuento ?? 0,
        };
    }

    return (
        <Modal isOpen={isOpen} onClose={handleClose}>
            <ModalHeader title="Productos" onClose={handleClose} />

            <ModalBody>
                <table className="table table-striped min-w-[1200px] w-full text-sm rounded-[10px] border-b-[2px] border-gray-200 shadow-[0_0_2px_rgba(0,0,0,0.25)]">
                    <thead>
                    <tr className="text-left font-semibold text-gray-700 border-b border-gray-200 bg-gray-100">
                        <th className="text-center text-[18px] font-montserrat border-b-[1px] border-gray-200 p-[10px] font-semibold">SKU</th>
                        <th className="text-left text-[18px] font-montserrat border-b-[1px] border-gray-200 p-[10px] font-semibold">Nombre</th>
                        <th className="text-left text-[18px] font-montserrat border-b-[1px] border-gray-200 p-[10px] font-semibold">Descripción</th>
                        <th className="text-left text-[18px] font-montserrat border-b-[1px] border-gray-200 p-[10px] font-semibold">Origen</th>
                        <th className="text-left text-[18px] font-montserrat border-b-[1px] border-gray-200 p-[10px] font-semibold">Stock</th>
                        <th className="text-left text-[18px] font-montserrat border-b-[1px] border-gray-200 p-[10px] font-semibold">Coste</th>
                        <th className="text-left text-[18px] font-montserrat border-b-[1px] border-gray-200 p-[10px] font-semibold">Descuento</th>
                        <th className="text-left text-[18px] font-montserrat border-b-[1px] border-gray-200 p-[10px] font-semibold">Cantidad</th>
                        <th className="text-left text-[18px] font-montserrat border-b-[1px] border-gray-200 p-[10px] font-semibold">Total</th>
                        <th className="text-left text-[18px] font-montserrat border-b-[1px] border-gray-200 p-[10px] font-semibold">Agregar</th>

                    </tr>
                    </thead>
                    <tbody>
                    {productos.map((producto) => {
                        const origen = origenSeleccionado[producto.sku] ?? 'Sucursal';
                        const {stock, descuento} = obtenerDatosPorOrigen(producto, origen);
                        const total = producto.precio * (1 - descuento / 100);

                        return (
                            <tr key={producto.sku}>
                                <td className="text-center">{producto.sku}</td>
                                <td className="text-xs ...">{producto.nombre}</td>
                                <td className=" text-xs ...">{producto.descripcion}</td>

                                <td className="text-left py-[4px] ...">
                                    <select
                                        className="border-none rounded p-[5px]"
                                        value={origen}
                                        onChange={(e) =>
                                            setOrigenSeleccionado((prev) => ({
                                                ...prev,
                                                [producto.sku]: e.target.value,
                                            }))
                                        }
                                    >
                                        <option value="Sucursal">Sucursal</option>
                                        {producto.bodegas?.map((bodega, idx) => (
                                            <option key={idx} value={bodega.nombre}>
                                                {bodega.nombre}
                                            </option>
                                        ))}
                                    </select>
                                </td>

                                <td className="text-center ...">{stock}</td>
                                <td className="text-center ...">${producto.precio.toLocaleString()}</td>
                                <td className="text-center ...">{descuento}%</td>
                                <td className="text-center ...">

                                </td>
                                <td className="text-left ...">
                                    ${total.toLocaleString()}
                                </td>

                                <td className="text-left flex justify-center items-center py-[5px]">
                                    <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded">
                                        +
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>

                </table>
            </ModalBody>

            <ModalFooter>

            <Button onClick={handleClose}
                        className={"px-6 py-3 border-2 border-gray-400  bg-transparent rounded-lg hover:bg-gray-100 transition-colors font-semibold cursor-pointer"}
                        label="Cancelar"
                />

                <Button onClick={() => {
                    console.log(productos)
                }}
                        className={"px-6 py-3 text-white bg-[#1b5be7] hover:bg-[#1e4fbb] rounded-lg transition-colors font-semibold cursor-pointer"}
                        label="Guardar"
                />

            </ModalFooter>
        </Modal>
    );
}