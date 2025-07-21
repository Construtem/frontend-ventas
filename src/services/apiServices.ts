const API_BASE_URL = process.env.NEXT_PUBLIC_API_VENTAS || 'https://api-ventas.tssw.cl';

// -----------------------------------------------------------------------------
// 1)  TIPOS ─────────────────────────────────────────────────────────────────────
// -----------------------------------------------------------------------------

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
    /** Stock real en ese origen        */ stock: number
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
}

/* Respuesta principal: una cotización */
export interface DBCotizacion {
    id:            number
    fecha_crea:    string                // ISO 8601
    direccionId:   number | null
    estado:        'aprobada' | 'rechazada' | 'pendiente'
    costo_envio?:   number
    rut_cliente?:   string
    user_id?:       string
    tipo_despacho?: string
    total:         number
    descripcion:   string
    direccion?:    DireccionCliente      | undefined


    /** '' = sin registrar | 'pendiente' | 'pagado' */
    estado_pago:   '' | 'pendiente' | 'pagado'

    cliente:       DBCliente
    usuario:       DBUsuario
    items:         CotizacionItem[]

    total_items:   number
    total_precio:  number
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