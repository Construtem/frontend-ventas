import Image from 'next/image';
import QuoteIcon from '@/styles/images/QuoteIcon.png';
export default function CotizacionBlocked() {

    return (
        <div className={'flex flex-col h-full justify-center'}>
            <div className="flex flex-col  h-full  items-center gap-[5px]">
            <Image src={QuoteIcon} alt={'Icono de cotización'} width={200} height={200}/>
            <div className={'w-84'}>
            <h2 className={'text-center text-[#033c86] font-semibold font-montserrat text-[24px]'}>Primero selecciona un cliente para ver o gestionar cotizaciones</h2>
            </div>
            </div>
        </div>
    )
}