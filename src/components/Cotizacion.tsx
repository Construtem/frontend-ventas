'use client'

/*
export default function Cotizacion() {

    return (
        <div className="mb-4 ml-7 bg-white border border-gray-300 rounded-lg w-[770]">

            <div className="ml-8 mr-8">
            
                <div className="flex mt-3">

                    <div className="mb-2 text-lg text-[#5B83C5] font-bold flex gap-2">
                        Cotización #123456
                    </div>

                    <div className="ml-107">
                    <button className="px-3 py-1 mr-2 font-bold text-black rounded bg-[#F1F6EF]">
                        Aprobada
                    </button>
                    </div>

                </div>        

                <table className="w-full text-left">
                    <thead>
                        <tr className="">
                            <th className="border-t border-[#D1D5DC] p-2">Nombre</th>
                            <td className="border-t border-[#D1D5DC] p-2">Nombre cotización</td>
                        </tr>
                    </thead>
                    <tbody> 
                        <tr>
                            <th className="border-t border-[#D1D5DC] p-2">Descripción</th>
                            <td className="border-t border-[#D1D5DC] p-2">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Et optio adipisci, a fugiat nam eum quo minima iusto facilis, nobis maiores quas, aliquid hic dolorum accusamus laudantium quasi nemo ipsum!</td>                                                      
                        </tr>
                        <tr>
                            <th className="border-t border-[#D1D5DC] p-2">Tipo de Envío</th>
                            <td className="border-t border-[#D1D5DC] p-2">Retiro tienda</td>
                        </tr>
                        <tr>
                            <th className="border-t border-[#D1D5DC] p-2">Dirección</th>
                            <td className="border-t border-[#D1D5DC] p-2">Dirección de ejemplo</td>
                        </tr>
                    </tbody>
                </table>
                
                <div className="my-7 flex justify-end ">
                <button className="font-bold px-3 py-1 text-white rounded bg-[#2563B6] hover:bg-[#1F5399] cursor-pointer"
                        onClick={() => {}}>
                        Editar información
                </button>
                </div>

            </div>

        </div>
    );
}

*/

const ElementosCotizacion = [
    {
    label:'Nombre',
    value: 'Nombre cotización'
},
    {
    label:'Descripción',
    value: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Et optio adipisci, a fugiat nam eum quo minima iusto facilis, nobis maiores quas, aliquid hic dolorum accusamus laudantium quasi nemo ipsum!'
},
    {
    label:'Tipo de Envío',
    value: 'Retiro tienda'
},
    {
    label:'Dirección',
    value: 'Avenida Siempre Viva 123, Springfield, Santiago'
}
]


import React from "react";

export default function Cotizacion() {
    return    (
        <div className={'max-w-[800px] px-[40px] sm:px-[0px]'}>
            <div className={'flex gap-5 items-baseline flex-wrap justify-center sm:justify-start py-[20px] sm:py-[5px]'}>
            <h1 className="font-semibold font-montserrat text-[32px]">
                Detalle cotización
            </h1>
                <div className={'flex gap-5 h-fit'}>
            <select className='border-[1px]'>
                <option>
                    Seleccionar cotización
                </option>
            </select>
                </div>
            </div>

            <div className="bg-white px-[40px] py-10 rounded-[10px]
                      shadow-[0_0_2px_rgba(0,0,0,0.25)] flex flex-col">
                <div className="flex justify-center py-[10px] flex-wrap sm:justify-between gap-[10px]">
                    <h2 className={'text-3xl font-medium text-center'}>Cotizacion #992320</h2>
                    <div className="bg-[#F1F6EF] p-2.5 rounded-[5px]">
                        <h3 className={'font-montserrat font-bold text-xl'}>Aprobada</h3>
                    </div>
                </div>
                    <div className="flex justify-between border-y-1 border-[#DFDFDF] flex-col">
                        {ElementosCotizacion.map((item, index) => (
                            <div
                                key={index}
                                className={`flex border-y border-[#DFDFDF] py-[5px] ${
                                    index === 0 ? 'border-t-1' : ''
                                }`}
                            >
                                <span className="text-gray-600">{item.label}:</span>
                                <span className="font-semibold">{item.value}</span>
                            </div>
                        ))}

                    </div>
            </div>

        </div>
    )
}
