import React, { useState } from 'react';
import DetalleCotizacionCard from './DetalleCotizacionCard';
import DetalleCotizacionModal from './DetalleCotizacionModal';
import HistorialCotizacionModal from './HistorialCotizacionModal';
import { CotizacionSimplificada } from '@/services/apiService';

const EjemploComponentesCotizacion: React.FC = () => {
  const [showHistorialModal, setShowHistorialModal] = useState(false);
  const [showDetalleModal, setShowDetalleModal] = useState(false);
  const [selectedCotizacionId, setSelectedCotizacionId] = useState<number | null>(null);

  const handleSelectCotizacion = (cotizacion: CotizacionSimplificada) => {
    setSelectedCotizacionId(cotizacion.id);
    setShowDetalleModal(true);
  };

  const handleEdit = (cotizacion: any) => {
    console.log('Editando cotización:', cotizacion);
    // Aquí puedes implementar la lógica de edición
  };

  const handleDelete = (cotizacionId: number) => {
    console.log('Eliminando cotización:', cotizacionId);
    // Aquí puedes implementar la lógica de eliminación
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Componentes de Cotización con APIs
      </h1>

      {/* Botones de ejemplo */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setShowHistorialModal(true)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Abrir Historial de Cotizaciones
        </button>
        <button
          onClick={() => {
            setSelectedCotizacionId(1); // ID de ejemplo
            setShowDetalleModal(true);
          }}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Ver Detalle Cotización #1
        </button>
      </div>

      {/* Ejemplo de DetalleCotizacionCard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <DetalleCotizacionCard
          cotizacionId={1}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
        <DetalleCotizacionCard
          cotizacionId={2}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
        <DetalleCotizacionCard
          cotizacionId={3}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      {/* Modales */}
      <HistorialCotizacionModal
        isOpen={showHistorialModal}
        onClose={() => setShowHistorialModal(false)}
        onSelectCotizacion={handleSelectCotizacion}
      />

      {selectedCotizacionId && (
        <DetalleCotizacionModal
          cotizacionId={selectedCotizacionId}
          isOpen={showDetalleModal}
          onClose={() => {
            setShowDetalleModal(false);
            setSelectedCotizacionId(null);
          }}
          onEdit={handleEdit}
        />
      )}
    </div>
  );
};

export default EjemploComponentesCotizacion;
