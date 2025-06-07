'use client';

import { useCart } from '@/context/CartContext';
import Image from 'next/image';
import producto from '@/styles/images/producto.png';
import Link from 'next/link';

export default function CarritoPage() {
    const { cart, updateQuantity } = useCart();

    // Cálculos adicionales
    const subtotal = cart.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
    const descuento = 30000;
    const impuestos = Math.round(subtotal * 0.19);
    const totalFinal = subtotal - descuento + impuestos;

    return (
        <div className="p-8 bg-[#f6f6f6] min-h-screen">
            <p className="text-gray-400 text-sm mb-1">Productos &gt; Carrito</p>
            <h1 className="text-3xl font-bold text-black mb-6">Revisar Carrito</h1>

            <div className="bg-white rounded-xl overflow-hidden shadow-sm flex flex-col lg:flex-row">
                {/* TABLA */}
                <div className="w-full lg:w-2/3 overflow-x-auto">
                    <table className="min-w-full text-sm text-left ">
                        <thead className="bg-white text-black font-semibold">
                        <tr className="border-b border-b border-b-[1px] border-b-[#EDEFEE]">
                            <th className="px-6 py-4">Producto</th>
                            <th className="px-6 py-4">Precio</th>
                            <th className="px-6 py-4">Cantidad</th>
                            <th className="px-6 py-4">Subtotal</th>
                        </tr>
                        </thead>
                        <tbody>
                        {cart.map((item) => (
                            <tr key={item.sku} className="border-b border-b-[1px] border-b-[#EDEFEE] ">
                                <td className="px-6 py-4 flex items-center gap-4">
                                    <Image src={producto} alt={item.nombre} width={48} height={48} />
                                    <div>
                                        <p className="font-semibold text-black">{item.nombre}</p>
                                        <p className="text-xs text-gray-500">{item.sku}</p>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-black border-b border-b-[1px] border-b-[#EDEFEE]">${item.precio.toLocaleString()}</td>
                                <td className="px-6 py-4 border-b border-b-[1px] border-b-[#EDEFEE]">
                                    <div className="flex items-center border rounded overflow-hidden w-fit">
                                        <button
                                            className="px-2 py-1 text-lg text-gray-700 cursor-pointer"
                                            onClick={() => updateQuantity(item.sku, Math.max(item.cantidad - 1, 1))}
                                        >
                                            −
                                        </button>
                                        <span className="px-4 text-black">{item.cantidad}</span>
                                        <button
                                            className="px-2 py-1 text-lg text-gray-700 cursor-pointer"
                                            onClick={() => updateQuantity(item.sku, item.cantidad + 1)}
                                        >
                                            +
                                        </button>
                                    </div>
                                </td>
                                <td className="px-6 py-4 font-semibold text-black border-b border-b-[1px] border-b-[#EDEFEE]">
                                    ${(item.precio * item.cantidad).toLocaleString()}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                {/* RESUMEN */}
                <div className="w-full lg:w-1/3 bg-white p-6 border-l border-gray-200 flex flex-col justify-between">
                    <div>
                        <h3 className="font-bold text-lg mb-4 text-black ">Subtotal</h3>
                        <div className="flex justify-between text-sm mb-1">
                            <span className={'text-black'}>Descuento</span>
                            <span className={'text-black'}>${descuento.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm mb-4 ">
                            <span className={'text-black'}>Impuestos 19%</span>
                            <span className={'text-black'}>${impuestos.toLocaleString()}</span>
                        </div>
                        <hr className="my-2"  />
                        <div className="flex justify-between text-lg font-bold text-black">
                            <span>Total</span>
                            <span>${totalFinal.toLocaleString()}</span>
                        </div>
                    </div>

                    <div className="mt-6 flex flex-col gap-2">
                        <Link
                            href="productos"
                            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-md text-center font-semibold"
                        >
                            Seguir comprando
                        </Link>
                        <Link href={'checkout'} className="w-full bg-orange-500 hover:bg-orange-700 text-white py-2 rounded-md text-center font-semibold">
                            Confirmar Cotización
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
