'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import logo from '@/styles/images/contrutem.png';
import productoImg from '@/styles/images/producto.png';
import { FaCheck, FaClock, FaTimes } from 'react-icons/fa';

/* ---------- Fallback para campos que la API NO trae todavía ---------- */
const fallback = {
    entrega: {
        tipo: 'Despacho',
        direccion: 'Calle Falsa 123',
        region: 'Metropolitana',
        comuna: 'Santiago',
        costo: 2990
    },
    historial: [
        { estado: 'Creada',    fecha: '—', usuario: '—' },
        { estado: 'Pendiente', fecha: '—', usuario: '—' }
    ]
};

/* ---------- Badge estado ---------- */
const EstadoBadge = ({ estado }: { estado: string }) => {
    const v = {
        Aprobada : { cls: 'bg-green-100 text-green-700', ico: <FaCheck/> },
        Pendiente: { cls: 'bg-yellow-100 text-yellow-700', ico: <FaClock/> },
        Rechazada: { cls: 'bg-red-100 text-red-700',   ico: <FaTimes/> }
    }[estado] ?? { cls: 'bg-gray-100 text-gray-700', ico: <FaClock/> };

    return (
        <span className={`inline-flex items-center gap-1 px-4 py-2 rounded-md text-sm font-semibold ${v.cls}`}>
      {v.ico}{estado}
    </span>
    );
};

export default function CotizacionDetalle () {
    const { id } = useParams<{ id: string }>();
    const [coti, setCoti] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    /* -------- fetch -------- */
    useEffect(() => {
        fetch(`http://localhost:8080/api/cotizaciones/${id}`)
            .then(r => r.ok ? r.json() : Promise.reject())
            .then(api => setCoti({ ...fallback, ...api }))   // merge
            .catch(() => setCoti(null))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <div className="ml-[180px] mt-[70px] p-8">Cargando…</div>;
    if (!coti)    return <div className="ml-[180px] mt-[70px] p-8 text-red-500">No se encontró la cotización.</div>;

    /* -------- cálculos -------- */
    const subtotal   = coti.detalle_cotizacion.reduce((s: number,d: any)=>s+d.cantidad*d.precio_unitario,0);
    const descuento  = 0;                                  // estático por ahora
    const impuestos  = Math.round((subtotal - descuento) * 0.19);
    const totalFront = coti.total ?? subtotal - descuento + impuestos + coti.entrega.costo;

    /* -------- UI -------- */
    return (
        <div className="ml-[180px] mt-[70px] p-8 bg-gray-50 min-h-screen">
            <div className="bg-white rounded-xl shadow-sm p-8 space-y-6">
                {/* 1) Encabezado */}
                <div className="flex justify-between items-center">
                    <Image src={logo} alt="Logo" width={140} className="h-auto"/>
                    <div className="text-right">
                        <h1 className="text-3xl font-bold">Cotización {coti.id}</h1>
                        <p className="text-sm text-gray-500">
                            Fecha: {new Date(coti.fecha).toLocaleDateString('es-CL')}
                        </p>
                        <EstadoBadge estado={coti.estado}/>
                    </div>
                </div>

                {/* 2) Cliente + Entrega */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="border border-gray-200 rounded-lg p-4 space-y-1">
                        <h2 className="font-semibold mb-2">Información del cliente</h2>
                        <p><span className="font-medium">Nombre:</span> {coti.cliente?.nombre ?? '—'}</p>
                        <p><span className="font-medium">RUT:</span> {coti.cliente?.rut ?? '12.345.678-5'}</p>
                        <p><span className="font-medium">Correo:</span> {coti.cliente?.email ?? '—'}</p>
                        <p><span className="font-medium">Teléfono:</span> {coti.cliente?.telefono ?? '—'}</p>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-4 space-y-1">
                        <h2 className="font-semibold mb-2">Datos de entrega</h2>
                        <p><span className="font-medium">Tipo:</span> {coti.entrega.tipo}</p>
                        {coti.entrega.direccion && <p><span className="font-medium">Dirección:</span> {coti.entrega.direccion}</p>}
                        {coti.entrega.region && <p><span className="font-medium">Región/Comuna:</span> {coti.entrega.region}, {coti.entrega.comuna}</p>}
                        {coti.entrega.costo>0 && <p><span className="font-medium">Costo despacho:</span> ${coti.entrega.costo.toLocaleString('es-CL')}</p>}
                    </div>
                </div>

                {/* 3) Tabla productos */}
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead className="bg-gray-100 font-semibold text-gray-900">
                        <tr>
                            <th className="px-4 py-2 text-left">Producto</th>
                            <th className="px-4 py-2 text-right">Cantidad</th>
                            <th className="px-4 py-2 text-right">Precio</th>
                            <th className="px-4 py-2 text-right">Subtotal</th>
                        </tr>
                        </thead>
                        <tbody>
                        {coti.detalle_cotizacion.map((d: any, i: number) => (
                            <tr key={i} className="border-b">
                                <td className="px-4 py-2 flex items-center gap-3">
                                    <Image src={productoImg} alt="" width={40} height={40}/>
                                    <span>{d.producto?.nombre ?? 'Producto'}</span>
                                </td>
                                <td className="px-4 py-2 text-right">{d.cantidad}</td>
                                <td className="px-4 py-2 text-right">
                                    ${d.precio_unitario.toLocaleString('es-CL')}
                                </td>
                                <td className="px-4 py-2 text-right">
                                    ${(d.cantidad*d.precio_unitario).toLocaleString('es-CL')}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                {/* 4) Resumen totales */}
                <div className="flex justify-end">
                    <div className="w-full max-w-xs border border-gray-200 rounded-lg p-4 space-y-1">
                        <div className="flex justify-between text-sm">
                            <span>Sub-total</span>
                            <span>${subtotal.toLocaleString('es-CL')}</span>
                        </div>
                        <div className="flex justify-between text-sm text-red-600 font-semibold">
                            <span>Descuentos</span>
                            <span>- ${descuento.toLocaleString('es-CL')}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span>Impuestos 19 %</span>
                            <span>${impuestos.toLocaleString('es-CL')}</span>
                        </div>
                        <hr className="my-2"/>
                        <div className="flex justify-between font-bold">
                            <span>Total</span>
                            <span>${totalFront.toLocaleString('es-CL')}</span>
                        </div>
                    </div>
                </div>

                {/* 5) Historial (mientras el backend no lo entregue) */}
                <div className="border border-gray-200 rounded-lg p-4 space-y-2">
                    <h2 className="font-semibold mb-2">Historial</h2>
                    <ol className="relative border-l border-gray-200 ml-2">
                        {coti.historial.map((h: any, i: number) => (
                            <li key={i} className="mb-4 ml-4">
                                <div className="absolute w-3 h-3 bg-gray-200 rounded-full -left-1.5 border border-white"/>
                                <p className="text-sm font-medium">{h.estado}</p>
                                <p className="text-xs text-gray-500">{h.fecha} - {h.usuario}</p>
                            </li>
                        ))}
                    </ol>
                </div>

                {/* 6) Botones */}
                <div className="flex gap-4 justify-end print:hidden">
                    {coti.estado === 'Pendiente' && (
                        <button className="bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 px-4 py-2 rounded-md">
                            Cancelar
                        </button>
                    )}
                    <button onClick={()=>window.print()} className="border border-gray-300 px-4 py-2 rounded-md">
                        Descargar PDF
                    </button>
                </div>
            </div>
        </div>
    );
}
