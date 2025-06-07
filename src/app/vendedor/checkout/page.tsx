'use client';

import { useCart } from '@/context/CartContext';
import Image from 'next/image';
import Link from 'next/link';
import producto from '@/styles/images/producto.png';

export default function CheckoutPage() {
    const { cart } = useCart();

    const subtotal = cart.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
    const despacho = 2990;
    const descuento = 3990;
    const impuestos = Math.round(subtotal * 0.19);
    const total = subtotal + despacho - descuento + impuestos;

    return (
        <div className="p-8 bg-[#f6f6f6] min-h-screen">
            <p className="text-gray-400 text-sm mb-1">Carrito &gt; Checkout</p>
            <h1 className="text-3xl font-bold text-black mb-6">Información del cliente</h1>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* FORMULARIO */}
                <div className="flex-1 bg-white p-6 rounded-xl shadow-sm">
                    {/* Cliente tipo */}
                    <div className="mb-4">
                        <label className="flex items-center gap-2 mb-2">
                            <input type="radio" name="tipoCliente" className="accent-orange-500" defaultChecked />
                            <span className="text-black font-medium">Cliente registrado</span>
                        </label>
                        <input
                            type="text"
                            placeholder="RUT Cliente"
                            disabled
                            className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-400"
                        />
                        <label className="flex items-center gap-2 mt-4">
                            <input type="radio" name="tipoCliente" className="accent-orange-500" />
                            <span className="text-black font-medium">Nuevo cliente</span>
                        </label>
                    </div>

                    <hr className="my-4" />
                    <h2 className="text-xl font-semibold mb-4 text-black">Dirección de envío</h2>

                    <form className="space-y-4">
                        <div>
                            <label className="block font-medium mb-1 text-black">Nombre *</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md text-black"
                            />
                        </div>
                        <div>
                            <label className="block font-medium mb-1 text-black">Correo *</label>
                            <input
                                type="email"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md text-black"
                            />
                        </div>
                        <div>
                            <label className="block font-medium mb-1 text-black">Teléfono *</label>
                            <input
                                type="tel"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md text-black"
                            />
                        </div>
                        <div>
                            <label className="block font-medium mb-1 text-black">Calle *</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md text-black"
                            />
                        </div>
                        <div>
                            <label className="block font-medium mb-1 text-black">Región / Provincia *</label>
                            <select className="w-full px-4 py-2 border border-gray-300 rounded-md text-black">
                                <option>Región Metropolitana</option>
                                <option>Valparaíso</option>
                                <option>Biobío</option>
                            </select>
                        </div>
                    </form>
                </div>

                {/* RESUMEN DE COMPRA */}
                <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="font-bold text-lg text-black">Resumen de compra</h2>
                        <Link href="carrito" className="text-orange-500 text-sm font-medium hover:underline">
                            Ir a editar &gt;
                        </Link>
                    </div>

                    <div className="space-y-3 mb-4">
                        {cart.map((item) => (
                            <div key={item.sku} className="flex items-center justify-between border rounded-md px-3 py-2">
                                <div className="flex items-center gap-3">
                                    <Image src={producto} alt={item.nombre} width={40} height={40} />
                                    <div>
                                        <p className="font-medium text-black">{item.nombre}</p>
                                        <p className="text-xs text-gray-500">Cantidad: {item.cantidad}</p>
                                    </div>
                                </div>
                                <span className="font-semibold text-black">${item.precio.toLocaleString()}</span>
                            </div>
                        ))}
                    </div>

                    {/* RESUMEN TOTAL */}
                    <div className="text-sm border-t pt-3 space-y-1">
                        <div className="flex justify-between">
                            <span className={'text-black'}>Costo de despacho:</span>
                            <span className={'text-black'}>${despacho.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-red-500 font-semibold">
                            <span>Descuentos:</span>
                            <span>-${descuento.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className={'text-black'}>Impuestos 19%</span>
                            <span className={'text-black'}>{impuestos.toLocaleString()}</span>
                        </div>
                    </div>

                    <div className="flex justify-between items-center mt-4 text-xl font-bold">
                        <span className={'text-black'}>Total</span>
                        <span className={'text-black'}>${total.toLocaleString()}</span>
                    </div>

                    <button className="mt-6 w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-md font-semibold cursor-pointer">
                        Ir a pagar
                    </button>
                </div>
            </div>
        </div>
    );
}
