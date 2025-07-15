'use client'

import { FaSearch } from "react-icons/fa";
import { useEffect, useState } from 'react';
import HistorialCotizacionModal from './HistorialCotizacionModal';
import DetalleCotizacionModal from './DetalleCotizacionModal';
import { CotizacionSimplificada, Cliente as ClienteType, clienteService } from '@/services/apiService';

interface ClienteProps {
    onClienteSeleccionado?: (cliente: ClienteType) => void;
}

export default function Cliente({ onClienteSeleccionado }: ClienteProps) {
    const [mostrarModal, setMostrarModal] = useState(false);
    const [MostrarModal_His, setMostrarModal_His] = useState(false);
    const [AñadirCliente, setAñadirCliente] = useState(false);
    const [clientes, setClientes] = useState<ClienteType[]>([]);
    const [clienteSeleccionado, setClienteSeleccionado] = useState<ClienteType | null>(null);
    const [busqueda, setBusqueda] = useState("");
    const [selectedCotizacionId, setSelectedCotizacionId] = useState<number | null>(null);
    const [showDetalleModal, setShowDetalleModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    // Cargar clientes al montar el componente
    useEffect(() => {
        const fetchClientes = async () => {
            try {
                console.log('Cliente.tsx: Iniciando carga de clientes...');
                setLoading(true);
                const data = await clienteService.obtenerClientes();
                console.log('Cliente.tsx: Clientes obtenidos:', data);
                setClientes(data);
                setError(null);
            } catch (err) {
                console.error('Cliente.tsx: Error al cargar clientes:', err);
                setError(err instanceof Error ? err.message : 'Error al cargar clientes');
            } finally {
                setLoading(false);
            }
        };

        fetchClientes();
    }, []);

    // Filtrar clientes basado en la búsqueda
    const clientesFiltrados = clientes.filter((cliente) => {
        const termino = busqueda.toLowerCase();
        return (
            cliente.nombre.toLowerCase().includes(termino) ||
            cliente.rut.toLowerCase().includes(termino) ||
            cliente.razon_social?.toLowerCase().includes(termino)
        );
    });

    console.log('Cliente.tsx: Estados actuales:', {
        loading,
        error,
        clientesTotal: clientes.length,
        clientesFiltrados: clientesFiltrados.length,
        busqueda,
        clienteSeleccionado: clienteSeleccionado?.nombre
    });

    // Manejar selección de cliente
    const handleClienteSeleccionado = (cliente: ClienteType) => {
        console.log('Cliente.tsx: Seleccionando cliente:', cliente);
        setClienteSeleccionado(cliente);
        setBusqueda("");
        if (onClienteSeleccionado) {
            console.log('Cliente.tsx: Llamando callback onClienteSeleccionado');
            onClienteSeleccionado(cliente);
        }
    };



    return (
        <div className="bg-white border border-gray-300 p-4 mx-auto rounded-lg w-[500px] ml-30 mb-4">
            
            <div className="ml-3">
            {/*Titulo: Seleccionar cliente*/}
            <div className="text-2xl font-bold text-black flex gap-2 mb-2">
                Seleccionar cliente
            </div>
        

            {/*Modal boton ver historial*/}
            <HistorialCotizacionModal
                isOpen={MostrarModal_His}
                onClose={() => setMostrarModal_His(false)}
                onSelectCotizacion={(cotizacion: CotizacionSimplificada) => {
                    console.log('Cotización seleccionada:', cotizacion);
                    setSelectedCotizacionId(cotizacion.id);
                    setMostrarModal_His(false);
                    setShowDetalleModal(true);
                }}
            />

            {/* Modal de detalle de cotización */}
            {showDetalleModal && selectedCotizacionId && (
                <DetalleCotizacionModal
                    cotizacionId={selectedCotizacionId}
                    isOpen={showDetalleModal}
                    onClose={() => {
                        setShowDetalleModal(false);
                        setSelectedCotizacionId(null);
                    }}
                    onEdit={(cotizacion) => {
                        console.log('Editar cotización:', cotizacion);
                        setShowDetalleModal(false);
                        setSelectedCotizacionId(null);
                    }}
                />
            )}
            
            {/*Boton añadir cliente*/}
            {AñadirCliente && (
            <div className="fixed inset-0 flex justify-center items-center">
            <div className="bg-[#0B1631] p-8 rounded-lg w-[600px]">
                {/*Titulo*/}
                <h2 className="text-3xl text-white font-semibold mb-2">Cliente</h2>

                {/*Titulos con flex y boton*/}
                <div className="flex font-bold text-white text-xl my-2">
                    <p className="ml-1 mb-1 mt-2">Datos cliente</p>
                    <p className="ml-37 mb-1 mt-2">Direcciones</p>
                    {/*Boton más*/}
                    <button className="w-7 h-7 mt-2 ml-2 items-center gap-3 text-white rounded-full justify-center 
                            text-xl font-bold bg-[#4CAF50] hover:bg-[#3E8F41] cursor-pointer"
                            onClick={() => []}>
                    +
                    </button>
                </div>

                {/*Dos tablas con flex*/}
                <div className="flex justify-center mb-5">

                    {/*Tabla uno*/}
                    <div className="rounded bg-white w-[300]">
                        <p className="ml-3 mb-1 mt-2 font-bold">Nombre</p>
                        <input
                            type="text"
                            // value={}
                            onChange={() => {}}
                            placeholder="ej: Nicolás Jiménez"
                            className="ml-2 mb-2 border rounded-sm border-[#DFDFDF] px-3 py-1 w-[240]"
                        /> 

                        <p className="ml-3 mb-1 mt-1 font-bold">Tipo de cliente</p>
                        <input
                            type="text"
                            // value={}
                            onChange={() => {}}
                            placeholder="ej: 1"
                            className="ml-2 mb-2 border rounded-sm border-[#DFDFDF] px-3 py-1 w-[240]"
                        />  

                        <p className="ml-3 mb-1 mt-1 font-bold">Teléfono</p>
                        <input
                            type="text"
                            // value={}
                            onChange={() => {}}
                            placeholder="ej: +56912345678"
                            className="ml-2 mb-2 border rounded-sm border-[#DFDFDF] px-3 py-1 w-[240]"
                        />  

                        <p className="ml-3 mb-1 mt-1 font-bold">Email</p>
                        <input
                            type="email"
                            // value={}
                            onChange={() => {}}
                            placeholder="ej: nicolas@correo.cl"
                            className="ml-2 mb-2 border rounded-sm border-[#DFDFDF] px-3 py-1 w-[240]"
                        />  

                    </div>

                    {/*Tabla dos*/}
                    <div className="ml-4 rounded bg-white w-[300]">

                        <p className="ml-3 mb-1 mt-2 font-bold">Nombre</p>
                        <input
                            type="text"
                            // value={}
                            onChange={() => {}}
                            placeholder="ej: Casa"
                            className="ml-2 mb-2 border rounded-sm border-[#DFDFDF] px-3 py-1 w-[240]"
                        /> 

                        <p className="ml-3 mb-1 mt-1 font-bold">Dirección principal</p>
                        <input
                            type="text"
                            // value={}
                            onChange={() => {}}
                            placeholder="ej: calle #1234"
                            className="ml-2 mb-2 border rounded-sm border-[#DFDFDF] px-3 py-1 w-[240]"
                        />  

                        <p className="ml-3 mb-1 mt-1 font-bold">Comuna</p>
                        <input
                            type="text"
                            // value={}
                            onChange={() => {}}
                            placeholder="ej: +56912345678"
                            className="ml-2 mb-2 border rounded-sm border-[#DFDFDF] px-3 py-1 w-[240]"
                        />  

                        <p className="ml-3 mb-1 mt-1 font-bold">Ciudad</p>
                        <input
                            type="text"
                            // value={}
                            onChange={() => {}}
                            placeholder="ej: nicolas@correo.cl"
                            className="ml-2 mb-2 border rounded-sm border-[#DFDFDF] px-3 py-1 w-[240]"
                        />  
                        
                        <p className="ml-3 mb-1 mt-1 font-bold">País</p>
                        <input
                            type="text"
                            // value={}
                            onChange={() => {}}
                            placeholder="ej: Chile"
                            className="ml-2 mb-2 border rounded-sm border-[#DFDFDF] px-3 py-1 w-[240]"
                        />  

                    </div>
                </div>
                {/*Botones Cancelar y guardar*/}
                <div className="flex justify-end">
                <button
                    className="px-25 py-2 border border-white bg-[#0B1631] text-white rounded hover:bg-[#15295C]"
                    onClick={() => setAñadirCliente(false)}
                >
                    Cancelar
                </button>
                <button
                    className="px-25 py-2 ml-3 bg-[#F59243] text-white rounded hover:bg-[#FF9243]"
                    onClick={() => setAñadirCliente(false)}
                >
                    Guardar
                </button>
                </div>
            </div>
            </div>
            )}

            {mostrarModal && (
            <div className="fixed inset-0 flex justify-center items-center">
            <div className="bg-[#0B1631] p-8 rounded-lg w-[650px]">

                {/*Titulo*/}
                <h2 className="text-2xl text-white font-semibold mb-4">Detalle cotización</h2>

                {/*Dos tablas con flex*/}
                <div className="flex my-4">

                    {/*Tabla uno*/}
                    <div className="rounded bg-white w-[325]">

                    <p className="ml-3 mb-1 mt-2 font-bold">Nombre</p>
                        <input
                            type="text"
                            // value={}
                            onChange={() => {}}
                            placeholder="Nombre cotización"
                            className="ml-2 mb-2 border rounded-sm border-[#DFDFDF] px-3 py-1 w-[290]"
                        />      

                    <p className="ml-3 mb-1 font-bold">Id</p>
                        <input
                            type="text"
                            // value={}
                            onChange={() => {}}
                            placeholder="Calle #1234"
                            className="ml-2 mb-2 border rounded-sm border-[#DFDFDF] px-3 py-1 w-[290]"
                        /> 

                    <p className="ml-3 mb-1 font-bold">Descripción</p>
                        <input
                            type="text"
                            // value={}
                            onChange={() => {}}
                            placeholder="Añada una descripción"
                            className="ml-2 mb-2 border rounded-sm border-[#DFDFDF] px-3 py-1 w-[290]"
                        /> 
                    
                    <div className="flex">
                     <p className="ml-3 mb-1 font-bold">Fecha creación</p>
                     <p className="ml-11 mb-1 font-bold">Vigencia</p>
                     </div>
                    <div className="flex">
                       
                        <input
                            type="date"
                            // value={}
                            onChange={() => {}}
                            className="ml-2 mb-2 border rounded-sm border-[#DFDFDF] px-3 py-1 w-[150]"
                        /> 

                        <input
                            type="text"
                            // value={}
                            onChange={() => {}}
                            placeholder="Santiago"
                            className="ml-2 mb-2 border rounded-sm border-[#DFDFDF] px-3 py-1 w-[131]"
                        /> 
                    </div>

                    <p className="ml-3 mb-1 font-bold">Dirección destino</p>
                        <input
                            type="text"
                            // value={}
                            onChange={() => {}}
                            placeholder="Dirección"
                            className="ml-2 mb-2 border rounded-sm border-[#DFDFDF] px-3 py-1 w-[290]"
                        /> 

                    <p className="ml-3 mb-1 font-bold">Creado por</p>
                        <input
                            type="text"
                            // value={}
                            onChange={() => {}}
                            placeholder="Vendedor nombre"
                            className="ml-2 mb-2 border rounded-sm border-[#DFDFDF] px-3 py-1 w-[290]"
                        /> 

                    <p className="ml-3 mb-1 font-bold">Total</p>
                        <input
                            type="number"
                            // value={}
                            onChange={() => {}}
                            placeholder="10000"
                            className="ml-2 mb-3 border rounded-sm border-[#DFDFDF] px-3 py-1 w-[290]"
                        /> 

                    </div>


                {/*Tabla dos*/}
                    <div className="ml-4 rounded bg-white h-[380] w-[269]">

                    <p className="mt-2 ml-2 mb-1 font-bold">Cliente</p>
                                            <input
                            type="text"
                            // value={}
                            onChange={() => {}}
                            placeholder="Cliente"
                            className="ml-2 mb-2 border rounded-sm border-[#DFDFDF] px-3 py-1 w-[240]"
                        /> 

                    <p className="ml-2 mb-1 font-bold">Email</p>
                                            <input
                            type="email"
                            // value={}
                            onChange={() => {}}
                            placeholder="Email@Example.cl"
                            className="ml-2 mb-2 border rounded-sm border-[#DFDFDF] px-3 py-1 w-[240]"
                        /> 

                    <p className="ml-2 mb-1 font-bold">Teléfono</p>
                                            <input
                            type="email"
                            // value={}
                            onChange={() => {}}
                            placeholder="+56912345678"
                            className="ml-2 mb-2 border rounded-sm border-[#DFDFDF] px-3 py-1 w-[240]"
                        /> 

                    <p className="ml-2 mb-1 font-bold">Tipo cliente</p>
                                            <input
                            type="email"
                            // value={}
                            onChange={() => {}}
                            placeholder="tipo"
                            className="ml-2 mb-2 border rounded-sm border-[#DFDFDF] px-3 py-1 w-[240]"
                        /> 

                    <button className="my-2 ml-2 px-16 py-4 mr-2 text-2xl text-black font-bold rounded bg-[#F1F6EF]">
                        Aprobada
                    </button>

                    </div>

                </div>

                {/*Botones Cancelar y guardar*/}
                <div className="flex justify-end">
                <button
                    className="px-28 py-2 border border-white bg-[#0B1631] text-white rounded hover:bg-[#15295C]"
                    onClick={() => setMostrarModal(false)}
                >
                    Cancelar
                </button>
                 <button
                    className="px-28 py-2 ml-3 bg-[#F59243] text-white rounded hover:bg-[#FF9243]"
                    onClick={() => setMostrarModal(false)}
                >
                    Guardar
                </button>
                </div>


            </div>
            </div>
            )}


            <div className="flex">
                {/*Icono barrita*/}
                <div  className="relative">
                    <span className="absolute top-[16] inset-y-1/2 left-3 flex items-center text-[#949494]">
                        <FaSearch />
                    </span>
                </div>
                {/*Barrita*/}
                <input
                    type="text"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    placeholder="Buscar"
                    className="border rounded-sm border-[#DFDFDF] pl-10 px-3 py-1 w-[420]"
                >
                </input>
                <div>

                {/*Boton más*/}
                <button className="w-7 h-7 ml-2 items-center gap-3 text-white rounded-full justify-center 
                                   text-xl font-bold bg-[#4CAF50] hover:bg-[#3E8F41] cursor-pointer"
                                   onClick={() => setAñadirCliente(true)}>
                    +
                </button>
                </div>
            </div>

            {/*Mostrar opciones de la barra fuera del flex para que quede abajo*/}
            {busqueda.trim() !== "" && (
                <ul className="border rounded w-[420] bg-white shadow-lg max-h-60 overflow-y-auto">
                    {loading ? (
                        <li className="p-2 text-gray-500">Cargando...</li>
                    ) : error ? (
                        <li className="p-2 text-red-500">Error: {error}</li>
                    ) : clientesFiltrados.length > 0 ? (
                        clientesFiltrados.map((cliente, index) => (
                            <li 
                                key={index} 
                                className="p-2 border-b hover:bg-gray-50 cursor-pointer"
                                onClick={() => handleClienteSeleccionado(cliente)}
                            >
                                <div className="flex flex-col">
                                    <strong className="text-gray-800">{cliente.nombre}</strong>
                                    <span className="text-sm text-gray-600">{cliente.rut}</span>
                                    {cliente.razon_social && (
                                        <span className="text-xs text-gray-500">{cliente.razon_social}</span>
                                    )}
                                </div>
                            </li>
                        ))
                    ) : (
                        <li className="p-2 text-gray-500">No se encontraron clientes</li>
                    )}
                </ul>
            )}

            {/* Lista de clientes disponibles (siempre visible) */}
            <div className="mt-3">
                <p className="text-sm text-gray-600 mb-2">Clientes disponibles (haga clic para seleccionar):</p>
                <div className="max-h-40 overflow-y-auto border rounded bg-gray-50 p-2">
                    {loading ? (
                        <p className="text-gray-500">Cargando clientes...</p>
                    ) : error ? (
                        <p className="text-red-500">Error: {error}</p>
                    ) : clientes.length > 0 ? (
                        clientes.slice(0, 5).map((cliente, index) => (
                            <div 
                                key={index}
                                className="p-2 mb-1 bg-white rounded cursor-pointer hover:bg-blue-50 border"
                                onClick={() => handleClienteSeleccionado(cliente)}
                            >
                                <div className="flex flex-col">
                                    <strong className="text-sm text-gray-800">{cliente.nombre}</strong>
                                    <span className="text-xs text-gray-600">{cliente.rut}</span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500">No hay clientes disponibles</p>
                    )}
                    {clientes.length > 5 && (
                        <p className="text-xs text-gray-500 mt-2">
                            Y {clientes.length - 5} clientes más... Use la búsqueda para encontrar específicos.
                        </p>
                    )}
                </div>
            </div>

            {/*Titulo: Nombre Cliente*/}
            <div className="mt-2 text-xl text-base text-black font-bold">
                Nombre Cliente
            </div>
            <div className="mt-4 ml-2 text-base text-black flex">
                {clienteSeleccionado ? (
                    <div className="flex flex-col">
                        <span className="font-semibold">{clienteSeleccionado.nombre}</span>
                        <span className="text-sm text-gray-600">
                            Rut {clienteSeleccionado.rut} | 
                            {clienteSeleccionado.tipo_cliente?.nombre || `Tipo ${clienteSeleccionado.tipo_id}`} | 
                            {clienteSeleccionado.email || 'Sin email'}
                        </span>
                        {clienteSeleccionado.razon_social && (
                            <span className="text-xs text-gray-500">{clienteSeleccionado.razon_social}</span>
                        )}
                    </div>
                ) : (
                    <span className="text-gray-500 italic">Seleccione un cliente</span>
                )}
            </div>


            {/*Botones*/}
            <div className="flex justify-end mt-7">
                <button 
                    className="px-3 py-1 mr-4 text-white rounded bg-[#F59243] hover:bg-[#E6893F] cursor-pointer"
                    onClick={() => setMostrarModal_His(true)}
                >
                    Ver historial
                </button>

                <button 
                    className="px-3 py-1 text-white rounded bg-[#2563B6] hover:bg-[#1F5399] cursor-pointer"
                    onClick={() => setMostrarModal(true)}
                >
                    Ver detalle
                </button>
            </div>

            </div>
        </div>
    );
}
