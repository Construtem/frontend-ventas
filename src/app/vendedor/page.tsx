'use client';
import Link from "next/link";
import { FaSearch } from "react-icons/fa";
import { CLIENTES_DEMO, ClienteDemo } from '@/mock/mockClients';
import {useState} from "react";
import { useRouter } from 'next/navigation';
import { useCustomer } from '@/context/ClienteContext';     // ← 1
import ModalNuevoCliente, {
    ClienteForm,
} from '@/components/ModalNuevoCliente';

export default function VendedorPage() {
    const router = useRouter();
    const { setCliente } = useCustomer();
 function buscarClientes(query: string): ClienteDemo[] {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];          // mínimo 2 caracteres para evitar ruido

    // normaliza RUT quitando puntos y guion
    const normalizaRut = (rut: string) =>
        rut.replace(/[^0-9kK]/g, '').toLowerCase();

    const qRut = normalizaRut(q);         // → '' si no hay dígitos/RUT

    return CLIENTES_DEMO.filter((c) => {
        const matchNombre = c.nombre.toLowerCase().includes(q);

        // Solo se evalúa si el query realmente tiene parte numérica
        const matchRut =
            qRut.length > 0 &&
            normalizaRut(c.rut).includes(qRut);

        return matchNombre || matchRut;
    });}

    // ⚠️ Reemplaza con datos reales de sesión (next‑auth o tu own hook)
    const vendedor = { nombre: "Vendedor" };
    const [query, setQuery] = useState('');
    const [openModal, setOpenModal] = useState(false);
    const resultados = buscarClientes(query);

    return (
        <section className="p-8 lg:p-12">
            {/* Título / saludo */}
            <h1 className="text-3xl lg:text-4xl font-bold mb-8">
                Bienvenido, {vendedor.nombre}
            </h1>

            {/* Card principal */}
            <div className="bg-white shadow-md rounded-xl p-6 lg:p-8 space-y-8">
                <h2 className="text-xl font-semibold">Seleccionar cliente</h2>

                {/* Buscador de cliente existente (implementa autocomplete aparte) */}
                {/* ▸ CONTENEDOR RELATIVO */}
                <div className="relative w-full">
                    {/* icono */}
                    <FaSearch
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                        size={18}
                    />

                    {/* INPUT */}
                    <input
                        type="text"
                        placeholder="Buscar cliente por nombre o RUT"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="w-full pl-10 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                    />

                    {/* DROPDOWN */}
                    {query && (
                        <ul
                            className="absolute left-0 top-full z-10 w-full rounded-b-lg border border-t-0 bg-white shadow-md overflow-y-auto max-h-60"
                        >
                            {resultados.length ? (
                                resultados.map((c) => (
                                    <li
                                        key={c.id}
                                        className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                                        onClick={() => {
                                            /* setClienteSeleccionado(c) */
                                            setQuery('');
                                        }}
                                    >
                                        <span className="font-medium">{c.nombre}</span>{' '}
                                        <span className="text-sm text-gray-500">({c.rut})</span>
                                    </li>
                                ))
                            ) : (
                                <li className="px-4 py-2 text-sm text-gray-500">Sin coincidencias…</li>
                            )}
                        </ul>
                    )}
                </div>

                {/* Bloques opciones */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Nuevo cliente */}
                    <div className="border border-gray-200 rounded-lg p-6 flex flex-col">
                        <h3 className="text-lg font-semibold mb-4">Nuevo cliente</h3>
                        <p className="text-sm text-gray-600 mb-6">
                            Registra los datos de un cliente para conservar su historial de compras.
                        </p>
                        <button
                            onClick={() => setOpenModal(true)}
                            className="cursoir-pointer mt-auto inline-block text-center bg-[#FF7300] hover:bg-[#FF7500] text-white font-medium py-2 px-4 rounded-md shadow"
                        >
                            Abrir formulario
                        </button>
                    </div>
                    <ModalNuevoCliente
                        isOpen={openModal}
                        onClose={() => setOpenModal(false)}
                        onSave={(cliente) => {
                            console.log('Nuevo cliente guardado:', cliente);
                            setOpenModal(false);
                        }}
                    />

                    {/* Cliente invitado */}
                    <div className="border border-gray-200 rounded-lg p-6 flex flex-col">
                        <h3 className="text-lg font-semibold mb-4">Cliente invitado</h3>
                        <p className="text-sm text-gray-600 mb-6">
                            Continúa sin registrar datos y genera una cotización rápida.
                        </p>
                        <Link
                            href="/cotizaciones/nueva?invitado=1"
                            className="mt-auto inline-block text-center bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-md shadow-inner"
                        >
                            Continuar rápido
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
