'use client'

import { FaSearch } from "react-icons/fa";
import { useEffect, useState } from 'react';



                                                                                                                                   
export default function Cliente() {
    const [mostrarModal, setMostrarModal] = useState(false);
    const [MostrarModal_His, setMostrarModal_His] =useState(false);
    const [AñadirCliente, setAñadirCliente] = useState(false);
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [busqueda, setBusqueda] = useState("");

    useEffect(() => {
        fetch("http://localhost:8080/api/cotizaciones")
        .then((res) => res.json())
        .then((data) => {
            const clientesExtraídos = data.map((c: any) => c.cliente);
            setClientes(clientesExtraídos);
        });
    }, []);


    return (
        <div className="bg-white border border-gray-300 p-4 mx-auto rounded-lg w-[500px] ml-30 mb-4">
            
            <div className="ml-3">
            {/*Titulo: Seleccionar cliente*/}
            <div className="text-2xl font-bold text-black flex gap-2 mb-2">
                Seleccionar cliente
            </div>
        

            {/*Modal*/}
            {MostrarModal_His && (
            <div className="fixed inset-0 flex justify-center items-center">
            <div className="bg-[#0B1631] p-8 rounded-lg w-[600px]">
                <h2 className="text-2xl text-white font-semibold mb-4">Cotizaciones</h2>


                <div className="flex my-4">

                    <div className="rounded bg-white w-[250]">
                    <p className="mb-4">prueba</p>
                    </div>

                </div>


                <div className="flex justify-end">
                <button
                    className="px-17 py-2 border border-white bg-[#0B1631] text-white rounded hover:bg-[#15295C]"
                    onClick={() => setMostrarModal_His(false)}
                >
                    Salir
                </button>
                </div>

            </div>
            </div>
            )}
            

            {AñadirCliente && (
            <div className="fixed inset-0 flex justify-center items-center">
            <div className="bg-[#0B1631] p-8 rounded-lg w-[600px]">
                <h2 className="text-2xl text-white font-semibold mb-4">Cliente</h2>

                    <div className="rounded bg-white w-[200]">
                    <p className="mb-4">Nombre</p>
                    </div>

                <div className="flex justify-end">
                <button
                    className="px-17 py-2 border border-white bg-[#0B1631] text-white rounded hover:bg-[#15295C]"
                    onClick={() => setAñadirCliente(false)}
                >
                    Cancelar
                </button>
                 <button
                    className="px-17 py-2 ml-2 bg-[#F59243] text-white rounded hover:bg-[#FF9243]"
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
                <h2 className="text-2xl text-white font-semibold mb-4">Detalle cotización</h2>


                <div className="flex my-4">

                    <div className="rounded bg-white w-[325]">


                    <p className="ml-3 mb-1 mt-2">Nombre</p>
                        <input
                            type="text"
                            /*value={}*/
                            onChange={() => {}}
                            placeholder="Nombre cotización"
                            className="ml-2 mb-2 border rounded-sm border-[#DFDFDF] px-3 py-1 w-[290]"
                        ></input>      

                    <p className="ml-3 mb-1">Id</p>
                        <input
                            type="text"
                            /*value={}*/
                            onChange={() => {}}
                            placeholder="Calle #1234"
                            className="ml-2 mb-2 border rounded-sm border-[#DFDFDF] px-3 py-1 w-[290]"
                        ></input> 

                    <p className="ml-3 mb-1">Descripción</p>
                        <input
                            type="text"
                            /*value={}*/
                            onChange={() => {}}
                            placeholder="Añada una descripción"
                            className="ml-2 mb-2 border rounded-sm border-[#DFDFDF] px-3 py-1 w-[290]"
                        ></input> 
                    
                    <div className="flex">
                     <p className="ml-3 mb-1">Fecha creación</p>
                     <p className="ml-5 mb-1">Vigencia</p>
                     </div>
                    <div className="flex">
                       
                        <input
                            type="date"
                            /*value={}*/
                            onChange={() => {}}
                            className="ml-2 mb-2 border rounded-sm border-[#DFDFDF] px-3 py-1 w-[150]"
                        ></input> 

                        <input
                            type="text"
                            /*value={}*/
                            onChange={() => {}}
                            placeholder="Santiago"
                            className="ml-2 mb-2 border rounded-sm border-[#DFDFDF] px-3 py-1 w-[131]"
                        ></input> 
                    </div>

                    <p className="ml-3 mb-1">Dirección destino</p>
                        <input
                            type="text"
                            /*value={}*/
                            onChange={() => {}}
                            placeholder="Dirección"
                            className="ml-2 mb-2 border rounded-sm border-[#DFDFDF] px-3 py-1 w-[290]"
                        ></input> 

                    <p className="ml-3 mb-1">Creado por</p>
                        <input
                            type="text"
                            /*value={}*/
                            onChange={() => {}}
                            placeholder="Vendedor nombre"
                            className="ml-2 mb-2 border rounded-sm border-[#DFDFDF] px-3 py-1 w-[290]"
                        ></input> 

                    <p className="ml-3 mb-1">Total</p>
                        <input
                            type="number"
                            /*value={}*/
                            onChange={() => {}}
                            placeholder="10000"
                            className="ml-2 mb-3 border rounded-sm border-[#DFDFDF] px-3 py-1 w-[290]"
                        ></input> 

                    </div>

                    <div className="ml-4 rounded bg-white w-[269]">
                    <p className="mb-4">Cliente</p>
                    </div>

                </div>


                <div className="flex justify-end">
                <button
                    className="px-17 py-2 border border-white bg-[#0B1631] text-white rounded hover:bg-[#15295C]"
                    onClick={() => setMostrarModal(false)}
                >
                    Cancelar
                </button>
                 <button
                    className="px-17 py-2 ml-2 bg-[#F59243] text-white rounded hover:bg-[#FF9243]"
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
                    /*value={}*/
                    onChange={() => setBusqueda(e.target.value)}
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


                            {/*Para mostrar las opciones de la barra de busqueda*/}
                {busqueda.trim() !== "" && (
                <ul className="mt-2 border rounded max-h-30 overflow-y-auto">
                {clientes
                    .filter((c) =>
                    c.nombre.toLowerCase().includes(busqueda.toLowerCase())
                    )
                    .map((cliente) => (
                    <li key={cliente.rut} className="p-2 hover:bg-gray-100 cursor-pointer">
                        {cliente.nombre} - {cliente.rut}
                    </li>
                    ))}
                </ul>)}


            {/*Titulo: Nombre Cliente*/}
            <div className="mt-2 text-xl text-base text-black font-bold">
                Nombre Cliente
            </div>
            <div className="mt-4 ml-2 text-base text-black flex">
                Rut 12.345.678-9 Tipo cliente Correo@gmail.com
            </div>


            {/*Botones*/}
            <div className="flex justify-end mt-7">

                <button className="px-3 py-1 mr-4 text-white rounded bg-[#F59243] hover:bg-[#E6893F] cursor-pointer"
                onClick={() => setMostrarModal_His(true)}>
                Ver historial
                </button>

                <button className="px-3 py-1 text-white rounded bg-[#2563B6] hover:bg-[#1F5399] cursor-pointer"
                onClick={() => setMostrarModal(true)}>
                Ver detalle
                </button>

            </div>

            </div>
        </div>
    );
}
