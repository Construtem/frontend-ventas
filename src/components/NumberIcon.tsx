import {useCotizacionFlow} from "@/contexts/CotizacionFlow";

export default function NumberIcon({ number, className }: { number: number, className?: string }) {
    const { state } = useCotizacionFlow();
    return (
        <div onClick={()=>console.log(state)} className={`${className} flex items-center justify-center w-8 h-8 bg-blue-500 text-white font-semibold font-montserrat rounded-full left-1`}>
            {number}
        </div>
    );
}