// Tipos compartidos para Cotizaciones

export type EstadoCotizacion =
    | 'Pendiente'
    | 'Aprobada'
    | 'Rechazada'
    | 'Vencida';

export interface Entrega {
    tipo: string;
    direccion?: string;
    region?: string;
    comuna?: string;
    costo: number;
}

export interface HistorialEntrada {
    estado: string;
    fecha: string;    // ISO 8601 o '—' mientras sea placeholder
    usuario: string;
}

export interface ProductoInfo {
    nombre: string;
    sku?: string;
}

export interface DetalleItem {
    producto_id: number;
    cantidad: number;
    precio_unitario: number;
    producto?: ProductoInfo;
}

export interface Cotizacion {
    id: number;
    fecha: string;            // ISO 8601
    estado: EstadoCotizacion;
    total?: number;

    cliente?: {
        nombre: string;
        rut: string;
        email?: string;
        telefono?: string;
    };

    entrega: Entrega;
    detalle_cotizacion: DetalleItem[];
    historial: HistorialEntrada[];
}
