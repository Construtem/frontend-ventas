"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import productoImg from "@/styles/images/producto.png";

export default function PagoPage() {
  const { cart } = useCart();

  const subtotalBruto = cart.reduce((s, i) => s + i.precio * i.cantidad, 0);
  const totalDescuento = cart.reduce(
    (s, i) => s + ((i.descuento ?? 0) * i.precio * i.cantidad) / 100,
    0
  );
  const impuestos = Math.round((subtotalBruto - totalDescuento) * 0.19);
  const totalFinal = subtotalBruto - totalDescuento + impuestos;

  return (
    <div className="p-8 bg-[#f6f6f6] min-h-screen">
      <p className="text-gray-400 text-sm mb-1">Checkout &gt; Pago</p>
      <h1 className="text-3xl font-bold text-black mb-6">Confirmar Pago</h1>

      <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
        <h2 className="text-xl font-semibold text-black">Resumen de compra</h2>
        {cart.length === 0 ? (
          <p className="text-gray-500">El carrito está vacío.</p>
        ) : (
          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            {cart.map((i) => (
              <div
                key={i.sku}
                className="flex items-center justify-between border-[0.5px] border-solid border-[#DFDFDF] rounded-md px-3 py-2"
              >
                <div className="flex items-center gap-3">
                  <Image
                    src={productoImg}
                    alt={i.nombre}
                    width={40}
                    height={40}
                  />
                  <div>
                    <p className="font-medium text-black truncate max-w-[130px]">
                      {i.nombre}
                    </p>
                    <span className="text-xs text-gray-500">
                      Cantidad: {i.cantidad}
                    </span>
                  </div>
                </div>
                <span className="font-semibold text-black">
                  ${(i.precio * i.cantidad).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="text-sm space-y-1">
          <div className="flex justify-between">
            <span className="text-black">Subtotal</span>
            <span className="text-black">${subtotalBruto.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-red-600 font-semibold">
            <span>Descuento</span>
            <span>- ${totalDescuento.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-black">Impuestos 19 %</span>
            <span className="text-black">${impuestos.toLocaleString()}</span>
          </div>
          <hr className="my-2" />
          <div className="flex justify-between text-lg font-bold text-black">
            <span>Total</span>
            <span>${totalFinal.toLocaleString()}</span>
          </div>
        </div>

        <div className="pt-4 text-right">
          <button className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-md font-semibold cursor-pointer">
            Pagar ahora
          </button>
        </div>
      </div>

      <div className="mt-6 text-center">
        <Link href="/vendedor/checkout" className="text-blue-600 hover:underline">
          Volver a Información del cliente
        </Link>
      </div>
    </div>
  );
}
