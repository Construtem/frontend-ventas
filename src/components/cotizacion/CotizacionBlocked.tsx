import Image from 'next/image';
import QuoteIcon from '@/styles/images/QuoteIcon.png';
export default function CotizacionBlocked() {

    return (<>
        <div className={'flex items-center flex-col h-full justify-center'}>
            <div className="my-auto h-fit flex flex-col items-center gap-[5px]">
            <Image src={QuoteIcon} alt={'Icono de cotización'} width={200} height={200}/>
            <div className={'w-84'}>
            <h2 className={'text-center text-[#033c86] font-semibold font-montserrat text-[24px]'}>Primero selecciona un cliente para ver o gestionar cotizaciones</h2>
            </div>
            </div>
        </div>
    </>
    )
}