// components/ProductCard.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import type { Product } from '@/context/CartContext';
import productoImg from '@/styles/images/producto.png';

interface Props {
    product: Product;
}

const ProductCard: React.FC<Props> = ({ product }) => {
    const { addToCart } = useCart();
    const [qty, setQty] = useState(1);

    const decrease = () => setQty(q => Math.max(q - 1, 1));
    const increase = () => setQty(q => q + 1);

    return (
        <div className="bg-white rounded-xl shadow-sm p-4 flex flex-col max-w-[400px] gap-1">
            <div className="flex">
                <Image src={productoImg} alt={product.nombre} width={80} height={80}
                       className="w-16 h-16 mb-2 self-center"/>
                <div>
                    <h3 className="font-semibold text-black">{product.nombre}</h3>
                    <span className="text-[12px] text-[#817171]">{product.sku}</span>
                </div>
            </div>

            <p className="text-orange-500 font-bold text-lg">
                ${product.precio.toLocaleString()} <span className="text-sm">c/u</span>
            </p>
            <span className="text-xs text-red-500 bg-red-100 rounded px-2 py-0.5 w-fit mt-1">
        Pocas unidades
      </span>
            <p className="text-sm text-gray-600 mt-1">🚚 Envío en 2 - 3 días</p>

            {/* Selector de cantidad */}
            <div className="grid w-full grid-cols-[48px_1fr_48px] border border-gray-300 rounded-md overflow-hidden">
                {/* Botón − */}
                <button
                    onClick={decrease}
                    disabled={qty === 1}
                    className="
      flex items-center justify-center text-xl font-bold
      disabled:cursor-not-allowed disabled:opacity-40
      hover:bg-gray-100
      text-black
      pt-2
      cursor-pointer
    "
                >
                    −
                </button>

                {/* Número */}
                <span className="flex items-center justify-center font-semibold text-black">
    {qty}
  </span>

                {/* Botón + */}
                <button
                    onClick={increase}
                    className="
      flex items-center justify-center text-xl font-bold
      hover:bg-gray-100
      text-black
      cursor-pointer
    "
                >
                    +
                </button>
            </div>

            <p className="text-xs text-gray-500 mt-1">Cantidad</p>

            <button
                onClick={() => addToCart(product, qty)}
                className="mt-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded-md shadow-[3px_3px_8px_rgba(0,0,0,0.25)] cursor-pointer"
            >
                Añadir al carrito
            </button>
        </div>
    );
};

export default ProductCard;
