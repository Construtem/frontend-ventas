'use client';

import { useState, useEffect, useRef } from 'react';
import { FaCheck, FaClock, FaTimes } from 'react-icons/fa';
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io"; {/*flechas arriba y abajo*/}
import { CLIENTES_DEMO } from '@/mock/mockClients'; {/*Para buscar con la Barra*/}


/* ---------------------------------- */
/*  Dummy data */
/* ---------------------------------- */
interface Cotizacion {
    id: number;
    fecha: string;
    cliente: string;
    estado: 'Aprobada' | 'Pendiente' | 'Rechazada';
    total: string;
}

const data: Cotizacion[] = [
    { id: 1, fecha: '23/05/2025', cliente: 'Cliente A', estado: 'Aprobada',  total: '28.000 $' },
    { id: 2, fecha: '20/05/2025', cliente: 'Cliente C', estado: 'Pendiente', total: '22.300 $' },
    { id: 3, fecha: '16/05/2025', cliente: 'Cliente B', estado: 'Rechazada', total: '28.200 $' },
    { id: 4, fecha: '15/05/2025', cliente: 'Cliente A', estado: 'Aprobada',  total: '26.010 $' },
];

/* ---------------------------------- */
/*  Chips reutilizables */
/* ---------------------------------- */
const Chip = ({
                  icon,
                  title,
                  subtitle,
              }: {
    icon: React.ReactNode;
    title: string;
    subtitle: string;
}) => (
    <div className="flex items-start gap-3 min-w-[200px] p-4 border rounded-lg border-gray-200">
        <div className="w-10 h-10 flex items-center justify-center rounded-md bg-gray-100">{icon}</div>
        <div className="leading-4">
            <span className="font-semibold">{title}</span>
            <p className="text-sm text-gray-500">{subtitle}</p>
        </div>
    </div>
);

/* ---------------------------------- */
/*  Badge según estado */
/* ---------------------------------- */
const EstadoBadge = ({ estado }: { estado: Cotizacion['estado'] }) => {
    const variant = {
        Aprobada:  'bg-green-100 text-green-700',
        Pendiente: 'bg-yellow-100 text-yellow-700',
        Rechazada: 'bg-red-100 text-red-700',
    }[estado];

    return (
        <span className={`px-3 py-1 rounded-md text-xs font-semibold ${variant}`}>
      {estado}
    </span>
    );
};

/* ---------------------------------- */
/*  Page component */
/* ---------------------------------- */

export default function HistorialCotizaciones() {

    const [mostrarOrdenDesdeA, setMostrarMenu] = useState(false);                             {/*Para mostrar el menu                */}
    const [mostrarOrdenDesdeZ, setMostrarMenu2] = useState(false);                            {/*Para mostrar el menu                */}
    const [busqueda, setBusqueda] = useState('');                                             {/*Para guardar lo que el usuario busca*/}
    const [cotizacionesFiltradas, setCotizacionesFiltradas] = useState<Cotizacion[]>(data);   {/*Para ordenar las cotizaciones       */}
    const inputRef = useRef<HTMLInputElement | null>(null);                                   {/*Permite aceder al imput             */}
    const listaRef = useRef<(HTMLLIElement | null)[]>([]);                                    {/*Para permitir busqueda por flechas  */}
    const botonesRef = useRef<(HTMLButtonElement | null)[]>([]);                              {/*Para permitir busqueda por flechas  */}    

    const clientesFiltrados = CLIENTES_DEMO.filter((cliente) =>
    cliente.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    cliente.rut.toLowerCase().includes(busqueda.toLowerCase())
    );

    {/* Para que se muevan las flechas en los botones*/}
        const handleKeyDownBotones = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'ArrowRight') {                        {/*Cuando se presiona la flecha derecha  */}
        const next = botonesRef.current[index + 1];
        if (next) {
            next.focus();
            setMostrarMenu(false);                       {/*Para mostrar las opciones de los      */}
            setMostrarMenu2(false);                      {/*botones                               */}
        }
        e.preventDefault();                              {/*Cancela el comportamiento por defecto */}
    } else if (e.key === 'ArrowLeft') {                  {/*Cuando se presiona la flecha izquierda*/} 
        const prev = botonesRef.current[index - 1];
        if (prev) {
            prev.focus();
            setMostrarMenu(false);                       {/*Para mostrar las opciones de los      */}
            setMostrarMenu2(false);                      {/*botones                               */}
        } 
        else inputRef.current?.focus();                  {/*Cuando se presiona te dirige al input */}
        e.preventDefault();                              {/*Cancela el comportamiento por defecto */}
    } 
    else if (e.key === 'Escape') {                       {/*Cuando se presiona la tecla escape    */}
        inputRef.current?.focus();                       {/*Cuando se presiona te dirige al input */}
        e.preventDefault();                              {/*Cancela el comportamiento por defecto */}
    } else if (e.key === 'Enter') {                      {/*Cuando se presiona la tecla Enter     */}
        botonesRef.current[index]?.click();              {/*Que debe hacer cuando se presione     */}
        e.preventDefault();
    }
    };

    return (
        <main className="ml-[180px] mt-[70px] p-8 bg-gray-50 min-h-screen">
            <section className="bg-white rounded-xl shadow-sm p-8">
                {/* título */}
                <h1 className="text-3xl font-bold mb-8">Historial de Cotizaciones</h1>

                <div className="relative mb-9 flex justify-between items-start">

                    {/* Barrita de Busqueda */}
                    <div className="relative w-full max-w-300">
                        {/* Definición input barra busqueda */}
                        <input                                               
                        type="text" 
                        placeholder="Buscar por nombre o rut"                   
                        className="w-full px-4 py-2 rounded-md border "                 
                        value={busqueda}
                        ref={inputRef}
                        onChange={(e) => setBusqueda(e.target.value)}
                        onKeyDown={(e) => {
                        if (e.key === 'ArrowDown' && listaRef.current[0]) {      {/* Cuando se presiona la flecha hacia abajo     */}
                            listaRef.current[0].focus();                         {/* Busca en las busquedas de la barra           */}
                            e.preventDefault();                                  {/*Cancela el comportamiento por defecto */}
                        }
                        if (e.key === 'ArrowRight') {                            {/* Cuando se presiona la flecha hacia la derecha*/}
                            botonesRef.current[0]?.focus();                      {/* Se dirige a los botones                      */}
                            e.preventDefault();                                  {/*Cancela el comportamiento por defecto         */}
                        }
                        if (e.key === 'Tab' || e.key === 'Escape') {             {/*Cuando se presiona Tab o Escape se borra      */}
                        setBusqueda('');    
                            }
                        }}
                    />

                    {/* Ventana de Busqueda */}
                    { busqueda && (
                        <ul className="max-h-60 overflow-y-auto absolute mt-0.4 z-10 max-h-60 bg-white text-sm rounded-m shadow-md w-full border ">
                        {/* Clientes filtrados */}    
                        {clientesFiltrados.length > 0 ? (clientesFiltrados.map((cliente, index) => (
                        <li
                            key={cliente.id}                            
                            ref={(el) => (listaRef.current[index] = el)}
                            tabIndex={0}

                        
                            onClick={() => {                       {/* Para verificar si funciona porque no hay base de datos aún, manda un mensaje de alerta */}
                                alert(`Prueba funciona click: ${cliente.nombre} (${cliente.rut})`);     {/* El mensaje muestra el nombre y el rut del cliente */}
                                setBusqueda(cliente.rut);                                               {/* como es una prueba no se usan otros datos         */}
                                                                                                        {/* Funciona con click                                */}
                            }}

                            className="px-3 py-2 hover:bg-gray-100 cursor-pointer focus:bg-gray-200 outline-none"
                            onKeyDown={(e) => {
                                if (e.key === 'ArrowDown') {                    {/* Cuando se presiona la flecha hacia abajo  */}
                                const next = listaRef.current[index + 1];
                                if (next) next.focus();
                                e.preventDefault();                             {/*Cancela el comportamiento por defecto      */}
                                } else if (e.key === 'ArrowUp') {               {/* Cuando se presiona la flecha hacia arriba */}
                                if (index === 0) {
                                    inputRef.current?.focus();                  {/*Cuando se presiona te dirige al input      */}
                                } else {
                                    const prev = listaRef.current[index - 1];
                                    if (prev) prev.focus();
                                }
                                e.preventDefault();
                                
                                } else if (e.key === 'Enter') {   {/* Para verificar si funciona porque no hay base de datos aún, manda un mensaje de alerta */}    
                                alert(`Prueba funciona enter: ${cliente.nombre} (${cliente.rut})`);    {/* El mensaje muestra el nombre y el rut del cliente */}
                                setBusqueda(cliente.rut);                                              {/* como es una prueba no se usan otros datos         */}                 
                                }                                                                      {/* Funciona con Enter                                */}
                                
                            }}
                        > {/* Lo que muestra la barra de busqueda usando el mockClients*/}
                        <span className="font-medium">{cliente.nombre}</span>{' '}
                        <span className="text-gray-500 text-xs">({cliente.rut})</span>
                        <span className="font-medium text-gray-500 text-xs"> Numero de boleta </span>
                    </li>
                    ))) : ( 
                    <li className="px-4 py-2 text-gray-500 italic">No se encontraron resultados</li>
                    )}  {/* Lo que muestra la barra de busqueda cuando no encuentra nada usando el mockClients*/}
                    </ul>
                    )}
                </div>

                {/* Botones orden */}
                <div className="flex gap-1">

                        {/* Botones flecha arriba */}
                        <button
                            ref={(el) => (botonesRef.current[0] = el)}
                            tabIndex={0}
                            onClick={() => { setMostrarMenu(!mostrarOrdenDesdeA); }}  
                            onKeyDown={(e) => handleKeyDownBotones(e, 0)}
                            className="ml-2 p-2 rounded-md border border-gray-400 hover:bg-gray-100 transition"
                        >
                            <IoIosArrowUp size={14} />
                        </button>
                        
                        {/* Botones flecha abajo  */}
                        <button
                            ref={(el) => (botonesRef.current[1] = el)}
                            tabIndex={1}
                            onKeyDown={(e) => handleKeyDownBotones(e, 1)} 
                            onClick={() => {setMostrarMenu2(!mostrarOrdenDesdeZ)}}
                            className=" ml-1 p-2 rounded-md border border-gray-400 hover:bg-gray-100 transition"    
                        >
                            <IoIosArrowDown size={14} />
                            
                        </button>
 
                        {/* Orden primer boton */}
                        {mostrarOrdenDesdeA && (
                        <div className=" text-[14px] absolute ml-1  mt-11 w-37 bg-white border border-gray-200 rounded shadow-md z-5">
                            <button
                                onClick={() => { {/* Ordena las fechas*/}
                                    const ordenado = [...cotizacionesFiltradas].sort((a, b) =>
                                    b.fecha.localeCompare(a.fecha)
                                    );
                                    setCotizacionesFiltradas(ordenado);
                                    setMostrarMenu(false);
                                }}
                                onKeyDown={(e) => handleKeyDownBotones(e, 0)}
                                className=" w-full text-left px-2 py-1 hover:bg-gray-100"
                            >
                                Ordenar por Fecha
                            </button>

                            <button
                                onClick={() => {  {/* Ordena los precios*/}
                                    const ordenado = [...cotizacionesFiltradas].sort((a, b) =>
                                    b.total.localeCompare(a.total)
                                    );
                                    setCotizacionesFiltradas(ordenado); 
                                    setMostrarMenu(false);
                                }}
                                onKeyDown={(e) => handleKeyDownBotones(e, 1)} 
                                className=" w-full text-left px-2 py-1 hover:bg-gray-100"
                            >
                                Ordenar por Precio
                            </button>
                        </div>
                         )}

                        {/* Orden segundo boton */}
                         {mostrarOrdenDesdeZ && (
                        <div className=" text-[14px] absolute ml-1  mt-11 w-37 bg-white border border-gray-200 rounded shadow-md z-5">
                            <button
                                onClick={() => {  {/* Ordena las fechas*/}
                                    const ordenado = [...cotizacionesFiltradas].sort((a, b) =>
                                    a.fecha.localeCompare(b.fecha)
                                    );
                                    setCotizacionesFiltradas(ordenado);
                                    setMostrarMenu2(false);
                                }}
                                className=" w-full text-left px-2 py-1 hover:bg-gray-100"
                            >
                                Ordenar por Fecha
                            </button>

                            <button
                                onClick={() => {  {/* Ordena los precios*/}
                                    const ordenado = [...cotizacionesFiltradas].sort((a, b) =>
                                    a.total.localeCompare(b.total)
                                    );
                                    setCotizacionesFiltradas(ordenado);
                                    setMostrarMenu2(false);
                                }}
                                className=" w-full text-left px-2 py-1 hover:bg-gray-100"
                            >
                                Ordenar por Precio
                            </button>
                        </div>
                         )}

                </div>
    

            </div>  

                {/* chips */}
                <div className="flex gap-6 mb-10">
                    <Chip icon={<FaCheck  size={20} />} title="Cotizaciones" subtitle="aprobadas" />
                    <Chip icon={<FaClock size={20} />} title="Cotizaciones" subtitle="Pendientes" />
                    <Chip icon={<FaTimes size={20} />} title="Cotizaciones" subtitle="Rechazadas" />
                </div>

                {/* tabla */}
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead>
                        <tr className="bg-gray-100 text-gray-900 font-semibold">
                            <th className="px-6 py-3 text-left">Fecha</th>
                            <th className="px-6 py-3 text-left">Cliente</th>
                            <th className="px-6 py-3 text-left">Estado</th>
                            <th className="px-6 py-3 text-left">Total</th>
                        </tr>
                        </thead>

                        <tbody>
                        {cotizacionesFiltradas.map((c) => (
                            <tr key={c.id} className="border-b last:border-b-0">
                                <td className="px-6 py-4 border-b border-b-[1px] border-b-[#EDEFEE]">{c.fecha}</td>
                                <td className="px-6 py-4 border-b border-b-[1px] border-b-[#EDEFEE]">{c.cliente}</td>
                                <td className="px-6 py-4 border-b border-b-[1px] border-b-[#EDEFEE]">
                                    <EstadoBadge estado={c.estado} />
                                </td>
                                <td className="px-6 py-4 border-b border-b-[1px] border-b-[#EDEFEE]">{c.total}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </main>
    );
}
