// helpers/productMapper.ts
import { DraftProducto, ProductoInventario } from '@/services/apiServices'

type Origen = {
    id:        number
    nombre:    string
    stock:     number
    descuento: number
}

/**
 * Convierte el registro crudo del endpoint en un DraftProducto listo para
 * colocar en el contexto/borrador de la cotización.
 *
 * @param p                   producto proveniente de /productos/inventario
 * @param origenNombre        'Sucursal' o nombre exacto de la bodega elegida
 * @param sucursalPrincipalId id numérico de la sucursal actual (contexto)
 */
export function toDraft (
    p: ProductoInventario,
    origenNombre: string,
    sucursalPrincipalId: number,
): DraftProducto {
    /* ── 1. Elegir fuente de stock/desc según el origen seleccionado ───────── */
    let origen: Origen

    if (origenNombre === 'Sucursal') {
        // se usa la tienda donde está logeado el vendedor
        origen = {
            id: sucursalPrincipalId,
            nombre: `Sucursal #${sucursalPrincipalId}`,
            stock: p.stock_sucursal,
            descuento: p.descuento_sucursal,
        }
    } else {
        // se busca la bodega cuyo nombre coincide con el <option> elegido
        const b = p.bodegas?.find(b => b.nombre === origenNombre)
        if (!b) {
            throw new Error(`Bodega "${origenNombre}" no encontrada para SKU ${p.sku}`)
        }
        origen = {
            id: b.sucursal_id,
            nombre: b.nombre,
            stock: b.stock,
            descuento: b.descuento,
        }
    }

    /* ── 2. Calcular neto y total (1 unidad por defecto) ───────────────────── */
    const netoUnit = +(p.precio * (1 - origen.descuento / 100)).toFixed(2)

    /* ── 3. Armar DraftProducto coherente ──────────────────────────────────── */
    return {
        sku        : p.sku,
        nombre     : p.nombre,
        sucursalId : origen.id,
        origen     : origen.nombre,
        stock      : origen.stock,
        descuento  : origen.descuento,
        precioUnit : p.precio,
        cantidad   : 1,
        netoUnit,
        total      : netoUnit,
    }
}
