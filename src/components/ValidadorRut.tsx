import { useState } from 'react'

export const formatearRut = (rut: string): string => {

  const rutLimpio = rut.replace(/[^0-9kK]/g, '').toUpperCase()
  
  if (rutLimpio.length < 2) return rutLimpio
  
  const cuerpo = rutLimpio.slice(0, -1)
  const dv = rutLimpio.slice(-1)

  const cuerpoFormateado = cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  
  return `${cuerpoFormateado}-${dv}`
}

export const validarRut = (rut: string): boolean => {

  const rutLimpio = rut.replace(/[^0-9kK]/g, '').toUpperCase()
  
  if (rutLimpio.length < 8 || rutLimpio.length > 9) return false
  
  const cuerpo = rutLimpio.slice(0, -1)
  const dv = rutLimpio.slice(-1)
  
  if (!/^\d+$/.test(cuerpo)) return false
  
  let suma = 0
  let multiplicador = 2
  
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += parseInt(cuerpo[i]) * multiplicador
    multiplicador = multiplicador === 7 ? 2 : multiplicador + 1
  }
  
  const resto = suma % 11
  const dvCalculado = resto === 0 ? '0' : resto === 1 ? 'K' : (11 - resto).toString()
  
  return dv === dvCalculado
}


export const limpiarRut = (rut: string): string => {
  return rut.replace(/[^0-9kK]/g, '').toUpperCase()
}


export const useRutValidation = (initialValue: string = '') => {
  const [rut, setRut] = useState(initialValue)
  const [isValid, setIsValid] = useState(false)
  const [showError, setShowError] = useState(false)
  
    const handleRutChange = (value: string) => {
    // Solo permite números, guion y K/k
    const regex = /^[0-9\-kK]*$/
    if (!regex.test(value)) return

    const guionIndex = value.indexOf('-')
    if (guionIndex !== -1 && value.length > guionIndex + 2) {
        return
    }

    setRut(value)
    setShowError(false)

    if (value.length >= 8) {
        const valid = validarRut(value)
        setIsValid(valid)
        if (!valid) setShowError(true)
    } else {
        setIsValid(false)
    }
    }
  
    const formatRut = () => {
        setRut(rut)
    }
  
  return {
    rut,
    isValid,
    showError,
    handleRutChange,
    formatRut,
    setShowError,
    setRut
  }
}