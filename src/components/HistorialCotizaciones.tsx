import React from 'react';
import { quotations, clients } from '@/mocks/mocksDatos';

const columns = [
  'ID Cotización',
  'Fecha',
  'Cliente',
  'Descripción',
  'Total Productos',
  'Total',
  'Estado',
  'Acciones',
];

const getClientName = (clientId: string) => {
  const client = clients.find((c) => c.id === clientId);
  return client ? `${client.nombre} ${client.apellido}` : 'Desconocido';
};

const HistorialCotizaciones: React.FC = () => {
  return (
    <div className="w-full max-w-full">
      <div className="border rounded-lg shadow bg-white">
        <div style={{display: 'flex', flexDirection: 'row'}}>
          <div
            className="overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200"
            style={{ maxHeight: '220px', minHeight: '120px', width: '100%' }}
          >
            <table className="w-full text-xs md:text-sm text-left border-collapse">
            <thead className="bg-gray-100 sticky top-0 z-10">
              <tr>
                {columns.map((col, idx) => (
                  <th
                    key={col}
                    className={
                      `px-3 py-2 border-b border-r font-semibold text-gray-700 whitespace-nowrap` +
                      (idx === columns.length - 1 ? ' border-r-0' : '')
                    }
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {quotations.map((q) => (
                <tr key={q.id} className="hover:bg-gray-50">
                  <td className="px-3 py-2 border-b border-r">{q.id}</td>
                  <td className="px-3 py-2 border-b border-r">{new Date(q.fecha).toLocaleDateString()}</td>
                  <td className="px-3 py-2 border-b border-r">{getClientName(q.clientId)}</td>
                  <td className="px-3 py-2 border-b border-r max-w-xs truncate" title={q.descripcion}>{q.descripcion}</td>
                  <td className="px-3 py-2 border-b border-r">{q.totalProductosNeto.toLocaleString()}</td>
                  <td className="px-3 py-2 border-b border-r">{q.totalCotizacion.toLocaleString()}</td>
                  <td className="px-3 py-2 border-b border-r">{q.estado}</td>
                  <td className="px-3 py-2 border-b text-center">
                    <button className="mx-1 text-blue-600 hover:underline" title="Ver"><span role="img" aria-label="ver">🔍</span></button>
                    <button className="mx-1 text-green-600 hover:underline" title="Editar"><span role="img" aria-label="editar">✏️</span></button>
                    <button className="mx-1 text-red-600 hover:underline" title="Eliminar"><span role="img" aria-label="eliminar">🗑️</span></button>
                  </td>
                </tr>
              ))}
            </tbody>
            </table>
          </div>
          {/* Scrollbar visual indicator (fake, for visual alignment) */}
          <div style={{width:'8px', minHeight:'120px', maxHeight:'220px', background:'#d1d5db', borderRadius:'4px', opacity:0.7, marginLeft:'2px'}}></div>
        </div>
      </div>
    </div>
  );
};

export default HistorialCotizaciones;
