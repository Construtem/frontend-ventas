'use client'
/*
import { FaSearch } from "react-icons/fa";
import { useEffect, useState } from 'react';


export default function Cliente() {
    const apiVentasUrl = process.env.NEXT_PUBLIC_API_VENTAS || "https://api-ventas.tssw.cl";
    const [mostrarModal, setMostrarModal] = useState(false);
    const [MostrarModal_His, setMostrarModal_His] =useState(false);
    const [AñadirCliente, setAñadirCliente] = useState(false);
    const [cotizaciones, setCotizaciones] = useState<Cotizacion[]>([]);
    const [seleccionada, setSeleccionada] = useState<Cotizacion | null>(null);
    const [busqueda, setBusqueda] = useState("");
    const [NumeroID, SetNumeroID] = useState("Seleccione id");


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
            razon_social: string
        },
        items: string,
        total_items: number,
        total_precio: number
    }


const [nuevoCliente, setNuevoCliente] = useState({
    nombre: "",
    telefono: "",
    email: "",
    razon_social: "",
    rut: "",
    tipo_id: "",
});

const guardarCliente = async () => {
  // Validaciones básicas antes de guardar
  if (
    !nuevoCliente.nombre.trim() ||
    !nuevoCliente.rut.match(/^\d{1,2}\.?\d{3}\.?\d{3}-[\dkK]$/) ||
    !nuevoCliente.email.includes("@") ||
    nuevoCliente.telefono.length > 8
  ) {
    alert("Completa correctamente los campos obligatorios");
    return;
  }

  try {
    const response = await fetch(`${apiVentasUrl}/api/clientes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(nuevoCliente),
    });

    if (!response.ok) {
      throw new Error("Error al guardar el cliente");
    }

    const clienteGuardado = await response.json();
    console.log("Cliente guardado:", clienteGuardado);
    alert("Cliente guardado exitosamente");

    setAñadirCliente(false);
    setNuevoCliente({
      nombre: "",
      telefono: "",
      email: "",
      razon_social: "",
      rut: "",
      tipo_id: "",
    });
  } catch (error) {
    console.error("Error al guardar:", error);
    alert("No se pudo guardar el cliente");
  }
};

    useEffect(() => {
    fetch(`${apiVentasUrl}/api/cotizaciones`)
        .then((res) => res.json())
        .then((data) => {
        setCotizaciones(data);
        })
        .catch((error) => {
            console.error("Error fetching cotizaciones:", error);
        });
    }, [`${apiVentasUrl}/api/cotizaciones`]);


    const cotizacionesFiltradas = cotizaciones.filter((coti) => {
    const termino = busqueda.toLowerCase();
    return (
        coti.cliente?.nombre.toLowerCase().includes(termino) ||
        coti.cliente?.rut.toLowerCase().includes(termino)
    );
    });

    useEffect(() => {
    fetch(`${apiVentasUrl}/api/cotizaciones`)
        .then((res) => res.json())
        .then((data) => {
        setCotizaciones(data);
        })
        .catch((error) => {
            console.error("Error fetching cotizaciones:", error);
        });
    }, [`${apiVentasUrl}/api/cotizaciones`]);

    return (
        <div className="bg-white border border-gray-300 p-4 mx-auto rounded-lg w-[500px] ml-30 mb-4">

            <div className="ml-3">
            <div className="text-2xl font-bold text-black flex gap-2 mb-2">
                Seleccionar cliente
            </div>
            {MostrarModal_His && (
            <div className="fixed inset-0 flex justify-center items-center">
              <div className="bg-[#0B1631] p-8 rounded-lg w-[900px]">

                <div className="flex">
                <h2 className="text-2xl text-white font-semibold mb-4">Cotizaciones</h2>
                <div  className="relative">
                    <span className="absolute ml-5 top-[16] inset-y-1/2 left-3 items-center text-[#949494]">
                        <FaSearch />
                    </span>
                </div>
                <input
                type="text"
                placeholder="Buscar"
                className="ml-5 pl-10 px-3 py-1 border rounded-md bg-white border-[#DFDFDF] w-[570]"/>
                </div>

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
                                    <td className="border-t p-2">{new Date(seleccionada.fecha_crea).toLocaleDateString()}</td>
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

            {AñadirCliente && (
            <div className="fixed inset-0 flex justify-center items-center">
            <div className="bg-[#0B1631] p-8 rounded-lg w-[600px]">
                <h2 className="text-3xl text-white font-semibold mb-2">Cliente</h2>

                <div className="flex font-bold text-white text-xl my-2">
                    <p className="ml-1 mb-1 mt-2">Datos cliente</p>
                    <p className="ml-37 mb-1 mt-2">Direcciones</p>
                    <button className="w-7 h-7 mt-2 ml-2 items-center gap-3 text-white rounded-full justify-center
                            text-xl font-bold bg-[#4CAF50] hover:bg-[#3E8F41] cursor-pointer"
                            onClick={() => []}>
                    +
                    </button>
                </div>

                <div className="flex justify-center mb-5">

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
                            placeholder="ej: 12.345.678-9"
                            className="ml-2 mb-2 border rounded-sm border-[#DFDFDF] px-3 py-1 w-[240]"
                        ></input>

                        <p className="ml-3 mb-1 mt-1 font-bold">Tipo de cliente</p>
                        <select
                        value={NumeroID}
                        onChange={(e) => SetNumeroID(e.target.value)}
                        className="ml-3 mb-1 px-2 py-1 text-black rounded"
                    >

                        <option value="PorDefecto">Persona</option>
                        <option value="ID1">1</option>
                        <option value="ID2">2</option>
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
                    <div className="ml-4 rounded bg-white w-[300]">

                        <p className="ml-3 mb-1 mt-2 font-bold">Nombre</p>
                        <input
                            type="text"
                            onChange={() => []}
                            placeholder="ej: Casa"
                            className="ml-2 mb-2 border rounded-sm border-[#DFDFDF] px-3 py-1 w-[240]"
                        ></input>

                        <p className="ml-3 mb-1 mt-1 font-bold">Dirección principal</p>
                        <input
                            type="text"
                            onChange={() => []}
                            placeholder="ej: calle #1234"
                            className="ml-2 mb-2 border rounded-sm border-[#DFDFDF] px-3 py-1 w-[240]"
                        ></input>

                        <p className="ml-3 mb-1 mt-1 font-bold">Comuna</p>
                        <input
                            type="text"
                            onChange={() => []}
                            placeholder="ej: Maipú"
                            className="ml-2 mb-2 border rounded-sm border-[#DFDFDF] px-3 py-1 w-[240]"
                        ></input>

                        <p className="ml-3 mb-1 mt-1 font-bold">Ciudad</p>
                        <input
                            type="text"
                            onChange={() => []}
                            placeholder="ej: Santiago"
                            className="ml-2 mb-2 border rounded-sm border-[#DFDFDF] px-3 py-1 w-[240]"
                        ></input>

                        <p className="ml-3 mb-1 mt-1 font-bold">País</p>
                        <input
                            type="text"
                            onChange={() => []}
                            placeholder="ej: Chile"
                            className="ml-2 mb-2 border rounded-sm border-[#DFDFDF] px-3 py-1 w-[240]"
                        ></input>

                    </div>
                </div>
                <div className="flex justify-end">
                <button
                    className="px-25 py-2 border border-white bg-[#0B1631] text-white rounded hover:bg-[#15295C] cursor-pointer"
                    onClick={() => setAñadirCliente(false)}
                >
                    Cancelar
                </button>
                <button
                    className="px-25 py-2 ml-3 bg-[#F59243] text-white rounded hover:bg-[#FFB04A] cursor-pointer"
                    onClick={guardarCliente}>
                    Guardar
                </button>
                </div>
            </div>
            </div>
            )}

            {mostrarModal && (
            <div className="fixed inset-0 flex justify-center items-center">
            <div className="bg-[#0B1631] p-8 rounded-lg w-[650px]">

                <h2 className="text-2xl text-white font-semibold mb-4">Detalle cotización</h2>

                <div className="flex my-4">

                    <div className="rounded bg-white w-[325]">

                    <p className="ml-3 mb-1 mt-2 font-bold">Nombre</p>
                        <input
                            type="text"
                            onChange={() => {}}
                            placeholder="Nombre cotización"
                            className="ml-2 mb-2 border rounded-sm border-[#DFDFDF] px-3 py-1 w-[290]"
                        ></input>

                    <p className="ml-3 mb-1 font-bold">Id</p>
                        <input
                            type="text"
                            onChange={() => {}}
                            placeholder="Calle #1234"
                            className="ml-2 mb-2 border rounded-sm border-[#DFDFDF] px-3 py-1 w-[290]"
                        ></input>

                    <p className="ml-3 mb-1 font-bold">Descripción</p>
                        <input
                            type="text"
                            onChange={() => {}}
                            placeholder="Añada una descripción"
                            className="ml-2 mb-2 border rounded-sm border-[#DFDFDF] px-3 py-1 w-[290]"
                        ></input>

                    <div className="flex">
                     <p className="ml-3 mb-1 font-bold">Fecha creación</p>
                     <p className="ml-11 mb-1 font-bold">Vigencia</p>
                     </div>
                    <div className="flex">

                        <input
                            type="date"
                            onChange={() => {}}
                            className="ml-2 mb-2 border rounded-sm border-[#DFDFDF] px-3 py-1 w-[150]"
                        ></input>

                        <input
                            type="text"
                            onChange={() => {}}
                            placeholder="Santiago"
                            className="ml-2 mb-2 border rounded-sm border-[#DFDFDF] px-3 py-1 w-[131]"
                        ></input>
                    </div>

                    <p className="ml-3 mb-1 font-bold">Dirección destino</p>
                        <input
                            type="text"
                            onChange={() => {}}
                            placeholder="Dirección"
                            className="ml-2 mb-2 border rounded-sm border-[#DFDFDF] px-3 py-1 w-[290]"
                        ></input>

                    <p className="ml-3 mb-1 font-bold">Creado por</p>
                        <input
                            type="text"
                            onChange={() => {}}
                            placeholder="Vendedor nombre"
                            className="ml-2 mb-2 border rounded-sm border-[#DFDFDF] px-3 py-1 w-[290]"
                        ></input>

                    <p className="ml-3 mb-1 font-bold">Total</p>
                        <input
                            type="number"
                            onChange={() => {}}
                            placeholder="10000"
                            className="ml-2 mb-3 border rounded-sm border-[#DFDFDF] px-3 py-1 w-[290]"
                        ></input>

                    </div>


                    <div className="ml-4 rounded bg-white h-[380] w-[269]">

                    <p className="mt-2 ml-2 mb-1 font-bold">Cliente</p>
                                            <input
                            type="text"
                            onChange={() => {}}
                            placeholder="Cliente"
                            className="ml-2 mb-2 border rounded-sm border-[#DFDFDF] px-3 py-1 w-[240]"
                        ></input>

                    <p className="ml-2 mb-1 font-bold">Email</p>
                                            <input
                            type="email"
                            onChange={() => {}}
                            placeholder="Email@Example.cl"
                            className="ml-2 mb-2 border rounded-sm border-[#DFDFDF] px-3 py-1 w-[240]"
                        ></input>

                    <p className="ml-2 mb-1 font-bold">Teléfono</p>
                                            <input
                            type="email"
                            onChange={() => {}}
                            placeholder="+56912345678"
                            className="ml-2 mb-2 border rounded-sm border-[#DFDFDF] px-3 py-1 w-[240]"
                        ></input>

                    <p className="ml-2 mb-1 font-bold">Tipo cliente</p>
                                            <input
                            type="email"
                            onChange={() => {}}
                            placeholder="tipo"
                            className="ml-2 mb-2 border rounded-sm border-[#DFDFDF] px-3 py-1 w-[240]"
                        ></input>

                    <button className="my-2 ml-2 px-16 py-4 mr-2 text-2xl text-black font-bold rounded bg-[#F1F6EF]">
                        Aprobada
                    </button>

                    </div>

                </div>

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
                <div  className="relative">
                    <span className="absolute top-[16] inset-y-1/2 left-3 flex items-center text-[#949494]">
                        <FaSearch />
                    </span>
                </div>
                <input
                    type="text"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    placeholder="Buscar"
                    className="border rounded-sm border-[#DFDFDF] pl-10 px-3 py-1 w-[420]"
                >
                </input>
                <div>

                <button className="w-7 h-7 ml-2 items-center gap-3 text-white rounded-full justify-center
                                   text-xl font-bold bg-[#4CAF50] hover:bg-[#3E8F41] cursor-pointer"
                                   onClick={() => setAñadirCliente(true)}>
                    +
                </button>
                </div>
            </div>

            {busqueda.trim() !== "" && (
                <ul className="border rounded w-[420]">
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

            {seleccionada && (
                <div className="mt-4 ml-2">

                    <div className="text-xl font-bold text-black">
                        {seleccionada.cliente.nombre}
                    </div>

                    <div className="flex my-2 text-base text-black">
                        <p>Rut:{seleccionada.cliente.rut}</p>
                        <p className="ml-8">Tipo Cliente</p>
                        <p className="ml-8">{seleccionada.cliente.email}</p>
                    </div>

                </div>
            )}

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


*/
import {CiUser } from "react-icons/ci";
import { useCotizacionFlow } from '@/contexts/CotizacionFlow'
import { useQuery } from '@tanstack/react-query'
import { clienteService, Cliente as ClienteType } from '@/services/apiService'
import {useMemo, useState} from "react";
import Modal from "@/components/Modal/Modal";
import {ClienteModal} from "@/components/Modal/ClienteModal";

export default function Cliente() {
    const { state, dispatch } = useCotizacionFlow()
    const sucursalId = state.sucursalId
    const [showCliente, setShowCliente] = useState(false)

    const {
        data: clientes = [],
    } = useQuery<ClienteType[]>({
        queryKey: ['clientes'],
        queryFn:    clienteService.obtenerClientes,
        enabled:    !!sucursalId,
    })

    const [search, setSearch] = useState('')
    const clientesFiltrados = useMemo(() => {
        const termino = search.trim().toLowerCase()
        if (!termino) return []
        return clientes.filter(c =>
            c.nombre.toLowerCase().includes(termino) ||
            c.rut.toLowerCase().includes(termino)
        )
    }, [search, clientes])

    const clienteSeleccionado = clientes.find(
        c => c.rut === state.clienteRut
    )

    return (
        <div className="bg-white px-[40px] py-[10px] rounded-[10px]
                      shadow-[0_0_2px_rgba(0,0,0,0.25)] flex flex-col gap-[20px] flex flex-col gap-[20px] min-h-[404px] min-w-[504px]">
            <div className="flex w-full gap-[10px] flex-col">
                <h2 className={"font-semibold font-montserrat text-[24px]"}>
                    Seleccionar cliente
                </h2>
                <div className="flex items-center w-full gap-[10px]">

                {/* WRAPPER RELATIVE */}
                <div className="relative flex items-center rounded-[10px]
                        px-4 py-2 w-full border-[#E2E2E2] shadow-sm">
                    {/* Icono lupa */}
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1116.65
                 6.65a7.5 7.5 0 010 10.6z"
                        />
                    </svg>

                    {/* Input de búsqueda */}
                    <input
                        type="text"
                        placeholder="Nombre o RUT"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="outline-none w-full placeholder-gray-500 text-gray-800"
                    />

                    {/* Desplegable de sugerencias */}
                    {search.trim() !== '' && (
                        <ul
                            className="absolute top-full left-0 right-0
                         w-full bg-white border border-[#E2E2E2]
                         rounded-lg shadow-lg max-h-60 overflow-y-auto z-10"
                        >
                            {clientesFiltrados.length > 0 ? (
                                clientesFiltrados.map((c) => (
                                    <li
                                        key={c.rut}
                                        onClick={() => {
                                            dispatch({type: 'SET_CLIENT', payload: c.rut})
                                            setSearch('')
                                        }}
                                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer
                               flex justify-between"
                                    >
                                        <span className="font-medium">{c.nombre}</span>
                                        <span className="text-sm text-gray-500">({c.rut})</span>
                                    </li>
                                ))
                            ) : (
                                <li className="p-4 text-center text-gray-500">
                                    No se encontraron clientes
                                </li>
                            )}
                        </ul>
                    )}
                </div>
            </div>
            </div>
            {clienteSeleccionado ? (

                    <div className="flex flex-col gap-[20px]">
                        <h2 className="text-[24px] font-semibold">{clienteSeleccionado.nombre}</h2>
                    <div className="flex gap-[20px]">
                        <p className={"font-medium font-montserrat"}>RUT: {clienteSeleccionado.rut}</p>
                        <p className={"font-medium font-montserrat"}>Tipo: {clienteSeleccionado.tipo_id===1?'Persona':'Empresa'}</p>
                        <p className={"font-medium font-montserrat"}>{clienteSeleccionado.email ?? '—'}</p>
                    </div>
                        <div className="flex gap-[20px] justify-between">
                            <button onClick={() => setShowCliente(true)}
                                className={'bg-[#2563B6] font-bold text-white p-[12px] rounded-[6px] shadow-[0_1px_3px_0.4px_rgba(0,0,0,0.25)] cursor-pointer hover:bg-[#2a74d9]'}>Crear Nuevo Cliente
                            </button>
                            <ClienteModal isOpen={showCliente} onClose={() => setShowCliente(false)} />
                            <button
                                className={'bg-[#F59243] font-bold text-white p-[12px] rounded-[6px] shadow-[0_1px_3px_0.4px_rgba(0,0,0,0.25)] cursor-pointer hover:bg-[#ed8f43]'}>Ver
                                Historial
                            </button>
                            <button
                                className={'bg-teal-500 font-bold text-white p-[12px] rounded-[6px] shadow-[0_1px_3px_0.4px_rgba(0,0,0,0.25)] cursor-pointer hover:bg-teal-550'}>Ver
                                Detalles
                            </button>
                        </div>

                    </div>
                ) :
                (

                    <div className="flex flex-col items-center justify-center w-full h-full p-8 text-center">
                        <CiUser className="w-16 h-16 text-gray-300 mb-4"/>
                        <h2 className="text-2xl font-semibold font-montserrat text-[24px] my-[2px]">
                            Ningún cliente seleccionado
                        </h2>
                        <p className="text-gray-500 mb-4">
                            Usa el buscador para encontrar un cliente existente<br/>
                            o crea uno nuevo haciendo clic en el botón.
                        </p>
                        <button onClick={() => setShowCliente(true)}
                            className={'bg-[#2563B6] font-bold text-white p-[12px] rounded-[6px] shadow-[0_1px_3px_0.4px_rgba(0,0,0,0.25)] cursor-pointer hover:bg-[#2a74d9]'}>Crear Nuevo
                            Cliente
                        </button>
                        <ClienteModal isOpen={showCliente} onClose={() => setShowCliente(false)} />
                    </div>

                )

            }
        </div>
    )
}