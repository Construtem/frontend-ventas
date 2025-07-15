import React, { useState, useEffect } from 'react';
import { cotizacionService, Cotizacion } from '@/services/apiService';
import EditarCotizacionModal from './EditarCotizacionModal';

interface DetalleCotizacionModalProps {
  cotizacionId: number;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (cotizacion: Cotizacion) => void;
}

const DetalleCotizacionModal: React.FC<DetalleCotizacionModalProps> = ({
  cotizacionId,
  isOpen,
  onClose,
  onEdit,
}) => {
  const [cotizacion, setCotizacion] = useState<Cotizacion | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    if (isOpen && cotizacionId) {
      fetchCotizacionCompleta();
    }
  }, [isOpen, cotizacionId]);

  const fetchCotizacionCompleta = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await cotizacionService.obtenerCotizacionCompleta(cotizacionId);
      setCotizacion(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar la cotización');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    if (cotizacion) {
      setShowEditModal(true);
    }
  };

  const handleEditSave = (updatedCotizacion: Cotizacion) => {
    setCotizacion(updatedCotizacion);
    setShowEditModal(false);
    if (onEdit) {
      onEdit(updatedCotizacion);
    }
  };

  const handleEditClose = () => {
    setShowEditModal(false);
  };

  const handleClose = () => {
    setCotizacion(null);
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  const getEstadoColor = (estado: string) => {
    switch (estado.toLowerCase()) {
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'aprobada':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'rechazada':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl max-h-[90vh] overflow-y-auto m-4">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Detalle de Cotización
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        <div className="p-6">
          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <span className="ml-2 text-gray-600">Cargando cotización...</span>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
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
          )}

          {cotizacion && (
            <div className="space-y-6">
              {/* Información principal */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Cotización #{cotizacion.sec_externa}
                    </h3>
                    <p className="text-sm text-gray-500">ID: {cotizacion.id}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getEstadoColor(cotizacion.estado)}`}>
                      {cotizacion.estado}
                    </span>
                    {onEdit && (
                      <button
                        onClick={handleEdit}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-sm"
                      >
                        Editar
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Nombre:</label>
                    <p className="mt-1 text-sm text-gray-900">{cotizacion.nombre}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">RUT Cliente:</label>
                    <p className="mt-1 text-sm text-gray-900">{cotizacion.rut_cliente}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Fecha:</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {cotizacion.fecha ? new Date(cotizacion.fecha).toLocaleDateString() : 'No disponible'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Tipo de despacho:</label>
                    <p className="mt-1 text-sm text-gray-900">{cotizacion.tipo_despacho}</p>
                  </div>
                </div>

                {cotizacion.descripcion && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700">Descripción:</label>
                    <p className="mt-1 text-sm text-gray-900">{cotizacion.descripcion}</p>
                  </div>
                )}
              </div>

              {/* Información de despacho */}
              {cotizacion.tipo_despacho === 'Despacho a domicilio' && (
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="text-md font-semibold text-gray-900 mb-3">Información de despacho</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Comuna:</label>
                      <p className="mt-1 text-sm text-gray-900">{cotizacion.comuna_despacho || 'No especificada'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Ciudad:</label>
                      <p className="mt-1 text-sm text-gray-900">{cotizacion.ciudad_despacho || 'No especificada'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">ID Dirección:</label>
                      <p className="mt-1 text-sm text-gray-900">{cotizacion.direccion_despacho_id || 'No especificada'}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Resumen financiero */}
              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="text-md font-semibold text-gray-900 mb-3">Resumen financiero</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Subtotal productos (neto):</span>
                    <span className="text-sm font-medium text-gray-900">
                      ${cotizacion.total_productos_neto?.toLocaleString() || '0'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">IVA productos:</span>
                    <span className="text-sm font-medium text-gray-900">
                      ${cotizacion.total_productos_iva?.toLocaleString() || '0'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total despacho:</span>
                    <span className="text-sm font-medium text-gray-900">
                      ${cotizacion.total_despacho?.toLocaleString() || '0'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total descuento:</span>
                    <span className="text-sm font-medium text-red-600">
                      -${cotizacion.total_descuento?.toLocaleString() || '0'}
                    </span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between">
                      <span className="text-lg font-bold text-gray-900">Total cotización:</span>
                      <span className="text-lg font-bold text-gray-900">
                        ${cotizacion.total_cotizacion?.toLocaleString() || '0'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={handleClose}
            className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-2 px-4 rounded"
          >
            Cerrar
          </button>
        </div>
      </div>
      
      {/* Modal de edición */}
      {cotizacion && (
        <EditarCotizacionModal
          cotizacion={cotizacion}
          isOpen={showEditModal}
          onClose={handleEditClose}
          onSave={handleEditSave}
        />
      )}
    </div>
  );
};

export default DetalleCotizacionModal;
