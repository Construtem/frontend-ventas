import React, { useState, useEffect } from 'react';
import { cotizacionService, CotizacionSimplificada } from '@/services/apiService';

interface HistorialCotizacionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCotizacion?: (cotizacion: CotizacionSimplificada) => void;
}

const HistorialCotizacionModal: React.FC<HistorialCotizacionModalProps> = ({
  isOpen,
  onClose,
  onSelectCotizacion,
}) => {
  const [cotizaciones, setCotizaciones] = useState<CotizacionSimplificada[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCotizaciones, setFilteredCotizaciones] = useState<CotizacionSimplificada[]>([]);

  useEffect(() => {
    if (isOpen) {
      fetchHistorialCotizaciones();
    }
  }, [isOpen]);

  useEffect(() => {
    // Filtrar cotizaciones basado en el término de búsqueda
    if (!searchTerm) {
      setFilteredCotizaciones(cotizaciones);
      return;
    }
    
    const filtered = cotizaciones.filter((cotizacion) => {
      return (
        safeStringIncludes(cotizacion.nombre, searchTerm) ||
        safeStringIncludes(cotizacion.sec_externa, searchTerm) ||
        safeStringIncludes(cotizacion.cliente?.nombre, searchTerm) ||
        safeStringIncludes(cotizacion.estado, searchTerm)
      );
    });
    setFilteredCotizaciones(filtered);
    console.log('Término de búsqueda:', searchTerm);
    console.log('Cotizaciones filtradas:', filtered.length);
  }, [cotizaciones, searchTerm]);

  const fetchHistorialCotizaciones = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await cotizacionService.obtenerCotizacionesSimplificadas();
      console.log('Datos obtenidos del backend:', data);
      setCotizaciones(data);
      setFilteredCotizaciones(data); // Inicializar las cotizaciones filtradas
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar el historial de cotizaciones');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCotizacion = (cotizacion: CotizacionSimplificada) => {
    if (onSelectCotizacion) {
      onSelectCotizacion(cotizacion);
    }
    handleClose();
  };

  const handleClose = () => {
    setCotizaciones([]);
    setFilteredCotizaciones([]);
    setSearchTerm('');
    setError(null);
    onClose();
  };

  const getEstadoColor = (estado: string) => {
    switch (estado.toLowerCase()) {
      case 'pendiente':
        return 'bg-yellow-600 text-yellow-100';
      case 'aprobada':
        return 'bg-green-600 text-green-100';
      case 'rechazada':
        return 'bg-red-600 text-red-100';
      default:
        return 'bg-gray-600 text-gray-100';
    }
  };

  // Función auxiliar para búsqueda segura
  const safeStringIncludes = (str: string | null | undefined, search: string): boolean => {
    if (!str || typeof str !== 'string') return false;
    return str.toLowerCase().includes(search.toLowerCase());
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#0B1631] rounded-lg shadow-xl max-w-5xl max-h-[90vh] overflow-hidden m-4">
        {/* Header oscuro */}
        <div className="bg-[#0B1631] text-white p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Cotizaciones</h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-white text-2xl font-bold"
            >
              ×
            </button>
          </div>
          
          {/* Barra de búsqueda */}
          <div className="mt-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-400">🔍</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#0B1631] text-white p-6 overflow-y-auto max-h-[60vh]">
          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <span className="ml-2 text-gray-300">Cargando historial...</span>
            </div>
          )}

          {error && (
            <div className="bg-red-900 border border-red-600 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <span className="text-red-400">⚠️</span>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-300">Error</h3>
                  <p className="text-sm text-red-200">{error}</p>
                </div>
              </div>
            </div>
          )}

          {!loading && !error && (
            <div className="overflow-hidden">
              <table className="w-full text-white">
                <thead>
                  <tr className="border-b border-gray-600">
                    <th className="text-left py-3 px-4 font-medium">ID</th>
                    <th className="text-left py-3 px-4 font-medium">Nombre</th>
                    <th className="text-left py-3 px-4 font-medium">Fecha</th>
                    <th className="text-left py-3 px-4 font-medium">Cantidad</th>
                    <th className="text-left py-3 px-4 font-medium">Total</th>
                    <th className="text-left py-3 px-4 font-medium">Estado</th>
                    <th className="text-left py-3 px-4 font-medium">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCotizaciones.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-8 text-center text-gray-400">
                        {searchTerm ? 'No se encontraron cotizaciones con los criterios de búsqueda' : 'No hay cotizaciones disponibles'}
                      </td>
                    </tr>
                  ) : (
                    filteredCotizaciones.map((cotizacion) => (
                      <tr key={cotizacion.id} className="border-b border-gray-700 hover:bg-gray-700">
                        <td className="py-3 px-4 text-sm">{cotizacion.id}</td>
                        <td className="py-3 px-4 text-sm">{cotizacion.nombre}</td>
                        <td className="py-3 px-4 text-sm">
                          {new Date(cotizacion.fecha_crea).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4 text-sm">{cotizacion.total_items}</td>
                        <td className="py-3 px-4 text-sm">{cotizacion.total_precio.toLocaleString()}</td>
                        <td className="py-3 px-4 text-sm">
                          <span className={`px-2 py-1 rounded text-xs ${getEstadoColor(cotizacion.estado)}`}>
                            {cotizacion.estado}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm">
                          <button
                            onClick={() => handleSelectCotizacion(cotizacion)}
                            className="text-blue-400 hover:text-blue-300 underline"
                          >
                            Seleccionar
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-[#0B1631] p-4 flex justify-end">
          <button
            onClick={handleClose}
            className="px-6 py-2 border border-white bg-[#0B1631] text-white rounded hover:bg-[#15295C]"
          >
            Salir
          </button>
        </div>
      </div>
    </div>
  );
};

export default HistorialCotizacionModal;
