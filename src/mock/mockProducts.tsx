import type { Product } from '@/context/CartContext';

export const mockProducts: Product[] = [
    { sku: 'SKU-001', nombre: 'Martillo de acero', precio: 7500, cantidad: 1},
    { sku: 'SKU-002', nombre: 'Taladro inalámbrico', precio: 45000, cantidad: 1},
    { sku: 'SKU-003', nombre: 'Juego de destornilladores', precio: 12990, cantidad: 1},
    { sku: 'SKU-004', nombre: 'Sierra circular', precio: 120000, cantidad: 1},
    { sku: 'SKU-005', nombre: 'Cinta métrica', precio: 1500, cantidad: 1},
    { sku: 'SKU-007', nombre: 'Pistola de calor', precio: 25000, cantidad: 1},
];
