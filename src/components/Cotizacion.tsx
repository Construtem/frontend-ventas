'use client'


export default function Cotizacion() {

    return (
        <div className="ml-7 bg-white border border-gray-300 rounded-lg w-[770]">

            <div className="ml-8 mr-8">
            
                <div className="flex mt-3">

                    <div className="mb-2 text-lg text-[#5B83C5] font-bold flex gap-2">
                        Cotización #123456
                    </div>

                    {/*Boton Estado*/}
                    <div className="ml-109">
                    <button className="px-3 py-1 mr-2 text-black rounded bg-[#F1F6EF]">
                        Aprobada
                    </button>
                    </div>

                </div>

                <hr className="border-t border-gray-300 my-2" />            

                <thead>
                    <div className="mb-2 gap-2 text-base text-black">
                        Nombre
                    </div>

                <hr className="border-t border-gray-300 my-2" />     

                    <div className="mb-2 gap-2 text-base text-black">
                        Descripción
                    </div>  

                <hr className="border-t border-gray-300 my-2" /> 

                    <div className="mb-2 gap-2 text-base text-black">
                        Tipo de envío
                    </div>          

                <hr className="border-t border-gray-300 my-2" /> 

                    <div className="mb-2 gap-2 text-base text-black">
                        Dirección
                    </div>  

                <hr className="border-t border-gray-300 my-2" />
                </thead>

                <tbody>
                    <tr>
                        fdf
                        fdf
                        dfa
                    </tr>
                </tbody>
                
                
                <div className="my-7 flex justify-end ">
                <button className="px-3 py-1 text-white rounded bg-[#2563B6] hover:bg-[#1F5399] cursor-pointer"
                        onClick={() => {}}>
                        Editar información
                </button>
                </div>

            </div>

        </div>
    );
}
