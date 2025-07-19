const API_BASE_URL = process.env.NEXT_PUBLIC_API_VENTAS || 'https://api-ventas.tssw.cl';

// -----------------------------------------------------------------------------
// 1)  TIPOS ─────────────────────────────────────────────────────────────────────
// -----------------------------------------------------------------------------

/* Cliente devuelto por la API */
export interface DBCliente {
    nombre:       string;
    telefono:     string;
    email:        string | null;
    razon_social: string | null;
    rut:          string;
    direccion:   DireccionCliente[];
    comuna:       string | null;
    ciudad:       string | null;
    /** 1 = Persona | 2 = Empresa (según tu BD) */
    tipo_id:      number;
}
export interface DireccionCliente {
    id:number;
    direccion:       string;
    comuna: string;
    ciudad:      string;
    rut_cliente?:          string;
}
export interface DraftItem {
    sku:        string
    nombre:     string
    sucursalId: number
    sucursal:   string
    cantidad:   number
    precio:     number
    descuento:  number
}

/* Usuario (vendedor / creador) */
export interface DBUsuario {
    email: string;
    nombre: string;
    rol_id: number;
}

/* Producto dentro del ítem */
export interface DBProducto {
    sku:         string;
    nombre:      string;
    descripcion: string;
    precio:      number;
}

/* Sucursal simplificada (viene anidada en el ítem) */
export interface DBSucursal {
    id:     number;
    nombre: string;
}

/* Ítem de la cotización */
/* Ítem de la cotización (versión ampliada) */
export interface CotizacionItem {
    /* ——— claves mínimas ——— */
    sku: string;
    cotizacion_id: number
    producto_id:   string
    sucursal_id:   number
    cantidad:      number

    /* ——— objetos anidados que trae la API ——— */
    producto?:  DBProducto      // original
    producto2?: DBProducto      // algunas rutas lo llaman “producto2”

    sucursal?:  DBSucursal      // original
    sucursal2?: DBSucursal      // algunas rutas lo llaman “sucursal2”

    /* ——— campos calculados / planos que también puede traer ——— */
    nombre?:          string        // nombre de producto en respuestas simplificadas
    precio_unitario?: number        // precio en algunas rutas
    precio?:          number        // precio en items de checkout
    descuento?:       number        // % ó $ de descuento que aplique
}
/* Respuesta principal: una cotización */
export interface DBCotizacion {
    id:            number;
    fecha_crea:    string; // ISO 8601
    direccionId: number | null;
    estado:        'aprobada' | 'rechazada' | 'pendiente';
    costo_envio:   number;
    rut_cliente:   string;
    user_id:       string;
    tipo_despacho: string;
    total:         number;
    descripcion:   string;
    /** Vacío = sin registrar | 'pendiente' | 'pagado' (ajusta si tu API envía otros) */
    estado_pago:   '' | 'pendiente' | 'pagado';

    cliente:  DBCliente;
    usuario:  DBUsuario;
    items:    CotizacionItem[];

    total_items:  number;
    total_precio: number;
}
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
/**
 * Historial de cotizaciones de un cliente por RUT.
 *
 * @example
 * const historial = await clienteService.obtenerHistorialCotizaciones('11111111-1');
 */
export const clienteService = {
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
    }



    /* (mantén aquí otros métodos: obtenerClientes(), crearCliente(), etc.) */
};

