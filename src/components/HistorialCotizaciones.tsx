import React, { useState, useEffect } from 'react';
import { cotizacionService, CotizacionSimplificada } from '@/services/apiService';
import DetalleCotizacionModal from './DetalleCotizacionModal';

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

const HistorialCotizaciones: React.FC = () => {
  const [cotizaciones, setCotizaciones] = useState<CotizacionSimplificada[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCotizacionId, setSelectedCotizacionId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchCotizaciones();
  }, []);

  const fetchCotizaciones = async () => {
    try {
      setLoading(true);
      const data = await cotizacionService.obtenerCotizacionesSimplificadas();
      setCotizaciones(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar cotizaciones');
    } finally {
      setLoading(false);
    }
  };

  const handleVerDetalle = (cotizacionId: number) => {
    setSelectedCotizacionId(cotizacionId);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedCotizacionId(null);
  };

  const getEstadoColor = (estado: string) => {
    switch (estado.toLowerCase()) {
      case 'pendiente':
        return 'text-yellow-600';
      case 'aprobada':
        return 'text-green-600';
      case 'rechazada':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-full">
        <div className="border rounded-lg shadow bg-white">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="ml-2 text-gray-600">Cargando cotizaciones...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-full">
        <div className="border rounded-lg shadow bg-white">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-red-500">⚠️</span>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
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
              {cotizaciones.map((cotizacion) => (
                <tr key={cotizacion.id} className="hover:bg-gray-50">
                  <td className="px-3 py-2 border-b border-r">#{cotizacion.sec_externa}</td>
                  <td className="px-3 py-2 border-b border-r">{new Date(cotizacion.fecha_crea).toLocaleDateString()}</td>
                  <td className="px-3 py-2 border-b border-r">{cotizacion.cliente.nombre}</td>
                  <td className="px-3 py-2 border-b border-r max-w-xs truncate" title={cotizacion.nombre}>{cotizacion.nombre}</td>
                  <td className="px-3 py-2 border-b border-r">{cotizacion.total_items}</td>
                  <td className="px-3 py-2 border-b border-r">{cotizacion.total_precio.toLocaleString()}</td>
                  <td className={`px-3 py-2 border-b border-r font-medium ${getEstadoColor(cotizacion.estado)}`}>{cotizacion.estado}</td>
                  <td className="px-3 py-2 border-b text-center">
                    <button 
                      className="mx-1 text-blue-600 hover:underline" 
                      title="Ver detalle"
                      onClick={() => handleVerDetalle(cotizacion.id)}
                    >
                      <span role="img" aria-label="ver">🔍</span>
                    </button>
                    <button className="mx-1 text-green-600 hover:underline" title="Editar">
                      <span role="img" aria-label="editar">✏️</span>
                    </button>
                    <button className="mx-1 text-red-600 hover:underline" title="Eliminar">
                      <span role="img" aria-label="eliminar">🗑️</span>
                    </button>
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
      
      {/* Modal de detalle */}
      {showModal && selectedCotizacionId && (
        <DetalleCotizacionModal
          cotizacionId={selectedCotizacionId}
          isOpen={showModal}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default HistorialCotizaciones;
