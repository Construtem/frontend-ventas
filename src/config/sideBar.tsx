// src/config/nav.ts
export interface SideBar {
    id: string;                 // clave única
    label: string;
    href?: string;              // si no hay href ⇒ es un grupo plegable
    icon: React.ReactNode;
    children?: NavItem[];       // sub–menú opcional
}
export interface NavItem {
    id: string;                 // clave única
    label: string;
    href?: string;
    icon?: React.ReactNode;       // opcional, si usas lucide-react o similar
    children?: NavItem[];       // sub–menú opcional
}

import {
    FaHome, FaBoxes, FaWarehouse, FaTruck, FaStore,
    FaCog, FaClipboardList, FaUsers, FaShoppingCart
} from 'react-icons/fa';

export const ADMIN_SideBar: NavItem[] = [
    { id: 'inicio',       label: 'Inicio',       href: '/admin/inicio', icon: <FaHome /> },
    {
        id: 'inventario',   label: 'Inventario',   icon: <FaBoxes />,
        children: [
            { id: 'sucursal-1', label: 'Sucursal 1', href: '/admin/inventario/sucursal-1', icon: <FaStore/> },
            { id: 'sucursal-2', label: 'Sucursal 2', href: '/admin/inventario/sucursal-2', icon: <FaStore/> },
            { id: 'sucursal-3', label: 'Sucursal 3', href: '/admin/inventario/sucursal-3', icon: <FaStore/> },
        ]
    },
    { id: 'bodega',       label: 'Bodega',       href: '/admin/bodega',       icon: <FaWarehouse /> },
    { id: 'proveedores',  label: 'Proveedores',  href: '/admin/proveedores',  icon: <FaTruck /> },
    { id: 'sucursales',   label: 'Sucursales',   href: '/admin/sucursales',   icon: <FaStore /> },
    { id: 'config',       label: 'Configuración',href: '/admin/configuracion',icon: <FaCog /> },
];

export const VENDEDOR_SideBar: NavItem[] = [
    { id: 'dashboard',    label: 'Dashboard',    href: '/vendedor/dashboard',                icon: <FaHome /> },
    { id: 'cot',          label: 'Cotizaciones', href: '/vendedor/cotizaciones',             icon: <FaClipboardList /> },
    { id: 'ventas',       label: 'Ventas',       href: '/vendedor/ventas',                   icon: <FaShoppingCart /> },
    { id: 'clientes',     label: 'Clientes',     href: '/vendedor/clientes',                 icon: <FaUsers /> },
    { id: 'inv',          label: 'Inventario',   href: '/vendedor/inventario',               icon: <FaBoxes /> },
    {id:' carrito', label: 'Productos', href: '/vendedor/productos', icon: <FaBoxes />},
];
