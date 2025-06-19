// pages/ProductList.tsx  (o donde tengas el componente)
'use client';

import { useState } from 'react';
import { mockProducts } from '@/mock/mockProducts';
import type { Product } from '@/context/CartContext';
import ProductCard from '@/components/ProductCard';

type SortKey = 'nombre' | 'precio';

const ProductList: React.FC = () => {
    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState<SortKey>('nombre');

    const filtered = [...mockProducts]
        .filter(p => p.nombre.toLowerCase().includes(search.toLowerCase()))
        .sort((a, b) =>
            sortBy === 'nombre' ? a.nombre.localeCompare(b.nombre) : a.precio - b.precio
        );

    return (
        <div className="flex mt-[90px] gap-6 px-6">
            {/* LISTA DE PRODUCTOS */}
            <div className="flex-1">
                {/* Filtros */}
                <div className="flex gap-4 mb-4">
                    <select
                        className="bg-[#172129] text-white font-montserrat font-semibold px-4 py-2 rounded-lg shadow-[3px_3px_8px_rgba(0,0,0,0.25)] appearance-none focus:outline-none"
                    >
                        <option className="bg-[#172129] text-white font-montserrat px-4 py-2">Todos</option>
                        <option className="bg-[#172129] text-white font-montserrat px-4 py-2">demo</option>
                        <option className="bg-[#172129] text-white font-montserrat px-4 py-2">demo</option>
                    </select>

                    <input
                        type="text"
                        placeholder="Buscar producto"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="flex-1 border border-gray-300 rounded-md px-4 py-2 outline-none text-black bg-[#EDEFF2]"
                    />
                    <select
                        onChange={(e) => setSortBy(e.target.value as SortKey)}
                        className="bg-[#172129] text-white font-montserrat font-semibold px-4 py-2 rounded-lg shadow-[3px_3px_8px_rgba(0,0,0,0.25)] appearance-none focus:outline-none"
                    >
                        <option value="nombre">Nombre</option>
                        <option value="precio">Precio</option>
                    </select>
                </div>

                {/* Productos */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filtered.map((prod: Product) => (
                        <ProductCard key={prod.sku} product={prod} />
                    ))}
                </div>
            </div>

        </div>
    );
};

export default ProductList;
