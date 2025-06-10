'use client';
import { useCart } from '@/context/CartContext';

    import { useState, useRef, useEffect } from 'react';

    /* …otros imports… */

    export default function CheckoutPage() {
        const { cart } = useCart();

        /* RUT del cliente */
        const [rut, setRut] = useState('11.111.111-1');
        const [editRut, setEditRut] = useState(false);
        const rutRef = useRef<HTMLInputElement>(null);

        /* foco automático cuando se habilita edición */
        useEffect(() => {
            if (editRut && rutRef.current) {
                rutRef.current.focus();
                rutRef.current.select();
            }
        }, [editRut]);

    /* ---------------- estado: modo de entrega ---------------- */
    const [entrega, setEntrega] = useState<'tienda' | 'domicilio'>('tienda');

    /* … totales carrito (subtotal, despacho, etc.) … */

    return (
        <div className="flex justify-center">
        <div className="w-[400px] bg-[#f6f6f6] min-h-screen">
            {/* migas y título */}
            <p className="text-gray-400 text-sm mb-1">Carrito &gt; Checkout</p>
            <h1 className="text-3xl font-bold text-black mb-6">Información del cliente</h1>

            <div className="flex flex-col xl:flex-row gap-8">
                {/* ----------------- FORMULARIO ----------------- */}
                <div className="flex-1 bg-white p-6 rounded-xl shadow-sm space-y-6">
                    {/* Cliente seleccionado */}<div className="flex items-start gap-2">
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
                                /* aquí podrías validar o guardar el RUT */
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

                    {/* Dirección (solo si envío) */}
                    {entrega === 'domicilio' && (
                        <fieldset className="space-y-4">
                            <legend className="text-lg font-semibold mb-2 text-black">
                                Dirección de envío
                            </legend>

                            <div>
                                <label className="block text-sm font-medium mb-1 text-black">
                                    Nombre *
                                </label>
                                <input
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1 text-black">
                                    Correo *
                                </label>
                                <input
                                    type="email"
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1 text-black">
                                    Teléfono *
                                </label>
                                <input
                                    type="tel"
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1 text-black">
                                    Calle *
                                </label>
                                <input
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1 text-black">
                                    Región / Provincia *
                                </label>
                                <select
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                                >
                                    <option>Región Metropolitana</option>
                                    <option>Valparaíso</option>
                                    <option>Biobío</option>
                                </select>
                            </div>
                        </fieldset>
                    )}

                    {/* botón continuar */}
                    <button className="cursor-pointer w-full mt-6 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-md font-semibold">
                        Continuar
                    </button>
                </div>

                {/* ----------------- RESUMEN COMPRA (tu código) ----------------- */}
                {/* … tu bloque resumen a la derecha … */}
            </div>
        </div>
        </div>
    );
}