'use client'


import { FaSearch } from "react-icons/fa";
import { useEffect, useState } from 'react';
import {clienteService , Cliente, cotizacionService, CotizacionSimplificada, DirCliente} from '@/services/apiService';
    
export default function Clientee() {
    const apiVentasUrl = process.env.NEXT_PUBLIC_API_VENTAS || "https://api-ventas.tssw.cl";
    const [mostrarModal, setMostrarModal] = useState(false);
    const [MostrarModal_His, setMostrarModal_His] =useState(false);
    const [AñadirCliente, setAñadirCliente] = useState(false);
    const [cotizaciones, setCotizaciones] = useState<CotizacionSimplificada[]>([]);
    const [seleccionada, setSeleccionada] = useState<CotizacionSimplificada | null>(null);
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [busqueda, setBusqueda] = useState("");
    const direcciones: DirCliente[] = [];


interface Cotizacion{
        id: number,
        fecha_crea: string,
        estado: 'aprobada' | 'rechazada' | 'pendiente' | string,
        costo_envio: number,
        user_id: string,
        nombre: string,
        tipo_despacho: string,
        descripcion: string,
        cliente: {
            nombre: string,
            telefono: string,
            email: string,
            rut: string,
            razon_social: string,
        }; 
        items: Array<{
            sku: string;
            nombre: string;
            cantidad: number;
        }>;
        total_items: number,
        total_precio: number
    }   

interface Cliente {
  id: number;
  nombre: string;
  telefono?: string;
  email?: string;
  razon_social?: string;
  rut: string;
  tipo_id: number;
  tipo_cliente?: {
    id: number;
    nombre: string;
  };
  direcciones?: DirCliente[];
}

const [nuevoCliente, setNuevoCliente] = useState({
    nombre: "",
    telefono: "",
    email: "",
    razon_social: "",
    rut: "",
    tipo_id: 1,
});


const guardarCliente = async () => {
  console.log("Validando cliente:", nuevoCliente);

  const esNombreValido = nuevoCliente.nombre.trim().length > 0;
  const esRutValido = /^\d{7,8}-[\dkK]$/.test(nuevoCliente.rut);
  const esEmailValido = nuevoCliente.email.includes("@");
  const esTelefonoValido = /^[0-9]{8,9}$/.test(nuevoCliente.telefono);

  if (!esNombreValido || !esRutValido || !esEmailValido || !esTelefonoValido) {
    console.warn("Validación fallida", {
      esNombreValido,
      esRutValido,
      esEmailValido,
      esTelefonoValido,
    });
    alert("Completa correctamente los campos obligatorios");
    return;
  }

const clienteAEnviar = { ...nuevoCliente };

  console.log("Enviando cliente:", clienteAEnviar); 

  try {
    const response = await clienteService.crearCliente(clienteAEnviar);
    console.log("Cliente guardado:", response);
    alert("Cliente guardado exitosamente");

    setAñadirCliente(false);
    setNuevoCliente({
      nombre: "",
      telefono: "",
      email: "",
      razon_social: "",
      rut: "",
      tipo_id: 1,
    });
  } catch (error) {
    console.error("Error al guardar:", error);
    alert("No se pudo guardar el cliente");
  }
};


useEffect(() => {
  const fetchCotizaciones = async () => {
    try {
      const data = await cotizacionService.obtenerCotizacionesSimplificadas();
      setCotizaciones(data);
    } catch (error) {
      console.error("Error cotizaciones:", error);
    }
  };
  fetchCotizaciones();
}, []);


useEffect(() => {
    const fetchClientes = async () => {
        try {
            const data = await clienteService.obtenerClientes();
            setClientes(data);
        }   catch (error) {
            console.error("Error clientes: ", error);
        }
    };
    fetchClientes();
}, []);
    
    const cotizacionesFiltradas = cotizaciones.filter((coti) => {
    const termino = busqueda.toLowerCase();
    return (
        coti.cliente?.nombre.toLowerCase().includes(termino) ||
        coti.cliente?.rut.toLowerCase().includes(termino)
    );
    });


    return (
        <div className="bg-white border border-gray-300 p-4 mx-auto rounded-lg w-[500px] ml-30 mb-4">
            
            <div className="ml-3">
            {/*Titulo: Seleccionar cliente*/}
            <div className="text-2xl font-bold text-black flex gap-2 mb-2">
                Seleccionar cliente
            </div>
        

            {/*Modal boton ver historial*/}
            {MostrarModal_His && (
            <div className="fixed inset-0 flex justify-center items-center">
              <div className="bg-[#0B1631] p-8 rounded-lg w-[900px]">

                {/*Titulo Barra Icono*/}
                <div className="flex">
                <h2 className="text-2xl text-white font-semibold mb-4">Cotizaciones</h2>
                {/*Icono barra*/}
                <div  className="relative">
                    <span className="absolute ml-5 top-[16] inset-y-1/2 left-3 items-center text-[#949494]">
                        <FaSearch />
                    </span>
                </div>
                {/*Barra busqueda historial*/}
                <input 
                type="text"
                placeholder="Buscar"
                className="ml-5 pl-10 px-3 py-1 border rounded-md bg-white border-[#DFDFDF] w-[570]"/>
                </div>

                {/*Tablas*/}
                <div className="flex my-4">

                    <div className="center w-[900]">
                        
                        <table className=" w-full text-left border border-gray-300 rounded-md">
                            <thead>
                                <tr className="text-center bg-gray-100">
                                    <th className="border-t p-2">ID</th>
                                    <th className="border-t p-2">Nombre</th>
                                    <th className="border-t p-2">Fecha</th>
                                    <th className="border-t p-2">Cantidad</th>
                                    <th className="border-t p-2">Total</th>
                                    <th className="border-t p-2">Estado</th>
                                    <th className="border-t p-2">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {seleccionada ? (
                                    <tr className="text-center bg-white">
                                    <td className="border-t p-2">{seleccionada.id}</td>
                                    <td className="border-t p-2">{seleccionada.nombre}</td>
                                    <td className="border-t p-2">{seleccionada.fecha_crea}</td>
                                    <td className="border-t p-2">{seleccionada.total_items}</td>
                                    <td className="border-t p-2">${seleccionada.total_precio}</td>
                                    <td className="border-t p-2">{seleccionada.estado}</td>
                                    <td className="border-t p-2"></td>
                                    </tr>
                                ) : (
                                    <tr className="text-center bg-white">
                                    <td colSpan={7} className="border-t p-2 text-gray-400">
                                        No hay cotizaciones
                                    </td>
                                    </tr>
                                )}
                            </tbody>        
                        </table>  
                            <button
                                className="ml-167 mt-5 px-17 py-2 border border-white bg-[#0B1631] text-white rounded hover:bg-[#15295C] cursor-pointer"
                                onClick={() => setMostrarModal_His(false)}
                            >
                                Salir
                            </button>                        
                    </div>
                </div>
              </div>
            </div>
            )}
            
            {/*Boton añadir cliente*/}
            {AñadirCliente && (
            <div className="fixed inset-0 flex justify-center items-center">
            <div className="bg-[#0B1631] p-8 rounded-lg w-[380px]">
                {/*Titulo*/}
                <h2 className="text-3xl text-white font-semibold mb-2">Cliente</h2>

                {/*Titulos con flex y boton*/}
                <div className="font-bold text-white text-xl my-2">
                    <p className="ml-1 mb-1 mt-2">Datos cliente</p>
                    {/*Botón agregar otra dirección*/}
                </div>

                {/*Dos tablas con flex*/}
                <div className="flex justify-center mb-5">

                    {/*Tabla uno*/}
                    <div className="rounded bg-white w-[300]">
                        <p className="ml-3 mb-1 mt-2 font-bold">Nombre</p>
                        <input
                            type="text"
                            value={nuevoCliente.nombre}
                            onChange={(e) => { const soloLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/;
                            if (soloLetras.test(e.target.value)) setNuevoCliente({...nuevoCliente, nombre: e.target.value})}}
                            placeholder="ej: Nicolás Jiménez"
                            className="ml-2 mb-2 border rounded-sm border-[#DFDFDF] px-3 py-1 w-[240]"
                        ></input> 

                        <p className="ml-3 mb-1 font-bold">Rut</p>
                        <input
                            type="text"
                            value={nuevoCliente.rut}
                            onChange={(e) => { const restriccion_rut = /^[0-9.\-kK]*$/;                              
                            if (restriccion_rut.test(e.target.value)) { setNuevoCliente({...nuevoCliente, rut: e.target.value})}}}
                            placeholder="ej: 12345678-9"
                            className="ml-2 mb-2 border rounded-sm border-[#DFDFDF] px-3 py-1 w-[240]"
                        ></input>  

                        <p className="ml-3 mb-1 mt-1 font-bold">Tipo de cliente</p>
                        <select
                        value={nuevoCliente.tipo_id}
                        onChange={(e) => setNuevoCliente({...nuevoCliente, tipo_id: parseInt(e.target.value)})}
                        className="ml-3 mb-1 px-2 py-1 text-black rounded"
                    >
                        
                        <option value={1}>Persona</option>
                        <option value={2}>Empresa</option>
                         </select>

                        <p className="ml-3 mb-1 mt-1 font-bold">Teléfono</p>
                        <input
                            type="text"
                            value={nuevoCliente.telefono}
                            onChange={(e) => {const soloNumeros = /^[0-9]*$/;
                            if (soloNumeros.test(e.target.value)) {setNuevoCliente({...nuevoCliente, telefono: e.target.value})}}}
                            placeholder="ej: 912345678"
                            className="ml-2 mb-2 border rounded-sm border-[#DFDFDF] px-3 py-1 w-[240]"
                        ></input>  

                        <p className="ml-3 mb-1 mt-1 font-bold">Email</p>
                        <input
                            type="email"
                            value={nuevoCliente.email}
                            onChange={(e) => setNuevoCliente({...nuevoCliente, email: e.target.value})}
                            placeholder="ej: nicolas@correo.cl"
                            className="ml-2 mb-2 border rounded-sm border-[#DFDFDF] px-3 py-1 w-[240]"
                        ></input>  

                    </div>
                </div>

                {/*Botones Cancelar y guardar*/}
                <div className="flex justify-center">
                <button
                    className="px-12 py-2 border border-white bg-[#0B1631] text-white rounded hover:bg-[#15295C] cursor-pointer"
                    onClick={() => setAñadirCliente(false)}
                >
                    Cancelar
                </button>
                <button
                    className="px-12 py-2 ml-3 bg-[#F59243] text-white rounded hover:bg-[#FFB04A] cursor-pointer"
                    onClick={guardarCliente}>
                    Guardar
                </button>
                </div>
            </div>
            </div>
            )}

            {/*Modal Boton Ver detalle */}
            {mostrarModal && (
            <div className="fixed inset-0 flex justify-center items-center">
            <div className="bg-[#0B1631] p-8 rounded-lg w-[650px]">

                {/*Titulo*/}
                <div className='flex justify-center'>
                    <h2 className="text-2xl text-white font-semibold mb-4">Detalles del Cliente</h2>
                    <h2 className="text-2xl text-white font-semibold mb-4 ml-19">Direcciones Cliente</h2>
                    <button className="w-7 h-7 ml-2 items-center gap-3 text-white rounded-full justify-center 
                    text-xl font-bold bg-[#4CAF50] hover:bg-[#3E8F41] cursor-pointer"
                    onClick={() => []}>
                    +
                    </button>
                </div>


                {/*Dos tablas con flex*/}
                
                <div className="flex my-4 justify-center">

                    {seleccionada ? (
                        
                    <div className="rounded bg-white w-[300px] h-[380]">

                        <div className="flex border-b border-[#949494]">
                        <p className="text-lg ml-3 mb-4 mt-3 font-bold">Nombre:</p>
                        <p className="text-base ml-2 mt-4 " >{seleccionada.cliente.nombre}</p>    
                        </div>

                        <div className="flex border-b border-[#949494] mt-2">
                        <p className="text-lg ml-3 mb-1 mt-3 font-bold">Teléfono:</p>
                        <p className="text-base ml-2 mt-4" >{seleccionada.cliente.telefono}</p>    
                        </div>

                        <div className="flex border-b border-[#949494] mt-2">
                        <p className="text-lg ml-3 mb-1 mt-3 font-bold">Email:</p>
                        <p className="text-base ml-2 mt-4" >{seleccionada.cliente.email}</p>    
                        </div>

                        <div className="flex border-b border-[#949494] mt-2">
                        <p className="text-lg ml-3 mb-1 mt-3 font-bold">Rut:</p>
                        <p className="text-base ml-2 mt-4" >{seleccionada.cliente.rut}</p>    
                        </div>

                        <div className="flex border-b border-[#949494] mt-2">
                        <p className="text-lg ml-3 mb-1 mt-3 font-bold">Razón Social:</p>
                        <p className="text-base ml-2 mt-4" >{seleccionada.cliente.razon_social}</p>    
                        </div>

                    </div>
                    ) : null}
                
                    {/*Tabla dos*/}
                    {seleccionada ? (
                        
                    <div className="ml-5 rounded bg-white w-[300px] h-[380]">

                        <div className="flex border-b border-[#949494]">
                        <p className="text-lg ml-3 mb-4 mt-3 font-bold">Nombre:</p>
                        <p className="text-base ml-2 mt-4 " >{seleccionada.cliente.nombre}</p>    
                        </div>

                        <div className="flex border-b border-[#949494] mt-2">
                        <p className="text-lg ml-3 mb-1 mt-3 font-bold">Teléfono:</p>
                        <p className="text-base ml-2 mt-4" >{seleccionada.cliente.telefono}</p>    
                        </div>

                        <div className="flex border-b border-[#949494] mt-2">
                        <p className="text-lg ml-3 mb-1 mt-3 font-bold">Email:</p>
                        <p className="text-base ml-2 mt-4" >{seleccionada.cliente.email}</p>    
                        </div>

                        <div className="flex border-b border-[#949494] mt-2">
                        <p className="text-lg ml-3 mb-1 mt-3 font-bold">Rut:</p>
                        <p className="text-base ml-2 mt-4" >{seleccionada.cliente.rut}</p>    
                        </div>

                        <div className="flex border-b border-[#949494] mt-2">
                        <p className="text-lg ml-3 mb-1 mt-3 font-bold">Razón Social:</p>
                        <p className="text-base ml-2 mt-4" >{seleccionada.cliente.razon_social}</p>    
                        </div>

                    </div>
                    ) : null}
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
                <ul className="border rounded w-[420] max-h-[50] overflow-y-auto">
                    {cotizacionesFiltradas.map((coti, index) => (
                    <li 
                        key={index} 
                        className="p-2 border-b hover:bg-gray-50 cursor-pointer" 
                        onClick={() => {
                            setSeleccionada(coti);
                            setBusqueda("");
                        }}>
                        <div className="flex">
                        <h1>{coti.cliente?.nombre}</h1> <div className="ml-1 text-gray-500">({coti.cliente?.rut})</div></div>
                    </li>
                    ))}
                </ul>
            )}

            {/*Muestra los datos del cliente seleccionado*/}
            {seleccionada && (
                <div className="mt-4 ml-2">

                    <div className="text-xl font-bold text-black">
                        {seleccionada.cliente.nombre}
                    </div>

                    <div className="flex my-2 text-base text-black">
                        <p>Rut:{seleccionada.cliente.rut}</p>
                        
                        <p className="ml-8">{seleccionada.cliente.email}</p>
                    </div>

                </div>
            )}

            {/*Botones*/}
            <div className="flex justify-end mt-7">

                <button className="box-shadow px-3 py-1 mr-4 text-white rounded bg-[#F59243] hover:bg-[#E6893F] cursor-pointer"
                onClick={() => setMostrarModal_His(true)}>
                Ver historial
                </button>

                <button className="box-shadow px-3 py-1 text-white rounded bg-[#2563B6] hover:bg-[#1F5399] cursor-pointer"
                onClick={() => setMostrarModal(true)}>
                Ver detalle
                </button>

            </div>

            </div>
        </div>
    );
}
