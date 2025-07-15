import React, { useState, useEffect } from 'react';
import { cotizacionService, CotizacionSimplificada } from '@/services/apiService';

interface DetalleCotizacionCardProps {
  cotizacionId: number;
  onEdit?: (cotizacion: CotizacionSimplificada) => void;
  onDelete?: (cotizacionId: number) => void;
}

const DetalleCotizacionCard: React.FC<DetalleCotizacionCardProps> = ({
  cotizacionId,
  onEdit,
  onDelete,
}) => {
  const [cotizacion, setCotizacion] = useState<CotizacionSimplificada | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCotizacion = async () => {
      try {
        setLoading(true);
        const data = await cotizacionService.obtenerCotizacionSimplificada(cotizacionId);
        setCotizacion(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar la cotización');
      } finally {
        setLoading(false);
      }
    };

    fetchCotizacion();
  }, [cotizacionId]);

  const handleEdit = () => {
    if (cotizacion && onEdit) {
      onEdit(cotizacion);
    }
  };

  const handleDelete = async () => {
    if (cotizacion && onDelete && window.confirm('¿Estás seguro de que deseas eliminar esta cotización?')) {
      onDelete(cotizacion.id);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-2/3 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-1/3"></div>
      </div>
    );
  }

  if (error) {
    return (
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
    );
  }

  if (!cotizacion) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <p className="text-gray-500 text-center">No se encontró la cotización</p>
      </div>
    );
  }

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
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      {/* Header con número de cotización y estado */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-blue-600">
          Cotización #{cotizacion.sec_externa}
        </h2>
        <span className={`px-3 py-1 rounded border text-sm font-medium ${getEstadoColor(cotizacion.estado)}`}>
          {cotizacion.estado}
        </span>
      </div>

      {/* Información en formato tabla */}
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <p className="text-sm text-gray-900">{cotizacion.nombre}</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
          <p className="text-sm text-gray-900">
            {cotizacion.nombre} - Cotización para {cotizacion.cliente.nombre}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Envío</label>
            <p className="text-sm text-gray-900">{cotizacion.tipo_despacho}</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
          <p className="text-sm text-gray-900">
            {cotizacion.tipo_despacho === 'Retiro tienda' ? 'Retiro en tienda' : 'Despacho a domicilio'}
          </p>
        </div>
      </div>

      {/* Botón de editar */}
      <div className="mt-6 flex justify-end">
        {onEdit && (
          <button
            onClick={handleEdit}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Editar información
          </button>
        )}
      </div>
    </div>
  );
};

export default DetalleCotizacionCard;
