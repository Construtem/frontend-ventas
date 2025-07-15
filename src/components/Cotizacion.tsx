'use client'

import { useState, useEffect } from 'react';
import { cotizacionService, CotizacionSimplificada, Cliente } from '@/services/apiService';
import DetalleCotizacionModal from './DetalleCotizacionModal';

interface CotizacionProps {
  clienteSeleccionado?: Cliente | null;
}

export default function Cotizacion({ clienteSeleccionado }: CotizacionProps) {
  const [cotizaciones, setCotizaciones] = useState<CotizacionSimplificada[]>([]);
  const [cotizacionActual, setCotizacionActual] = useState<CotizacionSimplificada | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Función para normalizar RUT (remover puntos y guiones)
  const normalizarRut = (rut: string): string => {
    return rut.replace(/[.\-]/g, '').toLowerCase();
  };

  useEffect(() => {
    const fetchCotizacionesCliente = async () => {
      if (!clienteSeleccionado) {
        console.log('Cotizacion.tsx: No hay cliente seleccionado');
        setCotizaciones([]);
        setCotizacionActual(null);
        return;
      }

      try {
        console.log('Cotizacion.tsx: Cargando cotizaciones para cliente:', clienteSeleccionado);
        setLoading(true);
        setError(null);
        // Obtener todas las cotizaciones y filtrar por cliente
        const todasCotizaciones = await cotizacionService.obtenerCotizacionesSimplificadas();
        console.log('Cotizacion.tsx: Todas las cotizaciones obtenidas:', todasCotizaciones);
        
        const cotizacionesCliente = todasCotizaciones.filter(
          cot => normalizarRut(cot.cliente.rut) === normalizarRut(clienteSeleccionado.rut)
        );
        console.log('Cotizacion.tsx: Cotizaciones filtradas para cliente:', cotizacionesCliente);
        console.log('Cotizacion.tsx: RUT cliente seleccionado normalizado:', normalizarRut(clienteSeleccionado.rut));
        console.log('Cotizacion.tsx: RUTs de todas las cotizaciones:', todasCotizaciones.map(cot => ({
          id: cot.id,
          rut: cot.cliente.rut,
          rutNormalizado: normalizarRut(cot.cliente.rut)
        })));
        
        setCotizaciones(cotizacionesCliente);
        
        // Seleccionar la cotización más reciente si existe
        if (cotizacionesCliente.length > 0) {
          const cotizacionMasReciente = cotizacionesCliente.sort(
            (a, b) => new Date(b.fecha_crea || '').getTime() - new Date(a.fecha_crea || '').getTime()
          )[0];
          console.log('Cotizacion.tsx: Cotización más reciente seleccionada:', cotizacionMasReciente);
          setCotizacionActual(cotizacionMasReciente);
        } else {
          console.log('Cotizacion.tsx: No hay cotizaciones para este cliente');
          setCotizacionActual(null);
        }
      } catch (err) {
        console.error('Cotizacion.tsx: Error al cargar cotizaciones:', err);
        setError(err instanceof Error ? err.message : 'Error al cargar las cotizaciones');
      } finally {
        setLoading(false);
      }
    };

    fetchCotizacionesCliente();
  }, [clienteSeleccionado]);

  const getEstadoColor = (estado: string) => {
    switch (estado.toLowerCase()) {
      case 'pendiente':
        return 'bg-yellow-200 text-yellow-800';
      case 'aprobada':
        return 'bg-green-200 text-green-800';
      case 'rechazada':
        return 'bg-red-200 text-red-800';
      default:
        return 'bg-gray-200 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="mb-4 ml-7 bg-white border border-gray-300 rounded-lg w-[770]">
        <div className="ml-8 mr-8 py-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-2/3 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-4 ml-7 bg-white border border-gray-300 rounded-lg w-[770]">
        <div className="ml-8 mr-8 py-6">
          <div className="text-red-500">Error: {error}</div>
        </div>
      </div>
    );
  }

  if (!clienteSeleccionado) {
    return (
      <div className="mb-4 ml-7 bg-white border border-gray-300 rounded-lg w-[770]">
        <div className="ml-8 mr-8 py-6">
          <div className="text-gray-500 text-center">
            <p className="text-lg font-medium">Seleccione un cliente</p>
            <p className="text-sm">Para ver los detalles de la cotización</p>
          </div>
        </div>
      </div>
    );
  }

  if (!cotizacionActual) {
    return (
      <div className="mb-4 ml-7 bg-white border border-gray-300 rounded-lg w-[770]">
        <div className="ml-8 mr-8 py-6">
          <div className="text-gray-500 text-center">
            <p className="text-lg font-medium">No hay cotizaciones</p>
            <p className="text-sm">El cliente seleccionado no tiene cotizaciones</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-4 ml-7 bg-white border border-gray-300 rounded-lg w-[770]">
      <div className="ml-8 mr-8">
        <div className="flex mt-3">
          <div className="mb-2 text-lg text-[#5B83C5] font-bold flex gap-2">
            Cotización #{cotizacionActual.sec_externa}
          </div>

          {/*Boton Estado*/}
          <div className="ml-107">
            <button className={`px-3 py-1 mr-2 font-bold text-black rounded ${getEstadoColor(cotizacionActual.estado)}`}>
              {cotizacionActual.estado}
            </button>
          </div>
        </div>        

        <table className="w-full text-left">
          <thead>
            <tr className="">
              <th className="border-t border-[#D1D5DC] p-2">Nombre</th>
              <td className="border-t border-[#D1D5DC] p-2">{cotizacionActual.nombre}</td>
            </tr>
          </thead>
          <tbody> 
            <tr>
              <th className="border-t border-[#D1D5DC] p-2">Descripción</th>
              <td className="border-t border-[#D1D5DC] p-2">
                {cotizacionActual.nombre} - Cotización para {cotizacionActual.cliente.nombre}
              </td>                                                      
            </tr>
            <tr>
              <th className="border-t border-[#D1D5DC] p-2">Tipo de Envío</th>
              <td className="border-t border-[#D1D5DC] p-2">{cotizacionActual.tipo_despacho}</td>
            </tr>
            <tr>
              <th className="border-t border-[#D1D5DC] p-2">Dirección</th>
              <td className="border-t border-[#D1D5DC] p-2">
                {cotizacionActual.tipo_despacho === 'a domicilio' ? 'Despacho a domicilio' : 'Retiro en tienda'}
              </td>
            </tr>
          </tbody>
        </table>

        <div className="flex justify-end mt-4 mb-4">
          <button
            className="px-3 py-1 mr-2 text-white bg-[#2563B6] hover:bg-[#1F5399] rounded cursor-pointer"
            onClick={() => setShowModal(true)}
          >
            Editar info
          </button>
        </div>
      </div>

      {/* Modal de detalle */}
      {showModal && (
        <DetalleCotizacionModal
          cotizacionId={cotizacionActual.id}
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onEdit={(cotizacion) => {
            console.log('Editar cotización:', cotizacion);
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
}
