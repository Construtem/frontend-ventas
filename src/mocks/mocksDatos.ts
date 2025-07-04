// mocksDatos.ts

// 1. Tipos que reflejan las tablas de tu BD

export interface User {
    id: string
    nombre: string
    tienda: string
    rol: 'VENDEDOR' | 'ADMIN' | 'GERENTE'
}

export interface Client {
    id: string
    documentoId: string
    tipoCliente: 'Persona' | 'Empresa'
    nombre: string
    apellido: string
    telefono: string
    email: string
}

export interface Address {
    id: string
    clientId: string        // FK → Client.id
    nombre: string          // “Casa Principal”, “Oficina”, etc.
    direccion: string
    comuna: string
    ciudad: string
}

export interface Product {
    sku: string
    nombre: string
    marca: string
    precioNeto: number
    precioIVA: number
    anchoMm: number
    altoMm: number
    largoMm: number
    pesoKg: number
}

export interface Quotation {
    id: string
    clientId: string        // FK → Client.id
    secExterna: string
    nombre: string
    descripcion: string
    tipoDespacho: 'Retiro en tienda' | 'Despacho a domicilio'
    direccionDespachoId: string   // FK → Address.id
    fecha: string
    estado: 'Pendiente' | 'Aprobada' | 'Rechazada'
    totalProductosNeto: number
    totalProductosIVA: number
    totalDespacho: number
    totalDescuento: number
    totalCotizacion: number
}

export interface QuotationItem {
    id: string
    quotationId: string    // FK → Quotation.id
    sku: string            // FK → Product.sku
    cantidad: number
    precioNeto: number
    precioIVA: number
    calculado: number
    valorDespacho: number
    descuento: number
    mejorPrecio: number
}

// Interfaces para el historial de cotizaciones
export interface QuotationHistoryItem {
    id: string
    fecha: string
    accion: string
    usuario?: {
        id: string
        nombre: string
    }
    detalles?: string
}


// 2. Datos MOCK simulando filas de BD

export const users: User[] = [
    {
        id: 'u1',
        nombre: 'JOHN DOE',
        tienda: 'Nombre Tienda',
        rol: 'VENDEDOR',
    },
]

export const clients: Client[] = [
    {
        id: 'c1',
        documentoId: '20474207-3',
        tipoCliente: 'Persona',
        nombre: 'Nicolás',
        apellido: 'Jiménez',
        telefono: '56949677526',
        email: 'njimenezr@utem.cl',
    },
]

export const addresses: Address[] = [
    {
        id: 'a1',
        clientId: 'c1',
        nombre: 'Casa Principal',
        direccion: 'abc abc 2921',
        comuna: 'Ñuñoa',
        ciudad: 'Santiago',
    },
    {
        id: 'a2',
        clientId: 'c1',
        nombre: 'Oficina Central',
        direccion: 'Av. Providencia 1234',
        comuna: 'Providencia',
        ciudad: 'Santiago',
    },
]

export const products: Product[] = [
    {
        sku: '100039292',
        nombre: 'Martillo',
        marca: 'Acero',
        precioNeto: 12990,
        precioIVA: 14990,
        anchoMm: 200,
        altoMm: 1000,
        largoMm: 200,
        pesoKg: 0.1,
    },
    {
        sku: '100039293',
        nombre: 'Sierra circular',
        marca: 'Makita',
        precioNeto: 120000,
        precioIVA: 138000,
        anchoMm: 250,
        altoMm: 1200,
        largoMm: 250,
        pesoKg: 3.5,
    },
]

export const quotations: Quotation[] = [
    {
        id: 'q1',
        clientId: 'c1',
        secExterna: '123403',
        nombre: 'Cotización ejemplo',
        descripcion:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent fermentum.',
        tipoDespacho: 'Retiro en tienda',
        direccionDespachoId: 'a1',
        fecha: '2025-06-27T10:30:00Z',
        estado: 'Pendiente',
        totalProductosNeto: 145980,     // 2×12990 + 1×120000
        totalProductosIVA: 167980,      // 2×14990 + 1×138000
        totalDespacho: 3990,
        totalDescuento: 3990,           // aplicamos un descuento en Martillo
        totalCotizacion: 167980 + 3990 - 3990,
    },
    {
        id: 'q2',
        clientId: 'c1',
        secExterna: '123404',
        nombre: 'Segunda cotización',
        descripcion: 'Cambio de diseño en la fachada del local.',
        tipoDespacho: 'Despacho a domicilio',
        direccionDespachoId: 'a2',
        fecha: '2025-05-21T14:00:00Z',
        estado: 'Aprobada',
        totalProductosNeto: 360000,     // 3×120000
        totalProductosIVA: 414000,      // 3×138000
        totalDespacho: 5500,
        totalDescuento: 0,
        totalCotizacion: 414000 + 5500,
    },
]

export const quotationItems: QuotationItem[] = [
    // Ítems de q1
    {
        id: 'qi1',
        quotationId: 'q1',
        sku: '100039292',
        cantidad: 2,
        precioNeto: 12990,
        precioIVA: 14990,
        calculado: 14990 * 2,
        valorDespacho: 2990,
        descuento: 3990,
        mejorPrecio: 13990,
    },
    {
        id: 'qi2',
        quotationId: 'q1',
        sku: '100039293',
        cantidad: 1,
        precioNeto: 120000,
        precioIVA: 138000,
        calculado: 138000,
        valorDespacho: 0,
        descuento: 0,
        mejorPrecio: 138000,
    },

    // Ítems de q2
    {
        id: 'qi3',
        quotationId: 'q2',
        sku: '100039293',
        cantidad: 3,
        precioNeto: 120000,
        precioIVA: 138000,
        calculado: 138000 * 3,
        valorDespacho: 5500,
        descuento: 0,
        mejorPrecio: 138000,
    },
]

// Datos mock para el historial de cotizaciones
export const quotationHistory: QuotationHistoryItem[] = [
    {
        id: '10029302',
        fecha: '2024-06-19T14:30:00-04:00',
        accion: 'Creada',
        usuario: {
            id: 'u1',
            nombre: 'Nombre cotización'
        },
        detalles: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent fermentum.'
    },
    {
        id: '10029303',
        fecha: '2024-06-19T15:45:00-04:00',
        accion: 'Modificación de detalle',
        usuario: {
            id: 'u1',
            nombre: 'Nombre cotización'
        },
        detalles: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent fermentum.'
    },
    {
        id: '10029304',
        fecha: '2024-06-19T16:20:00-04:00',
        accion: 'Cambio de estado',
        usuario: {
            id: 'u1',
            nombre: 'Nombre cotización'
        },
        detalles: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent fermentum.'
    },
    {
        id: '10029306',
        fecha: '2024-06-19T17:15:00-04:00',
        accion: 'Modificación de detalle',
        usuario: {
            id: 'u1',
            nombre: 'Nombre cotización'
        },
        detalles: 'Agregado nuevo producto a la cotización.'
    },
    {
        id: '10029307',
        fecha: '2024-06-19T18:30:00-04:00',
        accion: 'Cambio de estado',
        usuario: {
            id: 'u1',
            nombre: 'Nombre cotización'
        },
        detalles: 'Estado cambiado a Pendiente por revisión.'
    },
    {
        id: '10029308',
        fecha: '2024-06-20T09:00:00-04:00',
        accion: 'Modificación de detalle',
        usuario: {
            id: 'u1',
            nombre: 'Nombre cotización'
        },
        detalles: 'Actualización de cantidades y precios.'
    },
    // Historial para la segunda cotización
    {
        id: '10029305',
        fecha: '2024-06-20T10:15:00-04:00',
        accion: 'Creada',
        usuario: {
            id: 'u1',
            nombre: 'Nombre cotización'
        },
        detalles: 'Cambio de diseño en la fachada del local.'
    }
]

// Función helper para obtener historial por cotización
export const getQuotationHistory = (quotationId: string): QuotationHistoryItem[] => {
    // Por simplicidad, devolvemos el historial de la primera cotización para 'q1'
    // y un historial básico para las demás
    if (quotationId === 'q1') {
        return quotationHistory.slice(0, 6) // Devolver 6 registros para ver el scroll
    } else if (quotationId === 'q2') {
        return [quotationHistory[6]]
    }
    return []
}
