import { FaSpinner } from "react-icons/fa";



export default function LoaderCotizacion({label = "Cargando cotización..."}) {
    return (
        <div className="flex flex-col items-center justify-center py-10 text-center text-white animate-pulse">
            <FaSpinner className="animate-spin text-3xl mb-4 text-blue-400" />
            <p className="text-lg font-medium text-black">Cargando {label}</p>
            <p className="text-sm text-gray-400">Por favor espera unos segundos</p>
        </div>
    );
}
