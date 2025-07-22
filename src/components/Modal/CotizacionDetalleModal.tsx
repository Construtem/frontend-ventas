"use client";
import {
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@/components/Modal/ModalsParts";
import Button from "@/components/Button";
import {
  DBCotizacion,
  CotizacionCheckout,
  eliminarCotizacion,
} from "@/services/apiServices";
import Modal from "@/components/Modal/Modal";
import { useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  data: DBCotizacion | CotizacionCheckout;
  onDelete?: () => void;
  onDeleteSuccess?: () => void; // Callback para cuando se elimina exitosamente
};

export default function CotizacionDetalleModal({
  open,
  onClose,
  data,
  onDelete,
  onDeleteSuccess,
}: Props) {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!data) return null;

  const handleDelete = async () => {
    if (
      !window.confirm("¿Estás seguro de que quieres eliminar esta cotización?")
    ) {
      return;
    }

    try {
      setIsDeleting(true);
      await eliminarCotizacion(data.id);

      // Llamar al callback de éxito si existe
      if (onDeleteSuccess) {
        onDeleteSuccess();
      }

      // Cerrar el modal
      onClose();

      // Mostrar mensaje de éxito
      alert("Cotización eliminada exitosamente");
    } catch (error) {
      console.error("Error al eliminar cotización:", error);
      alert(
        `Error al eliminar la cotización: ${
          error instanceof Error ? error.message : "Error desconocido"
        }`
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const isCheckout = !("producto" in (data.items?.[0] || {})); // detecta CotizacionCheckout

  const {
    id,
    fecha_crea,
    estado,
    tipo_despacho,
    costo_envio,
    descripcion,
    estado_pago,
    cliente,
    direccion,
    items,
  } = data;

  const usuario = "usuario" in data ? data.usuario : null;
  const total_items =
    "total_items" in data
      ? data.total_items
      : items?.reduce((sum, i) => sum + i.cantidad, 0) || 0;
  const total_precio =
    "total_precio" in data
      ? data.total_precio
      : items?.reduce((sum, i) => sum + Number(i.subtotal), 0) || 0;

  const money = (v: number) => `$${v.toLocaleString("es-CL")}`;

  return (
    <Modal isOpen={open} onClose={onClose}>
      <ModalHeader title={`Cotización #${id}`} onClose={onClose} />

      <ModalBody>
        {/* Cabecera */}
        <section className="grid grid-cols-2 gap-4">
          <div>
            <p>
              <span className="font-semibold">Estado:</span> {estado}
            </p>
            <p>
              <span className="font-semibold">Estado pago:</span>{" "}
              {estado_pago?.charAt(0).toUpperCase() + estado_pago?.slice(1)}
            </p>
            <p>
              <span className="font-semibold">Fecha:</span>{" "}
              {new Date(fecha_crea).toLocaleDateString()}
            </p>
            <p>
              <span className="font-semibold">Tipo envío:</span>{" "}
              {tipo_despacho
                ? tipo_despacho.charAt(0).toUpperCase() + tipo_despacho.slice(1)
                : ""}
            </p>
            <p>
              <span className="font-semibold">Costo envío:</span>{" "}
              {money(Number(costo_envio))}
            </p>
            {direccion && (
              <p>
                <span className="font-semibold">Dirección:</span>{" "}
                {`${direccion.direccion}, ${direccion.comuna}, ${direccion.ciudad}`}
              </p>
            )}
          </div>

          <div>
            <p className="font-semibold mb-1">Cliente</p>
            <p>
              {cliente.nombre} ({cliente.rut})
            </p>
            <p>{cliente.email ?? "—"}</p>
            <p>{cliente.telefono ?? "—"}</p>

            {usuario && (
              <>
                <p className="font-semibold mt-3 mb-1">Vendedor</p>
                <p>{usuario.nombre}</p>
                <p>{usuario.email}</p>
              </>
            )}
          </div>
        </section>

        {/* Descripción */}
        {descripcion && (
          <p className="mt-4">
            <span className="font-semibold">Descripción:&nbsp;</span>
            {descripcion}
          </p>
        )}

        {/* Tabla de ítems */}
        <h3 className="mt-6 font-semibold text-lg">Productos</h3>
        <div className="overflow-x-auto mt-2">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-white/20">
                <th className="py-2 text-left">SKU</th>
                <th className="py-2 text-left">Nombre</th>
                <th className="py-2 text-right">Cant.</th>
                <th className="py-2 text-right">P. unit</th>
                <th className="py-2 text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {isCheckout
                ? items?.map((it, idx) => (
                    <tr key={idx} className="border-b border-white/10">
                      <td className="py-1">{it.sku}</td>
                      <td className="py-1">{it.nombre}</td>
                      <td className="py-1 text-right">{it.cantidad}</td>
                      <td className="py-1 text-right">
                        {money(Number(it.precio_unitario))}
                      </td>
                      <td className="py-1 text-right">
                        {money(Number(it.subtotal))}
                      </td>
                    </tr>
                  ))
                : items?.map((it) => (
                    <tr key={it.sku} className="border-b border-white/10">
                      <td className="py-1">{it.sku}</td>
                      <td className="py-1">{it.nombre}</td>
                      <td className="py-1 text-right">{it.cantidad}</td>
                      <td className="py-1 text-right">
                        {money(Number(it.precio_unitario))}
                      </td>
                      <td className="py-1 text-right">
                        {money(it.cantidad * Number(it.precio_unitario))}
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>

        {/* Totales */}
        <div className="mt-4 grid grid-cols-2 gap-4">
          <p>
            <span className="font-semibold">Total ítems:</span> {total_items}
          </p>
          <p className="text-right">
            <span className="font-semibold">Subtotal:</span>{" "}
            {money(total_precio)}
          </p>
          <p>
            <span className="font-semibold">Costo envío:</span>{" "}
            {money(Number(costo_envio))}
          </p>
          <p className="text-right font-semibold text-lg">
            Total: {money(total_precio + Number(costo_envio))}
          </p>
        </div>
      </ModalBody>

      <ModalFooter>
        <div className="flex gap-3 justify-end">
          <Button
            label={isDeleting ? "Eliminando..." : "Eliminar"}
            className="bg-red-600 hover:bg-red-700 text-white disabled:opacity-50"
            onClick={onDelete || handleDelete}
            disabled={isDeleting}
          />
          <Button
            label="Cerrar"
            className="bg-[#1b5be7] hover:bg-[#1e4fbb] text-white"
            onClick={onClose}
          />
        </div>
      </ModalFooter>
    </Modal>
  );
}
