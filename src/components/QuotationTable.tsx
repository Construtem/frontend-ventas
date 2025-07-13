'use client'
import React, { useState, useEffect } from 'react'
import { quotations, quotationItems } from '../mocks/mocksDatos'
import api from '../api'

interface QuotationTableProps {
    quotationId?: string
}

const QuotationTable: React.FC<QuotationTableProps> = ({ quotationId = 'q1' }) => {
    // Estados para el modal y búsqueda
    const [showPickApplet, setShowPickApplet] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [searchType, setSearchType] = useState<'sku' | 'nombre'>('sku')
    const [selectedProducts, setSelectedProducts] = useState<any[]>([])
    const [despachoConfirmado, setDespachoConfirmado] = useState(false)
    const [productosConfirmados, setProductosConfirmados] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [saveError, setSaveError] = useState<string|null>(null)
    const [saveSuccess, setSaveSuccess] = useState<string|null>(null)
    const [paySuccess, setPaySuccess] = useState<string|null>(null)
    

    // Obtener la cotización específica
    const quotation = quotations.find(q => q.id === quotationId)
    const items = quotationItems.filter(item => item.quotationId === quotationId)

    // Estado para productos desde API
    const [products, setProducts] = useState<any[]>([])
    const [loadingProducts, setLoadingProducts] = useState(false)
    const [errorProducts, setErrorProducts] = useState<string | null>(null)

    useEffect(() => {
        setLoadingProducts(true)
        api.get('/productos')
            .then(res => {
                // Mapeo adaptado a la estructura real de la API
                const rawProducts = Array.isArray(res.data) ? res.data : [];
                const mapped = rawProducts.map((p: any) => ({
                    sku: p.sku,
                    nombre: p.nombre,
                    descripcion: p.descripcion,
                    marca: p.proveedor?.marca || '',
                    precioNeto: p.precio,
                    precioIVA: Math.round((p.precio || 0) * 1.19),
                    anchoMm: p.ancho,
                    altoMm: p.alto,
                    largoMm: p.largo,
                    pesoKg: p.peso,
                }))
                setProducts(mapped)
                setErrorProducts(null)
            })
            .catch(err => {
                setErrorProducts('Error al cargar productos')
            })
            .then(() => setLoadingProducts(false))
    }, [])

    if (!quotation) {
        return <div>Cotización no encontrada</div>
    }

    const filteredProducts = products.filter(product => {
        if (!searchTerm) return true
        if (searchType === 'sku') {
            return product.sku.startsWith(searchTerm)
        } else {
            return product.nombre.toLowerCase().includes(searchTerm.toLowerCase())
        }
    })

    // Crear datos de la tabla combinando items con productos
    // Combina productos seleccionados con los de la cotización
    // Agrupa productos seleccionados por SKU y suma cantidades
    const selectedGrouped = selectedProducts.reduce((acc: any, prod: any) => {
        const found = acc.find((p: any) => p.sku === prod.sku)
        if (found) {
            found.cantidad += 1
        } else {
            acc.push({ ...prod, cantidad: 1 })
        }
        return acc
    }, [])

    const tableData = [
        ...items.map(item => {
            // Buscar producto en la API para obtener nombre y marca
            const product = products.find((p: any) => p.sku === item.sku)
            return {
                ...item,
                nombre: product ? product.nombre : '',
                marca: product ? product.marca : '',
                precioNeto: product ? product.precioNeto : item.precioNeto,
                precioIVA: product ? product.precioIVA : item.precioIVA,
                anchoMm: product ? product.anchoMm : 0,
                altoMm: product ? product.altoMm : 0,
                largoMm: product ? product.largoMm : 0,
                pesoKg: product ? product.pesoKg : 0,
            }
        }),
        ...selectedGrouped.map((product: any) => ({
            sku: product.sku,
            nombre: product.nombre,
            marca: product.marca,
            cantidad: product.cantidad,
            precioNeto: product.precioNeto,
            precioIVA: product.precioIVA,
            calculado: product.precioIVA * product.cantidad,
            anchoMm: product.anchoMm,
            altoMm: product.altoMm,
            largoMm: product.largoMm,
            pesoKg: product.pesoKg,
            valorDespacho: 0,
            descuento: 0,
            mejorPrecio: product.precioIVA,
        }))
    ]

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-CL', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount)
    }

    const formatDecimal = (value: number) => {
        return value.toFixed(1)
    }

    return (
        <div className="bg-white border border-gray-300 p-4 max-w-7xl mx-auto">
            {loadingProducts && <div className="text-center text-gray-500">Cargando productos...</div>}
            {errorProducts && <div className="text-center text-red-500">{errorProducts}</div>}
            {saveError && <div className="text-center text-red-500">{saveError}</div>}
            {saveSuccess && <div className="text-center text-green-600">{saveSuccess}</div>}
            {paySuccess && <div className="text-center text-green-600">{paySuccess}</div>}
            {/* Header */}
            <div className="mb-9">
                <div className="flex items-center gap-2 mb-2">
                    <h2 className="text-lg font-bold text-black">Productos Cotización</h2>
                    <div className="w-5 h-5 flex items-center justify-center border border-gray-400 cursor-pointer" style={{background:'#b2c4ff'}}>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 456 511.82" width="10" height="10">
                        <path fill="#FD3B3B" d="M48.42 140.13h361.99c17.36 0 29.82 9.78 28.08 28.17l-30.73 317.1c-1.23 13.36-8.99 26.42-25.3 26.42H76.34c-13.63-.73-23.74-9.75-25.09-24.14L20.79 168.99c-1.74-18.38 9.75-28.86 27.63-28.86zM24.49 38.15h136.47V28.1c0-15.94 10.2-28.1 27.02-28.1h81.28c17.3 0 27.65 11.77 27.65 28.01v10.14h138.66c.57 0 1.11.07 1.68.13 10.23.93 18.15 9.02 18.69 19.22.03.79.06 1.39.06 2.17v42.76c0 5.99-4.73 10.89-10.62 11.19-.54 0-1.09.03-1.63.03H11.22c-5.92 0-10.77-4.6-11.19-10.38 0-.72-.03-1.47-.03-2.23v-39.5c0-10.93 4.21-20.71 16.82-23.02 2.53-.45 5.09-.37 7.67-.37zm83.78 208.38c-.51-10.17 8.21-18.83 19.53-19.31 11.31-.49 20.94 7.4 21.45 17.57l8.7 160.62c.51 10.18-8.22 18.84-19.53 19.32-11.32.48-20.94-7.4-21.46-17.57l-8.69-160.63zm201.7-1.74c.51-10.17 10.14-18.06 21.45-17.57 11.32.48 20.04 9.14 19.53 19.31l-8.66 160.63c-.52 10.17-10.14 18.05-21.46 17.57-11.31-.48-20.04-9.14-19.53-19.32l8.67-160.62zm-102.94.87c0-10.23 9.23-18.53 20.58-18.53 11.34 0 20.58 8.3 20.58 18.53v160.63c0 10.23-9.24 18.53-20.58 18.53-11.35 0-20.58-8.3-20.58-18.53V245.66z"/>
                      </svg>
                    </div>
                    <button
                        onClick={() => setShowPickApplet(!showPickApplet)}
                        className="w-5 h-5 flex items-center justify-center border border-gray-400 cursor-pointer"
                        style={{background:'#b2c4ff', lineHeight: '1', borderRadius: 0, fontWeight: 'bold', fontSize: '18px'}}
                        title="Agregar producto"
                    >
                        +
                    </button>
                </div>
            </div>

            {/* Tabla de productos */}
            <div className="overflow-x-auto mb-4 max-h-72" style={{overflowY:'auto'}}>
                <table className="w-full border border-gray-400 text-xs border-collapse">
                    <thead>
                        <tr className="" style={{background:'#fff'}}>
                            <th className="border border-gray-400 px-2 py-1 text-left">SKU</th>
                            <th className="border border-gray-400 px-2 py-1 text-left">Nombre</th>
                            <th className="border border-gray-400 px-2 py-1 text-left">Marca</th>
                            <th className="border border-gray-400 px-2 py-1 text-center">Cantidad</th>
                            <th className="border border-gray-400 px-2 py-1 text-right">Precio neto</th>
                            <th className="border border-gray-400 px-2 py-1 text-right">Precio + Iva</th>
                            <th className="border border-gray-400 px-2 py-1 text-right">Calculado</th>
                            <th className="border border-gray-400 px-2 py-1 text-center">Ancho mm</th>
                            <th className="border border-gray-400 px-2 py-1 text-center">Alto mm</th>
                            <th className="border border-gray-400 px-2 py-1 text-center">Largo mm</th>
                            <th className="border border-gray-400 px-2 py-1 text-center">KG</th>
                            <th className="border border-gray-400 px-2 py-1 text-right">Valor despacho</th>
                            <th className="border border-gray-400 px-2 py-1 text-right">Descuento %</th>
                            <th className="border border-gray-400 px-2 py-1 text-right">Mejor Precio</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableData.map((row, idx) => (
                            <tr key={row.id || row.sku || idx} className="" style={{background: '#fff2e8'}}>
                                <td className="border border-gray-300 px-2 py-1">{row.sku}</td>
                                <td className="border border-gray-300 px-2 py-1">{row.nombre || ''}</td>
                                <td className="border border-gray-300 px-2 py-1">{row.marca || ''}</td>
                                <td className="border border-gray-300 px-2 py-1 text-center">{row.cantidad}</td>
                                <td className="border border-gray-300 px-2 py-1 text-right">{formatCurrency(row.precioNeto || 0)}</td>
                                <td className="border border-gray-300 px-2 py-1 text-right">{formatCurrency(row.precioIVA || 0)}</td>
                                <td className="border border-gray-300 px-2 py-1 text-right">{formatCurrency(row.calculado)}</td>
                                <td className="border border-gray-300 px-2 py-1 text-center">{row.anchoMm || 0}</td>
                                <td className="border border-gray-300 px-2 py-1 text-center">{row.altoMm || 0}</td>
                                <td className="border border-gray-300 px-2 py-1 text-center">{row.largoMm || 0}</td>
                                <td className="border border-gray-300 px-2 py-1 text-center">{formatDecimal(row.pesoKg || 0)}</td>
                                <td className="border border-gray-300 px-2 py-1 text-right">{formatCurrency(row.valorDespacho)}</td>
                                <td className="border border-gray-300 px-2 py-1 text-right">{row.descuento > 0 ? `${((row.descuento / row.calculado) * 100).toFixed(1)}%` : '0%'}</td>
                                <td className="border border-gray-300 px-2 py-1 text-right">{formatCurrency(row.mejorPrecio)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pick Applet y Subtotal debajo de la tabla */}
            <div className="flex flex-row gap-4 items-start mt-4">
                {/* Pick Applet - IZQUIERDA */}
                <div className="flex-1 flex justify-start">
                {showPickApplet && (
                    <div className="border border-gray-400 bg-white p-2 min-w-[320px] max-w-xs" style={{boxShadow:'2px 2px 8px #ddd'}}>
                        <div className="flex items-center mb-2 gap-2">
                            <select
                                value={searchType}
                                onChange={e => setSearchType(e.target.value as 'sku' | 'nombre')}
                                className="border border-gray-400 px-1 py-1 text-xs bg-white cursor-pointer transition-colors hover:bg-gray-100"
                            >
                                <option value="sku">SKU</option>
                                <option value="nombre">Nombre</option>
                            </select>
                            <input
                                type="text"
                                placeholder={searchType === 'sku' ? "Buscar por SKU..." : "Buscar por nombre..."}
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="border border-gray-400 px-2 py-1 w-full text-xs"
                            />
                            <button
                                onClick={() => setShowPickApplet(false)}
                                className="border border-gray-400 bg-gray-200 hover:bg-gray-300 text-black font-bold px-2 py-1 rounded text-xs cursor-pointer"
                                title="Cerrar"
                            >✕
                            </button>
                        </div>
                        <table className="w-full border border-gray-300 text-xs">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="border border-gray-300 px-1 py-1">SKU</th>
                                    <th className="border border-gray-300 px-1 py-1">Nombre</th>
                                    <th className="border border-gray-300 px-1 py-1">Precio Neto</th>
                                    <th className="border border-gray-300 px-1 py-1">Precio + Iva</th>
                                    <th className="border border-gray-300 px-1 py-1">Agregar</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProducts.length === 0 ? (
                                    <tr><td colSpan={5} className="text-center text-gray-500 py-2">Sin resultados</td></tr>
                                ) : (
                                    filteredProducts.map(product => (
                                        <tr key={product.sku} className="hover:bg-blue-50 cursor-pointer">
                                            <td className="border border-gray-300 px-1 py-1 font-mono">{product.sku}</td>
                                            <td className="border border-gray-300 px-1 py-1">{product.nombre}</td>
                                            <td className="border border-gray-300 px-1 py-1 text-right">{formatCurrency(product.precioNeto)}</td>
                                            <td className="border border-gray-300 px-1 py-1 text-right">{formatCurrency(product.precioIVA)}</td>
                                            <td className="border border-gray-300 px-1 py-1 text-center">
                                                <button
                                                    className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs"
                                                    disabled={!despachoConfirmado}
                                                    title={despachoConfirmado ? 'Agregar a cotización' : 'Confirma despacho primero'}
                                                    onClick={() => {
                                                        setSelectedProducts(prev => {
                                                            const idx = prev.findIndex(p => p.sku === product.sku)
                                                            if (idx !== -1) {
                                                                // Si ya existe, suma cantidad
                                                                const updated = [...prev]
                                                                updated[idx] = {
                                                                    ...updated[idx],
                                                                    cantidad: (updated[idx].cantidad || 1) + 1
                                                                }
                                                                return updated
                                                            } else {
                                                                return [...prev, { ...product, cantidad: 1 }]
                                                            }
                                                        })
                                                    }}
                                                >Agregar</button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                        {!despachoConfirmado && <div className="text-xs text-orange-600 mt-2">Debes confirmar despacho antes de agregar productos.</div>}
                    </div>
                )}
                </div>
                {/* Espacio central vacío para separar */}
                <div className="flex-1"></div>
                {/* Panel de totales y botones - DERECHA */}
                <div className="w-[380px] flex flex-col items-end">
                    <div className="flex flex-row w-full gap-2 items-stretch">
                        <div className="bg-[#ffe9d2] border border-gray-400 p-3 mb-0 w-[210px] flex flex-col justify-between">
                            <div>
                                <div className="flex justify-between items-center py-1">
                                    <span className="text-xs">Sub-total productos</span>
                                    <span className="text-xs font-bold">{formatCurrency(quotation.totalProductosNeto)}</span>
                                </div>
                                <div className="flex justify-between items-center py-1">
                                    <span className="text-xs">IVA</span>
                                    <span className="text-xs font-bold">{formatCurrency(quotation.totalProductosIVA - quotation.totalProductosNeto)}</span>
                                </div>
                                <div className="flex justify-between items-center py-1">
                                    <span className="text-xs">Total despacho</span>
                                    <span className="text-xs font-bold">{formatCurrency(quotation.totalDespacho)}</span>
                                </div>
                                <div className="flex justify-between items-center py-1">
                                    <span className="text-xs">Descuento</span>
                                    <span className="text-xs font-bold">{formatCurrency(quotation.totalDescuento)}</span>
                                </div>
                                <hr className="my-2 border-gray-300" />
                                <div className="flex justify-between items-center py-1">
                                    <span className="text-sm font-bold">Total final</span>
                                    <span className="text-base font-bold">{formatCurrency(quotation.totalCotizacion)}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 flex flex-col justify-between">
                            <div className="bg-[#ffe9d2] border border-gray-400 flex flex-col gap-2 p-5 h-full justify-between" style={{minHeight: '100%'}}>
                                <div className="flex gap-2 w-full mb-2">
                                    <button className="flex-1 bg-white text-black py-2 text-xs font-bold shadow-md cursor-pointer transition-colors hover:bg-gray-100 rounded-md" style={{marginRight: '8px'}}>
                                        Obtener PDF
                                    </button>
                                    <button className="flex-1 bg-white text-black py-2 text-xs font-bold shadow-md cursor-pointer transition-colors hover:bg-gray-100 rounded-md" style={{marginLeft: '8px'}}
                                        disabled={selectedGrouped.length === 0 || !productosConfirmados}
                                        onClick={async () => {
                                        setSaveError(null)
                                        setSaveSuccess(null)
                                        setIsSaving(true)
                                        try {
                                            // Si la cotización existe, PATCH; si no, POST
                                            if (quotation) {
                                                await api.patch(`/cotizaciones/${quotation.id}`, { productos: selectedGrouped })
                                                setSaveSuccess('Cotización actualizada correctamente.')
                                            } else {
                                                await api.post('/cotizaciones', { productos: selectedGrouped })
                                                setSaveSuccess('Cotización creada correctamente.')
                                            }
                                            setSelectedProducts([])
                                            setProductosConfirmados(false)
                                            setTimeout(() => setSaveSuccess(null), 3000)
                                        } catch (e) {
                                            setSaveError('Error al guardar cotización')
                                        } finally {
                                            setIsSaving(false)
                                        }
                                    }}>Guardar</button>
                                </div>
                                <button
                                    className="w-full bg-orange-500 hover:bg-orange-600 text-white border border-gray-400 py-2 text-xs font-bold cursor-pointer rounded-md mb-2"
                                    disabled={!productosConfirmados || selectedGrouped.length === 0}
                                    title={productosConfirmados ? 'Ir a pagar' : 'Confirma productos para habilitar pago'}
                                    style={{marginBottom: '10px'}}
                                    onClick={async () => {
                                        setPaySuccess(null)
                                        if (!productosConfirmados || selectedGrouped.length === 0) return
                                        setPaySuccess('¡Pago realizado con éxito!')
                                        setTimeout(() => setPaySuccess(null), 3000)
                                    }}
                                >PAGAR</button>
                                <button
                                    className="w-full bg-green-500 hover:bg-green-600 text-white border border-gray-400 py-2 text-xs font-bold cursor-pointer rounded-md mb-2"
                                    disabled={selectedGrouped.length === 0 || productosConfirmados}
                                    onClick={() => {
                                        setProductosConfirmados(true)
                                        setSaveSuccess('Productos confirmados. Ahora puedes guardar o pagar.')
                                        setTimeout(() => setSaveSuccess(null), 2000)
                                    }}
                                    style={{marginBottom: '10px'}}
                                >Confirmar productos</button>
                                <button
                                    className="w-full bg-blue-500 hover:bg-blue-600 text-white border border-gray-400 py-2 text-xs font-bold cursor-pointer rounded-md"
                                    onClick={() => {
                                        setDespachoConfirmado(true)
                                        setSaveSuccess('Despacho confirmado. Ahora puedes agregar productos.')
                                        setTimeout(() => setSaveSuccess(null), 2000)
                                    }}
                                    disabled={despachoConfirmado}
                                >Confirmar despacho</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default QuotationTable
