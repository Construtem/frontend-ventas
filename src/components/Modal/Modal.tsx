'use client'
import { ReactNode } from 'react'
import ReactDOM from 'react-dom'

interface ModalProps {
    isOpen: boolean
    onClose: () => void
    children: ReactNode
}

export default function Modal({ isOpen, onClose, children }: ModalProps) {
    if (!isOpen) return null
    return ReactDOM.createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50"
                onClick={onClose}
            />
            {/* Contenido */}
            <div className="relative bg-white rounded-lg shadow-lg max-w-[90vw] max-h-[90vh] overflow-auto">
                {children}
            </div>
        </div>,
        document.body
    )
}
