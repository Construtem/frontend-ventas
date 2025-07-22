// src/components/EmptyQuoteNotice.tsx
'use client'
import NotProductsIcon from '@/styles/images/NotProductAdded.png'
import Image from "next/image";

export default function PanelTotalsNoProducts() {
    return (
        <div className="flex flex-col items-center justify-center text-center  rounded-lg border-gray-200 h-full ">
            <Image src={NotProductsIcon} alt={'imagen de productos no encontrados'} width={180} />
            <h2 className="text-xl font-semibold font-fo text-gray-700 mb-2 bottom-1 text-[#0d70d2]">
               Aún no hay productos en esta cotización
            </h2>
        </div>
    )
}
