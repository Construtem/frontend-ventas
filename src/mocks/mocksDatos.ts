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
    descripcion: string
    precio: number
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
    ComunaDespacho: string
    ciudadCespacho: string 
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
        {
        id: 'c2',
        documentoId: '19582475-3',
        tipoCliente: 'Persona',
        nombre: 'Alejandra',
        apellido: 'Lucero',
        telefono: '56949954956',
        email: 'ALucero@utem.cl',
    },
]

export const addresses: Address[] = [
    {
        id: 'a1',
        clienteId: 'c1',
        nombre: 'Casa Principal',
        direccion: 'abc abc 2921',
        comuna: 'Ñuñoa',
        ciudad: 'Santiago',
    },
        {
        id: 'a2',
        clienteId: 'c2',
        nombre: 'Casa Azul',
        direccion: 'abc abc 482',
        comuna: 'Ñuñoa',
        ciudad: 'Santiago',
    },
    {
        id: 'a2',
        clienteId: 'c1',
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
        descripcion: 'Acero',
        precio: 12990,
    },
    {
        sku: '100039293',
        nombre: 'Sierra circular',
        descripcion: 'Makita',
        precio: 120000,
    },
]

export const quotations: Quotation[] = [
    {
        id: 'q1',
        clienteId: 'c1',
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
        ComunaDespacho: 'Cerrillos',
        ciudadCespacho: 'Santiago', 
    },
    {
        id: 'q2',
        clienteId: 'c1',
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
        ComunaDespacho: 'El Bosque',
        ciudadCespacho: 'Santiago',
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

