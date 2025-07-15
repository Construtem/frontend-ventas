'use client'

import { useState } from "react";

export default function Vendedor() {

const [tiendaSeleccionada, setTiendaSeleccionada] = useState("Tienda A");

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
                        className="ml-3 mb-1 px-2 py-1 text-black rounded"
                    >
                        <option value="Tienda A">Nombre tienda</option>
                        <option value="Tienda B">Tienda A</option>
                        <option value="Tienda B">Tienda B</option>
                    </select>
                </div>

            </div>
            
        </div>
    );
}
