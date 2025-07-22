'use client'
import React, { useState, useEffect } from 'react'
import guardarIMG from '../styles/images/guardar.png'
import pagoIMG from '../styles/images/pago.png'

interface TourStep {
    id: string
    title: string
    description: string
    targetSelector: string
    position: 'top' | 'bottom' | 'left' | 'right'
}

interface FTUTourProps {
    onComplete?: () => void
    autoStart?: boolean
}

const FTUTour: React.FC<FTUTourProps> = ({ onComplete, autoStart = false }) => {
    const [isActive, setIsActive] = useState(false)
    const [currentStep, setCurrentStep] = useState(0)
    const [highlightedElement, setHighlightedElement] = useState<HTMLElement | null>(null)

    // Definir los pasos del tour
    const tourSteps: TourStep[] = [
        {
            id: 'step-1-store',
            title: 'Paso 1: Selecciona una tienda',
            description: 'Primero debes seleccionar la tienda donde trabajarás. Esto es necesario para acceder al inventario de productos.',
            targetSelector: '[data-tour="store-selector"]',
            position: 'bottom'
        },
        {
            id: 'step-2-client',
            title: 'Paso 2: Selecciona un cliente',
            description: 'Busca y selecciona un cliente existente por RUT o nombre, o crea uno nuevo si es necesario.',
            targetSelector: '[data-tour="client-search"]',
            position: 'bottom'
        },
        {
            id: 'step-3-quotation',
            title: 'Paso 3: Gestiona cotizaciones',
            description: 'Una vez seleccionado el cliente, podrás ver sus cotizaciones existentes o crear una nueva.',
            targetSelector: '[data-tour="quotation-section"]',
            position: 'top'
        },
        {
            id: 'step-4-products',
            title: 'Paso 4: Agrega productos',
            description: 'Agrega productos a tu cotización haciendo clic en "Agregar Producto".',
            targetSelector: '[data-tour="add-product-button"]',
            position: 'top'
        },
        {
            id: 'step-5-save',
            title: 'Paso 5: Guarda la cotización',
            description: 'Una vez que hayas agregado productos, haz clic en "Guardar" para guardar tu cotización.',
            targetSelector: '[data-tour="save-button"]',
            position: 'top'
        },
        {
            id: 'step-6-payment',
            title: 'Paso 6: Proceder al pago',
            description: '¡Perfecto! Ahora puedes proceder al pago haciendo clic en el botón "Pagar" para finalizar la venta.',
            targetSelector: '[data-tour="payment-button"]',
            position: 'top'
        }
    ]

    // Iniciar tour automáticamente si es la primera visita
    useEffect(() => {
        const hasSeenTour = localStorage.getItem('ftu-tour-completed')
        if (autoStart && !hasSeenTour && !isActive) {
            startTour()
        }
    }, [autoStart])

    const startTour = () => {
        setIsActive(true)
        setCurrentStep(0)
        scrollToStep(0)
    }

    const nextStep = () => {
        if (currentStep < tourSteps.length - 1) {
            const nextStepIndex = currentStep + 1
            setCurrentStep(nextStepIndex)
            scrollToStep(nextStepIndex)
        } else {
            completeTour()
        }
    }

    const prevStep = () => {
        if (currentStep > 0) {
            const prevStepIndex = currentStep - 1
            setCurrentStep(prevStepIndex)
            scrollToStep(prevStepIndex)
        }
    }

    const skipTour = () => {
        // Limpiar highlight antes de cerrar
        if (highlightedElement) {
            highlightedElement.style.border = ''
            highlightedElement.style.boxShadow = ''
            highlightedElement.style.outline = ''
            highlightedElement.style.transition = ''
        }

        completeTour()
    }

    const completeTour = () => {
        // Limpiar highlight antes de cerrar
        if (highlightedElement) {
            highlightedElement.style.border = ''
            highlightedElement.style.boxShadow = ''
            highlightedElement.style.outline = ''
            highlightedElement.style.transition = ''
        }

        setIsActive(false)
        setHighlightedElement(null)
        localStorage.setItem('ftu-tour-completed', 'true')
        if (onComplete) {
            onComplete()
        }
    }

    const scrollToStep = (stepIndex: number) => {
        const step = tourSteps[stepIndex]
        const element = document.querySelector(step.targetSelector) as HTMLElement

        if (element) {
            // Primero limpiar cualquier highlight anterior
            setHighlightedElement(null)

            // Hacer scroll para todos los pasos para asegurar visibilidad
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
                inline: 'center'
            })

            // Esperar a que termine el scroll antes de mostrar el highlight
            setTimeout(() => {
                setHighlightedElement(element)
            }, 600) // 600ms para asegurar que el scroll termine completamente
        }
    }

    const goToStep = (stepIndex: number) => {
        setCurrentStep(stepIndex)
        scrollToStep(stepIndex)
    }

    // Crear highlight integrado en el elemento
    useEffect(() => {
        if (!isActive || !highlightedElement) return

        // Aplicar el highlight directamente al elemento
        const applyHighlight = () => {
            // Guardar el estilo original
            const originalBorder = highlightedElement.style.border
            const originalBoxShadow = highlightedElement.style.boxShadow
            const originalOutline = highlightedElement.style.outline
            const originalTransition = highlightedElement.style.transition

            // Aplicar el highlight como borde y sombra del elemento
            highlightedElement.style.transition = 'all 0.3s ease'
            highlightedElement.style.border = '4px solid #f59e0b'
            highlightedElement.style.boxShadow = '0 0 0 4px rgba(245, 158, 11, 0.4), 0 8px 32px rgba(245, 158, 11, 0.2)'
            highlightedElement.style.outline = 'none'

            // Posicionar el modal después de aplicar el highlight
            const modal = document.getElementById('tour-modal')
            if (modal) {
                const rect = highlightedElement.getBoundingClientRect()
                const modalWidth = 400
                const modalHeight = 500
                const viewportWidth = window.innerWidth
                const viewportHeight = window.innerHeight
                const scrollTop = window.pageYOffset
                const scrollLeft = window.pageXOffset
                const spacing = 20

                let modalTop = rect.top + scrollTop
                let modalLeft = rect.right + spacing

                // 1. Intentar posicionar a la derecha
                if (modalLeft + modalWidth > viewportWidth + scrollLeft) {
                    // 2. Si no cabe a la derecha, intentar a la izquierda
                    modalLeft = rect.left - modalWidth - spacing

                    if (modalLeft < scrollLeft) {
                        // 3. Si no cabe a ningún lado, posicionar arriba o abajo centrado
                        modalLeft = Math.max(scrollLeft + 10,
                            Math.min(scrollLeft + viewportWidth - modalWidth - 10,
                                rect.left + rect.width / 2 - modalWidth / 2))

                        // Decidir si va arriba o abajo
                        if (rect.top + scrollTop - modalHeight - spacing > scrollTop) {
                            // Colocar arriba
                            modalTop = rect.top + scrollTop - modalHeight - spacing
                        } else {
                            // Colocar abajo
                            modalTop = rect.bottom + scrollTop + spacing
                        }
                    }
                }

                // Ajustar verticalmente para que no se salga de la vista
                if (modalTop + modalHeight > viewportHeight + scrollTop) {
                    modalTop = Math.max(scrollTop + 20, viewportHeight + scrollTop - modalHeight - 20)
                }

                // Asegurar que no se vaya muy arriba
                if (modalTop < scrollTop + 20) {
                    modalTop = scrollTop + 20
                }

                modal.style.position = 'absolute'
                modal.style.top = `${modalTop}px`
                modal.style.left = `${modalLeft}px`
                modal.style.transform = 'none'
                modal.style.zIndex = '60'
            }

            // Función de limpieza para restaurar estilos originales
            return () => {
                highlightedElement.style.border = originalBorder
                highlightedElement.style.boxShadow = originalBoxShadow
                highlightedElement.style.outline = originalOutline
                highlightedElement.style.transition = originalTransition
            }
        }

        const cleanup = applyHighlight()

        // Observar cambios en el elemento para reposicionar el modal
        const resizeObserver = new ResizeObserver(() => {
            const modal = document.getElementById('tour-modal')
            if (modal) {
                // Reposicionar solo el modal, no cambiar el highlight
                const rect = highlightedElement.getBoundingClientRect()
                const modalWidth = 400
                const modalHeight = 500
                const viewportWidth = window.innerWidth
                const viewportHeight = window.innerHeight
                const scrollTop = window.pageYOffset
                const scrollLeft = window.pageXOffset
                const spacing = 20

                let modalTop = rect.top + scrollTop
                let modalLeft = rect.right + spacing

                if (modalLeft + modalWidth > viewportWidth + scrollLeft) {
                    modalLeft = rect.left - modalWidth - spacing

                    if (modalLeft < scrollLeft) {
                        modalLeft = Math.max(scrollLeft + 10,
                            Math.min(scrollLeft + viewportWidth - modalWidth - 10,
                                rect.left + rect.width / 2 - modalWidth / 2))

                        if (rect.top + scrollTop - modalHeight - spacing > scrollTop) {
                            modalTop = rect.top + scrollTop - modalHeight - spacing
                        } else {
                            modalTop = rect.bottom + scrollTop + spacing
                        }
                    }
                }

                if (modalTop + modalHeight > viewportHeight + scrollTop) {
                    modalTop = Math.max(scrollTop + 20, viewportHeight + scrollTop - modalHeight - 20)
                }

                if (modalTop < scrollTop + 20) {
                    modalTop = scrollTop + 20
                }

                modal.style.top = `${modalTop}px`
                modal.style.left = `${modalLeft}px`
            }
        })

        resizeObserver.observe(highlightedElement)

        return () => {
            if (cleanup) cleanup()
            resizeObserver.disconnect()
        }
    }, [highlightedElement, isActive])

    if (!isActive) {
        return (
            <button
                onClick={startTour}
                className="fixed bottom-4 right-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-lg z-50 transition-colors"
                title="Iniciar tour de ayuda"
            >
                Paso a Paso
            </button>
        )
    }

    const currentStepData = tourSteps[currentStep]

    return (
        <>
            {/* Modal del tour */}
            <div
                id="tour-modal"
                className="fixed z-60 p-4"
                style={{ width: '400px' }}
            >
                <div className="bg-white rounded-xl shadow-2xl w-full transform transition-all">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                                {currentStepData.title}
                            </h3>
                            <p className="text-sm text-gray-500">
                                Paso {currentStep + 1} de {tourSteps.length}
                            </p>
                        </div>
                        <button
                            onClick={skipTour}
                            className="text-gray-400 hover:text-gray-600 text-xl"
                            title="Saltar tour"
                        >
                            ×
                        </button>
                    </div>

                    {/* Body */}
                    <div className="p-6">
                        <p className="text-gray-700 mb-4">
                            {currentStepData.description}
                        </p>

                        {/* Imagen para los últimos dos pasos */}
                        {currentStep === 4 && (
                            <div className="mb-4">
                                <img
                                    src={guardarIMG.src}
                                    alt="Guardar cotización"
                                    className="w-full h-32 object-contain rounded-lg bg-gray-50 p-2"
                                />
                            </div>
                        )}
                        {currentStep === 5 && (
                            <div className="mb-4">
                                <img
                                    src={pagoIMG.src}
                                    alt="Proceder al pago"
                                    className="w-full h-32 object-contain rounded-lg bg-gray-50 p-2"
                                />
                            </div>
                        )}

                        {/* Progress bar */}
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                            <div
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${((currentStep + 1) / tourSteps.length) * 100}%` }}
                            />
                        </div>

                        {/* Steps indicator */}
                        <div className="flex justify-center space-x-2 mb-6">
                            {tourSteps.map((step, index) => {
                                let stepClassName = 'w-3 h-3 rounded-full transition-colors '

                                if (index === currentStep) {
                                    stepClassName += 'bg-blue-600'
                                } else {
                                    stepClassName += 'bg-gray-400 hover:bg-gray-500 cursor-pointer'
                                }

                                return (
                                    <button
                                        key={step.id}
                                        onClick={() => goToStep(index)}
                                        className={stepClassName}
                                        title={step.title}
                                    />
                                )
                            })}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between p-6 border-t bg-gray-50 rounded-b-xl">
                        <button
                            onClick={prevStep}
                            disabled={currentStep === 0}
                            className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                        >
                            Anterior
                        </button>

                        <div className="flex space-x-3">
                            <button
                                onClick={skipTour}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                            >
                                Saltar
                            </button>

                            {currentStep === tourSteps.length - 1 ? (
                                <button
                                    onClick={completeTour}
                                    className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                                >
                                    Finalizar
                                </button>
                            ) : (
                                <button
                                    onClick={nextStep}
                                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                                >
                                    Siguiente
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default FTUTour