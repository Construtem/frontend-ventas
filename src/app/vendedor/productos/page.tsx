// pages/ProductList.tsx  (o donde tengas el componente)
'use client';

import { useState } from 'react';
import { mockProducts } from '@/mock/mockProducts';
import type { Product } from '@/context/CartContext';
import ProductCard from '@/components/ProductCard';

type SortKey = 'nombre' | 'precio' | 'sku';
type FilterKey = 'nombre' | 'sku' | 'precio';

const ProductList: React.FC = () => {

    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState<SortKey>('nombre');
    const [filterBy] = useState<FilterKey>('nombre'); // sin setter


    // El filtro primero filtra por el campo seleccionado (nombre, sku o precio)
    // Si es precio, busca por precio. Si es nombre o sku, busca por ambos campos.
    const filtered = [...mockProducts]
        .filter(p =>
            filterBy === 'precio'
                ? String(p.precio).includes(search)
                : (
                    p.nombre.toLowerCase().includes(search.toLowerCase()) ||
                    p.sku.toLowerCase().includes(search.toLowerCase())
                )
        )
        // Luego ordena según el campo seleccionado en sortBy
        .sort((a, b) =>
            sortBy === 'nombre'
                ? a.nombre.localeCompare(b.nombre)
                : sortBy === 'sku'
                    ? a.sku.localeCompare(b.sku)
                    : a.precio - b.precio
        );

    //console.log(filtered.map(p => p.sku));

    return (
        <div className="flex mt-[90px] gap-6 px-6">
            {/* LISTA DE PRODUCTOS */}
            <div className="flex-1">
                {/* Filtros */}
                <div className="flex gap-4 mb-4">
                    {/* Input de búsqueda*/}
                    <input
                        type={filterBy === 'precio' ? 'number' : 'text'}
                        placeholder="Buscar por nombre o SKU"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="cursor-pointer flex-1 border border-gray-300 rounded-md px-4 py-2 outline-none text-black bg-[#EDEFF2]"
                    />
                    {/* Select para ordenar*/}
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as SortKey)}
                        className="cursor-pointer bg-[#172129] text-white font-montserrat font-semibold px-4 py-2 rounded-lg shadow-[3px_3px_8px_rgba(0,0,0,0.25)] appearance-none focus:outline-none"
                    >
                        <option value="nombre">Ordenar por: Nombre</option>
                        <option value="precio">Ordenar por: Precio</option>
                        <option value="sku">Ordenar por: SKU</option>
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
