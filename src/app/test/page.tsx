'use client'
import React, { useState, useEffect } from 'react';
import { cotizacionService, CotizacionSimplificada } from '@/services/apiService';

const TestPage = () => {
  const [data, setData] = useState<CotizacionSimplificada[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Iniciando fetch...');
        const cotizaciones = await cotizacionService.obtenerCotizacionesSimplificadas();
        console.log('Datos recibidos:', cotizaciones);
        setData(cotizaciones);
      } catch (err) {
        console.error('Error al obtener datos:', err);
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Test API Connection</h1>
      <pre className="bg-gray-100 p-4 rounded overflow-auto">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
};

export default TestPage;
