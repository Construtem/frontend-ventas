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
    /** 1 = Persona | 2 = Empresa (según tu BD) */
    tipo_id:      number;
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
export interface CotizacionItem {
    cotizacion_id: number;
    producto_id:   string;
    sucursal_id:   number;
    cantidad:      number;

    producto: DBProducto;
    sucursal: DBSucursal;
}

/* Respuesta principal: una cotización */
export interface DBCotizacion {
    id:            number;
    fecha_crea:    string; // ISO 8601
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

    /* (mantén aquí otros métodos: obtenerClientes(), crearCliente(), etc.) */
};

