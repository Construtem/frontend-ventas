// helpers/productMapper.ts
import { DraftProducto, ProductoInventario } from '@/services/apiServices'

/** Convierte un registro del inventario en un DraftProducto listo
 *  para entrar a la tabla / contexto de cotización.               */
export function toDraft (
    p: ProductoInventario,
    origenNombre: string,
    sucursalPrincipalId: number,    // id de la tienda elegida
): DraftProducto {

    /* ─── Identificamos origen ────────────────────────────────────── */
    const origen = origenNombre === 'Sucursal'
        ? {
            sucursal_id: sucursalPrincipalId,
            nombre     : `Sucursal #${sucursalPrincipalId}`,
            stock      : p.stock_sucursal,
            descuento  : p.descuento_sucursal,
        }
        : p.bodegas?.find(b => b.nombre === origenNombre)!      // ¡tiene sucursal_id!

    /* ─── Cálculos de precio y totales ────────────────────────────── */
    const neto = p.precio * (1 - origen.descuento / 100)

    /* ─── Draft listo ─────────────────────────────────────────────── */
    return {
        sku        : p.sku,
        nombre     : p.nombre,
        sucursalId : origen.sucursal_id,     // ← ahora SIEMPRE hay id
        origen     : origen.nombre,
        stock      : origen.stock,
        descuento  : origen.descuento,
        precioUnit : p.precio,
        cantidad   : 1,
        netoUnit   : neto,
        total      : neto,
    }
}
