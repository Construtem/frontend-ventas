'use client'
import { useState, useEffect } from 'react'
import { sucursalService, type Sucursal } from '@/services/apiService'

export const useSucursales = () => {
  const [sucursales, setSucursales] = useState<Sucursal[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const cargarSucursales = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await sucursalService.obtenerSucursales()
        setSucursales(data)
      } catch (err) {
        setError('Error al cargar sucursales')
        console.error('Error:', err)
      } finally {
        setLoading(false)
      }
    }

    cargarSucursales()
  }, [])

  return { sucursales, loading, error }
}