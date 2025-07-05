'use client'
import React from 'react';
import { clients, addresses, quotations} from '@/mocks/mocksDatos';
import { useState } from 'react';
import { FaSearch } from 'react-icons/fa';

export default function Cliente() {

    const [clienteSeleccionado, setClienteSeleccionado] = useState<Client | null>(null);
    const [cotizacionSeleccionada, setCotizacionSeleccionada] = useState<Quotation | null>(null);
    const [setMostrarBusqueda] = useState(true);
    const [mostrarBarra, setMostrarBarra] = useState(false);
    const [mostrarCotizaciones, setMostrarCotizaciones] = useState(false);
    const [busqueda, setBusqueda] = useState('');
    const cliente = clienteSeleccionado; {/*Para Buscar cliente*/}
    const direccionPrincipal = addresses.find(a => a.clientId === clienteSeleccionado?.id);
    const cotizacionesDelCliente = quotations.filter(q => q.clientId === clienteSeleccionado?.id);



    return(

        <div className = " w-fit text-sm">

        {/*Tabla Usuario*/}


        
        {/*Titulos usuario y Cotización barra*/}

        <div className="flex gap-120">
            
            <div className="text-2xl flex items-center px-3 py-2 bg-gray-100 font-semibold">
                Usuario 
            </div>
            
            <div className="text-2xl flex items-center bg-gray-100 font-semibold">
                Cotización 
                    <button onClick={() => setMostrarCotizaciones(!mostrarCotizaciones)} className = "text-sm border border-gray-300 ml-3 bg-[#A7B8EF]">
                        <FaSearch className="text-gray-600 text-xl border border-gray-700" />
                    </button>
            </div>
        </div>
            


        {mostrarCotizaciones && clienteSeleccionado &&  (
        <div className="mt-4 ml-145">
            <select
            onChange={(e) => {
                const seleccionada = quotations.find(q => q.id === e.target.value);
                setCotizacionSeleccionada(seleccionada || null);
            }}
            className="border px-2 py-1 bg-[#fffcfa] ml-2"
            >
            <option value="">Selecciona una cotización</option>
            {cotizacionesDelCliente.map(q => (
                <option key={q.id} value={q.id}>
                Cotización #{q.secExterna} ({q.nombre})
                </option>
            ))}
            </select>
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
                        <td className="px-3 py-1 bg-[#fff2e8]"colSpan={3}>Nombre Tienda</td>
                        </tr>

                    </tbody>
                </table>                
                </div>
            </div>

        
            <div className="text-2xl flex items-center px-2 py-3 bg-gray-100 font-semibold w-full">
                    Cliente 
                    <button onClick={() => setMostrarBarra(!mostrarBarra)} className = "text-sm border border-gray-300 ml-3 bg-[#A7B8EF]">
                        <FaSearch className="text-gray-600 text-xl border border-gray-700" />
                    </button>
            </div>

            {mostrarBarra  && (
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

            {busqueda.trim() !== '' &&(
                <div className="mb-4 ">
                <ul className="border max-h-40  bg-[#fffcfa]">
                    {clients
                    .filter(c =>
                    c.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
                    c.documentoId.includes(busqueda)
                    )
                    .map((c) => (
                    <li
                        key={c.id}
                        className="p-2 hover:bg-orange-50 cursor-pointer"
                        onClick={() => {
                        setClienteSeleccionado(c);
                        setMostrarBusqueda(false);
                        setBusqueda('');
                        }}
                    >
                        {c.nombre} {c.apellido} - {c.documentoId}
                    </li>
                    ))}
                </ul>
            </div>
            )}

            {clienteSeleccionado && (
            <table className="table-auto border-collapse border border-gray-800 mt-3">
                <tbody>

                    <tr className="border-b border-gray-800">
                    <td className="px-3 py-1 bg-[#fffcfa] font-medium text-gray-700">Documento Id</td>
                    <td className="px-3 py-1 bg-[#fff2e8] w-[400px]">{cliente.documentoId}</td>
                    </tr>

                    <tr className="border-b border-gray-800">
                    <td className="px-3 py-1 bg-[#fffcfa] font-medium text-gray-700">Tipo Cliente</td>
                    <td className="px-3 py-1 bg-[#fff2e8] ">{cliente.tipoCliente}</td>
                    </tr>

                    <tr className="border-b border-gray-800">
                    <td className="px-3 py-1 bg-[#fffcfa] font-medium text-gray-700">Nombre</td>
                    <td className="px-3 py-1 bg-[#fff2e8]">{cliente.nombre}</td>
                    </tr>

                    <tr className="border-b border-gray-800">
                    <td className="px-3 py-1 bg-[#fffcfa] font-medium text-gray-700">Apellido</td>
                    <td className="px-3 py-1 bg-[#fff2e8]">{cliente.apellido}</td>
                    </tr>

                    <tr className="border-b border-gray-800">
                    <td className="px-3 py-1 bg-[#fffcfa] font-medium text-gray-700">Teléfono</td>
                    <td className="px-3 py-1 bg-[#fff2e8]">{cliente.telefono}</td>
                    </tr>                    

                    <tr className="border-b border-gray-800">
                    <td className="px-3 py-1 bg-[#fffcfa] font-medium text-gray-700">Email</td>
                    <td className="px-3 py-1 bg-[#fff2e8]">{cliente.email}</td>
                    </tr>

                    <tr className="border-b border-gray-800">
                    <td className="px-3 py-1 bg-[#fffcfa] font-medium text-gray-700">Dirección principal</td>
                    <td className="px-3 py-1 bg-[#fff2e8]">{direccionPrincipal?.direccion}</td>
                    </tr>

                    <tr className="border-b border-gray-800">
                    <td className="px-3 py-1 bg-[#fffcfa] font-medium text-gray-700">País</td>
                    <td className="px-3 py-1 bg-[#fff2e8]">Chile </td>
                    </tr>

                    <tr className="border-b border-gray-800">
                    <td className="px-3 py-1 bg-[#fffcfa] font-medium text-gray-700">Ciudad</td>
                    <td className="px-3 py-1 bg-[#fff2e8]">{direccionPrincipal?.ciudad}</td>
                    </tr>

                    <tr className="border-b border-gray-800">
                    <td className="px-3 py-1 bg-[#fffcfa] font-medium text-gray-700">Comuna</td>
                    <td className="px-3 py-1 bg-[#fff2e8]">{direccionPrincipal?.comuna}</td>
                    </tr>

                </tbody>
            </table>
        )}
        </div>

        {/*Tabla cotización*/}


            {cotizacionSeleccionada  && (
            <table className="table-auto border-collapse border border-gray-800 mt-3">
                <tbody>

                    <tr className="border-b border-gray-800">
                    <td className="px-3 py-1 bg-[#fffcfa] font-medium text-gray-700">Id Interno</td>
                    <td className="px-3 py-1 bg-[#fff2e8] w-[400px]">{cotizacionSeleccionada.id}</td>
                    </tr>

                    <tr className="border-b border-gray-800">
                    <td className="px-3 py-1 bg-[#fffcfa] font-medium text-gray-700">Sec.Externa</td>
                    <td className="px-3 py-1 bg-[#fff2e8] ">{cotizacionSeleccionada.secExterna}</td>
                    </tr>

                    <tr className="border-b border-gray-800">
                    <td className="px-3 py-1 bg-[#fffcfa] font-medium text-gray-700">Nombre</td>
                    <td className="px-3 py-1 bg-[#fff2e8]">{cotizacionSeleccionada.nombre}</td>
                    </tr>

                    <tr className="border-b border-gray-800">
                    <td className="px-3 py-1 bg-[#fffcfa] font-medium text-gray-700">Descripción</td>
                    <td className="px-3 py-1 bg-[#fff2e8]">{cotizacionSeleccionada.descripcion}</td>
                    </tr>

                    <tr className="border-b border-gray-800">
                    <td className="px-3 py-1 bg-[#fffcfa] font-medium text-gray-700">Cliente</td>
                    <td className="px-3 py-1 bg-[#fff2e8]">{cotizacionSeleccionada.tipoDespacho}</td>
                    </tr>                    

                    <tr className="border-b border-gray-800">
                    <td className="px-3 py-1 bg-[#fffcfa] font-medium text-gray-700">Tipo de despacho</td>
                    <td className="px-3 py-1 bg-[#fff2e8]">{cotizacionSeleccionada.direccionDespachoId}</td>
                    </tr>

                    <tr className="border-b border-gray-800">
                    <td className="px-3 py-1 bg-[#fffcfa] font-medium text-gray-700">Nombre dirección de despacho</td>
                    <td className="px-3 py-1 bg-[#fff2e8]">{cotizacionSeleccionada.nombre}</td>
                    </tr>

                    <tr className="border-b border-gray-800">
                    <td className="px-3 py-1 bg-[#fffcfa] font-medium text-gray-700">Dirección</td>
                    <td className="px-3 py-1 bg-[#fff2e8]">Chile </td>
                    </tr>

                    <tr className="border-b border-gray-800">
                    <td className="px-3 py-1 bg-[#fffcfa] font-medium text-gray-700">Comuna despacho</td>
                    <td className="px-3 py-1 bg-[#fff2e8]">{cotizacionSeleccionada.ComunaDespacho}</td>
                    </tr>

                    <tr className="border-b border-gray-800">
                    <td className="px-3 py-1 bg-[#fffcfa] font-medium text-gray-700">Ciudad despacho</td>
                    <td className="px-3 py-1 bg-[#fff2e8]">{cotizacionSeleccionada.ciudadCespacho}</td>
                    </tr>

                </tbody>
            </table>         
            )}
            </div>
        </div>

    );
}
