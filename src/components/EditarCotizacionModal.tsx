import React, { useState, useEffect } from 'react';
import { cotizacionService, Cotizacion } from '@/services/apiService';

interface EditarCotizacionModalProps {
  cotizacion: Cotizacion;
  isOpen: boolean;
  onClose: () => void;
  onSave?: (cotizacion: Cotizacion) => void;
}

const EditarCotizacionModal: React.FC<EditarCotizacionModalProps> = ({
  cotizacion,
  isOpen,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<Cotizacion>(cotizacion);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setFormData(cotizacion);
    }
  }, [isOpen, cotizacion]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const updatedCotizacion = await cotizacionService.editarCotizacion(formData.id, formData);
      if (onSave) {
        onSave(updatedCotizacion);
      }
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar la cotización');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData(cotizacion);
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl max-h-[90vh] overflow-y-auto m-4">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Editar Cotización #{formData.sec_externa}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nombre */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre de la cotización
              </label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* RUT Cliente */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                RUT Cliente
              </label>
              <input
                type="text"
                name="rut_cliente"
                value={formData.rut_cliente}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Estado */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado
              </label>
              <select
                name="estado"
                value={formData.estado}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Pendiente">Pendiente</option>
                <option value="Aprobada">Aprobada</option>
                <option value="Rechazada">Rechazada</option>
              </select>
            </div>

            {/* Tipo de Despacho */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Despacho
              </label>
              <select
                name="tipo_despacho"
                value={formData.tipo_despacho}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Retiro en tienda">Retiro en tienda</option>
                <option value="Despacho a domicilio">Despacho a domicilio</option>
              </select>
            </div>

            {/* Total Productos Neto */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total Productos (Neto)
              </label>
              <input
                type="number"
                name="total_productos_neto"
                value={formData.total_productos_neto || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Total Productos IVA */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total Productos (IVA)
              </label>
              <input
                type="number"
                name="total_productos_iva"
                value={formData.total_productos_iva || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Total Despacho */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total Despacho
              </label>
              <input
                type="number"
                name="total_despacho"
                value={formData.total_despacho || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Total Descuento */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total Descuento
              </label>
              <input
                type="number"
                name="total_descuento"
                value={formData.total_descuento || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Total Cotización */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total Cotización
              </label>
              <input
                type="number"
                name="total_cotizacion"
                value={formData.total_cotizacion || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Descripción */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción
            </label>
            <textarea
              name="descripcion"
              value={formData.descripcion || ''}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Descripción de la cotización..."
            />
          </div>

          {/* Información de despacho (solo si es despacho a domicilio) */}
          {formData.tipo_despacho === 'Despacho a domicilio' && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="text-md font-semibold text-gray-900 mb-4">Información de despacho</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Comuna
                  </label>
                  <input
                    type="text"
                    name="comuna_despacho"
                    value={formData.comuna_despacho || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ciudad
                  </label>
                  <input
                    type="text"
                    name="ciudad_despacho"
                    value={formData.ciudad_despacho || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Botones */}
          <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-2 px-4 rounded"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
            >
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditarCotizacionModal;
