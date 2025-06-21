'use client';

import Image from 'next/image';
import { FaCheck, FaClock, FaTimes } from 'react-icons/fa';
import productoImg from '@/styles/images/producto.png';

/** Dummy data for UI demo */
type Estado = 'Aprobada' | 'Pendiente' | 'Rechazada';

const cotizacion = {
  id: '2025-00123',
  fecha: '05/05/2025',
  estado: 'Pendiente' as Estado,
  cliente: {
    nombre: 'Ferretería Demo Ltda.',
    rut: '76.543.210-9',
    correo: 'cliente@example.com',
    telefono: '+56912345678',
  },
  entrega: {
    tipo: 'Despacho' as 'Despacho' | 'Presencial',
    direccion: 'Av. Siempre Viva 742',
    region: 'Región Metropolitana',
    comuna: 'Santiago',
    costo: 2990,
  },
  productos: [
    { sku: 'SKU001', nombre: 'Producto A', cantidad: 2, precio: 10000 },
    { sku: 'SKU002', nombre: 'Producto B', cantidad: 1, precio: 5000 },
  ],
  historial: [
    { fecha: '05/05/2025', usuario: 'Juan Pérez', accion: 'Creada' },
    { fecha: '06/05/2025', usuario: 'Juan Pérez', accion: 'Pendiente' },
  ],
};

const estadoIcon = {
  Aprobada: <FaCheck className="text-2xl text-green-600" />,
  Pendiente: <FaClock className="text-2xl text-yellow-600" />,
  Rechazada: <FaTimes className="text-2xl text-red-600" />,
};

const badgeVariant = {
  Aprobada: 'bg-green-100 text-green-700',
  Pendiente: 'bg-yellow-100 text-yellow-700',
  Rechazada: 'bg-red-100 text-red-700',
};

export default function DetalleCotizacion() {
  const subtotal = cotizacion.productos.reduce(
    (s, p) => s + p.precio * p.cantidad,
    0
  );
  const descuentos = 0;
  const impuestos = Math.round((subtotal - descuentos) * 0.19);
  const total = subtotal - descuentos + impuestos + cotizacion.entrega.costo;

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-black">
            Cotización {cotizacion.id}
          </h1>
          <p className="text-sm text-gray-500">Creada el {cotizacion.fecha}</p>
        </div>
        <div className="flex items-center gap-2">
          {estadoIcon[cotizacion.estado]}
          <span
            className={`px-3 py-1 rounded-md text-sm font-semibold ${badgeVariant[cotizacion.estado]}`}
          >
            {cotizacion.estado}
          </span>
        </div>
      </div>

      {/* Cliente y entrega */}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 space-y-4">
          <div className="bg-white rounded-xl shadow-sm p-4">
            <h2 className="font-semibold mb-2 text-black">Información del cliente</h2>
            <p className="text-black font-medium">{cotizacion.cliente.nombre}</p>
            <p className="text-sm text-gray-600">RUT: {cotizacion.cliente.rut}</p>
            <p className="text-sm text-gray-600">{cotizacion.cliente.correo}</p>
            <p className="text-sm text-gray-600">{cotizacion.cliente.telefono}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-4">
            <h2 className="font-semibold mb-2 text-black">Datos de entrega</h2>
            <p className="text-sm text-black">Tipo: {cotizacion.entrega.tipo}</p>
            {cotizacion.entrega.tipo === 'Despacho' && (
              <>
                <p className="text-sm text-black">Dirección: {cotizacion.entrega.direccion}</p>
                <p className="text-sm text-black">
                  {cotizacion.entrega.region} / {cotizacion.entrega.comuna}
                </p>
                <p className="text-sm text-black">
                  Costo despacho: ${cotizacion.entrega.costo.toLocaleString()}
                </p>
              </>
            )}
          </div>
        </div>

        {/* Resumen */}
        <div className="lg:w-1/3 space-y-4">
          <div className="bg-white rounded-xl shadow-sm p-4">
            <h2 className="font-semibold mb-4 text-black">Resumen</h2>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-black">Sub-total</span>
              <span className="text-black">${subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm mb-1 text-red-600 font-semibold">
              <span>Descuentos</span>
              <span>- ${descuentos.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-black">Impuestos 19 %</span>
              <span className="text-black">${impuestos.toLocaleString()}</span>
            </div>
            <hr className="my-2" />
            <div className="flex justify-between text-lg font-bold text-black">
              <span>Total</span>
              <span>${total.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla productos */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-gray-900 font-semibold">
            <tr>
              <th className="px-6 py-3 text-left">Producto</th>
              <th className="px-6 py-3 text-right">Cantidad</th>
              <th className="px-6 py-3 text-right">Precio unitario</th>
              <th className="px-6 py-3 text-right">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {cotizacion.productos.map((p) => (
              <tr key={p.sku} className="border-b last:border-b-0 border-[#EDEFEE]">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3 text-black">
                    <Image src={productoImg} alt={p.nombre} width={40} height={40} />
                    <span>{p.nombre}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right text-black">{p.cantidad}</td>
                <td className="px-6 py-4 text-right text-black">
                  ${p.precio.toLocaleString()}
                </td>
                <td className="px-6 py-4 text-right font-semibold text-black">
                  ${(p.precio * p.cantidad).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Historial */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <h2 className="font-semibold mb-2 text-black">Historial</h2>
        <ol className="border-l-2 border-gray-200 pl-4 space-y-2">
          {cotizacion.historial.map((h, idx) => (
            <li key={idx} className="text-sm text-black">
              <span className="font-medium">{h.accion}</span> - {h.fecha} ({h.usuario})
            </li>
          ))}
        </ol>
      </div>

      {/* Botones */}
      <div className="flex flex-wrap gap-3">
        {cotizacion.estado === 'Aprobada' && (
          <button className="bg-[#FF7300] hover:bg-orange-600 text-white px-4 py-2 rounded-md">
            Pagar ahora
          </button>
        )}
        {cotizacion.estado === 'Pendiente' && (
          <button className="bg-red-100 text-red-700 hover:bg-red-200 px-4 py-2 rounded-md">
            Cancelar
          </button>
        )}
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
          Descargar PDF
        </button>
      </div>
    </div>
  );
}
