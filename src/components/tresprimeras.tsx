'use client'
import React from 'react';
import { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import { 
    clienteService, 
    cotizacionService, 
    type Cliente, 
    type CotizacionSimplificada, 
    type Cotizacion 
} from '@/services/apiService';

export default function Cliente() {

    const [clienteSeleccionado, setClienteSeleccionado] = useState<Cliente | null>(null);
    const [cotizacionSeleccionada, setCotizacionSeleccionada] = useState<CotizacionSimplificada | null>(null);
    const [mostrarBarra, setMostrarBarra] = useState(false);
    const [mostrarCotizaciones, setMostrarCotizaciones] = useState(false);
    const [busqueda, setBusqueda] = useState('');
    const [busquedaCotizacion, setBusquedaCotizacion] = useState('');
    const [esNuevaCotizacion, setEsNuevaCotizacion] = useState(false);
    const [cotizacionEditada, setCotizacionEditada] = useState<Partial<Cotizacion>>({});
    
    // Estados para los datos del backend
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [cotizaciones, setCotizaciones] = useState<CotizacionSimplificada[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const direccionPrincipal = clienteSeleccionado?.direcciones?.[0];
    const cotizacionesDelCliente = cotizaciones.filter(q => q.cliente?.rut === clienteSeleccionado?.rut);
    const direccionesDelCliente = clienteSeleccionado?.direcciones || [];

    // Cargar datos iniciales
    useEffect(() => {
        cargarClientes();
        cargarCotizaciones();
    }, []);

    const cargarClientes = async () => {
        try {
            setLoading(true);
            const clientesData = await clienteService.obtenerClientes();
            setClientes(clientesData);
        } catch (error) {
            console.error('Error al cargar clientes:', error);
            setError('Error al cargar clientes');
        } finally {
            setLoading(false);
        }
    };

    const cargarCotizaciones = async () => {
        try {
            const cotizacionesData = await cotizacionService.obtenerCotizacionesSimplificadas();
            setCotizaciones(cotizacionesData);
        } catch (error) {
            console.error('Error al cargar cotizaciones:', error);
            setError('Error al cargar cotizaciones');
        }
    };

    const guardarNuevaCotizacion = async () => {
        if (!clienteSeleccionado) {
            alert('Primero selecciona un cliente');
            return;
        }

        try {
            setLoading(true);
            const nuevaCotizacion: Omit<Cotizacion, 'id'> = {
                rut_cliente: clienteSeleccionado.rut,
                sec_externa: cotizacionEditada.sec_externa || '',
                nombre: cotizacionEditada.nombre || '',
                descripcion: cotizacionEditada.descripcion || '',
                tipo_despacho: cotizacionEditada.tipo_despacho || 'Retiro en tienda',
                direccion_despacho_id: cotizacionEditada.direccion_despacho_id ? Number(cotizacionEditada.direccion_despacho_id) : undefined,
                estado: 'Pendiente',
                comuna_despacho: cotizacionEditada.comuna_despacho || '',
                ciudad_despacho: cotizacionEditada.ciudad_despacho || '',
            };

            await cotizacionService.crearCotizacion(nuevaCotizacion);
            
            // Recargar cotizaciones
            await cargarCotizaciones();
            
            // Limpiar formulario
            setEsNuevaCotizacion(false);
            setCotizacionEditada({});
            
            alert('Cotización creada exitosamente');
        } catch (error) {
            console.error('Error al crear cotización:', error);
            alert('Error al crear cotización');
        } finally {
            setLoading(false);
        }
    };



    return (

        <div className="bg-white border border-gray-300 p-4 max-w-7xl mx-auto mb-4">

            {/*Tabla Usuario*/}

            {/* Indicadores de estado */}
            {loading && (
                <div className="mb-4 p-2 bg-blue-100 text-blue-800 rounded">
                    Cargando datos...
                </div>
            )}
            
            {error && (
                <div className="mb-4 p-2 bg-red-100 text-red-800 rounded">
                    {error}
                </div>
            )}

            {/*Titulos usuario y Cotización barra*/}

            <div className="flex gap-120">

                <div className="text-2xl flex items-center px-3 py-2 bg-gray-100 font-semibold">
                    Usuario
                </div>

                <div className="text-2xl flex items-center bg-gray-100 font-semibold">
                    Cotización
                    <button onClick={() => setMostrarCotizaciones(!mostrarCotizaciones)}
                            className="text-sm border border-gray-300 ml-3 bg-[#A7B8EF]">
                        <FaSearch className="text-gray-600 text-xl border border-gray-700"/>
                    </button>
                    <button 
                        onClick={() => {
                            setEsNuevaCotizacion(true);
                            setCotizacionSeleccionada(null);
                            setCotizacionEditada({
                                tipo_despacho: 'Retiro en tienda',
                                direccion_despacho_id: direccionesDelCliente[0]?.id || undefined
                            });
                        }}
                        className="text-sm border border-gray-300 ml-2 bg-green-300 px-2 py-1"
                        disabled={loading}
                    >
                        Nueva Cotización
                    </button>
                </div>
            </div>


            {mostrarCotizaciones && (
                <div className="mt-4 ml-145">
                    {!clienteSeleccionado && (
                        <div className="mb-2 p-2 bg-yellow-100 text-yellow-800 rounded text-sm">
                            ⚠️ Selecciona un cliente primero para ver sus cotizaciones
                        </div>
                    )}
                    <input
                        type="text"
                        placeholder="Buscar cotización por nombre o ID"
                        value={busquedaCotizacion}
                        onChange={(e) => setBusquedaCotizacion(e.target.value)}
                        className="border px-2 py-1 bg-[#fffcfa] mb-2 w-80"
                    />
                    
                    {busquedaCotizacion.trim() !== '' ? (
                        <div className="mb-4">
                            <ul className="border max-h-40 overflow-y-auto bg-[#fffcfa]">
                                {cotizacionesDelCliente
                                    .filter(q => {
                                        console.log('Procesando cotización:', q); // Debug
                                        const searchTerm = busquedaCotizacion.toLowerCase();
                                        try {
                                            return (
                                                (q.nombre && q.nombre.toLowerCase().includes(searchTerm)) ||
                                                (q.id && q.id.toString().includes(busquedaCotizacion)) ||
                                                (q.cliente?.nombre && q.cliente.nombre.toLowerCase().includes(searchTerm))
                                            );
                                        } catch (error) {
                                            console.error('Error filtrando cotización:', q, error);
                                            return false;
                                        }
                                    })
                                    .map((q) => {
                                        return (
                                            <li
                                                key={q.id}
                                                className="p-2 hover:bg-orange-50 cursor-pointer"
                                                onClick={() => {
                                                    setCotizacionSeleccionada(q);
                                                    setEsNuevaCotizacion(false);
                                                    setBusquedaCotizacion('');
                                                }}
                                            >
                                                Cotización #{q.id} - {q.nombre} (${q.total_precio?.toLocaleString()})
                                            </li>
                                        );
                                    })}
                            </ul>
                        </div>
                    ) : (
                    <select
                        onChange={(e) => {
                            if (e.target.value === 'nueva') {
                                setEsNuevaCotizacion(true);
                                setCotizacionSeleccionada(null);
                                setCotizacionEditada({
                                    tipo_despacho: 'Retiro en tienda',
                                    direccion_despacho_id: direccionesDelCliente[0]?.id || undefined
                                });
                            } else {
                                const seleccionada = cotizacionesDelCliente.find(q => q.id === Number(e.target.value));
                                setCotizacionSeleccionada(seleccionada || null);
                                setEsNuevaCotizacion(false);
                            }
                        }}
                        className="border px-2 py-1 bg-[#fffcfa] ml-2"
                    >
                        <option value="">
                            {clienteSeleccionado 
                                ? `Selecciona una cotización (${cotizacionesDelCliente.length} disponibles)`
                                : 'Primero selecciona un cliente'
                            }
                        </option>
                        {clienteSeleccionado && (
                            <option value="nueva">+ Nueva Cotización</option>
                        )}
                        {cotizacionesDelCliente.map(q => (
                            <option key={q.id} value={q.id}>
                                Cotización #{q.id} - {q.nombre} (${q.total_precio?.toLocaleString()})
                            </option>
                        ))}
                    </select>
                    )}
                </div>
            )}


            {/*Tres tablas juntas con flex gap*/}
            <div className="flex gap-14">

                {/*Dos tablas juntas, Usuario y cliente con flex gap*/}
                <div>
                    <div>
                        <div>
                            <table className="table-auto border-collapse w-full border border-gray-800 mt-3">
                                <tbody>

                                <tr className="border-b border-gray-800">
                                    <td className="px-3 py-1 bg-[#fffcfa] font-medium text-gray-700">Nombre Id</td>
                                    <td className="px-3 py-1 bg-[#fff2e8] ">JOHN DOE</td>
                                    <td className="px-3 py-1 bg-[#fffcfa] font-medium text-gray-700">Tipo</td>
                                    <td className="px-3 py-1 bg-[#fff2e8] ">Vendedor</td>
                                </tr>

                                <tr className="border-b border-gray-800">
                                    <td className="px-3 py-1 bg-[#fffcfa] font-medium text-gray-700">Tienda</td>
                                    <td className="px-3 py-1 bg-[#fff2e8]" colSpan={3}>Nombre Tienda</td>
                                </tr>

                                </tbody>
                            </table>
                        </div>
                    </div>


                    <div className="text-2xl flex items-center px-2 py-3 bg-gray-100 font-semibold w-full">
                        Cliente
                        <button onClick={() => setMostrarBarra(!mostrarBarra)}
                                className="text-sm border border-gray-300 ml-3 bg-[#A7B8EF]">
                            <FaSearch className="text-gray-600 text-xl border border-gray-700"/>
                        </button>
                    </div>

                    {mostrarBarra && (
                        <div className="mt-2 mb-[-9]">
                            <input
                                type="text"
                                placeholder="Buscar cliente por nombre o Rut"
                                value={busqueda}
                                onChange={(e) => setBusqueda(e.target.value)}
                                className="border px-2 py-1  w-full overflow-y-auto mb-2 bg-[#fffcfa]"
                            />
                        </div>
                    )}

                    {busqueda.trim() !== '' && (
                        <div className="mb-4 ">
                            <ul className="border max-h-40  bg-[#fffcfa]">
                                {clientes
                                    .filter(c =>
                                        c.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
                                        c.rut.includes(busqueda)
                                    )
                                    .map((c) => (
                                        <li
                                            key={c.id}
                                            className="p-2 hover:bg-orange-50 cursor-pointer"
                                            onClick={() => {
                                                setClienteSeleccionado(c);
                                                setBusqueda('');
                                            }}
                                        >
                                            {c.nombre} - {c.rut}
                                        </li>
                                    ))}
                            </ul>
                        </div>
                    )}

                    {clienteSeleccionado && (
                        <table className="table-auto border-collapse border border-gray-800 mt-3">
                            <tbody>

                            <tr className="border-b border-gray-800">
                                <td className="px-3 py-1 bg-[#fffcfa] font-medium text-gray-700">RUT</td>
                                <td className="px-3 py-1 bg-[#fff2e8] w-[400px]">{clienteSeleccionado.rut}</td>
                            </tr>

                            <tr className="border-b border-gray-800">
                                <td className="px-3 py-1 bg-[#fffcfa] font-medium text-gray-700">Tipo Cliente</td>
                                <td className="px-3 py-1 bg-[#fff2e8] ">{clienteSeleccionado.tipo_cliente?.nombre || 'No especificado'}</td>
                            </tr>

                            <tr className="border-b border-gray-800">
                                <td className="px-3 py-1 bg-[#fffcfa] font-medium text-gray-700">Nombre</td>
                                <td className="px-3 py-1 bg-[#fff2e8]">{clienteSeleccionado.nombre}</td>
                            </tr>

                            <tr className="border-b border-gray-800">
                                <td className="px-3 py-1 bg-[#fffcfa] font-medium text-gray-700">Razón Social</td>
                                <td className="px-3 py-1 bg-[#fff2e8]">{clienteSeleccionado.razon_social || 'No especificada'}</td>
                            </tr>

                            <tr className="border-b border-gray-800">
                                <td className="px-3 py-1 bg-[#fffcfa] font-medium text-gray-700">Teléfono</td>
                                <td className="px-3 py-1 bg-[#fff2e8]">{clienteSeleccionado.telefono || 'No especificado'}</td>
                            </tr>

                            <tr className="border-b border-gray-800">
                                <td className="px-3 py-1 bg-[#fffcfa] font-medium text-gray-700">Email</td>
                                <td className="px-3 py-1 bg-[#fff2e8]">{clienteSeleccionado.email || 'No especificado'}</td>
                            </tr>

                            <tr className="border-b border-gray-800">
                                <td className="px-3 py-1 bg-[#fffcfa] font-medium text-gray-700">Dirección principal
                                </td>
                                <td className="px-3 py-1 bg-[#fff2e8]">{direccionPrincipal?.direccion || 'No especificada'}</td>
                            </tr>

                            <tr className="border-b border-gray-800">
                                <td className="px-3 py-1 bg-[#fffcfa] font-medium text-gray-700">País</td>
                                <td className="px-3 py-1 bg-[#fff2e8]">Chile</td>
                            </tr>

                            <tr className="border-b border-gray-800">
                                <td className="px-3 py-1 bg-[#fffcfa] font-medium text-gray-700">Ciudad</td>
                                <td className="px-3 py-1 bg-[#fff2e8]">{direccionPrincipal?.ciudad || 'No especificada'}</td>
                            </tr>

                            <tr className="border-b border-gray-800">
                                <td className="px-3 py-1 bg-[#fffcfa] font-medium text-gray-700">Comuna</td>
                                <td className="px-3 py-1 bg-[#fff2e8]">{direccionPrincipal?.comuna || 'No especificada'}</td>
                            </tr>

                            </tbody>
                        </table>
                    )}
                </div>

                {/*Tabla cotización*/}

                {(cotizacionSeleccionada || esNuevaCotizacion) && (
                    <table className="table-auto border-collapse border border-gray-800 mt-3">
                        <tbody>

                        <tr className="border-b border-gray-800">
                            <td className="px-3 py-1 bg-[#fffcfa] font-medium text-gray-700">Id Interno</td>
                            <td className="px-3 py-1 bg-[#fff2e8] w-[400px]">
                                {esNuevaCotizacion ? 'Nuevo' : cotizacionSeleccionada?.id}
                            </td>
                        </tr>

                        <tr className="border-b border-gray-800">
                            <td className="px-3 py-1 bg-[#fffcfa] font-medium text-gray-700">Sec.Externa</td>
                            <td className="px-3 py-1 bg-[#fff2e8]">
                                {esNuevaCotizacion ? (
                                    <input
                                        type="text"
                                        value={cotizacionEditada.sec_externa || ''}
                                        onChange={(e) => setCotizacionEditada({...cotizacionEditada, sec_externa: e.target.value})}
                                        className="w-full bg-transparent border-none outline-none"
                                        placeholder="Ingrese número externo"
                                    />
                                ) : cotizacionSeleccionada?.sec_externa}
                            </td>
                        </tr>

                        <tr className="border-b border-gray-800">
                            <td className="px-3 py-1 bg-[#fffcfa] font-medium text-gray-700">Nombre</td>
                            <td className="px-3 py-1 bg-[#fff2e8]">
                                {esNuevaCotizacion ? (
                                    <input
                                        type="text"
                                        value={cotizacionEditada.nombre || ''}
                                        onChange={(e) => setCotizacionEditada({...cotizacionEditada, nombre: e.target.value})}
                                        className="w-full bg-transparent border-none outline-none"
                                        placeholder="Ingrese nombre de cotización"
                                    />
                                ) : cotizacionSeleccionada?.nombre}
                            </td>
                        </tr>

                        <tr className="border-b border-gray-800">
                            <td className="px-3 py-1 bg-[#fffcfa] font-medium text-gray-700">Descripción</td>
                            <td className="px-3 py-1 bg-[#fff2e8]">
                                {esNuevaCotizacion ? (
                                    <textarea
                                        value={cotizacionEditada.descripcion || ''}
                                        onChange={(e) => setCotizacionEditada({...cotizacionEditada, descripcion: e.target.value})}
                                        className="w-full bg-transparent border-none outline-none resize-none"
                                        placeholder="Ingrese descripción"
                                        rows={2}
                                    />
                                ) : 'No disponible en vista simplificada'}
                            </td>
                        </tr>

                        <tr className="border-b border-gray-800">
                            <td className="px-3 py-1 bg-[#fffcfa] font-medium text-gray-700">Tipo de despacho</td>
                            <td className="px-3 py-1 bg-[#fff2e8]">
                                {esNuevaCotizacion ? (
                                    <select
                                        value={cotizacionEditada.tipo_despacho || 'Retiro en tienda'}
                                        onChange={(e) => setCotizacionEditada({...cotizacionEditada, tipo_despacho: e.target.value as 'Retiro en tienda' | 'Despacho a domicilio'})}
                                        className="w-full bg-transparent border-none outline-none cursor-pointer"
                                    >
                                        <option value="Retiro en tienda">Retiro en tienda</option>
                                        <option value="Despacho a domicilio">Despacho a domicilio</option>
                                    </select>
                                ) : 'No disponible en vista simplificada'}
                            </td>
                        </tr>

                        <tr className="border-b border-gray-800">
                            <td className="px-3 py-1 bg-[#fffcfa] font-medium text-gray-700">Dirección de despacho</td>
                            <td className="px-3 py-1 bg-[#fff2e8]">
                                {esNuevaCotizacion ? (
                                    <select
                                        value={cotizacionEditada.direccion_despacho_id || ''}
                                        onChange={(e) => setCotizacionEditada({...cotizacionEditada, direccion_despacho_id: Number(e.target.value)})}
                                        className="w-full bg-transparent border-none outline-none cursor-pointer"
                                    >
                                        <option value="">Seleccione una dirección</option>
                                        {direccionesDelCliente.map(dir => (
                                            <option key={dir.id} value={dir.id}>
                                                {dir.nombre} - {dir.direccion}
                                            </option>
                                        ))}
                                    </select>
                                ) : 'No disponible en vista simplificada'}
                            </td>
                        </tr>

                        <tr className="border-b border-gray-800">
                            <td className="px-3 py-1 bg-[#fffcfa] font-medium text-gray-700">Comuna despacho</td>
                            <td className="px-3 py-1 bg-[#fff2e8]">
                                {esNuevaCotizacion ? (
                                    <input
                                        type="text"
                                        value={cotizacionEditada.comuna_despacho || ''}
                                        onChange={(e) => setCotizacionEditada({...cotizacionEditada, comuna_despacho: e.target.value})}
                                        className="w-full bg-transparent border-none outline-none"
                                        placeholder="Ingrese comuna"
                                    />
                                ) : 'No disponible en vista simplificada'}
                            </td>
                        </tr>

                        <tr className="border-b border-gray-800">
                            <td className="px-3 py-1 bg-[#fffcfa] font-medium text-gray-700">Ciudad despacho</td>
                            <td className="px-3 py-1 bg-[#fff2e8]">
                                {esNuevaCotizacion ? (
                                    <input
                                        type="text"
                                        value={cotizacionEditada.ciudad_despacho || ''}
                                        onChange={(e) => setCotizacionEditada({...cotizacionEditada, ciudad_despacho: e.target.value})}
                                        className="w-full bg-transparent border-none outline-none"
                                        placeholder="Ingrese ciudad"
                                    />
                                ) : 'No disponible en vista simplificada'}
                            </td>
                        </tr>

                        {esNuevaCotizacion && (
                            <tr>
                                <td colSpan={2} className="px-3 py-2 text-center">
                                    <button
                                        onClick={guardarNuevaCotizacion}
                                        disabled={loading}
                                        className="bg-blue-500 text-white px-4 py-2 rounded mr-2 disabled:bg-blue-300"
                                    >
                                        {loading ? 'Guardando...' : 'Guardar Cotización'}
                                    </button>
                                    <button
                                        onClick={() => {
                                            setEsNuevaCotizacion(false);
                                            setCotizacionEditada({});
                                        }}
                                        disabled={loading}
                                        className="bg-gray-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
                                    >
                                        Cancelar
                                    </button>
                                </td>
                            </tr>
                        )}

                        </tbody>
                    </table>
                )}
            </div>
        </div>

    );
}
