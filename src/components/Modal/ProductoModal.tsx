'use client'
import { useEffect, useState }   from 'react'
import Modal                     from '@/components/Modal/Modal'
import { ModalHeader, ModalBody, ModalFooter } from '@/components/Modal/ModalsParts'
import Button                    from '@/components/Button'
import { useCotizacionFlow }     from '@/contexts/CotizacionFlow'

import {
    obtenerProductosInventario,
    ProductoInventario,
}                                from '@/services/apiServices'

import { toDraft }               from '@/utils/helpers/productMapper'

/* ────────────────────────────────────────────────────────────────── */
interface ProductoModalProps {
    isOpen : boolean
    onClose: () => void
}
/* ────────────────────────────────────────────────────────────────── */
export function ProductoModal ({ isOpen, onClose }: ProductoModalProps) {
    /* contexto global (flujo de cotización) -------------------------- */
    const { state, dispatch } = useCotizacionFlow()
    const sucursalId          = state.sucursalId          // tienda principal

    /* estado local (productos, selecciones) -------------------------- */
    const [rows,      setRows]      = useState<ProductoInventario[]>([])
    const [selOrigen, setSelOrigen] = useState<Record<string, string>>({})
    const [selQty,    setSelQty]    = useState<Record<string, number>>({})

    /* fetch inventario al cambiar de sucursal ------------------------ */
    useEffect(() => {
        if (!sucursalId) return
        obtenerProductosInventario(sucursalId, 1, 100)
            .then(r => {
                setRows(r.productos)
                /* reset de selecciones si cambia tienda */
                setSelOrigen({})
                setSelQty({})
            })
            .catch(e => console.error('[Inventario]', e))
    }, [sucursalId])

    /* helpers -------------------------------------------------------- */
    /** Devuelve stock / desc. de la sucursal (o bodega) elegida */
    function dataOrigen (p: ProductoInventario, origen: string) {
        if (origen === 'Sucursal') {
            return { stock: p.stock_sucursal, descuento: p.descuento_sucursal }
        }
        const b = p.bodegas?.find(b => b.nombre === origen)
        return { stock: b?.stock ?? 0, descuento: b?.descuento ?? 0 }
    }

    /** Cambia cantidad manteniendo límites */
    function setQty (sku: string, nueva: number, max: number) {
        const qty = Math.min(Math.max(nueva, 1), max)
        setSelQty(q => ({ ...q, [sku]: qty }))
    }

    /** Añade el producto al contexto y descuenta stock en tabla */
    function handleAdd (p: ProductoInventario) {
        const origenNombre      = selOrigen[p.sku] ?? 'Sucursal'
        const { stock }         = dataOrigen(p, origenNombre)
        const qty               = selQty[p.sku] ?? 1
        if (qty > stock) return                               // safety

        /* 1. construimos DraftProducto con mapper -------------------- */
        const draft             = toDraft(p, origenNombre, Number(sucursalId))
        draft.cantidad          = qty
        draft.total             = draft.netoUnit * qty

        dispatch({ type: 'ADD_PRODUCT', payload: draft })

        /* 2. descontamos stock en la tabla visual -------------------- */
        setRows(rs =>
            rs.map(r => {
                if (r.sku !== p.sku) return r
                if (origenNombre === 'Sucursal') {
                    return { ...r, stock_sucursal: r.stock_sucursal - qty }
                }
                return {
                    ...r,
                    bodegas: r.bodegas?.map(b =>
                        b.nombre === origenNombre ? { ...b, stock: b.stock - qty } : b,
                    ) ?? null,
                }
            }),
        )

        /* 3. reseteamos qty de ese SKU ------------------------------- */
        setSelQty(q => ({ ...q, [p.sku]: 1 }))
    }

    /* render -------------------------------------------------------- */
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalHeader title="Agregar productos" onClose={onClose} />

            <ModalBody>
                {!sucursalId && (
                    <p className="text-gray-500 text-center">
                        Selecciona una sucursal para cargar inventario.
                    </p>
                )}

                {sucursalId && (
                    <div className="overflow-x-auto">
                        <table className="min-w-[1100px] w-full text-sm rounded-lg border border-gray-200">
                            <thead className="bg-gray-100 text-gray-700">
                            <tr>
                                <th className="px-2 py-2 text-center">SKU</th>
                                <th className="px-2 py-2">Nombre</th>
                                <th className="px-2 py-2">Origen</th>
                                <th className="px-2 py-2 text-center">Stock</th>
                                <th className="px-2 py-2 text-center">Coste</th>
                                <th className="px-2 py-2 text-center">Desc.%</th>
                                <th className="px-2 py-2 text-center">Cant.</th>
                                <th className="px-2 py-2 text-right">Total</th>
                                <th className="px-2 py-2 text-center" />
                            </tr>
                            </thead>

                            <tbody>
                            {rows.map(p => {
                                const origen   = selOrigen[p.sku] ?? 'Sucursal'
                                const { stock, descuento } = dataOrigen(p, origen)
                                const qty      = selQty[p.sku] ?? 1
                                const netoUnit = p.precio * (1 - descuento / 100)

                                return (
                                    <tr key={p.sku} className="hover:bg-gray-50">
                                        <td className="px-2 py-1 text-center">{p.sku}</td>
                                        <td className="px-2 py-1">{p.nombre}</td>

                                        {/* Select de origen */}
                                        <td className="px-2 py-1">
                                            <select
                                                className="border rounded px-1"
                                                value={origen}
                                                onChange={e =>
                                                    setSelOrigen(o => ({ ...o, [p.sku]: e.target.value }))
                                                }
                                            >
                                                <option value="Sucursal">Sucursal #{sucursalId}</option>
                                                {p.bodegas?.map(b => (
                                                    <option key={b.sucursal_id} value={b.nombre}>
                                                        {b.nombre}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>

                                        <td className="px-2 py-1 text-center">{stock}</td>
                                        <td className="px-2 py-1 text-center">
                                            ${p.precio.toLocaleString('es-CL')}
                                        </td>
                                        <td className="px-2 py-1 text-center">{descuento}%</td>

                                        {/* Cantidad con ± */}
                                        <td className="px-2 py-1">
                                            <div className="flex items-center gap-1 justify-center">
                                                <button
                                                    className="px-[6px] border rounded"
                                                    onClick={() => setQty(p.sku, qty - 1, stock)}
                                                >
                                                    −
                                                </button>
                                                <input
                                                    type="number"
                                                    min={1}
                                                    max={stock}
                                                    value={qty}
                                                    className="w-12 border rounded text-center"
                                                    onChange={e =>
                                                        setQty(p.sku, Number(e.target.value), stock)
                                                    }
                                                />
                                                <button
                                                    className="px-[6px] border rounded"
                                                    onClick={() => setQty(p.sku, qty + 1, stock)}
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </td>

                                        <td className="px-2 py-1 text-right">
                                            ${(netoUnit * qty).toLocaleString('es-CL')}
                                        </td>

                                        {/* botón añadir */}
                                        <td className="px-2 py-1 text-center">
                                            <button
                                                className="bg-green-600 hover:bg-green-700 text-white px-3 py-[2px] rounded cursor-pointer"
                                                disabled={stock === 0}
                                                onClick={() => handleAdd(p)}
                                            >
                                                +
                                            </button>
                                        </td>
                                    </tr>
                                )
                            })}
                            </tbody>
                        </table>
                    </div>
                )}
            </ModalBody>

            <ModalFooter>
                <Button
                    label="Cerrar"
                    className="bg-gray-200"
                    onClick={onClose}
                />
            </ModalFooter>
        </Modal>
    )
}
