'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaSearch } from 'react-icons/fa';

import { CLIENTES_DEMO, ClienteDemo } from '@/mock/mockClients';
import ModalNuevoCliente, { ClienteForm } from '@/components/ModalNuevoCliente';
import { useCustomer } from '@/context/ClienteContext';
import { useCart } from '@/context/CartContext';

export default function VendedorPage() {
    /* ------------------------------------------------------------- */
    /*  CONTEXTOS y ESTADOS                                          */
    /* ------------------------------------------------------------- */
    const router = useRouter();
    const { cliente, setCliente, clearCliente } = useCustomer();
    const { clearCart } = useCart();

    const [query, setQuery] = useState('');
    const [openModal, setOpenModal] = useState(false);

    // Limpiar contextos al entrar al Home
    useEffect(() => {
        clearCliente();
        clearCart();
    }, []);

    /* ------------------------------------------------------------- */
    /*  BÚSQUEDA DE CLIENTES                                         */
    /* ------------------------------------------------------------- */
    function buscarClientes(q: string): ClienteDemo[] {
        const s = q.trim().toLowerCase();
        if (s.length < 2) return [];

        const normRut = (rut: string) => rut.replace(/[^0-9kK]/g, '').toLowerCase();
        const sRut = normRut(s);

        return CLIENTES_DEMO.filter((c) => {
            const byNombre = c.nombre.toLowerCase().includes(s);
            const byRut = sRut.length > 0 && normRut(c.rut).includes(sRut);
            return byNombre || byRut;
        });
    }

    const resultados = buscarClientes(query);

    return (
        <section className="p-8 lg:p-12 mx-auto max-w-5xl">
            <h1 className="text-3xl lg:text-4xl font-bold mb-8">
                Bienvenido, Vendedor
            </h1>

            <div className="bg-white shadow-md rounded-xl p-6 lg:p-8 space-y-8">
                {/* ---------------------- 1. Buscar / seleccionar ---------------------- */}
                <h2 className="text-xl font-semibold">Seleccionar cliente</h2>

                <div className="relative w-full">
                    <FaSearch
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                        size={18}
                    />
                    <input
                        type="text"
                        placeholder="Buscar cliente por nombre o RUT"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="w-full pl-10 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                    />

                    {query && (
                        <ul className="absolute left-0 top-full z-10 w-full rounded-b-lg border border-t-0 bg-white shadow-md max-h-60 overflow-y-auto">
                            {resultados.length ? (
                                resultados.map((c) => (
                                    <li
                                        key={c.id}
                                        className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                                        onClick={() => {
                                            setCliente(c);
                                            setQuery('');
                                        }}
                                    >
                                        <span className="font-medium">{c.nombre}</span>{' '}
                                        <span className="text-sm text-gray-500">({c.rut})</span>
                                    </li>
                                ))
                            ) : (
                                <li className="px-4 py-2 text-sm text-gray-500">
                                    Sin coincidencias…
                                </li>
                            )}
                        </ul>
                    )}
                </div>
                {/* ---------------------- 2. Ficha del cliente ---------------------- */}
                {cliente && (
                    <div className="border border-gray-200 rounded-lg p-6 space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold">Ficha del cliente</h3>
                            <button
                                onClick={clearCliente}
                                className="cursor-pointer text-sm text-white hover:underline bg-orange-500 hover:bg-orange-600 px-3 py-1 rounded-md font-semibold"
                            >
                                Cerrar ficha
                            </button>
                        </div>

                        <dl className="grid grid-cols-2 gap-y-1 text-sm">
                            <dt className="font-medium text-gray-600">Nombre</dt>
                            <dd className="text-black">{cliente.nombre}</dd>

                            <dt className="font-medium text-gray-600">RUT</dt>
                            <dd className="text-black">{cliente.rut}</dd>

                            {cliente.email && (
                                <>
                                    <dt className="font-medium text-gray-600">Email</dt>
                                    <dd className="text-black">{cliente.email}</dd>
                                </>
                            )}

                            {cliente.telefono && (
                                <>
                                    <dt className="font-medium text-gray-600">Teléfono</dt>
                                    <dd className="text-black">{cliente.telefono}</dd>
                                </>
                            )}
                        </dl>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                            <button
                                onClick={() => router.push('/vendedor/productos')}
                                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-md font-semibold cursor-pointer"
                            >
                                Nueva Cotización
                            </button>
                            <button
                                onClick={() =>
                                    router.push(`/vendedor/clientes/${cliente.id}/historial`)
                                }
                                className="w-full border border-gray-400 text-gray-700 py-2 rounded-md font-semibold hover:bg-gray-50 cursor-pointer"
                            >
                                Ver Historial
                            </button>
                        </div>
                    </div>
                )}
                {/* ---------------------- 3. Bloques Nuevo / Invitado ------------------ */}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Nuevo cliente */}
                        <div className="border border-gray-200 rounded-lg p-6 flex flex-col">
                            <h3 className="text-lg font-semibold mb-4">Nuevo cliente</h3>
                            <p className="text-sm text-gray-600 mb-6">
                                Registra los datos de un cliente para conservar su historial de
                                compras.
                            </p>
                            <button
                                onClick={() => setOpenModal(true)}
                                className="mt-auto bg-[#A0A0A0] hover:bg-[#ABABAB] cursor-pointer text-white py-2 rounded-md font-semibold"
                            >
                                Abrir formulario
                            </button>
                        </div>

                        {/* Cliente invitado */}
                        <div className="border border-gray-200 rounded-lg p-6 flex flex-col">
                            <h3 className="text-lg font-semibold mb-4">Cliente invitado</h3>
                            <p className="text-sm text-gray-600 mb-6">
                                Continúa sin registrar datos y genera una cotización rápida.
                            </p>
                            <Link
                                href="/vendedor/productos?invitado=1"
                                className="mt-auto bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 rounded-md text-center font-semibold"
                            >
                                Continuar rápido
                            </Link>
                        </div>
                    </div>

            </div>

            {/* ---------------------- Modal Nuevo Cliente ------------------------- */}
            <ModalNuevoCliente
                isOpen={openModal}
                onClose={() => setOpenModal(false)}
                onSave={(form: ClienteForm) => {
                    const nuevo = { ...form, id: crypto.randomUUID() };
                    setCliente(nuevo);
                    setOpenModal(false);
                }}
            />
        </section>
    );
}