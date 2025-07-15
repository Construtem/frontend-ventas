'use client'
import React, { useState, useEffect } from 'react';
import { clienteService, cotizacionService } from '@/services/apiService';

const TestApiPage = () => {
  const [clientes, setClientes] = useState(null);
  const [cotizaciones, setCotizaciones] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const testApi = async () => {
      try {
        setLoading(true);
        console.log('Probando API de clientes...');
        const clientesData = await clienteService.obtenerClientes();
        console.log('Clientes:', clientesData);
        setClientes(clientesData);

        console.log('Probando API de cotizaciones...');
        const cotizacionesData = await cotizacionService.obtenerCotizacionesSimplificadas();
        console.log('Cotizaciones:', cotizacionesData);
        setCotizaciones(cotizacionesData);
      } catch (err) {
        console.error('Error en test API:', err);
        setError(err.message || 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    testApi();
  }, []);

  if (loading) return <div className="p-4">Cargando...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Test API Connection</h1>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Clientes ({clientes?.length || 0})</h2>
        <div className="bg-gray-100 p-4 rounded">
          {clientes?.slice(0, 3).map((cliente, index) => (
            <div key={index} className="mb-2">
              <strong>{cliente.nombre}</strong> - {cliente.rut}
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Cotizaciones ({cotizaciones?.length || 0})</h2>
        <div className="bg-gray-100 p-4 rounded">
          {cotizaciones?.slice(0, 3).map((cot, index) => (
            <div key={index} className="mb-2">
              <strong>#{cot.id}</strong> - {cot.cliente.nombre} - {cot.estado}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestApiPage;
