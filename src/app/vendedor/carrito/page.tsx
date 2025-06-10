'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import producto from '@/styles/images/producto.png';

export default function CarritoPage() {
    const { cart, updateQuantity } = useCart();

    /* ────────────────  CÁLCULOS  ──────────────── */
    const subtotalBruto = cart.reduce(
        (sum, i) => sum + i.precio * i.cantidad,
        0
    );

    const totalDescuento = cart.reduce((sum, i) => {
        const pct = i.descuento ?? 0;
        return sum + (i.precio * i.cantidad * pct) / 100;
    }, 0);

    const baseImpuesto = subtotalBruto - totalDescuento;
    const impuestos = Math.round(baseImpuesto * 0.19);
    const totalFinal = baseImpuesto + impuestos;
    return (
        <div className="p-8 bg-[#f6f6f6] min-h-screen">
            <p className="text-gray-400 text-sm mb-1">Productos &gt; Carrito</p>
            <h1 className="text-3xl font-bold text-black mb-6">Revisar Carrito</h1>

            <div className="bg-white rounded-xl overflow-hidden shadow-sm flex flex-col lg:flex-row">
                {/* ───────── TABLA ───────── */}
                <div className="w-full lg:w-2/3 overflow-x-auto">
                    <table className="min-w-full text-sm text-left">
                        <thead className="bg-white text-black font-semibold">
                        <tr className="border-b border-[#EDEFEE]">
                            <th className="px-6 py-4">Producto</th>
                            <th className="px-6 py-4">Precio</th>
                            <th className="px-6 py-4">Cantidad</th>
                            <th className="px-6 py-4">Subtotal</th>
                        </tr>
                        </thead>

                        <tbody>
                        {cart.map((item) => {
                            const pct = item.descuento ?? 0;
                            const descuentoUnit = (item.precio * pct) / 100;
                            const precioNeto = item.precio - descuentoUnit;
                            const subtotalFila = precioNeto * item.cantidad;

                            return (
                                <tr key={item.sku} className="border-b border-[#EDEFEE]">
                                    {/* producto + sku */}
                                    <td className="px-6 py-4 flex items-center gap-4">
                                        <Image
                                            src={producto}
                                            alt={item.nombre}
                                            width={48}
                                            height={48}
                                        />
                                        <div>
                                            <p className="font-semibold text-black">
                                                {item.nombre}
                                            </p>
                                            <p className="text-xs text-gray-500">{item.sku}</p>
                                        </div>
                                    </td>

                                    {/* precio neto */}
                                    <td className="px-6 py-4 text-black">
                                        ${precioNeto.toLocaleString()}
                                        {pct > 0 && (
                                            <span className="block text-[11px] text-red-500">
                          -{pct}%
                        </span>
                                        )}
                                    </td>

                                    {/* cantidad */}
                                    <td className="px-6 py-4">
                                        <div className="flex items-center border rounded overflow-hidden w-fit">
                                            <button
                                                className="px-2 py-1 text-lg text-gray-700"
                                                onClick={() =>
                                                    updateQuantity(
                                                        item.sku,
                                                        Math.max(item.cantidad - 1, 1)
                                                    )
                                                }
                                            >
                                                −
                                            </button>
                                            <span className="px-4 text-black">{item.cantidad}</span>
                                            <button
                                                className="px-2 py-1 text-lg text-gray-700"
                                                onClick={() =>
                                                    updateQuantity(item.sku, item.cantidad + 1)
                                                }
                                            >
                                                +
                                            </button>
                                        </div>
                                    </td>

                                    {/* subtotal fila */}
                                    <td className="px-6 py-4 font-semibold text-black">
                                        ${subtotalFila.toLocaleString()}
                                    </td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </div>

                {/* ───────── RESUMEN ───────── */}
                <div className="w-full lg:w-1/3 bg-white p-6 border-l border-gray-200 flex flex-col justify-between">
                    <div>
                        <h3 className="font-bold text-lg mb-4 text-black">Resumen</h3>

                        <div className="flex justify-between text-sm mb-1">
                            <span className="text-black">Subtotal</span>
                            <span className="text-black">
                ${subtotalBruto.toLocaleString()}
              </span>
                        </div>

                        <div className="flex justify-between text-sm mb-1 text-red-600 font-semibold">
                            <span>Descuento</span>
                            <span>- ${totalDescuento.toLocaleString()}</span>
                        </div>

                        <div className="flex justify-between text-sm mb-4">
                            <span className="text-black">Impuestos 19 %</span>
                            <span className="text-black">${impuestos.toLocaleString()}</span>
                        </div>

                        <hr className="my-2" />

                        <div className="flex justify-between text-lg font-bold text-black">
                            <span>Total</span>
                            <span>${totalFinal.toLocaleString()}</span>
                        </div>
                    </div>

                    <div className="mt-6 flex flex-col gap-2">
                        <Link
                            href="/vendedor/productos"
                            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-md text-center font-semibold"
                        >
                            Seguir comprando
                        </Link>

                        <Link
                            href="/vendedor/checkout"
                            className="w-full bg-orange-500 hover:bg-orange-700 text-white py-2 rounded-md text-center font-semibold"
                        >
                            Confirmar Cotización
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}