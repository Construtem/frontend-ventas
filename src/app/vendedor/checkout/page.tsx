'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import productoImg from '@/styles/images/producto.png';

export default function CheckoutPage() {
    /* ------------------------------------------------------------------ */
    /*  CONTEXTOS Y ESTADOS                                               */
    /* ------------------------------------------------------------------ */
    const { cart, updateQuantity } = useCart();

    // Cliente (RUT) editable
    const [rut, setRut] = useState('11.111.111-1');
    const [editRut, setEditRut] = useState(false);
    const rutRef = useRef<HTMLInputElement>(null);

    // Envío o retiro
    const [entrega, setEntrega] = useState<'tienda' | 'domicilio'>('tienda');

    // Mostrar modal resumen
    const [showModal, setShowModal] = useState(false);

    // Auto-focus cuando se habilita la edición del RUT
    useEffect(() => {
        if (editRut && rutRef.current) {
            rutRef.current.focus();
            rutRef.current.select();
        }
    }, [editRut]);

    /* ------------------------------------------------------------------ */
    /*  CÁLCULOS DE MONTOS                                                */
    /* ------------------------------------------------------------------ */
    const subtotalBruto = cart.reduce(
        (s, i) => s + i.precio * i.cantidad,
        0
    );

    const totalDescuento = cart.reduce(
        (s, i) => s + (i.precio * i.cantidad * (i.descuento ?? 0)) / 100,
        0
    );

    const baseImpuesto = subtotalBruto - totalDescuento;
    const impuestos = Math.round(baseImpuesto * 0.19);
    const despacho = 2990;
    const totalFinal = baseImpuesto + impuestos + despacho;

    /* ------------------------------------------------------------------ */
    /*  RENDER                                                            */
    /* ------------------------------------------------------------------ */
    return (
        <>
            <div className="flex justify-center">
                <div className="w-[400px] bg-[#f6f6f6] min-h-screen p-8">
                    {/* Migas y título */}
                    <p className="text-gray-400 text-sm mb-1">Carrito &gt; Checkout</p>
                    <h1 className="text-3xl font-bold text-black mb-6">
                        Información del cliente
                    </h1>

                    {/* ---------------- FORMULARIO PRINCIPAL ---------------- */}
                    <div className="bg-white p-6 rounded-xl shadow-sm space-y-6">
                        {/* Cliente seleccionado */}
                        <div className="flex items-start gap-2">
                            <input
                                ref={rutRef}
                                disabled={!editRut}
                                value={rut}
                                onChange={(e) => setRut(e.target.value)}
                                className={`w-full px-4 py-2 border rounded-md font-semibold ${
                                    editRut
                                        ? 'border-orange-500 bg-white text-black'
                                        : 'border-gray-300 bg-gray-100 text-gray-700'
                                }`}
                            />

                            <button
                                className="text-[10px] px-2 py-[1px] border rounded text-gray-700 cursor-pointer"
                                onClick={() => {
                                    if (editRut) {
                                        /* validar / guardar RUT en backend si corresponde */
                                    }
                                    setEditRut(!editRut);
                                }}
                            >
                                {editRut ? 'GUARDAR' : 'EDITAR'}
                            </button>
                        </div>

                        {/* Tipo de entrega */}
                        <div className="space-y-1">
                            <label className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="entrega"
                                    checked={entrega === 'tienda'}
                                    onChange={() => setEntrega('tienda')}
                                    className="accent-orange-500"
                                />
                                <span className="text-black">Retiro en tienda</span>
                            </label>

                            <label className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="entrega"
                                    checked={entrega === 'domicilio'}
                                    onChange={() => setEntrega('domicilio')}
                                    className="accent-orange-500"
                                />
                                <span className="text-black">Envío a domicilio</span>
                            </label>
                        </div>

                        {/* Dirección solo si envío */}
                        {entrega === 'domicilio' && (
                            <fieldset className="space-y-4">
                                <legend className="text-lg font-semibold mb-2 text-black">
                                    Dirección de envío
                                </legend>

                                <label className="block text-sm font-medium text-black">
                                    Nombre *
                                    <input
                                        required
                                        className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md"
                                    />
                                </label>

                                <label className="block text-sm font-medium text-black">
                                    Correo *
                                    <input
                                        type="email"
                                        required
                                        className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md"
                                    />
                                </label>

                                <label className="block text-sm font-medium text-black">
                                    Teléfono *
                                    <input
                                        type="tel"
                                        required
                                        className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md"
                                    />
                                </label>

                                <label className="block text-sm font-medium text-black">
                                    Calle *
                                    <input
                                        required
                                        className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md"
                                    />
                                </label>

                                <label className="block text-sm font-medium text-black">
                                    Región / Provincia *
                                    <select
                                        required
                                        className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md"
                                    >
                                        <option>Región Metropolitana</option>
                                        <option>Valparaíso</option>
                                        <option>Biobío</option>
                                    </select>
                                </label>
                            </fieldset>
                        )}

                        {/* Botón Continuar */}
                        <button
                            onClick={() => setShowModal(true)}
                            className="cursor-pointer w-full mt-6 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-md font-semibold"
                        >
                            Continuar
                        </button>
                    </div>
                </div>
            </div>

            {/* ---------------- MODAL RESUMEN ---------------- */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/40 cursor-pointer"
                        onClick={() => setShowModal(false)}
                    />

                    {/* Card */}
                    <div className="relative mx-4 w-full max-w-md bg-white rounded-xl shadow-xl p-6">
                        {/* Cerrar */}
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute right-4 top-4 text-2xl leading-none text-gray-400 hover:text-gray-600"
                        >
                            &times;
                        </button>

                        {/* Título */}
                        <h2 className="text-xl font-bold mb-2 text-black">
                            Resumen de compra
                        </h2>
                        <p className="text-sm mb-4 text-black">
                            Carro ({cart.length}{' '}
                            {cart.length === 1 ? 'producto' : 'productos'})
                        </p>

                        {/* Productos */}
                        <div className="space-y-3 mb-4 max-h-56 overflow-y-auto pr-1">
                            {cart.map((i) => (
                                <div
                                    key={i.sku}
                                    className="flex items-center justify-between border-[0.5px] border-solid border-[#DFDFDF] rounded-md px-3 py-2"
                                >
                                    <div className="flex items-center gap-3">
                                        <Image
                                            src={productoImg}
                                            alt={i.nombre}
                                            width={40}
                                            height={40}
                                        />
                                        <div>
                                            <p className="font-medium text-black truncate max-w-[130px]">
                                                {i.nombre}
                                            </p>
                                            <span className="text-xs text-gray-500">
                        Cantidad: {i.cantidad}
                      </span>
                                        </div>
                                    </div>
                                    <span className="font-semibold text-black">
                    ${(i.precio * i.cantidad).toLocaleString()}
                  </span>
                                </div>
                            ))}
                        </div>

                        {/* Resumen de montos */}
                        <div className="text-sm space-y-1 mb-4">
                            <div className="flex justify-between">
                                <span className="text-black">Costo de despacho:</span>
                                <span className="text-black">
                  ${despacho.toLocaleString()}
                </span>
                            </div>

                            <div className="flex justify-between text-red-600 font-semibold">
                                <span>Descuentos</span>
                                <span>- ${totalDescuento.toLocaleString()}</span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-black">Impuestos 19 %</span>
                                <span className="text-black">
                  ${impuestos.toLocaleString()}
                </span>
                            </div>
                        </div>

                        {/* Total */}
                        <div className="flex justify-between text-xl font-bold text-black mb-6">
                            <span>Total</span>
                            <span>${totalFinal.toLocaleString()}</span>
                        </div>

                        <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-md font-semibold cursor-pointer">
                            Ir a pagar
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}