'use client';

import Image from 'next/image';
import logo from '@/styles/images/contrutem.png';
import productoImg from '@/styles/images/producto.png';
import { FaCheck, FaClock, FaTimes } from 'react-icons/fa';

interface Producto {
  id: string;
  nombre: string;
  cantidad: number;
  precio: number;
}

const cotizacionDemo = {
  id: '2025-00123',
  fecha: '05/05/2025',
  estado: 'Pendiente' as const,
  cliente: {
    nombre: 'Cliente A',
    rut: '11.111.111-1',
    correo: 'cliente@example.com',
    telefono: '+56 9 1234 5678',
  },
  entrega: {
    tipo: 'Despacho',
    direccion: 'Calle Falsa 123',
    region: 'Metropolitana',
    comuna: 'Santiago',
    costo: 2990,
  },
  productos: [
    { id: 'P1', nombre: 'Producto 1', cantidad: 2, precio: 10000 },
    { id: 'P2', nombre: 'Producto 2', cantidad: 1, precio: 5500 },
  ] as Producto[],
};

const historialDemo = [
  { estado: 'Creada', fecha: '01/05/2025', usuario: 'Juan P\u00e9rez' },
  { estado: 'Pendiente', fecha: '05/05/2025', usuario: 'Juan P\u00e9rez' },
  { estado: 'Aprobada', fecha: '06/05/2025', usuario: 'Administrador' },
];

const EstadoBadge = ({ estado }: { estado: typeof cotizacionDemo.estado }) => {
  const variant = {
    Aprobada: {
      classes: 'bg-green-100 text-green-700',
      icon: <FaCheck />,
    },
    Pendiente: {
      classes: 'bg-yellow-100 text-yellow-700',
      icon: <FaClock />,
    },
    Rechazada: {
      classes: 'bg-red-100 text-red-700',
      icon: <FaTimes />,
    },
  }[estado];

  return (
    <span
      className={`inline-flex items-center gap-1 px-4 py-2 rounded-md text-sm font-semibold ${variant.classes}`}
    >
      {variant.icon}
      {estado}
    </span>
  );
};

export default function CotizacionDetalle() {
  const subtotal = cotizacionDemo.productos.reduce(
    (sum, p) => sum + p.precio * p.cantidad,
    0,
  );
  const descuento = 0;
  const impuestos = Math.round((subtotal - descuento) * 0.19);
  const total = subtotal - descuento + impuestos + cotizacionDemo.entrega.costo;

  const handlePrint = () => {
    if (typeof window !== 'undefined') window.print();
  };

  return (
    <div className="ml-[180px] mt-[70px] p-8 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-xl shadow-sm p-8 space-y-6 print:p-4">
        {/* Encabezado */}
        <div className="flex justify-between items-center">
          <Image src={logo} alt="Logo UTEM" width={140} className="h-auto" />
          <div className="text-right">
            <h1 className="text-2xl font-bold">Cotización {cotizacionDemo.id}</h1>
            <p className="text-sm text-gray-500">Fecha: {cotizacionDemo.fecha}</p>
            <EstadoBadge estado={cotizacionDemo.estado} />
          </div>
        </div>

        {/* Cliente y entrega */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-gray-200 rounded-lg p-4 space-y-1">
            <h2 className="font-semibold mb-2">Información del cliente</h2>
            <p><span className="font-medium">Nombre:</span> {cotizacionDemo.cliente.nombre}</p>
            <p><span className="font-medium">RUT:</span> {cotizacionDemo.cliente.rut}</p>
            <p><span className="font-medium">Correo:</span> {cotizacionDemo.cliente.correo}</p>
            <p><span className="font-medium">Teléfono:</span> {cotizacionDemo.cliente.telefono}</p>
          </div>
          <div className="border border-gray-200 rounded-lg p-4 space-y-1">
            <h2 className="font-semibold mb-2">Datos de entrega</h2>
            <p><span className="font-medium">Tipo:</span> {cotizacionDemo.entrega.tipo}</p>
            {cotizacionDemo.entrega.direccion && (
              <p><span className="font-medium">Dirección:</span> {cotizacionDemo.entrega.direccion}</p>
            )}
            {cotizacionDemo.entrega.region && (
              <p><span className="font-medium">Región/Comuna:</span> {cotizacionDemo.entrega.region}, {cotizacionDemo.entrega.comuna}</p>
            )}
            {cotizacionDemo.entrega.costo > 0 && (
              <p><span className="font-medium">Costo despacho:</span> ${cotizacionDemo.entrega.costo.toLocaleString()}</p>
            )}
          </div>
        </div>

        {/* Tabla de productos */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 font-semibold text-gray-900">
              <tr>
                <th className="px-4 py-2 text-left">Producto</th>
                <th className="px-4 py-2 text-right">Cantidad</th>
                <th className="px-4 py-2 text-right">Precio</th>
                <th className="px-4 py-2 text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {cotizacionDemo.productos.map((p) => (
                <tr key={p.id} className="border-b">
                  <td className="px-4 py-2 flex items-center gap-3">
                    <Image src={productoImg} alt={p.nombre} width={40} height={40} />
                    <span>{p.nombre}</span>
                  </td>
                  <td className="px-4 py-2 text-right">{p.cantidad}</td>
                  <td className="px-4 py-2 text-right">${p.precio.toLocaleString()}</td>
                  <td className="px-4 py-2 text-right">${(p.precio * p.cantidad).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Resumen totales */}
        <div className="flex justify-end">
          <div className="w-full max-w-xs border border-gray-200 rounded-lg p-4 space-y-1">
            <div className="flex justify-between text-sm">
              <span>Sub-total</span>
              <span>${subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm text-red-600 font-semibold">
              <span>Descuentos</span>
              <span>- ${descuento.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Impuestos 19 %</span>
              <span>${impuestos.toLocaleString()}</span>
            </div>
            <hr className="my-2" />
            <div className="flex justify-between font-bold text-black">
              <span>Total</span>
              <span>${total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Historial */}
        <div className="border border-gray-200 rounded-lg p-4 space-y-2">
          <h2 className="font-semibold mb-2">Historial</h2>
          <ol className="relative border-l border-gray-200 ml-2">
            {historialDemo.map((h, idx) => (
              <li key={idx} className="mb-4 ml-4">
                <div className="absolute w-3 h-3 bg-gray-200 rounded-full -left-1.5 border border-white"></div>
                <p className="text-sm font-medium">{h.estado}</p>
                <p className="text-xs text-gray-500">{h.fecha} - {h.usuario}</p>
              </li>
            ))}
          </ol>
        </div>

        {/* Botones de acción */}
        <div className="flex gap-4 justify-end print:hidden">
          {cotizacionDemo.estado === 'Aprobada' && (
            <button className="bg-[#FF7300] hover:bg-orange-600 text-white px-4 py-2 rounded-md">Pagar ahora</button>
          )}
          {cotizacionDemo.estado === 'Pendiente' && (
            <button className="bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 px-4 py-2 rounded-md">Cancelar</button>
          )}
          <button onClick={handlePrint} className="border border-gray-300 px-4 py-2 rounded-md">Descargar PDF</button>
        </div>
      </div>
    </div>
  );
}
