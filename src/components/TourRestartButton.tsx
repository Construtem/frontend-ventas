'use client'
import React from 'react'

interface TourRestartButtonProps {
    onRestart: () => void
    className?: string
}

const TourRestartButton: React.FC<TourRestartButtonProps> = ({ 
    onRestart, 
    className = '' 
}) => {
    const handleRestart = () => {
        // Limpiar el localStorage para que el tour se pueda volver a mostrar
        localStorage.removeItem('ftu-tour-completed')
        onRestart()
    }

    return (
        <button
            onClick={handleRestart}
            className={`inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors ${className}`}
            title="Reiniciar tour de ayuda"
        >
            <svg 
                className="w-4 h-4 mr-2" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
            >
                <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
                />
            </svg>
            Reiniciar Tour
        </button>
    )
}

export default TourRestartButton
