'use client'

import { useEffect, useState } from 'react';

export default function Vendedor() {

const [tiendaSeleccionada, setTiendaSeleccionada] = useState("Nombre tienda");
const [sucursales, setSucursales] = useState<Sucursales[]>([]);


interface Sucursales{
        id: number,
        nombre: string,
        telefono: string,
        direccion: string,
        comuna: string,
        ciudad: string,
        tipo_id: number,
        tipo: {
            id: number,
            nombre: string,
        }, 
    }


useEffect (() => {
    const fetchSucursales = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/sucursales");
            if (!response.ok) throw new Error("Erro al obtener sucursales");
            const SucursalesData = await response.json();
            setSucursales(SucursalesData);
            console.log("Sucursales obtenidas: ", SucursalesData);
        }   catch (error) {
            console.error("Error al obtener sucursales: ", error)
        }
    };
    fetchSucursales();
}, []);


    return (
        <div className="bg-white border border-gray-300 p-4 mx-auto rounded-lg w-[500px] ml-30 mb-4">

            <div className="ml-3">

                <div className="text-lg font-bold text-black flex gap-2 mb-2">
                    Nombre Vendedor
                </div>

                <div className="ml-3 text-base text-black font-bold flex">
                    Rut 20.474.207-3 
                    
                    <select
                        value={tiendaSeleccionada}
                        onChange={(e) => setTiendaSeleccionada(e.target.value)}
                        className="ml-3 mb-1 px-2 py-1 text-black rounded-sm"
                    >
                        <option value="">Sucursales</option>
                        {sucursales.map((sucursal) => (
                            <option key={sucursal.id} value={sucursal.id}>
                                {sucursal.nombre} - {sucursal.ciudad}
                            </option>
                        ))}
                    </select>
                </div>

            </div>
            
        </div>
    );
}
