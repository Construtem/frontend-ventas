const API_BASE_URL = process.env.NEXT_PUBLIC_API_VENTAS || 'https://api-ventas.tssw.cl';
const API_BASE_URL_INVENTARIO = process.env.NEXT_PUBLIC_API_INVENTARIO || 'https://inventario-ventas.tssw.cl';

// -----------------------------------------------------------------------------
// 1)  TIPOS ─────────────────────────────────────────────────────────────────────
// -----------------------------------------------------------------------------
export function adaptToDBCotizacion(data: CotizacionCheckout): DBCotizacion {
    return {
        /* ─── campos raíz ─────────────────── */
        id: data.id,
        fecha_crea: data.fecha_crea,
        estado: data.estado as 'aprobada' | 'rechazada' | 'pendiente',
        estado_pago: data.estado_pago as '' | 'pendiente' | 'pagado',

        tipo_despacho: data.tipo_despacho,
        costo_envio: data.costo_envio ?? 0,

        subtotal_neto: data.subtotal_neto ?? 0,
        subtotal: data.subtotal ?? 0,
        total: data.total ?? 0,
        iva: data.iva ?? 0,
        descuento_total: data.descuento_total ?? 0,

        descripcion: data.descripcion ?? '',
        /* si guardas estos campos en BD ponlos, si no déjalos en null */
        direccionId: null,
        rut_cliente: data.cliente.rut,
        user_id: data.usuario.email,

        /* ─── cliente ─────────────────────── */
        cliente: {
            rut: data.cliente.rut,
            nombre: data.cliente.nombre,
            telefono: data.cliente.telefono ?? null,
            email: data.cliente.email ?? null,
            razon_social: data.cliente.razon_social ?? null,
            /* estos dos no vienen, los dejamos vacíos */
            comuna: null,
            ciudad: null,
            tipo_id: 2,
            direccion: [],
        },

        /* ─── dirección (puede ser opcional) ─ */
        direccion: data.direccion
            ? {
                id: 0, // id ficticio si aún no existe en BD
                direccion: data.direccion.direccion,
                comuna: data.direccion.comuna,
                ciudad: data.direccion.ciudad,
            }
            : undefined,
        direccion_id: undefined,

        /* ─── usuario ─────────────────────── */
        usuario: {
            nombre: data.usuario.nombre,
            email: data.usuario.email,
            rol_id: data.usuario.rol_id ?? 0,
        },

        /* ─── ítems ───────────────────────── */
        items: data.items.map((it) => ({
            /* claves mínimas */
            sku: it.sku,
            cotizacion_id: data.id,
            producto_id: it.sku,
            sucursal_id: 0,

            cantidad: it.cantidad,

            /* anidados vacíos si no los tienes aún */
            producto: {
                sku: it.sku,
                nombre: it.nombre,
                descripcion: '',
                precio: it.precio_unitario,
            },
            sucursal: {
                id: 0,
                nombre: it.sucursal,
            },

            /* campos planos */
            nombre: it.nombre,
            precio_unitario: it.precio_unitario,
            descuento: it.descuento,
            subtotal: it.subtotal,
        })),

        total_items: data.items.reduce((s, i) => s + i.cantidad, 0),
        total_precio: data.subtotal ?? 0,
    }
}

export function adaptToCotizacionCheckout(data: DBCotizacion): CotizacionCheckout {
    return {
        ...data,
        cliente: {
            ...data.cliente,
            email: data.cliente.email ?? '',
            telefono: data.cliente.telefono ?? '',
            razon_social: data.cliente.razon_social ?? '',
        },
        direccion: data.direccion ?? { direccion: '', comuna: '', ciudad: '' },
        usuario: {
            ...data.usuario,
            email: data.usuario.email ?? '',
            nombre: data.usuario.nombre ?? '',
        },
        items: (data.items ?? []).map(item => ({
            nombre: item.nombre ?? '',
            descuento: item.descuento ?? 0,
            sku: item.sku ?? '',
            cantidad: item.cantidad ?? 0,
            precio_unitario: item.precio_unitario ?? 0,
            subtotal: item.subtotal ?? 0,
            sucursal: item.sucursal?.nombre ?? '',
        })),
        subtotal_neto: data.subtotal_neto ?? 0,
        descuento_total: data.descuento_total ?? 0,
        iva: data.iva ?? 0,
        total: data.total ?? 0,
    }
}


/* Cliente devuelto por la API */
export interface DBCliente {
    nombre:        string
    telefono:      string
    email:         string | null
    razon_social:  string | null
    rut:           string
    direccion:     DireccionCliente[]
    comuna:        string | null
    ciudad:        string | null
    /** 1 = Persona | 2 = Empresa (según tu BD) */
    tipo_id:       number
}

export interface DireccionCliente {
    id:        number
    direccion: string
    comuna:    string
    ciudad:    string
    rut_cliente?: string
}

/* -------------------------------------------------------------------------- */
/*  NUEVO: tipos auxiliares para los productos del endpoint inventario        */
/* -------------------------------------------------------------------------- */

/** Bodega (o sucursal) extra donde también hay stock */
export interface BodegaInfo {
    sucursal_id: number
    nombre:      string
    tipo_id:     number               // 1 = Bodega, 2 = Tienda, etc. (según tu BD)
    stock:       number
    descuento:   number               // % aplicado a esa bodega
}

/** Producto tal como lo devuelve `/productos/inventario` */
export interface ProductoInventario {
    sku:                 string
    nombre:              string
    descripcion:         string
    precio:              number
    stock_sucursal:      number
    descuento_sucursal:  number
    bodegas:             BodegaInfo[] | null
    total_stock_bodegas: number
}

/** Resultado que usamos en findSource (identifica el origen elegido) */
export interface SourceInfo {
    nombre:    string
    stock:     number
    descuento: number
}

/* -------------------------------------------------------------------------- */
/*  Drafts para la cotización                                                 */
/* -------------------------------------------------------------------------- */

export interface DraftItem {
    sku:        string
    nombre:     string
    sucursalId: number
    sucursal:   string
    cantidad:   number
    precio:     number
    descuento:  number
}

export interface DraftProducto {
    /** SKU único                       */ sku: string
    /** Nombre visible                  */ nombre: string
    /** Id de la sucursal elegida       */ sucursalId: number
    /** Nombre “origen” mostrado        */ origen: string
    /** Stock real en ese origen        */ stock?: number
    /** Descuento % aplicado en origen  */ descuento: number           // 0-100
    /** Precio unitario base            */ precioUnit: number
    /** Cantidad elegida                */ cantidad: number
    /** Precio *después* de descuento   */ netoUnit: number            // precioUnit - %
    /** Total = netoUnit * cantidad     */ total: number
}

/* Usuario (vendedor / creador) */
export interface DBUsuario {
    email:  string
    nombre: string
    rol_id: number
}

/* Producto dentro del ítem de una cotización guardada */
export interface DBProducto {
    sku:         string
    nombre:      string
    descripcion: string
    precio:      number
}

/* Sucursal simplificada (anidada en el ítem) */
export interface DBSucursal {
    id:     number
    nombre: string
}

/* Ítem de la cotización (versión flexible) */
export interface CotizacionItem {
    /* ——— claves mínimas ——— */
    sku:           string
    cotizacion_id: number
    producto_id:   string
    sucursal_id:   number
    cantidad:      number

    /* ——— objetos anidados que trae la API ——— */
    producto:   DBProducto
    producto2?: DBProducto       | undefined

    sucursal?:  DBSucursal       | undefined
    sucursal2?: DBSucursal       | undefined

    /* ——— campos planos según la ruta ——— */
    nombre?:          string     | undefined
    precio_unitario?: number     | undefined
    precio?:          number     | undefined
    descuento?:       number     | undefined
    subtotal?:        number     | undefined
}

/* Respuesta principal: una cotización */
export type DBCotizacion = {
    id: number
    fecha_crea: string
    estado: 'aprobada' | 'rechazada' | 'pendiente'
    estado_pago: '' | 'pendiente' | 'pagado'
    direccionId?: number | null   // 👈  nuevo / ya usado
    total_items?: number
    rut_cliente?: string | null
    user_id?: string | null         // 👈  nuevo / ya usado
    total_precio?: number           // 👈  nuevo / ya usado
    tipo_despacho?: string
    costo_envio?: number
    subtotal_neto?: number            // 👈  nuevo / ya usado
    subtotal?: number                 // 👈  nuevo / ya usado
    total?: number
    iva?: number                      // 👈  nuevo / ya usado
    descuento_total?: number          // 👈  nuevo / ya usado
    descripcion?: string
    direccion_id?: number | null // 👈  nuevo / ya usado
    cliente: {
        rut: string
        nombre: string
        telefono?: string | null
        email?: string | null
        razon_social?: string | null
        comuna?: string | null
        ciudad?: string | null
        tipo_id?: number | null              // 1 = Persona | 2 = Empresa
        direccion?: DireccionCliente[] // si no tienes direcciones, déjalo como []
    }

    direccion?: {
        id?: number
        direccion: string
        comuna: string
        ciudad: string
    }

    usuario: {
        nombre?: string
        email?: string
        rol_id: number
    }

    items: CotizacionItem[]
}

/* DTO nuevos/ya existentes --------------------------------------------------*/
export interface NuevaDireccionDTO {
    rut_cliente: string
    direccion:   string
    comuna:      string
    ciudad:      string
}

export interface DireccionCreada {
    id:        number
    direccion: string
    comuna:    string
    ciudad:    string
}

export interface DireccionCreadaMsg {
    [k: string]: string
}

export interface CreateClientePayload {
    nombre:       string
    telefono:     string
    email?:       string
    razon_social?: string
    rut:          string
    /** 1 = Persona · 2 = Empresa */
    tipo_id:      1 | 2
}

export interface InventarioResponse {
    page:             number
    limit:            number
    total_items:      number
    total_pages:      number
    sucursal_id:      number
    productos:        ProductoInventario[]
}
export interface ProductoInventario {
    sku:         string
    nombre:      string
    descripcion: string
    precio:      number

    // stock / descuento de la sucursal elegida
    stock_sucursal:      number
    descuento_sucursal:  number

    /* Bodegas adicionales que tienen stock de este SKU          */
    bodegas: {
        sucursal_id: number
        nombre:      string
        tipo_id:     number           // 1 = Bodega, 2 = Tienda  (según tu BD)
        stock:       number
        descuento:   number
    }[] | null

    total_stock_bodegas: number     // suma de stocks de bodegas
}


export interface Sucursal {
    id: number
    nombre: string
    telefono: string
    direccion: string
    comuna: string
    ciudad: string
    tipo_id: number
    tipo: {
        id: number
        nombre: string
    }
}

export interface PreviewDespacho {
    id:              number;   // siempre 0 en el preview
    cotizacion_id:   number;
    camion_id:       number;
    origen:          number;
    destino:         number;
    fecha_despacho:  string;   // ISO-8601
    valor_despacho:  number;   // CLP
    cantidad_items:  number;
    total_kg:        number;
    distancia_km:    number;
    tiempo_estimado: number;   // minutos
}

export type CotizacionCheckout = {
    id: number
    fecha_crea: string
    estado: string
    estado_pago: string
    tipo_despacho?: string
    costo_envio?: number
    subtotal_neto: number
    total: number
    subtotal?: number
    descripcion?: string
    iva?: number
    descuento_total?: number
    direccionId?: number | null
    cliente: {
        nombre: string
        email?: string
        rut: string
        telefono?: string
        razon_social?: string
    }
    direccion?: {
        ciudad: string
        comuna: string
        direccion: string
    }
    usuario: {
        nombre: string
        email: string
        rol_id?: number
            }
    items: {
        nombre: string
        descuento: number
        sku: string
        cantidad: number
        precio_unitario: number
        subtotal: number
        sucursal: string
    }[]
}




/**
 * Historial de cotizaciones de un cliente por RUT.
 *
 * @example
 * const historial = await clienteService.obtenerHistorialCotizaciones('11111111-1');
 */
export const clienteService = {
    async obtenerClientes(): Promise<DBCliente[]> {
        const res = await fetch(`${API_BASE_URL}/api/clientes`, {
            next: { revalidate: 60 } // ej. ISR en Next – ajústalo o bórralo si no usas Next 13+
        });

        if (!res.ok) {
            throw new Error(`Error ${res.status} al obtener clientes`);
        }

        /** Type assert: forzamos a que el JSON cumpla DBCliente[] */
        return (await res.json()) as DBCliente[];
    },
    async obtenerHistorialCotizaciones(rut: string): Promise<DBCotizacion[]> {
        const res = await fetch(`${API_BASE_URL}/api/cotizaciones/cliente/${rut}/historial`, {
            // Si la API requiere HEADERS / Auth añádelos aquí
            next: { revalidate: 60 } // ej. ISR en Next – ajústalo o bórralo si no usas Next 13+
        });

        if (!res.ok) {
            throw new Error(`Error ${res.status} al obtener historial de cotizaciones`);
        }

        /** Type assert: forzamos a que el JSON cumpla DBCotizacion[] */
        return (await res.json()) as DBCotizacion[];
    },

    async obtenerDireccionDelCliente(rut: string | null): Promise<DireccionCliente[]> {
        const res = await fetch(`${API_BASE_URL}/api/clientes/${rut}/direcciones`, {
            next: { revalidate: 60 } // ej. ISR en Next – ajústalo o bórralo si no usas Next 13+
        });

        if (!res.ok) {
            throw new Error(`Error ${res.status} al obtener dirección del cliente`);
        }

        /** Type assert: forzamos a que el JSON cumpla DBCliente */
        return await res.json()

    },

    async  crearDireccion(data: NuevaDireccionDTO): Promise<DireccionCreadaMsg> {
        const res = await fetch(`${API_BASE_URL}/api/nuevaDireccion`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify(data),
        })

        if (res.status !== 201) {
            // Si tu backend enviara más info de error, léela con res.json()
            throw new Error(`El servidor respondió ${res.status}`)
        }

        // Si no necesitas el mensaje podrías simplemente:
        // return { ok: true } as const
        return res.json()             // => { "direccion creado al rut con rut": "11111111-1" }
    },

    async crearCliente(
        payload: CreateClientePayload,
    ): Promise<{ mensaje: string }> {
        const res = await fetch(`${API_BASE_URL}/api/clientes`, {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify(payload),
        });

        if (!res.ok) {
            throw new Error(`Crear cliente ${res.status}: ${await res.text()}`);
        }
        return res.json();                // { "direccion creado al rut con rut": "11111111-1" }
    }
    /* (mantén aquí otros métodos: obtenerClientes(), crearCliente(), etc.) */
};

export const sucursalService = {
    async obtenerSucursales(): Promise<Sucursal[]> {
        const res = await fetch(`${API_BASE_URL}/api/sucursales`, {
            next: { revalidate: 60 } // ej. ISR en Next – ajústalo o bórralo si no usas Next 13+
        });

        if (!res.ok) {
            throw new Error(`Error ${res.status} al obtener sucursales`);
        }

        /** Type assert: forzamos a que el JSON cumpla Sucursal[] */
        return (await res.json()) as Sucursal[];
    }
}

export async function obtenerProductosInventario (
    sucursalId: number,
    page       = 1,
    limit      = 100,
): Promise<InventarioResponse> {

    const url = `${API_BASE_URL}/api/productos/inventario` +
        `?sucursal_id=${sucursalId}&page=${page}&limit=${limit}`

    const res = await fetch(url, { next: { revalidate: 0 } }) // sin cache
    if (!res.ok) {
        const msg = await res.text()
        throw new Error(`Inventario · ${res.status}: ${msg}`)
    }
    return res.json() as Promise<InventarioResponse>
}



export async function crearCotizacion(body: {
    rut_cliente:   string;
    user_id:       string;
    tipo_despacho: string;
    costo_envio:   number;
    descripcion?:  string;
    total: number;
}): Promise<{ id: number }> {
    const r = await fetch(`${API_BASE_URL}/api/cotizaciones`, {
        method : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body   : JSON.stringify(body),
    });
    if (!r.ok) throw new Error('No se pudo crear la cotización');
    return r.json();                // { id: <nuevoId>, ... }
}

export async function crearItemCotizacion(
    cotizacionId: number,
    item: {
        producto_id: string;
        sucursal_id: number;
        cantidad:    number;
    },
): Promise<void> {
    const r = await fetch(
        `${API_BASE_URL}/api/cotizaciones/${cotizacionId}/items`,
        {
            method : 'POST',
            headers: { 'Content-Type': 'application/json' },
            body   : JSON.stringify(item),
        },
    );
    if (!r.ok) throw new Error('No se pudo agregar ítem');
}

export async function obtenerTodasLasCotizaciones(): Promise<DBCotizacion[]> {
    const res = await fetch(`${API_BASE_URL}/api/cotizaciones`);
    if (!res.ok) throw new Error(`Error ${res.status} al obtener cotizaciones`);
    return (await res.json()) as DBCotizacion[];
}


export async function calcularDespacho(
    cotizacionId : number,
    dirClienteId : number,
): Promise<PreviewDespacho[]> {

    const r = await fetch(`${API_BASE_URL_INVENTARIO}/api/despachos/calcular`, {
        method : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body   : JSON.stringify({
            cotizacion_id : cotizacionId,
            dir_cliente_id: dirClienteId,
        }),
    });

    if (!r.ok) {
        const msg = await r.text();
        throw new Error(`Calcular despacho · ${r.status}: ${msg}`);
    }
    return r.json() as Promise<PreviewDespacho[]>;
}


export async function actualizarCostoEnvioCotizacion (
    cotizacionId: number,
    costoEnvio  : number,
): Promise<void> {

    const r = await fetch(`${API_BASE_URL}/api/cotizaciones/${cotizacionId}`, {
        method : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body   : JSON.stringify({ costo_envio: costoEnvio }),
    });

    if (!r.ok) {
        const msg = await r.text();
        throw new Error(`PUT cotización · ${r.status}: ${msg}`);
    }
}
export async function actualizarDatosCotizacion (
    cotizacionId: number,
    payload: Partial<{
        costo_envio: number;
        total:       number;
    }>,
): Promise<void> {
    const r = await fetch(`${API_BASE_URL}/api/cotizaciones/${cotizacionId}`, {
        method : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body   : JSON.stringify(payload),
    });

    if (!r.ok) {
        const msg = await r.text();
        throw new Error(`PUT cotización · ${r.status}: ${msg}`);
    }
}
export interface CheckoutInfo {
    /** url o token para pasarela, monto, etc.  Ajusta a tu respuesta real */
    urlPago:      string
    totalPagar:   number
    moneda:       string
    vencimiento?: string
}


export async function checkoutCotizacion (id: number): Promise<CotizacionCheckout> {
    const r = await fetch(`${API_BASE_URL}/api/cotizaciones/checkout/${id}`, {
        method : 'GET',
        headers: { 'Content-Type': 'application/json' },
    })

    if (!r.ok) {
        const msg = await r.text().catch(() => r.statusText)
        throw new Error(`Checkout falló (${r.status}): ${msg}`)
    }

    return (await r.json()) as CotizacionCheckout
}

export async function checkoutTodasCotizaciones(): Promise<CotizacionCheckout[]> {
    const r = await fetch(`${API_BASE_URL}/api/cotizaciones/checkout`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });

    if (!r.ok) {
        const msg = await r.text().catch(() => r.statusText);
        throw new Error(`Checkout global falló (${r.status}): ${msg}`);
    }

    return (await r.json()) as CotizacionCheckout[];
}

// Eliminar cotización por ID
export const eliminarCotizacion = async (id: number): Promise<void> => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_VENTAS}/api/cotizaciones/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            const msg = await response.text().catch(() => response.statusText);
            throw new Error(`Error al eliminar la cotización (${response.status}): ${msg}`);
        }
    } catch (error) {
        console.error('Error al eliminar la cotización:', error);
        throw error;
    }
}