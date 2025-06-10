export interface ClienteDemo {
    id: string;        // UUID o string simple
    rut: string;       // RUT chileno sin puntos, con guion
    nombre: string;
    email: string;
    telefono: string;
    direccion: string;
}

export const CLIENTES_DEMO: ClienteDemo[] = [
    {
        id: 'cli-001',
        rut: '12.345.678-5',
        nombre: 'Juan',
        email: 'contacto@andes.cl',
        telefono: '+56 9 8765 4321',
        direccion: 'Av. Apoquindo 4500, Las Condes, Santiago',
    },
    {
        id: 'cli-002',
        rut: '76.543.210-K',
        nombre: 'Ferretería El Martillo',
        email: 'ventas@martillo.cl',
        telefono: '+56 2 2345 6789',
        direccion: 'Ruta 5 Km 12, Rancagua',
    },
    {
        id: 'cli-003',
        rut: '17.890.123-4',
        nombre: 'Inmobiliaria Sur Ltda.',
        email: 'info@inmsur.cl',
        telefono: '+56 9 7654 3210',
        direccion: 'O’Higgins 123, Concepción',
    },
    {
        id: 'cli-004',
        rut: '15.678.901-2',
        nombre: 'Particular — Lucas',
        email: 'juan.perez@gmail.com',
        telefono: '+56 9 9123 4567',
        direccion: 'Pasaje Los Robles 456, La Florida, Santiago',
    },
    {
        id: 'cli-005',
        rut: '98.765.432-1',
        nombre: 'Contratista Norte Grande',
        email: 'contacto@nortegrande.cl',
        telefono: '+56 57 265 7890',
        direccion: 'Av. Grecia 789, Antofagasta',
    },
];