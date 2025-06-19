"use client";

import Image from "next/image";
import logo from "@/styles/images/contrutem_png.png";

export default function CotizacionPage() {
  const quote = {
    numero: "COT-001",
    fecha: "2024-01-20",
    estado: "Pendiente",
  };

  const cliente = {
    nombre: "Juan Pérez",
    rut: "11.111.111-1",
    email: "juan@example.com",
    telefono: "+56 9 1234 5678",
  };

  const despacho = {
    tipo: "Domicilio",
    direccion: "Av. Siempre Viva 123",
    region: "Región Metropolitana",
    comuna: "Santiago",
    costo: 5000,
  };

  const productos = [
    { id: 1, nombre: "Producto A", cantidad: 2, precio: 10000 },
    { id: 2, nombre: "Producto B", cantidad: 1, precio: 25000 },
  ];

  const subtotal = productos.reduce((acc, p) => acc + p.cantidad * p.precio, 0);
  const descuento = 0;
  const iva = subtotal * 0.19;
  const total = subtotal + iva + despacho.costo - descuento;

  const estadoColor = {
    Pendiente: "bg-yellow-500",
    Cancelada: "bg-red-500",
    Pagada: "bg-green-500",
  }[quote.estado] || "bg-gray-500";

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex items-center justify-between bg-white p-4 rounded shadow">
        <div>
          <h1 className="text-xl font-semibold">Cotización {quote.numero}</h1>
          <p className="text-sm text-gray-500">Creada el {quote.fecha}</p>
        </div>
        <span className={`text-white px-3 py-1 rounded ${estadoColor}`}>{quote.estado}</span>
      </div>

      {/* Información Cliente y Despacho */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white rounded shadow p-4">
          <h2 className="font-semibold mb-2">Cliente</h2>
          <p>{cliente.nombre}</p>
          <p className="text-sm text-gray-500">RUT: {cliente.rut}</p>
          <p className="text-sm">{cliente.email}</p>
          <p className="text-sm">{cliente.telefono}</p>
        </div>
        <div className="bg-white rounded shadow p-4">
          <h2 className="font-semibold mb-2">Despacho</h2>
          <p>Tipo: {despacho.tipo}</p>
          <p>{despacho.direccion}</p>
          <p className="text-sm text-gray-500">
            {despacho.region} - {despacho.comuna}
          </p>
          <p className="text-sm">Costo envío: ${despacho.costo.toLocaleString()}</p>
        </div>
      </div>

      {/* Tabla Productos */}
      <div className="bg-white rounded shadow p-4 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left border-b">
              <th className="p-2">Imagen</th>
              <th className="p-2">Producto</th>
              <th className="p-2 text-right">Cantidad</th>
              <th className="p-2 text-right">Precio Unit.</th>
              <th className="p-2 text-right">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((p) => (
              <tr key={p.id} className="border-b hover:bg-gray-50">
                <td className="p-2">
                  <Image src={logo} alt="Producto" width={40} height={40} />
                </td>
                <td className="p-2">{p.nombre}</td>
                <td className="p-2 text-right">{p.cantidad}</td>
                <td className="p-2 text-right">${p.precio.toLocaleString()}</td>
                <td className="p-2 text-right">
                  ${(p.cantidad * p.precio).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totales */}
      <div className="bg-white rounded shadow p-4 w-full md:w-1/3 ml-auto space-y-1">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>${subtotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span>Descuentos</span>
          <span>${descuento.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span>IVA</span>
          <span>${iva.toLocaleString()}</span>
        </div>
        <div className="flex justify-between font-bold border-t pt-2">
          <span>Total</span>
          <span>${total.toLocaleString()}</span>
        </div>
      </div>

      {/* Acciones */}
      <div className="flex gap-2 justify-end">
        <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
          Pagar ahora
        </button>
        <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded">
          Cancelar
        </button>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
          Descargar PDF
        </button>
      </div>
    </div>
  );
}
