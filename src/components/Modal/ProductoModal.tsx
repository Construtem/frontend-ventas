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
    const [selQty,    setSelQty]    = useState<Record<string, number | "">>({})
    const [noti, setNoti] = useState<{nombre: string, cantidad: number} | null>(null);
    const [search, setSearch] = useState("");

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

    /** Cambia cantidad manteniendo límites 
    function setQty(sku: string, nueva: number, max: number) {
        const qty = Math.min(Math.max(nueva, 0), max); // ahora el mínimo es 0
        setSelQty(q => ({ ...q, [sku]: qty }));
    }
    */

    /** Filtra los productos según el término de búsqueda */
    const productosFiltrados = rows.filter(rows => {
        const termino = search.trim().toLowerCase();
        if (!termino) return true;
        return (
            rows.nombre.toLowerCase().includes(termino) ||
            rows.sku.toLowerCase().includes(termino)
        );
    });    

    /** Añade el producto al contexto y descuenta stock en tabla */
    function handleAdd (p: ProductoInventario) {
        const origenNombre      = selOrigen[p.sku] ?? 'Sucursal'
        const { stock }         = dataOrigen(p, origenNombre)
        const qty               = selQty[p.sku] ?? ""
        if (Number(qty) > stock) return                               // safety

        /* 1. construimos DraftProducto con mapper -------------------- */
        const draft             = toDraft(p, origenNombre, Number(sucursalId))
        draft.cantidad          = Number(qty)
        draft.total             = draft.netoUnit * (Number(qty) || 0)

        dispatch({ type: 'ADD_PRODUCT', payload: draft })

        /* 2. descontamos stock en la tabla visual -------------------- */
        setRows(rs =>
            rs.map(r => {
                if (r.sku !== p.sku) return r
                if (origenNombre === 'Sucursal') {
                    return { ...r, stock_sucursal: r.stock_sucursal - Number(qty) }
                }
                return {
                    ...r,
                    bodegas: r.bodegas?.map(b =>
                        b.nombre === origenNombre ? { ...b, stock: b.stock - Number(qty) } : b,
                    ) ?? null,
                }
            }),
        )

        /* 3. reseteamos qty de ese SKU ------------------------------- */
        setSelQty(q => ({ ...q, [p.sku]: 0 }))

        /* 4. mostramos notificación de éxito ------------------------- */
        setNoti({ nombre: p.nombre, cantidad: Number(qty) });
        setTimeout(() => setNoti(null), 2000);
    }

    /* render -------------------------------------------------------- */
    return (
        <>
            {noti && (
            <div className="fixed top-4 right-4 z-100 bg-green-600 text-white px-4 py-2 rounded shadow-lg animate-fade-in">
                Producto añadido con éxito:<br />
                <span className="font-bold">{noti.nombre}</span> x <span className="font-bold">{noti.cantidad}</span>
            </div>
            )}

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalHeader title="Agregar productos" onClose={onClose} />

                <ModalBody>
                    {!sucursalId && (
                        <p className="text-gray-500 text-center">
                            Selecciona una sucursal para cargar inventario.
                        </p>
                    )}

                    {sucursalId && (
                        <>

                            {/* Search bar */}
                            <div className="mb-4 flex items-center relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5 text-gray-400"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1116.65
                                            6.65a7.5 7.5 0 010 10.6z"
                                        />
                                    </svg>
                                </span>
                                <input
                                    type="text"
                                    value={search}
                                    onChange={e => { 
                                        const value = e.target.value.replace(/[^a-zA-Z0-9\s]/g, '');
                                        setSearch(value)
                                    }}
                                    placeholder="Buscar por nombre o SKU"
                                    className="border rounded px-3 py-2 w-full text-sm pl-10"
                                />
                            </div>

                            <div className="overflow-x-auto">
                                <table className="min-w-[1100px] w-full text-sm rounded-lg border border-gray-200">
                                    <thead className="bg-gray-100 text-gray-700">
                                    <tr>
                                        <th className="px-2 py-2 text-center w-24">SKU</th>
                                        <th className="px-2 py-2 w-40">Nombre</th>
                                        <th className="px-2 py-2 w-32">Origen</th>
                                        <th className="px-2 py-2 text-center w-20">Stock</th>
                                        <th className="px-2 py-2 text-center w-24">Coste</th>
                                        <th className="px-2 py-2 text-center w-20">Desc.%</th>
                                        <th className="px-2 py-2 text-center w-20">Cant.</th>
                                        <th className="px-2 py-2 text-right w-28">Total</th>
                                        <th className="px-2 py-2 text-center w-16" />
                                    </tr>
                                    </thead>

                                    <tbody>
                                    {productosFiltrados.map(p => {
                                        const origen   = selOrigen[p.sku] ?? 'Sucursal'
                                        const { stock, descuento } = dataOrigen(p, origen)
                                        const qty      = selQty[p.sku] ?? ""
                                        const netoUnit = p.precio * (1 - descuento / 100)

                                        return (
                                            <tr key={p.sku} className="hover:bg-gray-50">
                                                <td className="px-2 py-1 text-center">{p.sku}</td>
                                                <td className="px-2 py-1">{p.nombre}</td>

                                                {/* Select de origen */}
                                                <td className="px-2 py-1">
                                                    <select
                                                        className={`border rounded px-1
                                                            ${(!p.bodegas || p.bodegas.length === 0) ? 'bg-gray-100 text-gray-400 cursor-default pointer-events-none' : ''}
                                                        `}
                                                        value={origen}
                                                        onChange={e =>
                                                            setSelOrigen(o => ({ ...o, [p.sku]: e.target.value }))
                                                        }
                                                        disabled={!p.bodegas || p.bodegas.length === 0}
                                                        tabIndex={(!p.bodegas || p.bodegas.length === 0) ? -1 : 0}
                                                    >
                                                        <option value="Sucursal">Sucursal #{sucursalId}</option>
                                                        {p.bodegas?.map(b => (
                                                            <option key={b.sucursal_id} value={b.nombre}>
                                                                {b.nombre}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </td>

                                                <td className={`px-2 py-1 text-center ${stock === 0 ? 'text-red-600 font-bold' : ''}`}>
                                                    {stock}
                                                </td>
                                                <td className="px-2 py-1 text-center">
                                                    ${p.precio.toLocaleString('es-CL')}
                                                </td>
                                                <td className="px-2 py-1 text-center">{descuento}%</td>

                                                {/* Cantidad con ± */}
                                                <td className="px-2 py-1">
                                                    <div className="flex items-center gap-1 justify-center">
                                                        <button
                                                            className="px-[6px] border rounded bg-gray-100 hover:bg-gray-200 text-gray-700
                                                                disabled:bg-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed"
                                                            onClick={() => {
                                                                if (!qty || Number(qty) <= 1) {
                                                                    setSelQty(q => ({ ...q, [p.sku]: "" })); // Deja vacío si es 0 o 1
                                                                } else {
                                                                    const newQty = Number(qty) - 1;
                                                                    setSelQty(q => ({ ...q, [p.sku]: newQty }));
                                                                }
                                                            }}
                                                            disabled={!qty || Number(qty) <= 0}
                                                        >
                                                            −
                                                        </button>
                                                        <input
                                                            type="number"
                                                            min={0}
                                                            max={stock}
                                                            value={qty}
                                                            className="w-12 border rounded text-center"
                                                            style={{
                                                                appearance: 'textfield',
                                                                MozAppearance: 'textfield'
                                                            }}
                                                            onChange={e => {
                                                                const val = e.target.value;
                                                                if (val === "") {
                                                                    setSelQty(q => ({ ...q, [p.sku]: "" }));
                                                                    return;
                                                                }
                                                                let value = Number(val);
                                                                if (isNaN(value) || value < 0) value = 0;
                                                                if (value > stock) value = stock;
                                                                setSelQty(q => ({ ...q, [p.sku]: value }));
                                                            }}
                                                            onWheel={e => e.currentTarget.blur()}
                                                            disabled={stock === 0}
                                                        />
                                                        <button
                                                            className="px-[6px] border rounded bg-gray-100 hover:bg-gray-200 text-gray-700
                                                                disabled:bg-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed"
                                                            onClick={() => {
                                                                const newQty = Math.min(stock, Number(qty) + 1)
                                                                setSelQty(q => ({ ...q, [p.sku]: newQty }))
                                                            }}
                                                            disabled={Number(qty) >= stock}
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                </td>

                                                <td className="px-2 py-1 text-right">
                                                    ${(netoUnit * (Number(qty) || 0)).toLocaleString('es-CL')}
                                                </td>

                                                {/* botón añadir */}
                                                <td className="px-2 py-1 text-center">
                                                    <button
                                                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded cursor-pointer disabled:bg-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
                                                        disabled={stock === 0 || !qty || Number(qty) === 0}
                                                        onClick={() => handleAdd(p)}
                                                        title="Agregar al carrito"
                                                    >
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            width="22"
                                                            height="22"
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth="2"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            className="icon icon-tabler icons-tabler-outline icon-tabler-shopping-cart-plus"
                                                        >
                                                            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                                            <path d="M4 19a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
                                                            <path d="M12.5 17h-6.5v-14h-2" />
                                                            <path d="M6 5l14 1l-.86 6.017m-2.64 .983h-10.5" />
                                                            <path d="M16 19h6" />
                                                            <path d="M19 16v6" />
                                                        </svg>
                                                    </button>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                    </tbody>
                                </table>
                            </div>
                        </>
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
        </>
    )
}
