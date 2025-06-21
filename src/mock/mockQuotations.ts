export interface Quotation {
  id: string;
  fecha: string; // yyyy-mm-dd
  cliente: string;
  rut: string;
  estado: 'Aprobada' | 'Pendiente' | 'Rechazada';
  total: number;
}

// create 30 mock quotations
export const QUOTATIONS: Quotation[] = Array.from({ length: 30 }).map((_, i) => {
  const estados = ['Aprobada', 'Pendiente', 'Rechazada'] as const;
  const estado = estados[i % estados.length];
  const fecha = `2025-05-${(i % 28 + 1).toString().padStart(2, '0')}`;
  return {
    id: String(i + 1),
    fecha,
    cliente: `Cliente ${(i % 5) + 1}`,
    rut: `${i + 1}2345678-${i % 9}`,
    estado,
    total: 10000 + i * 1000,
  } as Quotation;
});
